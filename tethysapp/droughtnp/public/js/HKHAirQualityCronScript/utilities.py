import gdal
import numpy as np
from osgeo import osr
import netCDF4 as nc
import datetime as dt
import xarray as xr
import config
def SendEmail(subject,EmailBody):
    import smtplib

    TO = ["sishir.dahal@icimod.org"]
    # TO = ["sishir.dahal@icimod.org", "suman.sanjel@icimod.org"]
    SUBJECT = subject
    TEXT = EmailBody

    # Gmail Sign In
    gmail_sender = 'sishir.awi2021@gmail.com'
    gmail_passwd = 'Atmosphere*2021!'

    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.ehlo()
    server.starttls()
    server.login(gmail_sender, gmail_passwd)

    BODY = '\r\n'.join(['To: %s' % ", ".join(TO), 'From: %s' % gmail_sender, 'Subject: %s' % SUBJECT, '', TEXT])

    try:
        server.sendmail(gmail_sender, TO, BODY)
        print('email sent')
    except:
        print('error sending mail')
        server.quit()


def SendEmailWithReciver(subject,EmailBody,reciver):
    import smtplib
    TO=[]
    if('suman'in reciver):
        TO.append("suman.sanjel@icimod.org")
    if('sishir' in reciver):
        TO.append("sishir.dahal@icimod.org")
    if('bhupesh' in reciver):
        TO.append("bhupesh.adhikary@icimod.org")
    if(len(TO)==0):
        TO = ["sishir.dahal@icimod.org"]
    SUBJECT = subject
    TEXT = EmailBody

    # Gmail Sign In
    gmail_sender = 'sishir.awi2021@gmail.com'
    gmail_passwd = 'Atmosphere*2021!'

    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.ehlo()
    server.starttls()
    server.login(gmail_sender, gmail_passwd)

    BODY = '\r\n'.join(['To: %s' % ", ".join(TO), 'From: %s' % gmail_sender, 'Subject: %s' % SUBJECT, '', TEXT])

    try:
        server.sendmail(gmail_sender, TO, BODY)
        print('email sent')
    except:
        print('error sending mail')
        server.quit()

def DirectoryUpdatedEmail(subject,EmailBody):
    import smtplib

    #TO = ["suman.sanjel@icimod.org","sishir.dahal@icimod.org","bhupesh.adhikary@icimod.org"]
    #TO = ["suman.sanjel@icimod.org","sishir.dahal@icimod.org"]
    TO = ["sishir.dahal@icimod.org"]
    SUBJECT = subject
    TEXT = EmailBody

    # Gmail Sign In
    gmail_sender = 'sishir.awi2021@gmail.com'
    gmail_passwd = 'Atmosphere*2021!'

    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.ehlo()
    server.starttls()
    server.login(gmail_sender, gmail_passwd)

    BODY = '\r\n'.join(['To: %s' % ", ".join(TO), 'From: %s' % gmail_sender, 'Subject: %s' % SUBJECT, '', TEXT])

    try:
        server.sendmail(gmail_sender, TO, BODY)
        print('email sent')
    except:
        print('error sending mail')
        server.quit()


def HDFToNC(HDFCompletePath,NetCdfCompletePath,parameterName,Date):
    '''

    Args:
        HDFCompletePath:
        NetCdfCompletePath:
        parameterName:
        Date:

    Returns:

    '''

import os

import requests


def upload_tiff(File):
    geoserver_rest_url = 'http://110.34.30.197:8080/geoserver/rest/'
    workspace = 'HKHAirQualityWatch'
    uname = 'icimod'
    pwd = '1cim0d'
    headers = {'Content-type': 'image/tiff'}
    print('ok')
    if File.endswith('.tiff'):
        data = open(File, 'rb').read()  # Read the file
        store_name = str(File.split('/')[-1].split('.')[0])  # Creating the store name dynamically
        print(store_name)
        request_url = '{0}workspaces/{1}/coveragestores/{2}/file.geotiff'.format(geoserver_rest_url, workspace, store_name)  # Creating the rest url
        print("request_url")
        print(request_url)
        requests.put(request_url, verify=False, headers=headers, data=data, auth=(uname, pwd))  # Creating the resource on the geoserver
#Convert tiff to netCDF in own location
def convert_RGB_TIFF_To_NC(tiffCompletePath,completeNCFilePath,dates):
    '''
    Description: RGB tif to NetCDF
    Args:
        tiffCompletePath: Absolute path
        completeNCFilePath: Absolute path
        dates: date in the format of  (dt.datetime(2020,4,9,0)) i.e. datetime Object

    Returns: Void

    '''
    tiffData=gdal.Open(tiffCompletePath)
    prj=tiffData.GetProjection()

    width = tiffData.RasterXSize
    height = tiffData.RasterYSize
    gt = tiffData.GetGeoTransform()
    minx = gt[0]+gt[1]/2
    miny = gt[3] + width*gt[4] + height*gt[5]
    maxx = gt[0] + width*gt[1] + height*gt[2]
    maxy = gt[3]-abs(gt[5])/2
    longitude=[]
    latitude=[]
    for i in np.arange(0, width,1):
        longitude.append(minx+i*gt[1])


    for i in np.arange(0, height,1):
        latitude.append(maxy+i*gt[5])


    ds=nc.Dataset(completeNCFilePath, 'w', format='NETCDF4')
    ds.title='Terra & Aqua MAIAC Land Aerosol Optical Depth (550nm) '
    time=ds.createDimension('time', None)
    lon=ds.createDimension('longitude',width)
    lat=ds.createDimension('latitude',height)


    times=ds.createVariable('time', 'f4', ('time',))
    times.units='hours since 1900-01-01 00:00'
    times.calendar='proleptic_gregorian'
    calendarType='standard'
    times.axis='T'
    lats=ds.createVariable('latitude', 'f4', ('latitude',))
    lats.units='degree_north'
    lats.axis='Y'
    lons=ds.createVariable('longitude', 'f4', ('longitude',))
    lons.units='degree_east'
    lons.axis='X'
    lats[:]=latitude
    lons[:]=longitude


    dateNum=nc.date2num([dates], times.units, calendarType)
    times[:] = dateNum


    red=ds.createVariable('red', 'f4', ('time','latitude','longitude'))
    red.units='1'
    band1=tiffData.GetRasterBand(1)
    RedBand=band1.ReadAsArray()
    RedBand = RedBand.astype('float64')
    red[0,:,:]=RedBand

    green=ds.createVariable('green', 'f4', ('time','latitude','longitude'))
    green.units='1'
    band2=tiffData.GetRasterBand(2)
    GreenBand=band2.ReadAsArray()
    GreenBand = GreenBand.astype('float64')
    green[0,:,:]=GreenBand

    blue=ds.createVariable('blue', 'f4', ('time','latitude','longitude'))
    blue.units='1'
    band3=tiffData.GetRasterBand(3)
    BlueBand=band3.ReadAsArray()
    BlueBand = BlueBand.astype('float64')
    blue[0,:,:]=BlueBand

    ds.close()

def create_if_not_exists(path):

    if (not os.path.exists(path)):

        os.makedirs(path)

    return path

def combineGEOS(completePath):

    dataOut = os.path.join(config.BaseHKHFormatDir,'RecentAndArchive','PM','GEOS-PM2p5')
    create_if_not_exists(dataOut)
    fileName = completePath.split('/')[-1]
    date = fileName[-19:-3]
    savingFileFullPath = os.path.join(dataOut,  'Geos-PM2p5-' + date + '.nc')
    if os.path.isfile(savingFileFullPath):
        os.remove(savingFileFullPath)
        os.system('cp ' + completePath + ' ' + savingFileFullPath)
    else:
        os.system('cp ' + completePath + ' ' + savingFileFullPath)

def combineGEOSforecast(completePath,d):
    Out = os.path.join(config.BaseHKHFormatDir,'Forecast','PM','GEOS-PM2p5')
    dataOut = os.path.join(Out, d)
    create_if_not_exists(dataOut)
    # ncmlName = d + ".ncml"
    # ncmlFullPath = os.path.join(dataOut, ncmlName)
    # #Write ncml file
    # file = open(ncmlFullPath, "w")
    # a = d + "/"
    # b ="""<netcdf title="Example of joinNew Grid aggregation using the scan element with a regexp" xmlns="http://www.unidata.ucar.edu/namespaces/netcdf/ncml-2.2">
    #   <aggregation type="joinExisting" dimName="time" timeUnitsChange="true" recheckEvery="1 day">
    #     <scan location="%(date)s" subdirs="true"  suffix=".nc" ncoords="0"/>
    #   </aggregation>
    # </netcdf>"""%{'date': a}
    # file.write(b)
    # file.close()

    fileName = completePath.split('/')[-1]
    date = fileName[-19:-3]
    savingFileFullPath = os.path.join(dataOut,'Geos-PM2p5-'+date+'.nc')
    if os.path.isfile(savingFileFullPath):
        os.remove(savingFileFullPath)
        os.system('cp ' + completePath + ' ' + savingFileFullPath)
    else:
        os.system('cp ' + completePath + ' ' + savingFileFullPath)

def combineTerraAOD(completePath):
    dataOut = os.path.join(config.BaseHKHFormatDir,'RecentAndArchive','PM','TerraModis-AOD')
    create_if_not_exists(dataOut)
    fileName=completePath.split('/')[-1]
    date=fileName[-13:-3]
    savingFileFullPath = os.path.join(dataOut , 'Terra-MODIS-AOD-' + date + '.nc')
    if os.path.isfile(savingFileFullPath):
        os.remove(savingFileFullPath)
        os.system('cp ' + completePath + ' ' + savingFileFullPath)
    else:
        os.system('cp ' + completePath + ' ' + savingFileFullPath)

def combineTerraTrueColor(completePath):
    dataOut = os.path.join(config.BaseHKHFormatDir,'RecentAndArchive','TerraMODIS-TrueColor1km')
    create_if_not_exists(dataOut)
    fileName=completePath.split('/')[-1]
    date=fileName[-13:-3]
    savingFileFullPath = os.path.join(dataOut ,'ModisTerra-TrueColor-' + date + '.nc')
    if os.path.isfile(savingFileFullPath):
        os.remove(savingFileFullPath)
        os.system('cp ' + completePath + ' ' + savingFileFullPath)
    else:
        os.system('cp ' + completePath + ' ' + savingFileFullPath)


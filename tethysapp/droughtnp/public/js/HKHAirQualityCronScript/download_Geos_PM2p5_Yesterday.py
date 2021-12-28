#from netCDF4 import Dataset
import netCDF4 as nc
import numpy as np
import datetime
import requests
import os
import traceback
import utilities
from config import BaseDateFormatDir

boundingBox=[60, 15, 110, 40]
GeosPrefix='GEOS-CF.v01.rpl.aqc_tavg_1hr_g1440x721_v1.'
NCCS_das='https://portal.nccs.nasa.gov/datashare/gmao/geos-cf/v1/das/'
# Download Data from GEOS Chem Site
#url='https://portal.nccs.nasa.gov/datashare/gmao/geos-cf/v1/das/Y2020/M04/D15/GEOS-CF.v01.rpl.aqc_tavg_1hr_g1440x721_v1.20200415_0030z.nc4''

def downloadGeosYesterday(date):
    yesterday = date - datetime.timedelta(days=1)
    selectedTime = datetime.time(6, 30, 0)
    selectedDate = datetime.datetime(yesterday.year, yesterday.month, yesterday.day, selectedTime.hour,
                                     selectedTime.minute, selectedTime.second)

    DatePath = os.path.join(BaseDateFormatDir, selectedDate.strftime("%Y%m%d"))
    recentPath= os.path.join(DatePath,"Recent")
    PMPath= os.path.join(recentPath,"PM")
    pmOutputPath = os.path.join(PMPath,"GEOS-PM2p5")
    pmOutputFileName = 'Geos-PM2p5-' + selectedDate.strftime('%Y-%m-%d-%H-%M') + '.nc'
    GeosFileName = GeosPrefix + selectedDate.strftime('%Y%m%d_%H%Mz') + '.nc4'

    pmOutputFullPath= os.path.join(pmOutputPath,pmOutputFileName)


    url = NCCS_das + selectedDate.strftime('Y%Y/M%m/D%d/') + GeosFileName
    print(url)
    print('\n*************Downloading by truning streaming=True to check download time********************************************')
    start = datetime.datetime.now()
    print("\nStarted Creating Requests object at:  " + start.strftime("%Y-%m-%d %I:%M:%S %p"))
    emailFlag=True
    try:
        with requests.Session() as s:
            #response=requests.get(url)
            response=s.get(url)
            utilities.create_if_not_exists(DatePath)
            utilities.create_if_not_exists(recentPath)
            utilities.create_if_not_exists(PMPath)
            GeosPath= os.path.join(PMPath,"GEOS-PM2p5")
            utilities.create_if_not_exists(GeosPath)
            rawDataPath = os.path.join(GeosPath, "RawData")
            utilities.create_if_not_exists(rawDataPath)
            GeosFullPath = os.path.join(rawDataPath, GeosFileName)
            now = datetime.datetime.now()
            print("\nStarted saving  file at:  " + now.strftime("%Y-%m-%d %I:%M:%S %p"))
    except:
        print('Oops! The GMAO server is down')
        if emailFlag:
            utilities.SendEmail("GEOS PM2p5 (Yesterday) download problem", traceback.format_exc())
            emailFlag = False

    eFlag = True
    try:
        file = open((GeosFullPath), "wb")
        file.write(response.content)
        file.close()
        stop = datetime.datetime.now()
        print("\nStopped Saving file at :  " + stop.strftime("%Y-%m-%d %I:%M:%S %p"))
        print("Time Taken: ")
        print(stop-start)

        rawData=nc.Dataset(GeosFullPath, 'r')
        for i in rawData.variables:
            print(i)

        lat=np.array(rawData.variables['lat'][:])
        lon=np.array(rawData.variables['lon'][:])
        filteredLat=lat[(lat>=boundingBox[1])&(lat<=boundingBox[3])]
        filteredLon=lon[(lon>=boundingBox[0])&(lon<=boundingBox[2])]

        minLatIdx=np.where(lat==filteredLat[0])[0][0]
        maxLatIdx=np.where(lat==filteredLat[-1])[0][0]
        minLonIdx=np.where(lon==filteredLon[0])[0][0]
        maxLonIdx=np.where(lon==filteredLon[-1])[0][0]

         # Filter Data for PM2.5 by lat lon and save it to file

        filteredPm2p5=np.array(rawData.variables['PM25_RH35_GCC'][:,:,minLatIdx:(maxLatIdx+1), minLonIdx:(maxLonIdx+1)])[0][0]
        pmDs=nc.Dataset(pmOutputFullPath, 'w', format='NETCDF4')
        pmDs.title='GEOS-CF v01  PM2.5 (1-hour Average)'
        timeDim=pmDs.createDimension('time', None)
        lonDim=pmDs.createDimension('longitude',filteredLon.size)
        latDim=pmDs.createDimension('latitude',filteredLat.size)

        times=pmDs.createVariable('time', 'f4', ('time',))
        times.units='hours since 1900-01-01 00:00'
        times.calendar='proleptic_gregorian'
        calendarType='standard'
        times.axis='T'
        latVar=pmDs.createVariable('latitude', 'f4', ('latitude',))
        latVar.units='degree_north'
        latVar.axis='Y'
        lonVar=pmDs.createVariable('longitude', 'f4', ('longitude',))
        lonVar.units='degree_east'
        lonVar.axis='X'
        latVar[:]=filteredLat
        lonVar[:]=filteredLon


        dateNum=nc.date2num(selectedDate, times.units, calendarType)
        times[:] = dateNum

        pmVar=pmDs.createVariable('PM2p5', 'f4', ('time','latitude','longitude'))
        pmVar.units=rawData.variables['PM25_RH35_GCC'].units
        pmVar.long_name=rawData.variables['PM25_RH35_GCC'].long_name
        pmVar.missing_value=np.nan
        pmVar.scale_factor=rawData.variables['PM25_RH35_GCC'].scale_factor
        pmVar.add_offset=rawData.variables['PM25_RH35_GCC'].add_offset

        print("Size of  variable before adding value",pmVar.shape)
        filteredPm2p5=filteredPm2p5.astype('float64')
        filteredPm2p5[filteredPm2p5 == rawData.variables['PM25_RH35_GCC'].missing_value] = np.nan
        pmVar[0,:,:]=filteredPm2p5
        print("Size of variable after adding value",pmVar.shape)
        pmDs.close()
        print("The file was saved to : "+ pmOutputPath+pmOutputFileName)
        print("Done !!")
        utilities.combineGEOS(pmOutputFullPath)
        print("Copying file to HKHAirQualityWatch directory")
    except:
        print('The downloaded file is corrupted')


def init(date):
    if date:
        downloadGeosYesterday(date)
    else:
        now=datetime.datetime.now()
        downloadGeosYesterday(now)
    # startDate = datetime.datetime(2020, 11, 27)
    # endDate = datetime.datetime(2020, 11, 29)
    # delta = datetime.timedelta(days=1)
    # while startDate <= endDate:
    #     downloadGeosYesterday(startDate)
    #     startDate += delta

if __name__=="__main__":
    init(False)

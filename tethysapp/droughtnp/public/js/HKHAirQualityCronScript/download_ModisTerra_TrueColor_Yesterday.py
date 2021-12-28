import requests
import datetime
import urllib
import os
import traceback
import utilities
from config import BaseDateFormatDir

def downloadTrueColorImage(date, boundingBox=[60, 15, 110, 40], imageFormat='image/tiff',imageSize=[5689, 2844], autoscaleFlag='TRUE'):

    selectedDate = date - datetime.timedelta(days=1)
    DatePath = os.path.join(BaseDateFormatDir, selectedDate.strftime("%Y%m%d"))
    RecentPath= os.path.join(DatePath,"Recent")
    TrueColor_Dir = os.path.join(RecentPath, "TerraModis-TrueColor")
    fileName = 'ModisTerra' + '-' + 'TrueColor' + '-' + selectedDate.strftime('%Y-%m-%d') + '.tiff'
    ncfileName = 'ModisTerra' + '-' + 'TrueColor' + '-' + selectedDate.strftime('%Y-%m-%d') + '.nc'

    emailFlag = True
    utilities.create_if_not_exists(RecentPath)
    utilities.create_if_not_exists(TrueColor_Dir)
    selectedP1=boundingBox[1].__str__()+','+boundingBox[0].__str__()
    selectedP2=boundingBox[3].__str__()+','+boundingBox[2].__str__()

    url = 'https://wvs.earthdata.nasa.gov/api/v1/snapshot?REQUEST=GetSnapshot&LAYERS=MODIS_Terra_CorrectedReflectance_TrueColor&CRS=EPSG:4326&TIME='+ selectedDate.strftime('%Y-%m-%d') + '&WRAP=DAY&BBOX=' + selectedP1 + ',' + selectedP2 + '&FORMAT=' + imageFormat + '&WIDTH=' + imageSize[0].__str__() + '&HEIGHT=' + imageSize[1].__str__() + '&AUTOSCALE=' + autoscaleFlag + '&ts=1600881712881'
    print('\n*************Downloading by turning streaming=True********************************************')
    now = datetime.datetime.now()
    print("\nStarted Creating Requests object at:  " + now.strftime("%Y-%m-%d %I:%M:%S %p"))
    eFlag=True
    try:
        with requests.Session() as s:
            print(url)
            #response=requests.get(url)
            response=s.get(url)
            now = datetime.datetime.now()
            print("\nStarted saving  file at:  " + now.strftime("%Y-%m-%d %I:%M:%S %p"))
            fileFullPath=os.path.join(TrueColor_Dir,fileName)
            ncfileFullPath=os.path.join(TrueColor_Dir,ncfileName)
            file = open(fileFullPath, "wb")
            file.write(response.content)
            file.close()
            now = datetime.datetime.now()
            print("\nStopped Saving file at :  " + now.strftime("%Y-%m-%d %I:%M:%S %p"))
            #if eFlag:
                #utilities.SendEmail("Terra MODIS True Color Image downloaded", "Good morning! The file has been downloaded")
                #eFlag = False
            utilities.convert_RGB_TIFF_To_NC(fileFullPath,ncfileFullPath,selectedDate)
            utilities.combineTerraTrueColor(ncfileFullPath)
    except:
        print("error---")
        if emailFlag:
            utilities.SendEmail("Terra MODIS true color image download problem", traceback.format_exc())
            emailFlag = False

def init(date):
    if date:
        downloadTrueColorImage(date)
    else:
        now=datetime.datetime.now()
        downloadTrueColorImage(now)

    # startDate=datetime.datetime(2020,11,8)
    # endDate=datetime.datetime(2020,12,11)
    # delta=datetime.timedelta(days=1)
    # while startDate <= endDate:
    #      downloadTrueColorImage(startDate)
    #      startDate += delta

if __name__=="__main__":
    init(False)


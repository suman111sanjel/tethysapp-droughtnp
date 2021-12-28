import os
import numpy as np
import netCDF4 as nc
from pyhdf import SD
import datetime
import utilities
from config import BaseDateFormatDir

def convertHDFtoNC(date):
    yesterday = date-datetime.timedelta(days=1)
    dateList = [datetime.datetime(yesterday.year, yesterday.month, yesterday.day)]
    DatePath = os.path.join(BaseDateFormatDir, yesterday.strftime("%Y%m%d"))
    recentPath = os.path.join(DatePath, "Recent")
    PMPath = os.path.join(recentPath, "PM")
    aodOutputPath = os.path.join(PMPath, "TerraModis-AOD")
    #create_if_not_exists(DatePath)
    #create_if_not_exists(recentPath)
    #create_if_not_exists(PMPath)
    #create_if_not_exists(aodOutputPath)
    tileFilePath = os.path.join(aodOutputPath,"RawData")
    #create_if_not_exists(tileFilePath)
    ncFileName = 'Terra-MODIS-AOD-' + yesterday.strftime("%Y-%m-%d") + '.nc'

    boundingBox = [60, 15, 110, 40]
    # swathDegree=0.08
    swathDegree = 0.2

    latList = np.arange(boundingBox[1], boundingBox[3], swathDegree)
    lonList = np.arange(boundingBox[0], boundingBox[2], swathDegree)

    try:
        tileFileList = os.listdir(tileFilePath)

        tileStack = np.zeros((1, 4))

        for tileFileIdx in range(0, len(tileFileList) - 1):
            tileFileName = tileFileList[tileFileIdx]
            print(tileFileName)
            tileFullPath= os.path.join(tileFilePath,tileFileName)
            tileCollection = SD.SD(tileFullPath)

            AodHandle = tileCollection.select('AOD_550_Dark_Target_Deep_Blue_Combined').get()
            LatitudeHandle = tileCollection.select('Latitude').get()
            LongitudeHandle = tileCollection.select('Longitude').get()
            QAHandle = tileCollection.select('AOD_550_Dark_Target_Deep_Blue_Combined_QA_Flag').get()

            AodFlat = AodHandle.flatten()
            LongitudeFlat = LongitudeHandle.flatten()
            LatitudeFlat = LatitudeHandle.flatten()
            QAFlat = QAHandle.flatten()

            tileGrided = np.zeros((4, len(LatitudeFlat)))

            tileGrided[0, :] = LongitudeFlat
            tileGrided[1, :] = LatitudeFlat
            tileGrided[2, :] = AodFlat
            tileGrided[3, :] = QAFlat
            tileStack = np.vstack((tileStack, tileGrided.transpose()))

        filteredTileStack = tileStack[(tileStack[:, 0] > boundingBox[0]) & (tileStack[:, 0] < boundingBox[2]) & (
                tileStack[:, 1] > boundingBox[1]) & (tileStack[:, 1] < boundingBox[3]), :]
        filteredTileStack[filteredTileStack[:, 2] == -9999, 2] = np.nan
        filteredTileStack[filteredTileStack[:, 2] < 2, 3] = np.nan
        a = filteredTileStack
        stichedAod = np.zeros((lonList.size, latList.size)) + np.nan
        for i in range(0, len(lonList) - 1):
            for j in range(0, len(latList) - 1):
                pixelValue = a[(a[:, 0] > lonList[i]) & (a[:, 0] < lonList[i + 1]) & (a[:, 1] > latList[j]) & (
                        a[:, 1] < latList[j + 1]), 2]
                if (len(pixelValue) == 1):
                    stichedAod[i, j] = pixelValue
                elif (len(pixelValue) > 1):
                    stichedAod[i, j] = np.nanmean(pixelValue)

        # Write netCDF

        finalFilePath=os.path.join(aodOutputPath,ncFileName)
        ds = nc.Dataset(finalFilePath, 'w', format='NETCDF4')
        ds.title = 'Terra MODIS Aerosol Optical Depth (550nm), Deep Blue and Dark Target Combined'
        timeDim = ds.createDimension('time', None)
        lonDim = ds.createDimension('longitude', lonList.size)
        latDim = ds.createDimension('latitude', latList.size)

        times = ds.createVariable('time', 'f4', ('time',))
        times.units = 'hours since 1900-01-01 00:00'
        times.calendar = 'proleptic_gregorian'
        calendarType = 'standard'
        times.axis = 'T'
        latVar = ds.createVariable('latitude', 'f4', ('latitude',))
        latVar.units = 'degree_north'
        latVar.axis = 'Y'
        lonVar = ds.createVariable('longitude', 'f4', ('longitude',))
        lonVar.units = 'degree_east'
        lonVar.axis = 'X'
        latVar[:] = latList
        lonVar[:] = lonList

        dateNum = nc.date2num(dateList, times.units, calendarType)
        times[:] = dateNum

        aodVar = ds.createVariable('aod_550', 'f4', ('time', 'latitude', 'longitude'))
        aodVar.units = '1'
        print("Size of aod variable before adding value", aodVar.shape)
        # scaleFactor=float(AodHandle.GetMetadata()['scale_factor'])
        scaleFactor = 0.0010000000474974513
        aodVar[0, :, :] = stichedAod.transpose() * scaleFactor
        print("Size of aod variable after adding value", aodVar.shape)
        ds.close()
        utilities.combineTerraAOD(finalFilePath)
        print("Done !!")
    except:
        print("MODIS files not downloaded")

def init(date):
    if date:
        convertHDFtoNC(date)
    else:
        now=datetime.datetime.now()
        convertHDFtoNC(now)

if __name__=="__main__":
    init(False)
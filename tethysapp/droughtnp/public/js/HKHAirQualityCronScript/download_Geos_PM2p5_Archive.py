#from netCDF4 import Dataset
import netCDF4 as nc
import numpy as np
import datetime
import requests
import os
import utilities
import traceback
from config import BaseDateFormatDir

boundingBox=[60, 15, 110, 40]
#BaseDateFormatDir="/home/sdahal/new/Data/"
def downloadGeosArchive(date):
    now = date
    selectedTime = datetime.time(6, 30, 0)
    today = datetime.datetime(now.year, now.month, now.day, selectedTime.hour, selectedTime.minute, selectedTime.second)
    yesterday = today - datetime.timedelta(days=1)

    ArchiveDuration = 7  # days
    dataInterval = 6  # hours
    # timeOffset = 750 # minutes. first forecast is available at 12:30 so 12 hour 30 seconds= 12*60+30=750 minutes
    startDate = yesterday - datetime.timedelta(days=ArchiveDuration)
    endDate = yesterday - datetime.timedelta(hours=dataInterval)
    DatePath = os.path.join(BaseDateFormatDir, yesterday.strftime("%Y%m%d"))
    archivePath = os.path.join(DatePath, "Archive")
    PMPath = os.path.join(archivePath, "PM")
    GeosPath = os.path.join(PMPath, "GEOS-PM2p5")
    rawDataPath = os.path.join(GeosPath, "RawData")
    selectedDate = startDate
    while selectedDate <= endDate:
        print(selectedDate.strftime('%Y-%m-%d %H:%M'))
        pmOutputFileName='Geos-PM2p5-'+selectedDate.strftime('%Y-%m-%d-%H-%M')+'.nc'
        GeosPrefix='GEOS-CF.v01.rpl.aqc_tavg_1hr_g1440x721_v1.'
        GeosFileName=GeosPrefix+selectedDate.strftime('%Y%m%d_%H%Mz')+'.nc4'
        pmOutputFullPath= os.path.join(GeosPath,pmOutputFileName)
        url='https://portal.nccs.nasa.gov/datashare/gmao/geos-cf/v1/das/'+selectedDate.strftime('Y%Y/M%m/D%d/')+GeosFileName

        start = datetime.datetime.now()
        #print("\nStarted Creating Requests object at:  " + start.strftime("%Y-%m-%d %I:%M:%S %p"))
        eFlag=True
        try:
            with requests.Session() as s:
                response=s.get(url, stream=True);
                now = datetime.datetime.now()
                print("\nStarted saving  file at:  " + now.strftime("%Y-%m-%d %I:%M:%S %p"))
                utilities.create_if_not_exists(DatePath)
                utilities.create_if_not_exists(archivePath)
                utilities.create_if_not_exists(PMPath)
                utilities.create_if_not_exists(GeosPath)
                utilities.create_if_not_exists(rawDataPath)
                GeosFullPath = os.path.join(rawDataPath, GeosFileName)
                try:
                    file = open((GeosFullPath), "wb")
                    file.write(response.content)
                    file.close()
                    stop = datetime.datetime.now()
                    #print("\nStopped Saving file at :  " + stop.strftime("%Y-%m-%d %I:%M:%S %p"))
                    print("Time Taken: ")
                    print(stop-start)

                    #--------------Filtering the data and writing to separate File
                    #https://portal.nccs.nasa.gov/datashare/gmao/geos-cf/v1/das/Y2020/M04/D15/GEOS-CF.v01.rpl.aqc_tavg_1hr_g1440x721_v1.20200415_0030z.nc4
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
                    pmVar.missing_value= np.nan
                    pmVar.scale_factor=rawData.variables['PM25_RH35_GCC'].scale_factor
                    pmVar.add_offset=rawData.variables['PM25_RH35_GCC'].add_offset

                    #print("Size of  variable before adding value",pmVar.shape)
                    filteredPm2p5 = filteredPm2p5.astype('float64')
                    filteredPm2p5[filteredPm2p5 == rawData.variables['PM25_RH35_GCC'].missing_value] = np.nan
                    pmVar[0,:,:]=filteredPm2p5
                    #print("Size of variable after adding value",pmVar.shape)
                    pmDs.close()
                    print("The file was saved to : "+ pmOutputFullPath)
                    print("-----------------------------------------------------------------")
                    utilities.combineGEOS(pmOutputFullPath)
                    print("Copying combined NC file to HKHAirQualityWatch directory")
                    selectedDate=selectedDate+datetime.timedelta(hours=dataInterval)
                    print("Done !!")
                    #if eFlag:
                        #utilities.SendEmail("GEOS PM2p5 (Archive) downloaded", "Good morning! The files have been downloaded")
                        #eFlag = False
                except:
                    print('The downloaded file is corrupted',traceback.format_exc())
        except:
            print('Oops! The GMAO server is down')
            if emailFlag:
                utilities.SendEmail("GEOS PM2p5 (Archive) download problem", traceback.format_exc())
                emailFlag = False

def init(date):
    if date:
        downloadGeosArchive(date)
    else:
        now=datetime.datetime.now()
        downloadGeosArchive(now)

if __name__=="__main__":
    init(False)

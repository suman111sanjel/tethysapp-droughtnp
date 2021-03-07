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

def downloadGeosForecast(date):
    now = date
    today = datetime.datetime(now.year, now.month, now.day) - datetime.timedelta(days=1)

    forecastDuration = 2  # days
    dataInterval = 3  # hours
    timeOffset = 750  # minutes. first forecast is available at 12:30 so 12 hour 30 seconds= 12*60+30=750 minutes
    fromDate = today + datetime.timedelta(minutes=timeOffset)
    toDate = fromDate + datetime.timedelta(days=forecastDuration)
    DatePath = os.path.join(BaseDateFormatDir, today.strftime("%Y%m%d"))
    forecastPath = os.path.join(DatePath, "Forecast")
    PMPath = os.path.join(forecastPath, "PM")
    GeosPath = os.path.join(PMPath, "GEOS-PM2p5")
    rawDataPath = os.path.join(GeosPath, "RawData")
    selectedDate = fromDate

    while selectedDate < toDate:
        print(selectedDate.strftime('%Y-%m-%d %H:%M'))
        pmOutputFileName='Geos-PM2p5-'+selectedDate.strftime('%Y-%m-%d-%H-%M')+'.nc'
        GeosForecastPrefix='GEOS-CF.v01.fcst.aqc_tavg_1hr_g1440x721_v1.'
        GeosFileName=GeosForecastPrefix+fromDate.strftime('%Y%m%d_12z+')+selectedDate.strftime('%Y%m%d_%H%Mz')+'.nc4'
        pmOutputFullPath = os.path.join(GeosPath, pmOutputFileName)
        forecastUrl='https://portal.nccs.nasa.gov/datashare/gmao/geos-cf/v1/forecast/'+fromDate.strftime('Y%Y/M%m/D%d/')+'H12/'+GeosFileName
        start = datetime.datetime.now()
        #print("\nStarted Creating Requests object at:  " + start.strftime("%Y-%m-%d %I:%M:%S %p"))
        eFlag= True
        try:
            with requests.Session() as s:
                response=s.get(forecastUrl, stream=True);
                now = datetime.datetime.now()
                print("\nStarted saving  file at:  " + now.strftime("%Y-%m-%d %I:%M:%S %p"))
                utilities.create_if_not_exists(DatePath)
                utilities.create_if_not_exists(forecastPath)
                utilities.create_if_not_exists(PMPath)
                utilities.create_if_not_exists(GeosPath)
                utilities.create_if_not_exists(rawDataPath)
                GeosFullPath = os.path.join(rawDataPath, GeosFileName)
                try:
                    re = open((GeosFullPath), "wb")
                    re.write(response.content)
                    re.close()
                    stop = datetime.datetime.now()
                    print("\nStopped Saving file at :  " + stop.strftime("%Y-%m-%d %I:%M:%S %p"))
                    print("Time Taken: ")
                    print(stop-start)

                    #--------------Filtering the data and writing to separate File
                    #https://portal.nccs.nasa.gov/datashare/gmao/geos-cf/v1/das/Y2020/M04/D15/GEOS-CF.v01.rpl.aqc_tavg_1hr_g1440x721_v1.20200415_0030z.nc4
                    rawData=nc.Dataset(GeosFullPath, 'r')
                    #for i in rawData.variables:
                    #    print(i)

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
                    pmVar.missing_value=rawData.variables['PM25_RH35_GCC'].missing_value
                    pmVar.scale_factor=rawData.variables['PM25_RH35_GCC'].scale_factor
                    pmVar.add_offset=rawData.variables['PM25_RH35_GCC'].add_offset

                    #print("Size of  variable before adding value",pmVar.shape)
                    pmVar[0,:,:]=filteredPm2p5
                    #print("Size of variable after adding value",pmVar.shape)
                    pmDs.close()
                    print("The file was saved to : "+ pmOutputFullPath)
                    print("-----------------------------------------------------------------")
                    utilities.combineGEOSforecast(pmOutputFullPath,today.strftime("%Y%m%d"))
                    selectedDate=selectedDate+datetime.timedelta(hours=dataInterval)
                    print("Done !!")
                    #if eFlag:
                        #utilities.SendEmail("GEOS PM2p5 (Forecast) downloaded", "Good morning! The files have been downloaded")
                        #eFlag = False
                except:
                    print('The downloaded file is corrupted')

        except:
            print('Oops! The GMAO server is down')
            if emailFlag:
                utilities.SendEmail("GEOS PM2p5 (Forecast) download problem", traceback.format_exc())
                emailFlag = False

def init(date):
    if date:
        downloadGeosForecast(date)
    else:
        now=datetime.datetime.now()
        downloadGeosForecast(now)

if __name__=="__main__":
    init(False)
    
    

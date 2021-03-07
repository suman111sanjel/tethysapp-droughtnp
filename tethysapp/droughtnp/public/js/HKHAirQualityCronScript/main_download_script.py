import datetime

from download_Geos_PM2p5_Yesterday import init as DownloadRecentGeos_PM2p5
from download_Geos_PM2p5_Archive import init as DownloadArchiveGeos_PM2p5
from download_Geos_PM2p5_Forecast import init as DownloadForecastGeos_PM2p5
from download_ModisTerra_TrueColor_Yesterday import init as DownloadModisTerra_True_Color
from download_Airnow_PM2p5_Yesterday import init as DownloadAirnow_Data
from download_Aeronet_AOD_Yesterday_Suman import init as DownloadAeronet_Data
from download_ModisTerra_AOD_Yesterday import init as DownloadModisTerra_AOD
#from convert_Modis_hdf_to_nc import init as StitchModisTerra_AOD
from copy_GEOS_PM2p5 import init as CopyGeos_all_PM2p5
from copy_TerraModis_TrueColor_Archive import init as CopyModisTerraTrue_Color_Archive
from copy_TerraModis_TrueColor_Recent import init as CopyModisTerraTrue_Color_Recent
from copy_TerraModis_AOD import init as CopyModisTerra_AOD
from DirectoryUpdatedEmail import init as SendEmail_UpdatedDirectory
import utilities
import os
import traceback

#BaseDateFormatDir="/home/sdahal/new/Data/"

def init():
    now = datetime.datetime.now()
    #now = datetime.datetime(2020,12,28)
    yesterday= now-datetime.timedelta(days=1)
    dateFolder= yesterday.strftime("%Y%m%d")
    utilities.create_if_not_exists(dateFolder)
    emailReceivers=['suman','sishir']
    finalReceivers=['suman','sishir','bhupesh']
    utilities.SendEmailWithReciver('Cron Job started','The Cron Job script has started at:'+str(now),emailReceivers)
    #********************************************
    #********************************************
    #********************************************
    try:
        DownloadRecentGeos_PM2p5(now)
    except:
        errorMessage=traceback.format_exc()
        utilities.SendEmailWithReciver('Download error (GEOS_PM2p5_Recent)', errorMessage,
                                       emailReceivers)


    #********************************************
    #********************************************
    #********************************************
    try:
        DownloadArchiveGeos_PM2p5(now)
    except:
        errorMessage = traceback.format_exc()
        utilities.SendEmailWithReciver('Download error (GEOS_PM2p5_Archive)', errorMessage,
                                       emailReceivers)

    # ********************************************
    # ********************************************
    # ********************************************
    try:
        DownloadForecastGeos_PM2p5(now)
    except:
        errorMessage = traceback.format_exc()
        utilities.SendEmailWithReciver('Download error (GEOS_PM2p5_Forecast)', errorMessage,
                                       emailReceivers)

    # ********************************************
    # ********************************************
    # ********************************************
    try:
        DownloadModisTerra_True_Color(now)
    except:
        errorMessage = traceback.format_exc()
        utilities.SendEmailWithReciver('Download error (ModisTerra_True_Color)', errorMessage,
                                       emailReceivers)

    # ********************************************
    # ********************************************
    # ********************************************
    try:
        DownloadAirnow_Data(now)
    except:
        errorMessage = traceback.format_exc()
        utilities.SendEmailWithReciver('Download error (Airnow)', errorMessage,
                                       emailReceivers)

    # ********************************************
    # ********************************************
    # ********************************************
    try:
        DownloadAeronet_Data(now)
    except:
        errorMessage = traceback.format_exc()
        utilities.SendEmailWithReciver('Download error (Aeronet)', errorMessage,
                                       emailReceivers)

    # ********************************************
    # ********************************************
    # ********************************************
    try:
        DownloadModisTerra_AOD(now)
    except:
        errorMessage = traceback.format_exc()
        utilities.SendEmailWithReciver('Download error (ModisTerra_AOD)', errorMessage,
                                       emailReceivers)
    # ********************************************
    # ********************************************
    # ********************************************
    end = datetime.datetime.now()
    totalTimeTaken = end - now
    # SendEmail_UpdatedDirectory(now)
    utilities.SendEmailWithReciver('Cron Job completed',
                                   'Started Date time: \n' + str(now) + '\n\nEnd Date Time: \n' + str(
                                       end) + '\n\nTotal time taken is \n' + str(
                                       totalTimeTaken) + '\n\nPlease check atomos08 folder and the dashboard: http://110.34.30.197/apps/airqualitywatch/recent/)',
                                   finalReceivers)

    # ********************************************
    # ********************************************
    # ********************************************


if __name__=="__main__":
    init()
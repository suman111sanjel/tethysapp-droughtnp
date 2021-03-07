# Copy GEOS-PM2p5 files from downloaded folder to Suman's folder structure
import os
import datetime
import shutil
import glob
from config import BaseDateFormatDir
from config import BaseHKHFormatDir
import utilities

def copyGeos_PM2p5(date):
    now = date
    selectedTime = datetime.time(6,30,0)
    today= datetime.datetime(now.year, now.month, now.day, selectedTime.hour, selectedTime.minute, selectedTime.second)
    yesterday= today - datetime.timedelta(days=1)

    DatePath= os.path.join(BaseDateFormatDir,yesterday.strftime("%Y%m%d"))
    in_GEOS_PM2p5_Recent= os.path.join(DatePath,"Recent","PM","GEOS-PM2p5")
    in_GEOS_PM2p5_Archive= os.path.join(DatePath,"Archive","PM","GEOS-PM2p5")
    in_GEOS_PM2p5_Forecast= os.path.join(DatePath,"Forecast","PM","GEOS-PM2p5")

    out_GEOS_PM2p5_Recent= os.path.join(BaseHKHFormatDir,"RecentAndArchive","PM","GEOS-PM2p5","Recent")
    out_GEOS_PM2p5_Archive= os.path.join(BaseHKHFormatDir,"RecentAndArchive","PM","GEOS-PM2p5","Archive")
    out_GEOS_PM2p5_Forecast= os.path.join(BaseHKHFormatDir,"Forecast","PM","GEOS-PM2p5")
    utilities.create_if_not_exists(out_GEOS_PM2p5_Recent)
    utilities.create_if_not_exists(out_GEOS_PM2p5_Archive)
    utilities.create_if_not_exists(out_GEOS_PM2p5_Forecast)

    directory_recent = out_GEOS_PM2p5_Recent
    test = os.listdir( directory_recent )
    for item in test:
        if item.endswith(".nc"):
            os.remove( os.path.join( directory_recent, item ) )

    directory_archive = out_GEOS_PM2p5_Archive
    test = os.listdir( directory_archive )
    for item in test:
        if item.endswith(".nc"):
            os.remove( os.path.join( directory_archive, item ) )

    directory_forecast = out_GEOS_PM2p5_Forecast
    test = os.listdir( directory_forecast )
    for item in test:
        if item.endswith(".nc"):
            os.remove( os.path.join( directory_forecast, item ) )


    recent = glob.iglob(os.path.join(in_GEOS_PM2p5_Recent, "*.nc"))
    for file in recent:
        if os.path.isfile(file):
            shutil.copy2(file, out_GEOS_PM2p5_Recent)
            #shutil.copy2(file, out_GEOS_PM2p5_RecentAndArchive)

    archive = glob.iglob(os.path.join(in_GEOS_PM2p5_Archive, "*.nc"))
    for file in archive:
        if os.path.isfile(file):
            shutil.copy2(file, out_GEOS_PM2p5_Archive)
            #shutil.copy2(file, out_GEOS_PM2p5_RecentAndArchive)

    forecast = glob.iglob(os.path.join(in_GEOS_PM2p5_Forecast, "*.nc"))
    for file in forecast:
        if os.path.isfile(file):
            shutil.copy2(file, out_GEOS_PM2p5_Forecast)

def init(date):
    if date:
        copyGeos_PM2p5(date)
    else:
        now=datetime.datetime.now()
        copyGeos_PM2p5(now)

if __name__=="__main__":
    init(False)
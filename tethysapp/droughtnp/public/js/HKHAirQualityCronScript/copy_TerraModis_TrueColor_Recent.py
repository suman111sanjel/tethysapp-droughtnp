# Copy GEOS-PM2p5 files from downloaded folder to Suman's folder structure
import os
import datetime
import shutil
import glob
from config import BaseDateFormatDir
from config import BaseHKHFormatDir
import utilities

def copyTrueColorRecent(date):
    now = date
    selectedTime = datetime.time(6,30,0)
    today= datetime.datetime(now.year, now.month, now.day, selectedTime.hour, selectedTime.minute, selectedTime.second)
    yesterday= today - datetime.timedelta(days=1)
    #yesterday= datetime.datetime(2020,12,11)

    DatePath= os.path.join(BaseDateFormatDir,yesterday.strftime("%Y%m%d"))
    in_TerraModis_TrueColor_Recent= os.path.join(DatePath,"Recent","TerraModis-TrueColor")

    out_TerraModis_TrueColor_Recent= os.path.join(BaseHKHFormatDir,"RecentAndArchive","TerraMODIS-TrueColor1km","Recent")
    utilities.create_if_not_exists(out_TerraModis_TrueColor_Recent)
    #Copy files outside Recent and Archive directories
    #Recent= "/home/sdahal/HKHAirQualityWatch/RecentAndArchive/TerraMODIS-TrueColor1km/"

    directory_recent = out_TerraModis_TrueColor_Recent
    test = os.listdir( directory_recent )
    for item in test:
        #if item.endswith(".nc"):
        os.remove( os.path.join( directory_recent, item ) )

    recent = glob.iglob(os.path.join(in_TerraModis_TrueColor_Recent, "*.*"))
    for file in recent:
        if os.path.isfile(file):
            shutil.copy2(file, out_TerraModis_TrueColor_Recent)
            #shutil.copy2(file, Recent)

def init(date):
    if date:
        copyTrueColorRecent(date)
    else:
        now=datetime.datetime.now()
        copyTrueColorRecent(now)

if __name__=="__main__":
    init(False)








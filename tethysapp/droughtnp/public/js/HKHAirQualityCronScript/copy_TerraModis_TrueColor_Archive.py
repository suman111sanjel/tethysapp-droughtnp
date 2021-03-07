# Copy GEOS-PM2p5 files from downloaded folder to Suman's folder structure
import os
import datetime
import shutil
import glob
from config import BaseDateFormatDir
from config import BaseHKHFormatDir
import utilities

def copyTrueColorArchive(date):
    now = date
    selectedTime = datetime.time(6,30,0)
    today= datetime.datetime(now.year, now.month, now.day, selectedTime.hour, selectedTime.minute, selectedTime.second)
    yesterday= today - datetime.timedelta(days=1)

    out_TerraModis_TrueColor_Archive= os.path.join(BaseHKHFormatDir,"RecentAndArchive","TerraMODIS-TrueColor1km","Archive")
    utilities.create_if_not_exists(out_TerraModis_TrueColor_Archive)
    directory_archive = out_TerraModis_TrueColor_Archive
    test = os.listdir( directory_archive )
    for item in test:
        #if item.endswith(".nc"):
        os.remove( os.path.join( directory_archive, item ) )
    ArchiveDuration = 7 # days
    startDate = yesterday-datetime.timedelta(days=ArchiveDuration)
    #startDate = datetime.datetime(2020,12,1)
    endDate = yesterday-datetime.timedelta(days=1)
    #endDate = datetime.datetime(2020,12,8)
    delta = datetime.timedelta(days=1)
    while startDate <= endDate:
        DatePath= os.path.join(BaseDateFormatDir,startDate.strftime("%Y%m%d"))
        in_TerraModis_TrueColor_Archive= os.path.join(DatePath,"Recent","TerraModis-TrueColor")
        archive = glob.iglob(os.path.join(in_TerraModis_TrueColor_Archive, "*.*"))
        for file in archive:
            if os.path.isfile(file):
                shutil.copy2(file, out_TerraModis_TrueColor_Archive)
        startDate += delta

def init(date):
    if date:
        copyTrueColorArchive(date)
    else:
        now=datetime.datetime.now()
        copyTrueColorArchive(now)

if __name__=="__main__":
    init(False)




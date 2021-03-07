# Copy Terra-MODIS AOD files from downloaded folder to Suman's folder structure
import os
import datetime
import shutil
import glob
from config import BaseDateFormatDir
from config import BaseHKHFormatDir
import utilities

def copyTerraModisAOD(date):
    now = date
    today= datetime.datetime(now.year, now.month, now.day, now.hour, now.minute, now.second)
    yesterday= today - datetime.timedelta(days=1)

    DatePath= os.path.join(BaseDateFormatDir,yesterday.strftime("%Y%m%d"))
    in_TerraModis_AOD_Recent= os.path.join(DatePath,"Recent","PM","TerraModis-AOD")
    out_TerraModis_AOD_Recent= os.path.join(BaseHKHFormatDir,"RecentAndArchive","PM","TerraModis-AOD","Recent")
    out_TerraModis_AOD_Archive= os.path.join(BaseHKHFormatDir,"RecentAndArchive","PM","TerraModis-AOD","Archive")
    utilities.create_if_not_exists(out_TerraModis_AOD_Recent)
    utilities.create_if_not_exists(out_TerraModis_AOD_Archive)
    #Copy files outside Recent and Archive directories
    #Recent= "/home/sdahal/HKHAirQualityWatch/RecentAndArchive/PM/TerraModis-AOD/"

    #Delete existing files
    directory_recent = out_TerraModis_AOD_Recent
    test = os.listdir( directory_recent )
    for item in test:
        if item.endswith(".nc"):
            os.remove( os.path.join( directory_recent, item ) )

    directory_archive = out_TerraModis_AOD_Archive
    test = os.listdir( directory_archive )
    for item in test:
        if item.endswith(".nc"):
            os.remove( os.path.join( directory_archive, item ) )

    #Copy files
    recent = glob.iglob(os.path.join(in_TerraModis_AOD_Recent, "*.nc"))
    for file in recent:
        if os.path.isfile(file):
            shutil.copy2(file, out_TerraModis_AOD_Recent)
            #shutil.copy2(file, Recent)

    ArchiveDuration = 7 # days
    startDate = yesterday-datetime.timedelta(days=ArchiveDuration)
    endDate = yesterday-datetime.timedelta(days=1)
    delta = datetime.timedelta(days=1)
    while startDate <= endDate:
        DatePath= os.path.join(BaseDateFormatDir,startDate.strftime("%Y%m%d"))
        in_TerraModis_AOD_Archive= os.path.join(DatePath,"Recent","PM","TerraModis-AOD")
        archive = glob.iglob(os.path.join(in_TerraModis_AOD_Archive, "*.nc"))
        for file in archive:
            if os.path.isfile(file):
                shutil.copy2(file, out_TerraModis_AOD_Archive)
        startDate += delta

def init(date):
    if date:
        copyTerraModisAOD(date)
    else:
        now=datetime.datetime.now()
        copyTerraModisAOD(now)

if __name__=="__main__":
    init(False)


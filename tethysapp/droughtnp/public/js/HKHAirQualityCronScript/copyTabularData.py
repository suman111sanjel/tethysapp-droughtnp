import os
import shutil
from config import BaseHKHFormatDir
import utilities

AeronetDir=os.path.join(BaseHKHFormatDir,"RecentAndArchive","PM","Aeronet-AOD")
AirnowDir=os.path.join(BaseHKHFormatDir,"RecentAndArchive","PM","Airnow-PM2p5")

def copyAeronet(stationName,fullPath,fileName):
    newPath=fullPath.replace('.zip','.lev15')
    newfileName=fileName.replace('.zip','.lev15')
    stationPath=os.path.join(AeronetDir,stationName)
    utilities.create_if_not_exists(stationPath)
    completePath=os.path.join(stationPath,newfileName)
    if os.path.isfile(newPath):
        shutil.copy2(newPath, completePath)

def copyAirnow(stationName,fullPath,fileName):
    stationPath = os.path.join(AirnowDir, stationName)
    utilities.create_if_not_exists(stationPath)
    completePath=os.path.join(stationPath,fileName)
    if os.path.isfile(fullPath):
        shutil.copy2(fullPath, completePath)





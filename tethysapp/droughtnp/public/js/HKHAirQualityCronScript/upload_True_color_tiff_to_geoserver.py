import datetime
import os
from config import BaseDateFormatDir
import glob
import utilities

endDate= datetime.datetime.now()
startDate= endDate - datetime.timedelta(days=8)
delta= datetime.timedelta(days=1)

while startDate <= endDate:
    DatePath = os.path.join(BaseDateFormatDir, startDate.strftime("%Y%m%d"))
    in_TerraModis_TrueColor_Archive = os.path.join(DatePath, "Recent", "TerraModis-TrueColor")
    data = glob.iglob(os.path.join(in_TerraModis_TrueColor_Archive, "*.tiff"))
    for file in data:
        if os.path.isfile(file):
            print(file)
            utilities.upload_tiff(file)
    startDate += delta

print('Files successfully uploaded to geoserver')

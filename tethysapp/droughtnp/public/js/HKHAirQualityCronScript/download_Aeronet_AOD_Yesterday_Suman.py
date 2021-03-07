import requests
import os
import datetime
import traceback
import utilities
from config import BaseDateFormatDir
import copyTabularData
import pushTabularDataToDB

aeronetSiteListIGP=['Lahore', 'Kanpur', 'Lumbini_North','Gandhi_College', 'Dibrugarh_Univ', 'Mandalay_MTU']
aeronetSiteListNepal=['Lumbini_North', 'Bidur', 'Pokhara','Kyanjin_Gompa', 'Langtang_BC']

AeronetDownloadSite="https://aeronet.gsfc.nasa.gov/cgi-bin/print_warning_v3?"
AeronetDatadownload= "https://aeronet.gsfc.nasa.gov/zip_files/V3/"

def downloadAeronetData(date):
    '''
    Description:

    Args:
        date:

    Returns:

    '''

    selectedDate = date - datetime.timedelta(days=1)
    # selectedDate = datetime.datetime.now() - datetime.timedelta(days=1)

    DatePath = os.path.join(BaseDateFormatDir, selectedDate.strftime("%Y%m%d"))
    aeronet_Dir = os.path.join(DatePath, "Recent", "PM", "Aeronet-AOD")

    emailFlag=True

    utilities.create_if_not_exists(aeronet_Dir)

    # for aeronetSite in aeronetSiteListNepal:
    for aeronetSite in aeronetSiteListIGP:
        toDate = selectedDate + datetime.timedelta(days=1)
        requestDateLine = "&day=" + str(selectedDate.day) + "&month=" + str(
            selectedDate.month) + "&year=1" + selectedDate.strftime("%y") + "&day2=" + str(
            toDate.day) + "&month2=" + str(toDate.month) + "&year2=1" + toDate.strftime("%y")
        requestTypeLine = "&AOD15=1"

        requestAveragingLine = "&AVG=10"  # all points without Averaging

        requestUrl = AeronetDownloadSite + "site=" + aeronetSite + requestDateLine + requestTypeLine + requestAveragingLine + "&Submit=Download"
        eFlag=True
        try:
            requestResponse = requests.get(requestUrl)

            if requestResponse.status_code == 200:
                filePath = os.path.join(aeronet_Dir, aeronetSite)
                # filePath = aeronet_Dir + aeronetSite + "/"
                fileName = str(selectedDate.strftime("%Y%m%d")) + "_" + str(toDate.strftime("%Y%m%d")) + "_" + aeronetSite + ".zip"

                downloadUrl = AeronetDatadownload + fileName
                # print("Downloading File " + fileName + " to " + filePath + fileName + "\n")
                downloadResponse = requests.get(downloadUrl, stream=True)
                if downloadResponse.status_code == 200:
                    # Create the destination path
                    utilities.create_if_not_exists(filePath)
                    # save the data to zip file
                    fileFullPath=os.path.join(filePath,fileName)
                    try:
                        with open(fileFullPath, 'wb') as f:
                            f.write(downloadResponse.content)
                        os.system('unzip -o ' + fileFullPath + ' -d ' + filePath)
                        copyTabularData.copyAeronet(aeronetSite,fileFullPath,fileName)
                        pushFullPath=fileFullPath.replace('.zip','.lev15')
                        pushTabularDataToDB.SingleInsertAeronetAODDataToDB(pushFullPath)
                        #if eFlag:
                            #utilities.SendEmail("Aeronet data downloaded","Good morning! The files have been downloaded")
                            #eFlag = False

                    except:

                        print("An error occured while trying to create file. Perhaps file already exists")
                else:
                    print("File could not be downloaded \n")
                    print(str(downloadResponse.status_code) + " : " + downloadResponse.reason + "\n")
                    print(downloadResponse.text)
            else:
                print("ERROR !!!! \n Request could not be made \n Data May Not be available for today")
        except:
            print("error---")
            if emailFlag:
                utilities.SendEmail(aeronetSite+"Aeronet AOD download propblem",traceback.format_exc())
                emailFlag=False


def init(date):
    if date:
        downloadAeronetData(date)

    else:
        #now=datetime.datetime.now()
        now=datetime.datetime(2020,12,15)
        downloadAeronetData(now)

if __name__=="__main__":
    init(False)



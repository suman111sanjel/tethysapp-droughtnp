#Download Terra MODIS AOD
import traceback

import requests
import xml.etree.ElementTree as ET
import datetime
import os
import utilities
from config import BaseDateFormatDir
import convert_Modis_hdf_to_nc

MODIS_xml="https://modwebsrv.modaps.eosdis.nasa.gov/axis2/services/MODAPSservices/getOpenSearch?product=MOD04_L2&collection=61&start="

def downloadTerraMODIS_AOD(date):
    yesterday= date - datetime.timedelta(days=1)
    DatePath = os.path.join(BaseDateFormatDir, yesterday.strftime("%Y%m%d"))
    recentPath = os.path.join(DatePath, "Recent")
    PMPath = os.path.join(recentPath, "PM")
    aodOutputPath = os.path.join(PMPath, "TerraModis-AOD")
    aodRawPath = os.path.join(aodOutputPath, "RawData")
    urls = []
    l=MODIS_xml+yesterday.strftime('%Y-%m-%d')+"&stop="+yesterday.strftime('%Y-%m-%d')+"&bbox=60,15,110,40"
    try:
        with requests.Session() as s:
            # Get xml file containing urls
            #forEmailBody="URl is "+l+"\n"
            print(l)
            response = s.get(l)
            #forEmailBody=forEmailBody+str(response.content)
            #emailSender.SendEmail("Terra AOD XML", forEmailBody)
            tree = ET.fromstring(response.content)
            file_urls=[]

            for elem in tree.iter():
                for k, v in list(elem.attrib.items()):
                    if v[-4:]=='.hdf':
                        file_urls.append(v)
                        print(file_urls)
                    # if 'href' in k:
                    #     urls.append(v)
                    #     print (v[-4:])
    except:
        print("The xml file isn't available")
        utilities.SendEmail("Terra MODIS AOD download problem", traceback.format_exc())
        # # Extract necessary urls
        # for url in filter(lambda x:x.endswith(".hdf"), urls):
        #     file_urls.append(url)
        #     print (url)

    for url in file_urls:
        emailFlag=True
        eFlag=True
        try:
            with requests.Session() as s:

                print (file_urls)
                print (url)
                #r=requests.get(url,auth=(Username,Password),stream=True) [This is HTTP style and doesn't work for HTTPS]
                r=s.get(url,headers={'Authorization':'Bearer c2hpc2h1OlpHRm9ZV3h6YVhOb2FYSXlNRGN5UUdkdFlXbHNMbU52YlE9PToxNjEwNDQ1NjMyOmQ3YmUyNjJlYThkZDdjZTM5ZTQ3ZDE5ZmNmZjJhZjY3M2M5M2FhNzU'})
                #r=requests.get(url,headers={'Authorization':'Bearer c2hpc2h1OlpHRm9ZV3h6YVhOb2FYSXlNRGN5UUdkdFlXbHNMbU52YlE9PToxNjA2Nzk3MjIxOjliZWFkZWJiZmQ3Y2YyY2M0OTdmYzZhNTJjYjk2NjE3ZWIwNTJkOTM'})
                utilities.create_if_not_exists(DatePath)
                utilities.create_if_not_exists(recentPath)
                utilities.create_if_not_exists(PMPath)
                utilities.create_if_not_exists(aodOutputPath)
                utilities.create_if_not_exists(aodRawPath)
                fileName=url[-44:]
                fileFullPath=os.path.join(aodRawPath,fileName)
                file = open(fileFullPath, "wb")
                file.write(r.content)
                file.close()

                print('File downloaded',fileName)
                #if eFlag:
                    #utilities.SendEmail("Terra MODIS AOD downloaded","Good morning! The file has been downloaded")
                    #eFlag = False
        except:
            print('The file is not available',traceback.format_exc())
            if emailFlag:
                utilities.SendEmail("Terra MODIS AOD download problem", traceback.format_exc())
                emailFlag = False

def init(date):
    if date:
        downloadTerraMODIS_AOD(date)
        convert_Modis_hdf_to_nc.convertHDFtoNC(date)
    else:
        now=datetime.datetime.now()
        downloadTerraMODIS_AOD(now)
        convert_Modis_hdf_to_nc.convertHDFtoNC(now)

if __name__=="__main__":
    init(False)

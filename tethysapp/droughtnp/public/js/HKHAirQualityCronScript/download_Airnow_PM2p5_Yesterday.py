import requests
import datetime
import os
import utilities
from config import BaseDateFormatDir
import copyTabularData
import pushTabularDataToDB

#Historical Data URL: http://dosairnowdata.org/dos/historical/Kolkata/2020/Kolkata_PM2.5_2020_YTD.csv

def downloadAirnow(date):
    today=date
    yesterday=today-datetime.timedelta(days=1)

    DatePath= os.path.join(BaseDateFormatDir,yesterday.strftime("%Y%m%d"))
    destinationDir= os.path.join(DatePath,"Recent","PM","Airnow-PM2p5")
    utilities.create_if_not_exists(destinationDir)

    url="https://www.dosairnowdata.org/dos/AllPosts24Hour.json"
    response=requests.get(url)
    dataSet=response.json()

    stationList=['Phora Durbar Kathmandu',
                 'Embassy Kathmandu',
                 'Kabul',
                 'Islamabad',
                 'Lahore',
                 'New Delhi',
                 'Kolkata',
                 'Dhaka',
                 'Rangoon'
                 ]
    for stationName in stationList:
        for parameterIdx in range(0, len(dataSet[stationName]['monitors'])):
            beginDate = dt = datetime.datetime.strptime((dataSet[stationName]['monitors'][parameterIdx]['beginTimeLT']),
                                                        '%m/%d/%Y %I:%M:%S %p')
            dateList = [(beginDate + datetime.timedelta(hours=x)) for x in
                        range(0, len(dataSet[stationName]['monitors'][parameterIdx]['conc']))]

            #filePath= 'USembassyDownloadedData/' + stationName+'/'+dataSet[stationName]['monitors'][parameterIdx]['parameter'].replace('.','_') + '/'
            folderStationName=stationName.replace(' ','_')
            filePath = os.path.join(destinationDir, dataSet[stationName]['monitors'][parameterIdx]['parameter'].replace('.', '_'), folderStationName)
            utilities.create_if_not_exists(filePath)
            fileName=folderStationName+dataSet[stationName]['monitors'][parameterIdx]['parameter'].replace('.','_')+beginDate.strftime('%Y-%m-%d-%H%M')+'.csv'
            fileFullPath= os.path.join(filePath,fileName)

            #dataSet['Phora Durbar Kathmandu']['monitors'][1]['conc']

            writeData='DateTime'+ ',' +dataSet[stationName]['monitors'][parameterIdx]['parameter']+"("+dataSet[stationName]['monitors'][parameterIdx]['concUnit']+")"
            for i in range(0, len(dateList)):
                writeData = writeData + '\n' + dateList[i].strftime('%Y-%m-%d %H:%M:%S') + ',' + str(
                    dataSet[stationName]['monitors'][parameterIdx]['conc'][i])

            with open((fileFullPath), 'w') as f:
                f.write(writeData)
            pollutant= dataSet[stationName]['monitors'][parameterIdx]['parameter'].replace('.','_')
            if pollutant=="PM2_5":
                copyTabularData.copyAirnow(folderStationName,fileFullPath,fileName)
                pushTabularDataToDB.SingleInsertUSEmbassyDataToDB(fileFullPath)

def init(date):
    if date:
        downloadAirnow(date)
    else:
        now=datetime.datetime.now()
        downloadAirnow(now)

if __name__=="__main__":
    init(False)



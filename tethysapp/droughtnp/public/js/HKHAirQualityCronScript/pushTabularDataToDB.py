import os
import csv
import datetime

import logging

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from sqlalchemy import Column, DateTime, Float, Integer, String, Time
from geoalchemy2.types import Geometry

DBUser = 'air_quality_user_read_only'
DBPassword = 'air_quality_user_read_only123##'
DBhost = '192.168.10.72'
DBport = '5432'
DatabaseName = 'airqualitywatch_airqualitywatch'

# DBUser = 'ur_inserter'
# DBPassword = 'ur_inserter123##'
# DBhost = '192.168.11.242'
# DBport = '5432'
# DatabaseName = 'airqualitywatch_airqualitywatch'

db_string = "postgres://" + DBUser + ":" + DBPassword + "@" + DBhost + ":" + DBport + "/" + DatabaseName
def SingleInsertUSEmbassyDataToDB(Absolutelocation):
    currentDir=os.path.dirname(os.path.abspath(__file__))
    logFile=os.path.join(currentDir,"logs",datetime.datetime.now().strftime('log_%H_%M_%d_%m_%Y.log'))
    logging.basicConfig(filename=logFile, filemode='w', format='%(asctime)s - %(message)s', level=logging.ERROR)
    # db_string = "postgres://ur_inserter:ur_inserter123##@192.168.11.242:5432/airqualitywatch_airqualitywatch"

    db = create_engine(db_string)
    Base = declarative_base()

    class UsEmbassyPm(Base):
        __tablename__ = 'us_embassy_pm'
        __table_args__ = {'schema': 'public'}

        st_id = Column(Integer, primary_key=True)
        site = Column(String)
        name = Column(String)
        geom = Column(Geometry)
        folder_name = Column(String)

    class UsEmbassyPmDataList(Base):
        __tablename__ = 'us_embassy_pm_data_list'
        __table_args__ = {'schema': 'public'}

        st_id = Column(Integer, primary_key=True, nullable=False)
        date_time = Column(DateTime, primary_key=True, nullable=False)
        value = Column(Float(53))
        type = Column(String(100))

    # Base.clear()

    Session = sessionmaker(db)
    session = Session()
    totolErrorOnInsert = 0
    stationNameInput = str(Absolutelocation.split('/')[-2])
    stationIDFilter = session.query(UsEmbassyPm).filter(UsEmbassyPm.folder_name == stationNameInput)
    if (stationIDFilter.count()):
        stationID = stationIDFilter[0].st_id
        # # Read

        if Absolutelocation.endswith(".csv"):
            with open(Absolutelocation, 'r') as CSVFile:
                reader = csv.reader(CSVFile)
                counterStart = 0
                USEmData = None
                for row in reader:
                    if (counterStart > 0):
                        try:
                            d = None
                            try:
                                d = datetime.datetime.strptime(row[0], "%m/%d/%Y %H:%M")
                            except:
                                d = datetime.datetime.strptime(row[0].replace('-', '/'), "%Y/%m/%d %H:%M:%S")
                            valueFloat = float(row[1])
                            USEmData = UsEmbassyPmDataList(st_id=stationID, value=valueFloat, type='pm', date_time=d)
                            session.add(USEmData)
                            session.commit()
                            del USEmData
                        # some code that may throw an exception
                        except Exception as e:

                            print("------------------------------------------------------------------------------")
                            print(row)
                            print(Absolutelocation)
                            print('error',e)
                            print("------------------------------------------------------------------------------")

                            totolErrorOnInsert += 1
                            session.rollback()
                    # exception handling code
                    counterStart += 1
                counterStart = 0
        print("total Error ", totolErrorOnInsert)

        session.close()


def SingleInsertAeronetAODDataToDB(Absolutelocation):
    currentDir=os.path.dirname(os.path.abspath(__file__))
    logFile=os.path.join(currentDir,"logs",datetime.datetime.now().strftime('log_%H_%M_%d_%m_%Y.log'))
    logging.basicConfig(filename=logFile, filemode='w', format='%(asctime)s - %(message)s', level=logging.ERROR)
    # db_string = "postgres://ur_inserter:ur_inserter123##@192.168.11.242:5432/airqualitywatch_airqualitywatch"

    db = create_engine(db_string)
    Base = declarative_base()

    class AeronetAod(Base):
        __tablename__ = 'aeronet_aod'
        __table_args__ = {'schema': 'public'}

        sn = Column(Integer, primary_key=True)
        site = Column(String)
        geom = Column(Geometry)
        name = Column(String)
        folder_name = Column(String)

    class AeronetAodDataList(Base):
        __tablename__ = 'aeronet_aod_data_list'
        __table_args__ = {'schema': 'public'}

        st_id = Column(Integer, primary_key=True, nullable=False)
        date_time = Column(Time, primary_key=True, nullable=False)
        value = Column(Float(53))
        type = Column(String(100))

    Session = sessionmaker(db)
    session = Session()
    totolErrorOnInsert = 0
    stationNameInput = str(Absolutelocation.split('/')[-2])
    stationIDFilter = session.query(AeronetAod).filter(AeronetAod.folder_name == stationNameInput)
    if (stationIDFilter.count()):
        stationID = stationIDFilter[0].sn
        # # Read
        if Absolutelocation.endswith(".lev15"):
            lineCount = 0
            x = open(Absolutelocation).read().splitlines()
            for jj in x:
                if (lineCount > 6):
                    col = jj.split(',')
                    DateComplete = col[0].replace(':', '-') + " " + col[1]
                    try:
                        print("DateComplete")
                        print(DateComplete)

                        d = datetime.datetime.strptime(DateComplete, "%d-%m-%Y %H:%M:%S")
                        print(d)
                        print("-------------------------")
                        valueFloat = float(col[18])
                        if not valueFloat<=-999:
                            AeronetAODData = AeronetAodDataList(st_id=stationID, value=valueFloat, type='aod', date_time=d)

                            session.add(AeronetAODData)
                            session.commit()
                            del AeronetAODData
                    # break
                    # some code that may throw an exception
                    except Exception as e:

                        print("------------------------------------------------------------------------------")
                        print(col)
                        print(Absolutelocation)
                        print('error', e)
                        print("------------------------------------------------------------------------------")
                        logging.debug(e)
                        logging.error('Raised an error => %s', e)
                        totolErrorOnInsert += 1
                        session.rollback()
                lineCount += 1
            lineCount = 0
        print("total Error ", totolErrorOnInsert)

        session.close()


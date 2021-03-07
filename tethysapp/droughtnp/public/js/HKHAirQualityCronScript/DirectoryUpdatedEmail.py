import utilities
import datetime

def UpdateEmail(date):
    #Send a remainder email to Suman stating that the Directory has been updated
    utilities.DirectoryUpdatedEmail("HKHAirQualityWatch directory updated","Good morning! The directory has been updated. Please check the link below \n http://110.34.30.197/apps/airqualitywatch/recent/ ")
    now = datetime.datetime.now()
    print ("The email has been sent",now)
def init(date):
    if date:
        UpdateEmail(date)
    else:
        now=datetime.datetime.now()
        UpdateEmail(now)

if __name__=="__main__":
    init(False)
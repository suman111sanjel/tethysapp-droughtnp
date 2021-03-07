def combineGEOS(completePath):

    dataOut = os.path.join(config.BaseHKHFormatDir,'RecentAndArchive','PM','GEOS-PM2p5')
    create_if_not_exists(dataOut)
    fileName = completePath.split('/')[-1]
    date = fileName[-19:-9]
    savingFileFullPath = os.path.join(dataOut,  'Geos-PM2p5-' + date + '.nc')
    if os.path.isfile(savingFileFullPath):
        d = xr.merge([xr.open_dataset(savingFileFullPath), xr.open_dataset(completePath)])
        d.to_netcdf(savingFileFullPath)
    else:
        d = xr.open_dataset(completePath)
        d.to_netcdf(savingFileFullPath)

def combineGEOSforecast(completePath,d):
    Out = os.path.join(config.BaseHKHFormatDir,'Forecast','PM','GEOS-PM2p5')
    dataOut = os.path.join(Out, d)
    create_if_not_exists(dataOut)
    ncmlName = d + ".ncml"
    ncmlFullPath = os.path.join(dataOut, ncmlName)
    #Write ncml file
    file = open(ncmlFullPath, "w")
    a = d + "/"
    b ="""<netcdf title="Example of joinNew Grid aggregation using the scan element with a regexp" xmlns="http://www.unidata.ucar.edu/namespaces/netcdf/ncml-2.2">
      <aggregation type="joinExisting" dimName="time" timeUnitsChange="true" recheckEvery="1 day">
        <scan location="%(date)s" subdirs="true"  suffix=".nc" ncoords="0"/>
      </aggregation>
    </netcdf>"""%{'date': a}
    file.write(b)
    file.close()

    fileName = completePath.split('/')[-1]
    date = fileName[-19:-9]
    savingFileFullPath = os.path.join(dataOut,'Geos-PM2p5-'+date+'.nc')
    if os.path.isfile(savingFileFullPath):
        d = xr.merge([xr.open_dataset(savingFileFullPath), xr.open_dataset(completePath)])
        d.to_netcdf(savingFileFullPath)
    else:
        d = xr.open_dataset(completePath)
        d.to_netcdf(savingFileFullPath)

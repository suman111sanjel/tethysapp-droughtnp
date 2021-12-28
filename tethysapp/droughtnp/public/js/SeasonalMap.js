let sldasCurrent = [{
    title: 'Rain Fall',
    ParameterName: 'Rainf_f_tavg',
    PropForSLD: [{
        classType: 'Below',
        color: '#b10026',
        value: '5'
    }, {
        color: '#fc4e2a',
        range: '5 10'
    }, {
        color: '#feb24c',
        range: '10 15'
    }, {
        color: '#ffeda0',
        range: '15 20'
    }, {
        color: '#c7e9b4',
        range: '20 25'
    }, {
        color: '#7fcdbb',
        range: '25 30'
    }, {
        color: '#1d91c0',
        range: '30 35'
    }, {
        classType: 'Above',
        color: '#0c2c84',
        value: '35'
    }],
    CustomLegend: [
        // {color: "#FFFFFF", quantity: "-9999", label: ["No Data"], opacity: "0"},
        {color: "#b10026", quantity: "25", label: ["less than 5", ""], opacity: "1"},
        {color: "#fc4e2a", quantity: "50", label: ["5 to 10", ""], opacity: "1"},
        {color: "#feb24c", quantity: "75", label: ["10 to 15", ""], opacity: "1"},
        {color: "#ffeda0", quantity: "100", label: ["15 to 20", ""], opacity: "1"},
        {color: "#c7e9b4", quantity: "150", label: ["20 to 25", ""], opacity: "1"},
        {color: "#7fcdbb", quantity: "200", label: ["25 to 30", ""], opacity: "1"},
        {color: "#1d91c0", quantity: "300", label: ["30 to 35", ""], opacity: "1"},
        {color: "#0c2c84", quantity: "1000", label: ["35 or more", ""], opacity: "1"},
    ]
}, {
    title: 'Temperature',
    ParameterName: 'Tair_f_tavg',
    PropForSLD: [{
        classType: 'Below',
        color: '#0c2c84',
        value: '273'
    }, {
        color: '#1d91c0',
        range: '273 278'
    }, {
        color: '#7fcdbb',
        range: '278 283'
    }, {
        color: '#c7e9b4',
        range: '283 288'
    }, {
        color: '#ffeda0',
        range: '288 293'
    }, {
        color: '#fc4e2a',
        range: '293 298'
    }, {
        color: '#fc4e2a',
        range: '298 303'
    }, {
        classType: 'Above',
        color: '#b10026',
        value: '303'
    }],
    CustomLegend: [
        // {color: "#FFFFFF", quantity: "-9999", label: ["No Data"], opacity: "0"},
        {color: "#0c2c84", quantity: "273", label: ["less than 0°C", ""], opacity: "1"},
        {color: "#1d91c0", quantity: "278", label: ["0°C to 5°C", ""], opacity: "1"},
        {color: "#7fcdbb", quantity: "283", label: ["5°C to 10°C", ""], opacity: "1"},
        {color: "#c7e9b4", quantity: "288", label: ["10°C to 15°C", ""], opacity: "1"},
        {color: "#ffeda0", quantity: "293", label: ["15°C to 20°C", ""], opacity: "1"},
        {color: "#feb24c", quantity: "298", label: ["20°C to 25°C", ""], opacity: "1"},
        {color: "#fc4e2a", quantity: "403", label: ["25°C to 30°C", ""], opacity: "1"},
        {color: "#b10026", quantity: "500", label: ["30°C or more", ""], opacity: "1"},
    ]
}, {
    title: "Evapotranspiration",
    ParameterName: 'Evap_tavg',
    PropForSLD: [{
        classType: 'Below',
        color: '#b10026',
        value: '5'
    }, {
        color: '#fc4e2a',
        range: '5 10'
    }, {
        color: '#feb24c',
        range: '10 15'
    }, {
        color: '#ffeda0',
        range: '15 20'
    }, {
        color: '#c7e9b4',
        range: '20 25'
    }, {
        color: '#7fcdbb',
        range: '25 50'
    }, {
        color: '#1d91c0',
        range: '50 75'
    }, {
        classType: 'Above',
        color: '#0c2c84',
        value: '75'
    }],
    CustomLegend: [
        // {color: "#FFFFFF", quantity: "-9999", label: ["No Data"], opacity: "0"},
        {color: "#b10026", quantity: "5", label: ["less than 5", ""], opacity: "1"},
        {color: "#fc4e2a", quantity: "10", label: ["5 to 10", ""], opacity: "1"},
        {color: "#feb24c", quantity: "15", label: ["10 to 15", ""], opacity: "1"},
        {color: "#ffeda0", quantity: "20", label: ["15 to 20", ""], opacity: "1"},
        {color: "#c7e9b4", quantity: "25", label: ["20 to 25", ""], opacity: "1"},
        {color: "#7fcdbb", quantity: "50", label: ["25 to 30", ""], opacity: "1"},
        {color: "#1d91c0", quantity: "75", label: ["30 to 35", ""], opacity: "1"},
        {color: "#0c2c84", quantity: "100", label: ["35 or more", ""], opacity: "1"},
    ]
}, {
    title: 'Soil Moisture',
    ParameterName: 'SoilMoist_inst',
    PropForSLD: [{
        classType: 'Below',
        color: '#b10026',
        value: '5'
    }, {
        color: '#fc4e2a',
        range: '5 10'
    }, {
        color: '#feb24c',
        range: '10 15'
    }, {
        color: '#ffeda0',
        range: '15 20'
    }, {
        color: '#c7e9b4',
        range: '20 25'
    }, {
        color: '#7fcdbb',
        range: '25 30'
    }, {
        color: '#1d91c0',
        range: '30 35'
    }, {
        classType: 'Above',
        color: '#0c2c84',
        value: '35'
    }],
    CustomLegend: [
        // {color: "#FFFFFF", quantity: "-9999", label: ["No Data"], opacity: "0"},
        {color: "#b10026", quantity: "5", label: ["less than 5", ""], opacity: "1"},
        {color: "#fc4e2a", quantity: "10", label: ["5 to 10", ""], opacity: "1"},
        {color: "#feb24c", quantity: "15", label: ["10 to 15", ""], opacity: "1"},
        {color: "#ffeda0", quantity: "20", label: ["15 to 20", ""], opacity: "1"},
        {color: "#c7e9b4", quantity: "25", label: ["20 to 25", ""], opacity: "1"},
        {color: "#7fcdbb", quantity: "30", label: ["25 to 30", ""], opacity: "1"},
        {color: "#1d91c0", quantity: "35", label: ["30 to 35", ""], opacity: "1"},
        {color: "#0c2c84", quantity: "100", label: ["35 or more", ""], opacity: "1"},
    ]
}];

let SPIDataCurrent = {
    title: 'SPI',
    ParameterName: 'spi',
    PropForSLD: [{
        classType: 'Below',
        color: '#b10026',
        value: '-2'
    }, {
        color: '#fc4e2a',
        range: '-2 -1.5'
    }, {
        color: '#feb24c',
        range: '-1.5 -1'
    }, {
        color: '#c7e9b4',
        range: '-1 1'
    }, {
        color: '#7fcdbb',
        range: '1 1.5'
    }, {
        color: '#1d91c0',
        range: '1.5 2'
    }, {
        classType: 'Above',
        color: '#0c2c84',
        value: '2'
    }],
    CustomLegend: [
        {color: "#b10026", quantity: "-2", label: ["-2 and less", "Extremely Dry"], opacity: "1"},
        {color: "#fc4e2a", quantity: "-1.5", label: ["-2 to -1.5", "Severely Dry"], opacity: "1"},
        {color: "#feb24c", quantity: "-1", label: ["-1.5 to -1", "Moderately Dry"], opacity: "1"},
        {color: "#c7e9b4", quantity: "1", label: ["-1 to 1", "Near Normal"], opacity: "1"},
        {color: "#7fcdbb", quantity: "1.5", label: ["1 to 1.5", "Moderately Wet"], opacity: "1"},
        {color: "#1d91c0", quantity: "2", label: ["1.5 to 2", "Severely Wet"], opacity: "1"},
        {color: "#0c2c84", quantity: "3", label: ["2 and above", "Extremely Wet"], opacity: "1"},
    ]
}

let LegendParameter = '?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&WIDTH=10&HEIGHT=230&SLD_BODY=';
app.SLDASYearMonth = {};
app.SPIYearMonth = {};
app.addMonthsLayers = async function () {
    let Periodicity = 'mm';
    let currentResponse = await app.makeRequest('GET', currentCatalogMonthly);
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(currentResponse, "text/xml");
    let Datasetcollection = xmlDoc.querySelectorAll('dataset[name$=".nc"]');
    let currentMonthly = [];
    for (i of Datasetcollection) {
        let fileName = i.getAttribute('name');
        currentMonthly.push(fileName);
    }

    let sortedMonth = currentMonthly.sort();

    let selectedMonthFileList = [];
    sortedMonth.forEach(function (value) {
        let currentYear = parseInt(value.slice(6, 10));
        let currentMonth = parseInt(value.slice(10, 12)) - 1;
        let currentDate = new Date(currentYear, currentMonth);
        if (currentDate >= app.threddsLayer.startDate && currentDate <= app.threddsLayer.endDate) {
            selectedMonthFileList.push(value);
        }
    });

    let currentMonthWMS = [];
    selectedMonthFileList.forEach(function (obj) {
        currentMonthWMS.push(threddDataSource + '/wms/sldas/monthly/' + obj);
    });

    let dateisoFormatForLevelFormatter = function (isoDate) {
        let dateObj = Date.parseISO8601(isoDate)
        let FullYear = dateObj.getFullYear().toString();
        let FullMonth = dateObj.getMonth();
        return FullYear + '-' + AllMonths[FullMonth]
    }

    for (kk of sldasCurrent) {
        let sld = getSLDForThredds(kk.ParameterName, kk.PropForSLD);
        addLayerToMap(kk.ParameterName + '__' + Periodicity, kk.title, currentMonthWMS, sld, true, true, kk.ParameterName, Periodicity, dateisoFormatForLevelFormatter, kk.CustomLegend)
    }
}

app.addDekadLayers = async function () {
    let Periodicity = 'dd'
    let currentDekadResponse = await app.makeRequest('GET', currentCatalogDekad);
    let parserDekad = new DOMParser();
    let xmlDocDekad = parserDekad.parseFromString(currentDekadResponse, "text/xml");
    let DatasetcollectionDekad = xmlDocDekad.querySelectorAll('dataset[name$=".nc"]');
    let currentDekad = [];
    for (i of DatasetcollectionDekad) {
        let fileName = i.getAttribute('name');
        currentDekad.push(fileName);
    }

    let sortedDekadList = currentDekad.sort();

    let selectedFileList = [];
    sortedDekadList.forEach(function (value) {
        let currentYear = parseInt(value.slice(6, 10));
        let currentMonth = parseInt(value.slice(10, 12)) - 1;
        let currentDate = new Date(currentYear, currentMonth);
        if (currentDate >= app.threddsLayer.startDate && currentDate <= app.threddsLayer.endDate) {
            selectedFileList.push(value);
        }
    });

    let currentDekadWMS = [];
    selectedFileList.forEach(function (obj) {
        currentDekadWMS.push(threddDataSource + '/wms/sldas/dekad/' + obj);
    });


    //*****************************************************


    let dateisoFormatForLevelFormatter = function (isoDate) {
        var dt = new Date(isoDate);
        if (dt.getDate() <= 10) {
            return Highcharts.dateFormat('%Y-%b-D1',dt)
        } else if (dt.getDate() <= 20) {
            return Highcharts.dateFormat('%Y-%b-D2',dt)
        } else {
            return Highcharts.dateFormat('%Y-%b-D3',dt)
        }
    }

    for (kk of sldasCurrent) {
        let sld = getSLDForThredds(kk.ParameterName, kk.PropForSLD);
        addLayerToMap(kk.ParameterName + '__' + Periodicity, kk.title, currentDekadWMS, sld, true, true, kk.ParameterName, Periodicity, dateisoFormatForLevelFormatter, kk.CustomLegend)
    }

}

app.add3MonthLayers = async function () {
    let Periodicity = "3m";
    let current3MonthsResponse = await app.makeRequest('GET', currentCatalog3Months);
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(current3MonthsResponse, "text/xml");
    let Datasetcollection = xmlDoc.querySelectorAll('dataset[name$=".nc"]');
    let current3Months = [];
    for (i of Datasetcollection) {
        let fileName = i.getAttribute('name');
        if (fileName.length === 19) {
            current3Months.push(fileName);
        }
    }
    let sorted3Months = current3Months.sort();

    let selectedFileList = [];
    sorted3Months.forEach(function (value) {
        let currentYear = parseInt(value.slice(6, 10));
        let currentMonth = parseInt(value.slice(10, 12)) - 1;
        let currentDate = new Date(currentYear, currentMonth);
        if (currentDate >= app.threddsLayer.startDate && currentDate <= app.threddsLayer.endDate) {
            selectedFileList.push(value);
        }
    });
    let current3MonthWMS = [];
    selectedFileList.forEach(function (obj) {
        current3MonthWMS.push(threddDataSource + '/wms/sldas/quartly/' + obj);
    });
    //*****************************************************************

    let dateisoFormatForLevelFormatter = function (isoDate) {
        let dateObj = Date.parseISO8601(isoDate);
        let FullYear = dateObj.getFullYear().toString();
        let FullMonth = dateObj.getMonth();
        let threeMonths = '';
        if (FullMonth === 11) {
            threeMonths = AllMonths[FullMonth].slice(0, 1) + AllMonths[0].slice(0, 1) + AllMonths[1].slice(0, 1);
        } else if (FullMonth === 10) {
            threeMonths = AllMonths[FullMonth].slice(0, 1) + AllMonths[FullMonth + 1].slice(0, 1) + AllMonths[0].slice(0, 1);
        } else {
            threeMonths = AllMonths[FullMonth].slice(0, 1) + AllMonths[FullMonth + 1].slice(0, 1) + AllMonths[FullMonth + 2].slice(0, 1);
        }
        return FullYear + '-' + threeMonths;
    }

    for (kk of sldasCurrent) {
        let sld = getSLDForThredds(kk.ParameterName, kk.PropForSLD);
        addLayerToMap(kk.ParameterName + '__' + Periodicity, kk.title, current3MonthWMS, sld, true, true, kk.ParameterName, Periodicity, dateisoFormatForLevelFormatter, kk.CustomLegend)
    }
}

//-------------------------SPI ----------------------------------------
app.addSPIMonthsLayers = async function () {
    let Periodicity = 'mm';
    let currentResponse = await app.makeRequest('GET', CurrentCatalogMonthlySPI);
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(currentResponse, "text/xml");
    let Datasetcollection = xmlDoc.querySelectorAll('dataset[name$=".nc"]');
    let currentMonthly = [];
    for (i of Datasetcollection) {
        let fileName = i.getAttribute('name');
        currentMonthly.push(fileName);
    }
    let sortedMonth = currentMonthly.sort();
    let selectedMonthFileList = [];
    sortedMonth.forEach(function (value) {
        let currentYear = parseInt(value.slice(0, 4));
        let currentMonth = parseInt(value.slice(4, 6)) - 1;
        let currentDate = new Date(currentYear, currentMonth);
        if (currentDate >= app.threddsLayer.startDate && currentDate <= app.threddsLayer.endDate) {
            selectedMonthFileList.push(value);
        }
    });
    let currentMonthWMS = [];
    selectedMonthFileList.forEach(function (obj) {
        currentMonthWMS.push(threddDataSource + '/wms/sldas/SPIMonthly/' + obj);
    });

    // let currentMonthWMS = threddDataSource + '/wms/sldas/SPIMonthly/' + selectedMonthFile
    let dateisoFormatForLevelFormatter = function (isoDate) {
        let dateObj = Date.parseISO8601(isoDate);
        let FullYear = dateObj.getFullYear().toString();
        let FullMonth = dateObj.getMonth();
        return FullYear + '-' + AllMonths[FullMonth];
    }

    let kk = SPIDataCurrent;
    let sld = getSLDForThredds(kk.ParameterName, kk.PropForSLD);
    addLayerToMap(kk.ParameterName + '__' + Periodicity, kk.title, currentMonthWMS, sld, true, true, kk.ParameterName, Periodicity, dateisoFormatForLevelFormatter, kk.CustomLegend)
}

app.addSPIDekadLayers = async function () {
    let Periodicity = 'dd'
    let currentDekadResponse = await app.makeRequest('GET', CurrentCatalogDekadSPI);
    let parserDekad = new DOMParser();
    let xmlDocDekad = parserDekad.parseFromString(currentDekadResponse, "text/xml");
    let DatasetcollectionDekad = xmlDocDekad.querySelectorAll('dataset[name$=".nc"]');
    let currentDekad = [];
    for (i of DatasetcollectionDekad) {
        let fileName = i.getAttribute('name');
        currentDekad.push(fileName);
    }
    let sortedDekadList = currentDekad.sort();
    let selectedFileList = [];
    sortedDekadList.forEach(function (value) {
        let currentYear = parseInt(value.slice(0, 4));
        let currentMonth = parseInt(value.slice(4, 6)) - 1;
        let currentDate = new Date(currentYear, currentMonth);
        if (currentDate >= app.threddsLayer.startDate && currentDate <= app.threddsLayer.endDate) {
            selectedFileList.push(value);
        }
    });
    let currentDekadWMS = [];
    selectedFileList.forEach(function (obj) {
        currentDekadWMS.push(threddDataSource + '/wms/sldas/SPIDekad/' + obj);
    });

    //*****************************************************


    let dateisoFormatForLevelFormatter = function (isoDate) {
        return isoDate.slice(0, 10);
    }
    let kk = SPIDataCurrent;

    let sld = getSLDForThredds(kk.ParameterName, kk.PropForSLD);
    addLayerToMap(kk.ParameterName + '__' + Periodicity, kk.title, currentDekadWMS, sld, true, true, kk.ParameterName, Periodicity, dateisoFormatForLevelFormatter, kk.CustomLegend)

}

app.addSPI3MonthLayers = async function () {
    let Periodicity = "3m";
    let current3MonthsResponse = await app.makeRequest('GET', CurrentCatalog3MonthsSPI);
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(current3MonthsResponse, "text/xml");
    let Datasetcollection = xmlDoc.querySelectorAll('dataset[name$=".nc"]');
    let current3Months = [];
    for (i of Datasetcollection) {
        let fileName = i.getAttribute('name');
        if (fileName.length === 13) {
            current3Months.push(fileName);
        }
    }
    let sorted3Months = current3Months.sort();

    let selectedFileList = [];
    sorted3Months.forEach(function (value) {
        let currentYear = parseInt(value.slice(0, 4));
        let currentMonth = parseInt(value.slice(4, 6)) - 1;
        let currentDate = new Date(currentYear, currentMonth);
        if (currentDate >= app.threddsLayer.startDate && currentDate <= app.threddsLayer.endDate) {
            selectedFileList.push(value);
        }

    });
    let current3MonthWMS = [];
    selectedFileList.forEach(function (obj) {
        current3MonthWMS.push(threddDataSource + '/wms/sldas/SPIThreeMonth/' + obj);
    });
    //*****************************************************************

    // let current3MonthWMS = threddDataSource + '/wms/sldas/SPIThreeMonth/' + selected3MonthFile;

    let dateisoFormatForLevelFormatter = function (isoDate) {
        let dateObj = Date.parseISO8601(isoDate);
        let FullYear = dateObj.getFullYear().toString();
        let FullMonth = dateObj.getMonth();
        let threeMonths = '';
        if (FullMonth === 11) {
            threeMonths = AllMonths[FullMonth].slice(0, 1) + AllMonths[0].slice(0, 1) + AllMonths[1].slice(0, 1);
        } else if (FullMonth === 10) {
            threeMonths = AllMonths[FullMonth].slice(0, 1) + AllMonths[FullMonth + 1].slice(0, 1) + AllMonths[0].slice(0, 1);
        } else {
            threeMonths = AllMonths[FullMonth].slice(0, 1) + AllMonths[FullMonth + 1].slice(0, 1) + AllMonths[FullMonth + 2].slice(0, 1);
        }
        return FullYear + '-' + threeMonths;
    }
    let kk = SPIDataCurrent;

    let sld = getSLDForThredds(kk.ParameterName, kk.PropForSLD);
    addLayerToMap(kk.ParameterName + '__' + Periodicity, kk.title, current3MonthWMS, sld, true, true, kk.ParameterName, Periodicity, dateisoFormatForLevelFormatter, kk.CustomLegend);
}
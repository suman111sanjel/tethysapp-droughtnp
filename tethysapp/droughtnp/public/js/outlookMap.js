let outlookLayerList = [{
    title: 'Air Temperature',
    ParameterName: 'Tair_f_tavg',
    PropForSLD: [{
        classType: 'Below',
        label: ["less than -5", ""],
        color: '#00000000',
        value: '-5'
    }, {
        label: ["-5 to -4.5", ""], color: '#9999FF',
        range: '-5 -4.5'
    }, {
        label: ["-4.5 to -4", ""], color: '#99A7FF',
        range: '-4.5 -4'
    }, {
        label: ["-4 to -3.5", ""], color: '#9CB6FF',
        range: '-4 -3.5'
    }, {
        label: ["-3.5 to -3", ""], color: '#9CC2FF',
        range: '-3.5 -3'
    }, {
        label: ["-3 to -2.5", ""], color: '#9CD1FF',
        range: '-3 -2.5'
    }, {
        label: ["-2.5 to -2", ""], color: '#9CDEFF',
        range: '-2.5 -2'
    }, {
        label: ["-2 to -1.5", ""], color: '#9CEDFF',
        range: '-2 -1.5'
    }, {
        label: ["-1.5 to -1", ""], color: '#99FCFF',
        range: '-1.5 -1'
    }, {
        label: ["-1 to -0.5", ""], color: '#A6FFF6',
        range: '-1 -0.5'
    }, {
        label: ["-0.5 to 0", ""], color: '#B5FFE6',
        range: '-0.5 0'
    }, {
        label: ["0 to 0.5", ""], color: '#E1E1E1',
        range: '0 0.5'
    }, {
        label: ["0.5 to 1", ""], color: '#E1E1E1',
        range: '0.5 1'
    }, {
        label: ["1 to 1.5", ""], color: '#FFFFBE',
        range: '1 1.5'
    }, {
        label: ["1.5 to 2", ""], color: '#FFEBAF',
        range: '1.5 2'
    }, {
        label: ["2 to 2.5", ""], color: '#FFD37F',
        range: '2 2.5'
    }, {
        label: ["2.5 to 3", ""], color: '#E69800',
        range: '2.5 3'
    }, {
        label: ["3 to 3.5", ""], color: '#FF7F7F',
        range: '3 3.5'
    }, {
        label: ["3.5 to 4", ""], color: '#E64C00',
        range: '3.5 4'
    }, {
        label: ["4 to 4.5", ""], color: '#A83800',
        range: '4 4.5'
    }, {
        label: ["4.5 to 5", ""], color: '#732600',
        range: '4.5 5'
    }, {
        classType: 'Above',
        label: ["5 or more", ""], color: '#00000000',
        value: '5'
    }],
    lagendImage: "/static/"+TethysAppName+"/images/legend/FinalNewAirTemperature.jpg"
}, {
    title: 'Rainfall flux',
    ParameterName: 'Rainf_f_tavg',
    PropForSLD: [{
        classType: 'Below',
        label: ["less than -2.5", ""],
        color: '#00000000',
        value: '-2.5'
    }, {
        label: ["-2.5 to -2", ""], color: '#C2523C',
        range: '-2.5 -2'
    }, {
        label: ["-2 to -1.5", ""], color: '#FFAA01',
        range: '-2 -1.5'
    }, {
        label: ["-1.5 to -1", ""], color: '#FFD380',
        range: '-1.5 -1'
    }, {
        label: ["-1 to -0.5", ""], color: '#FEFF73',
        range: '-1 -0.5'
    }, {
        label: ["-0.5 to 0", ""], color: '#E1E1E1',
        range: '-0.5 0'
    }, {
        label: ["0 to 0.5", ""], color: '#E1E1E1',
        range: '0 0.5'
    }, {
        label: ["0.5 to 1", ""], color: '#E9FFBE',
        range: '0.5 1'
    }, {
        label: ["1 to 1.5", ""], color: '#7BED01',
        range: '1 1.5'
    }, {
        label: ["1.5 to 2", ""], color: '#21DD00',
        range: '1.5 2'
    }, {
        label: ["2 to 2.5", ""], color: '#0ACC2E',
        range: '2 2.5'
    }, {
        label: ["2.5 to 3", ""], color: '#17B568',
        range: '2.5 3'
    }, {
        label: ["3 to 3.5", ""], color: '#1E9B89',
        range: '3 3.5'
    }, {
        label: ["3.5 to 4", ""], color: '#1A828F',
        range: '3.5 4'
    }, {
        label: ["4 to 4.5", ""], color: '#135784',
        range: '4 4.5'
    }, {
        classType: 'Above',
        label: ["4.5 or more", ""], color: '#00000000',
        value: '4.5'
    }],
    lagendImage: "/static/"+TethysAppName+"/images/legend/final_rain.jpg"

}, {
    title: "Soil moisture content",
    ParameterName: 'SoilMoist_inst',
    PropForSLD: [{
        classType: 'Below',
        label: ["less than -2.5", ""],
        color: '#00000000',
        value: '-2.5'
    }, {
        label: ["-2.5 to -2", ""], color: '#C2523C',
        range: '-2.5 -2'
    }, {
        label: ["-2 to -1.5", ""], color: '#FFAA01',
        range: '-2 -1.5'
    }, {
        label: ["-1.5 to -1", ""], color: '#FFD380',
        range: '-1.5 -1'
    }, {
        label: ["-1 to -0.5", ""], color: '#FEFF73',
        range: '-1 -0.5'
    }, {
        label: ["-0.5 to 0", ""], color: '#E1E1E1',
        range: '-0.5 0'
    }, {
        label: ["0 to 0.5", ""], color: '#E1E1E1',
        range: '0 0.5'
    }, {
        label: ["0.5 to 1", ""], color: '#E9FFBE',
        range: '0.5 1'
    }, {
        label: ["1 to 1.5", ""], color: '#7BED01',
        range: '1 1.5'
    }, {
        label: ["1.5 to 2", ""], color: '#21DD00',
        range: '1.5 2'
    }, {
        label: ["2 to 2.5", ""], color: '#0ACC2E',
        range: '2 2.5'
    }, {
        label: ["2.5 to 3", ""], color: '#17B568',
        range: '2.5 3'
    }, {
        label: ["3 to 3.5", ""], color: '#1E9B89',
        range: '3 3.5'
    }, {
        label: ["3.5 to 4", ""], color: '#1A828F',
        range: '3.5 4'
    }, {
        label: ["4 to 4.5", ""], color: '#135784',
        range: '4 4.5'
    }, {
        classType: 'Above',
        label: ["4.5 or more", ""], color: '#00000000',
        value: '4.5'
    }],
    lagendImage: "/static/"+TethysAppName+"/images/legend/soil.jpg",

}, {
    title: 'Total evapotranspiration',
    ParameterName: 'Evap_tavg',
    PropForSLD: [{
        classType: 'Below',
        label: ["less than -2.5", ""],
        color: '#00000000',
        value: '-2.5'
    }, {
        label: ["-2.5 to -2", ""], color: '#C2523C',
        range: '-2.5 -2'
    }, {
        label: ["-2 to -1.5", ""], color: '#FFAA01',
        range: '-2 -1.5'
    }, {
        label: ["-1.5 to -1", ""], color: '#FFD380',
        range: '-1.5 -1'
    }, {
        label: ["-1 to -0.5", ""], color: '#FEFF73',
        range: '-1 -0.5'
    }, {
        label: ["-0.5 to 0", ""], color: '#E1E1E1',
        range: '-0.5 0'
    }, {
        label: ["0 to 0.5", ""], color: '#E1E1E1',
        range: '0 0.5'
    }, {
        label: ["0.5 to 1", ""], color: '#E9FFBE',
        range: '0.5 1'
    }, {
        label: ["1 to 1.5", ""], color: '#7BED01',
        range: '1 1.5'
    }, {
        label: ["1.5 to 2", ""], color: '#21DD00',
        range: '1.5 2'
    }, {
        label: ["2 to 2.5", ""], color: '#0ACC2E',
        range: '2 2.5'
    }, {
        label: ["2.5 to 3", ""], color: '#17B568',
        range: '2.5 3'
    }, {
        label: ["3 to 3.5", ""], color: '#1E9B89',
        range: '3 3.5'
    }, {
        label: ["3.5 to 4", ""], color: '#1A828F',
        range: '3.5 4'
    }, {
        label: ["4 to 4.5", ""], color: '#135784',
        range: '4 4.5'
    }, {
        classType: 'Above',
        label: ["4.5 or more", ""], color: '#00000000',
        value: '4.5'
    }],
    lagendImage: "/static/"+TethysAppName+"/images/legend/evaporation.jpg"
}];

let LegendParameter = '?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&WIDTH=10&HEIGHT=230&SLD_BODY=';

let WMSUrl = 'http://110.34.30.197:8080/thredds/wms/saldasforecast/monthly_std_';
let ensambled = ["mean", "ens0", "ens1", "ens2", "ens3", "ens4", "ens5", "ens6"];

app.loadOutlookLayers = async function () {
    let Periodicity = 'mm';
    await ensambled.forEach(async function (value) {
        await outlookLayerList.forEach(async function (kk) {
            let sld = getSLDForThredds(kk.ParameterName, kk.PropForSLD);
            let currentMonthWMS = WMSUrl + value + '.ncml';
            let dateisoFormatForLevelFormatter = function (isoDate) {
                let dateObj = Date.parseISO8601(isoDate)
                let FullYear = dateObj.getFullYear().toString();
                let FullMonth = dateObj.getMonth() + 1
                return FullYear + '-' + AllMonths[FullMonth]
            }
            await addLayerToMapOutlook(kk.ParameterName + '__' + Periodicity + '__' + value, kk.title, currentMonthWMS, sld, true, true, kk.ParameterName, Periodicity, dateisoFormatForLevelFormatter, kk.PropForSLD,kk.lagendImage)
        });
    });
    outlookLayerList.forEach(function (curObj) {
        let selectElement = document.querySelector(`select[periodicity="mm"]`);
        let option = app.createOption();
        option.setAttribute("periodicity", Periodicity);
        option.setAttribute("value", curObj.ParameterName);
        option.innerText = curObj.title;
        selectElement.append(option)
    })

}

let addLayerToMapOutlook = async function (id, title, currentMonthWMS, SLD, showlegend, showControlPanel, ParameterName, Periodicity, dateisoFormatForLevelFormatter, customLegendData,lagendImage) {
    let LegendParameter = '?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&WIDTH=10&HEIGHT=230&SLD_BODY=';
    let legendWMS = '';
    if (Array.isArray(currentMonthWMS)) {
        legendWMS = currentMonthWMS[0];
    } else {
        legendWMS = currentMonthWMS;
    }
    let customLegend = function (LegendData) {
        let outerDiv = app.createDiv('info legend legend-control');
        let span = app.createSpan("legend-text");
        let b = app.createB();
        b.innerText = title;
        span.append(b);

        let br = app.createBr();

        let table = app.createTable("legend-table");
        let tbody = app.createTbody();

        for (kk of LegendData) {
            let tr = app.createTr("legend-row");
            let td1 = app.createTd("legend-symbol");
            td1.style.backgroundColor = kk.color;
            let td2 = app.createTd("legend-text legend-label");
            td2.innerText = kk.label[0]
            let td3 = app.createTd("legend-text");
            td3.innerText = kk.label[1]

            tr.append(td1);
            tr.append(td2);
            tr.append(td3);
            tbody.prepend(tr);
        }
        table.append(tbody);
        outerDiv.append(span);
        outerDiv.append(br);
        outerDiv.append(table);
        setTimeout(function () {
            $(".thredd-layer-image-div").mouseover(function () {
                $(".legend-text").css('font-size', '15px');

            }).mouseout(function () {
                $(".legend-text").css('font-size', '10px');
            });
        }, 500);
        return outerDiv
    }

    var Newlayer = new ol.layer.TimeDimensionTile({
        id: id,
        title: title,
        visible: false,
        opacity: 1,
        // legendPath: legendWMS + LegendParameter + encodeURIComponent(SLD).toString(),
        legendPath: lagendImage,
        ThreddsDataServerVersion: 5,
        serverType: 'TDS',
        alignTimeSlider: 'left',
        timeSliderSize: 'small',
        showlegend: showlegend,
        showControlPanel: showControlPanel,
        Periodicity: Periodicity,
        dateisoFormatForLevelFormatter: dateisoFormatForLevelFormatter,
        // customLegend: customLegend,
        customLegendData: customLegendData,
        source: {
            url: currentMonthWMS,
            params: {
                'LAYERS': ParameterName,
                'SLD_BODY': SLD,
                'transparent': true
            }
        },
    });

    await Newlayer.init().then(function (val) {
        app.map.addThreddsLayer(val);
        // let l4 = new layerCheckBoxBinding(".layerCollection", Newlayer, true);
        // l4.setVisibleDivBind(false);
        app.AllBindedLayersList.push(Newlayer);
    }, (error) => console.error(error));
}

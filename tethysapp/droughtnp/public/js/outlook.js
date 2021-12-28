let threddDataSource = 'http://110.34.30.197:8080/thredds';
let currentCatalogMonthly = threddDataSource + '/catalog/sldas/monthly/catalog.xml'
let currentCatalogDekad = threddDataSource + '/catalog/sldas/dekad/catalog.xml'
let currentCatalog3Months = threddDataSource + '/catalog/sldas/quartly/catalog.xml'
let CurrentCatalogMonthlySPI = threddDataSource + '/catalog/sldas/SPIMonthly/catalog.xml'
let CurrentCatalogDekadSPI = threddDataSource + '/catalog/sldas/SPIDekad/catalog.xml'
let CurrentCatalog3MonthsSPI = threddDataSource + '/catalog/sldas/SPIThreeMonth/catalog.xml'


let AllMonths = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December"
}

app.AllBindedLayersList = [];
app.createConstants = function () {
    app.API = {
        GEOMSAPI: '/apps/' + TethysAppName + '/api/getGeomList/',
        TSAPI: '/apps/' + TethysAppName + '/api/getSpatialAverageForecast/',
    }
    app.DEFAULTS = {
        COUN: countryName,
        AdminLevel: DefaultAdminLevel,
        PERIOD: 'mm',
        YEAR: new Date().getFullYear() + '',
        ENSEMBLE: 'mean',
    }
    app.COLORS = {
        MAXTEMP: '#f97070',
        MINTEMP: '#70a5f9',
        MINRAIN: 'orange',
        MAXRAIN: '',
        AGGRAIN: 'purple',
        NDVI: 'rgba(19,175,8,0.7)',
        NDVIANOM: 'rgba(19, 175, 8, 0.7)',
        SOILMOIST: 'rgba(210, 105, 30, 0.7)',
        EVAP: '',
        SPI1: '',
        LTA: 'black'
    }
}

app.parseParameters = function () {
    function getParam(name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results == null) {
            return null;
        } else {
            return decodeURI(results[1]) || 0;
        }
    }

    app.baseURL = document.location.href.split('?')[0];
    app.URLparams = {};
    app.URLparams['d'] = getParam('d');
    app.URLparams['e'] = getParam('e');
    let flagChangeURL = false;
    let url = document.location.href;

    // redirect to jumla district if none is selected
    if (!app.URLparams['d']) {
        let ddist = app.DEFAULTS.AdminLevel;
        if (url.includes('?')) {
            url = url + "&d=" + ddist;
        } else {
            url = url + "?d=" + ddist;
        }
        app.URLparams['d'] = ddist;
        flagChangeURL = true;
    }
    if (!app.URLparams['e']) {
        let defaultPeriod = app.DEFAULTS.ENSEMBLE;
        if (url.includes('?')) {
            url = url + "&e=" + defaultPeriod;
        } else {
            url = url + "?e=" + defaultPeriod;
        }
        app.URLparams['e'] = defaultPeriod;
        flagChangeURL = true;
    }

    if (flagChangeURL) window.history.replaceState({}, 'Nepal', url);

    // activate static options based on URL
    // for periodicity option

    $("input[name=periodicity][value=" + app.URLparams['p'] + "]").prop("checked", true);

}

app.initilizeMap = function () {
    var bounds = [8863793.55240429, 3010895.134840412, 9912517.471608875, 3571840.4869730966];
    var zoomToExtentControl = new ol.control.ZoomToExtent({
        extent: bounds
    });
    app.view = new ol.View(defaultView);

    var OSMLayer = new ol.layer.Tile({
        id: "osm",
        title: "Open Street Map",
        visible: true,
        source: new ol.source.OSM(),
        mask: 0
    });

    var HighLightedLayerSource = new ol.source.Vector();
    app.HighLightedLayer = new ol.layer.Vector({
        id: "highlightedlayer",
        title: "highlightedlayer",
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#000000',
                width: 1.5
            }),
            fill: new ol.style.Fill({
                color: 'rgba(200, 214, 229,0)'
                // color:'#1abc9c'
            })
        }),
        source: HighLightedLayerSource,
        mask: 0
    });
    app.HighLightedLayer.setZIndex(99);

    var layers = [];
    layers.push(OSMLayer);
    layers.push(app.HighLightedLayer);
    app.map = new ol.Map({
        target: 'map-container',
        layers: layers,
        controls: ol.control.defaults({
            attribution: false
        }).extend([]),
        view: app.view,
        loadTilesWhileAnimating: true,
    });

};

app.createHelpers = function () {
    //format ints with padding

    //function to populate l1
    app.populateL1 = async function (e) {
        // $("#selectl1").empty();
        // app.geomListLoading = true
        $("button").attr('disabled', 'disabled');
        // let l0 = app.URLparams['c'];
        // $("#selectl0").val(l0);
        let Level1AndLevel2Data = await app.makeRequest('GET', app.API.GEOMSAPI + '?country=' + app.DEFAULTS.COUN);
        let resp = JSON.parse(Level1AndLevel2Data)


        // $.ajax({
        //     url: app.API.GEOMSAPI,
        //     data: {country: l0},
        //     dataType: 'json',
        //     success: function (resp) {
        resp = resp.sort();
        var l1names = [];
        var l2names = [];
        resp.forEach(function (val) {
            if (val.substr(0, 2) == 'l1') l1names.push(val.substr(2));
            else if (val.substr(0, 2) == 'l2') l2names.push(val.substr(2));
        });
        // resp = resp.map(function(val){return val.substr(2)});
        var options = '';
        for (var i = 0; i < l1names.length; i++) {
            options += '<option value="' + l1names[i] + '">' + l1names[i].replace("_", " ") + '</option>'
        }
        $("#selectl1").html(options).val(l1names[0]);
        var options = '';
        for (var i = 0; i < l2names.length; i++) {
            options += '<option value="' + l2names[i] + '">' + l2names[i].replace("_", " ") + '</option>'
        }
        $("#selectl2").html(options).val(l2names[0]);
        let geom = app.URLparams.d;
        let lev = geom.substr(0, 2);
        let name = geom.substr(2);
        $("#bradio" + lev).attr('checked', true);
        $("#select" + lev).val(name);

        // console.log(geom, lev, name)
        //if (!resp.includes(l2)) l2 = app.DEFAULTS.DIST[l0];
        //$("#selectl2").val(l2);
        $("button").removeAttr('disabled');
        app.updateGeometry(geom);
        // app.geomListLoading = false
        // app.updateSelectCrop();
        // app.computeClicked();
        //     }
        // });

        if (lev == 'l0') {
            $("#selectl1").prop('disabled', true);
            $("#selectl2").prop('disabled', true);
        } else if (lev == 'l1') {
            $("#selectl1").prop('disabled', false);
            $("#selectl2").prop('disabled', true);
        } else {
            $("#selectl1").prop('disabled', true);
            $("#selectl2").prop('disabled', false);

        }
    }

    //process request with current options
    app.computeClicked = function (e) {
        app.updateURL();
        app.computeFunctions();

    }

    app.updateDropdownBinding = function (e) {
        var selectedIndices = [
            $('#selectindex1').val(),
            $('#selectindex2').val(),
            $('#selectindex3').val(),
            $('#selectindex4').val(),
        ];
        for (var i = 0; i < selectedIndices.length; i++) {
            $(".bound-dropdown option").removeAttr('disabled');
        }
        for (var i = 0; i < selectedIndices.length; i++) {
            for (var j = 0; j < selectedIndices.length; j++) {
                if (i == j) continue;
                var q = j + 1;
                var val = $('#selectindex' + (i + 1)).val();
                $("#selectindex" + q + " option[value=" + val + "]").attr('disabled', 'disabled');
            }
        }
    }

    // update the URL of application based on options
    app.updateURL = function () {
        var geom = app.URLparams['d'];
        // let period = $("#selectdataset").val();
        let selectedEn = $("#selecten").val();
        // let indices = $("#selectindices").val().join(',');
        app.URLparams = {
            'd': geom,
            'e': selectedEn,
        }
        let url = app.baseURL + "?d=" + geom + "&e=" + selectedEn;
        if (document.location.href != url) window.history.pushState({}, 'Nepal', url);
        else window.history.replaceState({}, 'Nepal', url);
    }

    app.flyTo = function (location, zi, zf, done) {
        var duration = 1500;
//  var zoom = view.getZoom();
        var zoom = zf;
        var parts = 2;
        var called = false;

        function callback(complete) {
            --parts;
            if (called) {
                return;
            }
            if (parts === 0 || !complete) {
                called = true;
                done(complete);
            }
        }

        app.view.animate({
            center: location,
            duration: duration
        }, callback);

        app.view.animate({
            zoom: zoom - 1,
            duration: duration / 2
        }, {
            zoom: zoom,
            duration: duration / 2
        }, callback);
    }

    app.updateGeometry = async function (AdminLevel) {
        let response = await app.makeRequest('GET', '/static/' + TethysAppName + '/Shapes/' + app.DEFAULTS.COUN + '/' + AdminLevel + '.geojson')
        let fcoll = JSON.parse(response);
        var layerSelecd = app.HighLightedLayer.getSource();
        layerSelecd.clear();
        var parser = new ol.format.GeoJSON();
        var features = parser.readFeatures(fcoll, {featureProjection: 'EPSG:3857'});
        var perveiousExtent = app.view.calculateExtent();
        var zoom_pervious = app.view.getZoom();
        layerSelecd.addFeatures(features);
        var resultExtent = app.HighLightedLayer.getSource().getExtent();
        app.view.fit(resultExtent, app.map.getSize());
        var zoom_final = app.view.getZoom();
        app.view.fit(perveiousExtent, app.map.getSize());
        var location = [(resultExtent[0] + resultExtent[2]) / 2, (resultExtent[1] + resultExtent[3]) / 2]
        app.flyTo(location, zoom_pervious, zoom_final, function () {
        });

    }

    app.layerswitcher = function () {
        app.LayerSwitcherSelect = app.createDiv('select-layers-list');
        app.LayerSwitcherSelect.setAttribute("id", "select-layer-switcher");

        let selectLayerListdd = app.createSelect('form-control form-control-sm selectlayers');
        selectLayerListdd.setAttribute("periodicity", "dd");
        let option = app.createOption();
        option.setAttribute("value", "0");
        option.innerText = "No Layer";
        selectLayerListdd.append(option);
        app.LayerSwitcherSelect.append(selectLayerListdd);

        let selectLayerListmm = app.createSelect('form-control form-control-sm selectlayers');
        selectLayerListmm.setAttribute("periodicity", "mm");
        let optionmm = app.createOption();
        optionmm.setAttribute("value", "0");
        optionmm.innerText = "No Layer";
        selectLayerListmm.append(optionmm);

        app.LayerSwitcherSelect.append(selectLayerListmm);

        let selectLayerList3m = app.createSelect('form-control form-control-sm selectlayers');
        selectLayerList3m.setAttribute("periodicity", "3m");
        let option3m = app.createOption();
        option3m.setAttribute("value", "0");
        option3m.innerText = "No Layer";
        selectLayerList3m.append(option3m);

        app.LayerSwitcherSelect.append(selectLayerList3m);

        selectLayerListdd.style.display = 'none';
        selectLayerListmm.style.display = 'display';
        selectLayerList3m.style.display = 'none';

        let olOverlaycontainer = document.querySelector('div.ol-overlaycontainer-stopevent');
        olOverlaycontainer.append(app.LayerSwitcherSelect);
    }

    app.APIParameters = function (variable) {
        let now = d = new Date();
        let date = now.getFullYear().toString() + "-" + now.getMonth().toString() + "-" + now.getDay().toString();
        let param = {
            // "date": date,
            "anominterval": "monthly",
            "ensemble": "_" + app.URLparams.e + ".ncml",
            "country": app.DEFAULTS.COUN,
            geom: app.URLparams.d,
            "loc_type": "geojson",
            variable: variable
        }
        return param
    }

    // app.layers
    app.DateTickInterval__mm = 30 * 24 * 3600 * 1000; //Month
    app.DateTickInterval__3m = 30 * 24 * 3600 * 1000; //Month
    app.DateTickInterval__dd = 10 * 24 * 3600 * 1000; //10 days

    app.DateFormatter__mm = function () {
        return Highcharts.dateFormat('%Y-%b', this.value)
    }
    app.DateFormatter__3m = function () {
        let monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        var dt = new Date(this.value);
        var str = dt.getFullYear().toString() + "-";
        str += monthNames[dt.getMonth()][0];
        dt.setDate(1);
        dt.setMonth(dt.getMonth() + 1);
        str += monthNames[dt.getMonth()][0];
        dt.setMonth(dt.getMonth() + 1);
        str += monthNames[dt.getMonth()][0];
        return str;
        // return Highcharts.dateFormat('%Y-%b', this.value)
    }
    app.DateFormatter__dd = function () {
        var dt = new Date(this.value);
        if (dt.getDate() <= 10) {
            return Highcharts.dateFormat('%Y-%b-D1', this.value)
        } else if (dt.getDate() <= 20) {
            return Highcharts.dateFormat('%Y-%b-D2', this.value)
        } else {
            return Highcharts.dateFormat('%Y-%b-D3', this.value)
        }
    }

    app.TickPositioner__mm = function () {
        return undefined
    }
    app.TickPositioner__3m = function () {
        return undefined
    }
    app.TickPositioner__dd = function (data) {
        let PositionList = [];
        data.forEach(function (val) {
            PositionList.push(val[0])
        })
        let TickPositionerFunction = function () {
            return PositionList;
        }
        return TickPositionerFunction
    }

    app.TooltipFormater__dd = function () {
        let funn = function () {
            var dt = new Date(this.x);
            let customDate = ''
            if (dt.getDate() <= 10) {
                customDate = Highcharts.dateFormat('%Y-%b-D1', this.x);
            } else if (dt.getDate() <= 20) {
                customDate = Highcharts.dateFormat('%Y-%b-D2', this.x);
            } else {
                customDate = Highcharts.dateFormat('%Y-%b-D3', this.x);
            }
            let htmlStr = customDate + '<br/>';
            this.points.forEach((val) => {
                let aa = '<span style="color:' + val.color + '">●</span> ' + val.series.name + ': <b>' + val.y + val.series.tooltipOptions.valueSuffix + '</b><br/>';
                htmlStr = htmlStr + aa;
            });
            return htmlStr
        }
        return funn
    }
    app.TooltipFormater__mm = function () {
        let funn = function () {
            let customDate = Highcharts.dateFormat('%Y-%b', this.x);
            let htmlStr = customDate + '<br/>';
            this.points.forEach((val) => {
                let aa = '<span style="color:' + val.color + '">●</span> ' + val.series.name + ': <b>' + val.y + val.series.tooltipOptions.valueSuffix + '</b><br/>';
                htmlStr = htmlStr + aa;
            });
            return htmlStr
        }
        return funn
    }
    app.TooltipFormater__3m = function () {
        let funn = function () {
            let monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            var dt = new Date(this.x);
            dt.setDate(1);
            dt.setMonth(dt.getMonth() + 1);
            var str = dt.getFullYear().toString() + "-";
            str += monthNames[dt.getMonth()][0];
            dt.setDate(1);
            dt.setMonth(dt.getMonth() + 1);
            str += monthNames[dt.getMonth()][0];
            dt.setMonth(dt.getMonth() + 1);
            str += monthNames[dt.getMonth()][0];
            let customDate = str;
            let htmlStr = customDate + '<br/>';
            this.points.forEach((val) => {
                let aa = '<span style="color:' + val.color + '">●</span> ' + val.series.name + ': <b>' + val.y + val.series.tooltipOptions.valueSuffix + '</b><br/>';
                htmlStr = htmlStr + aa;
            });
            return htmlStr
        }
        return funn
    }

    app.ShowLoadingOnUI = function (index) {
        $('#chart' + index.toString()).html('<div class="vertically-center" ><div  class="spinner-border text-primary" role="status">\n' +
            '  <span class="sr-only">Loading...</span>\n' +
            '</div></div></div>');
    }
    app.CollectHighchartRequiredInfo = function (param, mean_data) {
        let tickInterval = app["DateTickInterval__" + param.interval];
        let Dateformater = app["DateFormatter__" + param.interval];
        let TickPositioner = app["TickPositioner__" + param.interval](mean_data);
        let TootTipFormatter = app["TooltipFormater__" + param.interval]();
        return {tickInterval, Dateformater, TickPositioner, TootTipFormatter}
    }
    app.LoadLTSDataAndPlot = async function (param, valueSuffix, HCObj) {
        let responseLTS = await app.makeRequest('GET', app.API.LTAAPI + '?params=' + JSON.stringify(param));
        let ParseResponseLTS = JSON.parse(responseLTS);
        let roundedAndAccumulatedDataLTS = app.getAccumulated(ParseResponseLTS.time_series);
        let ser = {
            name: "Long Term Average",
            type: 'spline',
            yAxis: 1,
            data: roundedAndAccumulatedDataLTS.mean.mean_data,
            tooltip: {
                valueSuffix: valueSuffix
            },
            color: '#2d2d2d'
        }
        HCObj.addSeries(ser);
    }

    app.getAccumulated = function (obj) {
        let keyList = Object.keys(obj);
        let AccumulatedObj = {}
        keyList.forEach(function (key) {
            let currentObj = obj[key];
            let currentRounded = [];
            let newArray = [];
            currentObj.reduce((accumulator, currentValue, currentIndex, array) => {
                let roundedValueOrg = parseFloat(currentValue[1].toFixed(4))
                let newAccumulated = parseFloat((accumulator + roundedValueOrg).toFixed(4))
                currentRounded.push([currentValue[0], roundedValueOrg])
                newArray.push([currentValue[0], newAccumulated])
                return newAccumulated
            }, 0);
            AccumulatedObj[key] = newArray;
            obj[key] = currentRounded;
        });
        return {mean: obj, meanAccumulated: AccumulatedObj}
    }

    app.highchartObjMeanAndAccumulated = function (objParam) {
        let obj = {
            title: {
                text: objParam.title,
                align: 'left',
                style: {"fontSize": "14px"}
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: { // don't display the dummy year
                    month: '%e. %b',
                    year: '%b'
                },
                title: {
                    text: ''
                },
                tickInterval: objParam.tickInterval,
                tickPositioner: objParam.TickPositioner,
                labels: {
                    formatter: objParam.Dateformater
                }
            },
            yAxis: [{ // Primary yAxis
                labels: {
                    format: '{value}',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                },
                title: {
                    text: objParam.yAxisAccumulatedTitle,
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                },
                opposite: true
            }, { // Secondary yAxis
                title: {
                    text: objParam.yAxisMeanTitle,
                    style: {
                        color: '#4b4a4a'
                    }
                },
                labels: {
                    format: '{value}',
                    style: {
                        color: '#4b4a4a'
                    }
                }
            }],
            tooltip: {
                shared: true,
                formatter: objParam.TootTipFormatter
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: objParam.showHideLegend
            },
            series: objParam.series
        }
        return obj
    }

    app.DrawChart = function (divId, HighchartsObj) {
        if ($("#" + divId).highcharts()) {
            $("#" + divId).highcharts().destroy();
        } else {
            $("#" + divId).html('')
        }
        let obj = Highcharts.chart(divId, HighchartsObj)
        return obj;
    }

    app.onLayerDropdownChange = function () {
        let Param = $('select[periodicity="mm"]').val();
        let enSemble = $('#selecten').val();
        let Periodicity = 'mm';
        let completeId = Param + '__' + Periodicity + '__' + enSemble;
        app.AllBindedLayersList.forEach(function (currLayer) {
            let properties = currLayer.getProperties();
            if (properties.id === completeId) {
                currLayer.setVisible(true);
            } else {
                currLayer.setVisible(false);
            }
        });
    }

};

app.initiUI = function () {

    app.populateL1();
};

app.computeFunctions = async function () {
    let variables = ['Tair_f_tavg', 'Rainf_f_tavg', 'SoilMoist_inst', 'Evap_tavg'];
    let kk=0;
    for (i in variables) {
        app.ShowLoadingOnUI(kk);
        let param = app.APIParameters(variables[kk]);
        let response = await app.makeRequest('GET', app.API.TSAPI + '?params=' + JSON.stringify(param));
        let ParseResponse = JSON.parse(response);
        newBoxWhiskerPlot(ParseResponse, kk);
        kk+=1;
    }
}

function newBoxWhiskerPlot(data, index) {
    // let dataaaa = JSON.parse(data['boxplot'])
    let dataaaa = data['boxplot'];
    dataaaa.forEach(function (item, index, arr) {
        arr[index].forEach(function (item2, index2, arr2) {
            arr2[index2] = parseFloat(item2.toFixed(4));
        })
    });
    let aa = {
        chart: {
            backgroundColor: 'rgba(255,255,255,0)',
            type: 'boxplot',
            animation: true,
            zoomType: 'x',
        },
        title: {
            align: "center", text: 'Forecasted ' + data['anominterval'] + ' ' + data['name'] + ' Anomaly v Time',
            // align: 'left',
            style: {"fontSize": "14px"}
        },
        legend: {enabled: false},
        xAxis: {
            type: 'datetime',
            // categories: ['1', '2', '3', '4', '5'],
            title: {text: '',},
            tickInterval: app.DateTickInterval__mm,
            labels: {
                formatter: app.DateFormatter__mm
            }
        },
        yAxis: {title: {text: 'Z Score'}},
        credits: {
            enabled: false
        },
        series: [{
            name: data['name'],
            data: dataaaa,
            tooltip: {xDateFormat: '%A, %b %e, %Y',},
        }]
    };
    // debugger;
    app.DrawChart('chart' + index, aa)
}


app.bindControls = function () {
    // $("#selectl0").on("change", app.populateL1);
    $("input[name=level]").on("change", function (e) {
        // debugger;
        var source = e.target.id;
        var level = source.substr(-2);
        $("#selectl1").prop('disabled', true);
        $("#selectl2").prop('disabled', true);
        $("#select" + level).prop('disabled', false);

        var geom = $("#select" + level).val();
        if (level == 'l0') {
            app.updateGeometry(level + $("#select" + level).text().trim());
            app.URLparams.d = level + $("#select" + level).text().trim();
        } else {
            app.updateGeometry(level + $("#select" + level).val());
            app.URLparams.d = level + $("#select" + level).val();
        }
    });
    $("#selectl1").on("change", function (e) {
        // mapApp.updateGeometry($("#selectl0").val(), $(this).val());
        app.updateGeometry('l1' + $(this).val());
        app.URLparams.d = 'l1' + $(this).val();
        // app.updateSelectCrop();
    });
    $("#selectl2").on("change", function (e) {
        // mapApp.updateGeometry($("#selectl0").val(), $(this).val());
        app.updateGeometry('l2' + $(this).val());
        app.URLparams.d = 'l2' + $(this).val();
        // app.updateSelectCrop();
    });

    $(".compute-indices").on("click", function (e) {
        app.computeClicked(e)
    });
    $('select[periodicity="mm"]').on("change", function (e) {
        app.onLayerDropdownChange();
    });
    $('#selecten').on("change", function (e) {
        app.onLayerDropdownChange();
    });
}
// Document is ready
jQuery(async function ($) {
    app.createConstants();
    app.parseParameters();
    app.initilizeMap();
    app.createHelpers();
    app.initiUI();
    app.computeFunctions();
    app.layerswitcher();
    app.loadOutlookLayers();
    app.bindControls();
});


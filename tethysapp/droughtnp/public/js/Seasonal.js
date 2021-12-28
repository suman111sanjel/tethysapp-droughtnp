let threddDataSource = 'http://110.34.30.197:8080/thredds';
let currentCatalogMonthly = threddDataSource + '/catalog/sldas/monthly/catalog.xml'
let currentCatalogDekad = threddDataSource + '/catalog/sldas/dekad/catalog.xml'
let currentCatalog3Months = threddDataSource + '/catalog/sldas/quartly/catalog.xml'
let CurrentCatalogMonthlySPI = threddDataSource + '/catalog/sldas/SPIMonthly/catalog.xml'
let CurrentCatalogDekadSPI = threddDataSource + '/catalog/sldas/SPIDekad/catalog.xml'
let CurrentCatalog3MonthsSPI = threddDataSource + '/catalog/sldas/SPIThreeMonth/catalog.xml'

let AllMonths = {
    0: "January",
    1: "February",
    2: "March",
    3: "April",
    4: "May",
    5: "June",
    6: "July",
    7: "August",
    8: "September",
    9: "October",
    10: "November",
    11: "December"
}

let clearLayerFlag = false;

app.AllBindedLayersList = [];
app.createConstants = function () {
    app.API = {
        STATAPI: '/apps/' + TethysAppName + '/api/getJsonFromAPI/',
        LTAAPI: '/apps/' + TethysAppName + '/api/getLTAStats/',
        AREAUNDERAPI: '/apps/' + TethysAppName + '/api/getAreaUnder/',
        GEOMSAPI: '/apps/' + TethysAppName + '/api/getGeomList/',
        SEASONAGG: '/apps/' + TethysAppName + '/api/seasonagg',
        PNORMAL: '/apps/' + TethysAppName + '/api/percentageOfNormal'
    }
    app.DEFAULTS = {
        COUN: countryName,
        AdminLevel: DefaultAdminLevel,
        PERIOD: 'mm',
        YEAR: (new Date().getFullYear()).toString(),
        START: '03',
        END: '06',
        INDICES: 'rain,evap,soilMoist,tempExtreme'
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
    // app.URLparams['c'] = getParam('c');
    app.URLparams['d'] = getParam('d');
    app.URLparams['sd'] = getParam('sd');
    app.URLparams['ed'] = getParam('ed');
    app.URLparams['p'] = getParam('p');
    app.URLparams['y'] = getParam('y');
    app.URLparams['i'] = getParam('i');
    // var today = new Date();
    // var month = today.getMonth();
    // var year = app.DEFAULTS.YEAR;
    // // if month is not december, start from last year
    // // if (month < 12) year--;
    // app.URLparams['y'] = year.toString();//app.DEFAULTS.YEAR;
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

    if (!app.URLparams['p']) {
        let defaultPeriod = app.DEFAULTS.PERIOD;
        if (url.includes('?')) {
            url = url + "&p=" + defaultPeriod;
        } else {
            url = url + "?p=" + defaultPeriod;
        }
        app.URLparams['p'] = defaultPeriod;
        flagChangeURL = true;
    }

    if (!app.URLparams['i']) {
        let defaultIndices = app.DEFAULTS.INDICES;
        if (url.includes('?')) {
            url = url + "&i=" + defaultIndices;
        } else {
            url = url + "?i=" + defaultIndices;
        }
        app.URLparams['i'] = defaultIndices;
        flagChangeURL = true;
    }

    if (!app.URLparams['y']) {
        let defaultYear = app.DEFAULTS.YEAR;
        if (url.includes('?')) {
            url = url + "&y=" + defaultYear;
        } else {
            url = url + "?y=" + defaultYear;
        }
        app.URLparams['y'] = defaultYear;
        flagChangeURL = true;
    }

    if (!app.URLparams['sd']) {
        let defaultStart = app.DEFAULTS.START;
        if (url.includes('?')) {
            url = url + "&sd=" + defaultStart;
        } else {
            url = url + "?sd=" + defaultStart;
        }
        app.URLparams['sd'] = defaultStart;
        flagChangeURL = true;
    }

    if (!app.URLparams['ed']) {
        let defaultStart = app.DEFAULTS.END;
        if (url.includes('?')) {
            url = url + "&ed=" + defaultStart;
        } else {
            url = url + "?ed=" + defaultStart;
        }
        app.URLparams['ed'] = defaultStart;
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

    app.parseIntArr = function (number) {
        return parseInt(number);
    };

    app.getDateString = function (mind, year) {
        mind = parseInt(mind);
        year = parseInt(year);
        if (mind > 12) {
            return [mind - 12, year + 1].join("/");
        }
        return [mind, year].join("/");
    }

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

    app.changeDropdownForLayers = function () {
        let CurrentPeriodicity = app.URLparams.p;
        let selectlayers = document.querySelectorAll('.selectlayers');
        for (kl of selectlayers) {
            if (kl.getAttribute('periodicity') === CurrentPeriodicity) {
                kl.style.display = 'block';
                let FilterLayer = app.AllBindedLayersList.filter(function (x) {
                    return x.getProperties().id === kl.value
                })
                if (FilterLayer.length) {
                    FilterLayer[0].setVisible(true);
                }

            } else {
                kl.style.display = 'none';
                let FilterLayer = app.AllBindedLayersList.filter(function (x) {
                    return x.getProperties().id === kl.value
                })
                if (FilterLayer.length) {
                    FilterLayer[0].setVisible(false);
                }
                kl.value = '0';
            }

            // var event = new Event('change');
            // // Dispatch it.
            // kl.dispatchEvent(event, '0');
        }
    }

    // handle year change
    app.onYearChange = function (e) {
        let year = $("#selectyear").val();
        let MaxStMonth = new Date(year, 11) > new Date() ? new Date().addMonths(-1) : new Date(year, 11)
        $("#startDate").MonthPicker({
            Button: false,
            MinMonth: new Date(year, 0),
            MaxMonth: MaxStMonth,
            // MaxMonth: new Date(year, 11) < new Date().addMonths(-2) ? new Date(year, 11) : new Date().addMonths(-2),
            OnAfterChooseMonth: function (e) {
                app.onStartChanged(e);
            }
        });
        let maxMonthNumber = MaxStMonth.getMonth() + 1

        // $("#endDate").MonthPicker({ Button: false,
        //   MinMonth: new Date(year,0),
        //   MaxMonth: new Date(parseInt(year)+1,11),
        //   OnAfterChooseMonth: function( e ){app.onEndChanged(e);}});


        $("#startDate").val("01/" + year);
        if (maxMonthNumber > 9) {
            $("#endDate").val(maxMonthNumber.toString() + "/" + year);
        } else {
            $("#endDate").val("0" + maxMonthNumber.toString() + "/" + year);
        }
        // app.onStartChanged();
    }

    app.onStartChanged = function (e) {
        let sd = $('#startDate').val();
        let ed = $('#endDate').val();
        sd = sd.split("/").map(app.parseIntArr);
        ed = ed.split("/").map(app.parseIntArr);
        let nsd = new Date(sd[1], sd[0] - 1);
        let ned = new Date(ed[1], ed[0] - 1) < new Date().addMonths(-1) ? new Date(ed[1], ed[0] - 1) : new Date().addMonths(-1);
        let limitEndMin = new Date(sd[1], sd[0] - 1).addMonths(1);
        let limitEndMax = new Date(sd[1], sd[0] - 1).addMonths(11);
        let endBuffer = -1;
        if ($("input[name=periodicity]:checked").val() == '3m') endBuffer = -3;
        limitEndMax = limitEndMax < new Date().addMonths(endBuffer) ? limitEndMax : new Date().addMonths(endBuffer);
        if (((ned.getYear() - nsd.getYear()) * 12 + (ned.getMonth() - nsd.getMonth())) > 11)
            ned = nsd.addMonths(11)
        $("#endDate").val([ned.getMonth() + 1, ned.getFullYear()].join("/"));
        $("#endDate").MonthPicker({
            MinMonth: limitEndMin,
            MaxMonth: limitEndMax
        });
    }

    // handle date range change
    // app.onRangeChanged = function (e) {
    //     let sd = $('#startDate').val();
    //     let ed = $('#endDate').val();
    //     let year = parseInt($('#selectyear').val());
    //     sd = sd.split("/").map(app.parseIntArr);
    //     ed = ed.split("/").map(app.parseIntArr);
    //     // if end year is less than start year
    //     let nsd = new Date(sd[1], sd[0] - 1);
    //     let ned = new Date(ed[1], ed[0] - 1);
    //     let maxDate = new Date(year + 1, 11);
    //
    //     let dateDiff = ned - nsd;
    //     if (dateDiff <= 0) {
    //         if (sd[0] == 12 && sd[1] == year + 1) {
    //             nsd.setMonth(nsd.getMonth() - 1);
    //             $("#startDate").val([nsd.getMonth() + 1, nsd.getFullYear()].join("/"));
    //         } else {
    //             ned.setMonth(ned.getMonth() + 1);
    //             $("#endDate").val([ned.getMonth() + 1, ned.getFullYear()].join("/"));
    //         }
    //     }
    // }

    //process request with current options
    app.computeClicked = function (e) {
        app.updateURL();
        app.changeDropdownForLayers();
        if (clearLayerFlag) {
            app.removeAllLayers();
            app.addAllLayers();
        }
        clearLayerFlag = true;

        if (initialChartRequest) {
            initialChartRequest = false
        } else {
            // ChartAPIXMLHttpRequest.forEach(function (curVal){
            //    curVal.abort();
            // });
        }

        $('.select-indices-class').each(function (index, el) {
            let value = $(this).val();
            if (value === "rain") {
                app.rainFallCompute(index);
            } else if (value == 'evap') {
                app.TotalEvapCompute(index);
            } else if (value == 'soilMoist') {
                app.SoilMoistCompute(index);
            } else if (value == 'tempExtreme') {
                app.TempExtreme(index);
            } else if (value == 'NDVI') {
                app.NDVICompute(index);
            } else if (value == 'tempMean') {
                app.TempMeanCompute(index);
            } else if (value == 'ndviAnomaly') {
                app.NDVIAnomalyCompute(index)
            } else if (value == 'ch2Spi') {
                app.Ch2SpiCompute(index);
            } else if (value == 'seasonAgg') {
                app.SeasonAggCompute(index);
            } else if (value == 'pNormal') {
                app.pNormalCompute(index)
            }
        })
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

    // // update the URL of application based on options
    // app.updateURL = function () {
    //     var geom = app.URLparams['d'];
    //     let period = $("input[name=periodicity]:checked").val();
    //     let selectedIndices = [
    //         $("#selectindex1").val(),
    //         $("#selectindex2").val(),
    //         $("#selectindex3").val(),
    //         $("#selectindex4").val(),
    //     ];
    //     let indices = selectedIndices.join(',');
    //     app.URLparams = {
    //         'd': geom,
    //         'p': period,
    //         'i': indices,
    //     }
    //     let url = app.baseURL +
    //         "?d=" + geom +
    //         "&p=" + period +
    //         "&i=" + indices;
    //     if (document.location.href != url) window.history.pushState({}, countryName, url);
    //     else window.history.replaceState({}, countryName, url);
    // }


    // update the URL of application based on options
    app.updateURL = function () {
        // let l0 = app.URLparams['c'];
        var geom = app.URLparams['d'];
        // let period = $("#selectdataset").val();
        let period = $("input[name=periodicity]:checked").val();
        let year = $("#selectyear").val();
        let start = $("#startDate").val().split("/").map(app.parseIntArr);
        let end = $("#endDate").val().split("/").map(app.parseIntArr);
        if (end[1] > start[1]) end[0] += 12;
        let selectedIndices = [
            $("#selectindex1").val(),
            $("#selectindex2").val(),
            $("#selectindex3").val(),
            $("#selectindex4").val(),
        ];
        let indices = selectedIndices.join(',');
        app.URLparams = {
            'd': geom,
            'p': period,
            'y': year,
            'sd': start[0],
            'ed': end[0],
            'i': indices,
        }
        let url = app.baseURL + "?d=" + geom +
            "&p=" + period +
            "&y=" + year +
            "&sd=" + start[0] +
            "&ed=" + end[0] +
            "&i=" + indices;
        if (document.location.href != url) window.history.pushState({}, 'Nepal', url);
        else window.history.replaceState({}, 'Nepal', url);
    }

    app.fetchCropCalendar = function () {
        let sd = $("#startDate").val().split("/").map(app.parseIntArr);
        let ed = $("#endDate").val().split("/").map(app.parseIntArr);
        let year = parseInt($("#selectyear").val());

        if (ed[1] > year) ed[0] += 12;
        return [sd[0], ed[0]];
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
        selectLayerListmm.style.display = 'none';
        selectLayerList3m.style.display = 'none';
        let olOverlaycontainer = document.querySelector('div.ol-overlaycontainer-stopevent');
        olOverlaycontainer.append(app.LayerSwitcherSelect);

        document.querySelector(`.selectlayers[periodicity="${app.URLparams.p}"]`).style.display = 'block';
    }

    app.APIParameters = function (variable, DataCollectionType) {
        var calendar = app.fetchCropCalendar();
        let param = {
            "interval": app.URLparams.p,
            "year": app.URLparams.y,
            "type": "POST",
            "country": app.DEFAULTS.COUN,
            "geom": app.URLparams.d,
            "month": calendar[0],
            "range": calendar[1] - calendar[0] + 1,
            "variable": variable
        }
        return param

    }

    // app.layers
    app.DateTickInterval__mm = 30 * 24 * 3600 * 1000; //Month
    app.DateTickInterval__3m = 30 * 24 * 3600 * 1000; //Month
    app.DateTickInterval__dd = 10 * 24 * 3600 * 1000; //10 days

    app.DateFormatter__mm = function () {
        let monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        var dt = new Date(this.value);
        dt.setDate(1);
        dt.setMonth(dt.getMonth() - 1);
        return Highcharts.dateFormat('%Y-%b', dt);
    }
    app.DateFormatter__3m = function () {
        let monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        var dt = new Date(this.value);
        var str = dt.getFullYear().toString() + "-";
        dt.setDate(1);
        dt.setMonth(dt.getMonth() - 1);
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
            // dt.setMonth(dt.getMonth() + 1);
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
    app.LoadLTSDataAndPlot = async function (param, valueSuffix, HCObj, variable) {
        let responseLTS = await app.makeRequest('GET', app.API.LTAAPI + '?params=' + JSON.stringify(param));
        let ParseResponseLTS = JSON.parse(responseLTS);
        let roundedAndAccumulatedDataLTS = app.getAccumulated(ParseResponseLTS.time_series, variable);
        let ser = {
            name: "Long Term Average",
            type: 'spline',
            yAxis: 1,
            data: roundedAndAccumulatedDataLTS.mean.mean_data,
            tooltip: {
                valueSuffix: valueSuffix
            },
            color: '#2d2d2d',
            marker: {
                enabled: true,
                symbol: 'diamond'
            },
            lineWidth: 0,
            // states: {
            //     hover: {
            //         lineWidthPlus: 0
            //     }
            // }
        }
        HCObj.addSeries(ser);
    }

    app.getAccumulated = function (obj, variable) {
        let keyList = Object.keys(obj);
        let AccumulatedObj = {}
        keyList.forEach(function (key) {
            let currentObj = obj[key];
            let currentRounded = [];
            let newArray = [];
            currentObj.reduce((accumulator, currentValue, currentIndex, array) => {
                let roundedValueOrg = null;
                let newAccumulated = null;
                roundedValueOrg = parseFloat(currentValue[1].toFixed(4));
                newAccumulated = parseFloat((accumulator + roundedValueOrg).toFixed(4));
                if (variable == 'tempMin' || variable == 'tempMax' || variable == 'temp') {
                    roundedValueOrg = parseFloat(VALUESCALE.temp(roundedValueOrg).toFixed(4));
                    newAccumulated = parseFloat(VALUESCALE.temp(newAccumulated).toFixed(4));
                } else if (variable == 'emodisNdvi') {
                    roundedValueOrg = parseFloat(VALUESCALE.emodisNdvi(roundedValueOrg).toFixed(4));
                    newAccumulated = parseFloat(VALUESCALE.emodisNdvi(newAccumulated).toFixed(4));
                } else if (variable == 'ndviAnomaly') {
                    roundedValueOrg = parseFloat(VALUESCALE.ndviAnomaly(roundedValueOrg).toFixed(4));
                    newAccumulated = parseFloat(VALUESCALE.ndviAnomaly(newAccumulated).toFixed(4));
                }
                currentRounded.push([currentValue[0], roundedValueOrg]);
                newArray.push([currentValue[0], newAccumulated]);
                return newAccumulated;
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
                style: {"fontSize": "14px"},
                useHTML: true
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
                useHTML: true,
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

    app.addYearOnDropDownMenu = function () {
        let htmlStr = '';
        var year = new Date();

        for (; year.getFullYear() >= 2001;) {
            htmlStr = htmlStr + `<option value="${year.getFullYear()}">${year.getFullYear()}</option>`
            year.setFullYear(year.getFullYear() - 1);
        }
        $('#selectyear').html(htmlStr);
    }

    app.prepareDateObjForMapLayer = function () {
        let StartYear = parseInt(app.URLparams['y']);
        let EndYear = parseInt(app.URLparams['y']);
        let StartMonth = parseInt(app.URLparams['sd']) - 1;
        let EndMonth = parseInt(app.URLparams['ed']);
        if (EndMonth > 12) {
            EndYear = EndYear + 1;
            EndMonth = EndMonth - 12;
        }
        EndMonth = EndMonth - 1;
        app.threddsLayer = {
            startDate: new Date(StartYear, StartMonth),
            endDate: new Date(EndYear, EndMonth)
        }
    }
    app.removeAllLayers = function () {
        app.AllBindedLayersList.forEach(function (currLayer) {
            currLayer.setVisible(false);
        });
        $('.timeSliderDiv.custom-thredd-Scroll').html('');
        $('.time-layer-ledgend-div.custom-thredd-Scroll').html('');
        app.AllBindedLayersList.forEach(function (val) {
            val.AllLayersList.forEach(function (currentLayer) {
                app.map.removeLayer(currentLayer);
            });
        });
        app.AllBindedLayersList = [];
        $('select[periodicity="mm"]').html('<option value="0">No Layer</option>');
        $('select[periodicity="3m"]').html('<option value="0">No Layer</option>');
        $('select[periodicity="dd"]').html('<option value="0">No Layer</option>');
        app.prepareDateObjForMapLayer();
    }
    app.FormatDateForMonthPicker = function (dateObj) {
        let year = dateObj.getFullYear().toString();
        let Month = (dateObj.getMonth() + 1) > 9 ? (dateObj.getMonth() + 1).toString() : '0' + (dateObj.getMonth() + 1).toString();
        let selectedYearMonth = Month + '/' + year;
        return selectedYearMonth;
    }

    app.initilizeDateRange = function () {
        var NowObj = new Date();

        let selectedStartingDateObj = new Date(app.URLparams.y, (parseInt(app.URLparams.sd) - 1))
        let minMonthStarting = new Date(app.URLparams.y, 0);
        let maxMonthStarting = new Date(app.URLparams.y, 11);

        if (NowObj < selectedStartingDateObj) {
            selectedStartingDateObj = new Date(app.URLparams.y, 0)
            maxMonthStarting = new Date(app.URLparams.y, NowObj.getMonth());
        }

        let selectedMonthStart = app.FormatDateForMonthPicker(selectedStartingDateObj);
        app.StartDateObj = $("#startDate").MonthPicker({
            Button: false,
            SelectedMonth: selectedMonthStart,
            MinMonth: minMonthStarting,
            MaxMonth: maxMonthStarting,
            OnAfterChooseMonth: function (e) {
                app.onStartChanged(e);
            }
        });

        // let selectedMonthEnd = app.getDateString(NowCurrentDateObj.getMonth() + 1, app.URLparams.y);

        let selectedMonthEnd = app.FormatDateForMonthPicker(new Date((parseInt(app.URLparams.ed) > 12 ? (parseInt(app.URLparams.y) + 1) : (parseInt(app.URLparams.y))), (parseInt(app.URLparams.ed) > 12 ? (parseInt(app.URLparams.ed) - 13) : (parseInt(app.URLparams.ed) - 1))));
        let minMonthEnding = new Date(app.URLparams.y, app.URLparams.sd);
        let maxMonthEnding = new Date(app.URLparams.y, 11);
        app.EndDateObj = $("#endDate").MonthPicker({
            Button: false,
            SelectedMonth: selectedMonthEnd,
            MinMonth: minMonthEnding,
            MaxMonth: maxMonthEnding
        });

        // $("#startDate").val(app.getDateString(1, app.URLparams.y));
        // $("#endDate").val(app.getDateString(NowCurrentDateObj.getMonth() + 1, app.URLparams.y));
        // app.onStartChanged();
    }
};

app.initiUI = function () {

    $('.bound-dropdown').empty();


    for (var i = 0; i < INDICES.length; i++) {
        $('.bound-dropdown').append('<option value="' + INDICES[i][0] + '">' + INDICES[i][1] + '</option>');
    }

    app.addYearOnDropDownMenu();

    var indices = app.URLparams['i'].split(',');
    $('#selectindex1').val(indices[0]);
    $('#selectindex2').val(indices[1]);
    $('#selectindex3').val(indices[2]);
    $('#selectindex4').val(indices[3]);

    $('.bound-dropdown').on('change', function (e) {
        app.updateDropdownBinding(e)
    });

    app.updateDropdownBinding();
    // let selectedMonthStart = app.getDateString(1, app.URLparams.y)

    // $(".datepicker").on('change', function(e){app.onRangeChanged(e);});
    $("#selectyear").val(app.URLparams['y']);

    app.initilizeDateRange()

    app.populateL1();
};

app.computeFunctions = function () {
    app.rainFallCompute = async function (index) {
        app.ShowLoadingOnUI(index);
        let param = app.APIParameters('rain', "SLDAS");
        let response = await app.makeRequest('GET', app.API.STATAPI + '?params=' + JSON.stringify(param));
        let ParseResponse = JSON.parse(response);
        let roundedAndAccumulatedData = app.getAccumulated(ParseResponse.time_series)
        let HighchartSupporingProp = app.CollectHighchartRequiredInfo(param, roundedAndAccumulatedData.meanAccumulated.mean_data);
        let ParamObject = {
            title: 'Rainfall (mm/day)',
            yAxisAccumulatedTitle: 'Accumulated Rainfall',
            yAxisMeanTitle: 'Rainfall',
            seriesNameAccumulated: 'Accumulated Rainfall',
            dataAccumulated: roundedAndAccumulatedData.meanAccumulated.mean_data,
            tickInterval: HighchartSupporingProp.tickInterval,
            Dateformater: HighchartSupporingProp.Dateformater,
            TickPositioner: HighchartSupporingProp.TickPositioner,
            TootTipFormatter: HighchartSupporingProp.TootTipFormatter,
            showHideLegend: true,
            series: [{
                name: 'Rainfall',
                type: 'column',
                yAxis: 1,
                data: roundedAndAccumulatedData.mean.mean_data,
                tooltip: {
                    valueSuffix: ' mm/day'
                }
            }, {
                name: 'Accumulated Rainfall',
                type: 'spline',
                data: roundedAndAccumulatedData.meanAccumulated.mean_data,
                tooltip: {
                    valueSuffix: ' mm/day'
                },
                color: '#800080'
            }]
        }
        let highchartObj = app.highchartObjMeanAndAccumulated(ParamObject)
        let HCObj = app.DrawChart('chart' + index.toString(), highchartObj);
        if (param.interval != 'dd') {
            await app.LoadLTSDataAndPlot(param, " mm/day", HCObj);
        }
    }

    app.TotalEvapCompute = async function (index) {

        app.ShowLoadingOnUI(index);
        let param = app.APIParameters('evap', "SLDAS");
        let response = await app.makeRequest('GET', app.API.STATAPI + '?params=' + JSON.stringify(param));
        let ParseResponse = JSON.parse(response);
        let roundedAndAccumulatedData = app.getAccumulated(ParseResponse.time_series)
        let HighchartSupporingProp = app.CollectHighchartRequiredInfo(param, roundedAndAccumulatedData.meanAccumulated.mean_data);
        let ParamObject = {
            title: 'Total Evapotranspiration (mm/day)',
            yAxisMeanTitle: '',
            tickInterval: HighchartSupporingProp.tickInterval,
            Dateformater: HighchartSupporingProp.Dateformater,
            TickPositioner: HighchartSupporingProp.TickPositioner,
            TootTipFormatter: HighchartSupporingProp.TootTipFormatter,
            showHideLegend: param.interval != 'dd',
            series: [{
                name: 'Total Evapotranspiration',
                type: 'column',
                yAxis: 1,
                data: roundedAndAccumulatedData.mean.mean_data,
                tooltip: {
                    valueSuffix: ' mm/day'
                }
            }]
        }
        let highchartObj = app.highchartObjMeanAndAccumulated(ParamObject)
        let HCObj = app.DrawChart('chart' + index.toString(), highchartObj);
        if (param.interval != 'dd') {
            await app.LoadLTSDataAndPlot(param, " mm/day", HCObj);
        }
    }

    app.SoilMoistCompute = async function (index) {

        app.ShowLoadingOnUI(index);
        let param = app.APIParameters('soilMoist', "SLDAS");
        let response = await app.makeRequest('GET', app.API.STATAPI + '?params=' + JSON.stringify(param));
        let ParseResponse = JSON.parse(response);
        let roundedAndAccumulatedData = app.getAccumulated(ParseResponse.time_series)
        let HighchartSupporingProp = app.CollectHighchartRequiredInfo(param, roundedAndAccumulatedData.meanAccumulated.mean_data);
        let ParamObject = {
            title: 'Soil Moisture (kg/m<sup>2</sup>)',
            yAxisMeanTitle: '',
            tickInterval: HighchartSupporingProp.tickInterval,
            Dateformater: HighchartSupporingProp.Dateformater,
            TickPositioner: HighchartSupporingProp.TickPositioner,
            TootTipFormatter: HighchartSupporingProp.TootTipFormatter,
            showHideLegend: param.interval != 'dd',
            series: [{
                name: 'Soil Moisture',
                type: 'spline',
                yAxis: 1,
                data: roundedAndAccumulatedData.mean.mean_data,
                tooltip: {
                    valueSuffix: ' kg/m<sup>2</sup>'
                }, color: 'rgba(210, 105, 30, 0.7)'
            }]
        }
        let highchartObj = app.highchartObjMeanAndAccumulated(ParamObject)
        let HCObj = app.DrawChart('chart' + index.toString(), highchartObj);
        if (param.interval != 'dd') {
            await app.LoadLTSDataAndPlot(param, " kg/m<sup>2</sup>", HCObj);
        }
    }

    app.TempExtreme = async function (index) {

        app.ShowLoadingOnUI(index);

        let param1 = app.APIParameters('tempMin', "SLDAS");
        let response1 = await app.makeRequest('GET', app.API.STATAPI + '?params=' + JSON.stringify(param1));
        let ParseResponse1 = JSON.parse(response1);
        let roundedAndAccumulatedData1 = app.getAccumulated(ParseResponse1.time_series, "tempMin");

        let param2 = app.APIParameters('tempMax', "SLDAS");
        let response2 = await app.makeRequest('GET', app.API.STATAPI + '?params=' + JSON.stringify(param2));
        let ParseResponse2 = JSON.parse(response2);
        let roundedAndAccumulatedData2 = app.getAccumulated(ParseResponse2.time_series, 'tempMax');
        let HighchartSupporingProp = app.CollectHighchartRequiredInfo(param2, roundedAndAccumulatedData2.meanAccumulated.mean_data);

        let ParamObject = {
            title: 'Temperature (°C)',
            yAxisMeanTitle: '',
            tickInterval: HighchartSupporingProp.tickInterval,
            Dateformater: HighchartSupporingProp.Dateformater,
            TickPositioner: HighchartSupporingProp.TickPositioner,
            TootTipFormatter: HighchartSupporingProp.TootTipFormatter,
            showHideLegend: true,
            series: [{
                name: 'Min Temperature',
                type: 'spline',
                yAxis: 1,
                data: roundedAndAccumulatedData1.mean.min_data,
                tooltip: {
                    valueSuffix: ' °C'
                }, color: '#70a5f9'
            }, {
                name: 'Max Temperature',
                type: 'spline',
                yAxis: 1,
                data: roundedAndAccumulatedData2.mean.max_data,
                tooltip: {
                    valueSuffix: ' °C'
                }, color: '#f97070'
            }]
        }
        let highchartObj = app.highchartObjMeanAndAccumulated(ParamObject)
        let HCObj = app.DrawChart('chart' + index.toString(), highchartObj);
    }

    app.NDVICompute = async function (index) {

        app.ShowLoadingOnUI(index);

        let param1 = app.APIParameters('emodisNdvi', "SLDAS");
        let response1 = await app.makeRequest('GET', app.API.STATAPI + '?params=' + JSON.stringify(param1));
        let ParseResponse1 = JSON.parse(response1);
        let roundedAndAccumulatedData1 = app.getAccumulated(ParseResponse1.time_series, 'emodisNdvi');
        let HighchartSupporingProp = app.CollectHighchartRequiredInfo(param1, roundedAndAccumulatedData1.meanAccumulated.mean_data);

        let ParamObject = {
            title: 'NDVI',
            yAxisMeanTitle: '',
            tickInterval: HighchartSupporingProp.tickInterval,
            Dateformater: HighchartSupporingProp.Dateformater,
            TickPositioner: HighchartSupporingProp.TickPositioner,
            TootTipFormatter: HighchartSupporingProp.TootTipFormatter,
            showHideLegend: false,
            series: [{
                name: 'NDVI',
                type: 'spline',
                yAxis: 1,
                data: roundedAndAccumulatedData1.mean.mean_data,
                tooltip: {
                    valueSuffix: ''
                }, color: 'rgba(19,175,8,0.7)'
            }]
        }
        let highchartObj = app.highchartObjMeanAndAccumulated(ParamObject)
        let HCObj = app.DrawChart('chart' + index.toString(), highchartObj);
    }

    app.TempMeanCompute = async function (index) {

        app.ShowLoadingOnUI(index);
        let param = app.APIParameters('temp', "SLDAS");
        let response = await app.makeRequest('GET', app.API.STATAPI + '?params=' + JSON.stringify(param));
        let ParseResponse = JSON.parse(response);
        let roundedAndAccumulatedData = app.getAccumulated(ParseResponse.time_series, 'temp')
        let HighchartSupporingProp = app.CollectHighchartRequiredInfo(param, roundedAndAccumulatedData.meanAccumulated.mean_data);

        let ParamObject = {
            title: 'Temperature (°C)',
            yAxisMeanTitle: '',
            tickInterval: HighchartSupporingProp.tickInterval,
            Dateformater: HighchartSupporingProp.Dateformater,
            TickPositioner: HighchartSupporingProp.TickPositioner,
            TootTipFormatter: HighchartSupporingProp.TootTipFormatter,
            showHideLegend: param.interval != 'dd',
            series: [{
                name: 'Mean Temperature',
                type: 'spline',
                yAxis: 1,
                data: roundedAndAccumulatedData.mean.mean_data,
                tooltip: {
                    valueSuffix: ' °C'
                }, color: 'rgba(210, 105, 30, 0.7)'
            }]
        }
        let highchartObj = app.highchartObjMeanAndAccumulated(ParamObject)
        let HCObj = app.DrawChart('chart' + index.toString(), highchartObj);
        if (param.interval != 'dd') {
            await app.LoadLTSDataAndPlot(param, " (°C)", HCObj, 'temp');
        }
    }

    app.NDVIAnomalyCompute = async function (index) {

        app.ShowLoadingOnUI(index);

        let param1 = app.APIParameters('ndviAnomaly', "SLDAS");
        let response1 = await app.makeRequest('GET', app.API.STATAPI + '?params=' + JSON.stringify(param1));
        let ParseResponse1 = JSON.parse(response1);
        let roundedAndAccumulatedData1 = app.getAccumulated(ParseResponse1.time_series, 'ndviAnomaly');
        let HighchartSupporingProp = app.CollectHighchartRequiredInfo(param1, roundedAndAccumulatedData1.meanAccumulated.mean_data);

        let ParamObject = {
            title: 'NDVI anomaly',
            yAxisMeanTitle: '',
            tickInterval: HighchartSupporingProp.tickInterval,
            Dateformater: HighchartSupporingProp.Dateformater,
            TickPositioner: HighchartSupporingProp.TickPositioner,
            TootTipFormatter: HighchartSupporingProp.TootTipFormatter,
            showHideLegend: false,
            series: [{
                name: 'NDVI anomaly',
                type: 'spline',
                yAxis: 1,
                data: roundedAndAccumulatedData1.mean.mean_data,
                tooltip: {
                    valueSuffix: ''
                }, color: 'rgba(19,175,8,0.7)'
            }]
        }
        let highchartObj = app.highchartObjMeanAndAccumulated(ParamObject)
        let HCObj = app.DrawChart('chart' + index.toString(), highchartObj);
    }

    app.Ch2SpiCompute = async function (index) {

        app.ShowLoadingOnUI(index);

        let param1 = app.APIParameters('ch2Spi', "SLDAS");
        param1.maxVal = 1;
        param1.minVal = -1;
        let response1 = await app.makeRequest('GET', app.API.AREAUNDERAPI + '?params=' + JSON.stringify(param1));
        let ParseResponse1 = JSON.parse(response1);
        // let roundedAndAccumulatedData1 = app.getAccumulated(ParseResponse1.time_series);
        let HighchartSupporingProp = app.CollectHighchartRequiredInfo(param1, ParseResponse1.time_series.area_under);

        let ParamObject = {
            title: 'Area Under SPI range (-1 and 1) ( kg/m<sup>2</sup>)',
            yAxisMeanTitle: '',
            tickInterval: HighchartSupporingProp.tickInterval,
            Dateformater: HighchartSupporingProp.Dateformater,
            TickPositioner: HighchartSupporingProp.TickPositioner,
            TootTipFormatter: HighchartSupporingProp.TootTipFormatter,
            showHideLegend: false,
            series: [{
                name: 'Area Under SPI range (-1 and 1)',
                type: 'column',
                yAxis: 1,
                data: ParseResponse1.time_series.area_under,
                tooltip: {
                    valueSuffix: ' kg/m<sup>2</sup>'
                }, color: 'rgb(124,181,236)'
            }]
        }
        let highchartObj = app.highchartObjMeanAndAccumulated(ParamObject)
        let HCObj = app.DrawChart('chart' + index.toString(), highchartObj);
    }
    app.SeasonAggCompute = async function (index) {
        app.ShowLoadingOnUI(index);

        let param1 = app.APIParameters('', "SLDAS");
        delete param1.variable;
        let response1 = await app.makeRequest('GET', app.API.SEASONAGG + '?params=' + JSON.stringify(param1));
        let ParseResponse1 = JSON.parse(response1);

        let response = ParseResponse1.time_series;
        var series = []
        for (var j = 0; j < response.series[0].length; j++) {
            dseries = []
            for (var i = 0; i < response.series.length; i++) {
                dseries.push(Math.round(response.series[i][j] * 100) / 100)
            }
            series.push({
                name: response.names[j],
                data: dseries,
                color: AGGCOLORS[response.names[j]]
            });
        }
        var options = {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Seasonally Aggregated Values', align: 'left',
                style: {"fontSize": "14px"}
            },
            xAxis: {categories: response.categories},
            yAxis: {
                min: 0,
                max: 100,
                title: {text: 'Percentage Area Covered'},
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                }
            },
            legend: {
                align: 'right',
                verticalAlign: 'top',
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                borderColor: '#CCC',
                borderWidth: 1,
                shadow: false
            },
            tooltip: {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        color: 'white'
                    }
                }
            },
            series: series
        };
        let HCObj = app.DrawChart('chart' + index.toString(), options);
    }
    app.pNormalCompute = async function (index) {
        app.ShowLoadingOnUI(index);

        let param1 = app.APIParameters('', "SLDAS");
        delete param1.variable;
        let response1 = await app.makeRequest('GET', app.API.PNORMAL + '?params=' + JSON.stringify(param1));
        let ParseResponse1 = JSON.parse(response1);
        let response = ParseResponse1.time_series;
        response.series = response.series.map(function (num) {
            return Math.round(num * 100) / 100;
        });
        var options = {
            chart: {
                polar: true, type: 'line',
            },
            title: {text: 'Percentage Of Normals'},
            xAxis: {categories: response.categories, tickmarkPlacement: 'on'},
            yAxis: {min: 0, max: 200, title: null, lineWidth: 0, gridLineInterpolation: 'polygon'},
            legend: {enabled: false},
            tooltip: {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
            },
            credits: {
                enabled: false
            },
            series: [{name: 'Percentage of Normal', data: response.series, pointPlacement: 'on'}]
        };
        let HCObj = app.DrawChart('chart' + index.toString(), options);
    }
}
app.addAllLayers = async function () {
    await app.addMonthsLayers();
    await app.addDekadLayers();
    await app.add3MonthLayers();
    await app.addSPIMonthsLayers();
    await app.addSPIDekadLayers();
    await app.addSPI3MonthLayers();
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
    $(".selectlayers").on("change", function (e, vv) {
        let id = $(this).val();
        let CurrentPeriodicity = app.URLparams.p;
        let selectPeriodicity = $(this).attr('periodicity');
        app.AllBindedLayersList.forEach(function (currLayer) {
            let properties = currLayer.getProperties();
            if (CurrentPeriodicity === selectPeriodicity) {
                if (properties.id === id) {
                    currLayer.setVisible(true);
                } else {
                    // $(this).val('0')
                    currLayer.setVisible(false);
                }
            } else {
                $(this).val('0')
                currLayer.setVisible(false);
            }
        });
    });
    $(".compute-indices").on("click", function (e) {
        app.computeClicked(e)
    });
    $("#selectyear").on('change', function (e) {
        app.onYearChange(e);
    });
};

// Document is ready
jQuery(async function ($) {

    app.createConstants();
    app.parseParameters();
    app.initilizeMap();
    app.createHelpers();
    app.initiUI();
    app.computeFunctions();
    app.layerswitcher();
    app.prepareDateObjForMapLayer();
    app.bindControls();
    app.computeClicked();
    await app.addAllLayers();

});


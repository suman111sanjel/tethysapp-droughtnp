let app = {};
let ChartAPIXMLHttpRequest=[];
let initialChartRequest=true;
app.InlineRadio = function (ID, name, InnerText, checked, LayerId) {
    let OuterDiv = app.createDiv('custom-control custom-radio custom-control-inline')

    let RadioInput = app.createInput('custom-control-input');
    RadioInput.setAttribute('type', 'radio');
    RadioInput.setAttribute('id', ID);
    RadioInput.setAttribute('LayerId', LayerId);
    RadioInput.setAttribute('name', name);
    RadioInput.checked = checked;

    let LavelTag = app.createLabel('custom-control-label');
    LavelTag.setAttribute('for', ID);
    LavelTag.innerText = InnerText;

    OuterDiv.append(RadioInput);
    OuterDiv.append(LavelTag);

    return OuterDiv
}

app.createElement = function (type, className) {
    var element = document.createElement(type);
    if (className) {
        let classList = className.split(" ")
        element.classList.add(...classList);
    }
    return element
}

app.createDiv = function (ClassName) {
    var div = app.createElement('div', ClassName);
    return div;
}

app.createSpan = function (ClassName) {
    var span = app.createElement('span', ClassName);
    return span;
}

app.createA = function (ClassName) {
    var a = app.createElement('a', ClassName);
    return a;
}
app.createButton = function (ClassName) {
    var a = app.createElement('button', ClassName);
    return a;
}
app.createI = function (ClassName) {
    var i = app.createElement('i', ClassName);
    return i;
}
app.createImg = function (ClassName) {
    var img = app.createElement('img', ClassName);
    return img;
}
app.createInput = function (ClassName) {
    var i = app.createElement('input', ClassName);
    return i;
}
app.createSelect = function (ClassName) {
    var i = app.createElement('select', ClassName);
    return i;
}
app.createOption = function (ClassName) {
    var i = app.createElement('option', ClassName);
    return i;
}
app.createH = function (HeadingNumber, ClassName) {
    var i = app.createElement('h' + HeadingNumber.toString(), ClassName);
    return i;
}
app.createLabel = function (ClassName) {
    var i = app.createElement('label', ClassName);
    return i;
}
app.createInput = function (ClassName) {
    var i = app.createElement('input', ClassName);
    return i;
}
app.createB = function (ClassName) {
    var i = app.createElement('b', ClassName);
    return i;
}
app.createBr = function (ClassName) {
    var i = app.createElement('br', ClassName);
    return i;
}
app.createTable = function (ClassName) {
    var i = app.createElement('table', ClassName);
    return i;
}
app.createTbody = function (ClassName) {
    var i = app.createElement('tbody', ClassName);
    return i;
}

app.createTr = function (ClassName) {
    var i = app.createElement('tr', ClassName);
    return i;
}

app.createTd = function (ClassName) {
    var i = app.createElement('td', ClassName);
    return i;
}

let layerCheckBoxBinding = function (AppendingDivID, LayerObject, OpacitySlider, LegendDropDown, customCSSClass) {
    this.divID = AppendingDivID;
    this.layerObj = LayerObject;
    this.DisplayOpacity = OpacitySlider;
    this.DisplayLegendDropDown = LegendDropDown;
    this.createElement = function (type, className) {
        var element = document.createElement(type);
        if (className) {
            let classList = className.split(" ")
            element.classList.add(...classList);
        }
        return element
    };
    this.createDiv = function (ClassName) {
        var div = this.createElement('div', ClassName);
        return div;
    };
    this.createSpan = function (ClassName) {
        var span = this.createElement('span', ClassName);
        return span;
    };
    this.createA = function (ClassName) {
        var a = this.createElement('a', ClassName);
        return a;
    };
    this.createButton = function (ClassName) {
        var a = this.createElement('button', ClassName);
        return a;
    };
    this.createI = function (ClassName) {
        var i = this.createElement('i', ClassName);
        return i;
    };
    this.createImg = function (ClassName) {
        var img = this.createElement('img', ClassName);
        return img;
    };
    this.createInput = function (ClassName) {
        var i = this.createElement('input', ClassName);
        return i;
    };
    this.createSelect = function (ClassName) {
        var i = this.createElement('select', ClassName);
        return i;
    };
    this.createOption = function (ClassName) {
        var i = this.createElement('option', ClassName);
        return i;
    };
    this.createH = function (HeadingNumber, ClassName) {
        var i = this.createElement('h' + HeadingNumber.toString(), ClassName);
        return i;
    };
    this.createLabel = function (ClassName) {
        var i = this.createElement('label', ClassName);
        return i;
    };
    this.createInput = function (ClassName) {
        var i = this.createElement('input', ClassName);
        return i;
    };

    this.checkLayerProperties = function () {
        this.layerPropertiesObject = this.layerObj.getProperties();
        if (!this.layerPropertiesObject.id) {
            console.error("Please Provide Layer Id");
        }
        this.layerId = this.layerPropertiesObject.id

        if (!this.layerPropertiesObject.title) {
            console.error("Please Provide Layer title");
        }
        this.layerTitle = this.layerPropertiesObject.title;

        if (!this.layerPropertiesObject.legendPath) {
            console.error("Please Provide legend Path");
        }
        this.legendPath = this.layerPropertiesObject.legendPath;

        if (this.layerPropertiesObject.visible) {
            this.layerVisible = this.layerPropertiesObject.visible;
        } else {
            this.layerVisible = true;
        }
        this.layerVisible = this.layerPropertiesObject.visible;

        if (this.layerPropertiesObject.opacity) {
            this.layerOpacity = this.layerPropertiesObject.opacity;
        } else {
            this.layerOpacity = 1;
        }
    };

    this.LayerCheckbox = function () {
        this.outDIv = this.createDiv("LayerDiv");
        if (customCSSClass) {
            let classList = customCSSClass.split(" ")
            this.outDIv.classList.add(...classList)

        }
        let paddingDiv = this.createDiv("paddingForDiv");

        let OuterDiv = this.createDiv('custom-control custom-checkbox layerCheckPadding');
        this.CheckboxInput = this.createInput('custom-control-input');
        this.CheckboxInput.setAttribute('type', 'checkbox');
        this.CheckboxInput.setAttribute('id', this.layerId);
        this.CheckboxInput.setAttribute('LayerId', this.layerId);
        this.CheckboxInput.checked = this.layerVisible;
        let LavelTag = this.createLabel('custom-control-label');
        LavelTag.setAttribute('for', this.layerId);
        LavelTag.innerText = this.layerTitle;
        OuterDiv.append(this.CheckboxInput);
        OuterDiv.append(LavelTag);

        let ChevronDiv = this.createDiv('ChevronDiv');
        this.cheveronSapn = this.createSpan('glyphicon glyphicon-chevron-left');
        this.cheveronSapn.setAttribute('title', "Show/Hide Legend");
        this.cheveronSapn.setAttribute('show-legend', false);
        ChevronDiv.append(this.cheveronSapn)
        paddingDiv.append(OuterDiv)
        paddingDiv.append(ChevronDiv)
        this.outDIv.append(paddingDiv);


        this.legendDiv = this.createDiv('legend-div');
        this.legendDiv.style.display = 'none';
        let imgTag = this.createImg("legend-image");
        imgTag.setAttribute("src", this.legendPath);
        this.legendDiv.append(imgTag)
        this.outDIv.append(this.legendDiv);

        let LayerOpacityDiv = this.createDiv('opac-div');
        let LayerOpacityDivinner = this.createDiv();
        this.rangeInput = this.createInput('');
        this.rangeInput.setAttribute('type', 'text');
        this.rangeInput.setAttribute('data-slider-min', "0");
        this.rangeInput.setAttribute('data-slider-max', "100");
        this.rangeInput.setAttribute('data-slider-step', "1");
        this.rangeInput.setAttribute('data-slider-value', "100");
        this.rangeInput.setAttribute('data-slider-id', "ex1Slider");
        this.rangeInput.setAttribute('name', "OpacityRange");
        this.rangeInput.setAttribute('LayerId', this.layerId);
        this.rangeInput.setAttribute('id', this.layerId + "-Slider");

        LayerOpacityDivinner.append(this.rangeInput);
        LayerOpacityDiv.append(LayerOpacityDivinner);
        this.outDIv.append(LayerOpacityDiv);

        if (this.DisplayOpacity === false) {
            LayerOpacityDivinner.style.display = 'none';
        }
        return this.outDIv
    };

    this.bindEvents = function () {
        this.CheckboxInput.addEventListener("change", () => {
            this.layerObj.setVisible(this.CheckboxInput.checked);
            if (this.CheckboxInput.checked) {
                this.SliderObject.enable();
            } else {
                this.SliderObject.disable();
            }
        }, true);
        this.cheveronSapn.addEventListener("click", () => {
            let currentValue = this.cheveronSapn.getAttribute("show-legend");
            var isTrueSet = (currentValue === 'true');
            if (isTrueSet === true) {
                this.cheveronSapn.setAttribute("show-legend", false);
                this.legendDiv.style.display = 'none';
            } else {
                this.cheveronSapn.setAttribute("show-legend", true);
                this.legendDiv.style.display = 'block';
            }

        }, true);

        // Create a new 'change' event
        var event = new Event('change');
        // Dispatch it.
        this.CheckboxInput.dispatchEvent(event);


    };

    this.getProperties = function () {
        return this.layerObj.getProperties()
    };

    this.getLayer = function () {
        return this.layerObj;
    }

    this.setVisible = function (param) {
        this.layerObj.setVisible(param);
        this.CheckboxInput.checked = param;
        this.outDIv.style.display = 'block';
    };

    this.setVisibleDivBind = function (param) {
        this.layerObj.setVisible(param);
        this.CheckboxInput.checked = param;
        if (param === true) {
            this.outDIv.style.display = 'block';
        } else {
            this.outDIv.style.display = 'none';
        }
    };

    this.init = function () {
        this.checkLayerProperties();
        let LayerCheckBox = this.LayerCheckbox();
        let AppendingDiv = document.querySelector(this.divID);
        AppendingDiv.append(LayerCheckBox);
        let that = this;
        // $('#' + this.layerId + '-Slider').slider({
        //     tooltip: 'always',
        //     value: this.layerOpacity * 100,
        //     step: 1,
        //     min: 0,
        //     max: 100,
        //     formatter: function (value) {
        //         var valueOp = parseInt(value) / 100;
        //         that.layerObj.setOpacity(valueOp);
        //         return value + " %";
        //     }
        // });

        // Without JQuery
        this.SliderObject = new Slider('#' + this.layerId + '-Slider', {
            tooltip: 'always',
            value: this.layerOpacity * 100,
            step: 1,
            min: 0,
            max: 100,
            formatter: function (value) {
                var valueOp = parseInt(value) / 100;
                that.layerObj.setOpacity(valueOp);
                return value + " %";
            }
        });

        this.bindEvents();
    };

    this.init();
}


// ol.Feature.prototype.getLayer = function (map) {
//     var this_ = this, layer_, layersToLookFor = [];
//     /**
//      * Populates array layersToLookFor with only
//      * layers that have features
//      */
//     var check = function (layer) {
//         var source = layer.getSource();
//         if (source instanceof ol.source.Vector) {
//             var features = source.getFeatures();
//             if (features.length > 0) {
//                 layersToLookFor.push({
//                     layer: layer,
//                     features: features
//                 });
//             }
//         }
//     };
//     //loop through map layers
//     map.getLayers().forEach(function (layer) {
//         if (layer instanceof ol.layer.Group) {
//             layer.getLayers().forEach(check);
//         } else {
//             check(layer);
//         }
//     });
//     layersToLookFor.forEach(function (obj) {
//         var found = obj.features.some(function (feature) {
//             return this_ === feature;
//         });
//         if (found) {
//             //this is the layer we want
//             layer_ = obj.layer;
//         }
//     });
//     return layer_;
// };

app.AdjustLayerCollectionHeight = function () {
    let mapControlDiv = document.querySelector('#map-container');
    let layerCollection = document.querySelector('.layerCollection');
    let height = getComputedStyle(mapControlDiv)["height"];
    let newHeight = parseFloat(height.replace("px", "")) - 100;
    layerCollection.style.maxHeight = newHeight.toString() + 'px';
}

app.makeRequest = function (method, url) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send();
        // ChartAPIXMLHttpRequest.push(xhr);
    });
}

app.makeRequestWithCookieCSRFToken = function (method, url, data) {
    return new Promise(function (resolve, reject) {
        let csrftokenCookie = app.getCookie('csrftoken');
        let csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
        let dataStr = ''
        for (var key in data) {
            dataStr += key.toString() + '=' + JSON.stringify(data[key]).toString() + '&'
        }
        dataStr += 'csrfmiddlewaretoken' + '=' + csrftoken.toString()
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        xhr.setRequestHeader('X-CSRFToken', csrftokenCookie);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send(dataStr);
    });
};

let getSLDForThredds = function (ParameterName, ArrayOfClassWith) {
    // let ClassObjectTemplate = [{
    //     classType: 'Below',
    //     color: '#ffffff',
    //     value: '0'
    // }, {
    //     classType: 'Normal',
    //     color: '#fff',
    //     range: '0-1'
    // }, {
    //     classType: 'Normal',
    //     color: '#fff',
    //     range: '1-2'
    // }, {
    //     classType: 'Normal',
    //     color: '#fff',
    //     range: '2-3'
    // }, {
    //     classType: 'Normal',
    //     color: '#fff',
    //     range: '3-4'
    // }, {
    //     classType: 'Above',
    //     color: '#fff',
    //     value: '4'
    // }];


    let ColorAndValueStringXMl = '';

    for (i of ArrayOfClassWith) {

        if (i.classType === 'Below') {
            ColorAndValueStringXMl = ColorAndValueStringXMl + "\n" + `<se:Value>${i.color}</se:Value>`;
            ColorAndValueStringXMl = ColorAndValueStringXMl + "\n" + `<se:Threshold>${i.value}</se:Threshold>`;

        } else if (i.classType === 'Above') {
            let lastValue = `<se:Threshold>${i.value}</se:Threshold>`;
            if (!ColorAndValueStringXMl.includes(lastValue)) {
                ColorAndValueStringXMl = ColorAndValueStringXMl + "\n" + lastValue;
            }
            ColorAndValueStringXMl = ColorAndValueStringXMl + "\n" + `<se:Value>${i.color}</se:Value>`;

        } else {
            let range = i.range.split(' ');
            let FirstValue = `<se:Threshold>${range[0]}</se:Threshold>`;
            let SecondValue = `<se:Threshold>${range[1]}</se:Threshold>`;
            if (!ColorAndValueStringXMl.includes(FirstValue)) {
                ColorAndValueStringXMl = ColorAndValueStringXMl + "\n" + FirstValue;
            }
            ColorAndValueStringXMl = ColorAndValueStringXMl + "\n" + `<se:Value>${i.color}</se:Value>`;
            if (!ColorAndValueStringXMl.includes(SecondValue)) {
                ColorAndValueStringXMl = ColorAndValueStringXMl + "\n" + SecondValue;
            }
        }
    }
    let SLDString = `<?xml version="1.0" encoding="ISO-8859-1"?>
<StyledLayerDescriptor version="1.1.0" xsi:schemaLocation="http://www.opengis.net/sldStyledLayerDescriptor.xsd"
                       xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc"
                       xmlns:se="http://www.opengis.net/se" xmlns:xlink="http://www.w3.org/1999/xlink"
                       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <NamedLayer>
        <se:Name>${ParameterName}</se:Name>
        <UserStyle>
            <se:Name>Thesholded colour scheme</se:Name>
            <se:CoverageStyle>
                <se:Rule>
                    <se:RasterSymbolizer>
                        <se:Opacity>1.0</se:Opacity>
                        <se:ColorMap>
                            <se:Categorize fallbackValue="#00000000">
                                <se:LookupValue>Rasterdata</se:LookupValue>
                                ${ColorAndValueStringXMl}
                            </se:Categorize>
                        </se:ColorMap>
                    </se:RasterSymbolizer>
                </se:Rule>
            </se:CoverageStyle>
        </UserStyle>
    </NamedLayer>
</StyledLayerDescriptor>`;
    return SLDString.replace(/(\r\n|\n|\r)/gm, "")
}

let addLayerToMap = function (id, title, currentMonthWMS, SLD, showlegend, showControlPanel, ParameterName, Periodicity, dateisoFormatForLevelFormatter, customLegendData) {
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
        legendPath: legendWMS + LegendParameter + encodeURIComponent(SLD).toString(),
        ThreddsDataServerVersion: 5,
        serverType: 'TDS',
        alignTimeSlider: 'left',
        timeSliderSize: 'small',
        showlegend: showlegend,
        showControlPanel: showControlPanel,
        Periodicity: Periodicity,
        dateisoFormatForLevelFormatter: dateisoFormatForLevelFormatter,
        customLegend: customLegend,
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

    Newlayer.init().then(function (val) {
        app.map.addThreddsLayer(val);
        // let l4 = new layerCheckBoxBinding(".layerCollection", Newlayer, true);
        // l4.setVisibleDivBind(false);
        let properties = Newlayer.getProperties();
        let selectElement = document.querySelector(`select[periodicity="${Periodicity}"]`);
        let option = app.createOption();
        option.setAttribute("periodicity", Periodicity);
        option.setAttribute("value", properties.id);
        option.innerText = properties.title;
        selectElement.append(option)
        app.AllBindedLayersList.push(Newlayer);
    }, (error) => console.error(error));
}

//helper function for aggregating data over mapping

var VALUESCALE = {
    //'temp': function (x) {
    //    return x - 273;
    //},
    'temp': function (x) {
        if (x > 100) {
            return x - 273;
        }
        else {
            return x
        }
        // return x - 273;
    },
    'emodisNdvi': function (data) {
        return (data / 200) - 0.1;
    },
    'ndviAnomaly': function (data) {
        return -1 * (data / 200);
    },
    'rainfallAggregate': function (data) {
        return app._getAggregated('aggregate_rain', data);
    }
}

var INDICES = [
    ["tempExtreme", "Temperature (min, max)"],
    ["rain", "Rainfall"],
    ["soilMoist", "Soil Moisture"],
    ["evap", "Total Evapotranspiration"],
    ["NDVI", "NDVI"],
    ["tempMean", "Mean Temperature"],
    ["ndviAnomaly", "NDVI Anomaly"],
    ["ch2Spi", "SPI"],
    ["seasonAgg", "Aggregated Anomalies"],
    ["pNormal", "Percentage of Normal"]
    // ["spi-1To1","Area Under SPI (-1 to 1)"]
]

//
// var TOOLTIPS = {
//     "tempExtreme": "Exteme temperatures on the agricultural region of district",
//     "tempMean": "Mean temperature of agricultural region of district",
//     "rain": "Average and accumulative rainfall of the region",
//     "NDVI": "MAX NDVI of the region",
//     "ndviAnomaly": "NDVI anomaly of the region",
//     "soilMoist": "Mean soil moisture of the region",
//     "evap": "Mean Evapotranspiration of the region",
//     "seasonAgg": "Area under seasonally aggregated anomalies",
//     "seasonAgg": "Percentage of normal equating to current value "
// }

var AGGCOLORS = {
    "more than 2": "#5448ff",
    "1.5 to 2": "#7985ed",
    "1 to 1.5": "#9ec2db",
    "-1 to 1": "#c3ffc9",
    "-1.5 to -1": "#d7ab87",
    "-2 to -1.5": "#eb5644",
    "less than -2": "#ff0202"
}

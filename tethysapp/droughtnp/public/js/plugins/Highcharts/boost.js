/*
 Highcharts JS v8.1.0 (2020-05-05)

 Boost module

 (c) 2010-2019 Highsoft AS
 Author: Torstein Honsi

 License: www.highcharts.com/license

 This is a Highcharts module that draws long data series on a canvas in order
 to increase performance of the initial load time and tooltip responsiveness.

 Compatible with WebGL compatible browsers (not IE < 11).

 If this module is taken in as part of the core
 - All the loading logic should be merged with core. Update styles in the
   core.
 - Most of the method wraps should probably be added directly in parent
   methods.

 Notes for boost mode
 - Area lines are not drawn
 - Lines are not drawn on scatter charts
 - Zones and negativeColor don't work
 - Dash styles are not rendered on lines.
 - Columns are always one pixel wide. Don't set the threshold too low.
 - Disable animations
 - Marker shapes are not supported: markers will always be circles, except
   heatmap series, where markers are always rectangles.

 Optimizing tips for users
 - Set extremes (min, max) explicitly on the axes in order for Highcharts to
   avoid computing extremes.
 - Set enableMouseTracking to false on the series to improve total rendering
      time.
 - The default threshold is set based on one series. If you have multiple,
   dense series, the combined number of points drawn gets higher, and you may
   want to set the threshold lower in order to use optimizations.
 - If drawing large scatter charts, it's beneficial to set the marker radius
   to a value less than 1. This is to add additional spacing to make the chart
   more readable.
 - If the value increments on both the X and Y axis aren't small, consider
   setting useGPUTranslations to true on the boost settings object. If you do
   this and the increments are small (e.g. datetime axis with small time
   increments) it may cause rendering issues due to floating point rounding
   errors, so your millage may vary.

 Settings
    There are two ways of setting the boost threshold:
    - Per series: boost based on number of points in individual series
    - Per chart: boost based on the number of series

  To set the series boost threshold, set seriesBoostThreshold on the chart
  object.
  To set the series-specific threshold, set boostThreshold on the series
  object.

  In addition, the following can be set in the boost object:
  {
      //Wether or not to use alpha blending
      useAlpha: boolean - default: true
      //Set to true to perform translations on the GPU.
      //Much faster, but may cause rendering issues
      //when using values far from 0 due to floating point
      //rounding issues
      useGPUTranslations: boolean - default: false
      //Use pre-allocated buffers, much faster,
      //but may cause rendering issues with some data sets
      usePreallocated: boolean - default: false
  }
*/
(function(c){"object"===typeof module&&module.exports?(c["default"]=c,module.exports=c):"function"===typeof define&&define.amd?define("highcharts/modules/boost",["highcharts"],function(m){c(m);c.Highcharts=m;return c}):c("undefined"!==typeof Highcharts?Highcharts:void 0)})(function(c){function m(c,E,f,C){c.hasOwnProperty(E)||(c[E]=C.apply(null,f))}c=c?c._modules:{};m(c,"modules/boost/boostables.js",[],function(){return"area arearange column columnrange bar line scatter heatmap bubble treemap".split(" ")});
m(c,"modules/boost/boostable-map.js",[c["modules/boost/boostables.js"]],function(c){var k={};c.forEach(function(c){k[c]=1});return k});m(c,"modules/boost/wgl-shader.js",[c["parts/Utilities.js"]],function(c){var k=c.clamp,f=c.error,C=c.pick;return function(d){function c(){v.length&&f("[highcharts boost] shader error - "+v.join("\n"))}function w(b,a){var g=d.createShader("vertex"===a?d.VERTEX_SHADER:d.FRAGMENT_SHADER);d.shaderSource(g,b);d.compileShader(g);return d.getShaderParameter(g,d.COMPILE_STATUS)?
g:(v.push("when compiling "+a+" shader:\n"+d.getShaderInfoLog(g)),!1)}function r(){function g(a){return d.getUniformLocation(b,a)}var k=w("#version 100\n#define LN10 2.302585092994046\nprecision highp float;\nattribute vec4 aVertexPosition;\nattribute vec4 aColor;\nvarying highp vec2 position;\nvarying highp vec4 vColor;\nuniform mat4 uPMatrix;\nuniform float pSize;\nuniform float translatedThreshold;\nuniform bool hasThreshold;\nuniform bool skipTranslation;\nuniform float xAxisTrans;\nuniform float xAxisMin;\nuniform float xAxisMinPad;\nuniform float xAxisPointRange;\nuniform float xAxisLen;\nuniform bool  xAxisPostTranslate;\nuniform float xAxisOrdinalSlope;\nuniform float xAxisOrdinalOffset;\nuniform float xAxisPos;\nuniform bool  xAxisCVSCoord;\nuniform bool  xAxisIsLog;\nuniform bool  xAxisReversed;\nuniform float yAxisTrans;\nuniform float yAxisMin;\nuniform float yAxisMinPad;\nuniform float yAxisPointRange;\nuniform float yAxisLen;\nuniform bool  yAxisPostTranslate;\nuniform float yAxisOrdinalSlope;\nuniform float yAxisOrdinalOffset;\nuniform float yAxisPos;\nuniform bool  yAxisCVSCoord;\nuniform bool  yAxisIsLog;\nuniform bool  yAxisReversed;\nuniform bool  isBubble;\nuniform bool  bubbleSizeByArea;\nuniform float bubbleZMin;\nuniform float bubbleZMax;\nuniform float bubbleZThreshold;\nuniform float bubbleMinSize;\nuniform float bubbleMaxSize;\nuniform bool  bubbleSizeAbs;\nuniform bool  isInverted;\nfloat bubbleRadius(){\nfloat value = aVertexPosition.w;\nfloat zMax = bubbleZMax;\nfloat zMin = bubbleZMin;\nfloat radius = 0.0;\nfloat pos = 0.0;\nfloat zRange = zMax - zMin;\nif (bubbleSizeAbs){\nvalue = value - bubbleZThreshold;\nzMax = max(zMax - bubbleZThreshold, zMin - bubbleZThreshold);\nzMin = 0.0;\n}\nif (value < zMin){\nradius = bubbleZMin / 2.0 - 1.0;\n} else {\npos = zRange > 0.0 ? (value - zMin) / zRange : 0.5;\nif (bubbleSizeByArea && pos > 0.0){\npos = sqrt(pos);\n}\nradius = ceil(bubbleMinSize + pos * (bubbleMaxSize - bubbleMinSize)) / 2.0;\n}\nreturn radius * 2.0;\n}\nfloat translate(float val,\nfloat pointPlacement,\nfloat localA,\nfloat localMin,\nfloat minPixelPadding,\nfloat pointRange,\nfloat len,\nbool  cvsCoord,\nbool  isLog,\nbool  reversed\n){\nfloat sign = 1.0;\nfloat cvsOffset = 0.0;\nif (cvsCoord) {\nsign *= -1.0;\ncvsOffset = len;\n}\nif (isLog) {\nval = log(val) / LN10;\n}\nif (reversed) {\nsign *= -1.0;\ncvsOffset -= sign * len;\n}\nreturn sign * (val - localMin) * localA + cvsOffset + \n(sign * minPixelPadding);\n}\nfloat xToPixels(float value) {\nif (skipTranslation){\nreturn value;// + xAxisPos;\n}\nreturn translate(value, 0.0, xAxisTrans, xAxisMin, xAxisMinPad, xAxisPointRange, xAxisLen, xAxisCVSCoord, xAxisIsLog, xAxisReversed);// + xAxisPos;\n}\nfloat yToPixels(float value, float checkTreshold) {\nfloat v;\nif (skipTranslation){\nv = value;// + yAxisPos;\n} else {\nv = translate(value, 0.0, yAxisTrans, yAxisMin, yAxisMinPad, yAxisPointRange, yAxisLen, yAxisCVSCoord, yAxisIsLog, yAxisReversed);// + yAxisPos;\nif (v > yAxisLen) {\nv = yAxisLen;\n}\n}\nif (checkTreshold > 0.0 && hasThreshold) {\nv = min(v, translatedThreshold);\n}\nreturn v;\n}\nvoid main(void) {\nif (isBubble){\ngl_PointSize = bubbleRadius();\n} else {\ngl_PointSize = pSize;\n}\nvColor = aColor;\nif (skipTranslation && isInverted) {\ngl_Position = uPMatrix * vec4(aVertexPosition.y + yAxisPos, aVertexPosition.x + xAxisPos, 0.0, 1.0);\n} else if (isInverted) {\ngl_Position = uPMatrix * vec4(yToPixels(aVertexPosition.y, aVertexPosition.z) + yAxisPos, xToPixels(aVertexPosition.x) + xAxisPos, 0.0, 1.0);\n} else {\ngl_Position = uPMatrix * vec4(xToPixels(aVertexPosition.x) + xAxisPos, yToPixels(aVertexPosition.y, aVertexPosition.z) + yAxisPos, 0.0, 1.0);\n}\n}",
"vertex"),e=w("precision highp float;\nuniform vec4 fillColor;\nvarying highp vec2 position;\nvarying highp vec4 vColor;\nuniform sampler2D uSampler;\nuniform bool isCircle;\nuniform bool hasColor;\nvoid main(void) {\nvec4 col = fillColor;\nvec4 tcol;\nif (hasColor) {\ncol = vColor;\n}\nif (isCircle) {\ntcol = texture2D(uSampler, gl_PointCoord.st);\ncol *= tcol;\nif (tcol.r < 0.0) {\ndiscard;\n} else {\ngl_FragColor = col;\n}\n} else {\ngl_FragColor = col;\n}\n}","fragment");if(!k||!e)return b=!1,
c(),!1;b=d.createProgram();d.attachShader(b,k);d.attachShader(b,e);d.linkProgram(b);if(!d.getProgramParameter(b,d.LINK_STATUS))return v.push(d.getProgramInfoLog(b)),c(),b=!1;d.useProgram(b);d.bindAttribLocation(b,0,"aVertexPosition");N=g("uPMatrix");p=g("pSize");n=g("fillColor");l=g("isBubble");D=g("bubbleSizeAbs");G=g("bubbleSizeByArea");M=g("uSampler");a=g("skipTranslation");t=g("isCircle");H=g("isInverted");return!0}function q(a,c){d&&b&&(a=h[a]=h[a]||d.getUniformLocation(b,a),d.uniform1f(a,c))}
var h={},b,N,p,n,l,D,G,a,t,H,v=[],M;return d&&!r()?!1:{psUniform:function(){return p},pUniform:function(){return N},fillColorUniform:function(){return n},setBubbleUniforms:function(a,c,e){var g=a.options,p=Number.MAX_VALUE,H=-Number.MAX_VALUE;d&&b&&"bubble"===a.type&&(p=C(g.zMin,k(c,!1===g.displayNegative?g.zThreshold:-Number.MAX_VALUE,p)),H=C(g.zMax,Math.max(H,e)),d.uniform1i(l,1),d.uniform1i(t,1),d.uniform1i(G,"width"!==a.options.sizeBy),d.uniform1i(D,a.options.sizeByAbsoluteValue),q("bubbleZMin",
p),q("bubbleZMax",H),q("bubbleZThreshold",a.options.zThreshold),q("bubbleMinSize",a.minPxSize),q("bubbleMaxSize",a.maxPxSize))},bind:function(){d&&b&&d.useProgram(b)},program:function(){return b},create:r,setUniform:q,setPMatrix:function(a){d&&b&&d.uniformMatrix4fv(N,!1,a)},setColor:function(a){d&&b&&d.uniform4f(n,a[0]/255,a[1]/255,a[2]/255,a[3])},setPointSize:function(a){d&&b&&d.uniform1f(p,a)},setSkipTranslation:function(g){d&&b&&d.uniform1i(a,!0===g?1:0)},setTexture:function(a){d&&b&&d.uniform1i(M,
a)},setDrawAsCircle:function(a){d&&b&&d.uniform1i(t,a?1:0)},reset:function(){d&&b&&(d.uniform1i(l,0),d.uniform1i(t,0))},setInverted:function(a){d&&b&&d.uniform1i(H,a)},destroy:function(){d&&b&&(d.deleteProgram(b),b=!1)}}}});m(c,"modules/boost/wgl-vbuffer.js",[],function(){return function(c,E,f){function k(){d&&(c.deleteBuffer(d),A=d=!1);q=0;w=f||2;h=[]}var d=!1,A=!1,w=f||2,r=!1,q=0,h;return{destroy:k,bind:function(){if(!d)return!1;c.vertexAttribPointer(A,w,c.FLOAT,!1,0,0)},data:h,build:function(b,
f,p){var n;h=b||[];if(!(h&&0!==h.length||r))return k(),!1;w=p||w;d&&c.deleteBuffer(d);r||(n=new Float32Array(h));d=c.createBuffer();c.bindBuffer(c.ARRAY_BUFFER,d);c.bufferData(c.ARRAY_BUFFER,r||n,c.STATIC_DRAW);A=c.getAttribLocation(E.program(),f);c.enableVertexAttribArray(A);return!0},render:function(b,k,p){var n=r?r.length:h.length;if(!d||!n)return!1;if(!b||b>n||0>b)b=0;if(!k||k>n)k=n;c.drawArrays(c[(p||"points").toUpperCase()],b/w,(k-b)/w);return!0},allocate:function(b){q=-1;r=new Float32Array(4*
b)},push:function(b,c,d,n){r&&(r[++q]=b,r[++q]=c,r[++q]=d,r[++q]=n)}}}});m(c,"modules/boost/wgl-renderer.js",[c["parts/Globals.js"],c["modules/boost/wgl-shader.js"],c["modules/boost/wgl-vbuffer.js"],c["parts/Color.js"],c["parts/Utilities.js"]],function(c,E,f,C,d){var k=C.parse,w=d.isNumber,r=d.isObject,q=d.merge,h=d.objectEach,b=d.pick,N=c.win.document;return function(d){function p(a){if(a.isSeriesBoosting){var b=!!a.options.stacking;var R=a.xData||a.options.xData||a.processedXData;b=(b?a.data:R||
a.options.data).length;"treemap"===a.type?b*=12:"heatmap"===a.type?b*=6:U[a.type]&&(b*=2);return b}return 0}function l(){e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT)}function D(a,b){function c(a){a&&(b.colorData.push(a[0]),b.colorData.push(a[1]),b.colorData.push(a[2]),b.colorData.push(a[3]))}function e(a,b,e,g,d){c(d);z.usePreallocated?A.push(a,b,e?1:0,g||1):(O.push(a),O.push(b),O.push(e?1:0),O.push(g||1))}function g(){b.segments.length&&(b.segments[b.segments.length-1].to=O.length)}function d(){b.segments.length&&
b.segments[b.segments.length-1].from===O.length||(g(),b.segments.push({from:O.length}))}function p(a,b,g,d,y){c(y);e(a+g,b);c(y);e(a,b);c(y);e(a,b+d);c(y);e(a,b+d);c(y);e(a+g,b+d);c(y);e(a+g,b)}function t(a,c){z.useGPUTranslations||(b.skipTranslation=!0,a.x=m.toPixels(a.x,!0),a.y=q.toPixels(a.y,!0));c?O=[a.x,a.y,0,2].concat(O):e(a.x,a.y,0,2)}var R=a.pointArrayMap&&"low,high"===a.pointArrayMap.join(","),H=a.chart,y=a.options,n=!!y.stacking,w=y.data,l=a.xAxis.getExtremes(),v=l.min;l=l.max;var h=a.yAxis.getExtremes(),
M=h.min;h=h.max;var f=a.xData||y.xData||a.processedXData,G=a.yData||y.yData||a.processedYData,D=a.zData||y.zData||a.processedZData,q=a.yAxis,m=a.xAxis,E=a.chart.plotWidth,N=!f||0===f.length,K=y.connectNulls,u=a.points||!1,J=!1,L=!1,S;f=n?a.data:f||w;var P={x:Number.MAX_VALUE,y:0},Q={x:-Number.MAX_VALUE,y:0},Y=0,la=!1,I=-1,T=!1,W=!1,ba="undefined"===typeof H.index,ha=!1,ia=!1;var x=!1;var va=U[a.type],ja=!1,ra=!0,sa=!0,aa=y.zones||!1,X=!1,ta=y.threshold,ka=!1;if(!(y.boostData&&0<y.boostData.length)){y.gapSize&&
(ka="value"!==y.gapUnit?y.gapSize*a.closestPointRange:y.gapSize);aa&&(aa.some(function(a){return"undefined"===typeof a.value?(X=new C(a.color),!0):!1}),X||(X=a.pointAttribs&&a.pointAttribs().fill||a.color,X=new C(X)));H.inverted&&(E=a.chart.plotHeight);a.closestPointRangePx=Number.MAX_VALUE;d();if(u&&0<u.length)b.skipTranslation=!0,b.drawMode="triangles",u[0].node&&u[0].node.levelDynamic&&u.sort(function(a,b){if(a.node){if(a.node.levelDynamic>b.node.levelDynamic)return 1;if(a.node.levelDynamic<b.node.levelDynamic)return-1}return 0}),
u.forEach(function(b){var e=b.plotY;if("undefined"!==typeof e&&!isNaN(e)&&null!==b.y){e=b.shapeArgs;var c=H.styledMode?b.series.colorAttribs(b):c=b.series.pointAttribs(b);b=c["stroke-width"]||0;x=k(c.fill).rgba;x[0]/=255;x[1]/=255;x[2]/=255;"treemap"===a.type&&(b=b||1,S=k(c.stroke).rgba,S[0]/=255,S[1]/=255,S[2]/=255,p(e.x,e.y,e.width,e.height,S),b/=2);"heatmap"===a.type&&H.inverted&&(e.x=m.len-e.x,e.y=q.len-e.y,e.width=-e.width,e.height=-e.height);p(e.x+b,e.y+b,e.width-2*b,e.height-2*b,x)}});else{for(;I<
f.length-1;){var F=f[++I];if(ba)break;u=w&&w[I];!N&&r(u,!0)&&u.color&&(x=k(u.color).rgba,x[0]/=255,x[1]/=255,x[2]/=255);if(N){u=F[0];var B=F[1];f[I+1]&&(W=f[I+1][0]);f[I-1]&&(T=f[I-1][0]);if(3<=F.length){var ua=F[2];F[2]>b.zMax&&(b.zMax=F[2]);F[2]<b.zMin&&(b.zMin=F[2])}}else u=F,B=G[I],f[I+1]&&(W=f[I+1]),f[I-1]&&(T=f[I-1]),D&&D.length&&(ua=D[I],D[I]>b.zMax&&(b.zMax=D[I]),D[I]<b.zMin&&(b.zMin=D[I]));if(K||null!==u&&null!==B){W&&W>=v&&W<=l&&(ha=!0);T&&T>=v&&T<=l&&(ia=!0);if(R){N&&(B=F.slice(1,3));var ca=
B[0];B=B[1]}else n&&(u=F.x,B=F.stackY,ca=B-F.y);null!==M&&"undefined"!==typeof M&&null!==h&&"undefined"!==typeof h&&(ra=B>=M&&B<=h);u>l&&Q.x<l&&(Q.x=u,Q.y=B);u<v&&P.x>v&&(P.x=u,P.y=B);if(null!==B||!K)if(null!==B&&(ra||ha||ia)){if((W>=v||u>=v)&&(T<=l||u<=l)&&(ja=!0),ja||ha||ia){ka&&u-T>ka&&d();aa&&(x=X.rgba,aa.some(function(a,b){b=aa[b-1];if("undefined"!==typeof a.value&&B<=a.value){if(!b||B>=b.value)x=k(a.color).rgba;return!0}return!1}),x[0]/=255,x[1]/=255,x[2]/=255);if(!z.useGPUTranslations&&(b.skipTranslation=
!0,u=m.toPixels(u,!0),B=q.toPixels(B,!0),u>E&&"points"===b.drawMode))continue;if(va){F=ca;if(!1===ca||"undefined"===typeof ca)F=0>B?B:0;R||n||(F=Math.max(null===ta?M:ta,M));z.useGPUTranslations||(F=q.toPixels(F,!0));e(u,F,0,0,x)}b.hasMarkers&&ja&&!1!==J&&(a.closestPointRangePx=Math.min(a.closestPointRangePx,Math.abs(u-J)));!z.useGPUTranslations&&!z.usePreallocated&&J&&1>Math.abs(u-J)&&L&&1>Math.abs(B-L)?z.debug.showSkipSummary&&++Y:(y.step&&!sa&&e(u,L,0,2,x),e(u,B,0,"bubble"===a.type?ua||1:2,x),J=
u,L=B,la=!0,sa=!1)}}else d()}else d()}z.debug.showSkipSummary&&console.log("skipped points:",Y);la||!1===K||"line_strip"!==a.drawMode||(P.x<Number.MAX_VALUE&&t(P,!0),Q.x>-Number.MAX_VALUE&&t(Q))}g()}}function G(){K=[];Q.data=O=[];Y=[];A&&A.destroy()}function a(a){g&&(g.setUniform("xAxisTrans",a.transA),g.setUniform("xAxisMin",a.min),g.setUniform("xAxisMinPad",a.minPixelPadding),g.setUniform("xAxisPointRange",a.pointRange),g.setUniform("xAxisLen",a.len),g.setUniform("xAxisPos",a.pos),g.setUniform("xAxisCVSCoord",
!a.horiz),g.setUniform("xAxisIsLog",!!a.logarithmic),g.setUniform("xAxisReversed",!!a.reversed))}function t(a){g&&(g.setUniform("yAxisTrans",a.transA),g.setUniform("yAxisMin",a.min),g.setUniform("yAxisMinPad",a.minPixelPadding),g.setUniform("yAxisPointRange",a.pointRange),g.setUniform("yAxisLen",a.len),g.setUniform("yAxisPos",a.pos),g.setUniform("yAxisCVSCoord",!a.horiz),g.setUniform("yAxisIsLog",!!a.logarithmic),g.setUniform("yAxisReversed",!!a.reversed))}function H(a,b){g.setUniform("hasThreshold",
a);g.setUniform("translatedThreshold",b)}function v(p){if(p)m=p.chartWidth||800,J=p.chartHeight||400;else return!1;if(!(e&&m&&J&&g))return!1;z.debug.timeRendering&&console.time("gl rendering");e.canvas.width=m;e.canvas.height=J;g.bind();e.viewport(0,0,m,J);g.setPMatrix([2/m,0,0,0,0,-(2/J),0,0,0,0,-2,0,-1,1,-1,1]);1<z.lineWidth&&!c.isMS&&e.lineWidth(z.lineWidth);A.build(Q.data,"aVertexPosition",4);A.bind();g.setInverted(p.inverted);K.forEach(function(c,d){var n=c.series.options,l=n.marker;var v="undefined"!==
typeof n.lineWidth?n.lineWidth:1;var h=n.threshold,M=w(h),D=c.series.yAxis.getThreshold(h);h=b(n.marker?n.marker.enabled:null,c.series.xAxis.isRadial?!0:null,c.series.closestPointRangePx>2*((n.marker?n.marker.radius:10)||10));l=L[l&&l.symbol||c.series.symbol]||L.circle;if(!(0===c.segments.length||c.segmentslength&&c.segments[0].from===c.segments[0].to)){l.isReady&&(e.bindTexture(e.TEXTURE_2D,l.handle),g.setTexture(l.handle));p.styledMode?l=c.series.markerGroup&&c.series.markerGroup.getStyle("fill"):
(l=c.series.pointAttribs&&c.series.pointAttribs().fill||c.series.color,n.colorByPoint&&(l=c.series.chart.options.colors[d]));c.series.fillOpacity&&n.fillOpacity&&(l=(new C(l)).setOpacity(b(n.fillOpacity,1)).get());l=k(l).rgba;z.useAlpha||(l[3]=1);"lines"===c.drawMode&&z.useAlpha&&1>l[3]&&(l[3]/=10);"add"===n.boostBlending?(e.blendFunc(e.SRC_ALPHA,e.ONE),e.blendEquation(e.FUNC_ADD)):"mult"===n.boostBlending||"multiply"===n.boostBlending?e.blendFunc(e.DST_COLOR,e.ZERO):"darken"===n.boostBlending?(e.blendFunc(e.ONE,
e.ONE),e.blendEquation(e.FUNC_MIN)):e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);g.reset();0<c.colorData.length&&(g.setUniform("hasColor",1),d=f(e,g),d.build(c.colorData,"aColor",4),d.bind());g.setColor(l);a(c.series.xAxis);t(c.series.yAxis);H(M,D);"points"===c.drawMode&&(n.marker&&w(n.marker.radius)?g.setPointSize(2*n.marker.radius):g.setPointSize(1));g.setSkipTranslation(c.skipTranslation);"bubble"===c.series.type&&g.setBubbleUniforms(c.series,c.zMin,c.zMax);
g.setDrawAsCircle(ba[c.series.type]||!1);if(0<v||"line_strip"!==c.drawMode)for(v=0;v<c.segments.length;v++)A.render(c.segments[v].from,c.segments[v].to,c.drawMode);if(c.hasMarkers&&h)for(n.marker&&w(n.marker.radius)?g.setPointSize(2*n.marker.radius):g.setPointSize(10),g.setDrawAsCircle(!0),v=0;v<c.segments.length;v++)A.render(c.segments[v].from,c.segments[v].to,"POINTS")}});z.debug.timeRendering&&console.timeEnd("gl rendering");d&&d();G()}function M(a){l();if(a.renderer.forExport)return v(a);P?v(a):
setTimeout(function(){M(a)},1)}var g=!1,A=!1,e=!1,m=0,J=0,O=!1,Y=!1,Q={},P=!1,K=[],L={},U={column:!0,columnrange:!0,bar:!0,area:!0,arearange:!0},ba={scatter:!0,bubble:!0},z={pointSize:1,lineWidth:1,fillColor:"#AA00AA",useAlpha:!0,usePreallocated:!1,useGPUTranslations:!1,debug:{timeRendering:!1,timeSeriesProcessing:!1,timeSetup:!1,timeBufferCopy:!1,timeKDTree:!1,showSkipSummary:!1}};return Q={allocateBufferForSingleSeries:function(a){var b=0;z.usePreallocated&&(a.isSeriesBoosting&&(b=p(a)),A.allocate(b))},
pushSeries:function(a){0<K.length&&K[K.length-1].hasMarkers&&(K[K.length-1].markerTo=Y.length);z.debug.timeSeriesProcessing&&console.time("building "+a.type+" series");K.push({segments:[],markerFrom:Y.length,colorData:[],series:a,zMin:Number.MAX_VALUE,zMax:-Number.MAX_VALUE,hasMarkers:a.options.marker?!1!==a.options.marker.enabled:!1,showMarkers:!0,drawMode:{area:"lines",arearange:"lines",areaspline:"line_strip",column:"lines",columnrange:"lines",bar:"lines",line:"line_strip",scatter:"points",heatmap:"triangles",
treemap:"triangles",bubble:"points"}[a.type]||"line_strip"});D(a,K[K.length-1]);z.debug.timeSeriesProcessing&&console.timeEnd("building "+a.type+" series")},setSize:function(a,b){m===a&&J===b||!g||(m=a,J=b,g.bind(),g.setPMatrix([2/m,0,0,0,0,-(2/J),0,0,0,0,-2,0,-1,1,-1,1]))},inited:function(){return P},setThreshold:H,init:function(a,b){function c(a,b){var c={isReady:!1,texture:N.createElement("canvas"),handle:e.createTexture()},d=c.texture.getContext("2d");L[a]=c;c.texture.width=512;c.texture.height=
512;d.mozImageSmoothingEnabled=!1;d.webkitImageSmoothingEnabled=!1;d.msImageSmoothingEnabled=!1;d.imageSmoothingEnabled=!1;d.strokeStyle="rgba(255, 255, 255, 0)";d.fillStyle="#FFF";b(d);try{e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,c.handle),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,c.texture),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),
e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.bindTexture(e.TEXTURE_2D,null),c.isReady=!0}catch(Z){}}var d=0,p=["webgl","experimental-webgl","moz-webgl","webkit-3d"];P=!1;if(!a)return!1;for(z.debug.timeSetup&&console.time("gl setup");d<p.length&&!(e=a.getContext(p[d],{}));d++);if(e)b||G();else return!1;e.enable(e.BLEND);e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA);e.disable(e.DEPTH_TEST);e.depthFunc(e.LESS);g=E(e);if(!g)return!1;A=f(e,g);c("circle",function(a){a.beginPath();a.arc(256,
256,256,0,2*Math.PI);a.stroke();a.fill()});c("square",function(a){a.fillRect(0,0,512,512)});c("diamond",function(a){a.beginPath();a.moveTo(256,0);a.lineTo(512,256);a.lineTo(256,512);a.lineTo(0,256);a.lineTo(256,0);a.fill()});c("triangle",function(a){a.beginPath();a.moveTo(0,512);a.lineTo(256,0);a.lineTo(512,512);a.lineTo(0,512);a.fill()});c("triangle-down",function(a){a.beginPath();a.moveTo(0,0);a.lineTo(256,512);a.lineTo(512,0);a.lineTo(0,0);a.fill()});P=!0;z.debug.timeSetup&&console.timeEnd("gl setup");
return!0},render:M,settings:z,valid:function(){return!1!==e},clear:l,flush:G,setXAxis:a,setYAxis:t,data:O,gl:function(){return e},allocateBuffer:function(a){var b=0;z.usePreallocated&&(a.series.forEach(function(a){a.isSeriesBoosting&&(b+=p(a))}),A.allocate(b))},destroy:function(){G();A.destroy();g.destroy();e&&(h(L,function(a){L[a].handle&&e.deleteTexture(L[a].handle)}),e.canvas.width=1,e.canvas.height=1)},setOptions:function(a){q(!0,z,a)}}}});m(c,"modules/boost/boost-attach.js",[c["parts/Globals.js"],
c["modules/boost/wgl-renderer.js"],c["parts/Utilities.js"]],function(c,m,f){var k=f.error,d=c.win.document,A=d.createElement("canvas");return function(f,r){var q=f.chartWidth,h=f.chartHeight,b=f,w=f.seriesGroup||r.group,p=d.implementation.hasFeature("www.http://w3.org/TR/SVG11/feature#Extensibility","1.1");b=f.isChartSeriesBoosting()?f:r;p=!1;b.renderTarget||(b.canvas=A,f.renderer.forExport||!p?(b.renderTarget=f.renderer.image("",0,0,q,h).addClass("highcharts-boost-canvas").add(w),b.boostClear=function(){b.renderTarget.attr({href:""})},
b.boostCopy=function(){b.boostResizeTarget();b.renderTarget.attr({href:b.canvas.toDataURL("image/png")})}):(b.renderTargetFo=f.renderer.createElement("foreignObject").add(w),b.renderTarget=d.createElement("canvas"),b.renderTargetCtx=b.renderTarget.getContext("2d"),b.renderTargetFo.element.appendChild(b.renderTarget),b.boostClear=function(){b.renderTarget.width=b.canvas.width;b.renderTarget.height=b.canvas.height},b.boostCopy=function(){b.renderTarget.width=b.canvas.width;b.renderTarget.height=b.canvas.height;
b.renderTargetCtx.drawImage(b.canvas,0,0)}),b.boostResizeTarget=function(){q=f.chartWidth;h=f.chartHeight;(b.renderTargetFo||b.renderTarget).attr({x:0,y:0,width:q,height:h}).css({pointerEvents:"none",mixedBlendMode:"normal",opacity:1});b instanceof c.Chart&&b.markerGroup.translate(f.plotLeft,f.plotTop)},b.boostClipRect=f.renderer.clipRect(),(b.renderTargetFo||b.renderTarget).clip(b.boostClipRect),b instanceof c.Chart&&(b.markerGroup=b.renderer.g().add(w),b.markerGroup.translate(r.xAxis.pos,r.yAxis.pos)));
b.canvas.width=q;b.canvas.height=h;b.boostClipRect.attr(f.getBoostClipRect(b));b.boostResizeTarget();b.boostClear();b.ogl||(b.ogl=m(function(){b.ogl.settings.debug.timeBufferCopy&&console.time("buffer copy");b.boostCopy();b.ogl.settings.debug.timeBufferCopy&&console.timeEnd("buffer copy")}),b.ogl.init(b.canvas)||k("[highcharts boost] - unable to init WebGL renderer"),b.ogl.setOptions(f.options.boost||{}),b instanceof c.Chart&&b.ogl.allocateBuffer(f));b.ogl.setSize(q,h);return b.ogl}});m(c,"modules/boost/boost-recent_utils.js",
[c["parts/Globals.js"],c["modules/boost/boostable-map.js"],c["modules/boost/boost-attach.js"],c["parts/Utilities.js"]],function(c,m,f,C){function d(){for(var b=[],c=0;c<arguments.length;c++)b[c]=arguments[c];var d=-Number.MAX_VALUE;b.forEach(function(b){if("undefined"!==typeof b&&null!==b&&"undefined"!==typeof b.length&&0<b.length)return d=b.length,!0});return d}function k(b,c,d){b&&c.renderTarget&&c.canvas&&!(d||c.chart).isChartSeriesBoosting()&&b.render(d||c.chart)}function w(b,c){b&&c.renderTarget&&
c.canvas&&!c.chart.isChartSeriesBoosting()&&b.allocateBufferForSingleSeries(c)}function r(c,d,f,h,k,a){k=k||0;h=h||3E3;for(var t=k+h,H=!0;H&&k<t&&k<c.length;)H=d(c[k],k),++k;H&&(k<c.length?a?r(c,d,f,h,k,a):b.requestAnimationFrame?b.requestAnimationFrame(function(){r(c,d,f,h,k)}):setTimeout(function(){r(c,d,f,h,k)}):f&&f())}function q(){var c=0,d,f=["webgl","experimental-webgl","moz-webgl","webkit-3d"],h=!1;if("undefined"!==typeof b.WebGLRenderingContext)for(d=E.createElement("canvas");c<f.length;c++)try{if(h=
d.getContext(f[c]),"undefined"!==typeof h&&null!==h)return!0}catch(G){}return!1}var h=C.pick,b=c.win,E=b.document;C={patientMax:d,boostEnabled:function(b){return h(b&&b.options&&b.options.boost&&b.options.boost.enabled,!0)},shouldForceChartSeriesBoosting:function(b){var c=0,f=0,k=h(b.options.boost&&b.options.boost.allowForce,!0);if("undefined"!==typeof b.boostForceChartBoost)return b.boostForceChartBoost;if(1<b.series.length)for(var p=0;p<b.series.length;p++){var a=b.series[p];0!==a.options.boostThreshold&&
!1!==a.visible&&"heatmap"!==a.type&&(m[a.type]&&++f,d(a.processedXData,a.options.data,a.points)>=(a.options.boostThreshold||Number.MAX_VALUE)&&++c)}b.boostForceChartBoost=k&&(f===b.series.length&&0<c||5<c);return b.boostForceChartBoost},renderIfNotSeriesBoosting:k,allocateIfNotSeriesBoosting:w,eachAsync:r,hasWebGLSupport:q,pointDrawHandler:function(b){var c=!0;this.chart.options&&this.chart.options.boost&&(c="undefined"===typeof this.chart.options.boost.enabled?!0:this.chart.options.boost.enabled);
if(!c||!this.isSeriesBoosting)return b.call(this);this.chart.isBoosting=!0;if(b=f(this.chart,this))w(b,this),b.pushSeries(this);k(b,this)}};c.hasWebGLSupport=q;return C});m(c,"modules/boost/boost-init.js",[c["parts/Globals.js"],c["parts/Utilities.js"],c["modules/boost/boost-recent_utils.js"],c["modules/boost/boost-attach.js"]],function(c,m,f,C){var d=m.addEvent,k=m.extend,w=m.fireEvent,r=m.wrap,q=c.Series,h=c.seriesTypes,b=function(){},E=f.eachAsync,p=f.pointDrawHandler,n=f.allocateIfNotSeriesBoosting,l=
f.renderIfNotSeriesBoosting,D=f.shouldForceChartSeriesBoosting,G;return function(){k(q.prototype,{renderCanvas:function(){function a(a,b){var c=!1,d="undefined"===typeof g.index,f=!0;if(!d){if(oa){var h=a[0];var t=a[1]}else h=a,t=m[b];y?(oa&&(t=a.slice(1,3)),c=t[0],t=t[1]):ma&&(h=a.x,t=a.stackY,c=t-a.y);wa||(f=t>=D&&t<=N);if(null!==t&&h>=r&&h<=A&&f)if(a=k.toPixels(h,!0),ba){if("undefined"===typeof V||a===U){y||(c=t);if("undefined"===typeof Z||t>ea)ea=t,Z=b;if("undefined"===typeof V||c<da)da=c,V=b}a!==
U&&("undefined"!==typeof V&&(t=e.toPixels(ea,!0),R=e.toPixels(da,!0),fa(a,t,Z),R!==t&&fa(a,R,V)),V=Z=void 0,U=a)}else t=Math.ceil(e.toPixels(t,!0)),fa(a,t,b)}return!d}function c(){w(d,"renderedCanvas");delete d.buildKDTree;d.buildKDTree();qa.debug.timeKDTree&&console.timeEnd("kd tree building")}var d=this,f=d.options||{},h=!1,g=d.chart,k=this.xAxis,e=this.yAxis,p=f.xData||d.processedXData,m=f.yData||d.processedYData,q=f.data;h=k.getExtremes();var r=h.min,A=h.max;h=e.getExtremes();var D=h.min,N=h.max,
L={},U,ba=!!d.sampling,z=!1!==f.enableMouseTracking,R=e.getThreshold(f.threshold),y=d.pointArrayMap&&"low,high"===d.pointArrayMap.join(","),ma=!!f.stacking,na=d.cropStart||0,wa=d.requireSorting,oa=!p,da,ea,V,Z,xa="x"===f.findNearestPointBy,pa=this.xData||this.options.xData||this.processedXData||!1,fa=function(a,b,c){a=Math.ceil(a);G=xa?a:a+","+b;z&&!L[G]&&(L[G]=!0,g.inverted&&(a=k.len-a,b=e.len-b),ya.push({x:pa?pa[na+c]:!1,clientX:a,plotX:a,plotY:b,i:na+c}))};h=C(g,d);g.isBoosting=!0;var qa=h.settings;
if(this.visible){(this.points||this.graph)&&this.destroyGraphics();g.isChartSeriesBoosting()?(this.markerGroup&&this.markerGroup!==g.markerGroup&&this.markerGroup.destroy(),this.markerGroup=g.markerGroup,this.renderTarget&&(this.renderTarget=this.renderTarget.destroy())):(this.markerGroup===g.markerGroup&&(this.markerGroup=void 0),this.markerGroup=d.plotGroup("markerGroup","markers",!0,1,g.seriesGroup));var ya=this.points=[];d.buildKDTree=b;h&&(n(h,this),h.pushSeries(d),l(h,this,g));g.renderer.forExport||
(qa.debug.timeKDTree&&console.time("kd tree building"),E(ma?d.data:p||q,a,c))}}});["heatmap","treemap"].forEach(function(a){h[a]&&r(h[a].prototype,"drawPoints",p)});h.bubble&&(delete h.bubble.prototype.buildKDTree,r(h.bubble.prototype,"markerAttribs",function(a){return this.isSeriesBoosting?!1:a.apply(this,[].slice.call(arguments,1))}));h.scatter.prototype.fill=!0;k(h.area.prototype,{fill:!0,fillOpacity:!0,sampling:!0});k(h.column.prototype,{fill:!0,sampling:!0});c.Chart.prototype.callbacks.push(function(a){d(a,
"predraw",function(){a.boostForceChartBoost=void 0;a.boostForceChartBoost=D(a);a.isBoosting=!1;!a.isChartSeriesBoosting()&&a.didBoost&&(a.didBoost=!1);a.boostClear&&a.boostClear();a.canvas&&a.ogl&&a.isChartSeriesBoosting()&&(a.didBoost=!0,a.ogl.allocateBuffer(a));a.markerGroup&&a.xAxis&&0<a.xAxis.length&&a.yAxis&&0<a.yAxis.length&&a.markerGroup.translate(a.xAxis[0].pos,a.yAxis[0].pos)});d(a,"render",function(){a.ogl&&a.isChartSeriesBoosting()&&a.ogl.render(a)})})}});m(c,"modules/boost/boost-overrides.js",
[c["parts/Globals.js"],c["parts/Point.js"],c["parts/Utilities.js"],c["modules/boost/boost-recent_utils.js"],c["modules/boost/boostables.js"],c["modules/boost/boostable-map.js"]],function(c,m,f,C,d,A){var k=f.addEvent,r=f.error,q=f.isArray,h=f.isNumber,b=f.pick,E=f.wrap,p=C.boostEnabled,n=C.shouldForceChartSeriesBoosting;f=c.Chart;var l=c.Series,D=c.seriesTypes,G=c.getOptions().plotOptions;f.prototype.isChartSeriesBoosting=function(){return b(this.options.boost&&this.options.boost.seriesThreshold,50)<=this.series.length||
n(this)};f.prototype.getBoostClipRect=function(a){var b={x:this.plotLeft,y:this.plotTop,width:this.plotWidth,height:this.plotHeight};a===this&&this.yAxis.forEach(function(a){b.y=Math.min(a.pos,b.y);b.height=Math.max(a.pos-this.plotTop+a.len,b.height)},this);return b};l.prototype.getPoint=function(a){var c=a,d=this.xData||this.options.xData||this.processedXData||!1;!a||a instanceof this.pointClass||(c=(new this.pointClass).init(this,this.options.data[a.i],d?d[a.i]:void 0),c.category=b(this.xAxis.categories?
this.xAxis.categories[c.x]:c.x,c.x),c.dist=a.dist,c.distX=a.distX,c.plotX=a.plotX,c.plotY=a.plotY,c.index=a.i,c.isInside=this.isPointInside(a));return c};E(l.prototype,"searchPoint",function(a){return this.getPoint(a.apply(this,[].slice.call(arguments,1)))});E(m.prototype,"haloPath",function(a){var b=this.series,c=this.plotX,d=this.plotY,f=b.chart.inverted;b.isSeriesBoosting&&f&&(this.plotX=b.yAxis.len-d,this.plotY=b.xAxis.len-c);var g=a.apply(this,Array.prototype.slice.call(arguments,1));b.isSeriesBoosting&&
f&&(this.plotX=c,this.plotY=d);return g});E(l.prototype,"markerAttribs",function(a,b){var c=b.plotX,d=b.plotY,f=this.chart.inverted;this.isSeriesBoosting&&f&&(b.plotX=this.yAxis.len-d,b.plotY=this.xAxis.len-c);var g=a.apply(this,Array.prototype.slice.call(arguments,1));this.isSeriesBoosting&&f&&(b.plotX=c,b.plotY=d);return g});k(l,"destroy",function(){var a=this,b=a.chart;b.markerGroup===a.markerGroup&&(a.markerGroup=null);b.hoverPoints&&(b.hoverPoints=b.hoverPoints.filter(function(b){return b.series===
a}));b.hoverPoint&&b.hoverPoint.series===a&&(b.hoverPoint=null)});E(l.prototype,"getExtremes",function(a){return this.isSeriesBoosting&&this.hasExtremes&&this.hasExtremes()?{}:a.apply(this,Array.prototype.slice.call(arguments,1))});["translate","generatePoints","drawTracker","drawPoints","render"].forEach(function(a){function b(b){var c=this.options.stacking&&("translate"===a||"generatePoints"===a);if(!this.isSeriesBoosting||c||!p(this.chart)||"heatmap"===this.type||"treemap"===this.type||!A[this.type]||
0===this.options.boostThreshold)b.call(this);else if(this[a+"Canvas"])this[a+"Canvas"]()}E(l.prototype,a,b);"translate"===a&&"column bar arearange columnrange heatmap treemap".split(" ").forEach(function(c){D[c]&&E(D[c].prototype,a,b)})});E(l.prototype,"processData",function(a){function b(a){return c.chart.isChartSeriesBoosting()||(a?a.length:0)>=(c.options.boostThreshold||Number.MAX_VALUE)}var c=this,d=this.options.data;p(this.chart)&&A[this.type]?(b(d)&&"heatmap"!==this.type&&"treemap"!==this.type&&
!this.options.stacking&&this.hasExtremes&&this.hasExtremes(!0)||(a.apply(this,Array.prototype.slice.call(arguments,1)),d=this.processedXData),(this.isSeriesBoosting=b(d))?(d=this.getFirstValidPoint(this.options.data),h(d)||q(d)||r(12,!1,this.chart),this.enterBoost()):this.exitBoost&&this.exitBoost()):a.apply(this,Array.prototype.slice.call(arguments,1))});k(l,"hide",function(){this.canvas&&this.renderTarget&&(this.ogl&&this.ogl.clear(),this.boostClear())});l.prototype.enterBoost=function(){this.alteredByBoost=
[];["allowDG","directTouch","stickyTracking"].forEach(function(a){this.alteredByBoost.push({prop:a,val:this[a],own:Object.hasOwnProperty.call(this,a)})},this);this.directTouch=this.allowDG=!1;this.stickyTracking=!0;this.labelBySeries&&(this.labelBySeries=this.labelBySeries.destroy())};l.prototype.exitBoost=function(){(this.alteredByBoost||[]).forEach(function(a){a.own?this[a.prop]=a.val:delete this[a.prop]},this);this.boostClear&&this.boostClear()};l.prototype.hasExtremes=function(a){var b=this.options,
c=this.xAxis&&this.xAxis.options,d=this.yAxis&&this.yAxis.options,f=this.colorAxis&&this.colorAxis.options;return b.data.length>(b.boostThreshold||Number.MAX_VALUE)&&h(d.min)&&h(d.max)&&(!a||h(c.min)&&h(c.max))&&(!f||h(f.min)&&h(f.max))};l.prototype.destroyGraphics=function(){var a=this,b=this.points,c,d;if(b)for(d=0;d<b.length;d+=1)(c=b[d])&&c.destroyElements&&c.destroyElements();["graph","area","tracker"].forEach(function(b){a[b]&&(a[b]=a[b].destroy())})};d.forEach(function(a){G[a]&&(G[a].boostThreshold=
5E3,G[a].boostData=[],D[a].prototype.fillOpacity=!0)})});m(c,"modules/boost/named-colors.js",[c["parts/Color.js"]],function(c){var k={aliceblue:"#f0f8ff",antiquewhite:"#faebd7",aqua:"#00ffff",aquamarine:"#7fffd4",azure:"#f0ffff",beige:"#f5f5dc",bisque:"#ffe4c4",black:"#000000",blanchedalmond:"#ffebcd",blue:"#0000ff",blueviolet:"#8a2be2",brown:"#a52a2a",burlywood:"#deb887",cadetblue:"#5f9ea0",chartreuse:"#7fff00",chocolate:"#d2691e",coral:"#ff7f50",cornflowerblue:"#6495ed",cornsilk:"#fff8dc",crimson:"#dc143c",
cyan:"#00ffff",darkblue:"#00008b",darkcyan:"#008b8b",darkgoldenrod:"#b8860b",darkgray:"#a9a9a9",darkgreen:"#006400",darkkhaki:"#bdb76b",darkmagenta:"#8b008b",darkolivegreen:"#556b2f",darkorange:"#ff8c00",darkorchid:"#9932cc",darkred:"#8b0000",darksalmon:"#e9967a",darkseagreen:"#8fbc8f",darkslateblue:"#483d8b",darkslategray:"#2f4f4f",darkturquoise:"#00ced1",darkviolet:"#9400d3",deeppink:"#ff1493",deepskyblue:"#00bfff",dimgray:"#696969",dodgerblue:"#1e90ff",feldspar:"#d19275",firebrick:"#b22222",floralwhite:"#fffaf0",
forestgreen:"#228b22",fuchsia:"#ff00ff",gainsboro:"#dcdcdc",ghostwhite:"#f8f8ff",gold:"#ffd700",goldenrod:"#daa520",gray:"#808080",green:"#008000",greenyellow:"#adff2f",honeydew:"#f0fff0",hotpink:"#ff69b4",indianred:"#cd5c5c",indigo:"#4b0082",ivory:"#fffff0",khaki:"#f0e68c",lavender:"#e6e6fa",lavenderblush:"#fff0f5",lawngreen:"#7cfc00",lemonchiffon:"#fffacd",lightblue:"#add8e6",lightcoral:"#f08080",lightcyan:"#e0ffff",lightgoldenrodyellow:"#fafad2",lightgrey:"#d3d3d3",lightgreen:"#90ee90",lightpink:"#ffb6c1",
lightsalmon:"#ffa07a",lightseagreen:"#20b2aa",lightskyblue:"#87cefa",lightslateblue:"#8470ff",lightslategray:"#778899",lightsteelblue:"#b0c4de",lightyellow:"#ffffe0",lime:"#00ff00",limegreen:"#32cd32",linen:"#faf0e6",magenta:"#ff00ff",maroon:"#800000",mediumaquamarine:"#66cdaa",mediumblue:"#0000cd",mediumorchid:"#ba55d3",mediumpurple:"#9370d8",mediumseagreen:"#3cb371",mediumslateblue:"#7b68ee",mediumspringgreen:"#00fa9a",mediumturquoise:"#48d1cc",mediumvioletred:"#c71585",midnightblue:"#191970",mintcream:"#f5fffa",
mistyrose:"#ffe4e1",moccasin:"#ffe4b5",navajowhite:"#ffdead",navy:"#000080",oldlace:"#fdf5e6",olive:"#808000",olivedrab:"#6b8e23",orange:"#ffa500",orangered:"#ff4500",orchid:"#da70d6",palegoldenrod:"#eee8aa",palegreen:"#98fb98",paleturquoise:"#afeeee",palevioletred:"#d87093",papayawhip:"#ffefd5",peachpuff:"#ffdab9",peru:"#cd853f",pink:"#ffc0cb",plum:"#dda0dd",powderblue:"#b0e0e6",purple:"#800080",red:"#ff0000",rosybrown:"#bc8f8f",royalblue:"#4169e1",saddlebrown:"#8b4513",salmon:"#fa8072",sandybrown:"#f4a460",
seagreen:"#2e8b57",seashell:"#fff5ee",sienna:"#a0522d",silver:"#c0c0c0",skyblue:"#87ceeb",slateblue:"#6a5acd",slategray:"#708090",snow:"#fffafa",springgreen:"#00ff7f",steelblue:"#4682b4",tan:"#d2b48c",teal:"#008080",thistle:"#d8bfd8",tomato:"#ff6347",turquoise:"#40e0d0",violet:"#ee82ee",violetred:"#d02090",wheat:"#f5deb3",white:"#ffffff",whitesmoke:"#f5f5f5",yellow:"#ffff00",yellowgreen:"#9acd32"};return c.names=k});m(c,"modules/boost/boost.js",[c["parts/Globals.js"],c["modules/boost/boost-recent_utils.js"],
c["modules/boost/boost-init.js"],c["parts/Utilities.js"]],function(c,m,f,C){C=C.error;m=m.hasWebGLSupport;m()?f():"undefined"!==typeof c.initCanvasBoost?c.initCanvasBoost():C(26)});m(c,"masters/modules/boost.src.js",[],function(){})});
//# sourceMappingURL=boost.js.map
// Bushfire_extent_NDVI.js
// Landon Halloran 04.03.2019
// Example written in class...
// Shows difference in NDVI caused by 2018 Bega-Tathra (NSW, Australia) bushfires.
// https://en.wikipedia.org/wiki/2018_Tathra_bushfire
// fire burned 18-19.03.2018

// pick out area near Bega/Tathra, NSW
var geometry = /* color: #d63000 */ee.Geometry.Polygon(
        [[[149.8081537937286, -36.68559407088151],
          [149.80197398415828, -36.789044471090406],
          [149.99148814431453, -36.800041626472186],
          [150.0065943454864, -36.67953680553564],
          [149.90977732888484, -36.626653155369524]]]);

// before
var sentinelB = ee.ImageCollection('COPERNICUS/S2')
                  .filterDate('2018-03-01', '2018-03-15')
                  .filterBounds(geometry)
                  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10));
//after                  
var sentinelA = ee.ImageCollection('COPERNICUS/S2')
                  .filterDate('2018-03-20', '2018-04-10')
                  .filterBounds(geometry)
                  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10));
                  
var beforeimage = sentinelB.first();
var afterimage = sentinelA.first();

var visParamsRGB = {
  min: 0.0,
  max: 1800,
  bands: ['B4', 'B3', 'B2'], 
};

Map.addLayer(beforeimage,visParamsRGB,'RGB Before');
Map.addLayer(afterimage,visParamsRGB,'RGB After');
//print(beforeimage);
// var beforeNDVI = 

var beforendvi = beforeimage.expression(
    '(nir - red) / (nir + red)',
    {
        red: beforeimage.select('B4'),    // 620-670nm, RED
        nir: beforeimage.select('B8'),    // 841-876nm, NIR
    });

var afterndvi = afterimage.expression(
    '(nir - red) / (nir + red)',
    {
        red: afterimage.select('B4'),    // 620-670nm, RED
        nir: afterimage.select('B8'),    // 841-876nm, NIR
    });

var ndvidiff = afterndvi.subtract(beforendvi);

var visParamsndvi = { min:0, max:1, palette:['black','white']};
var visParamsdiff = { min:-0.2, max:0.2, palette:['red','white','green']};

Map.addLayer(beforendvi,visParamsndvi,'NDVI Before');
Map.addLayer(afterndvi, visParamsndvi, 'NDVI After');
Map.addLayer(ndvidiff,visParamsdiff, 'NDVI difference');




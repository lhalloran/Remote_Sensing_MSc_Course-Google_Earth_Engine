// NDVI_MODIS.js
// Landon Halloran, Feb. 2019
// Demonstrates how to load a specific image and calculate the NDVI using an expression.
// Zoom to Switzerland.


// Load a MODIS image and apply the scaling factor.
var img = ee.Image('MODIS/006/MOD09GA/2018_08_16').multiply(0.001);

// calculate NDVI
var ndvi = img.expression(
    '(nir - red) / (nir + red)',
    {
        red: img.select('sur_refl_b01'),    // 620-670nm, RED
        nir: img.select('sur_refl_b02'),    // 841-876nm, NIR
    });

// define a divergent colour scheme and other viz params.
var vizParams = {
  min: -1,
  max: 1,
  palette: ['blue', 'white', 'green'],
  opacity: 1
};

// define viz params for B&W
var vizParams2 = {
  min: 0,
  max: 9,
  palette: ['#000000','#ffffff'],
  opacity: 1
};

// Plot several layers (use map controls to select and inspect):
Map.addLayer(img.select(['sur_refl_b01','sur_refl_b04','sur_refl_b03']),{min:0,max:5},'RGB');
Map.addLayer(img.select('sur_refl_b01'),vizParams2,'RED');
Map.addLayer(img.select('sur_refl_b02'),vizParams2,'NIR');
Map.addLayer(ndvi, vizParams, 'ndvi');

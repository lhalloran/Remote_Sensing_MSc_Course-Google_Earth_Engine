// Evapotranspiration_timeseries_and_image_export.js
// 22.08.2019 & 5.9.2019
// Landon Halloran
// 
// Google Earth Engine script to be run in browser @ https://code.earthengine.google.com
// This displays maps of evapotraspiration data from the MODIS MOD16A2 dataset.  These are
// 500m resolution datasets over 8 days. 
// Info: https://developers.google.com/earth-engine/datasets/catalog/MODIS_006_MOD16A2
// 
// Code modified with more comments and image export.


// import subset of imageCollection
var dataset = ee.ImageCollection('MODIS/006/MOD16A2')
                  .filter(ee.Filter.date('2010-08-22', '2019-08-22')); // change dates here

// select one band                  
var evapotranspiration = dataset.select('ET'); // can also use 'PET' for POTENTIAL evapotranspiration

// this conversts the imageCollection to an image (by taking the mean)
var evapotranspirationSelect = evapotranspiration.mean();

// display parameters:
var evapotranspirationVis = {
  min: 0.0,
  max: 400.0,
  palette: [
    'ffffff', 'fcd163', '99b718', '66a000', '3e8601', '207401', '056201',
    '004c00', '011301'
  ],
  opacity: 1,
};

// Centre map view on Kenya:
Map.setCenter(37.9, 0.5, 6);

// add the evapotranspiration layer:
Map.addLayer(evapotranspirationSelect, evapotranspirationVis, 'Evapotranspiration');

// make the shape (make your own by clicking, coding, or import a shape file!)
var forme1 = /* color: #ff0000 */ee.Geometry.Polygon(
        [[[37.710530651078216, -3.110070139948548],
          [37.61460675731951, -3.485354719264439],
          [39.41244655990954, -4.768399319357207],
          [41.429402721390716, -1.798436928469229],
          [40.98691113593679, -0.9555897114168835],
          [40.984456432328216, 2.743065878585461],
          [41.76546504602243, 3.9150638860352016],
          [40.439573272004736, 4.588978264663216],
          [38.9849178855884, 3.5219937441133524],
          [37.173304287542805, 4.264491225619274],
          [36.06310990956911, 4.478423915004959],
          [35.08626025382978, 4.779106438179698],
          [34.071081143325614, 4.008743490806758],
          [35.01456881115996, 1.9562676409739181],
          [34.16791258375508, 0.534743736026974],
          [33.936726940140716, -0.9747106915343675],
          [36.584432018265716, -2.424229387675209]]]);

// make the time-series chart
print(ui.Chart.image.series(evapotranspiration, forme1, ee.Reducer.mean(), 500)); // leave 500 at the end - this is resolution in meters and our dataset is 500m resolution

// export the image (as geoTIFF):
Export.image.toDrive({
  image: evapotranspirationSelect,
  description: 'KenyaETmeanExample',
  scale: 2000, // this is the scale in meters/pixel
  region: forme1
});

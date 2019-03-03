// Kakadu_Time_Series.js
// Landon Halloran, March 2019 
// Adapted from Google's Charts/Image_Time_Series example.
// Create polygon, select Sentinel-2 data and display time-series of band averages over polygon at each available time-step.

var Kakadu = ee.Geometry.Polygon(
        [[[132.08747503862276, -12.297420149842496],
          [132.02155706987276, -12.908549127214044],
          [131.97761175737276, -13.320489989382304],
          [132.33466742143526, -13.689037660275275],
          [132.24128363237276, -14.136924865094283],
          [132.54890081987276, -14.365861488568061],
          [132.74665472612276, -14.371182824496476],
          [132.76313421831026, -13.977064852259321],
          [132.98286078081026, -13.95574176464593],
          [132.98835394487276, -12.46374812056942],
          [132.73566839799776, -12.141727641986126],
          [132.45002386674776, -12.249111597767056],
          [132.44453070268526, -12.495928353203718],
          [132.32917425737276, -12.259847597056174]]]);
print('Kakadu National Park polygon area = ', Kakadu.area().divide(1E6), ' km^2');

//var landsat8Toa = ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA')
//    .filterDate('2012-01-01', '2018-12-31')
//    .select('B[1-7]');

// Map the function over one year of data and take the median.
// Load Sentinel-2 TOA reflectance data.
var RSdata = ee.ImageCollection('COPERNICUS/S2')
                  .filterDate('2016-01-01', '2019-01-01')
                  .filterBounds(Kakadu)
                  // Pre-filter to get less cloudy granules.
                  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 25));
//                  .map(maskS2clouds);
var chart = ui.Chart.image.series({
  imageCollection: RSdata,
  region: Kakadu,
  reducer: ee.Reducer.mean(),
  scale: 200
});
print(RSdata);
// Add the chart to the map.
chart.style().set({
  position: 'bottom-right',
  width: '600px',
  height: '300px'
});
Map.add(chart);

// Outline and center San Francisco on the map.
var KAKADULayer = ui.Map.Layer(Kakadu, {color: 'FF0000'}, 'Kakadu National Park');
Map.layers().add(KAKADULayer);
Map.setCenter(132, -13, 7);

// Create a label on the map.
var label = ui.Label('Click a point on the chart to show the image for that date.');
Map.add(label);

// When the chart is clicked, update the map and label.
chart.onClick(function(xValue, yValue, seriesName) {
  if (!xValue) return;  // Selection was cleared.

  // Show the image for the clicked date.
  var equalDate = ee.Filter.equals('system:time_start', xValue);
  var image = ee.Image(RSdata.filter(equalDate).first());
  var s2Layer = ui.Map.Layer(image, {
    gamma: 1.0,
    min: 0,
    max: 1500,
    bands: ['B4', 'B3', 'B2']
  });
  Map.layers().reset([s2Layer, KAKADULayer]);

  // Show a label with the date on the map.
  label.setValue((new Date(xValue)).toUTCString());
});

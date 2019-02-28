// Hunga_Tonga_volcano
// Landon Halloran, Feb 2019. 
// Adapted from Google's example "Airstrip_thumpnails".
// Use LANDSAT-8 data to look at the Hunga Tonga-Hunga Ha'apai volcano eruption and subsequent reestablishment of vegetation.
// https://en.wikipedia.org/wiki/Hunga_Tonga
// https://www.bbc.com/news/world-asia-47153797

// region of interest:
var box = ee.Geometry.Polygon([[
               [-175.44,-20.59], [-175.44,-20.49],
               [-175.34,-20.49], [-175.34,-20.59]]]);

// Use RGB = bands 5, 3 & 2 to highlight vegetation growth
var visParams = {
  bands: ['B5', 'B3', 'B2'],
  //bands: ['B6'],
  //min: 5000,
  max: 15000,
  gamma: 0.5
  //gamma: [1, 1, 1]
};

// load LANDSAT Tier 1 data and filter
var images = ee.ImageCollection('LANDSAT/LC08/C01/T1')
    .filterBounds(box)
    .filterDate('2014-08-15', '2019-03-01')
    .filter(ee.Filter.lessThanOrEquals('CLOUD_COVER', 25));

// make the box object on the left of the map interface    
Map.centerObject(box);
Map.addLayer(ee.Image(images.first()), visParams, 'Landsat 8');
Map.addLayer(ee.Image().paint(box, 0, 1), {palette: 'FF0000'}, 'Box Outline');
var selectedIndex = 0;
var collectionLength = 0;

// Get the total number of images asynchronously, so we know how far to step.
images.size().evaluate(function(length) {
  collectionLength = length;
});

// Sets up next and previous buttons used to navigate through previews of the
// images in the collection.
var prevButton = new ui.Button('Previous', null, true, {margin: '0 auto 0 0'});
var nextButton = new ui.Button('Next', null, false, {margin: '0 0 0 auto'});
var buttonPanel = new ui.Panel(
    [prevButton, nextButton],
    ui.Panel.Layout.Flow('horizontal'));

// Build the thumbnail display panel
var introPanel = ui.Panel([
  ui.Label({
    value: 'Hunga Tonga-Hunga Ha\'apai Volcano',
    style: {fontWeight: 'bold', fontSize: '24px', margin: '10px 5px'}
  }),
  ui.Label('')
]);

// Helper function to combine two JavaScript dictionaries.
function combine(a, b) {
  var c = {};
  for (var key in a) c[key] = a[key];
  for (var key in b) c[key] = b[key];
  return c;
}

// An empty thumbnail that gets filled in during the setImageByIndex callback.
var thumbnail = ui.Thumbnail({
  params: combine(visParams, {
    dimensions: '256x256',
    region: box.toGeoJSON(),
  }),
  style: {height: '300px', width: '300px'},
  onClick: function(widget) {
    // Add the whole scene to the map when the thumbnail is clicked.
    var layer = Map.layers().get(0);
    if (layer.get('eeObject') != thumbnail.getImage()) {
      layer.set('eeObject', thumbnail.getImage());
    }
  }
});

var imagePanel = ui.Panel([thumbnail]);
var dateLabel = ui.Label({style: {margin: '2px 0', fontSize: 20}});
var idLabel = ui.Label({style: {margin: '2px 0'}});
var mainPanel = ui.Panel({
  widgets: [introPanel, buttonPanel, imagePanel, idLabel, dateLabel],
  style: {position: 'bottom-left', width: '400px'}
});
Map.add(mainPanel);

// Displays the thumbnail of the image at a particular index in the collection.
var setImageByIndex = function(index) {
  var image = ee.Image(images.toList(1, index).get(0));
  thumbnail.setImage(image);

  // Asynchronously update the image information.
  image.get('system:id').evaluate(function(id) {
    idLabel.setValue('ID: ' + id);
  });
  image.date().format("YYYY-MM-dd").evaluate(function(date) {
    dateLabel.setValue('Date: ' + date);
  });
};

// Gets the index of the next/previous image in the collection and sets the
// thumbnail to that image.  Disables the appropriate button when we hit an end.
var setImage = function(button, increment) {
  if (button.getDisabled()) return;
  setImageByIndex(selectedIndex += increment);
  nextButton.setDisabled(selectedIndex >= collectionLength - 1);
  prevButton.setDisabled(selectedIndex <= 0);
};

// Set up the next and previous buttons.
prevButton.onClick(function(button) { setImage(button, -1); });
nextButton.onClick(function(button) { setImage(button, 1); });

setImageByIndex(0);

// Ice_Thickness.js
// Landon Halloran, Feb 2019
//
// Example showing how to calculate and plot difference between two data sources and to apply a mask.
// Uses NOAA DEM of bedrock and of ice surface (Antarctica and Greenland only). 
// Sincere apologies for the Mercator projection...



var elev = ee.Image("NOAA/NGDC/ETOPO1"); 
print('bands: ',elev.bandNames());
var bedrock = elev.select('bedrock');
var ice_surface = elev.select('ice_surface');
var ice_thickness = ice_surface.subtract(bedrock);

// this simply defines the viridis colourscheme
var viridis = ['#440154','#481567','#482677','#453781',
  '#404788','#39568C','#33638D','#2D708E','#287D8E',
  '#238A8D','#1F968B','#20A387','#29AF7F','#3CBB75',
  '#55C667','#73D055','#95D840','#B8DE29','#DCE319',
  '#FDE725'];

//var mask = elev.gt(0);
var mask = ice_thickness.gt(1);
var masked_ice_thickness = ice_thickness.updateMask(mask)

Map.setCenter(7, 47, 3);
var test = Map.addLayer(masked_ice_thickness, {min: 0, max: 3000, opacity: 1, palette:viridis}, 'Ice Thickness');


// Sea_level_rise.js
// Landon Halloran, Feb 2019
// This script reads in a global topography/bathmetry DEM, 
// then plots global land boundaries for a change in sea level defined by the user. 
// https://www.ngdc.noaa.gov/mgg/global/

var elev = ee.Image("NOAA/NGDC/ETOPO1");
//var elev = ee.Image('CGIAR/SRTM90_V4');
print('bands: ',elev.bandNames());
var bedrock = elev.select('bedrock');
var ice_surface = elev.select('ice_surface');
var ice_thickness = ice_surface.subtract(bedrock);

var viridis = ['#440154','#481567','#482677','#453781',
  '#404788','#39568C','#33638D','#2D708E','#287D8E',
  '#238A8D','#1F968B','#20A387','#29AF7F','#3CBB75',
  '#55C667','#73D055','#95D840','#B8DE29','#DCE319',
  '#FDE725'];

//var mask = elev.gt(0);
var mask = ice_thickness.gt(1);
var masked_ice_thickness = ice_thickness.updateMask(mask);

var sealevelrise = 100; // sea level (or drop if negative) rise in meters
var newsurface = bedrock.subtract(sealevelrise);
var newmask = newsurface.gte(0);
var newmaskopposite = newsurface.lt(0);

var op = 0.6; //opacity

Map.setCenter(7, 47, 3);
var test2 = Map.addLayer(newsurface.updateMask(newmask), {opacity: op, palette:'green'});
var test3 = Map.addLayer(newsurface.updateMask(newmaskopposite), {opacity: op, palette:'blue'});

// GRACE Demo
// Landon Halloran 24.02.2019
// This script imports data from GRACE (measurements of gravity variations) and plots the liquid water equivalent
// Try looking at differet dates and comparing accross seasons or years.

// declare image properties (colour scheme is divergent so your min should be =  -max)
var ImgProps = {
min:-20,
max:20,
palette: ['#DAA520','white','#8080FF'] // divergent
};

var GraceLand = ee.ImageCollection("NASA/GRACE/MASS_GRIDS/LAND");
print(GraceLand);
var GraceLand2 = GraceLand.filterDate('2016-08-01','2016-10-01');
var LWE2 = ee.Image(GraceLand2.first().select('lwe_thickness_jpl')); // LWE = Liquid Water Equivalent (cm)
Map.addLayer(LWE2, ImgProps,'LWE2');

print(LWE2);

//see change compared to prior date
var GraceLand1=GraceLand.filterDate('2014-08-01','2014-10-01').select('lwe_thickness_jpl');
var LWE1 = ee.Image(GraceLand1.first().select('lwe_thickness_jpl'));
print(LWE2);

var LWE_diff = LWE2.subtract(LWE1);
Map.addLayer(LWE1, ImgProps,'LWE1');
Map.addLayer(LWE_diff, ImgProps,'deltaLWE');

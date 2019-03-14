# -*- coding: utf-8 -*-
"""
image_processing_with_kmeans.py

Landon Halloran 
07.03.2019 
www.ljsh.ca

Demonstration of kmeans using multi-band image data. Good intro to several powerful 
python modules! And good example of a practical unsupervised discrete ML application 
to remote sensing data.
Data is downsampled Sentinel-2 data (bands 2,3,4,8) at 60m resolution in PNG format.
"""

# import these modules:
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import imageio
import glob
import seaborn as sns; sns.set(style="ticks", color_codes=True)


# import images to dictionary:
images = dict();
for image_path in glob.glob("*.png"):
    print('reading ',image_path)
    temp = imageio.imread(image_path)
    temp = temp[:,:,0].squeeze()
    images[image_path[6:8]] = temp
print('images have ', np.size(temp),' pixels each')


# make a 3D numpy array of data...
imagecube = np.zeros([images['B2'].shape[0],images['B2'].shape[1],4])
imagecube[:,:,0] = images['B2'] # 
imagecube[:,:,1] = images['B3'] # 
imagecube[:,:,2] = images['B4'] # 
imagecube[:,:,3] = images['B8'] # 
imagecube=imagecube/256 #  scaling to between 0 and 1

# display an RGB or false colour image
thefigsize = (10,8)# set figure size
plt.figure(figsize=thefigsize)
plt.imshow(imagecube[:,:,0:3])


# sample random subset of images
Nsamples = 5000 # number of samples we take from image
imagesamples = []
for i in range(Nsamples):
    xr=np.random.randint(0,imagecube.shape[1]-1)
    yr=np.random.randint(0,imagecube.shape[0]-1)
    imagesamples.append(imagecube[yr,xr,:])
# convert to pandas dataframe
imagessamplesDF=pd.DataFrame(imagesamples,columns = ['B2','B3','B4','B8'])


# make pairs plot (each band vs. each band)
seaborn_params_p = {'alpha': 0.6, 's': 40, 'edgecolor': 'k'}
pp1=sns.pairplot(imagessamplesDF, plot_kws = seaborn_params_p)#, hist_kws=seaborn_params_h)
#pp1.map_diag(sns.kdeplot, lw=2, legend=False, alpha=0.6) # not working.

# fit kmeans to to samples:
from sklearn.cluster import KMeans

NUMBER_OF_CLUSTERS = 5 # <---------- define number of clusters (groups) here!
KMmodel = KMeans(n_clusters=NUMBER_OF_CLUSTERS) 
KMmodel.fit(imagessamplesDF)
KM_train = list(KMmodel.predict(imagessamplesDF)) 
i=0
for k in KM_train:
    KM_train[i] = str(k) 
    i=i+1
imagessamplesDF2=imagessamplesDF
imagessamplesDF2['group'] = KM_train
# pair plots with clusters coloured:
pp2=sns.pairplot(imagessamplesDF,vars=['B2','B3','B4','B8'], hue='group',plot_kws = seaborn_params_p)

# 
imageclustered=np.empty((imagecube.shape[0],imagecube.shape[1]))
i=0
for row in imagecube:
    temp = KMmodel.predict(row) 
    imageclustered[i,:]=temp
    i=i+1
# plot the map of the clustered data
plt.figure(figsize=thefigsize)
plt.imshow(imageclustered, cmap='rainbow') # see other colour maps @ https://matplotlib.org/examples/color/colormaps_reference.html

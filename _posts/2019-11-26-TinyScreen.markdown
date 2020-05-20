---
layout: post
title:  "TinyScreen"
author: Aaron Ti
date:   2019-11-26
category: Programming
keywords: TinyScreen
abstract: Arduino Script Generation Using Python for TinyCircuits
website: https://github.com/mcdulltii/TinyScreen
---

![PNG to INO](https://github.com/mcdulltii/TinyScreen/blob/master/png/png.gif)

![GIF to INO](https://github.com/mcdulltii/TinyScreen/blob/master/png/gif.gif)

![MP4 to INO](https://github.com/mcdulltii/TinyScreen/blob/master/png/mp4.gif)

## Instructions

Run the following python script for the above windows, which specify the parameters of the output in the arduino file. After which, an .INO file is created under the ./Bitmap directory.

- PNG
	- Static or relative directory input
	- Numeric value for number of tiles (Columns only) of sprite sheet to split
	- Numeric value for number of (horizontal) pixels for each frame to be resized to

- GIF
	- Static or relative directory input
	- Numeric value for number of (horizontal) pixels for each frame to be resized to

- MP4
	- Static or relative directory input
	- Directory for splitted MP4 frames to be saved to
	- Numeric value for number of frames to be displayed out of the total splitted frames
	- Numeric value for number of (horizontal) pixels for each frame to be resized to

### Dependencies

- PyQt5
- Pillow
- Numpy
- Opencv-python

### Pyinstaller

Run the batch script to generate a Windows executable of the python script.
If on MacOS or Linux, modify the batch script to run on bash instead.

#### Thanks

- Julian for contributing to the generated INO code.
- [Files](https://github.com/zhyuhan/tamagotchi) within ./resources are from Yu Han

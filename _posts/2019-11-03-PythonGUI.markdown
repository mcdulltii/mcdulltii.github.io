---
layout: post
title:  "PythonGUI"
author: Aaron Ti
date:   2019-11-03
category: Programming
abstract: Self-created Python Server for CSV Analytics. Features tkInter and Web UI for CSV Analytics
website: https://github.com/mcdulltii/PythonGUI
---

### Python Version
`PythonGUI` uses python version 3.7.
This can be downloaded from [this link](https://www.python.org/) if not already installed.

### Supported Platforms
The program currently only supports Windows and Mac Operating Systems. TKinter versions installed on the host laptop may cause conflicts with the function if run on unsupported operating systems.

### Required Modules
Executables for Windows and Mac are provided with no dependencies required.
However if the `server.py` is run via the command line, additional modules will need to be installed beforehand:
- [Pandas](https://pandas.pydata.org/getpandas.html)

   Run `pip install pandas` in command prompt to install

- [Matplotlib](https://matplotlib.org/users/installing.html)

   Run `pip install matplotlib` in command prompt to install

- [Chardet](https://pypi.org/project/chardet/#files)

   Run `pip install chardet` in command prompt to install 

## Running the Application 
### Starting the GUI
1. Run
   ```
   <file path to PythonGUI>/PythonGUI/windows_exe.exe
   ```
   
   or
   
   Run the server file in command prompt to start.
   ```
   <file path to PythonGUI>/PythonGUI/Source Code/py -3 server.py
   ``` 

2. In the popup screen, select the two CSV files to be read
3. Choose your preferred browser to open the Web UI in

### Using the Web UI:
The Web UI will open in a new tab in your preferred browser. Now you can select whether to read the first file, the second one, or both. On the screen are to four options to choose from:
- [Group by](#group-by)
- [Selection](#selection)
- [Compare](#compare)
- [Graph](#graph)

### Group by:
Select the header to group by and click `submit`. The group interval is predefined and each group will return one dataset.

Multiple resultant group dataset will be shown on the web page and the generated files can be accessed from the [results folder](#generated-file-locations).

### Selection:
1. Select `Selection` and choose the desired headers of the data to be included in the desired dataset. 
2. To add more headers, click on the `add headers` button. Only a maximum of **4** headers are allowed to be chosen.

**OPTIONAL:**
  - Choose `Sort` to sort the data based on the first column chosen, with ascending order being the default. 
  - Check the `Descending` to return the results in descending order, as well as the number of rows to return (if needed). 
  - There are options to `sum` and `average` the columns as well.

The result is shown on the web page and an excel file will be generated and placed in the [results folder](#generated-file-locations).

### Compare:
Compare returns the merged data of both datasets, as well as the successful tenderers that have multiple company names and are names of non-entities. 
1. Select `compare` and submit to get the results. 

This will also generate the respective CSV and TXT files inside the [results folder](#generated-file-locations).
>Note: This function is only applicable to _entities-registered-with-acra.csv_ and _vacant-sites-sold-by-ura.csv_

### Graph:
1. Use [Group by](#group-by) function to generate files using desired columns for more meaningful insights
2. Run `server.py` file again by clicking on the second button at the page top
3. Select the two newly generated files from the [results folder](#generated-file-locations)
4. Select the `graph` option and choose the file that contains the data needed to plot the graph
5. Choose the x-axis and y-axis **(must be of numerical value type)** 
5. Choose the type of graph

The result is shown in the web page, a PNG file of the graph is also generated inside the [results folder](#generated-file-locations).

### Generated file locations
All generated files (including CSV files and graphs images) are placed in `\PythonGUI\Source Code\results`. 

> Note: For Mac Operating systems, the folder is placed in `\PythonGUI\GUI_Mac\Server.app\Contents\Resources`.

## Troubleshooting
### Reloading
Should the server fail to load or any of the columns not generate, or error in the display, do try reloading the page or re launching the `server.py`.

To reload, press `f5`.

### Selecting different files
After the first function has finished processing, the `Choose other CSV files` button at the output page will allow you to re-select 2 other CSV files in the same instance.

Alternatively, a re-launch of the main `server.py` can also be done to select other CSV files. 

### File directories
Ensure that the the locations of program files are not changed as this might cause an error. Should the `server.py` file not work, ensure that the `server.py` file and `runfunction.py` (and the Windows executable `windows_exe.exe`) are inside the `/PythonGUI/Source Code` folder.

### Messagebox window
The messagebox may not show up at the top-most window. `alt`+`tab` to find the message window and click `ok` to execute the program.

_Min resolution recommended: 720p_

> Note: The larger the dataset, the longer it will take to process the data.

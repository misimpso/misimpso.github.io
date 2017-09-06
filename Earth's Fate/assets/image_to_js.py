# -*- coding: utf-8 -*-
"""
Created on Wed May 25 15:18:13 2016

@author: TJ Dooley
"""

from scipy import misc

fileInName = "earth_continents.jpg"
fileOutName = "continentsdata.js"

continentColors = { "1,127,1": "northAmerica", "0,255,1": "southAmerica", "254,0,0": "europe", "255,255,0": "africa", "255,127,0": "asia", "0,0,126": "australia", "0,0,254": "antarctica" }
continentPositions = {}

fileIn = misc.imread(fileInName)
fileInArray = fileIn.tolist()
fileOut = open(fileOutName, 'w')

fileOut.write("// data used to determine country at a position\n")

for y in range(len(fileInArray)):
    for x in range(len(fileInArray[y])):
        color = str(fileInArray[y][x][0]) + "," + str(fileInArray[y][x][1]) + "," + str(fileInArray[y][x][2])
        continent = continentColors.get(color, None)
        if continent is not None:
            if continentPositions.get(continent, None) is None:
                continentPositions[continent] = []
            continentPositions.get(continent).append( (x, y) )
            
for continent in continentPositions.keys():
    setList = "["
    for pos in continentPositions[continent]:
        if setList == "[":
            setList += '"' + str(pos[0]) + "," + str(pos[1]) + '"'
        else:
            setList += ', "' + str(pos[0]) + "," + str(pos[1]) + '"'
    setList += "]"
    fileOut.write("\n" + continent + 'Positions = new Set(' + setList + ');\n')
    
        
fileOut.close()
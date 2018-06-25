from __future__ import division
from xlrd import open_workbook, XLRDError, xldate
from openpyxl import Workbook
import os
import sys
from datetime import date, timedelta
import json
import random

def readExcelToList():
	edir = "//DDIPDC/Company/Quality Metrics/Shipping QA data/Shipping_QA_Log.xls"
	if os.path.isfile(edir):
		try:
			errorBook = open_workbook(edir).sheet_by_index(0)
		except XLRDError as e:
			print e
			exit()
	elif not os.path.isfile(edir):
		print("Not a file: {}".format(edir))
		exit()
		
	errorRows = []
	
	for r in range(0, errorBook.nrows):
		if (errorBook.row(r)[1].ctype is 2 and errorBook.row(r)[2].ctype is 2):
			errorRows.append(
				{
					"date": date(*xldate.xldate_as_tuple(errorBook.row(r)[0].value, errorBook.book.datemode)[:3]).strftime("%#m/%#d/%Y"),
					"total": errorBook.row(r)[1].value,
					"defects": errorBook.row(r)[2].value,
					"inspector": errorBook.row(r)[5].value
				}
			)
			
	print(errorRows)
	saveToFile(errorRows)
	
def generateData(start, num):
	genrows = []
	
	peeps = ["JA", "UB", "DH", "XR", "KO"]
	defcodes = ["X1", "X2", "X3", "X4", "X5", "X6", "X7", "X8", "X9", "XA"]
	
	
	for d in [date(*start) + timedelta(x) for x in range(0, num)]:
		total = random.randint(1, 20)
		defects = random.randint(0, total)
		dfcd = { code:random.randint(0, defects) for code in defcodes }
			
		print("{} / {} = {:.1%}".format(defects, total, (defects/total)))
		genrows.append(
			{
				"date": d.strftime("%#m/%#d/%Y"),
				"total": total,
				"defects": defects,
				"inspector": peeps[random.randint(0, len(peeps)-1)],
				"defcodeoccur": dfcd
			}
		)
	saveToFile(genrows)
	
def saveToFile(list):
	jj = json.dumps(list)
	print jj
	
	with open('../js/jsonOutput.json', 'wb+') as jso:
		jso.write(format(jj))
		jso.close()

if __name__ == "__main__":
	# readExcelToList()
	generateData((2018, 5, 20), 20)
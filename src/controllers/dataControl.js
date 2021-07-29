//needed packages
const Excel = require('exceljs'); 

//needed models 
const organizations = require('../models/organizations');  
const prespectives = require('../models/prespectives'); 
const goals = require('../models/goals'); 
const objectives = require('../models/objectives');
const milestones = require('../models/milestones'); 
const initiatives = require('../models/initiatives'); 


exports.DataIntegration= async (req , res , next) =>{
    let workbook = new Excel.Workbook() ;
    workbook.xlsx.readFile('C:/test.xlsx').then(()=>{
      workbook.eachSheet( async (worksheet , sheetId)=>{  
          console.log(sheetId);
        let dataArray = await changeRowsToDict(worksheet);  
          if(sheetId === 28)
            await organizations.bulkCreate(dataArray); 
            if(sheetId === 2)
            await prespectives.bulkCreate(dataArray); 
          if(sheetId === 3)
            await goals.bulkCreate(dataArray); 
          if(sheetId === 4)
            await objectives.bulkCreate(dataArray); 
          if(sheetId === 5)
            await initiatives.bulkCreate(dataArray);   
          if(sheetId === 27)
            await milestones.bulkCreate(dataArray);

        });
    });
    res.status(200).json({
      message: 'Uploaded Successfully' ,
  }); 
}

//parse excel row to json object
async function changeRowsToDict(worksheet){ 
    let dataArray = [];
    let keys = [];
    worksheet.eachRow(async function(row, rowNumber) {
      if(rowNumber == 1)
        keys = row.values;
      else{
        let rowDict = await cellValueToDict(keys, row);
        dataArray.push(rowDict);
      }
    });
    return dataArray;
}
async function cellValueToDict(keys,row){
    let data = {};
    row.eachCell(function(cell, colNumber){
      var value =  cell.value.toString();
      data[keys[colNumber]]  = value;   
    });
    return data;
}
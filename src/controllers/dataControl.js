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
  try {
    let workbook = new Excel.Workbook() ;    
    workbook.xlsx.readFile('D:/test.xlsx').then(()=>{
      workbook.eachSheet( async (worksheet , sheetId)=>{  
          console.log(worksheet.name);
          const obj = require('../models/'+worksheet.name); 
          let dataArray = await changeRowsToDict(worksheet);
          let fieldsSet = new Set(dataArray.flatMap(x => Object.keys(x)));
          fieldsSet.delete("ID");
          let fieldsToUpdate = Array.from(fieldsSet);
          obj.bulkCreate(dataArray,{ updateOnDuplicate: fieldsToUpdate });         
        });
        res.status(200).json({
          message: 'Uploaded Successfully' ,
      });
    }); 
  } catch (error) {
    console.log(error);
    res.status(500).json({
        message : 'Something went wrong, plesae try again later'
    }) ; 
 }
    
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
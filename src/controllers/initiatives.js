const Excel = require('exceljs'); 

exports.getInit= async (req , res , next) =>{
  let workbook = new Excel.Workbook() ;
  workbook.xlsx.readFile('C:/test.xlsx').then(()=>{
    let worksheet = workbook.getWorksheet('Initiatives') ; 

  });

}
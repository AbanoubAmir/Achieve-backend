exports.getDashboard = async (req , res , next) => {
    try {
        console.log(req.url);
        var tableName = req.params.tablename;
        if(Object.keys(req.query).length === 0)
        {
            res.status(200).json({
                message : tableName+' fetched successfully',
                body : await GetRows(tableName)
            });
        }
        else{
            res.status(200).json({
                message : tableName+' fetched successfully',
                body : await GetRowsById(tableName, req.query.Id)
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message : 'Something went wrong, plesae try again later'
        }) ; 
     }
}
exports.postDashboard = async (req,res,next) => {
    try {
        const obj = require('../models/'+req.params.tablename); 
        if(req.params.tablename!="users")
        {
            obj.create(req.body).then( updatedRecord => {
                res.status(200).json({
                    message:'Record added Successfully',
                    body: updatedRecord
              });
              }) 
        }
        else
        {
            req.body.Data['password'] = Math.random().toString(36).substr(2, 8);
            obj.create(req.body.Data).then( updatedRecord => {
            res.status(200).json({
                message:'Record added Successfully',
                body: updatedRecord
          });
          }) 
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message : 'Something went wrong, plesae try again later'
        }) ; 
     }
    
}
exports.putDashboard = async (req,res,next) => {
    try {
    const obj = require('../models/'+req.params.tablename); 
    await obj.findOne({where: {id: req.body.ID}})
    .then(record => {     
      if (!record) {
        throw new Error('No record found')
      }

      record.update(req.body.Data).then( updatedRecord => {
        res.status(200).json({
            message:req.params.tablename+'updated Successfully',
            body: updatedRecord
      });
      })    
    })
    
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message : 'Something went wrong, plesae try again later'
        }) ; 
     }
    
}
exports.deleteDashboard = async (req,res,next)=>{
    try {
        const obj = require('../models/'+req.params.tablename); 
        await obj.destroy({
            where: {id: req.query.ID}
        }).then(deleteStatus => {
            res.status(200).json({
                message:'Record deleted Successfully',
                body: deleteStatus
          });
          })   
        }
        
         catch (error) {
            console.log(error);
            res.status(500).json({
                message : 'Something went wrong, plesae try again later'
            }) ; 
         }
        
}

GetRows = async(tableName)=>{
    let fetchedRows = []; 
    const obj = require('../models/'+tableName); 
    await obj.findAll().then((result)=>{
        result.forEach(ele => {
            fetchedRows.push(ele.dataValues);
        }); 
    });
    return fetchedRows;
}
GetRowsById = async(tableName,Id)=>{
    let fetchedRows = []; 
    const obj = require('../models/'+tableName); 
    await obj.findOne({
        where: {
            ID: Id,
        }}).then((result)=>{
            fetchedRows.push(result);
    });
    return fetchedRows;
}

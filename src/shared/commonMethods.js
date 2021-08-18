const settings = require('../models/settings');

exports.assignColor = (progressVal) =>{
    if(progressVal < 50)
        return "#f44336";
    else if (progressVal < 75)
        return "#ffeb3b";
    else if (progressVal < 90)
        return "#2196f3";
    else 
        return "#4caf50";    
}

exports.getDate = async (month , type , orgID) => {
    if(type === 'Monthly'){
        let months = [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`, `Jul`,`Aug`, `Sep`, `Oct`, `Nov`, `Dec`];
        let chosenMonth = month.split('-')[0] ; 
        let year = month.split('-')[1] ; 
        return [months.indexOf(chosenMonth)+1 , year];
    }
    else if(type === 'Yearly'){
        return [new Date().getMonth()+1,year];
    }
    else if(type === 'Quarterly'){
        let quarters = [] ; 
        let months = [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`, `Jul`,`Aug`, `Sep`, `Oct`, `Nov`, `Dec`];

        await settings.findOne({
            where : {
                organizationID : orgID
            }
        }).then((result)=>{
            quarters.push(result.dataValues.firstQuarterEnd);
            quarters.push(result.dataValues.secondQuarterEnd);
            quarters.push(result.dataValues.thirdQuarterEnd);
            quarters.push(result.dataValues.forthQuarterEnd);
        });
        for(let i = 0 ; i < quarters.length ;i++){
            quarters[i] = months.indexOf(quarters[i].split('-')[0])+1;
        }
        let chosenQuarter = month.split('-')[0];
        let year = month.split('-')[1]; 
        console.log([quarters[chosenQuarter[1]-1] , year]);
        return [quarters[chosenQuarter[1]-1] , year];  
    }
}

exports.allQuarters = async (Quarter , orgID) => {
    let quarters = [] ; 
    let months = [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`, `Jul`,`Aug`, `Sep`, `Oct`, `Nov`, `Dec`];
    await settings.findOne({
        where : {
            organizationID : orgID
        }
    }).then((result)=>{
        quarters.push(result.dataValues.firstQuarterEnd);
        quarters.push(result.dataValues.secondQuarterEnd);
        quarters.push(result.dataValues.thirdQuarterEnd);
        quarters.push(result.dataValues.forthQuarterEnd);
    });
    for(let i = 0 ; i < quarters.length ;i++){
        quarters[i] = months.indexOf(quarters[i].split('-')[0])+1;
    }
    let year = Quarter.split('-')[1] ; 
    console.log([quarters , year]);
    return [quarters , year];    
}

exports.getLimit = async (orgID) => {
    let limit = 0 ; 
    await settings.findOne({
        where : {
            organizationID : orgID
        }
    }).then((result)=>{
        limit = result.dataValues.limit;
    });

    return limit;    
}

exports.getHistoricalLabels = (Date , dateType , limit) => {
    let months = [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`, `Jul`,`Aug`, `Sep`, `Oct`, `Nov`, `Dec`];
    if(dateType === 'Monthly'){
        let month = Date.split('-')[0] ,  year   = Date.split('-')[1]; 

        if(month === 'Jan'){
            return [`Jan-${year}` ,`Dec-${year-1}`,`Nov-${year-1}`,`Oct-${year-1}`].splice(0,limit); 
        }
        if(month === 'Feb'){
            return [`Feb-${year}` ,`Jan-${year}`,`Dec-${year-1}`,`Nov-${year-1}`].splice(0,limit); 
        }
        if(month === 'Mar'){
            return [`Mar-${year}` ,`Feb-${year}`,`Jan-${year}`,`Dec-${year-1}`].splice(0,limit); 
        }
       else{
            return [`${months[months.indexOf(month)]}-${year}` ,`${months[months.indexOf(month)-1]}-${year}`,`${months[months.indexOf(month)-2]}-${year}`,`${months[months.indexOf(month)-3]}-${year}`].splice(0,limit); 
        }
    }
    else if (dateType === 'Quarterly'){
        let quarter = Date.split('-')[0] ,  year   = Date.split('-')[1]; 
        if(quarter === 'Q1'){
            return [`Q1-${year}` ,`Q4-${year-1}`,`Q3-${year-1}`,`Q2-${year-1}`].splice(0,limit); 
        }
        if(quarter === 'Q2'){
            return [`Q2-${year}` ,`Q1-${year}`,`Q4-${year-1}`,`Q3-${year-1}`].splice(0,limit); 
        }
        if(quarter === 'Q3'){
            return [`Q3-${year}` ,`Q2-${year-1}`,`Q1-${year-1}`,`Q4-${year-1}`].splice(0,limit); 
        }
        if(quarter === 'Q4'){
            return [`Q4-${year}` ,`Q3-${year}`,`Q2-${year}`,`Q1-${year}`].splice(0,limit); 
        }
    }
    else if (dateType === 'Yearly'){
        let label = []; 
        for(let i = 0 ; i<limit ; i++){
            label.push(Date-i);
        }
        return label; 
    }
}
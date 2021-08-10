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
exports.getMonth = (month) => {
    let months = [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`, `Jul`,`Aug`, `Sep`, `Oct`, `Nov`, `Dec`];
    let chosenMonth = month.split('-')[0] ; 
    let year = Quarter.split('-')[1] ; 
    return [months.indexOf(chosenMonth)+1 , year];
}
exports.getMonthQuarter = (Quarter) => {
    let chosenQuarter = Quarter.split('-')[0];
    let year = Quarter.split('-')[1] ; 
    return [[3,6,9,12] , year];    
}
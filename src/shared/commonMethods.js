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
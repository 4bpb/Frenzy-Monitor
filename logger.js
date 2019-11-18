const chalk = require('chalk');
function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return hour + ":" + min + ":" + sec;

}
var log = function (message,status){

    if(status==="err"){
        console.log(chalk.bold.redBright(message)+"   "+getDateTime())
    }
    else {
        if(status==='ok'){
            console.log(chalk.bold.greenBright(message)+"   "+getDateTime())
        } else {
            console.log(chalk.bold.magentaBright(message)+"   "+getDateTime())
        }
    }
}



module.exports = log;
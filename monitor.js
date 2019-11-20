const log = require('./logger.js');
var rp = require('request-promise');

function monitor(){
    var product_array = []
    var product_total = []
    rp('https://frenzy.shopifyapps.com/api/flashsales')
    .then(function (body) {
        log('Initial Request Success','ok')
        body = JSON.parse(body)
        product_total.push(body.flashsales.length)
        log(body.flashsales.length,'init')
        var i = 0;
        while(i<body.flashsales.length){
            product_array.push(body.flashsales[i]["custom_message"])
            //log('Product: ' + body.flashsales[i]["custom_message"]+ ' Added','')
            i++
        }
        log('Initializing Main Monitor')
        getData(product_array,product_total)
    })
    .catch(function (err) {
        console.log(err)
    });
}

function getData(product_array,product_total){
    rp('https://frenzy.shopifyapps.com/api/flashsales')
    .then(function (body) {

        body = JSON.parse(body)
        if(product_total!=body.flashsales.length){
            log('New product count : '+body.flashsales.length, 'ok')
            var x = 0;
            while(x<body.flashsales.length){
                if(body.flashsales[x]["custom_message"]!=product_array){
                    product_array.push(body.flashsales[x]["custom_message"])
                    log('Product: ' + body.flashsales[x]["custom_message"]+ ' Added')
                    log(body.flashsales[x]["custom_message"])
                    log(body.flashsales[x]["available_at"])
                    log(body.flashsales[x]["description"])
                    log(body.flashsales[x]["price_range"])
                    log(body.flashsales[x]["password"])
                }
                x++
            }

        }

        getData(product_array,product_total)
    })
    .catch(function (err) {
        console.log(err)
    }); 
}


monitor()



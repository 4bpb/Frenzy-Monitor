var rp = require('request-promise');
var log = require('./logger')
const fs = require('fs');
var cal = require('generate-calendar-url');
const Discord = require('discord.js');


let config = fs.readFileSync('config.json');
let parsedConfig = JSON.parse(config);
let realtime = parsedConfig.realtime;

global.globalPassword = [];


function main(){
    var init_length = [];
	var init_password = []; 
    rp('https://frenzy.shopifyapps.com/api/flashsales')
    .then(function (body) {
        body = JSON.parse(body);
        init_length.push(body.flashsales.length);
        log('First Product Total: '+body.flashsales.length,'info')

        var i = 0;
        while (i < body.flashsales.length) {
            init_password.push(body.flashsales[i]['password']);
            globalPassword.push(body.flashsales[i]['password']);
            i++;
        }
        log('First Array Filled, Starting Monitor','init')
        if(globalPassword>0){
            let set = new Set(globalPassword)
            let globalPassword = [...set]
        }
        

        monitor(init_length,init_password)

    })
    .catch(function (err) {
        log('Error on main func','err')
        main()
    });
}



function monitor(init_length,init_password){
    var data_length = [];
    var data_password = [];
    let startTime = new Date().getTime()
    
    rp('https://frenzy.shopifyapps.com/api/flashsales')
    .then(function (body) {
        let endtime = new Date().getTime()
        let apiResponse = (endtime-startTime)/1000
        body = JSON.parse(body);
        data_length.push(body.flashsales.length);


        if(init_length!=body.flashsales.length){
            log('Api Response Time: ' + apiResponse,'ok')
            log('New Product Total: '+data_length,'ok')
            if(realtime===true){

                var x = 0;
                while (x < data_length) {
                    data_password.push(body.flashsales[x]['password']);
                    //log('Added to second arr: '+ body.flashsales[x]['password'],'info')
                    x++;
                }
                log('Second Array Filled','init')
    
                var y = 0;
                while (y < data_length) {
                    if (init_password.indexOf(data_password[y]) === -1) {
                        log('New Product: '+data_password[y],'ok')
                        getData(data_password[y])
    
                    }
                    y++;
                }
                log('Restarting Script','res')
                main()

            } else {

                
                var x = 0;
                while (x < data_length) {
                    data_password.push(body.flashsales[x]['password']);
                    //log('Added to second arr: '+ body.flashsales[x]['password'],'info')
                    x++;
                }
                log('Second Array Filled','init')
    
                var y = 0;
                while (y < data_length) {
                    if (globalPassword.indexOf(data_password[y]) === -1) {
                        log('New Product: '+data_password[y],'ok')
                        globalPassword.push(data_password[y])
                        getData(data_password[y])
    
                    }
                    y++;
                }
                log('Restarting Script','res')
                main()
                
            }

        } else {
            //log('Monitor Round Complete','info')
            let endtime = new Date().getTime()
            let apiResponse = (endtime-startTime)/1000
            //log('Api Response Time: ' + apiResponse,'info')
            monitor(init_length,init_password)
        }


        
    
    })
    .catch(function (err) {
        log('Error on monitor func','err')
        monitor(init_length,init_password)
    });

}


function getData(password){
    let startTime = new Date().getTime()
    
    rp('https://frenzy.shopifyapps.com/api/flashsales/'+password)
    .then(function (body) {
        let endtime = new Date().getTime()
        let apiResponse = (endtime-startTime)/1000
        body = JSON.parse(body)
        var title = body.flashsale["title"]
        var description  = body.flashsale["description"]
        var time  = new Date((body.flashsale["started_at"])).toString()
        var priceRange  = body.flashsale["price_range"]["min"] + "-" + body.flashsale["price_range"]["max"]
        var shippingMessage = body.flashsale["shipping_message"]
        var productCount = body.flashsale["products_count"]
        var dropzone = body.flashsale["dropzone"]
        var image = body.flashsale["image_urls"][0]

        var event = {
            title: title,
            start: new Date(time),
            end: new Date(time),
            location: 'Frenzy',
            description: description
          };

        var msg = {
            
                "embeds": [{
                  "title": title,
                  "url": "https://frenzy.sale/"+password,
                  "description": description,
                  "timestamp": time,
                  "thumbnail": {
                    "url": image,
                },
                  "footer": {
                    "text": "Found in "+apiResponse+" Seconds"
                  },
                  "fields":[
                        {
                        "name": "Count Down",
                        "value": time,
                        "inline": true
                        },
                        {
                        "name": "Price Range",
                        "value": priceRange,
                        "inline": true
                        },
                        {
                        "name": "Shipping Message",
                        "value": shippingMessage,
                        "inline": true
                        },
                        {
                        "name": "Product Count",
                        "value": productCount,
                        "inline": true
                        },
                        {
                        "name": "Calendar Event",
                        "value": "[Event]("+cal.google(event)+")",
                        "inline": false
                        }

                  ]
                }]
              
        }

        log(msg,'',true)


        
 


    })
    .catch(function (err) {
        log('Embeded webhook Error https://frenzy.sale/'+ password,'',true)
        
    });
}


function startmessage(){
    let webhookID = '727697683942342758';
    let webhookToken = 'HRVPgWQsOUtPlV1SvxWwd-jQexZXeS4j1xpSp1OsTUluc8EsX15WHLIk2E6OwroPKC8G';
    const hook = new Discord.WebhookClient(webhookID, webhookToken);
    hook.send('Monitor has started')
}



startmessage()
main()
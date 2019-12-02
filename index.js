var rp = require('request-promise');
var log = require('./logger')

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
            i++;
        }
        log('First Array Filled, Starting Monitor','init')
        

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
    
    rp('https://frenzy.shopifyapps.com/api/flashsales')
    .then(function (body) {
        body = JSON.parse(body);
        data_length.push(body.flashsales.length);


        if(init_length!=body.flashsales.length){
            log('New Product Total: '+data_length,'ok')

            var x = 0;
            while (x < data_length) {
                data_password.push(body.flashsales[x]['password']);
                x++;
            }
            log('Second Array Filled','init')

            var y = 0;
            while (y < data_length) {
                if (init_password.indexOf(data_password[y]) === -1) {
                    log("https://frenzy.sale/"+data_password[y],'ok',true)

                }
                y++;
            }
            log('Restarting Script','res')
            main()
        } else {
            log('Monitor Round Complete','info')
            monitor(init_length,init_password)
        }


        
    
    })
    .catch(function (err) {
        log('Error on monitor func','err')
        monitor(init_length,init_password)
    });

}

main()
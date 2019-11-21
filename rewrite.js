const log = require('./logger.js');
var rp = require('request-promise');

function monitor() {
	var init_length = [];
	var init_password = [];

	rp('https://frenzy.shopifyapps.com/api/flashsales')
		.then(function(body) {
			body = JSON.parse(body);
			init_length.push(body.flashsales.length);
			log('Product Total: ' + init_length, 'init');

			var i = 0;
			while (i < body.flashsales.length) {
				init_password.push(body.flashsales[i]['password']);
				i++;
			}

			getData(init_length, init_password);
		})
		.catch(function(err) {
			log('Error 1', 'err');
			monitor();
		});
}

function getData(init_length, init_password) {
	var data_length = [];
	var data_password = [];

	rp('https://frenzy.shopifyapps.com/api/flashsales')
		.then(function(body) {
			body = JSON.parse(body);
			data_length.push(body.flashsales.length);

			if (init_length != body.flashsales.length) {
				log('New product total: ' + data_length, 'ok');
				var x = 0;
				while (x < data_length) {
					data_password.push(body.flashsales[x]['password']);
					x++;
				}

				var x = 0;
				while (x < body.flashsales.length) {
					if (init_password.indexOf(data_password[x]) === -1) {
						log('https://frenzy.sale/'+data_password[x], 'ok');
						x++;
					}
					
                }
                monitor();
			} else {
				getData(init_length, init_password);
			}
		})
		.catch(function(err) {
			log('Error 2', 'err');
			getData(init_length, init_password);
		});
}

monitor();

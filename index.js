var express = require('express');  
var path = require('path');
var setup = require('./public/setup.js');

var app = express();
app.use(express.static(path.join(setup.fileRoot, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get(setup.urlPort + '/', function (req, res) {  
    res.sendFile(setup.fileRoot + '/public/directory.html');
})

app.get(setup.urlPort + '/teleBill', function (req, res) {  
    res.sendFile(setup.fileRoot + '/public/teleBill/teleBill.html');
})

app.get(setup.urlPort + '/mahjong', function (req, res) {  
    res.sendFile(setup.fileRoot + '/public/mahjong/main.html');
})

var telebot = require('./telebot.js')

app.post(setup.urlPort + '/getAdmins', function (req, res) {  
	telebot.bot.telegram.getChatAdministrators(req.body.chatId).then((arr) => {
		var adminArr = [];
		for (i = 0; i < arr.length; i++) {
			if (!arr[i].user.is_bot) {
				adminArr.push(arr[i].user.username);
			}
		}
		res.send(adminArr);
	})
});

app.post(setup.urlPort + '/teleMsg', function (req, res) {  
	var msg = 
		req.body.eventName + '\n' +
		req.body.eventDate + '\n' +
		'\nPaid:' + '\n' +
		'\nHave not paid:' + '\n';
	for (i = 0; i < req.body.participants.length; i++) {
		msg += req.body.participants[i].name + ' $' + req.body.participants[i].pay.toFixed(2) + '\n';
	}
	msg += '\n~'
	var opts = {
		reply_markup: {
			inline_keyboard: [ 
				[
					{ text: 'Pay', callback_data: 'Pay' },
				],
				[
					{ text: 'Unpay', callback_data: 'Unpay' },
				]
			],
		}
	};
	telebot.bot.telegram.sendMessage(req.body.chatId, msg, opts);
	res.write('Message sent');
	res.end();
});

var server = app.listen(8000, function () {  
  
  var host = server.address().address
  var port = server.address().port
  console.log("host: %s", host)
  console.log("port: %s", port)
  
})
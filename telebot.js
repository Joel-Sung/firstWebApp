var { Telegraf } = require('telegraf');
var setup = require('./public/setup.js');
var bot = new Telegraf('1847366451:AAGVcqcyAg9KDIanTJo8cxEfU6DzGTHWpbA');
module.exports.bot = bot;

var fs = require('fs');

bot.launch();

bot.command('hi', (ctx) => {
	ctx.replyWithPhoto({ source: setup.fileRoot + '/public/media/1950s-Middle-Finger.jpg' });
})

bot.command('quickbill', (ctx) => { 
	const text = "<a href='https://joelsung.com/21098/teleBill/#/" + ctx.message.chat.id + "/'>Create a bill here</a>";
	ctx.telegram.sendMessage(ctx.message.chat.id, text, { parse_mode: 'HTML' });
});

bot.on('callback_query', (ctx) => {
	var user = ctx.callbackQuery.from.username;
	var msg = ctx.callbackQuery.message.text;
	if (ctx.callbackQuery.data === 'Pay') {
		// Split msg into paid and not-paid
		var middle = msg.search('\nHave not paid:');
		var paid = msg.substr(0, middle); // paid
		var notPaid = msg.substr(middle); // not paid
		// Split not-paid into before-user and from-user
		var userIndex = notPaid.search(user);
		// Only if user is in not paid list
		if (userIndex !== -1) {
			var msg2 = notPaid.substr(0, userIndex); // before-user
			var fromUser = notPaid.substr(userIndex); // from-user
			// Split from-user into user-line and after-user
			var newlineIndex = fromUser.search('\n');
			var userLine = fromUser.substr(0, newlineIndex + 1); // user-line
			var msg3 = fromUser.substr(newlineIndex + 1); // after-user
			// Add user-line to paid
			var msg1 = paid.concat(userLine);
			// Combine paid to before-user to after-user
			var finalMsg = msg1 + msg2 + msg3;

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
			ctx.editMessageText(finalMsg, opts);
		}
	} else if (ctx.callbackQuery.data === 'Unpay') {
		// Split msg into paid and not-paid
		var middle = msg.search('\nHave not paid:');
		var paid = msg.substr(0, middle); // paid
		var notPaid = msg.substr(middle); // not-paid
		// Split paid into before-user and from-user
		var userIndex = paid.search(user);
		// Only if user is in paid list
		if (userIndex !== -1) {
			var msg1 = paid.substr(0, userIndex); // before-user
			var fromUser = paid.substr(userIndex); // from-user
			// Split from-user into user-line and after-user
			var newlineIndex = fromUser.search('\n');
			var userLine = fromUser.substr(0, newlineIndex + 1); // user-line 
			var msg2 = fromUser.substr(newlineIndex + 1); // after-user
			// Split not-paid into before-lastline and lastline
			var lastlineIndex = notPaid.search('\n~');
			var beforeLastLine = notPaid.substr(0, lastlineIndex); // before-lastline
			var msg4 = notPaid.substr(lastlineIndex); // lastline
			// Add user-line to before-lastline
			var msg3 = beforeLastLine.concat(userLine);
			// Combine paid to after-user to not-paid to lastline
			var finalMsg = msg1 + msg2 + msg3 + msg4;

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
			ctx.editMessageText(finalMsg, opts);
		}
	}
	
	ctx.answerCbQuery();
});

bot.command('meme', (ctx) => {
    fs.readdir(setup.fileRoot + '/public/memes', (err, files) => {
        if (err) throw err;
        ctx.replyWithPhoto({ source: setup.fileRoot + '/public/memes/' + getRandomInt(0, files.length) + '.jpg' });
    })
})

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

bot.command('mahjong', (ctx) => { 
	const text = "<a href='https://joelsung.com/21098/mahjong/#/initialize/'>Mahjong chips tracker</a>";
	ctx.telegram.sendMessage(ctx.message.chat.id, text, { parse_mode: 'HTML' });
});

bot.command('bye', (ctx) => {
    ctx.replyWithAnimation({ source: setup.fileRoot + '/public/media/PEPE Dancing.gif' });
});
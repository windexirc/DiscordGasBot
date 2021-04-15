require("dotenv").config();
const http = require('https');
const Discord = require('discord.js');
const bot = new Discord.Client();
var fastGasPrice;
var fastestGasPrice;
var alertPrice = 100;
const TOKEN = process.env.TOKEN;
const PULSEAPIKEY = process.env.DEFIPULSEAPI;
const INFURAURL= process.env.INFURAURL;
bot.login(TOKEN);
bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
    getGas();
  });
  
  bot.on('message', msg => {
    if (msg.content === '!gas') {
        msg.channel.send('Fast Gas Price: ' + fastGasPrice + ' GWEI - Fastest Gas Price: ' + fastestGasPrice + ' GWEI - Alerts under ' + alertPrice + ' GWEI');
    } 
  });

  function getGas(){
    var url = `https://data-api.defipulse.com/api/v1/egs/api/ethgasAPI.json?api-key=${PULSEAPIKEY}`;

    http.get(url, function(res){
        var body = '';
    
        res.on('data', function(chunk){
            body += chunk;
        });
    
        res.on('end', function(){
            var resp = JSON.parse(body);
            fastGasPrice = parseInt(resp.fast) / 10;
            fastestGasPrice = parseInt(resp.fastest) / 10;
            bot.user.setPresence({activity: {name: fastGasPrice + ' GWEI - '+ fastestGasPrice + ' GWEI'}, status: 'online'});
            setTimeout(() => getGas(),60000);
        });
    }).on('error', function(e){
          console.log("Got an error: ", e);
          setTimeout(() => getGas(),60000);
    });
  }
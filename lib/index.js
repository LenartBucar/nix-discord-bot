'use strict';

const fs = require('fs');
const Discord = require('discord.js');

const games = require('../data/games');
const cfg = require('../config.js');
const pkg = require('../package.json');
const msgStrings = require('./modules/clapp-discord/str-en');

const Clapp = require('./modules/clapp-discord');
const bot = new Discord.Client();

let spyUser = null;

const app = new Clapp.App({
  name: cfg.name,
  desc: pkg.description,
  prefix: cfg.prefix,
  separator: cfg.separator,
  version: pkg.version,
  onReply: (response, context) => {
    if (typeof response === "string") {
      response = {
        message: response,
        type: 'reply'
      }
    }

    let replyPromise;
    switch (response.type) {
      case 'none':
        return;
      case 'private':
        replyPromise = context.msg.member.sendMessage(response.message);
        break;
      case 'message':
        replyPromise = context.msg.channel.sendMessage(response.message);
        break;
      default:
        replyPromise = context.msg.reply(response.message);
        break;
    }

    replyPromise
      .catch(error_response => {
        handleInternalError(msg, error_response);
      });
  }
});

// Load every command in the commands folder
fs.readdirSync('./lib/commands/')
  .forEach(file => {
    app.addCommand(require("./commands/" + file));
  });

bot.on('message', msg => {
  try {
    // Fired when someone sends a message
    let command = msg.content.toLowerCase();

    if (app.isCliSentence(command)) {
      // rewrite '!help' to '! --help'
      let helpCmd = cfg.prefix + cfg.separator + 'help';
      if (msg.content === helpCmd) {
        msg.content = cfg.prefix + ' --help';
        command = msg.content;
      }

      app.parseInput(
        command, {
          msg: msg,
          member: msg.member,
          guild: msg.guild,
        }
      );
    }
  }
  catch (e) {
    handleInternalError(msg, e);
  }
});

bot.on('disconnect', (erMsg) => {
  console.error('----- Bot disconnected from Discord with code', erMsg.code, 'for reason:', erMsg, '-----');
  messageSpy('I was disconnected. :( \nError code was ' + erMsg.code);
});

bot.login(cfg.token)
  .then(() => {
    setInterval(() => {
      setNewGame();
    }, 30000);

    setNewGame();
    console.log('Running!');

    bot.fetchUser(cfg.spyUserId)
      .then((user) => {
        spyUser = user;
        messageSpy('I\'m now online!');
      })
      .catch((msg) => {
        console.error('unable to locate SpyMaster:', msg)
      });
  });

function handleInternalError(msg, error) {
  let errorToken = (Math.random() + 1).toString(16).substr(2, 5);

  console.error('Error Token: ' + errorToken);
  console.error(error);

  if (msg) {
    msg.reply(
      msgStrings.err + msgStrings.err_internal_error + '\nIf you see SpyMaster356,' +
      ' tell him to look for this in my logs: ' + errorToken
    );
  }

  messageSpy('I ran into an internal error. :(\nThe error token is ' + errorToken);
}

function setNewGame() {
  let game = games[Math.floor(Math.random() * games.length)];
  bot.user.setGame(game)
    .catch((error_response) => {
      handleInternalError(null, error_response);
    });
}

function messageSpy(msg) {
  if (spyUser !== null) {
    spyUser.sendMessage(msg)
      .catch(() => {
        spyUser = null;
        console.error('Connection to Spy lost.')
      });
  }
}

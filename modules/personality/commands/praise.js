const RandomReplyCommand = require('../../../lib/random-reply-command');

let PraiseCommand = new RandomReplyCommand({
  name: 'praise',
  description: 'Why?',
  showInHelp: false,
  messages: [
    "I um... Think you're being a little weird there.",
    "You been hanging out with Walter again haven't you?",
    "Uh... Ok?",
    "I'm not sure I'm worthy of praise. I'm just a simple bot.",
    "Can't you guys go bug my sister-daughter?",
    "...",
    "This whole 'being a goddess' thing has gotten out of hand...",
    "Thanks?",
    "Shouldn't you be grouping up with your team?",
    "I'm not anything special",
    "Could you stop that please? It's creepy.",
    "Why? What did I do?",
  ],
});
module.exports = PraiseCommand;

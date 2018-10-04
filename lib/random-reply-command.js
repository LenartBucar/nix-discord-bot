function RandomReplyCommand(options) {
  let messages = options.messages;

  delete options.messages;

  options.run = (context, response) => {
    let message = randomMessage(messages)
      .replace(/:(\w\w+):/, (match, emojiName) => emojiMatch(emojiName, context.guild))
      .trim();

    if (message === '') {
      // Random message was made of unavailable emoji. Try again.
      return options.run(context, response);
    }

    response.type = 'message';
    response.content = message;
    return response.send();
  };

  return options;
}

function randomMessage(messages) {
  return messages[Math.floor(Math.random() * messages.length)];
}

function emojiMatch(emojiName, guild) {
  let emojis = guild.emojis;
  let name = emojiName.toLowerCase();

  if (guild) {
    let foundEmoji = emojis.find((emoji) => emoji.name.toLowerCase() === name);
    return foundEmoji ? foundEmoji.toString() : '';
  } else {
    return '';
  }
}

module.exports = RandomReplyCommand;

const privateConfig = require('./config/private.js');
const games = require('./config/games');

module.exports = {
  loginToken: privateConfig.loginToken,
  ownerUserId: privateConfig.ownerUserId,
  games: games,
};

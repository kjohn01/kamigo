const { router, text } = require('bottender/router');

const learn = require('./learn ');
const forget = require('./forget');
const perform = require('./perform');

module.exports = async function App() {
  return router([
    // Learn tricks, pattern of the command: kamigo learn;keyword;response
    text(/^kamigo learn;([^;]+);([^;]+)$/, learn),
    // Forget a trick, pattern of the command: kamigo forget;keyword
    text(/^kamigo forget;([^;]+)$/, forget),
    // Perform the tricks
    text('*', perform),
  ]);
};

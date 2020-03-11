const { partition, last } = require('lodash');
const { router, text } = require('bottender/router');

const db = {
  map: {},
};

const learn = async context => {
  const [, key, val] = text.split(';');

  // Check if it's a taught trick
  if (!db.map[key]) db.map[key] = [];

  // Update/Learn new trick
  db.map[key].push({
    sessionId: context.session.id,
    keyword: key,
    message: val,
  });

  await context.sendText('Got it!');
  return;
};

const forget = async context => {
  const [, key] = text.split(';');
  // Remove the trick by the session ID
  db.map[key] = db.map[key].filter(
    mapping => mapping.sessionId !== context.session.id
  );
  // If there's no match of the keys, nothing's happening
  await context.sendText('Trick forgotten');
  return;
};

const perform = async context => {
  const mappings = db.map[text];
  // Check if it's a taught trick
  if (mappings && mappings.length > 0) {
    // The trick may have been taught outside of the current group/room,
    // Therefore we divide it into 2 arrays by the session ID.
    const [localMappings, globalMappings] = partition(mappings, {
      sessionId: context.session.id,
    });

    // Check local first, if unavailable, then use the global
    const answer = last(
      localMappings.length > 0 ? localMappings : globalMappings
    ).message;

    await context.sendText(answer);
    return;
  }
};

module.exports = async function App(context) {
  return router([
    // Learn tricks, pattern of the command: kamigo learn;keyword;response
    text(/^kamigo learn;([^;]+);([^;]+)$/, learn),
    // Forget a trick, pattern of the command: kamigo forget;keyword
    text(/^kamigo forget;([^;]+)$/, forget),
    // Perform the tricks
    text('*', perform),
  ]);
};

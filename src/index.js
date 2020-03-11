const { partition, last } = require('lodash');

const db = {
  map: {},
};

module.exports = async function App(context) {
  // Learn tricks
  const { text } = context.event;
  // Pattern of the command: kamigo learn;keyword;response
  if (/^kamigo learn;([^;]+);([^;]+)$/.test(text)) {
    // Detect the trick-learning command
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
  }

  // Do the tricks
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

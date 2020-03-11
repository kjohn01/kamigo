const { partition, last } = require('lodash');
const db = require('./db');

const perform = async context => {
  const { text } = context.event;
  const mappings = db.map[text.toLowerCase()];
  let answer =
    'To teach me a trick, follow the pattern: kamigo learn;keyword;response. To making me forget a trick, follow the pattern: kamigo forget;keyword';
  // Check if it's a taught trick
  if (mappings && mappings.length > 0) {
    // The trick may have been taught outside of the current group/room,
    // Therefore we divide it into 2 arrays by the session ID.
    const [localMappings, globalMappings] = partition(mappings, {
      sessionId: context.session.id,
    });

    // Check local first, if unavailable, then use the global
    answer = last(localMappings.length > 0 ? localMappings : globalMappings)
      .message;
  }
  await context.sendText(answer);
  return;
};

module.exports = perform;

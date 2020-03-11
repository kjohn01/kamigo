const db = require('./db');

const learn = async context => {
  const { text } = context.event;
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

module.exports = learn;

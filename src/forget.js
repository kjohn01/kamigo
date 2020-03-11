const db = require('./db');

const forget = async context => {
  const { text } = context.event;
  const [, key] = text.toLowerCase().split(';');
  // Remove the trick by the session ID
  db.map[key] = db.map[key].filter(
    mapping => mapping.sessionId !== context.session.id
  );
  // If there's no match of the keys, nothing's happening
  await context.sendText('Trick forgotten');
  return;
};

module.exports = forget;

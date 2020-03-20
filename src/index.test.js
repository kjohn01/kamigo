const App = require('.');
const { ContextSimulator } = require('bottender/test-utils');

const learn = require('./learn ');
const forget = require('./forget');
const perform = require('./perform');

const simulator = new ContextSimulator({
  platform: 'line',
});

describe('index.js', () => {
  it('should be defined', () => {
    expect(App).toBeDefined();
  });
});

describe('learn, perform and forget a trick', () => {
  const context_learn = simulator.createTextContext('kamigo learn;hi;ho');
  const context_forget = simulator.createTextContext('kamigo forget;hi');
  const context_hi = simulator.createTextContext('hi');
  it('should not say ho when the user says hi', async () => {
    await perform(context_hi);
    expect(context_hi.sendText).toBeCalledWith(
      'To teach me a trick, follow the pattern: kamigo learn;keyword;response. To making me forget a trick, follow the pattern: kamigo forget;keyword'
    );
  });
  it('should learn to say ho when the user says hi', async () => {
    await learn(context_learn);
    expect(context_learn.sendText).toBeCalledWith('You say hi, I say ho');
  });
  it('should say ho when the user says hi', async () => {
    await perform(context_hi);
    expect(context_hi.sendText).toBeCalledWith('ho');
  });
  it('should forget to say ho when the user says hi', async () => {
    await forget(context_forget);
    expect(context_forget.sendText).toBeCalledWith('Trick forgotten');
  });
  it('should not say ho when the user says hi', async () => {
    await perform(context_hi);
    expect(context_hi.sendText).toBeCalledWith(
      'To teach me a trick, follow the pattern: kamigo learn;keyword;response. To making me forget a trick, follow the pattern: kamigo forget;keyword'
    );
  });
});

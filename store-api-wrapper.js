var Saw = { 
  Client: require('./src/client'),
  Store: require('./src/store')
};

window.Client = Saw.Client;
window.Store = Saw.Store;

module.exports = Saw;
var Saw = { 
  Client: require('./src/client'),
  Store: require('./src/store'),
  Model: require('./src/model')
};

window.Client = Saw.Client;
window.Store = Saw.Store;
window.Model = Saw.Model;

module.exports = Saw;
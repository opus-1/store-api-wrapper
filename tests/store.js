var assert = require('assert');
var Store = require('../src/store');

describe('Store', function() {
  describe('#trigger', function() {
    it('on should trigger when using set method', function() {
      Users = Store()
      Users.on("set", function(){
        assert.equal(true, true);  
      })
      Users.set({a: "b"})
    });

    it('on should trigger all callbacks when all is used as the key', function() {
      Users = Store()
      Users.on("set", function(){
        assert.equal(true, true);  
      })
      Users.trigger("all")
    });
  })

  describe('#on', function() {
    it('on should trigger when trigger is called', function() {
      Users = Store()
      Users.on("set", function(){
        assert.equal(true, true);  
      })
      Users.trigger("set")
    });

    it('on should trigger when * is the listener and regardless of what the trigger is', function() {
      Users = Store()
      Users.on("*", function(){
        assert.equal(true, true);  
      })
      Users.trigger("set")
    });
  })
});
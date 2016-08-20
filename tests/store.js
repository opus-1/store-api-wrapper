var assert = require('assert');

var Store = require('../src/store');

describe('Store', function() {
  describe('#trigger', function() {
    it('on should trigger when using set method', function() {
      Users = Store
      Users.on("users", function(){
        assert.equal(true, true);  
      })
      Users.set("users", {a: "b"})
    });

    it('on should trigger all callbacks when all is used as the key', function() {
      Users = Store
      Users.on("set", function(){
        assert.equal(true, true);  
      })
      Users.trigger("all")
    });
  })

  describe('#on', function() {
    it('on should trigger when trigger is called', function() {
      Users = Store
      Users.on("set", function(){
        assert.equal(true, true);  
      })
      Users.trigger("set")
    });

    it('on should trigger when * is the listener and regardless of what the trigger is', function() {
      Users = Store
      Users.on("*", function(){
        assert.equal(true, true);  
      })
      Users.trigger("set")
    });
  })
  describe('#get #set #onChange', function() {
    it('should be able to set and get data', function() {
      Users = Store
      Users.set("here", {firstName: "carson"})
      assert.equal(Users.get("here").firstName, "carson")
    });

    it('should respond to data that has been changed', function() {
      this.waitTime = 1000;
      Users = Store
      data = Users.get("here")
      
      data.onChange(function(){
        assert.equal(data.firstName, "carson")  
      })
      Users.set("here", {firstName: "carson"})
    });

    it('should not respond to data that has been changed after being detached', function(done) {
      this.waitTime = 1000;
      Users = Store
      data = Users.get("here").onChange(function(){
        assert.ok(false);
        done();
      }).detach()

      Users.set("here", {firstName: "carson"})

      data = Users.get("here").onChange(function(){
        assert.ok(true);
        done();
      })

      Users.set("here", {firstName: "carson"})
    });
  })
});
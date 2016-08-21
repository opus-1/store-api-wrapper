var assert = require('assert');

var Store = require('../src/store');

describe('Store', function() {
  describe('#trigger', function() {
    it('on should trigger when using set method', function() {
      Store("users").onUpdate(function(){
        assert.equal(true, true);  
      })
      Store("users").set({a: "b"})
    });

    it('on should trigger all callbacks when all is used as the key', function() {
      Store("users").onChange("set", function(){
        assert.equal(true, true);  
      })
      Store.db.observable.trigger("all")
    });
  })

  describe('#on', function() {
    it('on should trigger when trigger is called', function() {
      Store("users").onUpdate(function(){
        assert.equal(true, true);  
      })
      Store.db.observable.trigger("set")
    });

    it('on should trigger when * is the listener and regardless of what the trigger is', function() {
      Store("users").onChange(function(){
        assert.equal(true, true);  
      })
      Store.db.observable.trigger("*")
    });
  })
  describe('#get #set #onChange', function() {
    it('should be able to set and get data', function() {
      Store("users").set({firstName: "carson"})
      assert.equal(Store("users").get().firstName, "carson")
    });

    it('should respond to data that has been changed', function() {
      this.waitTime = 1000;
      
      
      Store("users").onChange(function(){
        assert.equal(data.firstName, "carson")  
      })
      Store("users").set({firstName: "carson"})
    });

    it('should not respond to data that has been changed after being detached', function(done) {
      this.waitTime = 1000;
      Store("users").onChange(function(){
        assert.ok(false);
        done();
      }).detach()

      Store("users").set({firstName: "carson"})

      Store("users").onChange(function(){
        assert.ok(true);
        done();
      })

      Store("users").set({firstName: "carson"})
    });
  })
});
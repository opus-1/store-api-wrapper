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
  describe('#push #merge #setDefault', function() {
    it('should allow push on data', function() {
      Store("users.ids").push("carson")      
      assert.equal(Store("users.ids").get().toString(), ["carson"].toString())
    });

    it('should allow merge of data', function() {
      Store("user").set({dataOne: "one"})
      Store("user").merge({dataTwo: "two"})
      dat = Store("user").get()
      assert.equal(JSON.stringify(dat), JSON.stringify({dataOne: "one", dataTwo: "two"}))
    });

    it('should have access to last data', function() {
      Store("user.id").set(100)
      Store("user.id").set(101)
      var userId = Store("user.id").get()
      var userWasId = Store("user.id").was()
      assert.equal(userWasId, 100)
      assert.equal(userId, 101)
    });

    it('should have access to setDefault', function() {
      Store("user.id").set(null)
      Store("user.id").setDefault(200)
      assert.equal(Store("user.id").get(), 200)
    });
  })
  describe('#increase #decrease', function() {
    it('should give access to increase for integers', function() {
      Store("user.id").set(0)
      Store("user.id").increase()
      assert.equal(Store("user.id").get(), 1)
    });

    it('should give access to decrease for integers', function() {
      Store("user.id").set(0)
      Store("user.id").decrease()
      assert.equal(Store("user.id").get(), -1)
    });
  })
});
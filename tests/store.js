var assert = require('assert');

sessionStorage = {setItem: function(key, value){
  return this[key] = value;
}, getItem: function(key){
  return this[key];
}}

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
      Store("users").on("test", function(){
        assert.equal(true, true);
      })
      Store("users").trigger("test")
    });

    it('onUpdate should trigger when trigger is called', function() {
      Store("users").onUpdate(function(){
        assert.equal(true, true);
      })
      Store.db.observable.trigger("set")
    });

    it('onChange should trigger when * is the listener and regardless of what the trigger is', function() {
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

      detachable = Store("users").onChange(function(){
        assert.ok(true);
        done();
        detachable.detach()
      })

      Store("users").set({firstName: "carson"})
    });

  })
  describe('#push #merge #setDefault remove', function() {
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

    it('should allow you to remove items from a list', function() {
      Store("user.ids").set(["a", "b", "c"])
      Store("user.ids").remove("a")
      assert.equal(JSON.stringify(Store("user.ids").get()), JSON.stringify(["b", "c"]))
    });

    it('should allow you to remove items from a list but does not remove wanted items if unwanted item does not exist', function() {
      Store("user.ids").set(["a", "b", "c"])
      Store("user.ids").remove("n")
      assert.equal(JSON.stringify(Store("user.ids").get()), JSON.stringify(["a", "b", "c"]))
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
  describe('#reactComponent', function() {
    it('should give access to increase for integers', function() {
      fakeReact = {
        state: {},
        setState: function(data){
          Object.keys(data).forEach(function(key){
              fakeReact.state[key] = data[key];
          })
        }
      }
      assert.ok(Store.reactComponent({}).stores.follow);
      assert.ok(Store.reactComponent({}).stores.forget);

      component = Store.reactComponent(fakeReact);
      component.store("hello").set("default");
      assert.equal(component.store("hello").get(), "default");

      component.stores.follow({test: "hello"});
      component.stores.test.set("New Value");
      assert.equal(component.state.test, "New Value")

      component.stores.follow({test: "hello"});
      component.store("hello").set("Newest Value");
      assert.equal(component.state.test, "Newest Value")

      component.stores.forget()

      component.store("hello").set("Newest Newest Value");
      assert.equal(component.state.test, "Newest Value")

      component.stores.follow({test: "test"});
      component.stores.test.set("default value");
      assert.equal(component.state.test, "default value");

      component.componentWillUnmount();
      component.stores.test.set("new value");
      assert.equal(component.state.test, "default value");
    });
  })
  describe('#persist', function() {
    it('should give access to increase for integers', function() {


      Store.db.sessionStorage = {setItem: function(key, value){
        return this[key] = value;
      }, getItem: function(key){
        return this[key];
      }}

      Store("1.here").set("there");
      Store("1.here.itis").set("itis");

      value = Store.db.sessionStorage.getItem("observable-store")
      assert.equal(value, undefined);
      assert.equal(value, undefined);

      Store("2.here").remember();
      Store("2.here.itis").remember();
      Store("2.here").set("there");
      Store("2.here.itis").set("itis");

      value = Store.db.sessionStorage.getItem("observable-store")
      assert.equal(JSON.parse(value)["2.here"], "there");
      assert.equal(JSON.parse(value)["2.here.itis"], "itis");
      assert.equal(JSON.stringify(Store.db.storage.get()), JSON.stringify({ '2.here': 'there', '2.here.itis': 'itis' }))
    })
  })

  describe('#reactMixin', function() {
    it('should load mixin', function() {
      m = Object.assign({}, Store.ReactMixin)
      m.followStores = function(){
        return {
          users: "users.one",
          assessments: "assessments.one"
        }
      }
      m.setState = function(data){
        m.state = Object.assign({}, m.state, data)
      }
      m.getInitialState()
      m.componentDidMount()

      m.stores.users.set("here")

      assert.equal(m.state.users, "here")

      m.componentWillUnmount()

      m.stores.users.set("there")

      assert.equal(m.state.users, "here")
    })
    it('should load mixin regardless of initialization', function() {
      m = Object.assign({}, Store.ReactMixin)
      m.state = {};

      m.setState = function(data){
        m.state = Object.assign({}, m.state, data)
      }

      m.getInitialState()
      m.componentDidMount()

      assert.equal(m.state.users, undefined)

      m.componentWillUnmount()

      assert.equal(m.state.users, undefined)
    })
    it('followStore should accept object', function() {
      m = Object.assign({}, Store.ReactMixin)
      m.state = {};

      m.followStores = {
          users: "users.one",
          assessments: "assessments.one"
      }

      m.setState = function(data){
        m.state = Object.assign({}, m.state, data)
      }

      m.getInitialState()
      m.componentDidMount()

      m.stores.users.set("hello")
      assert.equal(m.state.users, "hello")
    })

    it('followStore should accept array', function() {
      m = Object.assign({}, Store.ReactMixin)
      m.state = {};

      m.followStores = ["users", "assessments"]

      m.setState = function(data){
        m.state = Object.assign({}, m.state, data)
      }


      m.getInitialState()
      m.componentDidMount()

      m.stores.users.set("hello")

      assert.equal(Object.keys(m.stores).join("."), "users.assessments")
      assert.equal(m.state.users, "hello")
    })

    it('followStore should accept array of objects', function() {
      m = Object.assign({}, Store.ReactMixin)
      m.state = {};

      m.followStores = ["users", { assessments: "users.assessments" }]

      m.setState = function(data){
        m.state = Object.assign({}, m.state, data)
      }

      m.getInitialState()
      m.componentDidMount()

      Store("users.assessments").set("hello")

      assert.equal(Object.keys(m.stores).join("."), "users.assessments")
      assert.equal(m.state.assessments, "hello")
    })

    it('followStore works with multiple updates', function() {
      m = Object.assign({}, Store.ReactMixin)
      m.state = {};

      m.followStores = ["users", "assessments"]

      m.setState = function(data){
        m.state = Object.assign({}, m.state, data)
      }


      m.getInitialState()
      m.componentDidMount()

      m.stores.users.set("hello")
      m.stores.users.set("goodbye")

      assert.equal(Object.keys(m.stores).join("."), "users.assessments")
      assert.equal(m.state.users, "goodbye")
    })

    it('New object is returned for each .get()', function() {
      m = Object.assign({}, Store.ReactMixin)
      m.state = {};

      m.followStores = ["users"]

      m.setState = function(data){
        m.state = Object.assign({}, m.state, data)
      }


      m.getInitialState()
      m.componentDidMount()

      m.stores.users.set({})
      users = m.stores.users.get()
      users.name = "hello"
      Store("users").merge({cat: "me"})

      assert.equal(JSON.stringify(m.state.users), JSON.stringify({cat: "me"}))
    })
  })
});

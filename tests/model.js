var assert = require('assert');
var Store = require('../src/store');
var MockBrowser = require('mock-browser').mocks.MockBrowser;
var mock = new MockBrowser();
global.window = mock.getWindow();
window.document = mock.getDocument();
var jQuery = require('jquery');
global.$ = jQuery
var Model = require('../src/model');
Model.jQuery = jQuery

var fakejQuery = require('../fake-jquery');

var fakeAjaxContent = [];
var jQuery = require('jquery');

function resetAjax(){
  fakeAjaxContent = []
}

function ajaxContent(){
  return fakeAjaxContent
}

function newUserModel (config){
  var Client = require('../src/client');
  var fakeQuery = fakejQuery();
  Client.jQuery.Deferred = jQuery.Deferred;
  Client.jQuery = fakeQuery;
  
  var client = Client("/here");
  client.jQuery = fakejQuery();
  client.jQuery.Deferred = jQuery.Deferred;
  client.jQuery.fakeAjaxResponse = {
    id: 1,
    first_name: "John",
    last_name: "Doe",
    email: "johndoe@example.com"
  }

  
  config = config || {};
  config.client = client;
  config.store = Store;
  config.sendParams = function(params){
     return {
        id: params.id,
        first_name: params.firstName,
        last_name: params.lastName,
        email: params.email,
     }
  }
  config.receiveParams = function(params){
    return {
      id: params.id,
      firstName: params.first_name,
      lastName: params.last_name,
      email: params.email
    }
  }
  return Users = Model(config)
}

describe('Model', function() {
  describe('#Initialize', function() {
    it('find should be accessible when there is no scope', function() {
      Users = newUserModel();


      assert.ok("find" in Users);
    });

    it('find should not be accessible when there is a scope that does not exist', function() {
      Users = newUserModel({scope: "findOne"});

      assert.equal("find" in Users, false);
    }); 

    it('find should not be accessible when there is a scope that does exist', function() {
      Users = newUserModel({scope: "find"});

      assert.ok("find" in Users);
    }); 


    it('find should not be accessible when there is a scope that does exist', function(done) {
      here = new Date().getTime();
      this.waitTime = 1000;
      Users = newUserModel({scope: "find"});

      Users.find({}).then(function(response){
        assert.ok(response.firstName && response.lastName && response.email);
        done()
      })
    }); 

    it('find should not be accessible when there is a scope that does exist', function(done) {
      here = new Date().getTime();
      this.waitTime = 1000;
      Users = newUserModel();
      Users.config.client.fakeAjaxResponse = null;
      Users.find({id: 1, first_name: "John", last_name: "doe"}).then(function(response){
        response.firstName = "Jim";
        response.save().then(function(res){
          assert.ok(res.firstName && res.lastName && res.email);  
          done()
        })
      })
    }); 

  })
});
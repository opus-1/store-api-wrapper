var assert = require('assert');
var Client = require('../src/client');
var fakeAjaxContent = []

function resetAjax(){
  fakeAjaxContent = []
}

function ajaxContent(){
  return fakeAjaxContent
}

Client.jQuery = {
  ajax: function(content){
    return fakeAjaxContent.push(content)
  }
}  

describe('Client', function() {
  describe('#find', function() {
    it('find should be returned without scope', function() {
      ApiClient = Client("/users")
      assert.equal("find" in ApiClient, true);
    });

    it('find should be returned with scope', function() {
      ApiClient = Client({path: "/users", scope: "find"})
      assert.equal("find" in ApiClient, true);
    });

    it('find should not be returned with scope set for other actions only', function() {
      ApiClient = Client({path: "/users", scope: "findOne"})
      assert.equal("find" in ApiClient, false);
    });

    it('find should pass the right path to xhr client', function() {
      resetAjax()
      ApiClient = Client({path: "/users", scope: "find"})
      
      ApiClient.find({id: 1})
      matcher = JSON.stringify([ { method: 'get', url: '/users', data: { id: 1 } } ])
      assert.equal(matcher, JSON.stringify(ajaxContent()));
    });
  });
});
var assert = require('assert');
var Client = require('../src/client');

var jQuery = require('jquery');
var getjQuery = require('../fake-jquery')
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
      ApiClient = Client({path: "/users", scope: "find"})
      ApiClient.jQuery = getjQuery()
      
      ApiClient.find({id: 1})
      
      var response = ApiClient.jQuery.lastResponse();

      matcher = JSON.stringify({ method: 'get', url: '/users', data: { id: 1 } })
      assert.equal(matcher, JSON.stringify(response));
    });
  });

  describe('#findOne', function() {
    it('findOne should be returned without scope', function() {
      ApiClient = Client("/users")
      assert.equal("findOne" in ApiClient, true);
    });

    it('findOne should be returned with scope', function() {
      ApiClient = Client({path: "/users", scope: "findOne"})
      assert.equal("findOne" in ApiClient, true);
    });

    it('findOne should not be returned with scope set for other actions only', function() {
      ApiClient = Client({path: "/users", scope: "find"})
      assert.equal("findOne" in ApiClient, false);
    });

    it('findOne should pass the right path to xhr client', function() {
      ApiClient = Client({path: "/users", scope: "findOne"})
      ApiClient.jQuery = getjQuery()
      
      ApiClient.findOne({id: 1})

      var response = ApiClient.jQuery.lastResponse();

      matcher = JSON.stringify({ method: 'get', url: '/users/1', data: { } })
      assert.equal(matcher, JSON.stringify(response));
    });
  });

  describe('#update', function() {
    it('update should be returned without scope', function() {
      ApiClient = Client("/users")
      assert.equal("update" in ApiClient, true);
    });

    it('update should be returned with scope', function() {
      ApiClient = Client({path: "/users", scope: "update"})
      assert.equal("update" in ApiClient, true);
    });

    it('update should not be returned with scope set for other actions only', function() {
      ApiClient = Client({path: "/users", scope: "find"})
      assert.equal("update" in ApiClient, false);
    });

    it('update should pass the right path to xhr client', function() {
      ApiClient = Client({path: "/users", scope: "update"})
      ApiClient.jQuery = getjQuery()

      ApiClient.update({id: 1})
      
      var response = ApiClient.jQuery.lastResponse();

      matcher = JSON.stringify({ method: 'put', url: '/users/1', data: { } })
      assert.equal(matcher, JSON.stringify(response));
    });
  });

  describe('#create', function() {
    it('create should be returned without scope', function() {
      ApiClient = Client("/users")
      assert.equal("create" in ApiClient, true);
    });

    it('create should be returned with scope', function() {
      ApiClient = Client({path: "/users", scope: "create"})
      assert.equal("create" in ApiClient, true);
    });

    it('create should not be returned with scope set for other actions only', function() {
      ApiClient = Client({path: "/users", scope: "find"})
      assert.equal("create" in ApiClient, false);
    });

    it('create should pass the right path to xhr client', function() {
      ApiClient = Client({path: "/users", scope: "create"})
      ApiClient.jQuery = getjQuery()
      
      ApiClient.create({name: "John Doe"})
      var response = ApiClient.jQuery.lastResponse();

      matcher = JSON.stringify({ method: 'post', url: '/users', data: { name: "John Doe"} })
      assert.equal(matcher, JSON.stringify(response));
    });
  });

  describe('#remove', function() {
    it('remove should be returned without scope', function() {
      ApiClient = Client("/users")
      assert.equal("remove" in ApiClient, true);
    });

    it('remove should be returned with scope', function() {
      ApiClient = Client({path: "/users", scope: "remove"})
      assert.equal("remove" in ApiClient, true);
    });

    it('remove should not be returned with scope set for other actions only', function() {
      ApiClient = Client({path: "/users", scope: "find"})
      assert.equal("remove" in ApiClient, false);
    });

    it('remove should pass the right path to xhr client', function() {
      ApiClient = Client({path: "/users", scope: "remove"})
      ApiClient.jQuery = getjQuery()

      ApiClient.remove({id: 1})
      var response = ApiClient.jQuery.lastResponse();

      matcher = JSON.stringify({ method: 'delete', url: '/users/1', data: {} })
      assert.equal(matcher, JSON.stringify(response));
    });
  });
});
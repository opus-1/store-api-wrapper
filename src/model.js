var Model = function(options){
  var model = {}
  model.config = options

  var setAction = function(action){
    model[action] = function(params){
      return {
        store: function(){
          var actionPromise = this.fetch()
          actionPromise.then(function(response){
            var storeItem = {};
            storeItem[action] = response;
            model.config.store.set(storeItem);  
          })
          return actionPromise
        }
        fetch: function(){
          var actionPromise = model.config.client[action](params)
        }
      };
    }
  
  }
  
  var scopeCheck = function (scope){
    return !model.config.scope || (model.config.scope && model.config.scope.indexOf(scope) != -1);
  }

  if(scopeCheck("create")){
    setAction("create")
  }
  if(scopeCheck("update")){
    setAction("update")
  }
  if(scopeCheck("remove")){
    setAction("remove")
  }
  if(scopeCheck("find")){
    setAction("find")
  }
  if(scopeCheck("findAll")){
    setAction("findAll")
  }
}

module.exports = Model
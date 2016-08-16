var md5 = require("../node_modules/blueimp-md5/js/md5");

var Model = function(options){
  var model = {}
  model.config = options
  model.jQuery = Model.jQuery || {};
  model.config.key = model.config.key || "id";
  model.config.queName = 'default' 
  var setAction = function(action){
    model[action] = function(queName, params, paramsTwo){
      if(typeof model.jQuery == "undefined"){
        throw "jQuery must be attached to model to continue!"
      }
      promise = model.jQuery.Deferred();

      if(typeof queName != "string"){
        paramsTwo = params;
        params = queName;
        queName = false
      }

      promise.sendParams = model.config.sendParams(params);
      promise.sendParamsTwo = paramsTwo ? model.config.sendParams(paramsTwo) : '';

      queName = queName || model.config.queName;
      storeKey = queName + action + "-"  + md5(promise.sendParams) + "-" + md5(promise.sendParamsTwo)
      if(!model.config.store[storeKey]){
        model.config.store[storeKey] = false
        if(paramsTwo){
          var ajax = model.config.client[action](promise.sendParams, promise.sendParamsTwo);
        }else{
          var ajax = model.config.client[action](promise.sendParams);
        }
        ajax.then(function(response){
          var processResponse = function(response){
            var data = model.config.receiveParams(response);
            data.model = model;
            ActiveRecord(data);
            return data;
          }
          if('length' in response){
            var response = response.map(function(data){
              return processResponse(data)
            })
          }else{
            var response = processResponse(response)
          }
          var setObject = {};
          setObject[action + "-" + md5(promise.sendParams)] = response
          model.config.store.set(setObject);
          promise.resolve(response);
        })
      }else{
        promise.resolve(model.config.store[storeKey])
      }
      model.config.store[action]

      return promise;
    }
  
  }
  
  var scopeCheck = function (scope){
    return !model.config.scope || (model.config.scope && model.config.scope.replace(", ", " ").split(" ").indexOf(scope) != -1);
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
  if(scopeCheck("findOne")){
    setAction("findOne")
  }
  var ActiveRecord = function(aro){
    if(aro.model.update){
      aro.save = function(){

        var params = aro.model.config.sendParams(aro);

        promise = model.jQuery.Deferred();
        if(typeof aro[aro.model.config.key] == "undefined"){
          throw "Model key must exist! You have set your key to "+aro.model.config.key +" check receiveParams in client to make if using S.A. Wrapper Client";
        }

        aro.model.update(aro[aro.model.config.key], params).then(function(response){
          promise.resolve(ActiveRecord(aro.model.config.receiveParams(response)))
        })
        return promise;
      }
    }else{
      aro.save = function(){
        throw "Update must be included in update scope to use AR save.";
      }
    }
  }

  return model;
}

if(typeof jQuery != "undefined"){
  Model.jQuery = jQuery;
}



module.exports = Model
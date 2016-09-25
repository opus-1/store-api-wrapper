var Client = function(config){
  var c = {};

  if(typeof config == "string"){
    var c = {
      config: {
        path: config
      }
    }
  }else{
    var c = {
      config: config
    }
  }

  c.jQuery = Client.jQuery

  c.config.scope = c.config.scope || "";
  c.config.scope = c.config.scope.replace(", ", " ").split(" ");
  c.config.crudUrls = c.config.crudUrls || JSON.parse(JSON.stringify(Client.config.crudUrls));

  var scopeCheck = function (scope){
    return c.config.scope.join("").length == 0 || c.config.scope.indexOf(scope) != -1;
  }


  var setAction = function(actionName, type, path){
    c[actionName] = function(params, paramsTwo){
      if(paramsTwo == undefined){
        paramsTwo = params
      }
      return c.jQuery.ajax({
        method: type,
        url: path(params),
        data: paramsTwo
      })
    }
  }



  if(scopeCheck("create")){
    setAction("create", "post", function(){
      return c.config.path + c.config.crudUrls.create
    })
  }

  if(scopeCheck("update")){
    setAction("update", "put", function(queryParams, params){
      path = c.config.path + c.config.crudUrls.update.replace(":id", queryParams.id)
      delete queryParams.id;
      return path
    })
  }

  if(scopeCheck("find")){
    setAction("find", "get", function(){ return c.config.path + c.config.crudUrls.find})
  }

  if(scopeCheck("findOne")){
    setAction("findOne", "get", function(params){
      var path = c.config.crudUrls.findOne.replace(":id", params.id);
      delete params.id;
      return c.config.path + path;
    })
  }

  if(scopeCheck("remove")){
    setAction("remove", "delete", function(params){
      var path = c.config.crudUrls.remove.replace(":id", params.id);
      delete params.id;
      return c.config.path + path;
    })
  }

  return c;
}

Client.config = {
  crudUrls: {
    create: "",
    update: "/:id",
    find: "",
    findOne: "/:id",
    remove: "/:id"
  }
}

if(typeof jQuery != "undefined"){
  Client.jQuery = jQuery;
}else{
  Client.jQuery = {};
}
if(typeof module != "undefined"){
  module.exports = Client
}

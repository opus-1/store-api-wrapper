var Client = function(config){
  c = {};

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

  var $ = Client.jQuery
  c.config.scope = c.config.scope || "";
  c.config.scope = c.config.scope.replace(", ", " ").split(" ");
  c.config.crudUrls = c.config.crudUrls || JSON.parse(JSON.stringify(Client.config.crudUrls));

  var scopeCheck = function (scope){
    return !c.config.scope || (c.config.scope && c.config.scope.indexOf(scope) != -1);
  }
  this.config.path + c.config.crudUrls.create
  
  var setAction = function(actionName, type, path){
    c[actionName] = function(params){
      return $.ajax({
        method: type,
        url: path(params), 
        data: params
      })
    }
  }

  if(scopeCheck("create")){
    setAction("create", function(){
      return this.config.path + c.config.crudUrls.create
    })
  }

  if(scopeCheck("update")){
    setAction("update", function(params){
      path = c.config.crudUrls.update.replace(":id", id)
      delete params.id;
      return path
    })
  }
  
  if(scopeCheck("find")){
    setAction("find", function(){ this.config.path + c.config.crudUrls.find})
  }
  
  if(scopeCheck("findOne")){
    setAction("findOne", function(params){
      var path = c.config.crudUrls.findOne.replace(":id", params.id);
      delete params.id;
      return this.config.path + path, params;
    })
  }

  if(scopeCheck("remove")){
    setAction("remove", function(params){
      var path = c.config.crudUrls.remove.replace(":id", params.id);
      delete params.id;
      return this.config.path + path;
    }
  }

  return c;
}

Client.config = {
  crudUrls: {
    create: "", 
    update: ":/id",
    find: "",
    findOne: "/:id",
    remove: "/:id"
  }
}

Client.jQuery = jQuery;

module.exports = Client
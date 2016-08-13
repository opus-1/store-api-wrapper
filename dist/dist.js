"use strict";

var Client = function Client(config) {
  c = {};

  if (typeof config == "string") {
    var c = {
      config: {
        path: config
      }
    };
  } else {
    var c = {
      config: config
    };
  }

  var $ = Client.jQuery;
  c.config.scope = c.config.scope || "";
  c.config.scope = c.config.scope.replace(", ", " ").split(" ");
  c.config.crudUrls = c.config.crudUrls || JSON.parse(JSON.stringify(Client.config.crudUrls));

  var scopeCheck = function scopeCheck(scope) {
    return !c.config.scope || c.config.scope && c.config.scope.indexOf(scope) != -1;
  };

  if (scopeCheck("create")) {
    c.create = function (params) {
      return $.post(this.config.path + c.config.crudUrls.create, params);
    };
  }

  if (scopeCheck("update")) {
    c.update = function (id, params) {
      var path = c.config.crudUrls.update.replace(":id", id);
      return $.put(this.config.path + path, params);
    };
  }

  if (scopeCheck("find")) {
    c.find = function (params) {
      return $.get(this.config.path + c.config.crudUrls.find, params);
    };
  }

  if (scopeCheck("findOne")) {
    c.findOne = function (params) {
      var path = c.config.crudUrls.findOne.replace(":id", params.id);
      delete params.id;
      return $.get(this.config.path + path, params);
    };
  }

  return c;
};

Client.config = {
  crudUrls: {
    create: "",
    update: ":/id",
    find: "",
    findOne: "/:id"
  }
};

Client.jQuery = jQuery;
//# sourceMappingURL=dist.js.map

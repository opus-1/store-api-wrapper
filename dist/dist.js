"use strict";

var Client = function Client(config) {
  var c = {};

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

  c.jQuery = Client.jQuery;

  c.config.scope = c.config.scope || "";
  c.config.scope = c.config.scope.replace(", ", " ").split(" ");
  c.config.crudUrls = c.config.crudUrls || JSON.parse(JSON.stringify(Client.config.crudUrls));

  var scopeCheck = function scopeCheck(scope) {
    return c.config.scope.join("").length == 0 || c.config.scope.indexOf(scope) != -1;
  };

  var setAction = function setAction(actionName, type, path) {
    c[actionName] = function (params, paramsTwo) {
      if (paramsTwo == undefined) {
        paramsTwo = params;
      }
      return c.jQuery.ajax({
        method: type,
        url: path(params),
        data: paramsTwo
      });
    };
  };

  if (scopeCheck("create")) {
    setAction("create", "post", function () {
      return c.config.path + c.config.crudUrls.create;
    });
  }

  if (scopeCheck("update")) {
    setAction("update", "put", function (queryParams, params) {
      path = c.config.path + c.config.crudUrls.update.replace(":id", queryParams.id);
      delete queryParams.id;
      return path;
    });
  }

  if (scopeCheck("find")) {
    setAction("find", "get", function () {
      return c.config.path + c.config.crudUrls.find;
    });
  }

  if (scopeCheck("findOne")) {
    setAction("findOne", "get", function (params) {
      var path = c.config.crudUrls.findOne.replace(":id", params.id);
      delete params.id;
      return c.config.path + path;
    });
  }

  if (scopeCheck("remove")) {
    setAction("remove", "delete", function (params) {
      var path = c.config.crudUrls.remove.replace(":id", params.id);
      delete params.id;
      return c.config.path + path;
    });
  }

  return c;
};

Client.config = {
  crudUrls: {
    create: "",
    update: "/:id",
    find: "",
    findOne: "/:id",
    remove: "/:id"
  }
};

if (typeof jQuery != "undefined") {
  Client.jQuery = jQuery;
} else {
  Client.jQuery = {};
}
module.exports = Client;
"use strict";

var md5 = require("../node_modules/blueimp-md5/js/md5");

var Model = function Model(options) {
  var model = {};
  model.config = options;
  model.jQuery = Model.jQuery || {};
  model.config.key = model.config.key || "id";

  var setAction = function setAction(action) {
    model[action] = function (params, paramsTwo) {
      if (typeof model.jQuery == "undefined") {
        throw "jQuery must be attached to model to continue!";
      }
      promise = model.jQuery.Deferred();

      promise.sendParams = model.config.sendParams(params);
      promise.sendParamsTwo = paramsTwo ? model.config.sendParams(paramsTwo) : '';
      if (!model.config.store[action + "-" + md5(promise.sendParams) + "-" + md5(promise.sendParamsTwo)]) {
        model.config.store[action + "-" + md5(promise.sendParams)] = 'waiting...';
        if (paramsTwo) {
          var ajax = model.config.client[action](promise.sendParams, promise.sendParamsTwo);
        } else {
          var ajax = model.config.client[action](promise.sendParams);
        }
        ajax.then(function (response) {
          var processResponse = function processResponse(response) {
            var data = model.config.receiveParams(response);
            data.model = model;
            ActiveRecord(data);
            return data;
          };
          if ('length' in response) {
            var response = response.map(function (data) {
              return processResponse(data);
            });
          } else {
            var response = processResponse(response);
          }

          model.config.store[action + "-" + md5(promise.sendParams)] = response;
          promise.resolve(response);
        });
      } else {
        promise.resolve(model.config.store[action + "-" + promise.md5]);
      }
      model.config.store[action];

      return promise;
    };
  };

  var scopeCheck = function scopeCheck(scope) {
    return !model.config.scope || model.config.scope && model.config.scope.replace(", ", " ").split(" ").indexOf(scope) != -1;
  };

  if (scopeCheck("create")) {
    setAction("create");
  }
  if (scopeCheck("update")) {
    setAction("update");
  }
  if (scopeCheck("remove")) {
    setAction("remove");
  }
  if (scopeCheck("find")) {
    setAction("find");
  }
  if (scopeCheck("findOne")) {
    setAction("findOne");
  }
  var ActiveRecord = function ActiveRecord(aro) {
    if (aro.model.update) {
      aro.save = function () {

        var params = aro.model.config.sendParams(aro);

        promise = model.jQuery.Deferred();
        if (typeof aro[aro.model.config.key] == "undefined") {
          throw "Model key must exist! You have set your key to " + aro.model.config.key + " check receiveParams in client to make if using S.A. Wrapper Client";
        }

        aro.model.update(aro[aro.model.config.key], params).then(function (response) {
          promise.resolve(ActiveRecord(aro.model.config.receiveParams(response)));
        });
        return promise;
      };
    } else {
      aro.save = function () {
        throw "Update must be included in update scope to use AR save.";
      };
    }
  };

  return model;
};

if (typeof jQuery != "undefined") {
  Model.jQuery = jQuery;
}

module.exports = Model;
'use strict';

var Store = function Store(el) {

  /**
   * Extend the original object or create a new empty one
   * @type { Object }
   */

  el = el || {};

  /**
   * Private variables and methods
   */

  var callbacks = {},
      onEachEvent = function onEachEvent(e, fn) {
    e.replace(/\S+/g, fn);
  },
      defineProperty = function defineProperty(key, value) {
    Object.defineProperty(el, key, {
      value: value,
      enumerable: false,
      writable: false,
      configurable: false
    });
  },
      processData = function processData(target, values) {
    if (el.model) {
      values = el.model(values);
    }

    Object.keys(values).forEach(function (key) {
      value = values[key];
      target[key] = value;
      if (target == el) {
        target.trigger(key, value);
      }
    });
  };

  /**
   * Listen to the given space separated list of `events` and execute the `callback` each time an event is triggered.
   * @param  { String } events - events ids
   * @param  { Function } fn - callback function
   * @returns { Object } el
   */

  defineProperty('on', function (events, fn) {
    if (typeof fn != 'function') return el;

    onEachEvent(events, function (name, pos) {
      (callbacks[name] = callbacks[name] || []).push(fn);
      fn.typed = pos > 0;
    });

    return el;
  });

  /**
   * Set data on element
   * @param  { String } events - events ids
   * @param  { Anything } anything you want to attach
   * @returns { Object } el
   */
  defineProperty('set', function (values) {

    if ("length" in el) {
      el.splice(0, el.length);
      values.forEach(function (row) {
        el.push(processData({}, row));
      });
    } else {
      processData(el, values);
    }
    el.trigger("set", el);

    return el;
  });

  /**
   * Removes the given space separated list of `events` listeners
   * @param   { String } events - events ids
   * @param   { Function } fn - callback function
   * @returns { Object } el
   */

  defineProperty('off', function (events, fn) {
    if (events == '*') callbacks = {};else {
      onEachEvent(events, function (name) {
        if (fn) {
          var arr = callbacks[name];
          for (var i = 0, cb; cb = arr && arr[i]; ++i) {
            if (cb == fn) arr.splice(i--, 1);
          }
        } else delete callbacks[name];
      });
    }
    return el;
  });

  /**
   * Listen to the given space separated list of `events` and execute the `callback` at most once
   * @param   { String } events - events ids
   * @param   { Function } fn - callback function
   * @returns { Object } el
   */

  defineProperty('one', function (events, fn) {
    function on() {
      el.off(events, on);
      fn.apply(el, arguments);
    }
    return el.on(events, on);
  });

  /**
   * Execute all callback functions that listen to the given space separated list of `events`
   * @param   { String } events - events ids
   * @returns { Object } el
   */

  defineProperty('trigger', function (events) {

    // getting the arguments
    // skipping the first one
    var arglen = arguments.length - 1,
        args = new Array(arglen);
    for (var i = 0; i < arglen; i++) {
      args[i] = arguments[i + 1];
    }

    onEachEvent(events, function (name) {

      var fns = (callbacks[name] || []).slice(0);

      for (var i = 0, fn; fn = fns[i]; ++i) {
        if (fn.busy) return;
        fn.busy = 1;

        try {
          fn.apply(el, fn.typed ? [name].concat(args) : args);
        } catch (e) {
          el.trigger('error', e);
        }
        if (fns[i] !== fn) {
          i--;
        }
        fn.busy = 0;
      }

      if (callbacks.all && name != 'all') el.trigger.apply(el, ['all', name].concat(args));
    });

    return el;
  });

  return el;
};

module.exports = Store;
//# sourceMappingURL=dist.js.map

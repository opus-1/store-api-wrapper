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

  if (scopeCheck("remove")) {
    c.remove = function (params) {
      var path = c.config.crudUrls.remove.replace(":id", params.id);
      delete params.id;
      return $.delete(this.config.path + path, params);
    };
  }

  return c;
};

Client.config = {
  crudUrls: {
    create: "",
    update: ":/id",
    find: "",
    findOne: "/:id",
    remove: "/:id"
  }
};

Client.jQuery = jQuery;

module.exports = Client;
"use strict";

var Model = function Model(options) {
  var model = {};
  model.config = options;

  var setAction = function setAction(action) {
    model[action] = function (params) {
      return {
        store: function store() {
          var actionPromise = model.Client[action](params);
          actionPromise.then(function (response) {
            var storeItem = {};
            storeItem[action] = response;
            model.store.set(storeItem);
          });
        }
      };
    };
  };

  var scopeCheck = function scopeCheck(scope) {
    return !model.config.scope || model.config.scope && model.config.scope.indexOf(scope) != -1;
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
  if (scopeCheck("findAll")) {
    setAction("findAll");
  }
};

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

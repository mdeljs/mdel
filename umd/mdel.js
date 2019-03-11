(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.mdel = {}));
}(this, function (exports) { 'use strict';

  /**
   * 抛出异常
   * @param condition {boolean} 条件
   * @param message {string} 错误信息
   */
  function throwError(condition, message) {
      if (condition) {
          throw new Error(message);
      }
  }

  /**
   * 判断是否是对象
   * @param data {*} 待检测的数据
   * @return {boolean}
   */
  function isObject(data) {
      return Object.prototype.toString.call(data) === '[object Object]';
  }

  var SIGN = '__MDEL__';
  /**
   * 数据模型
   * @class
   * @example
   */
  var Model = /** @class */ (function () {
      function Model(initData, name) {
          if (name === void 0) { name = ''; }
          var _this = this;
          this.sign = SIGN;
          this.pvtListeners = [];
          throwError(!isObject(initData), 'initData is not a object');
          throwError(typeof name !== 'string', 'name is not a string');
          this.pvtData = initData;
          this.name = name;
          Object.defineProperty(this, 'data', {
              configurable: false,
              enumerable: true,
              set: function () {
                  throwError(true, 'must use change to set data');
              },
              get: function () { return _this.pvtData; }
          });
      }
      /**
       * 修改数据
       * @param data {object} 数据
       * @param [mode] {'update' | 'set'} 模式
       */
      Model.prototype.change = function (data, mode) {
          var _this = this;
          if (mode === void 0) { mode = 'update'; }
          //验证参数
          throwError(!isObject(data), 'data is not a object');
          var prevData = this.pvtData;
          //修改数据
          if (mode === 'set') {
              this.pvtData = Object.assign({}, data);
          }
          else {
              this.pvtData = Object.assign({}, this.pvtData, data);
          }
          //执行修改后回调
          this.pvtListeners.forEach(function (listener) { return listener.call(_this, prevData); });
      };
      /**
       * 订阅数据的修改
       * @param listener {function(Object):void}  监听函数
       * @returns 返回取消订阅
       */
      Model.prototype.subscribe = function (listener) {
          var _this = this;
          throwError(typeof listener !== 'function', 'listener is not a function');
          //添加到监听列表中
          if (this.pvtListeners.indexOf(listener) === -1) {
              this.pvtListeners.push(listener);
          }
          //返回一个取消监听
          return function () { return _this.pvtListeners = _this.pvtListeners.filter(function (item) { return item !== listener; }); };
      };
      return Model;
  }());
  /**
   * 获取是否是数据容器
   * @param target {*} 待检测目标
   * @return {boolean}
   */
  function getIsStore(target) {
      return target && target["sign"] === SIGN;
  }

  var version = '4.0.0';

  exports.version = version;
  exports.getIsStore = getIsStore;
  exports.Model = Model;
  exports.isObject = isObject;
  exports.throwError = throwError;

  Object.defineProperty(exports, '__esModule', { value: true });

}));

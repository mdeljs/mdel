(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.mdel = {}));
}(this, (function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function __spreadArray(to, from) {
        for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
            to[j] = from[i];
        return to;
    }

    /**
     * 判断是否是对象
     * @param data {*} 待检测的数据
     * @return {boolean}
     */
    function isObject(data) {
        return Object.prototype.toString.call(data) === '[object Object]';
    }
    /**
     * 抛出异常
     * @param message {string} 错误信息
     * @param name {string} 标识
     */
    function throwError(message, name) {
        if (name === void 0) { name = 'mdel'; }
        throw new Error(name + ':' + message);
    }
    /**
     * 绑定this
     * @param target {Object} 目标
     * @param thisArg {*} this值
     * @return {Object}
     */
    function bindThis(target, thisArg) {
        var result = {};
        Object.keys(target).forEach(function (key) {
            result[key] = target[key].bind(thisArg);
        });
        return result;
    }

    var Observable = /** @class */ (function () {
        function Observable() {
            this.observes = [];
        }
        Observable.prototype.addObserver = function (observer) {
            this.removeObserver(observer);
            this.observes.push(observer);
        };
        Observable.prototype.removeObserver = function (observer) {
            this.observes = this.observes.filter(function (item) { return item !== observer; });
        };
        Observable.prototype.notifyObservers = function (store, data) {
            var observes = __spreadArray([], this.observes);
            observes.forEach(function (observer) { return observer.call(store, data); });
        };
        return Observable;
    }());

    function convertData(store) {
        var data = getStoreData(store);
        function findData(target) {
            if (target && target.core && target.core.isStore) {
                // @ts-ignore
                return convertData(target);
            }
            else if (isObject(target)) {
                return Object.keys(target).reduce(function (previousValue, currentValue) {
                    previousValue[currentValue] = findData(target[currentValue]);
                    return previousValue;
                }, {});
            }
            else if (Array.isArray(target)) {
                return target.map(function (item) { return findData(item); });
            }
            return target;
        }
        return findData(data);
    }
    function checkData(data) {
        if (!isObject(data)) {
            throwError('data is not a object');
        }
        if (data.core) {
            throwError('data cannot have core property');
        }
        if (data.actions) {
            throwError('data cannot have core property');
        }
    }
    function getStoreData(store) {
        var core = store.core, actions = store.actions, data = __rest(store, ["core", "actions"]);
        return data;
    }
    var BaseStore = /** @class */ (function () {
        function BaseStore() {
            var _this = this;
            this.core = {
                isStore: true,
                setData: function (data) {
                    checkData(data);
                    var previousData = getStoreData(_this);
                    Object.assign(_this, data);
                    _this.core.__observable.notifyObservers(_this, previousData);
                },
                convertData: function () {
                    return convertData(_this);
                },
                observe: function (observer) {
                    _this.core.__observable.addObserver(observer);
                    return function () { return _this.core.__observable.removeObserver(observer); };
                },
                //需子类实现
                resetData: function () {
                },
                //需子类实现
                baseActions: {},
                __observable: new Observable()
            };
            this.actions = {};
        }
        return BaseStore;
    }());

    function createSingleModel(model) {
        var store;
        return function SingleModel() {
            var _a;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return store || (store = new ((_a = model).bind.apply(_a, __spreadArray([void 0], args)))());
        };
    }
    function createModel(initiator) {
        var _a;
        //检查数据
        if (!isObject(initiator)) {
            throwError('initiator is not a object');
        }
        if (typeof initiator.data !== 'function') {
            throwError('initiator.data is not a function');
        }
        if (initiator.actions && !isObject(initiator.actions)) {
            throwError('initiator.actions is not a object');
        }
        if (initiator.base && !initiator.base.isModel) {
            throwError('initiator.conn is not a Model');
        }
        var Base = (initiator.base || BaseStore);
        if (initiator.single) {
            var params = Object.assign({}, initiator, {
                single: false
            });
            return createSingleModel(createModel(params));
        }
        return _a = /** @class */ (function (_super) {
                __extends(Model, _super);
                function Model() {
                    var _this = this;
                    var options = arguments[0];
                    var currentData = initiator.data();
                    var currentActions = initiator.actions || {};
                    _this = _super.call(this, options || { sourceExtend: true }) || this;
                    _this.core.baseActions = __assign({}, _this.actions);
                    _this.core.resetData = function () {
                        var baseData = {};
                        if (initiator.base) {
                            baseData = getStoreData(new Base({
                                sourceExtend: true
                            }));
                        }
                        _this.core.setData(__assign(__assign({}, baseData), initiator.data()));
                    };
                    checkData(currentData);
                    Object.assign(_this, currentData);
                    Object.assign(_this.actions, bindThis(currentActions, _this));
                    if (!(options && options.sourceExtend)) {
                        Object.seal(_this);
                        Object.freeze(_this.actions);
                        Object.freeze(_this.core);
                    }
                    return _this;
                }
                return Model;
            }(Base)),
            _a.isModel = true,
            _a;
    }

    var createModel$1 = createModel;

    exports.createModel = createModel$1;
    exports.isObject = isObject;
    exports.throwError = throwError;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

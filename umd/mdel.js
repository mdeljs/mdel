(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.mdel = {}));
}(this, function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

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
     *
     * class UserModel extends Model{
     *    constructor(){
     *        super({
     *            uid:0
     *        });
     *    }
     *    login(){
     *        this.update({
     *            uid:1
     *        })
     *    }
     * }
     *
     * const userStore = new UserModel();
     * const unSubscribe = userStore.subscribe(function(){
     *    const prevUid = userStore.data.uid;
     *
     *    return function(){
     *        console.log(prevUid,userStore.data.uid);
     *    }
     * });
     * userStore.login();
     * unSubscribe();
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
                    throwError(true, 'must use update to set data');
                },
                get: function () { return _this.pvtData; }
            });
        }
        /**
         * 更新数据
         * @param data {object} 部分数据
         */
        Model.prototype.update = function (data) {
            var _this = this;
            if (data === void 0) { data = {}; }
            //验证参数
            throwError(!isObject(data), 'data is not a object');
            //执行更新前回调
            var afterCbs = this.pvtListeners.slice().map(function (beforeCb) { return beforeCb.call(_this); });
            //更新数据
            if (Object.keys(data).length !== 0) {
                this.pvtData = __assign({}, this.pvtData, data);
            }
            //执行更新后回调
            afterCbs.forEach(function (afterCb) { return afterCb.call(_this); });
        };
        /**
         * 订阅数据的更新
         * @param listener {function():function():void}  监听函数
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

    var version = '3.5.0';

    exports.default = Model;
    exports.Model = Model;
    exports.getIsStore = getIsStore;
    exports.version = version;
    exports.isObject = isObject;
    exports.throwError = throwError;

    Object.defineProperty(exports, '__esModule', { value: true });

}));

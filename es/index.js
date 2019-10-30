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

/**
 * 数据模型
 * @class
 * @example
 */
var Model = /** @class */ (function () {
    function Model(initData) {
        this.pvtListeners = [];
        throwError(!isObject(initData), 'initData is not a object');
        this.prevData = {};
        this.data = initData;
    }
    /**
     * 设置数据
     * @param data {object} 数据
     */
    Model.prototype.setData = function (data) {
        var _this = this;
        //校验数据
        throwError(!isObject(data), 'data is not a object');
        //更新数据
        this.prevData = this.data;
        this.data = Object.assign({}, this.data, data);
        //拷贝并执行回调
        this.pvtListeners.forEach(function (listener) { return listener.call(_this); });
    };
    /**
     * 订阅数据的更新
     * @param listener {function():void}  监听函数
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

var version = '6.0.1';

export { Model, isObject, throwError, version };

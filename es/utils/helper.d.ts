/**
 * 判断是否是对象
 * @param data {*} 待检测的数据
 * @return {boolean}
 */
export declare function isObject(data: any): boolean;
/**
 * 抛出异常
 * @param message {string} 错误信息
 * @param name {string} 标识
 */
export declare function throwError(message: string, name?: string): never;
/**
 * 绑定this
 * @param target {Object} 目标
 * @param thisArg {*} this值
 * @return {Object}
 */
export declare function bindThis<T extends {
    [index: string]: (...args: any) => any;
}>(target: T, thisArg: any): T;

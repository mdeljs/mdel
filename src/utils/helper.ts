/**
 * 判断是否是对象
 * @param data {*} 待检测的数据
 * @return {boolean}
 */
export function isObject(data: any): boolean {
    return Object.prototype.toString.call(data) === '[object Object]';
}

/**
 * 抛出异常
 * @param message {string} 错误信息
 * @param name {string} 标识
 */
export function throwError(message: string, name = 'mdel'): never {
    throw new Error(name + ':' + message)
}

/**
 * 绑定this
 * @param target {Object} 目标
 * @param thisArg {*} this值
 * @return {Object}
 */
export function bindThis<T extends {
    [index: string]: (...args: any) => any
}>(target: T, thisArg: any): T {
    const result = {} as T;

    Object.keys(target).forEach((key) => {
        (result as any)[key] = target[key].bind(thisArg)
    });

    return result;
}
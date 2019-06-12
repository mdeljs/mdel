export declare type TData = object;
export declare type TListener = () => void;
export declare type TUnSubscribe = () => void;
/**
 * 数据模型
 * @class
 * @example
 */
export declare class Model<D extends TData = {}> {
    data: Readonly<D>;
    prevData: Readonly<D>;
    readonly name: Readonly<string>;
    readonly sign: Readonly<string>;
    private pvtListeners;
    constructor(initData: D, name?: string);
    /**
     * 设置数据
     * @param data {object} 数据
     */
    setData(data: Partial<D>): void;
    /**
     * 订阅数据的更新
     * @param listener {function():void}  监听函数
     * @returns 返回取消订阅
     */
    subscribe(listener: TListener): TUnSubscribe;
}
/**
 * 获取是否是数据容器
 * @param target {*} 待检测目标
 * @return {boolean}
 */
export declare function getIsStore(target: any): boolean;

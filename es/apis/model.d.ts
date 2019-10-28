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
    private pvtListeners;
    constructor(initData: D);
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

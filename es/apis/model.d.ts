export declare type ModelData = object;
export declare type ModelListener = () => void;
export declare type ModelUnSubscribe = () => void;
/**
 * 数据模型
 * @class
 * @example
 */
export declare class Model<D extends ModelData = {}> {
    data: Readonly<D>;
    prevData: Readonly<D>;
    private pvtListeners;
    constructor(initialData: D);
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
    subscribe(listener: ModelListener): ModelUnSubscribe;
}

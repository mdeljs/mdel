export declare type TData = object;
export declare type TListener<T> = (prevData: T) => void;
export declare type TUnSubscribe = () => void;
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
 *        this.change({
 *            uid:1
 *        })
 *    }
 * }
 *
 * const userStore = new UserModel();
 * const unSubscribe = userStore.subscribe(function(prevData){
 *    console.log(prevData.uid,userStore.data.uid);
 * });
 * userStore.login();
 * unSubscribe();
 */
export declare class Model<D extends TData = {}> {
    readonly data: Readonly<D>;
    readonly name: Readonly<string>;
    readonly sign: Readonly<string>;
    private pvtData;
    private pvtListeners;
    constructor(initData: D, name?: string);
    /**
     * 修改数据
     * @param data {object} 数据
     * @param [mode] {'update' | 'set'} 模式
     */
    change(data: Partial<D>, mode?: ('update' | 'set')): void;
    /**
     * 订阅数据的修改
     * @param listener {function(Object):void}  监听函数
     * @returns 返回取消订阅
     */
    subscribe(listener: TListener<D>): TUnSubscribe;
}
/**
 * 获取是否是数据容器
 * @param target {*} 待检测目标
 * @return {boolean}
 */
export declare function getIsStore(target: any): boolean;

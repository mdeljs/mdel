export declare type TData = object;
export declare type TListener = () => () => void;
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
export declare class Model<D extends TData = {}> {
    readonly data: Readonly<D>;
    readonly name: Readonly<string>;
    readonly sign: Readonly<string>;
    private pvtData;
    private pvtListeners;
    constructor(initData: D, name?: string);
    /**
     * 更新数据
     * @param data {object} 部分数据
     */
    update(data?: Partial<D>): void;
    /**
     * 订阅数据的更新
     * @param listener {function():function():void}  监听函数
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

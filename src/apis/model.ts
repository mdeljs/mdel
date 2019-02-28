import throwError from '../utils/throwError'
import isObject from '../utils/isObject'

const SIGN = '__MDEL__';

export type TData = object;
export type TListener = () => () => void ;
export type TUnSubscribe = () => void;

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
export class Model<D extends TData = {}> {
  public readonly data: Readonly<D>;
  public readonly name: Readonly<string>;
  public readonly sign: Readonly<string> = SIGN;

  private pvtData: D;
  private pvtListeners: TListener[] = [];

  constructor(initData: D, name = '') {
    throwError(!isObject(initData), 'initData is not a object');
    throwError(typeof name !== 'string', 'name is not a string');

    this.pvtData = initData;

    this.name = name;
    Object.defineProperty(this, 'data', {
      configurable: false,
      enumerable: true,
      set() {
        throwError(true, 'must use update to set data');
      },
      get: () => this.pvtData
    });
  }

  /**
   * 更新数据
   * @param data {object} 部分数据
   */
  update(data: Partial<D> = {}): void {
    //验证参数
    throwError(!isObject(data), 'data is not a object');
    //执行更新前回调
    const afterCbs = this.pvtListeners.slice().map(beforeCb => beforeCb.call(this));
    //更新数据
    if (Object.keys(data).length !== 0) {
      this.pvtData = {
        ...this.pvtData,
        ...data
      };
    }
    //执行更新后回调
    afterCbs.forEach(afterCb => afterCb.call(this));
  }

  /**
   * 订阅数据的更新
   * @param listener {function():function():void}  监听函数
   * @returns 返回取消订阅
   */
  subscribe(listener: TListener): TUnSubscribe {
    throwError(typeof listener !== 'function', 'listener is not a function');
    //添加到监听列表中
    if (this.pvtListeners.indexOf(listener) === -1) {
      this.pvtListeners.push(listener)
    }
    //返回一个取消监听
    return () => this.pvtListeners = this.pvtListeners.filter(item => item !== listener);
  }
}

/**
 * 获取是否是数据容器
 * @param target {*} 待检测目标
 * @return {boolean}
 */
export function getIsStore(target: any): boolean {
  return target && target["sign"] === SIGN;
}

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
 *        this.change({
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
        throwError(true, 'must use change to set data');
      },
      get: () => this.pvtData
    });
  }

  /**
   * 修改数据
   * @param data {object} 数据
   * @param mode {'update' | 'set'} 模式
   */
  change(data: Partial<D> = {}, mode: ('update' | 'set') = 'update'): void {
    //验证参数
    throwError(!isObject(data), 'data is not a object');
    //执行修改前回调
    const afterCbs = this.pvtListeners.slice().map(beforeCb => beforeCb.call(this));
    //修改数据
    if (Object.keys(data).length !== 0) {
      if (mode === 'update') {
        this.pvtData = {
          ...this.pvtData,
          ...data
        };
      } else if (mode === 'set') {
        this.pvtData = data as D;
      }
    }
    //执行修改后回调
    afterCbs.forEach(afterCb => afterCb.call(this));
  }

  /**
   * 订阅数据的修改
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

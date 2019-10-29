import throwError from '../utils/throwError'
import isObject from '../utils/isObject'

export type TData = object;
export type TListener = () => void ;
export type TUnSubscribe = () => void;

/**
 * 数据模型
 * @class
 * @example
 */
export class Model<D extends TData = {}> {
  public data: Readonly<D>;
  public prevData: Readonly<D>;

  private pvtListeners: TListener[] = [];

  constructor(initData: D) {
    throwError(!isObject(initData), 'initData is not a object');

    this.prevData = {} as D;
    this.data = initData;
  }

  /**
   * 设置数据
   * @param data {object} 数据
   */
  setData(data: Partial<D>): void {
    //校验数据
    throwError(!isObject(data), 'data is not a object');
    //更新数据
    this.prevData = this.data;
    this.data = Object.assign({}, this.data, data);
    //拷贝并执行回调
    this.pvtListeners.forEach(listener => listener.call(this));
  }

  /**
   * 订阅数据的更新
   * @param listener {function():void}  监听函数
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

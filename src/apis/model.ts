import throwError from '../utils/throwError'
import isObject from '../utils/isObject'

export type ModelData = object;
export type ModelListener = () => void ;
export type ModelUnSubscribe = () => void;

/**
 * 数据模型
 * @class
 * @example
 */
export class Model<D extends ModelData = {}> {
  public data: Readonly<D>;
  public prevData: Readonly<D>;

  private pvtListeners: ModelListener[] = [];

  constructor(initialData: D) {
    if (!isObject(initialData)) {
      throwError('initialData is not a object');
    }

    this.prevData = {} as D;
    this.data = initialData;
  }

  /**
   * 设置数据
   * @param data {object} 数据
   */
  setData(data: Partial<D>): void {
    //校验数据
    if (!isObject(data)) {
      throwError('data is not a object');
    }
    //更新数据
    this.prevData = this.data;
    this.data = Object.assign({}, this.data, data);
    //执行回调
    this.pvtListeners.forEach(listener => listener.call(this));
  }

  /**
   * 订阅数据的更新
   * @param listener {function():void}  监听函数
   * @returns 返回取消订阅
   */
  subscribe(listener: ModelListener): ModelUnSubscribe {
    if (typeof listener !== 'function') {
      throwError('listener is not a function');
    }
    //添加到监听列表中
    if (this.pvtListeners.indexOf(listener) === -1) {
      this.pvtListeners.push(listener)
    }
    //返回一个取消监听
    return () => this.pvtListeners = this.pvtListeners.filter(item => item !== listener);
  }
}

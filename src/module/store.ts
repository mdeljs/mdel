import {isObject, throwError} from "../utils/helper";
import {ConvertData, PickModelData, Store, StoreCore, StoreData} from "../type";
import {Observable} from "../utils/observe";

function convertData<S extends Store<any>>(store: S): ConvertData<S> {
  const data = getStoreData(store as any);

  function findData(target: any) {
    if (target && target.core && target.core.isStore) {
      // @ts-ignore
      return convertData(target);
    } else if (isObject(target)) {
      return Object.keys(target).reduce((previousValue, currentValue) => {
        previousValue[currentValue] = findData(target[currentValue]);

        return previousValue;
      }, {});
    } else if (Array.isArray(target)) {
      return target.map(item => findData(item));
    }

    return target;
  }

  return findData(data);
}

export function checkData(data: any) {
    if (!isObject(data)) {
        throwError('data is not a object');
    }

    if (data.core) {
        throwError('data cannot have core property');
    }

    if (data.actions) {
        throwError('data cannot have core property');
    }
}

export function getStoreData<D extends StoreData, S extends Store<D>>(store: S): PickModelData<D> {
    const {core, actions, ...data} = store;

    return data as PickModelData<D>;
}

export class BaseStore implements Store<{}> {
  core: { __observable: Observable } & StoreCore<any, any> = {
    isStore: true,
    setData: (data) => {
      checkData(data);

      const previousData = getStoreData(this);
      (<any>Object).assign(this, data)
      this.core.__observable.notifyObservers(this, previousData);
    },
    convertData: () => {
      return convertData(this);
    },
    observe: (observer) => {
      this.core.__observable.addObserver(observer);
      return () => this.core.__observable.removeObserver(observer);
    },
    //需子类实现
    resetData: () => {
    },
    //需子类实现
    baseActions: {},

    __observable: new Observable()
  }
  actions: {}
}

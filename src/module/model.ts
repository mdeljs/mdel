import { CreateModelInitiator, Model } from "../type";
import { bindThis, isObject, throwError } from "../utils/helper";
import { BaseStore, checkData, getStoreData } from "./store";

interface ModelOptions {
    //来自继承
    sourceExtend?: boolean
}

function createSingleModel<M extends Model<any>>(model: M): M {
    let store;

    return function SingleModel(...args) {
        return store || (store = new (model as any)(...args));
    } as unknown as M;
}

export function createModel(initiator: CreateModelInitiator<any, any, any>): Model<any> {
    //检查数据
    if (!isObject(initiator)) {
        throwError('initiator is not a object');
    }
    if (typeof initiator.data !== 'function') {
        throwError('initiator.data is not a function');
    }
    if (initiator.actions && !isObject(initiator.actions)) {
        throwError('initiator.actions is not a object');
    }
    if (initiator.base && !initiator.base.isModel) {
        throwError('initiator.conn is not a Model');
    }

    const Base = (initiator.base || BaseStore);

    if (initiator.single) {
        const params = Object.assign({}, initiator, {
            single: false
        });

        return createSingleModel(createModel(params));
    }

    return class Model extends Base {
        static isModel = true;

        constructor() {
            const options: ModelOptions = arguments[0];
            const currentData = initiator.data();
            const currentActions = initiator.actions || {};

            super(options || {sourceExtend: true});

            this.core.baseActions = {...this.actions};
            this.core.resetData = () => {
                let baseData = {};

                if (initiator.base) {
                    baseData = getStoreData(new Base({
                        sourceExtend: true
                    }));
                }

                this.core.setData({
                    ...baseData,
                    ...initiator.data()
                })
            }

            checkData(currentData);
            Object.assign(this, currentData);
            Object.assign(this.actions, bindThis(currentActions, this));

            if (!(options && options.sourceExtend)) {
                Object.seal(this);
                Object.freeze(this.actions);
                Object.freeze(this.core);
            }
        }
    }
}

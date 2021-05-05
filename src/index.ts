import { createModel as cm } from "./module/model";
import { CreateModel } from "./type";

export { throwError, isObject } from './utils/helper'
export { version,Model, Store, PickModelStore, PickModelData, PickStoreData, StoreData, StoreUnobserve } from "./type";

export const createModel: CreateModel = cm;

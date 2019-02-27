import { getIsStore, Model, TData, TListener, TUnSubscribe } from './apis/model';
import isObject from './utils/isObject';
import throwError from './utils/throwError';
declare const version = "3.4.0";
export default Model;
export { Model, getIsStore, version, isObject, throwError, TData, TListener, TUnSubscribe };

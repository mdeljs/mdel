import {getIsModel, Model, TData, TListener, TUnSubscribe} from './apis/model'
import isObject from './utils/isObject'
import throwError from './utils/throwError'

const version = '3.3.0';

export default Model;
export {
  Model, getIsModel, version,
  isObject, throwError,
  TData, TListener, TUnSubscribe
}

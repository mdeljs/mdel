/**
 * 判断是否是对象
 * @param data {*} 待检测的数据
 * @return {boolean}
 */
export default function isObject(data: any): boolean {
  return Object.prototype.toString.call(data) === '[object Object]';
}

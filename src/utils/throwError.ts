/**
 * 抛出异常
 * @param message {string} 错误信息
 */
export default function throwError(message: string): never {
  throw new Error(message)
}

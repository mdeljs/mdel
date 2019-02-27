/**
 * 抛出异常
 * @param condition {boolean} 条件
 * @param message {string} 错误信息
 */
export default function throwError(condition: boolean, message: string): void {
  if (condition) {
    throw new Error(message)
  }
}

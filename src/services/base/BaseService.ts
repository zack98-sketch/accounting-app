// 基硎服务类
export abstract class BaseService {
  protected serviceName: string;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
  }

  // 日志方法
  protected log(message: string, ...args: any[]): void {
    console.log(`[${this.serviceName}] ${message}`, ...args);
  }

  protected error(message: string, error?: any): void {
    console.error(`[${this.serviceName}] ${message}`, error);
  }

  // 错误处理
  protected handleError(error: any, context?: string): never {
    const errorMessage = context
      ? `${context}: ${error.message || error}`
      : error.message || error;
    this.error(errorMessage, error);
    throw new Error(errorMessage);
  }
}

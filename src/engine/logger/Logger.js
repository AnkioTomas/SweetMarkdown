class Logger {
    // ANSI 转义序列用于设置颜色
    static colors = {
        reset: '\x1b[0m',       // 重置颜色
        info: '\x1b[32m',       // 绿色
        warn: '\x1b[33m',       // 黄色
        error: '\x1b[31m',      // 红色
    };

    constructor(debug = false) {
        this.debug = debug;
    }

    // 格式化日志输出
    formatMessage(level, message) {
        const timestamp = new Date().toISOString();
        return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
    }

    // 打印日志并添加颜色
    log(level, message, logMethod = console.log) {
        const formattedMessage = this.formatMessage(level, message);
        const color = Logger.colors[level] || Logger.colors.reset;
        logMethod(color + formattedMessage + Logger.colors.reset);  // 添加颜色
    }

    // info 级别日志
    info(message) {
        if (this.debug)
        this.log('info', message, console.log);
    }

    // warn 级别日志
    warn(message) {
        if (this.debug)
        this.log('warn', message, console.warn);
    }

    // error 级别日志（包含堆栈信息）
    error(message) {
        const error = new Error(message);
        this.log('error', error.stack, console.error);  // 输出堆栈信息
    }
}

export default Logger;

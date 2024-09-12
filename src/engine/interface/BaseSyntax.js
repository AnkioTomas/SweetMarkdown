// 基础语法
import SyntaxType from "../constant/SyntaxType.js";

class BaseSyntax {
    static name = "BaseSyntax";

    constructor(sweetEngine) {
        /**
         * @type {SweetEngine}
         */
        this.sweetEngine = sweetEngine;
    }
    /**
     * 获取行号，只负责向上计算\n
     * 会计算cache的行号
     *
     * @param {string} md md内容
     * @param {string} preSpace 前置换行
     * @return {number} 行数
     */
    getLineCount(md, preSpace = '') {
        let content = md;
        /**
         * 前置换行个数，【注意】：前置换行个数不包括上文的最后一个\n
         *    例：
         *      - aa\n
         *      - bb\n
         *      \n
         *      cc\n
         *
         *    cc的前置换行个数为 1，bb后的\n不计算在内
         *    cc的正则为：/(?:^|\n)(\n*)xxxxxx/
         */
        let preLineCount = preSpace.match(/^\n+/g)?.[0]?.length ?? 0;
        preLineCount = preLineCount === 1 ? 1 : 0; // 前置换行超过2个就交给BR进行渲染
        content = content.replace(/^\n+/g, '');

        let cacheLineCount = 0;
        // 缓存行数
        let caches = this.sweetEngine.cache.findCaches(content);
        caches.forEach(cache => {
            cacheLineCount += this.sweetEngine.cache.get(cache).count;
        })
        return preLineCount + cacheLineCount + (content.match(/\n/g) || []).length + 1; // 实际内容所占行数，至少为1行
    }
    /**
     * 语法类型
     */
    syntaxType(){
        return SyntaxType.INLINE
    }

    /**
     * 语法正则
     */
    regex(){
        return []
    }

    onMatchRegex(str,regex,name){
        return str;
    }

    isContainsCache(text){
        return this.sweetEngine.cache.isContains(text);
    }



    $match(str){
        let regexList = this.regex();
        for(let i = 0; i < regexList.length; i++){
            let regex = regexList[i];
            this.sweetEngine.logger.info("Regex => " + regex.reg);
            let reg = regex.reg;
            if (reg.test(str)) {
                return this.onMatchRegex(str,regex.reg,regex.name);
            }
        }
        return str;
    }



    /**
     * codemirror高亮语法
     */
    highlight(){

    }

    /**
     * 编译正则表达式规则
     * @param {Object} rule - 包含正则表达式片段的规则对象
     * @param {string} flags - 正则表达式的标志，例如 'g' 表示全局匹配
     * @returns {RegExp} - 返回一个拼接好的正则表达式对象
     */
     compileRegExp(rule, flags = '') {

        // 拼接完整的正则表达式：begin + content + end
        let pattern = rule.begin + rule.content + rule.end;

        try {
            // 返回生成的正则表达式对象
            return new RegExp(pattern, flags);
        } catch (error) {
            // 如果正则表达式无效，输出错误日志
            this.sweetEngine.logger.error('Invalid regular expression:'+ pattern,error);
            return null;
        }
    }
}

export default BaseSyntax;

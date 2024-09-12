import BaseSyntax from "#sweet/engine/interface/BaseSyntax.js";
import SyntaxType from "#sweet/engine/constant/SyntaxType.js";
import {md5} from "js-md5";

class Header extends BaseSyntax{
    static name = "Header";
    regex() {
        // Setext 标题匹配规则
        // Setext 是 Markdown 标题的一种形式，使用 "=" 表示一级标题，使用 "-" 表示二级标题。
        // 例如：
        // Title
        // ======
        // 或
        // Title
        // ------
        const setext = {
            // 开始部分，匹配行的开头或换行符。捕获换行符作为 `lines` 组。
            begin: '(?:^|\\n)(\\n*)',  // 匹配行首或换行符 (可选换行符)
            // 内容部分，由标题文本和下划线组成。
            content: [
                '(?:\\s*',             // 可选的水平空白字符 (\\h 表示水平空白)
                '(.+)',                // 匹配标题的文本内容 (捕获组 text)
                ')\\n',                // 必须以换行符结束
                '(?:\\s*',             // 可选的水平空白字符
                '([=]+|[-]+)',         // 匹配等号或横线表示标题层级 (捕获组 level)
                ')',
            ].join(''),
            // 结束部分，匹配换行或文档结尾。
            end: '(?=$|\\n)',
            name: 'setext',
        };
        // 将 setext 规则编译为正则表达式 (g 表示全局匹配)
        setext.reg = this.compileRegExp(setext, 'g');

        // Atx 标题匹配规则
        // Atx 标题形式在 Markdown 中使用 "# " 表示标题级别，支持从 1 级到 6 级。
        // 例如：
        // # Title
        // ## Title
        const atx = {
            // 开始部分，匹配行首或换行符，并捕获多余的换行符作为 `lines` 捕获组。
            // 还匹配一到六个井号表示标题层级。
            begin: '(?:^|\\n)(\\n*)(?:\\s*(#{1,6}))(?=\\s+)',  // 匹配行首或换行和可选的井号，标题后面必须跟一个或多个空白字符
            // 内容部分，匹配标题的文本。
            content: '(.+?)',  // 捕获标题文本内容 (捕获组 text)
            // 结束部分，确保匹配结束时是换行或字符串结尾。
            end: '(?=$|\\n)',
            name: 'atx',
        };

        // 将 atx 规则编译为正则表达式 (g 表示全局匹配)
        atx.reg = this.compileRegExp(atx, 'g',);

        // 返回一个包含 setext 和 atx 规则的对象
        return [ atx , setext];
    }
    $wrapHeader(text, level, lineCount,sign) {
        return `<sweet-header level="${level}" count="${lineCount}" sign="${sign}">${this.sweetEngine.$makeInlineHtml(text)}</sweet-header>`
    }
    onMatchRegex(str, regex , name) {
       if (name === "atx") {
           str = str.replace(regex, (match, lines, level, text) => {
               if (this.isContainsCache(text)) {
                   return match;
               }
               const lineCount = this.getLineCount(text,lines);
               const $text = text.replace(/\s+#+\s*$/, '');
               const $sign = md5(str);
               return this.$wrapHeader($text, level.length, lineCount, $sign);
           });
       } else{
           str = str.replace(regex, (match, lines, text, level) => {
               if (this.isContainsCache(text)) {
                   return match;
               }
               const lineCount = this.getLineCount(text,lines);
               const headerLevel = level[0] === '-' ? 2 : 1; // =: H1, -: H2
               const $sign = md5(str);
               return this.$wrapHeader(text.replace(/\s+$/, ''), headerLevel, lineCount, $sign);
           });
       }
       return str;
    }

    syntaxType() {
        return SyntaxType.PARAGRAPH;
    }
}

export default Header;

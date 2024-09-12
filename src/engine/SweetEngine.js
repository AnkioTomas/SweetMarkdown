
import SyntaxType from "sweet/engine/constant/SyntaxType.js";
import SweetConfig from "sweet/engine/SweetConfig.js";
import Logger from "sweet/engine/logger/Logger.js";
import Cache from "sweet/engine/cache/Cache.js";
class SweetEngine {

    constructor(options) {
        // 将options与SweetConfig合并
        this.options = Object.assign({}, SweetConfig, options);
        this.cache = new Cache();
        this.logger = new Logger();
        this.$loadPlugins();
    }



    $loadPlugins(){
        this.bigDataRegex = [
            // {name: "Header", regex: /(?:^|\n)(\n*)(?:\h*(#{1,6}))(?=\h+)/g},
        ]
        this.containerSyntax = []; //容器语法
        this.inlineSyntax = []; // 行内语法
        this.paragraphSyntax = []; //段落语法
        this.options.plugins.forEach(pluginClazz=>{
            let plugin = new pluginClazz();

            // 大数据替换规则
            let bigData = plugin.bigDataRegex();
            if(bigData.length > 0){
                this.bigDataRegex.push({name: plugin.constructor.name, regex: bigData});
            }
            //
            let syntaxList = plugin.syntax();
            syntaxList.forEach(syntaxClazz=>{
                let syntax = new syntaxClazz(this);
                switch(syntax.syntaxType()){
                    case SyntaxType.CONTAINER:
                        this.containerSyntax.push(syntax);
                        break;
                    case SyntaxType.INLINE:
                        this.inlineSyntax.push(syntax);
                        break;
                    case SyntaxType.PARAGRAPH:
                        this.paragraphSyntax.push(syntax);
                        break;
                }
            });
        })
    }

    toHtml(markdown){
        markdown = this.$cacheBigData(markdown);
        markdown = this.$beforeMakeHtml(markdown);
        let html = this.$makeHtml(markdown);
        return html;
    }

    $makeHtml(markdown){
        let html = markdown;
        html = this.$makeContainerHtml(html);
        html = this.$makeParagraphHtml(html);
        html = this.$makeInlineHtml(html);
        return html;
    }
    $makeInlineHtml(markdown){
        let html = markdown;
        this.inlineSyntax.forEach(syntax=>{
            html = syntax.$match(html);
        });
        return html
    }
    $makeParagraphHtml(markdown){
        let html = markdown;
        this.paragraphSyntax.forEach(syntax=>{
            html = syntax.$match(html);
        });
        return html
    }
    $makeContainerHtml(markdown){
        let html = markdown;
        this.containerSyntax.forEach(syntax=>{
            html = syntax.$match(html);
        });
        // 输入与输出的不一致，说明可能还存在嵌套语法
        if (html !== markdown) {
            html = this.$makeContainerHtml(html);
        }
        return html
    }

    $beforeMakeHtml(str) {
        let $str =  str.replace(/\r\n/g, '\n');
        $str = $str.replace(/\r/g, '\n');
        // 最后一行如果没有换行符，补上
        if ($str[$str.length - 1] !== '\n') {
            $str += '\n';
        }
        return $str;
    }



    $cacheBigData(markdown){
        for(let i = 0; i < this.bigDataRegex.length; i++){
            let rule = this.bigDataRegex[i];
            try {
                markdown = markdown.replace(rule.regex, (whole, m1, m2) => {
                    const cacheKey = this.cache.key(m2);
                    this.cache[cacheKey] = m2;
                    return `${m1}${cacheKey}`;
                });
            }catch (e) {
                this.logger.error(`Plugin ${rule.name} BigData Regex Error`, e);
            }
        }
        return markdown;
    }
}
export default SweetEngine;

import SweetEngine from "#sweet/engine/SweetEngine.js";
import BaseSyntaxPlugin from "#sweet/plugins/basic/BaseSyntaxPlugin.js";

let sweet  = new SweetEngine({
    plugins:[
        BaseSyntaxPlugin, //只使用基础语法插件
    ],
    debug:true
});

export default sweet;

/**
 * 所有插件的基础类，插件注册必须使用
 */
class  BasePlugin {
    /**
     * 所有注册的组件
     * @returns {*[]}
     */
    components(){
        return []
    }

    /**
     * 超大数据规则（base64图片之类的，在渲染前优先缓存，提高渲染性能）
     * @returns {*[]}
     */
    bigDataRegex(){
        return []
    }

    /**
     * 语法规则
     * @returns {*[]}
     */
    syntax() {
        return []
    }
}

export default BasePlugin;

import Header from "sweet/plugins/basic/syntax/Header.js";
import BasePlugin from "sweet/engine/interface/BasePlugin.js";
class BaseSyntaxPlugin extends BasePlugin{
    components() {

    }

    syntax() {
        return [
            Header
        ]
    }
}

export default BaseSyntaxPlugin;

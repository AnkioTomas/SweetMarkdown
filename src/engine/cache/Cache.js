import {md5} from "js-md5";

class Cache {
    constructor() {
        this.cache = new Map();
    }

    // 设置缓存项，支持设置过期时间（以毫秒为单位）
    set(key, value,count) {

        this.cache.set(key, { value,count });
    }

    // 获取缓存项，如果缓存已过期或不存在，返回 null
    get(key) {
        const cachedItem = this.cache.get(key);
        if (!cachedItem) return null;
        return cachedItem;
    }

    // 删除缓存项
    delete(key) {
        return this.cache.delete(key);
    }

    // 清空所有缓存项
    clear() {
        this.cache.clear();
    }

    // 获取当前缓存大小
    size() {
        return this.cache.size;
    }
    //缓存key的语法很特殊，避免与其他语法冲突
    key(str) {
       return `@@cache-${md5(str)}-cache@@`;
   }

    isContains(text) {
        return /@@cache-([a-f0-9]{32})-cache@@/.test(text);
    }

    findCaches(text){
        let match = text.match(/@@cache-([a-f0-9]{32})-cache@@/g);
        if(match){
            return match;
        }
        return [];
    }
}

export default Cache;


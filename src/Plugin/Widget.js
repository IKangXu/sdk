/*
 * 作者：zhuwz
 * 日期：2018-12-03 21:39:39.
 */
import Plugin from './Plugin';

/**
 * (挂件类基类)需要用户继承该类实现自己的类。
 * 由{@link PluginManager}统一管理.
 * 继承挂件的类之间是不互斥的（多了个插件可以同时开启）
 * @augments Plugin 
 */
class Widget extends Plugin {

    constructor(options) {
        super(options);
        this._type = 'widget';
        this._isUsing = false;
    }

    set type(type) {
        this._type = 'widget';
    }

    get type() {
        return this._type;
    }

    set isUsing(isusing) {
        this._isUsing = isusing;
    }

    /**
     * 判断挂件是否使用
     * @type {boolean}
     */
    get isUsing() {
        return this._isUsing;
    }

    // 与c++插件关联
    set registerName(registerName) {
        this._registerName = registerName;
        if (this.earth && this._registerName) {
            // this.earth._usingWidget(this._registerName, this);
        }
    }

}

export default Widget

/*
 * 作者：zhuwz
 * 日期：2018-12-03 21:39:39.
 */
import Plugin from './Plugin';

/**
 * (工具类基类)需要用户继承该类实现自己的类。
 * 由{@link PluginManager}统一管理.
 * 继承工具的类之间是相互互斥的（一次正能开启一个工具）
 * @augments Plugin 
 */
class Tool extends Plugin {
    constructor(options) {
        super(options);
        this._type = 'tool';
        this._isCurrentTool = false;
    }

    set type(type) {
        this._type = 'tool';
    }

    get type() {
        return this._type;
    }

    set isCurrentTool(isCurrentTool) {
        this._isCurrentTool = isCurrentTool;
    }

    /**
     * 是否是当前工具
     * @type {boolean}
     */
    get isCurrentTool() {
        return this._isCurrentTool;
    }

    set active(status = false) {
        this._active = status;
        if ((typeof status === 'boolean') && status) {
            if (this._manager) {
                this._manager._activeTool(this);
            }
        }
    }

    get active() {
        return this._active;
    }

}

export default Tool
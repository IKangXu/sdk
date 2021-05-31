 
/*
 * 作者：zhuwz
 * 日期：2018-12-03 21:39:39.
 */
'use strict';

import * as Util from './Util';

export default class Class {
    // 通用构造方法
    constructor(params) {
        if (params && Util.isJson(params)) {
            this._uuid = params.uuid;
            this._parseJson(params);
        }
        this._uuid = this._uuid || Util.createGuid();
    }

    _parseJson(params, post) {}

    /**
     * 绑定回调事件,为了方便,都写到这里了
     * @param callback {Function} 回调函数
     */
    bindCallback(callback) {
        let _target = null;
        if (this.map) {
            _target = this.map._messageManager;
        } else if (this._messageManager) {
            _target = this._messageManager;
        }
        if (_target != null) {
            _target.bindCallback(this.id, callback, this);
        }
    }

    /**
     * 设置地球实体
     * @param map {Uninpho.Map} Map对象
     */
    setMap(map) {
        this.map = map;
        if (this._callBack && Util.$.isFunction(this._callBack)) {
            this.bindCallback(this._callBack);
        }
    }

    setProps(options) {
        for (const key in options) {
            this[key] = options[key];
        }
    }


    /**
     * 向实体传送消息
     * @param messageType {String} 消息类型
     * @param para1 {Object} 消息参数
     * @param para2 {Object} 消息参数
     */
    postMessage(messageType, para1, para2) {
        let _target = null;
        if (this.map) {
            _target = this.map._messageManager;
            _target.postMessage(this.id, messageType, para1, para2);
        } else if (this._messageManager) {
            _target = this._messageManager;
            _target.postMessage(messageType, para1, para2);
        }
    }

    set uuid(uuid) {
        if (!this._uuid) {
            this._uuid = uuid;
        }
    }

    get id() {
        return this._uuid;
    }

    /**
     * 返回该类对应的xml标签
     * @return {string}
     */
    get tag() {
        return 'Class';
    }

    /**
     * 转化为xml描述
     * @return {string} xml描述文本
     */
    toXml() {
        return this._toXml();
    }

    /**
     * 转化为xml描述
     * @param innerXML {string} 插入到标签中的xml文本
     * @return {string} xml描述文本
     * @private
     */
    _toXml(innerXML = '') {
        return Util.replaceXmlSpace(`<${this.tag}><uuid>${this.id}</uuid>${innerXML}</${this.tag}>`);
    }

    /**
     * 转换为json数据
     */
    _toJson(child) {
        const obj = {uuid: this.id}
        if (child) {
            for (const key in child) {
                obj[key] = child[key];
            }
        } 
     
        return {[this.tag]: obj};
    }

}

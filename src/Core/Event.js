/*
 * 作者：zhuwz
 * 日期：2018-12-03 21:39:39.
 */

'use strict';

import * as Util from './Util';
import Class from './Class';

/**
 * 事件类
 * @module core
 * @namespace GV
 * @class Event
 */
export default class Event extends Class {
    /**
     * 添加对象的事件监听方法
     * @method on
     * @param types {string | json} 事件名称或者json,例如:<br/>1.'click' <br/> 2.{click:onClick,mouseMove:onMouseMove}
     * @param fn {Function} 回调方法
     * @param context {Object} 上下文
     * @return {Object} 返回使用对象
     * @example
     *      gvml.on('mouse-click',function(event){
     *      });
     * @example
     *      gvml.on('mouse-click',function(event){
     *      })
     */
    on(types, fn, context) {
        // 类型可以是一个Map集合;
        if (Util.isJson(types)) {
            for (const type in types) {
                this._on(type, types[type], fn);
            }
        } else {
            this._on(types, fn, context);
        }
        return this;
    }

    /**
     * 添加监听真正入口
     * @param type {string} 方法名称
     * @param fn {Function} 回调方法
     * @param context {Object} 上下文
     */
    _on(type, fn, context) {
        this._events = this._events || {};
        // 获取注册的监听
        let typeListeners = this._events[type];
        // 容错 及初始化
        if (!typeListeners) {
            typeListeners = [];
            this._events[type] = typeListeners;
        }
        if (context === this) {
            // 释放部分内存
            context = undefined;
        }
        const newListener = { fn: fn, ctx: context };
        const listeners = typeListeners;
        // 检查回调函数是否已经存在
        for (let i = 0, len = listeners.length; i < len; i++) {
            if (listeners[i].fn === fn && listeners[i].ctx === context) {
                return;
            }
        }
        listeners.push(newListener);
    }

    /**
     * 移除对象的事件监听方法
     * @method off
     * @param types {string/map} 事件名称或者Map,例如: 'click' 或者 {click:onClick,mouseMove:onMouseMove}
     * @param fn {Function} 回调方法
     * @param context {Object} 上下文
     * @return {Object} 返回使用对象
     */
    off(types, fn, context) {
        if (!types) {
            // 没有参数的时候移除所有方法
            delete this._events;
        } else if (typeof types === 'object') {
            for (const type in types) {
                this._off(type, types[type], fn);
            }
        } else {
            this._off(types, fn, context);
        }
        return this;
    }

    /**
     * 移除监听真正入口
     * @param type {string} 方法名称
     * @param fn {Function} 回调方法
     * @param context {Object} 上下文
     * @private 私有
     */
    _off(type, fn, context) {
        // 没有监听维护时返回
        if (!this._events) {
            return;
        }
        // 获取监听类型集合
        let listeners = this._events[type];
        // 不存在时返回
        if (!listeners) {
            return;
        }
        // 如果回调不为空
        if (fn) {
            // 遍历
            for (let i = 0, len = listeners.length; i < len; i++) {
                listeners[i].fn = Util.falseFn;
            }
            delete this._events[type];
            return;
        }
        if (context === this) {
            context = undefined;
        }
        // 找到回调方法并移除
        for (let i = 0, len = listeners.length; i < len; i++) {
            const l = listeners[i];
            if ((l.ctx === context) && (l.fn === fn)) {
                l.fn = Util.falseFn;
                if (this._firingCount) {
                    this._events[type] = listeners = listeners.slice();
                }
                listeners.splice(i, 1);
                return;
            }
        }
    }

    /**
     * 激活对象的某个监听事件,可以附件数据,并可以传递给父对象
     * @method fire
     * @param type {string} 事件名称
     * @param data {Object} 数据
     * @return {Object} 返回使用对象
     */
    fire(type, data) {
        if (!this.listens(type)) {
            return this;
        }
        if (this._events) {
            const listeners = this._events[type];
            if (listeners) {
                this._firingCount = (this._firingCount + 1) || 1;
                for (let i = 0, len = listeners.length; i < len; i++) {
                    const l = listeners[i];
                    l.fn.call(l.ctx || this, data);
                }
                this._firingCount--;
            }
        }
        return this;
    }

    /**
     * 查询是否有指定类型的监听器
     * @param type {string} 事件类型
     * @param propagate {boolean} 是否向上传递
     */
    listens(type) {
        const listeners = this._events && this._events[type];
        if (listeners && listeners.length > 0) {
            return true;
        }
        return false;
    }
}

/*
 * 作者：zhuwz
 * 日期：2018-12-03 21:39:39.
 */

'use strict';

import * as Util from '../core/Util';
import ExceptionMessage from './ExceptionMessage';

export default class Exception {
    constructor(message, ...type) {

        if (type.length > 0) {
            this.type = type.shift();
        }

        this.showMessage(message, type);
    }

    formatMessage(value, phvList) {
        const arr = [];
        let j;
        let index;
        let i = 0;
        while (i < value.length) {
            if (value.charAt(i) === '{') {
                j = value.indexOf('}', i + 1);
                if (j === -1) {
                    i++;
                } else {
                    index = parseInt(value.substring(i + 1, j));
                    if (!isNaN(index) && index >= 0) {
                        const s = value.substring(0, i);
                        if (s !== '') {
                            arr.push(s);
                        }
                        arr.push(index);
                        i = 0;
                        value = value.substring(j + 1);
                    } else {
                        i = j + 1;
                    }
                }
            } else {
                i++;
            }
        }
        if (value !== '') {
            arr.push(value);
        }
        value = arr;

        if (value.length === 0) {
            return '';
        }
        if (value.length === 1 && typeof value[0] === 'string') {
            return value[0];
        }

        let str = '';
        for (i = 0, j = value.length; i < j; i++) {
            if (typeof value[i] === 'string') {
                str += value[i];
            } else if (phvList && value[i] < phvList.length) {
                str += phvList[value[i]];
            }
        }

        return str;
    }

    /**
     * 输出消息
     * @param message {string} 消息体
     */
    showMessage(message, type) {
        const infoType = message.type;
        message = this.formatMessage(message[ExceptionMessage.show_language], type);
        switch (infoType) {
            case 'error':
                console.error(`${this.type}:${message}`);
                break;
            case 'warn':
                console.warn(`${this.type}:${message}`);
                break;
            case 'info':
                console.info(`${this.type}:${message}`);
                break;
            default:
            
                break;
        }
        
    }

    set
    type(value) {
        this._type = value || 'Exception';
    }

    get
    type() {
        return this._type;
    }
}

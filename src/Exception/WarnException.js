/*
 * 作者：zhuwz
 * 日期：2018-12-03 21:39:39.
 */

import * as Util from '../core/Util';
import ExceptionMessage from './ExceptionMessage';

function formatMessage(value, phvList) {
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

   
    if (value.length === 1 && typeof value[0] === 'string') {
        return value[0];
    }

    let str = '';
    if (value.length === 0 && phvList) {
        for (i = 0; i < phvList.length; i++) {
            str += phvList[i];
        }
        return str;
    }
    for (i = 0, j = value.length; i < j; i++) {
        if (typeof value[i] === 'string') {
            str += value[i];
        } else if (phvList && value[i] < phvList.length) {
            str += phvList[value[i]];
        }
    }

    return str;
}

function showMessage(message, type, info) {
    const infoType = message.type;
    message = formatMessage(message[ExceptionMessage.show_language], info);
    return `${type}:${message}`
}

export const WarnException = function (message, ...type) {
    let obj;
    if (type.length > 0) {
        obj = type.shift();
    }

    return showMessage(message, obj, type);
};


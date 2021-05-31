/*
 * 作者：zhuwz
 * 日期：2018-12-03 21:39:39.
 */
import jquery from '../thirdParty/jquery-3.1.1.min';
 
import mathUtil from './mathUtil';
import arrayUtil from './arrayUtil';
import * as warn from '../exception/WarnException';
import ExceptionMessage from '../Exception/ExceptionMessage';

export const $ = jquery;
export const array = arrayUtil;
export const math = mathUtil;
/**
 * 判定对象是否为纯粹的json对象
 * @param obj {Object} 被判定对象
 * @return {boolean} 是-true 否-false
 */
export const isJson = function (obj) {
    if ($.isPlainObject(obj)) {
        try {
            JSON.stringify(obj);
            return true;
        } catch (e) {
            return false;
        }
    } else {
        return false;
    }
};
/**
 * 检查参数是否为普通对象
 * @param obj
 * @return {boolean}
 */
export const isObject = function (obj) {
    return typeof obj === 'object' && obj !== null;
}

/**
 * 检查参数是否为布尔值
 * @param obj
 * @return {boolean}
 */
export const isBoolean = function (obj) {
    return typeof obj === 'boolean';
}

/**
 * 检查参数是否为布尔值或者为true、false的字符串
 * @param value
 * @return {boolean}
 */
export const isTrueOrFalse = function (value) {
    return (typeof value === 'boolean' || value === 'true' || value === 'false');
}

/**
 * 将传入的字符串类型的
 * @param value
 * @return {boolean/undefined}
 */
export const toBooleanTrueOrFlse = function (value) {
    if (value === true || value === 'true' || value === 'TRUE') {
        return true;
    } else if (value === false || value === 'false' || value === 'FALSE') {
        return false;
    }
    return undefined;
}

if (!("debug" in console)) {
    console.debug = (...args) => {
        console.log.apply(this, args);
    }
}

export const getJsonLength = function (obj) {
    let count = 0;
    for (const key in obj) {
        count++;
    }
    return count;
};
/**
 * 判定是否为字符串
 * @param obj {Object}
 * @return {boolean} 是-true 否-false
 */
export const isString = function (obj) {
    return (typeof obj === 'string' && obj.constructor === String);
};
/**
 * 判定是否为数值
 * @param obj {Object}
 * @return {number} 是-true 否-false
 */
export const isNumber = function (obj) {
    return (typeof obj === 'number' && obj.constructor === Number);
};

/**
 * 判定是否为字符串类型的数值
 * @param obj {Object}
 * @return {number} 是-true 否-false
 */
export const isStrNumber = function (obj) {
    if (isString(obj)) {
        if (isNaN(parseFloat(obj))) return false;
        return true; 
    }
    return (typeof obj === 'number' && obj.constructor === Number);
};

/**
 * 判定是否为数组
 * @param obj {Array<any>}
 * @return {boolean} 是-true 否-false
 */
export const isArray = function (obj) {
    return obj instanceof Array;
};
/**
 * @param {String} string
 * @description 正则匹配带有单位px或m的属性值
 */
export const isAddUnit = function (string) {
    const reg = new RegExp(/^(\-|\+)?\d+(m|px)?$/);
    return reg.test(string);
}
/**
 * @param {String} string
 * @description 正则匹配带有单位m或px的属性值并返回其中的数值
 */
export const filterUnit = function (string) {
    return isNumber(string) ? string : Number(string.match(/^(\-|\+)?\d+/)[0]);
}
/**
 * ajax获取xml数据
 */
export const xmlPromise = function (url) {
    return $.ajax({url: url, type: 'get', dataType: 'xml'});
};
/**
 * 
 * @param {String} string
 * @description 判断字符串是否为十六进制颜色。例如#FFFFFFFF或者#FFFFFF  
 */
export const isColor = function (string) {
    const regColor = new RegExp('^#([0-9a-fA-F]{6}|[0-9a-fA-F]{8})$');
    return regColor.test(string);
}
/**
 * ajax获取json数据
 */
export const jsonSyncPromise = function (url) {
    return $.ajax({url: url, type: 'get', dataType: 'json', async: false});
};
export const strToXml = function (str) {
    return new DOMParser().parseFromString(str, 'text/xml');
}
/**
 * xml字符串转换为json
 * @param xml {String} xml字符串
 * @return {Json} json对象
 */
export const xmlToJson = (xml) => {
    // Create the return object
    let obj = {};
    if (xml.nodeType === 1) { // element
        // do attributes
        if (xml.attributes.length > 0) {
            for (let j = 0; j < xml.attributes.length; j += 1) {
                const attribute = xml.attributes.item(j);
                obj[attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType === 3) { // text
        obj = xml.nodeValue;//--钱晶
    }
    if (xml.hasChildNodes()) {
        for (let i = 0; i < xml.childNodes.length; i += 1) {
            const item = xml.childNodes.item(i);
            let nodeName = item.nodeName;
            if (typeof (obj[nodeName]) === 'undefined') {
                let value = null;
                if (nodeName.toLowerCase() === '#cdata-section'){
                    value = CDATAtoSTR(xml.innerHTML);
                    nodeName = 'value';
                } else {
                    value = xmlToJson(item);
                }
               
                if (!(nodeName === '#text' && value.replace(/^\s+/g, '') === '') && nodeName !== '#comment') { // 去除注解
                    if (nodeName === '#text') {
                        obj = value;
                    } else {
                        obj[nodeName] = value;
                    }
                }

            } else {
                if (typeof (obj[nodeName].length) === 'undefined') {
                    const old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    }
    return obj;
};
/**
 * json转xml字符串
 */
export const json2xml = function (json, tag) {
    let xml = '';
    if (json instanceof Array) {
        for (const v of json) xml += json2xml(v, tag);
    } else if (json instanceof Object) {
        if (tag) xml += `<${tag}>`;
        for (const k in json) xml += json2xml(json[k], k);
        if (tag) xml += `</${tag}>`;
    } else {
        xml += `<${tag}>${json}</${tag}>`;
    }
    return xml;
}

export const json2xmlAndaAToa_a = function (json, tag) {
    let xml = '';
    if (json instanceof Array) {
        for (const v of json) xml += json2xmlAndaAToa_a(v, tag);
    } else if (json instanceof Object) {
        if (tag) xml += `<${aAToa_a(tag)}>`;
        for (const k in json) xml += json2xmlAndaAToa_a(json[k], k);
        if (tag) xml += `</${aAToa_a(tag)}>`;
    } else {
        xml += `<${aAToa_a(tag)}>${json}</${aAToa_a(tag)}>`;
    }
    return xml;
}

export const createGuid = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

export const falseFn = function () {
    return false;
};

export const indexOf = (obj, arr, key) => {
    for (const i in arr) {
        if (arr[i][key] === obj[key]) {
            return i;
        }
    }
    return -1;
};

/**
 * 格式化字符串
 * @param str {String} 被格式化字符串 如 xx.json?a = {a}&b={b}
 * @param array {Array} 传入得字符 [{k:a,v:asdf}]
 */
export const formatString = function (str, array) {
    if (array.length !== 0) {
        for (const o of array) {
            const re = new RegExp(`{${o.k}}`, 'gm');
            str = str.replace(re, o.v);
        }
        return str;
    }
    return str;
}

export const rename = function (nameValue = '', objMap, prop, obj) {
    let count = 0;
    const uniqueMap = (str, map, key, self) => {
        // let res = str;
        for (const mapkey in map) {
            let compareValue;
            if (key) { // 匹配value[key]
                compareValue = map[mapkey][key];
            } else {
                compareValue = map[mapkey];
            }
            // console.log(str, compareValue);
            if (compareValue && str === compareValue && map[mapkey] !== self)
                return uniqueMap(`${str}_${++count}`, map, key, self);
        }
        return str;
    };
    return uniqueMap(nameValue, objMap, prop, obj);
}

export const formatURL2 = function (originPath, file) {
    if(!file) return;
    const tempUrl = file.split('/');
    let htmlUrl = originPath; //当前页面路径
    if(!htmlUrl) return file;
    htmlUrl = htmlUrl.split('/');

    // 去掉末尾的‘/’
    htmlUrl.pop();
    let res = '';
    for (let i = 0; i < tempUrl.length; i += 1) {
        if (i === 0 && tempUrl[i] === '.') i += 1;
        if (tempUrl[i] === '..') {
            htmlUrl.pop();
        } else {
            htmlUrl.push(tempUrl[i]);
        }
    }
    for (let i = 0; i < htmlUrl.length; i += 1) {
        const sp = i === htmlUrl.length - 1 ? '' : '/';
        res += htmlUrl[i] + sp;
    }
    return res;
}

export const formatURL = function (file) {
    if(!file) return;
    const tempUrl = file.split('/');
    let htmlUrl = window.location.href; //当前页面路径
    if(!htmlUrl) return file;
    htmlUrl = htmlUrl.split('/');

    // 去掉末尾的‘/’
    htmlUrl.pop();
    let res = '';
    for (let i = 0; i < tempUrl.length; i += 1) {
        if (i === 0 && tempUrl[i] === '.') i += 1;
        if (tempUrl[i] === '..') {
            htmlUrl.pop();
        } else {
            htmlUrl.push(tempUrl[i]);
        }
    }
    for (let i = 0; i < htmlUrl.length; i += 1) {
        const sp = i === htmlUrl.length - 1 ? '' : '/';
        res += htmlUrl[i] + sp;
    }
    return res;
}

export const formatURLByHost = function (file) {
    if(!file) return;
    let root = window.location.origin;
    if (!root) return file;

    let tempUrl = file.split('/');
    const url = [root];

    let res = '';
    for (let i = 0; i < tempUrl.length; i += 1) {
        if (i === 0 && tempUrl[i] === '.') i += 1;
        if (tempUrl[i] === '..') {
            i += 1;
        } else {
            url.push(tempUrl[i]);
        }
    }
    for (let i = 0; i < url.length; i += 1) {
        const sp = i === url.length - 1 ? '' : '/';
        res += url[i] + sp;
    }

    return res;
}

/**
 * xxxx_xx_xx转xxxxXxXx的方法
 */
export const a_aToaA = function (str) {
    return str.replace(/_[a-z]/g, function ($0) {
        return $0.toUpperCase().charAt(1);
    });
}

/**
 * xxxxXx转xxxx_xx
 */
export const aAToa_a = function (str) {
    return str.replace(/[A-Z]/g, function ($0) {
        return '_' + $0.toLowerCase();
    });
}

export const getLocation = function (filepath) {
    const location = {dir: '', filename: ''};
    if (new RegExp(/^http:\/\//g).test(filepath)) filepath = filepath.substring(6);
    const dirs = filepath.split('/');
    for (let i = 0; i < dirs.length; i++) {
        // 暂时写成以html结尾的路径
        if (i === (dirs.length - 1)) { // 最后一个是文件名
            location.dir += '/';
            location.filename = dirs[i];
        } else if (dirs[i] !== null && dirs[i] !== '') {
            location.dir += `/${dirs[i]}`;
        }
    }
    location.dir = `http:/${location.dir}`;
    return location;
}


/**
 * 字符串转数组 样例：'1 2 3,4 5 6' => [[1, 2, 3], [4, 5, 6]]
 *                   1,2,45,5 =>[1,2,45,5]
 */
export const strToArray = function (string, type = 'float') {
    const points = [];
    if (typeof string !== 'string') return points;

    let datas = string.split(',');
    if (!datas) return points;

    if (!(datas instanceof Array))
        datas = [datas];
    
    datas.forEach((value) => {
        if (typeof value === 'string') {
            const tempVecStr = value.split(' ');
            
            if (tempVecStr && tempVecStr.length === 1) {
                points.push(tempVecStr[0]);
            } else if (tempVecStr && tempVecStr.length > 1) {

                const tempVec = [];
                for (let i = 0; i < tempVecStr.length; i++) {
                    tempVec.push(parseFloat(tempVecStr[i]));
                }
                points.push(tempVec);
            }

        }
    }); 

    //转换文字类型
    if (type === 'string' || type === 'String' || type === 'STRING') return points;

    points.forEach((point, pointIndex, pointArr) => {
        if (point instanceof Array) {
            point.forEach((data, index, arr) => {
                switch (type) {
                    case 'float':
                        arr[index] = parseFloat(data);
                        break;

                    default:
                        break;
                }
            });

        } else {
            switch (type) {
                case 'float':
                    pointArr[pointIndex] = parseFloat(point);
                    break;

                default:
                    break;
            }
        }
    });

    return points;
}

/**
 * 数组转字符串样例：[[1, 2, 3], [4, 5, 6]] => '1 2 3,4 5 6'
 */
export const arrayToStr = function (points) {
    let str = '';
    if (!points || !(points instanceof Array) || points.length === 0) return '';

    for (let i = 0; i < points.length; i++) {
        if (i !== 0) str += ','
        const data = points[i];
        if (data instanceof Array) {
            for (let k = 0; k < data.length; k++) {
                if (k !== 0) str += ' ';
                str += `${data[k]}`;
            }
        } else {
            str += `${data}`;
        }
    }
    return str;
}

/**
 * 同步获取json数据
 */
export const syncGetJson = function(path) {
    const response = $.ajax({
        async: false,
        url: path,
        dataType: 'text'
    });
    if (response.readyState === 4 && response.status === 200) {
        return JSON.parse(response.responseText);
    }
}

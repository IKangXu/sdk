/*
 * 作者：zhuwz
 * 日期：2018-12-03 21:39:39.
 */
import Event from './../Core/Event';
import {$} from '../core/Util';
import i18n from './../core/i18n';

const varRegExp = /\\?\{\{([^{}]+)\}\}/g;

/**
 * （抽象类）插件基类 {@link Tool} 与 {@link Widget} 继承自该类
 */
class Plugin extends Event {

    constructor(params) {
        super(params);
        for (const key in params) {
            if (params[key] && key !== 'uuid') {
                this[key] = params[key];
            }
        }
        this._loadLanguage();
    }

    _loadLanguage() {
        if (this.language) {
            const lanProp = {
                path: this.url,
                name: this.language,
                mode: 'map',
                language: 'zh'
            };
            i18n.properties(lanProp);
        }
    }

    _loadLanguageCallback() {
        this._isLoadLanguageOk = true;
    }

    getValue(key) {
        return i18n.prop(key);
    }

    get type() {
        return this.type;
    }

    get key() {
        return this.name;
    }

    set transition(isTrans) {
        if (isTrans === true) {
            this.container.className = 'transition_left';
        }
        this._transition = isTrans;
    }

    get transition() {
        if (this._transition) return this._transition;
        return false;
    }

    get setting() {
        // let param = '';
        // let setURL = '';
        // if (this.earth && this.earth.plugincenter) {
        //     param += this.earth.plugincenter.split('?')[1];
        //     param += `&plugin=${this.name}`;
        //     setURL = `${Config.Center.PluginCenter.getPluginSetting}${param === '' ? '' : `?${param}`}`;
        // } else {
        //     setURL = `${this.url}setting.json`;
        // }
        const setURL = `${this.url}setting.json`;
        const response = $.ajax({
            async: false,
            url: setURL
        });
        if (/^Cannot/.test(response.responseText) === true) return undefined;
        else if (response.responseText === '') return undefined;
        try {
            JSON.parse(response.responseText);
        } catch (e) {
            return undefined;
        }
        return JSON.parse(response.responseText)[this.name] ?
            JSON.parse(response.responseText)[this.name] : JSON.parse(response.responseText);
    }

    _init() {
        if (this.reference) {
            this.reference();
            let isLoad = false;
            if (this.html) {
                this.loadHtml(this.html);
                isLoad = true;
            }
            if (this.css) {
                this.loadCss(this.css);
                isLoad = true;
            }
            if (this.script) {
                this.synLoadScript(this.script);
            } else{                
                this.init();
        }

        } else {
            this.init();
        }
    }

    /**
     * 插件被启用时调用
     */
    init() {}

    _remove() {
        this.remove();
        this._removeUI();
    }

    /**
     * 插件被关闭时调用
     */
    remove() {}

    loadCss(urls) {
        if (typeof urls === 'string') urls = [urls];
        const head = document.getElementsByTagName('head')[0];
        for (const url of urls) {
            const link = document.createElement('link');
            link.type = 'text/css';
            link.rel = 'stylesheet';
            link.href = this.formatURL(url);
            const response = $.ajax({
                async: false,
                url: link.href
            });
            response.done(() => {
                head.appendChild(link);
                if (!this.link) {
                    this.link = [];
                }
                this.link.push(link);
            });
            response.fail((msg) => { console.error(msg); });
        }
    }

    loadScript(urls) {
        if (typeof urls === 'string') urls = [urls];
        const head = document.getElementsByTagName('head')[0];
        for (const url of urls) {
            const jsScript = document.createElement('script');
            jsScript.src = this.formatURL(url);
            head.appendChild(jsScript);
            jsScript.onload = () => {
                if (!this.scripts) this.scripts = [];
                this.scripts.push(jsScript);
                if (urls.length === this.scripts.length) this.init();
            }
        }
    }

    synLoadScript(urls) {
        let tempUrls;
        if (typeof urls === 'string') {
            tempUrls = [urls];
        } else { 
            tempUrls = [];
            for(const item of urls) {
                tempUrls.push(item);
            }
        } 
        this._synLoadScript(tempUrls);
    }

    _synLoadScript(urls) {
        const head = document.getElementsByTagName('head')[0];
        const jsScript = document.createElement('script');
        jsScript.src = this.formatURL(urls[0]);
        //head.appendChild(jsScript);
        head.insertBefore(jsScript,head.childNodes[0]);
        jsScript.onload = () => {
            urls.splice(0,1);
            if(urls[0]) {
                if (!this.scripts) this.scripts = [];
                this.scripts.push(jsScript);
                this.synLoadScript(urls);
            } else {
                this.init();
            }
        }
    }

    loadHtml(url) {
        if (url instanceof Array) {
            url = url[0];
            console.warn('暂不支持一个插件包含多个界面');
        }
        const htmlObj = $.ajax({
            url: this.formatURL(url),
            dataType: 'html',
            async: false,
        });
        const start = htmlObj.responseText.indexOf('<body>') + 6;
        const end = htmlObj.responseText.indexOf('</body>');
        if (start < 6 || start > end) return;
        let htmlStr = htmlObj.responseText.substring(start, end);
        htmlStr = htmlStr.replace(/src=".\/\S*"/g, ($0) => {
            const fullUrl = this.formatURL($0.substring(5, $0.length - 1));
            return `src="${fullUrl}"`;
        });
        htmlStr = htmlStr.replace(/url\(('|"){0,1}.\/\S*('|"){0,1}\)/g, ($0) => {
            if (/^url\(('|")/.test($0))
                return `url(${this.formatURL($0.substring(5, $0.length - 2))})`;
            return `url(${this.formatURL($0.substring(4, $0.length - 1))})`;
        });
        if (htmlStr) {
            htmlStr = this._formatMessage(htmlStr);
            const parseHTML = $.parseHTML(htmlStr, true);
            for (const preHTML of parseHTML) {
                if ($(preHTML).attr('src')) {
                    $(preHTML).attr('src', this.formatURL($(preHTML).attr('src')));
                } else if ($(preHTML).attr('href')) {
                    $(preHTML).attr('href', this.formatURL($(preHTML).attr('href')));
                }
            }
            $(this.container).append(parseHTML);
        }

    }

    _formatMessage(bodyStr) {
        return bodyStr.replace(varRegExp, (match, name) => this.getValue(name.replace(/(^\s*)|(\s*$)/g, '')));
    }


    _removeUI() {
       
        if (this.container) {
            const childs = this.container.childNodes;
            while (childs.length > 0) {
                this.container.removeChild(childs[childs.length - 1]);
            }
        }
        const head = document.getElementsByTagName('head')[0];
        if(this.link&&this.link.length>0){
            for (var i = 0; i< this.link.length;i++) {
                if (this.link[i])
                    head.removeChild(this.link[i]);
            }
            this.link = [];
        }
        
        if(this.scripts&&this.scripts.length>0){
            for (var j=0;j<this.scripts.length;j++) {
                if (this.scripts[j])
                    head.removeChild(this.scripts[j]);
            }
            this.scripts = [];
        }
        
         
    }

    /**
     * 以插件目录为根目录获取文件网络路径
     * @param {string} file 相对插件目录的相对路径
     */
    formatURL(file) {
        //判断是否是网络路径
        if(file.startsWith('https:')) return file;

        // 没有比较就没有相对路径, 自己定义的路径认为绝对路径
        if (!this.url || this.url === null) return file;
        const tempUrl = file.split('/');
        const base = this.url.split('/');
        // 去掉末尾的‘/’
        if (base[base.length - 1] === '') base.pop();
        let res = '';
        for (let i = 0; i < tempUrl.length; i += 1) {
            if (i === 0 && tempUrl[i] === '.') i += 1;
            if (tempUrl[i] === '..') {
                base.pop();
            } else {
                base.push(tempUrl[i]);
            }
        }
        for (let i = 0; i < base.length; i += 1) {
            const sp = i === base.length - 1 ? '' : '/';
            res += base[i] + sp;
        }
        return res;
    }

    formatHostURL(file) {
        return window.location.origin ? window.location.origin + this.formatURL(file) : this.formatURL(file);
    }

    display(isshow) {
        if (isshow === false) {
            this.container.style.display = 'none';
        } else {
            const id = this.container.id;
            $(`#${id}`).attr('style', '');
        }
    }

}

export default Plugin

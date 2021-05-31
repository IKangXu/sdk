import Exception from './../Exception/Exception';
import ExceptionMessage from './../Exception/ExceptionMessage';
import * as warn from '../Exception/WarnException';
import Event from '../Core/Event';

import {
    $,
    jsonSyncPromise
} from '../core/Util';

/**
 * 插件管理类
 * 对继承自{@link Tool} 与 {@link Widget}的类进行管理
 * @param {Vewer} earth Cesium.Viewer 对象
 *  @example
 * //初始化插件
 *  let pluginManager = new Cesium.PluginManager(viewer);
 *  pluginManager.currentTool = 'xxx';
 */
class PluginManager extends Event {

    constructor(earth) {
        super()
        // 用来存放用户已经定制的插件信息
        this._centerPlugins = new Map();
        // 用来存放用户已经初始化（加载）了的widgets
        this._widgets = new Map();
        // 用来存放用户已经初始化（加载）了的tools
        this._tools = new Map();
        // 用来存放用户当前正在使用的tool
        this._currentTool = undefined;
        // 用来存放插件UI
        this._customUI = undefined;
        //当前工具变化事件
        this._toolChanged = undefined;

        this._earth = earth;
        earth.pluginManager = this;
        //this._earth.container = $(container);
        //if (earth.plugincenter) this._initCenter(earth.plugincenter);
        //this._initPlugins(initPlugins);
    }

    /**
     * 当前的工具
     * @type {Tool}
     * @example
     * //设置当前工具为空
     * earth.pluginManager.currentTool = '';
     * //设置当前工具为xxx工具（xxx为工具名称）
     * earth.pluginManager.currentTool = 'xxx';
     * //设置当前工具为xxxTool(xxxTool 为继承自Tool的工具对象)
     * earth.pluginManager.currentTool = xxxTool;
     * @example
     * //获取当前工具
     * var tempTool = earth.pluginManager.currentTool;
     */
    set currentTool(currentTool) {
        this._currentTool = this._setCurrentTool(currentTool);
    }

    get currentTool() {
        return this._currentTool;
    }

    /**
     * 当前工具变化事件
     * @param {Object} evt 当前工具变化事件
     * @example
     * //设置工具变化事件
     *  pluginManager.toolChanged = (tool)=>{
     *     console.log(tool.name)
     *  };
     */
    set toolChanged(evt) {
        this._toolChanged = evt;
    }

    /**
     * 设置当前插件UI面板
     * @type {string | object}
     */
    set customUI(panel) {
        let uiPanel;
        if (typeof (panel) === 'string') { // id
            uiPanel = document.getElementById(panel);
        } else {
            uiPanel = panel;
        }
        this._customUI = uiPanel;
    }

    /**
     * 根据名称获取plugin
     * @param {string} name 插件名称
     * @return {Plugin}
     */
    getPluginByName(name) {
        let realPlugin;
        realPlugin = this._widgets.get(name);
        if (!realPlugin) {
            realPlugin = this._tools.get(name);
            if (realPlugin) return realPlugin;
        }
        return realPlugin;
    }

    /**
     * 根据名称获取plugin信息
     * @param {string} name 插件名称
     * @return {object}
     */
    getPluginInfoByName(name) {
        return this._centerPlugins.get(name);
    }

    /**
     * 获取当前所有已经加载的plugins
     * @return {Array<Plugin>}
     */
    getInstalledPlugins() {
        const plugins = [];
        this._widgets.forEach((value) => {
            plugins.push(value);
        });
        this._tools.forEach((value) => {
            plugins.push(value);
        });
        return plugins;
    }

    /**
     * 获取所有的plugins信息
     * @return {Map}
     */
    getAllPlugins() {
        return this._centerPlugins;
    }


    /**
     * 添加插件
     * @param {Plugin|string} plugin 即将加载的插件
     * @return {Plugin}
     */
    addPlugin(plugin) {
        console.log('addPlugin: ', plugin);
        if (typeof (plugin) === 'string') plugin = this._centerPlugins.get(plugin);
        if (!plugin) {
            throw new Exception(ExceptionMessage.UNDEFINED_PLUGIN,
                ExceptionMessage.UNDEFINED_PLUGIN.type);
        }
        let realPlugin;
        switch (plugin.type) {
            case 'widget': // 挂件
                realPlugin = this._widgets.get(plugin.name);
                break;
            case 'tool': // 工具
                realPlugin = this._tools.get(plugin.name);
                break;
            default:
                throw new Exception(ExceptionMessage.UNDEFINED_PLUGIN_TYPE,
                    ExceptionMessage.UNDEFINED_PLUGIN_TYPE.type);
        }
        if (!realPlugin) {
            // 添加plugin <script pluginid=''>
            const pluginClass = this._appendScript(plugin.name, plugin.url, plugin.js);
            if (!pluginClass) {
                throw new Exception(ExceptionMessage.UNDEFINED_PLUGIN_TYPE,
                    ExceptionMessage.UNDEFINED_PLUGIN_TYPE.type);
            }
            // 添加DOM <div id='pluginDOM_of_plugin'></div>
            const panel = this._addRootDOM(plugin);
            if (!panel) return undefined;
            realPlugin = new(eval(pluginClass))({
                name: plugin.name,
                container: panel,
                url: plugin.url,
                js: plugin.js,
                type: plugin.type,
                img: plugin.img,
                earth: this._earth,
                language: plugin.language,
                parms: plugin.parms
            });
            this._add(realPlugin); // Add To Map
        } else {
            throw new Exception(ExceptionMessage.ADDED_PLUGIN,
                ExceptionMessage.ADDED_PLUGIN.type);
            // return undefined;
        }
        return realPlugin;
    }

    /**
     * 移除插件
     * @param  {Plugin|string} plugin 即将卸载的插件对象或名称
     */
    removePlugin(plugin) {
        // 根据info从Map中获取plugin
        let name;
        if (plugin) {
            if (typeof (plugin) === 'string') { // id
                name = plugin;
            } else if (plugin.name !== undefined) {
                name = plugin.name;
            } else {
                throw new Exception(ExceptionMessage.UNDEFINED_PLUGIN,
                    ExceptionMessage.UNDEFINED_PLUGIN.type);
            }
            let realPlugin = this._widgets.get(name);
            if (!realPlugin) realPlugin = this._tools.get(name);
            if (realPlugin) { // 查到即将删除的插件
                console.log('remove: ', realPlugin);
                this._remove(realPlugin); // remove from map
                // this._removeScript(realPlugin.name);  // remove <script>
                this._removeRootDOM(realPlugin); // remove DOM of pluginContainer
            } else {
                // throw new Exception(`${name} : ${ExceptionMessage.UNDEFINED_PLUGIN}`);
                throw new Exception(ExceptionMessage.UNDEFINED_PLUGIN,
                    ExceptionMessage.UNDEFINED_PLUGIN.type);
            }
        } else {
            throw new Exception(ExceptionMessage.UNDEFINED_PLUGIN,
                ExceptionMessage.UNDEFINED_PLUGIN.type);
        }

    }

    /**
     * 开启挂件
     * @param {Widget|string} widget 即将使用的挂件或挂件名称
     */
    openWidget(widget) {
        if (!widget) return;
        let name;
        if (typeof (widget) === 'string') { // id
            name = widget;
        } else {
            name = widget.name;
        }
        let realWidget = this._widgets.get(name); // 在已经加载了的插件列表里找到了该widget
        if (realWidget) {
            if (realWidget.isUsing === false) {
                realWidget._init();
                realWidget.isUsing = true;
            } else {
                console.warn(warn.WarnException(ExceptionMessage.USING_WIDGET));
            }
        } else { // 没有找到
            realWidget = this.addPlugin(name);
            if (realWidget) realWidget = this.usingWidget(realWidget);
        }
        // this.fire('usingWidget');
        return realWidget;
    }
    /**
     * 关闭widget
     * @param {Widget|string} widget 即将关闭的挂件名称
     */
    closeWidget(widget) {
        if (!widget) return;
        let name;
        if (typeof (widget) === 'string') { // id
            name = widget;
        } else {
            name = widget.name;
        }
        const realWidget = this._widgets.get(name);
        if (realWidget) {
            realWidget._remove();
            realWidget.isUsing = false;
        }
        // this.fire('unusingwidget');
    }

    /*
     * 设置当前激活Tool
     * @param {Tool} tool 即将使用的工具
     */
    _setCurrentTool(tool) {
        this.fire('setCurrentTool', tool);
        let name;

        if (!tool) { // 如果传入的值是undefined，则关闭currentTool
            this._turnOffTools();
            if (this._toolChanged)
                this._toolChanged(undefined);
            return undefined;
        }
        if (typeof (tool) === 'string') { // id
            name = tool;
        } else {
            name = tool.name;
        }
        let realTool = this._tools.get(name);

        if (realTool) { // 找到该tool
            if (this._currentTool) {
                this._currentTool._remove();
                this._currentTool.isCurrentTool = false;
            }
            realTool._init();
            if (this._toolChanged)
                this._toolChanged(realTool);
        } else {
            if (this._widgets.get(name)) {
                console.warn(warn.WarnException(ExceptionMessage.IS_WIDGET_NOT_TOOL));
                return undefined;
            }
            // 在插件列表中没有找到该tool
            realTool = this.addPlugin(name);
            if (realTool) realTool = this._setCurrentTool(realTool);
        }
        if (realTool) realTool.isCurrentTool = true;
        return realTool; // currentTool 保持不变
    }


    /*
     * 初始化用户已经定制的插件
     */
    _initCenter(url) {
        if (!url) return; // 说明没有 配置 插件中心
        const json = jsonSyncPromise(url).responseJSON;
        if (!json) return; // 插件中心获取消息失败
        // 我这里只会管是否是插件中心以及本地
        const data = json.results;
        this._centerPlugins = new Map();
        for (const i in data) {
            this._centerPlugins.set(data[i].name, data[i]);
        }
        // console.log(data);
        this._data = data;
    }

    /*
     * 初始化：加载默认插件
     * @param initPlugins {tool: [{id: ''}...], widget: [{id: ''}...]}
     */
    _initPlugins(initPlugins) {
        const plugins = []; // [{id, type}...]
        const centers = this._centerPlugins;
        if (initPlugins.tool && initPlugins.tool.constructor === Array)
            initPlugins.tool.forEach((value) => {
                plugins.push({
                    id: value.id,
                    type: 'tool'
                });
            });
        else if (initPlugins.tool)
            plugins.push({
                id: initPlugins.tool.id,
                type: 'tool'
            });
        if (initPlugins.widget && initPlugins.widget.constructor === Array)
            initPlugins.widget.forEach((value) => {
                plugins.push({
                    id: value.id,
                    type: 'widget'
                });
            });
        else if (initPlugins.widget)
            plugins.push({
                id: initPlugins.widget.id,
                type: 'widget'
            });
        plugins.forEach((item) => {
            const pluginInfo = centers.get(item.id);
            if (pluginInfo) { // 从插件中心获取到该插件
                if (item.type !== pluginInfo.type) {
                    throw new Exception(ExceptionMessage.ERROR_PLUGIN_TYPE);
                }
                this.addPlugin(pluginInfo);
                if (pluginInfo.type === 'widget')
                    this.usingWidget(pluginInfo);
            } else { // 未能获取该插件
                throw new Exception(`${item.id} : ${ExceptionMessage.UNDEFINED_PLUGIN}`);
            }
        });
    }

    /*
     * 添加插件根节点
     * @param plugin {Object}
     */
    _addRootDOM(plugin) {
        let key = plugin.name;
        let container = null;
        if (plugin.customUI) {
            if (this._customUI) {
                container = this._customUI;
            } else {
                throw new Exception(ExceptionMessage.UNDEFINED_PLUGINPANEL);
            }
        } else {
            container = this._earth.container;
        }
        const isAdded = (id) => {
            if (container.hasChildNodes()) return;
            const children = container.childNodes;
            for (let i = 0; i < children.length; i += 1) {
                if (children[i].id === id) return true;
            }
            return false;
        };
        const pid = `${this._earth.container.id}_of_${key}`;
        if (isAdded(pid) === true) return undefined;
        const pluginDOM = document.createElement('div');
        pluginDOM.id = pid;
        if (!plugin.customUI)
            pluginDOM.style.position = 'relative';
        pluginDOM.style.top = '-100%';
        // pluginDOM.style.width = '0';
        pluginDOM.style.height = '0';
        container.appendChild(pluginDOM);
        return pluginDOM;
    }

    /*
     * 删除界面根节点
     * @param plugin {Object}
     */
    _removeRootDOM(plugin) {
        let key = plugin.name;
        let container = null;
        let containerID = this._earth.container.id;
        if (plugin.customUI) {
            if (this._customUI) {
                container = this._customUI;
            } else {
                throw new Exception(ExceptionMessage.UNDEFINED_PLUGINPANEL);
            }
        } else {
            container = document.getElementById(containerID);
        }
        const dom = document.getElementById(`${containerID}_of_${key}`);
        container.removeChild(dom);
        // for(let item of container.childNodes){
        //     if(item.id==dom.id){
        //         container.removeChild(dom);
        //         break;
        //     }
        // }

    }

    /*
     * 添加script标签
     * @param path 路径
     * @param fileName 插件文件名
     */
    _appendScript(plugin, path, fileName) {
        const container = this._earth.container;
        // 判断当前url的插件是否被引入
        const isAppended = (name) => {
            const scripts = document.getElementsByTagName('script');
            for (let i = 0; i < scripts.length; i += 1) {
                if (scripts[i].getAttribute('pluginId') === name) return true;
            }
            return false;
        };
        const script = document.createElement('script');
        script.setAttribute('pluginId', plugin);
        if (isAppended(plugin) === false) {
            const response = $.ajax({
                async: false,
                url: `${path}${fileName}.js`,
                dataType: 'text'
            });
            if (response.readyState === 4 && response.status === 200) {
                document.head.appendChild(script);
                script.innerHTML = response.responseText.replace('<br>', '\n');
                return fileName;
            }
            return undefined;
        }
        return fileName;
    }

    /*
     * 移除script标签
     * @param url 路径
     */
    _removeScript(plugin) {
        // 判断当前url的插件是否被引入
        const appendedScript = (name) => {
            const scripts = document.getElementsByTagName('script');
            for (let i = 0; i < scripts.length; i += 1) {
                if (scripts[i].getAttribute('pluginId') === name) return scripts[i];
            }
            return undefined;
        };
        const removeScript = appendedScript(plugin);
        if (removeScript)
            document.head.removeChild(removeScript);
        return this;
    }
    /*
     * 关闭所有tool
     */
    _turnOffTools() {
        if (this._currentTool) {
            this._currentTool._remove();
            this._currentTool.isCurrentTool = false;
        }

        this._currentTool = undefined;

    }

    /*
     * 加载插件实现
     * @param plugin
     */
    _add(plugin) {
        if (!plugin) return;
        switch (plugin.type) {
            case 'widget': // 挂件
                this._addToMap(plugin, this._widgets);
                break;
            case 'tool': // 工具
                this._addToMap(plugin, this._tools);
                break;
            default:
                throw new Exception(ExceptionMessage.UNDEFINED_PLUGIN_TYPE,
                    ExceptionMessage.UNDEFINED_PLUGIN_TYPE.type);
        }
        plugin._manager = this;
    }

    /*
     * 移除插件实现
     * @param plugin
     */
    _remove(plugin) {
        if (!plugin) return;
        switch (plugin.type) {
            case 'widget': // 挂件
                this._removeFormMap(plugin, this._widgets);
                break;
            case 'tool': // 工具
                this._removeFormMap(plugin, this._tools);
                break;
            default:
                break;
        }
        plugin._remove();
    }

    _removeFormMap(plugin, mapObject) {
        if (mapObject.has(plugin.key)) {
            mapObject.delete(plugin.key);
        }
        return this;
    }

    _addToMap(plugin, mapObject) {
        if (mapObject.has(plugin.key)) {
            throw new Exception(ExceptionMessage.ADDED_PLUGIN, ExceptionMessage.ADDED_PLUGIN.type);
        } else {
            mapObject.set(plugin.key, plugin);
        }
        return this;
    }

    toTags() {
        let widgets = '';
        let tools = '';
        this._widgets.forEach((item) => {
            if (item) {
                widgets += `<widget><id>${item.key}</id></widget>`;
            }
        });
        this._tools.forEach((item) => {
            if (item) {
                tools += `<tool><id>${item.key}</id></tool>`;
            }
        });
        return `<plugins>${widgets}${tools}</plugins>`;
    }

    toJson() {
        const plugins = [];
        this._widgets.forEach((item) => {
            if (item) {
                plugins.push({
                    widget: {
                        id: item.key
                    }
                });
            }
        });
        this._tools.forEach((item) => {
            if (item) {
                plugins.push({
                    tool: {
                        id: item.key
                    }
                });
            }
        });
        return plugins;
    }
}

export default PluginManager
/*
 * 作者：zhuwz
 * 日期：2018.11.22
 */

import Project from '../Project/Project'
import ImageResource from '../Global/ImageResource'
import Navigation from '../Utility/Navigation'
 
 
import EventHelper from "../Utility/EventHelper"
import GraphicLayer from "../Layer/GraphicLayer"
import DrawTool from "../Tools/Draw/DrawTool"
import Config from "../Utility/Config"
import Analysis from "../Analyze/Analysis"
import EnvEffects from "../EnvSystem/EnvEffects"
import CanvasRecorder from "../Utility/CanvasRecorder"
import PluginManager from "../Plugin/PluginManager"
import LicManager from "../LicManager/LicManager";

//import CesiumNavigation from "cesium-navigation-es6";
 

class Viewer extends Cesium.Viewer{

    /**
     * @param {Element} container 地球初始化的div元素
     * @param {Object} [options] 地图配置属性
     * @param {String} [options.baseLayerPicker=false] 基础影像
     */
    constructor(container, options) { 
       
        const defaultOptions ={
            shouldAnimate : true,
            animation:false,
            baseLayerPicker:false,
            fullscreenButton:false,
            vrButton:false,
            geocoder:false,
            homeButton:false,
            infoBox:false,
            sceneModePicker:false,
            navigation:true,
            timeline:false,
            navigationHelpButton:false,
            navigationInstructionsInitiallyVisible:false,
            imageryProvider: new Cesium.SingleTileImageryProvider({
                url: Config.baseMapUrl()
            }),
            contextOptions: {
                webgl: {
                    alpha: true,
                    depth: false,
                    stencil: true,
                    antialias: true,
                    premultipliedAlpha: true,
                    preserveDrawingBuffer: true, //通过canvas.toDataURL()实现截图需要将该项设置为true
                    failIfMajorPerformanceCaveat: true
                },
                allowTextureFilterAnisotropic: true
            }
        }

        if(!options) {
            options = defaultOptions;
        } else {
            for(var key in defaultOptions) {
                if(!Cesium.defined(options[key])) {
                    options[key] = defaultOptions[key];
                }
            }
        }
        if(options.globe==false)
            options.imageryProvider = undefined;


		//修改相机默认视角
        Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(73,13,135,53); 
	    //构造函数
        super(container, options);
        let result = LicManager.checkLicense();
        if(!result){
            this.destroy();
            return;

        }
         //导航控件
        var navOpts = {};
        // 用于在使用重置导航重置地图视图时设置默认视图控制。接受的值是Cesium.Cartographic 和 Cesium.Rectangle.
        navOpts.defaultResetView = Cesium.Rectangle.fromDegrees(80, 22, 130, 50);
        // 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
        navOpts.enableCompass= true;
        // 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件将不会添加到地图中。
        navOpts.enableZoomControls= true;
        // 用于启用或禁用距离图例。true是启用，false是禁用。默认值为true。如果将选项设置为false，距离图例将不会添加到地图中。
        navOpts.enableDistanceLegend= true;
        // 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
        navOpts.enableCompassOuterRing= true;
        // if(options.navigation)
        //        this.extend(NavigationMixin);
       
        //CesiumNavigation(this, options);
      
        this._container = Cesium.getElement(container); 
        this._drawTool = new DrawTool(this);
        this._navigation = new Navigation(this);     
        
        //初始化插件中心
        this._pluginManager = new PluginManager(this);
        this._project = new Project(this);      
        this._layerManager=this._project._layerManager;
        this._graphicLayer = new GraphicLayer(this);
        this._analysis = new Analysis(this);  
        this._envEffects = new EnvEffects(this);
        this._recorder = null;
        this._Config = new Config(this);

        this._init(); 
    }

    _init() {
        //禁止镜头穿地
        let self = this;
        this.camera.changed.addEventListener(function() {
            if(Cesium.GlobeSurfaceOption&&Cesium.GlobeSurfaceOption.underGround.enabled){
                return;
            }
            if (
                self.camera._suspendTerrainAdjustment &&
                self.scene.mode === Cesium.SceneMode.SCENE3D
            ) {
                self.camera._suspendTerrainAdjustment = false;
                self.camera._adjustHeightForTerrain();
            }
          });
          //隐藏底部
          document.getElementsByClassName("cesium-viewer-bottom")[0].style.display = "none";      
          
          let evt = new EventHelper(this);
          evt.registHotKey();
    }

    /**
     * 是否显示帧率
     * @type Boolean
     *
     * @default false
     */
    get FPS(){
        return  this.scene.debugShowFramesPerSecond;
    }
    set FPS(val){
        this.scene.debugShowFramesPerSecond = val;
    }

     /**
     * 三角网渲染模式
     * @type Boolean
     *
     * @default false
     */
    get wireframe(){
        return  this.scene.globe._surface.tileProvider._debug.wireframe;
    }
    set wireframe(val){
        this.scene.globe._surface.tileProvider._debug.wireframe = val;
        this.scene.requestRender();
    }

    /**
     * 获取录屏
     * @readonly
     */
    get recorder(){
        if(!this._recorder)
            this._recorder = new CanvasRecorder(this.canvas );
        return this._recorder;
    }
    
    /**
     * 获取导航控件
     * @readonly
     */
    get navigation(){
        return this._navigation;
    }

    /**
     * 获取粒子特效
     * @readonly
     */
    get envEffects(){
        return this._envEffects;
    }
 
     /**
     * 全屏
     */
    fullScreen(){
        this._navigation.ViewPort.fullScreen();   
    }

     /**
     * 退出全屏
     */
    exitFullScreen(){
        this._navigation.ViewPort.exitFullScreen()
    }
    /**
     * 鼠标位置挂件
     * @type {ViewPort} 
     * @readonly
     */
    get viewPort (){
        return this._navigation.ViewPort;
    }

    /**
     * 导出图片
     * @param {number} width 宽度
     * @param {number} height 高度
     * @return {string} base64格式的图片
     */
    exportImage(width,height){
       return this._navigation.ViewPort.exportImage(width,height);
    }

     /**
     * 鼠标位置挂件
     * @type {mousePosition} 
     * @readonly
     */
    get mousePosition(){
        return this._navigation.mousePosition;
    }
    /**
     * 场景管理器对象
     * @type {Project} 
     * @readonly
     */
    get project(){
        return this._project;
    }
    /**
     * 分析工具
     * @type {Analysis} 
     * @readonly
     */
    get analysis(){
        return this._analysis;
    }

    /**
     * 标绘工具
     * @type {DrawTool} 
     * @readonly
     */
    get drawTool(){
        return this._drawTool ;
    } 

    /**
     * 绘制多边形
     * @param {function} callback 绘制完成回调函数
     */
    trackPolygon(callback,clampToGround){
        return this._graphicLayer.trackPolygon(callback,clampToGround);
    }

      /**
     * 绘制线
     * @param {function} callback 绘制完成回调函数
     */
    trackPolyline(callback,clampToGround){
        return this._graphicLayer.trackPolyline(callback,clampToGround);
    }

    /**
     * 清空绘制的对象
     */
    clearGraphic(){
        return this._graphicLayer.clear();
    }

    /**
     * 图层管理对象
     * @param {LayerManager}
     * @readonly
     */
    get layerManager(){
        return this._layerManager;
    }


     /**
     * 插件管理器对象
     * @type {PluginManager} 
     * @readonly
     */
    get pluginManager() {
        return this._pluginManager;
    }
    set pluginManager(val) {
        return this._pluginManager = val;
    }

    /**
     * 添加插件
     * @param  {Plugin|Object|string} plugin  要添加的插件或者插件中心中的插件名称或者自己定义插件配置
     * @return {Plugin}      返回插件
     */
    addPlugin(plugin) {
        if (!this._pluginManager) return undefined;
        return this._pluginManager.addPlugin(plugin);
    }

    /**
     * 移除插件
     * @param  plugin {CTMap.Plugin|string} 插件名称或者插件信息
     */
    removePlugin(plugin) {
        if (!this._pluginManager) return undefined;
        return this._pluginManager.removePlugin(plugin);
    }

    /**
     * 当前工具变化事件
     * @param  evt {Object} 当前工具发生变化时间
     */
    set currentToolChanged(evt) {
        this._toolChanged = evt;
    }

    /**
     * 移除插件
     * @param  plugin {CTMap.Plugin|string} 插件名称或者插件信息
     */
    removePlugin(plugin) {
        if (!this._pluginManager) return undefined;
        return this._pluginManager.removePlugin(plugin);
    }

    /**
     * 使用某个挂件
     * @param {CTMap.Widget|string} widget 挂件名称或者挂件信息
     * @return {Widget} 返回挂件
     */
    openWidget(widget) {
        if (!this._pluginManager) return undefined;
        return this._pluginManager.usingWidget(widget);
    }

    /**
     * 不使用某个挂件
     * @param {CTMap.Widget|string} widget 挂件名称或者挂件信息
     */
    closeWidget(widget) {
        if (!this._pluginManager) return undefined;
        return this._pluginManager.unusingWidget(widget);
    }

    /**
     * 设置当前工具
     * @param {CTMap.Tool|string} tool 工具名称或者工具信息(当参数为空时关闭所有工具)
     * @return {CTMap.Tool} 返回工具
     */
    setCurrentTool(tool) {
        if (!this._pluginManager) return undefined;

        this._pluginManager.currentTool = tool;
        this._pluginManager.fire('setCurrenTool', tool);
        if (this._toolChanged)
            this._toolChanged(tool);
        return this._pluginManager.currentTool;
    }

    /**
     * 获取当前工具
     * @return {CTMap.Tool} 返回工具
     */
    getCurrentTool() {
        return this._pluginManager ? this._pluginManager.currentTool : undefined;
    }

    /**
     * 获取已加载插件
     * @return {Array<Plugin>} 返回插件数组
     */
    getInstalledPlugins() {
        if (!this._pluginManager) return undefined;

        return this._pluginManager.getInstalledPlugins();
    }

    /**
     * 根据名称获取已加载插件
     * @return {Plugin} 返回插件
     */
    getPluginByName(name) {
        if (!this._pluginManager) return undefined;
        return this._pluginManager.getPluginByName(name);
    }

 

     /**
     * 定位
     * @param {number} lon 经度
     * @param {number} lat 纬度
     * @param {number} alt 高度
     * @param {number} duration 动画时间
     * 
     */
    goto(lon,lat,alt,duration){
       return  this._navigation.goto(lon,lat,alt,duration);
    } 

     /**
     * 加载工程
     * @param {String|URL} data 场景文件
     * @param {function} callback 场景加载回调函数
     * 
     */
    loadProject(data,callback){
        return this.project.load(data,callback);
    } 
     /**
     * 保存工程
     *  
     * @return {string} 场景文件
     */
    saveProject(){
        return this.project.save();
    }

     /**
     * 创建工程
     *  
     * @return {string} 场景文件
     */
    createProject(){
        return this.project.create();
    }

    /**
     * 父容器
     * @param {Element}
     * @readonly
     */
    get container () {
        return this._container;
    }
  

    /**
     * 设置背景底图
     * @param {ImageResource} resource 底图类型
     *  
     */
    setBaseImage(resource) {
        this.project._layerManager.setBaseImage(resource);
    }
 
}

export default Viewer

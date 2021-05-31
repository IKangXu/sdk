
import SceneConfig from "../Utility/Config"
import layerManager from "../Layer/LayerManager"
import drawTool from '../Tools/Draw/DrawTool'
import flyManager from '../Tools/flyManager/flyManager'
import bookmarkManager from "../Tools/BookmarkManager/BookmarkManager"
 
 
class Project{


    /**
     * 工程类
     *
     * @alias Project
     * @constructor
     *
     * @param {Object} viewer viewer对象
     * 
     *
     */
    constructor(viewer){
        this.viewer = viewer;
        //图层管理类
        this._layerManager = new layerManager(this.viewer);
        //标绘管理类
        this._drawTool = this.viewer.drawTool;
        //飞行管理类
        this._flyManager = new flyManager(this.viewer);
        //场景配置类
        this._config = new SceneConfig(this.viewer);
        //书签管理类
        this._bookmarkManager = new bookmarkManager(this.viewer);
        //工程文件
        this._prjData = {};
    } 

    
    
    _getPrjInfo(name){
        return {
            "version": "V1.0",
            "id": Cesium.createGuid(),
            "classify": { },
            "name": name,
            "description": "",
            "tags": [],
            "author": "管理员",
            "thumbnail": "缩图路径",
            "date": new Date().getTime(),
            "view":{

            },
            "layers":{},
            "bookmarks":{},
            "plottings":{},
            "sceneConfig":{                

            }    

        }
       
    } 
    /**
     * 书签管理工具
     * @return {BookmarkManager}} 书签管理工具
     */
    get bookmarkManager(){
        return this._bookmarkManager;
    }
 
     /**
     * 加载工程
     * @param  {Object|string} data  要打开的工程，可以是json对象或url地址
     * @param {function}   callback 场景加载回调函数
     */
    load(data,callback){
        var promise = data;
        if (typeof data === 'string' || (data instanceof Cesium.Resource)) {
            data = Cesium.Resource.createIfNeeded(data);
            promise = data.fetchJson(); 
        }
        let that = this;
        return Cesium.when(promise, (json)=> {
            return that._loadPrjData(that,json,callback);
        }).otherwise((error)=> {
            if(callback)
                callback(error);
        });

        
    }
    _loadPrjData(project,data,callback){
        //   let  projectData = JSON.parse(project);
        project._prjData = data;
        let sceneData = data;
        //1、加载场景配置
        project._config.fromJSON(sceneData.sceneConfig);
        //2、加载图层
        project._layerManager.fromJSON(sceneData.layers);
       // 3、加载标绘
       project._drawTool.fromJSON(sceneData.plottings,true);
       // 4、加载飞行路径
       //todo       
       // 5、加载书签 
       project._bookmarkManager.fromJSON(sceneData.bookmarks);
      //6、加载初始视角
      project.viewer.viewPort.fromJSON(sceneData.view);       
       if(callback)
            callback("ok");
        return true;
    }

    /**
     * 保存工程
     * 
     * @return {Object} 返回保存的结果， JSON格式
     */
    save(name){
        let prjData = this._getPrjInfo(name); 
        prjData.view=this.viewer.viewPort.toJSON();
        prjData.sceneConfig = this._config.toJSON();
        prjData.layers = this._layerManager.toJSON();
        prjData.bookmarks = this._bookmarkManager.toJSON();
        prjData.plottings = this._drawTool.toJSON();
        prjData.flyPaths = {};

        return prjData;

    }


    /**
     * 创建工程
     *
     * @return {Boolean} 返回创建结果，是否成功
     */
    create(){
        this._layerManager.removeAll();
        this._bookmarkManager.removeAll();
        this._drawTool.removeAll();
        this.viewer.navigation.ViewPort.gotoHome();        
    }

    /**
     * 用户自定义数据
     *
     * @return {Object} 返回用户数据
     */
    get userData(){

        return this._prjData.userData;

    }

    /**
     * 用户自定义数据
     * @param  {Object} data 用户数据
     */
    set userData(data){
        this._prjData.userData = data;
    }

    /**
     * 获取场景版本
     *
     * @return {string} 返回场景版本
     */
    get version(){
        return this._prjData.version;
    } 
    /**
     * 工程名称
     * 
     * @return {string} 返回名称
     */
    get name(){
        return this._prjData.name;
    }
    /**
     * 工程名称
     * @param  {String} val 工程名称
     */
    set name(val){
        this._prjData.name = val;
    }

    get description(){
        return this._prjData.description;

    }

    set description(val){
        this._prjData.description = val
    } 
    
    
}

export default  Project
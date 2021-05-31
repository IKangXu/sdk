import GroupLayer from './GroupLayer'
import ImageLayer from './ImageLayer'
import VectorLayer from './VectorLayer'
import ModelLayer from './ModelLayer'
import LayerType from '../Enums/LayerType';
import TerrainLayer from './TerrainLayer'
import TerrainLayerList from './TerrainLayerList'

class LayerManager {

    constructor(viewer) {
        this.earth = viewer;
        this._layerDataSet = new Map();
        this._rootGroup = [{
                id: "userLayers",
                name: "用户图层",
                show: true,
                type: LayerType.Group,
                children: []
            },
            {
                id: "modelLayers",
                name: "模型图层",
                show: true,
                type: LayerType.Group,
                children: []
            }, {
                id: "vectorLayers",
                name: "矢量图层",
                show: true,
                type: LayerType.Group,
                children: []
            },
            {
                id: "imageLayers",
                name: "基础影像",
                show: true,
                type: LayerType.Group,
                children: []
            }, {
                id: "terrainLayers",
                name: "地形图层",
                show: true,
                type: LayerType.Group,
                children: []
            }

        ];
        this._layerList = Cesium.clone(this._rootGroup, true) ;
        this.imageryLayers = this.earth.imageryLayers;
        this.dataSources = this.earth.dataSources;
        this.primitives = this.earth.scene.primitives;
        this._terrainLayerList = null;
    }

    //默认图层组
    get rootGroup() {
        return Cesium.clone(this._rootGroup, true) ;
    }
    set rootGroup(val) {        
        this._rootGroup = val;
        this.removeAll();
    }

    /**
     * addRoot 创建根节点图层组
     * @param {string} name 图层组名称
     */
    addRoot(name) {
        if (name) {
            let config = new GroupLayer(name).config;
            this._layerList.push(config);
            return config;
        }
    }

    /**
     * addLayer 移除图层
     * @param {string} pid 图层的父节点id
     * @param {Object} config  图层配置信息
     * 
     * @example
     * 
     * //加载地形默认参数
     * var terrainLayer = viewer.LayerManager.addLayer("pid",{
     *      name : '地形图层', 
     *      type:"CesiumTerrain",   
     *      options:{ 
     *          url:""
     *      },
     * });
     * //加载地形图层
     * var terrainLayer = viewer.LayerManager.addLayer("pid",{
     *      name : '未命名', //默认值
     *      show:true,//默认值
     *      type:"CesiumTerrain",   
     *      options:{ 
     *          url:""
     *          requestVertexNormals:false,//默认值
     *          requestWaterMask:false//默认值
     *      },
     *      style:{
     * 
     *      }
     * });
     * 
     *  @example
     * //加载wms图层 默认参数
     * var wmsLayer = viewer.LayerManager.addLayer("pid",{
     *      name : 'WMS图层', //默认值
     *      type:"WMS",   
     *      options:{ 
     *          url:""
     *          layer:""  
     *      }
     * });
     * 
     * @example
     * //加载wms图层
     * var wmsLayer = viewer.LayerManager.addLayer("pid",{
     *      name : '未命名', //默认值
     *      show:true,//默认值
     *      type:"WMS",   
     *      options:{ 
     *          url:""
     *          layer:""  
     *          minimumLevel：0, //默认值
     *          maximumLevel:21,//默认值 
     *          tilingScheme:"GeographicTilingScheme"//默认值 
     *      },
     *      style:{
     *          alpha:1.0, //默认值
     *          brightness:1.0,//默认值
     *          contrast:1.0,//默认值
     *          hue	:0.0 ,//默认值
     *          saturation:1.0 ,//默认值
     *          gamma:1.0,//默认值
     *          colorToAlpha:undefined,//默认值
     *          colorToAlphaThreshold:0.004//默认值
     * 
     *      }
     * });
     * 
     *  @example
     * //加载矢量图层 默认参数
     * var terrainLayer = viewer.LayerManager.addLayer("pid",{
     *      name : 'GeoJSON图层', //默认值
     *      type:"GeoJSON",   
     *      options:{ 
     *          url:""
     *      }
     * });
     * 
     *  @example
     * //加载矢量图层
     * var terrainLayer = viewer.LayerManager.addLayer("pid",{
     *      name : '未命名', //默认值
     *      show:true,//默认值
     *      type:"GeoJSON",   
     *      options:{ 
     *          url:""
     *          clampToGround:false,////默认值
     *          stroke: Cesium.Color.HOTPINK,//默认值
     *          fill: Cesium.Color.PINK,//默认值
     *          strokeWidth: 3,//默认值
     *          markerSymbol: '?'//默认值
     *      },
     *      style:{
     * 
     *      }
     * });
     * 
     * @example
     * //加载倾斜模型图层   
     * var modelLayer = viewer.LayerManager.addLayer("pid",{
     *      name : '倾斜模型图层', //默认值
     *      type:"Cesium3DTile",   
     *      options:{ 
     *          url:""         
     *      }
     * });
     * @example
     * //加载倾斜模型图层   
     * var modelLayer = viewer.LayerManager.addLayer("pid",{
     *      name : '未命名', //默认值
     *      show:true,//默认值
     *      type:"Cesium3DTile",   
     *      options:{ 
     *          url:""     
     *          maximumScreenSpaceError:16,//默认值
     *          maximumMemoryUsage:512,//默认值
     *          debugColorizeTiles:false,//默认值
     *          debugWireframe:false,//默认值
     *          debugShowBoundingVolume:false,//默认值
     *          debugShowUrl:false,   //默认值     
     *         
     *      },
     *      style:{
     *         // 查看 Cesium3DTileStyle配置
     * 
     *      }
     * });
     * 
     * 
     * 
     * 
     */
    addLayer(pid, config) {
        let layerNode = this._findItem(pid);
        if (layerNode) {
            let layerData = this._initLayer(config);
            if(layerData){
                layerNode.children.push(layerData.config);
                this._layerDataSet.set(layerData.id, layerData);
                return layerData.config;
            }
            
        }else{
            console.log("无法找到父节点");
        }
    }

    
    /**
     * getAllLayer 获取所有图层
     * @return {Array} 图层节点集合
     */
    getAllLayer() {
        let layers = [];
        for(let item of this._layerList){
            let players = this._recurrenceLayer(item, []);
            layers = layers.concat(players);
        }
        return layers; 
    }

    /**
     * removeLayer 移除图层
     * @param {string} layerid 图层的id
     * @return {bool} 成功返回true,否则返回false
     */
    removeLayer(layerid) {
        let pnode = this._findParent(layerid);
        if(pnode){
            let lnode = this._findItem(layerid);
            if (lnode){
                this._removeLayer(pnode.id, layerid);
            } 
        }else{
            consloe.log("父节点不存在!");
        }
       
    }

    /**
     * getLayerVisible 获取图层的显隐状态
     * @param {string} layerid 图层的id
     * @return {bool} 图层是否显示
     */
    getLayerVisible(layerid) {
        let layer = this.getLayerDataByID(layerid);
        if (layer)
            return layer.show;
        else
            return false;
    }
    /**
     * setLayerVisible 设置图层的显隐状态
     * @param {string} layerid 图层的id
     * @param {visible} 图层是否显示
     */
    setLayerVisible(layerid, visible) {
        let layer = this.getLayerDataByID(layerid);
        if (layer) {
            layer.show = visible;
        }
        let layerCfg = this._layerDataSet.get(layerid);
        if(layerCfg.type == LayerType.CesiumTerrain){
            //地形图层需要特殊处理
            this.earth.terrainProvider = layer.show?layer.dataLayer:new Cesium.EllipsoidTerrainProvider();

        }
       
    }

    /**
     * getLayerName 获取图层的名称
     * @param {string} layerid 图层的id
     * @return {string} 图层名称
     */
    getLayerName(layerid) {
        let layer = this._layerDataSet.get(layerid);
        if (layer) {
            return layer.name;
        }

    }
    /**
     * setLayerName 设置图层的显隐状态
     * @param {string} layerid 图层的id
     * @param {string} 图层名称
     */
    setLayerName(layerid, newName) {
        let layer = this._layerDataSet.get(layerid);
        if (layer) {
            layer.name = newName;
        }
    }


    /**
     * layerExist 图层是否存在
     * @param {string} layerid 图层的id
     * @return {bool} 图层是否存在
     */
    layerExist(layerid) {
        let layer = this.getLayerDataByID(layerid);
        return layer ? true : false;
    }


    /**
     * getLayerConfig 获取图层配置信息
     * @param {string} layerid 图层的id
     * @param {return} config 图层配置信息
     */
    getLayerConfig(layerid) {
        return this.getLayerDataByID(layerid);  
    }

    /**
     * setLayerConfig 更新图层
     * @param {string} layerid 图层的id
     * @param {object} config 图层配置信息
     */
    setLayerStyle(layerid, style) {
        let layer = this.getLayerDataByID(layerid);
        if (layer) {
            layer.update(style);
        }
    }

     /**
     * setLayerConfig  获取图层配置
     * @param {string} layerid 图层的id
     * @return {object} config 图层配置信息
     */
    getLayerStyle(layerid) {
        let layer = this.getLayerDataByID(layerid);
        if (layer) {
            return layer.config.style;
        }
    }

    /**
     * getLayerById  获取图层对象
     * @param {string} layerid 图层的id
     * @return {object} config 图层配置信息
     */
    getLayer(layerid) {
        let layer = this.getLayerDataByID(layerid);
        if (layer) {
            return layer;
        }
    }

     /**
     * getParent  获取父节点对象
     * @param {string} layerid 图层的id
     * @return {object} config 图层配置信息
     */
    getParent(layerid) {
        let layer = this.getLayerDataByID(layerid);
        if (layer) {
            let parent =  this._findParent(layerid);
            if(!parent){
                console.log("父节点为空");                
            }else{
                return parent;
            }
        }
    }
      

     /**
     * flyToLayer  定位到图层
     * @param {string} layerid 图层的id
     */
    flyToLayer(layerid) {
        let layer = this.getLayerDataByID(layerid);
        if (layer) {
            this.earth.flyTo(layer.dataLayer);
        }
    }  

    /**
     * addGroup 创建新图层组
     * @param {string} pid 父节点id
     * @param {string} name 图层组名称
     */
    addGroup(pid, name) {
        let pnode = this._findItem(pid);
        if (pnode) {
            let config = new GroupLayer(name).config;
            pnode.children.push(config);
            return config;
        }
    }
    /**
     * removeGroup 移除图层组
     * @param {string} id 图层组的id
     */
    removeGroup(id) {
        let item = this._findItem(id);
        if (item.type !== LayerType.Group){
            console.log("节点不是图层组");
            return;
        }
        let parent =  this._findParent(id);
        if(!parent){
            console.log("父节点为空");
            return;
        } 
        //1.删除viewer中的图层         
        let layers = this._recurrenceLayer(item, []);
        layers.map(it => this._removeLayerData(it.id));
        //2.删除节点
        this._removeLayerConfig(parent.id,id); 
        return parent;
    }

    /**
     * setGroupName 设置图层组名称
     * @param {string} id 图层组的id
     * @param {string} newName 图层组的id
     */
    setGroupName(id,newName){
        let item = this._findItem(id);
        if(item)
            item.name = newName;
    }
    /**
     * removeGroup 移除图层组
     * @param {string} id 图层组的id
     * @return {string} 图层组的名称
     */
    getGroupName(id){
        let item = this._findItem(id);
        if(item)
            return item.name;
    }

    /**
     * setGroupVisible 移除图层组
     * @param {string} id 图层组的id
     * @return {string} show  
     */
    setGroupVisible(id,show){
        this._setGroupVisible(id,show);  
    }
    /**
     * getGroupVisible 移除图层组
     * @param {string} id 图层组的id
     */
    getGroupVisible(id){
        let item = this._findItem(id);
        if(item)
            return item.show;
    } 

    /**
     * removeAll 移除所有图层
     */
    removeAll() {
        //地形
        this.earth.terrainProvider = new Cesium.EllipsoidTerrainProvider();
        //影像
        //todo移除影像
        for(let kv of this._layerDataSet){
            let item = kv[1];
            let type = this._getLayerType(item.type);
            let dataLayer = item.dataLayer;
            switch (type) {
                case "terrian": {
                    //todo
                    // this.dataSources.remove(layerData);
                    break;
                }
                case "image": {
                    this.imageryLayers.remove(dataLayer);
                    break;
                }
                case "vector": {
                    this.dataSources.remove(dataLayer);
                    break;
                }
                case "model": {
                    this.primitives.remove(dataLayer);
                    break;
                }
            }
        } 
        this._layerDataSet = new Map();
        this._layerList =Cesium.clone(this._rootGroup, true) ;
    }

    /**
     * layerList 图层列表
     */
    get layerList() {
        return Cesium.clone(this._layerList, true);
    }

    //初始化图层管理
    fromJSON(layers) {
        this.removeAll();
        this._layerList = Cesium.clone(layers, true);
        this._addLayers(this._layerList);
    }

    toJSON() {
        return this._layerList;
    }

    //通过ID获取图层
    getLayerDataByID(id) {
        let rlayer;
        for (const [key, value] of this._layerDataSet) {
            if (value.id == id) {
                rlayer = value;
                break;
            }
        }
        return rlayer;
    }

    /***********************************************私有方法************************************************ */
    _setGroupVisible(id,show){
        let node = this._findItem(id);
        if(node.type == LayerType.Group){
            for(let item of node.children){
                this._setGroupVisible(item.id,show)
            }
            node.show=show;
        } 
        else{
            node.show = show;
        }
    }
    _removeLayerConfig(pid, layerid) {
        //移除图层节点
        let pnode = this._findItem(pid);
        if (pnode) {
            for (let i = 0; i < pnode.children.length; i++) {
                let lyrNode = pnode.children[i];
                if (layerid == lyrNode.id) {
                    pnode.children.splice(i, 1);
                    break;
                }
            }
        }

    }

    _removeLayerData(layerid) {
        let pLayer = this._layerDataSet.get(layerid);
        let type = this._getLayerType(pLayer.type);
        if (pLayer && type != LayerType.Group) {
            let layerData = pLayer.dataLayer;
            switch (type) {
                case "terrian": {
                    //todo
                    // this.dataSources.remove(layerData);
                    break;
                }
                case "image": {
                    this.imageryLayers.remove(layerData);
                    break;
                }
                case "vector": {
                    this.dataSources.remove(layerData);
                    break;
                }
                case "model": {
                    this.primitives.remove(layerData);
                    break;
                }
            }
            this._layerDataSet.delete(layerid);

        }
    }

    _removeLayer(pid, layerid) {
        this._removeLayerData(layerid);
        this._removeLayerConfig(pid, layerid);

    }
 
    _getAllLayernodes() {
        let layers = [];
        for (let i = 0; i < this._layerList.length; i++) {
            let nodes = this._recurrenceLayer(this._layerList[i], []);
            layers=layers.concat(nodes);
        }
        return layers;
    }

    _recurrenceLayer(node, layers) {
        if (node.type != LayerType.Group) {
            layers.push(node);
        } else {
            if (node.children) {
                for (let i = 0; i < node.children.length; i++) {
                    this._recurrenceLayer(node.children[i], layers)

                }
            }
        }
        return layers;
    }

    _recurrenceItem(node, id) {
        if (node.id == id)
            return node;
        else {
            if (node.children) {
                for (let i = 0; i < node.children.length; i++) {
                    let tnode = this._recurrenceItem(node.children[i], id);
                    if (tnode)
                        return tnode;
                }
            }

        }
    }

    _findItem(id) {
        let pnode;
        for (let i = 0; i < this._layerList.length; i++) {
            pnode = this._recurrenceItem(this._layerList[i], id);
            if (pnode)
                break;

        }
        return pnode;
    }

    _findParent(id) {
        let pnode = [];
        for (let i = 0; i < this._layerList.length; i++) {
           this._recurrenceParent(this._layerList[i], id,pnode);  
        }
        if(pnode.length>0)
            return pnode[0];
        else{
            return undefined;
        }
    }

    _recurrenceParent(pnode,id,result){
        if(pnode.type==LayerType.Group){
            for(let item of pnode.children){
                if(item.id ==id){
                    result.push(pnode);
                    break;
                }else{
                    if(item.type==LayerType.Group){
                        for(let lyr of pnode.children){
                            this._recurrenceParent(lyr,id,result)
                        }
                    }else{
                        if(item.id ==id){
                            result.push(pnode);
                            break;
                        }
                    }
                }
            }
        }      
    }

 
    _getLayerType(type) {
        let mtype = "";
        switch (type) {
            case LayerType.CesiumTerrain:
            case LayerType.VRWTerrain:
            case LayerType.ArcGISTerrain: {
                mtype = "terrian";
                break;
            }
            case LayerType.WMS:
            case LayerType.WMTS:
            case LayerType.TMS:
            case LayerType.SingleImage:
            case LayerType.UrlTemplate:
            case LayerType.TileGrid:
            case LayerType.ArcGIS: {
                mtype = "image";
                break;
            }
            case LayerType.CZML:
            case LayerType.GeoJSON:
            case LayerType.KML:
            case LayerType.VectorTile:
            case LayerType.SHP: {
                mtype = "vector";
                break;
            }
            //模型数据 
            case LayerType.Cesium3DTile:
            case LayerType.Custom3DTile:
            case LayerType.GLTF: {
                mtype = "model";
                break;
            }
            //组图层 
            case LayerType.Group: {
                mtype = "group";
                break;
            }

        }

        return mtype;

    }


    //影像图层
    _addImageLayer(config, isBaseImage = false) {
        let mLayer = new ImageLayer(config);
        let lData = mLayer.initLayer();
        if(lData){
            this.imageryLayers.add(lData);
            return mLayer;
        }
       
    }

    //矢量图层
    _addVectorLayer(config) {
        let mLayer = new VectorLayer(config);
        let lData = mLayer.initLayer();
        if(lData){
            this.earth.dataSources.add(lData);
            return mLayer;
        } 
    }


    //模型图层
    _add3DModelLayer(config) {
        let mLayer = new ModelLayer(config);
        let lData = mLayer.initLayer();
        if(lData){
            this.primitives.add(lData);
            return mLayer;
        } 

        
    }

    //地形图层
    _addTerrainLayer(config) {
        let mLayer = new TerrainLayer(config);
        let lData = mLayer.initLayer();
        if(lData){
            if(!this._terrainLayerList)
                this._terrainLayerList = new TerrainLayerList(this.earth);
            this._terrainLayerList.add(mLayer);
            //.earth.terrainProvider =  lData;
            return mLayer;
        } 
    }

    _initLayer(layerConfig) {
        let ctype = this._getLayerType(layerConfig.type);
        let layerData;
        switch (ctype) {
            //图层组
            case LayerType.Group: {
                break;
            }
            //地形数据
            case "terrian": {
                layerData = this._addTerrainLayer(layerConfig);
                break;
            }
            //影像数据
            case "image": {
                layerData = this._addImageLayer(layerConfig);
                break;
            }
            //矢量数据        
            case "vector": {
                layerData = this._addVectorLayer(layerConfig);
                break;
            }
            //模型数据 
            case "model": {
                layerData = this._add3DModelLayer(layerConfig);
                break;
            }

            default: {
                break;
            }
        }
        return layerData;
    }

    _addLayers(layers) {
        let lyrs = this._getAllLayernodes(layers);
        lyrs.map(item => {
            let layerData = this._initLayer(item);
            this._layerDataSet.set(layerData.id, layerData);
        })
    }

}


export default LayerManager;
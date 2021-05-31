

export default class TerrainLayerList  {

    //构造函数
    constructor(viewer) {
        this._terrainLayers = new Map();
        this._show =true;
        this._baseProvider = new Cesium.EllipsoidTerrainProvider();
        
        this.earth = viewer;
        this._initBaseTerrain(this._baseProvider);
        this.earth.terrainProvider = this._baseProvider;
    }


    _initBaseTerrain(provider){
        provider.requestTileGeometry= (x, y, level, request)=>{
            return this._getTerrainData(x, y, level, request);
        }
    }

    _getTerrainData(x, y, level, request){
        let selectionLayer = [];
        //筛选地形图层
        for(let item of this._terrainLayers){
           let isShow =  item[1].show;
           if(isShow){
                let available = item[1].dataLayer.getTileDataAvailable(x, y, level);
                if(available){
                    selectionLayer.push(item);
                }
           }
         }
        //对地形图层排序
        let layers =  selectionLayer.sort((a,b)=>{
             return  b[1].index -a[1].index;
         });
        if(layers.length>0)
            return layers[0][1].dataLayer.requestTileGeometry(x, y, level, request);
        else{
            return null;
        }
    }

    _reloadTerain(){
        this.earth.terrainProvider = this._baseProvider;
    }

  
    /**
     * 目标图层的显隐
     * @method show 
     * 
     * ```
     * 示例代码
     * targetLayer.show=false;
     * ```
     */
    get show() {
        return this._show;
    }
    set show(val) {
        this._show = val;
        for(let item of this._terrainLayers){
           item[1].show = val;
        }
        
    }

     /**
     * 添加目标对象
     * @method add 
     * @param  item 目标对象
     * @return 
     * 
     * ```
     * 示例代码
     * var tTarget = new GV.TargetItem("targetData.id",113.454,36.45,10000,0);
     *  targetLayer.add(tTarget);
     * 
     * ```
     */
    add(item) {
        this._terrainLayers.set(item.id,item);
        return item;
    }

     /**
     * 通过删除目标对象
     * @method remove 
     * @param  itemid 目标对象的id
     * @return 
     *  
     * ```
     * 示例代码
     *  targetLayer.remove("targetData.id");
     * 
     * ```
     */
    remove(itemid) {
        let item = this._terrainLayers.get(itemid);
        this._terrainLayers.delete(itemid);
      
       return item[1];
      
    }
  
    /**
     * 清空地形图层
     * @method removeAll 
     * @return {Boolean}
     *  
     * ```
     * 示例代码
     *  targetLayer.removeAll();
     * 
     * ```
     */
    removeAll() {        
        this._terrainLayers = new Map();

    }


 //#endregion


}

 

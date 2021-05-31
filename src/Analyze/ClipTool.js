 
import Config from "../Utility/Config"
/**
 * 挖地
 */
 class ClipTool {

    /**
     * 构造函数
     * @param viewer 地理画布
     */
    constructor(viewer) {
        this.viewer = viewer;
        this._height = 100;
        this.terrainClipPlan = null;
        this._path = [];
    }
 
    /**
     * 挖地路径（经纬高）
     */
    get polygon() {
        return this._path;
    }
    set polygon(value) {
        this._path = value;
        this.updateData();
    }
   
    /**
     * 高度
     */
    get height() {
        return this._height;
    }
    set height(value) {
        this._height = value;
        this.terrainClipPlan._height = value;
        this.updateData();
    }

    /**
     * 初始化挖地 
     * @param path 路径数据
     * @param height 挖坑深度
     * @param wallImg 坑壁图片
     * @param bottomImg 坑底图片
     */
    add(path, height = 100) {       
        if(!this.terrainClipPlan){
            this.terrainClipPlan = new TerrainClipPlane(this.viewer, {
                height: height,
                splitNum: 10000,
                wallImg:Config.getResource('Assets/Images/excavate_side_min.jpg'),
                bottomImg:  Config.getResource('Assets/Images/excavate_side_min.jpg')
            })
        }
        this._height = height;
        this.terrainClipPlan._height = height;
        this.path = path;
    }

    /**
     * 获取挖坑路径数据
     * @param path 挖坑路径
     */
    getPositionsData(path) {
        let array = [];
        for (let i = 0; i < path.length; i++) {
            let item = path[i];
            let lon = item.lon;
            let lat = item.lat;
            let alt = item.alt;
            let p = Cesium.Cartesian3.fromDegrees(lon, lat, alt);
            array.push({
                x: p.x,
                y: p.y,
                z: p.z
            });
        }
        return array;
    }

    /**
     * 每次设置属性之后需要刷新
     */
    updateData() {        
        this.terrainClipPlan.updateData(this.path);
    }

    /**
     * 清除
     */
    clear() {
        this.terrainClipPlan.clear();
    }
}

export default ClipTool
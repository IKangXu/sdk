 
import canvas2image from "./canvas2image"
import CrossChar from "./CrossChar"

class ViewPort {

     
    /**
     * 视角信息类
     *
     * @alias ViewPort
     * @constructor
     *
     * @param {Object} viewer viewer对象
     *
     */
    constructor(viewer) {
        this.viewer = viewer;
        this._defautduration = 3;
        this.crosChar = new CrossChar(this.viewer.container);
    }
    /**
     * 导出图片
     * @param  {number} width   宽度
     * @param  {number} height  高度
     * @return {string}      返回导出结果，Base64格式
     */
    exportImage(width,height) {
        this.viewer.render();
        let canvas = this.viewer.canvas;
        width = Cesium.defaultValue(width, canvas.width);
        height = Cesium.defaultValue(height, canvas.height);
        
        return canvas2image.convertToJPEG(canvas, width, height);
    }

    /**
     * 定位到主视图
     */
    gotoHome(){
        let geoPos = Cesium.Rectangle.center(Cesium.Camera.DEFAULT_VIEW_RECTANGLE);
        let position = Cesium.Cartesian3.fromDegrees(Cesium.Math.toDegrees(geoPos.longitude), Cesium.Math.toDegrees(geoPos.latitude), 8000000);
        this.viewer.camera.flyTo({
            destination: position,
        }); 
    } 
    /**
     * 获取默认视角飞行时间
     * @return  {number}   默认视角飞行时间
     */
    get defaultDuration(){
        return this._defautduration;
    }
    /**
     * 设置默认视角飞行时间
     * @param  {number} val  默认视角飞行时间
     */
    set defaultDuration(val){
        this._defautduration =val;
    }
    /**
     * 加载视角信息
     * @param {Object} viewpoint 视角信息
     */
    setCurrent(viewpoint) {
        let position = new Cesium.Cartesian3(viewpoint.position[0], viewpoint.position[1], viewpoint.position[2]);
        let orientation = viewpoint.orientation;
        this.viewer.camera.flyTo({
            destination: position,
            duration:viewpoint.duration?viewpoint.duration:3,
            orientation:{
                heading:orientation[0],
                pitch:orientation[1],
                roll:orientation[2],
            }
        });
 
    } 
    /**
     * 获取视角信息
     * @return {Object} 返回结果
     */
    getCurrent() {
        var viewer = this.viewer;
        let pos =  viewer.camera.position;
        var viewpoint = {
            position: [pos.x,pos.y,pos.z],
            duration:3,
            orientation:[viewer.camera.heading,viewer.camera.pitch,viewer.camera.roll]            
        };
        return viewpoint

    }


    /**
     * 获取场景中心点坐标
     *
     * @return {Object} 返回结果
     */
    getCenter() {
        let scene = this.viewer.scene;
        let globe = scene.globe;
        let point = this.pickCenterPoint(); 
        if (!point) {          
              let s = scene.camera.positionCartographic.clone();
              let l = globe.getHeight(s);
              s.height = l || 0,
            point = Cesium.Ellipsoid.WGS84.cartographicToCartesian(s);
        }
        return point;
    }

	pickCenterPoint() {
        let scene = this.viewer.scene;
        let canvas = scene.canvas;
        let globe = scene.globe;
        let camera = scene.camera;
		let center = new Cesium.Cartesian2(canvas.clientWidth / 2,canvas.clientHeight / 2);
		let ray = camera.getPickRay(center);
		return globe.pick(ray, scene) || camera.pickEllipsoid(center);
    }
    
    fullScreen(){
        Cesium.Fullscreen.requestFullscreen(this.viewer.scene.canvas)
    }

    exitFullScreen(){
        Cesium.Fullscreen.exitFullscreen()
    }

    toJSON(){
        return this.getCurrent();

    }
    fromJSON(json){
        let view = json;
        this.setCurrent(view);

    }



}

export default  ViewPort;

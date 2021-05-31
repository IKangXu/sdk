
import FlyAround from './FlyAround';
import ZoomControl from './ZoomControl';
import MousePosition from "./MousePosition"
import ViewPort from './ViewPort';
import ScenePick from './ScenePick';
import Config from '../Utility/Config';

class Navigation {

    /**
     * 三维视图导航类
     *
     * @alias Navigation
     * @constructor
     *
     * @param {Object} viewer viewer对象
     * 
     *
     */

    constructor(viewer) {
        this.viewer = viewer;
        Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(73, 13, 135, 53);

        this.FlyAround = new FlyAround(this.viewer);
        this.ZoomControl = new ZoomControl(this.viewer);
        this.ViewPort = new ViewPort(viewer);
        this._mousePosition = new MousePosition(viewer);
        this._cusorPosition = Cesium.Cartesian3.ZERO;
        this.initMouseCursor();
    }

    registHotKey(){
         document.addEventListener('keyup', function(e) {
             var flagName = getFlagForKeyCode(e.keyCode);
             if (typeof flagName !== 'undefined') {
                 flags[flagName] = false;
             }
         }, false);

    }

    initMouseCursor(){
        var self = this;
        var vec3 =  Cesium.Cartesian3;
        var imgCursor = Config.getResource("Assets/Images/naviCursor.png");
        this._naviCursor = this.viewer.entities.add({
            position: Cesium.Cartesian3.ZERO,
            billboard: {
                image: imgCursor,
                //height:36,
                //width:36,
                disableDepthTestDistance: 6e7
            },
            show: false
        });
        var evtHander = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
        var evtType = Cesium.ScreenSpaceEventType;
       
        evtHander.setInputAction(function(e) {
            self._cusorPosition =  ScenePick.pickPosition(self.viewer, e.endPosition);
        }, evtType.MOUSE_MOVE );

        evtHander.setInputAction(function(e) {
            var pos = ScenePick.pickPosition(self.viewer, e.position);
            if(pos){
                self._naviCursor._position._value =  vec3.clone(pos);
                self._naviCursor.show = true;                           
            }       
            self._naviCursorShowTime = null;    
        }, evtType.MIDDLE_DOWN);

        evtHander.setInputAction(function(e) {
            var pos = ScenePick.pickPosition(self.viewer, e.position);
            if(pos){
                self._naviCursor._position._value = vec3.clone(pos),
                self._naviCursor.show = true;
            }   
            self._naviCursorShowTime = null;            
        }, evtType.RIGHT_DOWN);

        evtHander.setInputAction(function(e) {
            self._naviCursor.show = false
        }, evtType.RIGHT_UP);
        evtHander.setInputAction(function(e) {
            self._naviCursor.show = false
        }, evtType.MIDDLE_UP);

        evtHander.setInputAction(function(e) {    
            self._naviCursor._position._value = self._cusorPosition?self._cusorPosition:Cesium.Cartesian3.ZERO;           
            self._naviCursor.show = true;         
            self._naviCursorShowTime =  new Date().getTime();
        }, evtType.WHEEL);

        this.viewer.clock.onTick.addEventListener(e=>{
            if (Cesium.defined(self._naviCursor) && self._naviCursor.show && Cesium.defined(self._naviCursorShowTime)) {
                new Date().getTime() - self._naviCursorShowTime > 200 && (self._naviCursor.show = !1)
            }
        })

    }

    fullScreen(){
        this.ViewPort.fullScreen();   
        
    }

    exitFullScreen(){
        this.ViewPort.exitFullScreen()
    }

    get crossChar(){
        return this.ViewPort.crosChar;
    }

    get mousePosition (){
        return this._mousePosition;
    }
    /**
     * 飞行定位
     * @param {number} lon 经度
     * @param {number} lat 纬度
     * @param {number} alt 高度
     * @param {number} duration 动画时间
     * 
     */
    goto(lon, lat, alt = 10000, duration = 3) {
        return this.viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(lon, lat, alt),
            duration: duration
        });
    }
    /**
     * 缩放定位
     * @param {number} lon 经度
     * @param {number} lat 纬度
     * @param {number} alt 高度
     * 
     */
    zoomTo(lon, lat, alt = 10000) {
        this.viewer.scene.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(lon, lat, alt)
        });
    }
    /**
     * 定位到默认视图 
     */
    home(){
        return this.viewer.camera.flyTo({
            destination:  Cesium.Camera.DEFAULT_VIEW_RECTANGLE
        });         
    }
    /**
     * 以镜头为中心点环视
     * @param {Cartesian3} position 中心点坐标
     * 
     */
    flyAround(position) {
        if (position)
            this.viewer.scene.camera.setView({
                destination: position
            });
        let centerPos =this.ViewPort.getCenter();
        return this.FlyAround.startFlyAround(centerPos);
    }

    /**
     * 以场景为中心点环视
     * @param {Cartesian3} position 中心点坐标
     * 
     */
    flyCenter(position) {
        if (position)
            this.viewer.scene.camera.setView({
                destination: position
            });
        let centerPos = this.ViewPort.getCenter();
        return this.FlyAround.startFlyCenter(centerPos);
    }
    /**
     * 停止环视
     */
    stopFly() {
        return this.FlyAround.stopFly();
    } 

    zoomIn() {
        this.ZoomControl.zoomIn();
    }

    zoomOut() {
        this.ZoomControl.zoomOut();
    }

    tiltUp() {

    }

    tiltDown() {

    }

    switch2D() {
        this.ZoomControl.resetView();
    }

    get undergroud() {

    }

    set undergroud(val) {

    }


    get lockView() {

    }

    set lockView(val) {

    }



}
export default Navigation;
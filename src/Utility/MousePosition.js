 import ScenePick from "./ScenePick"
 class MousePosition {

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
         this._show = false;
         this._init();
     }

     _init() {
         this._createUi();
         this._initEvent();
     }

     get show() {
         return this._show;
     }
     set show(val) {
         this._show = val;
         this.posPanel.style.display = val ? "block" : "none";
     }

     _initEvent() {
         var scene = this.viewer.scene;
         var camera = this.viewer.camera;
         let self = this;

         var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
         handler.setInputAction(function(movement) {
             if (!self._show)
                 return;
             var lon, lat, alt, x, y;
             //var cartesian = scene.pickPosition(movement.endPosition);   
             var cartesian = ScenePick.pickPosition(self.viewer, movement.endPosition);
             if (Cesium.defined(cartesian)) {
                 var ellipsoid = scene.globe.ellipsoid
                 var cartographic = ellipsoid.cartesianToCartographic(cartesian)
                 lon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(7);
                 lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(7);
                 alt = cartographic.height.toFixed(4);
                 var x = cartesian.x.toFixed(2);
                 var y = cartesian.y.toFixed(2);
             } else {
                 lon = "";
                 lat = "";
                 alt = "";
                 x = "";
                 y = "";
             }

             var cameraHeight = Cesium.Cartographic.fromCartesian(camera.position).height.toFixed(4);
             self.mousePosition.innerHTML = `经度: &nbsp;${lon} &nbsp; &nbsp; &nbsp; 纬度: &nbsp;${lat} &nbsp; &nbsp; &nbsp;  高程: &nbsp;${alt} &nbsp; &nbsp; &nbsp;横：&nbsp; ${x} 纵：&nbsp; ${y} &nbsp; &nbsp;镜头高度: &nbsp;${cameraHeight}`;
         }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
     }

     _createUi() {

         this.posPanel = document.createElement('div');
         this.posPanel.style.height = '26px';
         this.posPanel.style.width = '100%';

         this.posPanel.style.position = 'absolute';
         this.posPanel.style.bottom = '0px';
         this.posPanel.style.background = "#00000075";

         this.mousePosition = document.createElement('div');
         this.mousePosition.style.height = '26px';
         this.mousePosition.style.lineHeight = '26px';
         this.mousePosition.style.width = '850px';
         this.mousePosition.style.position = 'absolute';
         this.mousePosition.style.right = '60px';
         this.mousePosition.style.color = '#e9e9e9';
         this.mousePosition.style.textAlign = 'right';
         this.mousePosition.style.fontSize = '13px';
         this.mousePosition.style.fontFamily = '微软雅黑';
         this.mousePosition.style.textShadow = '2px 2px 2px #000;';

         this.posPanel.appendChild(this.mousePosition);
         this.viewer.container.appendChild(this.posPanel);

         this.posPanel.style.display = this._show ? "block" : "none";

     }

 }

 export default MousePosition;
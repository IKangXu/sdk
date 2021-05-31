
import ScenePick from "../Utility/ScenePick"
export default class GraphicLayer {

    constructor(viewer){
        this.viewer = viewer;
        var graphicDatasource =  new Cesium.CustomDataSource('graphicDatasource');
        this.viewer.dataSources.add(graphicDatasource);
        this.entitycollection = graphicDatasource.entities;
        this.retainEntity = true;
        this.clickEvt=null;
        this._lonlataltList = [];
        this._pointList = [];
        this.drawComplete = null;

        this._polygonShow = false;
        this._polylineShow = false;
        this._rectangleShow = false;

        this._initEvent();
    }
 
    trackPolygon(drawComplete,clampToGround){
        this.drawComplete =drawComplete;    
        this._polygonShow = true;
        this._polylineShow = false;
        this._rectangleShow = false;
        this._addEntity(clampToGround);
        this._isTrack=true;
        this.viewer.canvas.style.cursor = 'crosshair';
    }

    trackPolyline(drawComplete,clampToGround){
        this.drawComplete =drawComplete;       
        
        this._polygonShow = false;
        this._polylineShow = true;
        this._rectangleShow = false;

        this._addEntity(clampToGround);
        this._isTrack=true; 
        this.earth.canvas.style.cursor = 'crosshair';
    }

    clear(){
        this.entitycollection.removeAll();
        this._lonlataltList = [];
        this._pointList = [];
        this._isTrack=false;
        this.viewer.canvas.style.cursor = 'default'; 
    }

    _initEvent() {
        let scene = this.viewer.scene;
        let self = this;
        let handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        this.clickEvt=handler.setInputAction(function(event) {
            if(!self._isTrack)return;
          //var CarPosition = scene.pickPosition(event.position);
          var CarPosition = ScenePick.pickPosition(self.viewer,event.position);
            if(CarPosition){
                let cartographic = scene.globe.ellipsoid.cartesianToCartographic(CarPosition);
                let lat = Cesium.Math.toDegrees(cartographic.latitude);
                let lon = Cesium.Math.toDegrees(cartographic.longitude);
                let height = cartographic.height;
                self._pointList.push(CarPosition); 
                self._lonlataltList.push(lon,lat,height); 
                self.entitycollection.add({
                position:CarPosition,//Cesium.Cartesian3.fromDegrees(lon,lat,height),
                point: {
                  color: Cesium.Color.YELLOW,
                  heightReference:Cesium.HeightReference.CLAMP_TO_GROUND,
                  pixelSize: 8,
                  disableDepthTestDistance:Number.POSITIVE_INFINITY,

                }
              }); 
                
            }
        
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        //右键结束
        handler.setInputAction(function(event) {
            if(!self._isTrack)return;
            self._isTrack = false;   
            if(!self.retainEntity)
            self.clear();   
            if(self.drawComplete) 
                self.drawComplete(self._lonlataltList,self._pointList);
          }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

        
       
    }
    _addEntity(clampToGround = true){
        this.clear();
        this.entitycollection.add({
            polygon: {
                show:this._polygonShow,
                perPositionHeight:!clampToGround,
                hierarchy:new Cesium.CallbackProperty(()=>{
                    return new Cesium.PolygonHierarchy(this._pointList)
                }, false),
                material:Cesium.Color.DEEPSKYBLUE.withAlpha(0.7)
            },
            polyline: {
                show:this._polylineShow,
                clampToGround:clampToGround,
                positions:new Cesium.CallbackProperty(()=>{
                    return this._pointList;
                }, false),
                material:Cesium.Color.DEEPSKYBLUE,//Cesium.Color.DODGERBLUE
                width:2.0
            }    
    })

}


}

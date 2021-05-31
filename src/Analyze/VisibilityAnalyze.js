
class VisibilityAnalyze {
    
  /**
 * 通视分析构造函数
 * @method constructor
 * @param viewer Cesium.Viewer 对象
   * 
 */
constructor(viewer) {
  this._viewer = viewer;
  this._scene = viewer.scene;
  this._camera = this._scene.camera;
  this.context = this._scene.context; 
  this.entities=[];
  this.startAnalyze =false;
  this._showDome = true;
  this._offsetDist = 0.2;
  this.activeShapePoints =[];
  this.defaultOption ={
    terrainShadows:this._viewer.terrainShadows,
    depthTestAgainstTerrain:this._scene.globe.depthTestAgainstTerrain
  };
 
}


 /**
 * 是否显示视距 
   * 
 */
get showDistance(){
  return this._showDistance;
}
set showDistance(val){
  this._showDistance= val;

}

  /**
   * 高度偏移
   * 
   */
  get offsetDist() {
    return this._offsetDist;
  }
  set offsetDist(val) {
    this._offsetDist = val;

  }
 /**
 * 是否显示包围盒 
   * 
 */
get showDome(){
  return  this._showDome;
}
set showDome(val){
  this._showDome= val;

}

reset(){

}

 /**
 * 开始视域分析
 * @method open 
   * 
 */
open() {
  if (this.startAnalyze)
    return;
  // this.close();
  this._viewer.terrainShadows = Cesium.ShadowMode.ENABLED;
  this.testOn = this._scene.globe.depthTestAgainstTerrain;
  if (!this.testOn) {
    this._scene.globe.depthTestAgainstTerrain = true;
  }
  this._initialiseHandlers();
  this.startAnalyze = true;
}
  /**
 * 结束视域分析
 * @method close 
   * 
 */
close() {
  this.startAnalyze = false;
  this.cameraPosition = null;
 
 
  if (this.handler) {
    this.handler.destroy();
    this.handler = null;
  }

  if(this._scene.shadowMap)
      this._scene.shadowMap.enabled =false;

  //移除entity对象
  for(let item of this.entities){
      this._viewer.entities.remove(item);
    }
  this.entities = []; 
  this.viewPoint = undefined;
  this.pointLightCamera= undefined;

  this._viewer.terrainShadows = this.defaultOption.terrainShadows;
  this._scene.globe.depthTestAgainstTerrain =this.defaultOption.depthTestAgainstTerrain
}


 /**
 * 设置中心点及半径
 * @method setPosition 
   * 
 */
setPosition(point,distance) {
  var self = this;
  if(!this.viewPoint){
    this._scene.globe.depthTestAgainstTerrain = true;
    var showDome  = new Cesium.CallbackProperty(()=> {
      return self._showDome;
    }, false);

    var getPosition  = new Cesium.CallbackProperty(()=> {
      return self.viewPoint?self.viewPoint:new Cesium.Cartesian3();
    }, false);

        //视点Entity
        this.entities.push(this._viewer.entities.add({
          name : 'Dome',
          position: getPosition,
          ellipsoid : {
              radii :  new Cesium.Cartesian3(distance,distance,distance),
              maximumCone : Cesium.Math.PI_OVER_TWO,
              fill:false,
              show:showDome,
              outlineColor : Cesium.Color.WHITE.withAlpha(0.3),
              outlineWidth:4,
              slicePartitions:96,
              stackPartitions:96,
              outline : true
          }
        })); 
  }
  this.viewPoint = point;  
  this.distance = distance;
   this. _createViewShad(point);
  
}


//鼠标事件
_initialiseHandlers() { 
  this.handler = new Cesium.ScreenSpaceEventHandler(this._scene.canvas);
  this.handler.setInputAction((movement)=> {
    if (!this.startAnalyze)
      return;
    if (this.cameraPosition == null)
      return; 

      var newPos = this._scene.pickPosition(movement.endPosition);
      
      //更新位置
      if (Cesium.defined(newPos)) {  
        if(this.activeShapePoints.length!=1)           
          this.activeShapePoints.pop();
        this.activeShapePoints.push(newPos);  

        let distance = Cesium.Cartesian3.distance(this.activeShapePoints[0], this.activeShapePoints[1]);
        this.shadowMap._pointLightRadius =distance;

      }
     
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  this.handler.setInputAction( (movement) =>{      
    if (this.startAnalyze && this.cameraPosition == null) {
      var pos = this._scene.pickPosition(movement.position);
      if (pos) {
        //移除entity对象
          for(let item of this.entities){
            this._viewer.entities.remove(item);
          }
          this.entities = [];
          this.activeShapePoints =[];

          var ellipsoid=this._viewer.scene.globe.ellipsoid;
        
          var cartographic=ellipsoid.cartesianToCartographic(pos);
          var lat=Cesium.Math.toDegrees(cartographic.latitude);
          var lng=Cesium.Math.toDegrees(cartographic.longitude);
          var alt=cartographic.height + this._offsetDist;
  
          var newpos =  Cesium.Cartesian3.fromDegrees(lng,lat,alt);
 
          this.cameraPosition = newpos;
          this._createViewShad(newpos);
          this._addEntity(newpos);
          this.activeShapePoints.push(newpos);
      } 
    }

  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  this.handler.setInputAction( (movement) =>{
    this.startAnalyze = false;
    this.cameraPosition = null;
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

}

_addEntity(pos){
  let self = this;

  var dynamicPositions = new Cesium.CallbackProperty( () =>{
     
    return self.activeShapePoints;
  }, false);

  var endPoint = new Cesium.CallbackProperty(() =>{       
    return self.activeShapePoints[self.activeShapePoints.length-1];
  }, false);

  var distanceLabel = new Cesium.CallbackProperty(() =>{
    let distance = "";
    if(self.activeShapePoints.length>1){
      let dist = Cesium.Cartesian3.distance(self.activeShapePoints[0], self.activeShapePoints[1]);
      distance = "距离:"+dist.toFixed(2)+"米"; 
    }
    return distance;  

  }, false);

  var showDist  = new Cesium.CallbackProperty(()=> {
    return self._showDistance;
  }, false);

  var radii = new Cesium.CallbackProperty(() =>{
    let distance =  new Cesium.Cartesian3();
    if(self.activeShapePoints.length>1){
      let dist = Cesium.Cartesian3.distance(self.activeShapePoints[0], self.activeShapePoints[1]);
      distance =  new Cesium.Cartesian3(dist,dist,dist);
    }
    return distance;  

  }, false);

  var showDome  = new Cesium.CallbackProperty(()=> {
    return self._showDome;
  }, false);

 //视点Entity
 this.entities.push(this._viewer.entities.add({
  name : 'Dome',
  position: pos,
  ellipsoid : {
      radii : radii,
      maximumCone : Cesium.Math.PI_OVER_TWO,
      fill:false,
      show:showDome,
      outlineColor : Cesium.Color.WHITE.withAlpha(0.3),
      outlineWidth:4,
      slicePartitions:96,
      stackPartitions:96,
      outline : true
  }
}));

//视点Entity
this.entities.push(this._viewer.entities.add({
    position: pos,
    point: {
      pixelSize: 12,
      color: Cesium.Color.YELLOW,
      disableDepthTestDistance :Number.POSITIVE_INFINITY
    }
  }));
//视距线entity
  this.entities.push(this._viewer.entities.add({
    polyline: {
      positions:dynamicPositions,
      show:showDist,
      width:2.0,
      clampToGround : false,
      material:Cesium.Color.LIME,
      disableDepthTestDistance :Number.POSITIVE_INFINITY,
      classificationType:Cesium.ClassificationType.NONE
    },
    
  }));

//距离label entity
  this.entities.push(this._viewer.entities.add({
    position:endPoint,
    label: {   
      show:showDist,
      text:distanceLabel,
      pixelOffset: new Cesium.Cartesian2(30, -50),
      scale: 0.5,
      font: '32px 微软雅黑',
      fillColor: Cesium.Color.DEEPSKYBLUE,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 1.0,
      showBackground: true,
      backgroundColor: Cesium.Color.BLACK.withAlpha(0.9),
      backgroundPadding: new Cesium.Cartesian2(10, 6),                  
      disableDepthTestDistance: Number.POSITIVE_INFINITY
    },
    
  }));

}


//创建shadowmap
_createViewShad(pos) {

  if(!this.pointLightCamera ){
    this.pointLightCamera = new Cesium.Camera(this._scene);
    this.pointLightCamera.position = pos; 
  this.shadowOptions = {
    context: this.context,
    enabled: true,
    isPointLight : true,
    lightCamera: this.pointLightCamera,
    maximumDistance: 500.0,
    cascadesEnabled: false
  };
  
  this._scene.shadowMap = new Cesium.ShadowMap(this.shadowOptions);
  var shadowMap = this._scene.shadowMap;
  shadowMap.enabled = true;
  shadowMap.debugShow = true;	
  shadowMap.maximumDistance =10000; 
  shadowMap._pointLightRadius = 1;
  shadowMap._fitNearFar = true;
  shadowMap.darkness = 0.3;
  shadowMap.debugShow = false;
  shadowMap.debugFreezeFrame = false;
  shadowMap.enabled = true;
  shadowMap.size = 1024;
  shadowMap.debugCascadeColors = false;
  shadowMap.softShadows = false;
  this.shadowMap = shadowMap;



  // Update render states for when polygon offset values change
  shadowMap.debugCreateRenderStates();
  // Force all derived commands to update
  shadowMap.dirty = true;

  if (this.normalShaderFun == null)
    this.normalShaderFun = Cesium.ShadowMapShader.createShadowReceiveFragmentShader;
  Cesium.ShadowMapShader.createShadowReceiveFragmentShader = (fs, shadowMap, castShadows, isTerrain, hasTerrainNormal)=> {
    return this._getUIShader( fs, shadowMap, castShadows, isTerrain, hasTerrainNormal);
  }

  }
  
  this.pointLightCamera.position = pos; 

  this.shadowMap._pointLightRadius = this.distance?this.distance:10;


}

//更新shader
_getUIShader(fs, shadowMap, castShadows, isTerrain, hasTerrainNormal){
  var shader = this.normalShaderFun(fs, shadowMap, castShadows, isTerrain, hasTerrainNormal);
  
 var colorFs = `if(visibility == 1.0){ 
          gl_FragColor.rgb *= vec3(0,1,0);  
        } else { 
          gl_FragColor.rgb *= vec3(1,0,0); ; 
        }
        ` 
    shader.sources[shader.sources.length - 1] = shader.sources[shader.sources.length - 1].replace('gl_FragColor.rgb *= visibility;', colorFs);
    return shader;

}

}


export default VisibilityAnalyze;
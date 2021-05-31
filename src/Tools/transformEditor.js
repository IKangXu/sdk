
import Config from "../Utility/Config"
class transformEditor {

     /**
	 * 位置编辑器 构造函数
	 * @method constructor
	 * @param scene Cesium.scene 对象
     * 
	 */
    constructor(scene){
        this.scene=scene;
        this._transformHandler= null;
        this._starting = false;
        this.axisModel = null;

        this._isLeftDown = false;
        this._meshName = null;
        this._primitive= null;
        this._tileset = null; 
        this._transformEditor_Axis="transformEditor_Axis";

    }

    /**
	 * 开始编辑位置
	 * @method start 
     * 
	 */
  start() {

    if(!this._transformHandler)
        this._transformHandler =new Cesium.ScreenSpaceEventHandler(this.scene.canvas);
    if (this._starting)
      return; 
    this._initialEvent();
    this._starting = true;
  }
    /**
	 * 结束编辑
	 * @method stop 
     * 
	 */
  stop() {
    this._starting = false; 
    //移除模型
    if(this.axisModel) 
        this.scene.primitives.remove(this.axisModel);
    //销毁事件
    if(!this._transformHandler)
        this._transformHandler.destroy();      
    this._ennableNavigation(true); 
  }



  get tileset(){
      return this._tileset;

  }
  set tileset(val){
    this._tileset = val;
    var scale = this._tileset.boundingSphere.radius; 
    this._addAXIS(val._root.transform,scale/8);      


   }

  //屏蔽场景控制器
  _ennableNavigation(enable){
    this.scene.screenSpaceCameraController.enableRotate = enable;
    this.scene.screenSpaceCameraController.enableTranslate = enable;
    this.scene.screenSpaceCameraController.enableZoom = enable;
    this.scene.screenSpaceCameraController.enableTilt =  enable;
    this.scene.screenSpaceCameraController.enableLook =  enable;
   }

  _initialEvent(){

    //鼠标点击事件
    this._transformHandler.setInputAction(data=>{
        this._handleClick(data);
    },Cesium.ScreenSpaceEventType.LEFT_CLICK);

    //鼠标双击事件
    this._transformHandler.setInputAction(data=>{
        this._handledbClick(data);
    },Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

    this._transformHandler.setInputAction(data=>{
        this._handleleftDown(data);    
    },Cesium.ScreenSpaceEventType.LEFT_DOWN);

    this._transformHandler.setInputAction(data=>{       
        this._handleleftUp(data);
    },Cesium.ScreenSpaceEventType.LEFT_UP);


    this._transformHandler.setInputAction(data=>{
        this._handleMove(data);
    },Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    
  }

  getOffSet(start,end,axis){
    var modelMatrix = this._tileset? this.tileset._root.transform:this._primitive.modelMatrix;
    var i = Cesium.Matrix4.inverseTransformation(modelMatrix, new Cesium.Matrix4)
    , n = this.scene.camera.position
    , r = Cesium.Matrix4.multiplyByPoint(i, n, new Cesium.Cartesian3)
    , o = Cesium.Matrix4.multiplyByPoint(i, start, new Cesium.Cartesian3)
    , a = Cesium.Matrix4.multiplyByPoint(i, end, new Cesium.Cartesian3)
    , c = Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(o, r, new Cesium.Cartesian3), new Cesium.Cartesian3)
    , d = Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(a, r, new Cesium.Cartesian3), new Cesium.Cartesian3)
    , h = Cesium.Plane.fromPointNormal(Cesium.Cartesian3.ZERO, axis)
    , f = new Cesium.Ray(r,c)
    , p = new Cesium.Ray(r,d)
    , m = Cesium.IntersectionTests.rayPlane(f, h)
    , g = Cesium.IntersectionTests.rayPlane(p, h);
  return {
      start: m,
      end: g
  }

  }

  _handleMove(a) { 
    if((!this._primitive&&!this._tileset)||!this._isLeftDown)
        return;
    var start = this.scene.pickPosition(a.startPosition);
    var end = this.scene.pickPosition(a.endPosition);
    var u = this._tileset? this.tileset._root.transform:this._primitive.modelMatrix;
  
    let self = this;

    var d = function(e, n, r) {
        var o =self.getOffSet(start,end,e)
          , a = Cesium.Cartesian3.subtract(o.end, o.start, new Cesium.Cartesian3);
        a[n] = 0,
        a[r] = 0;
        var newMatrix = Cesium.Matrix4.multiplyByTranslation(u, a, new Cesium.Matrix4);
        //console.log(self._primitive.modelMatrix);
        if(self._tileset){
            self.tileset._root.transform = newMatrix;
        }else{
            self._primitive.modelMatrix = newMatrix;
        }
        
        self.axisModel.modelMatrix = newMatrix;

       // console.log(self._primitive.modelMatrix);

    }

   var h = function(e, n, r) {
        var o =self.getOffSet(start,end,e)
          , a = (o.start[n] * o.end[r] - o.start[r] * o.end[n]) / (o.start[n] * o.end[n] + o.start[r] * o.end[r])
          , s = Cesium.Quaternion.fromAxisAngle(e, Math.atan(a))
          , l = Cesium.Matrix3.fromQuaternion(s)
          , d = Cesium.Matrix4.multiplyByMatrix3(u, l, new Cesium.Matrix4);
        if(self._tileset){
            self.tileset._root.transform = d;
        }else{
            self._primitive.modelMatrix = d;
        } 
          self.axisModel.modelMatrix =  d;
    };

    if ( this._meshName && end)
        this._ennableNavigation(false);
        switch (this._meshName) {
            case "YArrow_1":
                d(Cesium.Cartesian3.UNIT_Z, "y", "z");
                break;
            case "XArrow_1":
                d(Cesium.Cartesian3.UNIT_X, "x", "z");
                break;
            case "ZArrow_1":
                d(Cesium.Cartesian3.UNIT_Y, "x", "y");
                break;
            case "YAxis_1":
                h(Cesium.Cartesian3.UNIT_X, "y", "z");
                break;
            case "XAxis_1":
                h(Cesium.Cartesian3.UNIT_Y, "z", "x");
                break;
            case "ZAxis_1":
                h(Cesium.Cartesian3.UNIT_Z, "x", "y")
        }
}

_handleleftDown(t){
    this.scene.pickPosition(t.position);
    var i = this.scene.pick(t.position);
    if(Cesium.defined(i) && Cesium.defined(i.mesh)){
        this._meshName = i.mesh.name,
        this._isLeftDown = true;
        this._ennableNavigation (false);
    }  

}

_handleleftUp(t){  
        this._ennableNavigation (true);
        this._isLeftDown = false; 
        this._meshName = null; 

}
 
  _handleClick(e){
      if(!this._starting||this._tileset)
      return;
        var pickedObj = this.scene.pick(e.position);
        if (Cesium.defined(pickedObj) && pickedObj.primitive) {
            if(pickedObj.id === this._transformEditor_Axis)
                return;
            
            this._primitive = pickedObj.primitive;
           
            var scale = this._primitive.boundingSphere.radius;           
            this._addAXIS(this._primitive.modelMatrix,scale);              
        }
}
  _addAXIS(modelMatrix,scale){
      if(this.axisModel) 
                this.scene.primitives.remove(this.axisModel);
        this.axisModel= this.scene.primitives.add(Cesium.Model.fromGltf({
                url:Config.getResource('Assets/models/AXIS.gltf'),
                modelMatrix:modelMatrix,
                scale: scale,
                id:this._transformEditor_Axis,
                colorBlendMode: Cesium.ColorBlendMode.HIGHLIGHT
            }));

  }

  _handledbClick(){
   this.stop();
  }

  _translate (e, n, r) {
    var o = c(e)
      , a = Cesium.Cartesian3.subtract(o.end, o.start, new Cesium.Cartesian3);
    a[n] = 0,
    a[r] = 0;
    var s = Cesium.Matrix4.multiplyByTranslation(u, a, new Cesium.Matrix4);
    t.modelMatrix = s,
    i.modelMatrix = t.modelMatrix
}


}
export default transformEditor;
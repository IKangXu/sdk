/*
 * 作者：朱王璋
 * 部门：产品研发中心
 * 日期：2019.5.16
 */


 /**
 * 淹没分析工具
 */
class FloodAnalyze {

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
    this._color = Cesium.Color.RED.withAlpha(0.4);
    this._maxHeight = 3000;
    this._minHeight = 0;
    this._currentHeight=0;
    this._interpolation = 8;
    this._tickEvent = ()=>{
      this.updateGeometry();
    };
    this.flayer = null;
    this.pList = null;
    this.step = 1;
    
    
  }

 /**
   * 淹没速度
   * 
   */
  get speed() {
    return this.step;
  }
  set speed(val) {
    if(val<=0)
      return;
    this.step = val;

  }

  /**
   * 颜色设置 
   * 
   */
  get color() {
    return this._color;
  }
  set color(val) {
    this._color = val;

  }

  /**
   * 最大高度 
   * 
   */
  get maxHeight() {
    return this._maxHeight;
  }
  set maxHeight(val) {
    this._maxHeight = val;

  }

  /**
   * 最小高度
   * 
   */
  get minHeight() {
    return this._minHeight;
  }
  set minHeight(val) {
    this._minHeight = val;
  }


  /**
   * 设置淹没分析范围
   * @method setPolygon 
   * @param {array} ptList 点坐标数组,[经度,纬度,高度,.....]
   * @param {function} callBack 该区域内最低点和最高点的回调函数
   * 
   */
  setPolygon(plist,callBack) { 
     

    var positions = [];
    var lats =[];
    var lons = [];
    var alts = [];
    for(let i=0;i<plist.length;i+=3){
      lats.push(plist[i]);
      lons.push(plist[i+1]);
      alts.push(plist[i+2]);
      positions.push(Cesium.Cartographic.fromDegrees(plist[i], plist[i+1]));
    }

    //计算范围内的最大最小值
    var xmax =  Math.max.apply(null,lons);
    var xmin = Math.min.apply(null, lons);
    var ymax = Math.max.apply(null,lats);
    var ymin = Math.min.apply(null, lats);

    if(this._minHeight == 0){
        this._minHeight=Math.min.apply(null, alts);
    } 
    //获取点坐标
    var xstep = (xmax-xmin)/this._interpolation;
    var ystep = (ymax-ymin)/this._interpolation;
    for(var i=0;i<this._interpolation;i++){
      for(var j=0;j<this._interpolation;j++){
        var x = xmin +i*xstep;
        var y = ymin +j*ystep;
        positions.push(Cesium.Cartographic.fromDegrees(x, y));
      }
    } 

    var promise = Cesium.sampleTerrain(this._viewer.terrainProvider, 12, positions);
    Cesium.when(promise, function(updatedPositions) {
      if(callBack)
      callBack();
    });

    // var promise = Cesium.sampleTerrainMostDetailed(this._viewer.terrainProvider, positions);
    //   Cesium.when(promise, function(updatedPositions) {
    //     if(callBack)
    //       callBack();
    // }); 

    // Cesium.when(promise, function(updatedPositions) {
       
    // });
    this.pList = Cesium.Cartesian3.fromDegreesArrayHeights(plist);  

  }

  /**
   * 开始视域分析
   * @method start 
   * 
   */
  open() {
   
    this.startAnalyze = true; 
    this._viewer.clock.onTick.removeEventListener(this._tickEvent);
    this._viewer.clock.onTick.addEventListener(this._tickEvent); 
   
  }
  /**
   * 结束分析
   * @method stop 
   * 
   */
  close() {
    this.startAnalyze = false;
    //Bug，无法移除
    this._viewer.clock.onTick.removeEventListener(this._tickEvent);
    
    this._viewer.scene.primitives.remove(this.flayer);
    this._currentHeight =0;
  }
 
  updateGeometry(){
    let self = this;
    if(!self.startAnalyze)
    return;

    if(self._currentHeight<self._maxHeight){
      self._currentHeight+=self.step;
    }else{
      self.startAnalyze = false; 
      return;
    } 
  
    let maxHeight = self._minHeight+self._currentHeight;
    self._viewer.scene.primitives.remove(self.flayer);
    let geoInstance = self.creategeometry(self.pList,self._minHeight,maxHeight);      
    self.flayer = new Cesium.ClassificationPrimitive({
      allowPicking: false,
      geometryInstances: geoInstance,
      asynchronous:false

    });
    self._viewer.scene.primitives.add(self.flayer);
  }
 
  creategeometry(ptList, baseHeight, maxHeight) {
    return new Cesium.GeometryInstance({
      geometry: Cesium.PolygonGeometry.fromPositions({
        positions: ptList,
        height: baseHeight,
        perPositionHeight: false,
        extrudedHeight: maxHeight
      }),
      attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(this._color)
      }
    });
 
  } 

}


export default FloodAnalyze;

/*
 * 作者：朱王璋
 * 部门：产品研发中心
 * 日期：2019.5.16
 */


 /**
 * 控高分析工具
 */
class HeightAnalyze {
    /**
	 * 通视分析构造函数
	 * @method constructor
	 * @param viewer Cesium.Viewer 对象
     * 
	 */
  constructor(viewer) {
    this.viewer = viewer;
    this.config ={
      color:Cesium.Color.RED.withAlpha(0.7),
      height:400
    };
  } 


  
  get color (){
    return this.config.color;
  }
  set color (color){ 
      this.config.color =Cesium.Color.fromCssColorString(color);
      this.updateLayer();
  }

   /**
   * @method height
	 * 高度值   * 
   * @example 示例代码
   * ```
   *  var heightAnalyze = viewer.analysis.heightAnalyze;
   *  heightAnalyze.height = 400;
   *  heightAnalyze.open();
   * ```
   * 
	 */
  get height(){
    return this.config.height;
  }
  set height(val){
    this.config.height= val;
    this.updateLayer();
  }

  /**
   * 坐标点
   * @method setPolygon 
   * @param points 经纬度点坐标，格式:[经度,纬度,高度]
   * @example 示例代码
   * ```
   *  var heightAnalyze = viewer.analysis.heightAnalyze;
   *   heightAnalyze.height = 400;
   *   heightAnalyze.setPolygon([         
   *            109.0349381448271,34.31717633782572,386.9231637517154,109.03900961665003,
   *            34.321847375754345,397.67154065059685,
   *            109.03346632153671,34.326639657406226,395.4792360496345,
   *            109.03144059631933,34.32489928901451,390.96019381390937,
   *            109.0311066948082,34.323485025163286,388.67673695624234,
   *            109.03229719685534,34.31991103654269,385.82666822350035,
   *            109.03358048811168,34.31842706237503,386.4791369856086,
   *            109.03433018158603,34.31771892610954,387.5863231772101
   *        ]); 
   *  heightAnalyze.open();
   * ```
   * 
   */
  setPolygon(points){
    if(points.length<2)
      return;
    this._points =  Cesium.Cartesian3.fromDegreesArrayHeights(points); ;
    this.updateLayer();
  } 

   /**
   * 开始分析
   * @method open 
   */
  open() {
    this.updateLayer();
  }
  
  /**
	 * 结束视域分析
	 * @method close 
	 */
  close() {
    this.viewer.scene.primitives.remove(this._layer);    
  } 

  updateLayer(){
    this.viewer.scene.primitives.remove(this._layer);
    if(!this._points)return;
    let geoInstance = this.creategeometry(this._points);      
    this._layer = new Cesium.ClassificationPrimitive({
      allowPicking: false,
      geometryInstances: geoInstance,
      asynchronous:false

    });
    this.viewer.scene.primitives.add(this._layer);
  }
 
  creategeometry(ptList) {
    return new Cesium.GeometryInstance({
      geometry: Cesium.PolygonGeometry.fromPositions({
        positions: ptList,
        height: this.config.height,
        perPositionHeight: false,
        extrudedHeight: 1000000
      }),
      attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(this.config.color)
      }
    }); 
  } 
 
}

export default HeightAnalyze


 
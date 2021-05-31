
/*
 * 作者：朱王璋
 * 部门：产品研发中心
 * 日期：2019.5.16
 */

/**
 * 坡向分析工具
 */
 class Aspect {
  /**
	 * 构造函数
	 * @method constructor
	 * @param viewer Cesium.Viewer 对象
   * @example
    * //初始化工具
    *  let slope = new Cesium.Slope(viewer);
     * 
	 */
  constructor(viewer) {
    this.viewer = viewer;
    this._colorRamp = new Map();
  } 


   /**
   *  
	 * 颜色值
   * @return {Map} 颜色对象数组  
   * @example 示例代码
   * ```
   *  var slopeAnalyze = viewer.analysis.Slope;
   *  var colorRamp = slopeAnalyze.colorRamp;
   *  colorRamp.set(0.0,'#000000');
   *  colorRamp.set(0.2,'#2747E0');
   *  colorRamp.set(0.25,'#D33B7D');
   *  colorRamp.set(0.3,'#ffd700');
   *  colorRamp.set(0.35,'#D33038');
   *  colorRamp.set(0.9,'#ffffff');
   * ```
   * 
	 */ 
  get colorRamp(){
    return this._colorRamp;
  }
  /**
   * 坐标点
   * @method setPolygon 
   * @param points 经纬度点坐标，格式:[经度,纬度,高度]
   * @example 示例代码
   * ```
   *   var slopeAnalyze = viewer.analysis.Slope;
   *   slopeAnalyze.setPolygon([         
   *            109.0349381448271,34.31717633782572,386.9231637517154,109.03900961665003,
   *            34.321847375754345,397.67154065059685,
   *            109.03346632153671,34.326639657406226,395.4792360496345,
   *            109.03144059631933,34.32489928901451,390.96019381390937,
   *            109.0311066948082,34.323485025163286,388.67673695624234,
   *            109.03229719685534,34.31991103654269,385.82666822350035,
   *            109.03358048811168,34.31842706237503,386.4791369856086,
   *            109.03433018158603,34.31771892610954,387.5863231772101
   *        ]); 
   *  slopeAnalyze.open();
   * ```
   * 
   */
  setPolygon(points){
    if(points.length<2)
      return;
    this._points =  Cesium.Cartesian3.fromDegreesArrayHeights(points); ;
 
  } 

   /**
   * 开始分析
   * @method open 
   */
  open() {
    var material = Cesium.Material.fromType('AspectRamp');
    var shadingUniforms = material.uniforms;
    shadingUniforms.image = this.getColorRamp();   
    if(Cesium.GlobeSurfaceOption)   
      Cesium.GlobeSurfaceOption.setPolygon(this._points);
    this.viewer.scene.globe.material = material;    
  }
  
  /**
	 * 结束分析
	 * @method close 
	 */
  close() {
    this.viewer.scene.globe.material = undefined;
  } 
 
  getColorRamp(){
    var ramp = document.createElement('canvas');
    ramp.width = 100;
    ramp.height = 1;
    var ctx = ramp.getContext('2d');
    var grd = ctx.createLinearGradient(0, 0, 100, 0);
    for(let item of this._colorRamp){     
      grd.addColorStop(item[0], item[1]); //black
    }
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 100, 1);
    return ramp;

  }
 
}

export default Aspect
 

 
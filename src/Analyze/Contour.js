
/*
 * 作者：朱王璋
 * 部门：产品研发中心
 * 日期：2019.5.16
 */

/**
 * 等高线分析工具
 */
class Contour {
    /**
	 * 通视分析构造函数
	 * @method constructor
	 * @param viewer Cesium.Viewer 对象
     * 
	 */
  constructor(viewer) {
    this.viewer = viewer; 
    this._color =Cesium.Color.clone(Cesium.Color.RED);
    this._width = 2;
    this._spacing = 10;
    this._material = Cesium.Material.fromType('ElevationContour');
  } 


   /**
   * @method color
	 * 颜色值   
   * @example 示例代码
   * ```
   *  var contourAnalyze = viewer.analysis.contour;
   *  contourAnalyze.color = Cesium.Color.WHITE;
   * ```
   * 
	 */
  get color(){
    return this._material.uniforms.color;
  }

  set color(val){
    this._material.uniforms.color = val;
  }

   /**
   * @method width
	 * 宽度   
   * @example 示例代码
   * ```
   *  var contourAnalyze = viewer.analysis.contour;
   *  contourAnalyze.width = 4;
   * ```
   * 
	 */
  get width(){
    return this._material.uniforms.width;
  }

  set width(val){
    this._material.uniforms.width = val;
  }

   /**
   * @method spacing
	 * 等高距   
   * @example 示例代码
   * ```
   *  var contourAnalyze = viewer.analysis.contour;
   *  contourAnalyze.spacing = 4;
   * ```
   * 
	 */
  get spacing(){
    return this._material.uniforms.spacing;
  }
  set spacing(val){
    this._material.uniforms.spacing = val;
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
   * ```
   * 
   */
  setPolygon(points){
    if(points.length<2)
      return;
    this._points =  Cesium.Cartesian3.fromDegreesArrayHeights(points); ;
    this.open(); 
  } 

   /**
   * 开始分析
   * @method open 
   */
  open() { 
    var contourUniforms = this._material.uniforms;
    contourUniforms.width = this._width;
    contourUniforms.spacing = this._spacing;
    contourUniforms.color = this._color;
    if(Cesium.GlobeSurfaceOption)
      Cesium.GlobeSurfaceOption.setPolygon(this._points);
    this.viewer.scene.globe.material = this._material;
  }
  
  /**
	 * 结束分析
	 * @method close 
	 */
  close() {
    viewer.scene.globe.material = undefined;
  } 
   
 
}

export default  Contour


 
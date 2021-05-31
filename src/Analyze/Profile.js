
/*
 * 作者：朱王璋
 * 部门：产品研发中心
 * 日期：2019.5.16
 */

export default class Profile {
    /**
	 * 通视分析构造函数
	 * @method constructor
	 * @param viewer Cesium.Viewer 对象
     * 
	 */
  constructor(viewer) {
    this.viewer = viewer;
  } 
  /**
   * 坐标点
   * @method setPolyline 
   * @param {Array} points 经纬度点坐标，格式:[经度,纬度,高度]
   * @param {function} callback 经纬度点坐标，格式:[经度,纬度,高度]
   * @example 示例代码
   * ```
   * var callBack = function(result){
   *    console.log(result);
   * }
   *   var ProfileAnalyze = viewer.analysis.Profile;
   *   ProfileAnalyze.setPolyline([         
   *            109.03346632153671,34.326639657406226,395.4792360496345,
   *            109.03144059631933,34.32489928901451,390.96019381390937,
   *            109.0311066948082,34.323485025163286,388.67673695624234,
   *            109.03229719685534,34.31991103654269,385.82666822350035,
   *            109.03358048811168,34.31842706237503,386.4791369856086,
   *            109.03433018158603,34.31771892610954,387.5863231772101
   *        ],callBack); 
   *  slopeAnalyze.open();
   * ```
   * 
   */
  setPolyline(points,callback){
    if(points.length<2)
      return;

  } 

  caculatePoint(){
    
  }

   /**
   * 开始分析
   * @method open 
   */
  open() {
  
  }
  
  /**
	 * 结束分析
	 * @method close 
	 */
  close() {
    viewer.scene.globe.material = undefined;
  } 
 

 
}


 
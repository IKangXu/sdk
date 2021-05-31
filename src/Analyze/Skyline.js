
/*
 * 作者：朱王璋
 * 部门：产品研发中心
 * 日期：2019.5.16
 */

import EnvEffects from "../EnvSystem/EnvEffects"
import skylineOption from "../EnvSystem/Effect/SkylineOption"

class Skyline {
  /**
	 * 天际线分析构造函数
	 * @method constructor
	 * @param viewer Cesium.Viewer 对象
   * 
	 */
  constructor(viewer) {
    this.viewer = viewer;
    this.skylineOption = new skylineOption(viewer);
    this.effects = new  EnvEffects(viewer);
    
  } 
  
   /**
   * 开始分析
   * @method open 
   */
  open() {
    this.skylineEff = this.effects.addSkyline(this.skylineOption);
  }
  
  /**
	 * 结束分析
	 * @method close 
	 */
  close() {
    if(this.skylineEff)
       this.effects.removeEffect(this.skylineEff);
  } 
 

 
}

export default Skyline;


 
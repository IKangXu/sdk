/*
 * 作者：朱王璋
 * 部门：产品研发中心
 * 日期：2019.5.16
 */
import Slope from "./Slope"
import Aspect from "./Aspect"
import Contour from "./Contour"
import Elevation from "./Elevation"

import Profile from "./Profile"

import ViewshedAnalyze from "./ViewshedAnalyze"
import FloodAnalyze from "./FloodAnalyze"
import HeightAnalyze from "./HeightAnalyze"
import ClipTool from "./ClipTool"
import Measure from "../Tools/Measure/Measure";
import Skyline from "./Skyline";
import Underground from "./Underground"
import GroundClipping from "./GroundClipping"
import VisibilityAnalyze from "./VisibilityAnalyze"



/**
 * 分析工具类
 * 包括地形分析、模型分析等分析工具
 * @param {Vewer} viewer Viewer 对象
 *  @example
 * //初始化工具
 *  let analysis = new Cesium.Analysis(viewer);
 *  //坡向分析
 *  let slope = analysis.slope;
 */

class Analysis {

  /**
   * 通视分析构造函数
   * @method constructor
   * @param viewer Cesium.Viewer 对象
   * 
   */
  constructor(viewer) {
    this.viewer = viewer;
    this.toolList = new Map();
  }

  /**
   * 坡向分析 
   * @type {Aspect}
   * @returns {Aspect} 坡向分析工具
   */
  get aspect() {
    let tool = this.toolList.get("aspect");
    if (!tool) {
      tool = new Aspect(this.viewer);
      this.toolList.set("aspect", tool);
    }
    return tool;

  }

  /**
   * @method closeAll
   * 关闭所有分析工具 
   * 
   */
  closeAll() {
    for (let item of this.toolList) {
      let tool = item[1];
      if (item[0] == "measureTool") {
        tool.clearMeasure();
      } else {
        tool.close();
      }

    }
  }

  /**
   * 坡度分析 
   *  @type {Slope}
   *  @returns {Slope} 坡度分析工具
   */
  get slope() {
    let tool = this.toolList.get("slope");
    if (!tool) {
      tool = new Slope(this.viewer);
      this.toolList.set("slope", tool);
    }
    return tool;
  }

 
  /**
   * 等高线分析
   * @returns {Contour} 等高线分析工具
   */
  get contour() {
    let tool = this.toolList.get("contour");
    if (!tool) {
      tool = new Contour(this.viewer);
      this.toolList.set("contour", tool);
    }
    return tool;

  }

  /**
   * 高程渲染工具
   * @returns {Elevation} 高程渲染工具
   */
  get elevation() {
    let tool = this.toolList.get("elevaton");
    if (!tool) {
      tool = new Elevation(this.viewer);
      this.toolList.set("elevaton", tool);
    }
    return tool;

  }

  /**
   * 剖面分析
   * @returns {Profile} 剖面分析工具
   */
  get profile() {
    let tool = this.toolList.get("profile");
    if (!tool) {
      tool = new Profile(this.viewer);
      this.toolList.set("profile", tool);
    }
    return tool;


  }

  /**
   * 淹没分析 
   *  @returns {Flood} 淹没分析工具
   */
  get flood() {
    let tool = this.toolList.get("floodAnalyze");
    if (!tool) {
      tool = new FloodAnalyze(this.viewer);
      this.toolList.set("floodAnalyze", tool);
    }
    return tool;


  }

  /**
   * 控高分析 
   * @returns {HeightAnalyze} 控高分析工具
   */
  get heightAnalyze() {
    let tool = this.toolList.get("heightAnalyze");
    if (!tool) {
      tool = new HeightAnalyze(this.viewer);
      this.toolList.set("heightAnalyze", tool);
    }
    return tool;

  }

  /**
   * 通视分析 
   * @returns {ViewshedAnalyze} 通视分析工具
   */
  get viewshedAnalyze() {
    let tool = this.toolList.get("viewshedAnalyze");
    if (!tool) {
      tool = new ViewshedAnalyze(this.viewer);
      this.toolList.set("viewshedAnalyze", tool);
    }
    return tool;
  }


  /**
   * 测量工具 
   * @returns {MeasureTool} 测量工具
   */
  get measureTool() {
    let tool = this.toolList.get("measureTool");
    if (!tool) {
      tool = new Measure(this.viewer);
      this.toolList.set("measureTool", tool);
    }
    return tool;
  }


  /**
   * 裁剪工具 
   *  @returns {ClipTool} 裁剪工具
   */
  get clipTool() {
    let tool = this.toolList.get("clipTool");
    if (!tool) {
      tool = new ClipTool(this.viewer);
      this.toolList.set("clipTool", tool);
    }
    return tool;
  }

  /**
   * 天际线分析 
   *  @returns {Skyline} 天际线分析工具
   */
  get skyline() {
    let tool = this.toolList.get("skyline");
    if (!tool) {
      tool = new Skyline(this.viewer);
      this.toolList.set("skyline", tool);
    }
    return tool;
  }

  /**
   * 地下模式 
   * @returns {Underground} 地下模式
   */
  get underground() {
    let tool = this.toolList.get("underground");
    if (!tool) {
      tool = new Underground(this.viewer);
      this.toolList.set("underground", tool);
    }
    return tool;
  }

  /**
   * 地形开挖
   * @returns {GroundClipping} 地形开挖工具
   */
  get groundClip() {
    let tool = this.toolList.get("groundClip");
    if (!tool) {
      tool = new GroundClipping(this.viewer);
      this.toolList.set("groundClip", tool);
    }
    return tool;
  }
  /**
   * 点面通视分析 
   *  * @returns {VisibilityAnalyze} 点面通视分析
   */
  get visibilityAnalyze() {
    let tool = this.toolList.get("visibilityAnalyze");
    if (!tool) {
      tool = new VisibilityAnalyze(this.viewer);
      this.toolList.set("visibilityAnalyze", tool);
    }
    return tool;
  }


}

export default Analysis;
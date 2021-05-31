/*
 * 作者：朱王璋
 * 部门：产品研发中心
 * 日期：2019.5.16
 */



class WallMaterial {

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
   * @method closeAll
   * 关闭所有分析工具 
   * 
   */
  closeAll(){
    for(let item of this.toolList ){
      let tool = item[1];
      if(item[0]=="measureTool"){
        tool.clearMeasure();
      }else{
        tool.close();
      }
      
    }
  }

  /**
   * 坡度分析 
   * 
   */
  get slope() {
    let tool = this.toolList.get("slope");
    if(!tool){
      tool = new Slope(this.viewer);
      this.toolList.set("slope",tool);
    } 
    return tool;
  }


  /**
   * 坡向分析 
   * 
   */
  get aspect() {
    let tool = this.toolList.get("aspect");
    if(!tool){
      tool = new Aspect(this.viewer);
      this.toolList.set("aspect",tool);
    } 
    return tool;
    
  }

  
  /**
   * 等高线分析
   * 
   */
  get contour() {
    let tool = this.toolList.get("contour");
    if(!tool){
      tool = new Contour(this.viewer);
      this.toolList.set("contour",tool);
    } 
    return tool; 
   
  }

  get elevation() {
    let tool = this.toolList.get("elevaton");
    if(!tool){
      tool = new Elevation(this.viewer);
      this.toolList.set("elevaton",tool);
    } 
    return tool; 
   
  }

  /**
   * 剖面分析
   * 
   */
  get profile() {
    let tool = this.toolList.get("profile");
    if(!tool){
      tool = new Profile(this.viewer);
      this.toolList.set("profile",tool);
    } 
    return tool; 

    
  }
 
  /**
   * 淹没分析 
   * 
   */
  get flood() {
    let tool = this.toolList.get("floodAnalyze");
    if(!tool){
      tool = new FloodAnalyze(this.viewer);
      this.toolList.set("floodAnalyze",tool);
    } 
    return tool; 

     
  }

  /**
   * 控高分析 
   * 
   */
  get heightAnalyze() {
    let tool = this.toolList.get("heightAnalyze");
    if(!tool){
      tool = new HeightAnalyze(this.viewer);
      this.toolList.set("heightAnalyze",tool);
    } 
    return tool;
 
  }

  /**
   * 通视分析 
   * 
   */
  get viewshedAnalyze() {
    let tool = this.toolList.get("viewshedAnalyze");
    if(!tool){
      tool = new ViewshedAnalyze(this.viewer);
      this.toolList.set("viewshedAnalyze",tool);
    } 
    return tool; 
  }


  /**
   * 测量工具 
   * 
   */
  get measureTool() {
    let tool = this.toolList.get("measureTool");
    if(!tool){
      tool = new Measure(this.viewer);
      this.toolList.set("measureTool",tool);
    } 
    return tool; 
  }


  /**
   * 裁剪工具 
   * 
   */
  get clipTool() {
    let tool = this.toolList.get("clipTool");
    if(!tool){
      tool = new ClipTool(this.viewer);
      this.toolList.set("clipTool",tool);
    } 
    return tool; 
  }

   /**
   * 天际线分析 
   * 
   */
  get skyline() {
    let tool = this.toolList.get("skyline");
    if(!tool){
      tool = new Skyline(this.viewer);
      this.toolList.set("skyline",tool);
    } 
    return tool; 
  }

   /**
   * 地下模式 
   * 
   */
  get underground() {
    let tool = this.toolList.get("underground");
    if(!tool){
      tool = new Underground(this.viewer);
      this.toolList.set("underground",tool);
    } 
    return tool; 
  }

   /**
   * 地下模式 
   * 
   */
  get groundClip() {
    let tool = this.toolList.get("groundClip");
    if(!tool){
      tool = new GroundClipping(this.viewer);
      this.toolList.set("groundClip",tool);
    } 
    return tool; 
  }
 

}
 
export default WallMaterial;
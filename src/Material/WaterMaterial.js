/*
 * 作者：朱王璋
 * 部门：产品研发中心
 * 日期：2019.5.16
 */



class WaterMaterial {

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
  FSWaterFace() {
    return 'varying vec3 v_positionMC;\n\
      varying vec3 v_positionEC;\n\
      varying vec2 v_st;\n\
      \n\
      void main()\n\
      {\n\
      czm_materialInput materialInput;\n\
      vec3 normalEC = normalize(czm_normal3D * czm_geodeticSurfaceNormal(v_positionMC, vec3(0.0), vec3(1.0)));\n\
      #ifdef FACE_FORWARD\n\
      normalEC = faceforward(normalEC, vec3(0.0, 0.0, 1.0), -normalEC);\n\
      #endif\n\
      materialInput.s = v_st.s;\n\
      materialInput.st = v_st;\n\
      materialInput.str = vec3(v_st, 0.0);\n\
      materialInput.normalEC = normalEC;\n\
      materialInput.tangentToEyeMatrix = czm_eastNorthUpToEyeCoordinates(v_positionMC, materialInput.normalEC);\n\
      vec3 positionToEyeEC = -v_positionEC;\n\
      materialInput.positionToEyeEC = positionToEyeEC;\n\
      czm_material material = czm_getMaterial(materialInput);\n\
      #ifdef FLAT\n\
      gl_FragColor = vec4(material.diffuse + material.emission, material.alpha);\n\
      #else\n\
      gl_FragColor = czm_phong(normalize(positionToEyeEC), material);\n\
      gl_FragColor.a = 0.5;\n\
      #endif\n\
      }\n\
      ';
}
 

}
 
export default WaterMaterial;
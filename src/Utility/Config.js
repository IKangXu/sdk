 /*
  * 作者：zhuwz
  * 描述:场景配置类，用于配置场景初始化相关参数
  * 日期：2019.5.16
  */
 import Skybox from "./Skybox"
 const scriptRegex = /((?:.*\/)|^)CTMap[\w-]*\.js(?:\W|$)/i;
 class SceneConfig {
     constructor(viewer) {
         this.viewer = viewer;
         this.Skybox = new Skybox(viewer);
         
     }
 
    static getBaseUrlFromCesiumScript() {
        var scripts = document.getElementsByTagName('script');
        for ( var i = 0, len = scripts.length; i < len; ++i) {
            var src = scripts[i].getAttribute('src');
            var result = scriptRegex.exec(src);
            if (result !== null) {
                return result[1];
            }
        }
        return undefined;
    }
     static baseMapUrl() {  
         return this.getResource('Assets/Images/baseMap/globe.jpg');
     }
     static getResource(res){
        let baseurl = this.getBaseUrlFromCesiumScript();
        return `${baseurl}/${res}`
     }
     static zoomDuration() {
         return 1;
     }

     fromJSON(config) {
         this.viewer.scene.mode = Cesium.defaultValue(config.sceneMode, Cesium.SceneMode.SCENE3D);
         //是否显示帧率
         this.viewer.scene.debugShowFramesPerSecond = Cesium.defaultValue(config.fps, false);
         //镜头最大最小缩放距离
         this.viewer.scene.screenSpaceCameraController.maximumZoomDistance = Cesium.defaultValue(config.maximumZoomDistance, Number.POSITIVE_INFINITY);
         this.viewer.scene.screenSpaceCameraController.minimumZoomDistance = Cesium.defaultValue(config.minimumZoomDistance, 1);
         //是否显示鼠标位置
         this.viewer.mousePosition.show = Cesium.defaultValue(config.mousePosition, false);
         //配置场景的亮度、对比度等参数
         if (config.bloomOpt) {
             let bloom = this.viewer.scene.postProcessStages.bloom;
             bloom.enabled = config.bloomOpt.enabled;
             let uniforms = config.bloomOpt.uniforms;
             bloom.uniforms.glowOnly = Boolean(uniforms.glowOnly);
             bloom.uniforms.contrast = Number(uniforms.contrast);
             bloom.uniforms.brightness = Number(uniforms.brightness);
             bloom.uniforms.delta = Number(uniforms.delta);
             bloom.uniforms.sigma = Number(uniforms.sigma);
             bloom.uniforms.stepSize = Number(uniforms.stepSize);
         }
         //场景抗锯齿设置
         this.viewer.scene.postProcessStages.fxaa.enabled = Cesium.defaultValue(config.fxaa, false);
         //场景HDR设置
         this.viewer.scene.highDynamicRange = Cesium.defaultValue(config.highDynamicRange, true);

         //深度检测开关
         this.viewer.scene.globe.depthTestAgainstTerrain = Cesium.defaultValue(config.depthTestAgainstTerrain, true)

     }

     toJSON() {
         let sceneConfig = {};
         sceneConfig.sceneMode = this.viewer.scene.mode;
         //是否显示帧率
         sceneConfig.fps = this.viewer.scene.debugShowFramesPerSecond;
         //镜头最大最小缩放距离
         sceneConfig.maximumZoomDistance = this.viewer.scene.screenSpaceCameraController.maximumZoomDistance;
         sceneConfig.minimumZoomDistance = this.viewer.scene.screenSpaceCameraController.minimumZoomDistance;
         //是否显示状态栏
         sceneConfig.mousePosition = this.viewer.mousePosition.show;
         //场景抗锯齿设置
         sceneConfig.fxaa = this.viewer.scene.postProcessStages.fxaa.enabled;
         //HDR开关
         sceneConfig.highDynamicRange = this.viewer.scene.highDynamicRange;
         //配置场景的亮度、对比度等参数
         let bloom = this.viewer.scene.postProcessStages.bloom;
         var uniforms = {
             glowOnly: bloom.uniforms.glowOnly,
             contrast: bloom.uniforms.contrast,
             brightness: bloom.uniforms.brightness,
             delta: bloom.uniforms.delta,
             sigma: bloom.uniforms.sigma,
             stepSize: bloom.uniforms.stepSize
         }
         sceneConfig.bloomOpt = {
             enabled: bloom.enabled,
             uniforms: uniforms
         };

         //深度检测开关
         sceneConfig.depthTestAgainstTerrain = this.viewer.scene.globe.depthTestAgainstTerrain;

         //天空盒
         //天空大气圈
         //地面大气圈

         return sceneConfig;

     }
 }


 export default SceneConfig;
 
 
import Config from "../Utility/Config"
class Skybox {
    /**
     * 场景配置类
     *
     * @alias Skybox
     * @constructor
     *
     * @param {Object} viewer viewer对象
     *
     */
    constructor(viewer) {
        this.viewer = viewer; 
       // this._setSkyBox();
         
    }
 
    _setSkyBox(){
        let viewer = this.viewer;
        let baseUrl = Config.getResource('Assets/Images/skybox/lantian/')
        this.lantianSkybox = new Cesium.SkyBox({
            nearGround: !0,
            sources: {
                positiveX: baseUrl+"posx.jpg",
                negativeX: baseUrl+"negx.jpg",
                positiveY: baseUrl+"posy.jpg",
                negativeY: baseUrl+"negy.jpg",
                positiveZ: baseUrl+"posz.jpg",
                negativeZ: baseUrl+"negz.jpg"
            }
        });
        this.defaultSkybox = viewer.scene.skyBox;
        viewer.scene.postRender.addEventListener(()=>{
            var e = viewer.camera.position;
            Cesium.Cartographic.fromCartesian(e).height < 23e4 ? (this.lantianSkybox && (viewer.scene.skyBox =this.lantianSkybox),
            viewer.scene.skyAtmosphere.show = !1) : (this.defaultSkybox && (viewer.scene.skyBox =this. defaultSkybox),
            viewer.scene.skyAtmosphere.show = !0);
        });

    }
  
    
}

export default  Skybox;

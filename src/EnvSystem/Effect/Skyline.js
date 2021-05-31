import PS from "../../Enums/PostProcessEffects"
  
class Skyline extends Cesium.PostProcessStage {

    constructor(skylineOption) {

        if (!Cesium.defined(skylineOption)) {
            console.error("skylineOption 未定义");
            return;
        } 
           
        let cameraPos = skylineOption.viewer.scene.camera.position;
        
        let skyline = { 
            fragmentShader: PS.FS_STROKE,
            uniforms: {
                height: function() {
                    return Cesium.Cartographic.fromCartesian(cameraPos).height
                },
                lineWidth: function() {
                    return skylineOption.width;
                },
                strokeType: function() {
                    return skylineOption.strokeType;
                },
                tjxColor: function() {
                    return skylineOption.color;
                },
                bjColor: function() {
                    return skylineOption.bjColor;
                },
                cameraPos: function() {
                    return cameraPos;
                },
                mbDis: function() {
                    return skylineOption.strokeDistance;
                }
            }
        } 
        super(skyline)
        
        this.skylineOption = skylineOption;       

    }

    
}

export default  Skyline 
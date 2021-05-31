import PostProcessEffects from"../../Enums/PostProcessEffects"

 class EffectSnow extends Cesium.PostProcessStage{

    constructor(scale){
      
        let _scale = Cesium.defaultValue(scale,1.0);
        let snow = { 
            fragmentShader: PostProcessEffects.FS_SNOW,
            uniforms: {
                u_scale:_scale
            }
        }
        super(snow)
        this._scale =_scale;
    }

    get scale(){
        return this._scale;
    }

    set scale(val){
        this._scale = val;
    }

}

export default  EffectSnow
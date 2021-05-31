


import EffectSnow from "./Effect/EffectSnow";
import EffectRain from "./Effect/EffectRain";
import EffectScan from "./Effect/EffectScan";
import EffectRadar from "./Effect/EffectRadar";
import EffectSkyline from "./Effect/Skyline"

/**
 * 对象绘制类
 */

class EnvEffects {

    /**
     * 粒子系统类
     *
     * @alias EnvEffects
     * @constructor
     *
     * @param {viewer}  viewer对象
     *
     */
    constructor(viewer){
        this.viewer = viewer;
        this._ParticleList = [];

    }

     /**
     * 添加特效.
     * @param {Object} effect 特效.
     *
     */
    addEffect(effect){
        var collection = this.viewer.scene.postProcessStages;
        collection.add(effect);
        if(effect instanceof EffectSnow||effect instanceof EffectRain)
            this._setFogAtmoshere();
       
    }

      /**
     * 删除特效.
     * @param {Object} effect 特效.
     *
     */
    removeEffect(effect){
        var collection = this.viewer.scene.postProcessStages;
        collection.remove(effect);
        if(effect instanceof EffectSnow||effect instanceof EffectRain)
            this._resetFogAtmoshere();
    }

      /**
     * 添加下雨特效.
     * @returns {Object} effect 下雨特效.
     *
     */
    addRain(){
        let rainEffect = new EffectRain();
        this.addEffect(rainEffect);
        return rainEffect;

    }
    /**
     * 添加下雪特效.
     * @returns {Object} effect 下雪特效.
     *
     */
    addSnow(){
        let snowEffect = new EffectSnow();
        this.addEffect(snowEffect);
        return snowEffect;
    }

      /**
     * 添加扫描特效.
     * @returns {Object} effect 扫描特效..
     *
     */
    addScan(cartographicCenter, maxRadius, scanColor, duration){
        let Scan = new EffectScan(this.viewer, cartographicCenter, maxRadius, scanColor, duration);
        this.addEffect(Scan);
        return Scan;

    }

   /**
     * 添加天际线特效.     
     * @param {skylineOpt} 天际线选项.
     * @returns {Object} effect天际线特效.
     *
     */
    addSkyline(skylineOpt){
        var  Skyline = new EffectSkyline(skylineOpt);
        this.addEffect(Skyline);
        return Skyline;        
    }


    /**
     * 添加雷达特效.
     * @returns {Object} effect雷达特效..
     *
     */
    addRadar(cartographicCenter, radius, scanColor, duration){
        let Radar = new EffectRadar(this.viewer, cartographicCenter, radius, scanColor, duration);
        this.addEffect(Radar);
        return Radar;        
    }

 
     /**
     * 移除所有特效.
     *
     */
    removeAll(){
        this.viewer.scene.postProcessStages.removeAll()
    }


    _setFogAtmoshere(){
        this.viewer.scene.skyAtmosphere.hueShift = -0.8;
        this.viewer.scene.skyAtmosphere.saturationShift = -0.7;
        this.viewer.scene.skyAtmosphere.brightnessShift = -0.33;
        this.viewer.scene.fog.density = 0.001;
        this.viewer.scene.fog.minimumBrightness = 0.8;
    }

    _resetFogAtmoshere(){
        this.viewer.scene.skyAtmosphere.hueShift = 0;
        this.viewer.scene.skyAtmosphere.saturationShift = 0;
        this.viewer.scene.skyAtmosphere.brightnessShift = 0;

        this.viewer.scene.fog.density = 2.0e-4;
        this.viewer.scene.fog.minimumBrightness = 0.1;
    } 

    
}

export default  EnvEffects
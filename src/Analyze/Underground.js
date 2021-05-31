

/*
 * 作者：zhuwz
 * 描述:地下模式
 * 日期：2019.5.16
 */
class Underground{ 

    constructor(viewer,option){
        this._viewer = viewer;
        var n = Cesium.defaultValue(option, {});
        this._depth = Cesium.defaultValue(n.depth, 500);
        this._alpha = Cesium.defaultValue(n.alpha,0.5);
        this.enable = Cesium.defaultValue(n.enable, false);
        let GlobeSurfaceOption = Cesium.GlobeSurfaceOption;
        this._underGroundOpt = GlobeSurfaceOption?GlobeSurfaceOption.underGround:undefined;

    }

    /**
     * 获取或设置地表透明度
     * @type number
     *
     * @default 0.5
     */
    get alpha(){
        return  this._alpha;
    }
    set alpha(val){
       this._alpha = val;
       this._updateImageryLayersAlpha(val);
    }


    /**
     * 地表透明深度
     * @type number
     *
     * @default 500
     */
    get depth(){
        return  this._depth;
    }
    set depth(val){
       this._depth = val;
       this._underGroundOpt.enableDepth = val;
    }
    
    _resetLayersAlpha(alphas){
        for (var t = this._viewer.imageryLayers._layers, i = 0, a = t.length; i < a; i++){
            t[i].alpha = alphas[i];
        }
    }
    _updateImageryLayersAlpha(alpha) {
        for (var t = this._viewer.imageryLayers._layers, i = 0, a = t.length; i < a; i++){
            t[i].alpha = alpha;
        }
           
    }
    _historyOpts() {
        var e = {};
        e.alpha =[];
        for (var t = this._viewer.imageryLayers._layers, i = 0, a = t.length; i < a; i++){
            e.alpha.push( t[i].alpha );
        }
        e.highDynamicRange = Cesium.clone(this._viewer.scene.highDynamicRange),
        e.skyShow = Cesium.clone(this._viewer.scene.skyAtmosphere.show),
        e.skyBoxShow = Cesium.clone(this._viewer.scene.skyBox.show),
        e.depthTest = Cesium.clone(this._viewer.scene.globe.depthTestAgainstTerrain),
        this._viewer.scene.globe._surface && this._viewer.scene.globe._surface._tileProvider && this._viewer.scene.globe._surface._tileProvider._renderState && (e.blending = Cesium.clone(this._viewer.scene.globe._surface._tileProvider._renderState.blending)),
        this._oldViewOpts = e
    }
    open() {
        if(!this._underGroundOpt){
            return;
        }
         
        if (!this._enable) {
            this._enable = true;
            this._historyOpts();
            this._updateImageryLayersAlpha(this._alpha);
            var e = this._viewer;  
   
            this._underGroundOpt.enableSkirt = true;           
            this._underGroundOpt.enabled = true;
            this._underGroundOpt.cullFace = null;
            this._underGroundOpt.enableDepth = this._depth;
			e.scene.globe.baseColor = new Cesium.Color(0, 0, 0, 0);			 
			e.scene.globe.depthTestAgainstTerrain = true;
			e.scene.highDynamicRange = false;
			e.scene.skyAtmosphere.show = false;
			e.scene.skyBox.show = false; 
        }
    }
    close() {
        if (this._enable) {
            this._enable = false;
            this._resetLayersAlpha(this._oldViewOpts.alpha);
            var e = this._viewer;       

            this._underGroundOpt.enableSkirt = false;           
            this._underGroundOpt.enabled = false;
            this._underGroundOpt.cullFace = undefined;

            e.scene.globe.depthTestAgainstTerrain = this._oldViewOpts.depthTest;
            e.scene.skyBox.show = this._oldViewOpts.skyBoxShow;
            e.scene.highDynamicRange = this._oldViewOpts.highDynamicRange;
            e.scene.skyAtmosphere.show = this._oldViewOpts.skyShow; 
        }
    }

    destroy(){
        delete this._viewer;
        delete this._alpha;
        delete this._depth;
        delete this._enable;
        delete this._oldViewOpts;
    }
     
 
}
export default Underground;

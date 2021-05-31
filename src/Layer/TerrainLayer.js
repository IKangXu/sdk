import LayerType from "../Enums/LayerType"
import baseLayer from "./BaseLayer"

export default class TerrainLayer extends baseLayer {
    constructor(config){
        super(config);
    }
    initLayer() { 
        let type = this.config.type;         
        let options = this.config.options;
        switch (type) {
            case LayerType.CesiumTerrain:
                {
                    this.dataLayer = new Cesium.CesiumTerrainProvider(options);       
                    break;
                }

            case LayerType.VRWTerrain:
                {
                    this.dataLayer = new Cesium.VRTheWorldTerrainProvider(options);
                    break; 
                }
            case LayerType.ArcGISTerrain:
                {
                    
                    break;

                }
        }
        return this.dataLayer;

    }

}

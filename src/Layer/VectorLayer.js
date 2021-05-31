import LayerType from "../Enums/LayerType"
import baseLayer from "./BaseLayer"

export default class VectorLayer extends baseLayer {
    constructor(config) {
        super(config);
    }
    initLayer() {
        let dataLayer;
        let type = this.config.type;
        let params = this.config.params;
        let options = this.config.options;
        switch (type) {
            case LayerType.CZML: {
                let provider = new Cesium.CzmlDataSource();
                dataLayer = provider.load(params.url,options);
                break;
            }
            case LayerType.GeoJSON: {
                let provider = new Cesium.GeoJsonDataSource();
                dataLayer = provider.load(params.url,options)
                break;

            }
            case LayerType.KML: {
                let provider = new Cesium.KmlDataSource();
                dataLayer = provider.load(params.url,options)
                break;

            }
            case LayerType.VectorTile: {

                break;

            }
            case LayerType.SHP: {

                break;

            }
        }

        return dataLayer;

    }

}

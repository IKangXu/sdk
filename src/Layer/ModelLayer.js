
import LayerType from "../Enums/LayerType"
import baseLayer from "./BaseLayer"
//import tile3Dlayer from './tile3DLayer'

class ModelLayer extends baseLayer {
    constructor(config){
        super(config); 
    }
    initLayer() {
        let type = this.config.type;

        let style = this.config.style;
        this._checkDefStyles(style);

        let options = this.config.options; 
        switch (type) {
            case LayerType.Cesium3DTile:
                {
                    this.dataLayer  = new Cesium.Cesium3DTileset(options);
                    break; 
                }
            case LayerType.Custom3DTile:
                {
                   // this.dataLayer  = new tile3Dlayer(options);
                    break;
                }
        }
        this.update(style);

        return  this.dataLayer ;
    }

    update(config){
        if(this.dataLayer){
            for(let item in config){
                if(item=="url")continue;
                  this.config.style[item] = config[item];
                  this.dataLayer[item] =  config[item];
            }
        }
    } 
 
}
export default ModelLayer;
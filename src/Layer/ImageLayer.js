
import LayerType from "../Enums/LayerType"
import baseLayer from "./BaseLayer"
import Exception from '../Exception/Exception';
import ExceptionMessage from '../Exception/ExceptionMessage';
export default class ImageLayer extends baseLayer {

   
    constructor(config){
        super(config); 
    }
    initLayer() {
 
        let type = this.config.type;
        let options = this.config.options;
        let style = this.config.style;
        this._checkDefStyles(style);
        if(!options.url){
            throw new Exception(ExceptionMessage.ERROR_PARAMS);    
            return null;                   
        }
        switch (type) {
            case LayerType.WMS:
                {
                    if(options.url&&options.layers){
                        options.parameters = Cesium.defaultValue(options.parameters,{});
                        let parms = options.parameters;
                        if(!parms.format)
                            parms.format = "image/png";
                        if(!parms.transparent)
                            parms.transparent = true;
                        let provider = new Cesium.WebMapServiceImageryProvider(options);
                        this.dataLayer = new Cesium.ImageryLayer(provider, style);                        
                    }else{
                        throw new Exception(ExceptionMessage.ERROR_PARAMS);    
                       // throw new Exception("layers 为必选参数");
                    }
                    break;
                    
                }

            case LayerType.WMTS:
                {
                    let provider = new Cesium.WebMapTileServiceImageryProvider(options);
                    this.dataLayer = new Cesium.ImageryLayer(provider, style);
                    break;
                }

            case LayerType.TMS:
                {
                    let provider = new Cesium.WebMapTileServiceImageryProvider(options);
                    this.dataLayer = new Cesium.ImageryLayer(provider, style);
                    break;
                }

            case LayerType.SingleImage:
                {
                    var extent ;
                    if(options.rectangle&&options.rectangle.length==4)
                        extent = Cesium.Rectangle.fromDegrees(options.rectangle[0], options.rectangle[1], options.rectangle[2], options.rectangle[3]);
                    let provider = new Cesium.SingleTileImageryProvider({
                        url:options.url,
                        rectangle:extent
                    });
                    this.dataLayer = new Cesium.ImageryLayer(provider, style);
                    break;
                }

            case LayerType.UrlTemplate:
                {
                    let provider = new Cesium.UrlTemplateImageryProvider(options);
                    this.dataLayer = new Cesium.ImageryLayer(provider, style);
                    break;
                }

            case LayerType.TileGrid:
                {

                }

            case LayerType.ArcGIS:
                {
                    let provider= new Cesium.ArcGisMapServerImageryProvider(options);
                    this.dataLayer = new Cesium.ImageryLayer(provider, style)
                    break;
                }

        }
        return  this.dataLayer;

    }

    update(style){
        if(this.dataLayer){            
            for(let item in style){
                  this.config.style[item] = style[item];
                  this.dataLayer[item] =style[item];
            }
        }
    }
 

}

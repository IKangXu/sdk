import LayerType from "./LayerType"
export default class LayerStyle {

    static defImageStyle() {
        return {
            alpha: 1.0,
            brightness: Cesium.ImageryLayer.DEFAULT_BRIGHTNESS,
            contrast: Cesium.ImageryLayer.DEFAULT_CONTRAST,
            hue: Cesium.ImageryLayer.DEFAULT_HUE,
            saturation: Cesium.ImageryLayer.DEFAULT_SATURATION,
            gamma: Cesium.ImageryLayer.DEFAULT_GAMMA,
            colorToAlpha: undefined,
            colorToAlphaThreshold: Cesium.ImageryLayer.DEFAULT_APPLY_COLOR_TO_ALPHA_THRESHOLD
        }
    }

    static defModelStyle() {
        return {
            maximumScreenSpaceError: 16,
            maximumMemoryUsage: 512,
            debugColorizeTiles: false,
            debugWireframe: false,
            debugShowBoundingVolume: false,
            debugShowUrl: false,
        }
    }

    static getDefStyle(type){
        let mtype = LayerStyle._getType(type);
        if(mtype=="image"){
            return LayerStyle.defImageStyle();
        }else if (mtype=="model"){
            return LayerStyle.defModelStyle();
        }else {
            return null;
        }

    }

   static _getType(type) {     
            let mtype = "";
            switch (type) {
                case LayerType.CesiumTerrain:
                case LayerType.VRWTerrain:
                case LayerType.ArcGISTerrain: {
                    mtype = "terrian";
                    break;
                }
                case LayerType.WMS:
                case LayerType.WMTS:
                case LayerType.TMS:
                case LayerType.SingleImage:
                case LayerType.UrlTemplate:
                case LayerType.TileGrid:
                case LayerType.ArcGIS: {
                    mtype = "image";
                    break;
                }
                case LayerType.CZML:
                case LayerType.GeoJSON:
                case LayerType.KML:
                case LayerType.VectorTile:
                case LayerType.SHP: {
                    mtype = "vector";
                    break;
                }
                //模型数据 
                case LayerType.Cesium3DTile:
                case LayerType.Custom3DTile:
                case LayerType.GLTF: {
                    mtype = "model";
                    break;
                }
                //组图层 
                case LayerType.Group: {
                    mtype = "group";
                    break;
                }
    
            }
            return mtype;
    
        
    }

}

LayerStyle.Image_Dark = {

};

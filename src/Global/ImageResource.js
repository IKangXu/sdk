
import imageType from '../Enums/LayerType'
//提供公共影像资源，如ArcGIS 、天地图、google的影像底图
class ImageResource{ 

    static setTDTKey(key){
        this.tdtKey = key;

    }

    static setBingKey(key){
        this.bingKey = key;

    }

   

    static arcgisImage(){
        return this._getTemplate('ArcGIS影像',imageType.ArcGIS,{               
            "url": "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",                      
        })
          
    }

    static googleImage(){
        return this._getTemplate('Google影像',imageType.Google,{               
           // "url": " http://mt0.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}",                      
            "url": " http://www.google.cn/maps/vt?lyrs=s%2Ch&gl=cn&x={x}&y={y}&z={z}",                      
        }) 
    }


    static bingImage(){
        return this._getTemplate('Bing影像',imageType.Bing,{               
            "url": "http://www.huaruiview.cn:3500/startlvlone/wmts",                      
        })
          
    }

    _getTemplate(name,type,options){
        return  {
            "id": Cesium.createGuid(),
            "name": name,
            "layerType": "Image",
            "config": {
                "type": type,
                "options":options
            }
        }

    }
 
}

export default ImageResource;
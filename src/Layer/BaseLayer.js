

import LayerStyle from "../Enums/LayerStyle"
let defaultValue = Cesium.defaultValue;

export default class BaseLayer {
    constructor(data) { 
        data.id= defaultValue(data.id, Cesium.createGuid());        
        data.name = defaultValue(data.name, "未命名");  
        data.show = defaultValue(data.show, true);  
        data.style = defaultValue(data.style, {});  
        this._config = data;   
        this.dataLayer = null;
       
    }

    initLayer() {

    }

    get id() {
        return this._config.id;
    }

    get name() {
        return this._config.name;
    }
    set name(val) {
        this._config.name = val;
        
    }

    get show() {
        return this._config.show;
    }
    set show(val) {
        this.dataLayer.show = val;
        this._config.show = val;
    }

    get type() {
        return this._config.type;
    }

    get config() {
        return this._config;
    }
 
    _checkDefStyles(sytle){   
        let mstyle =  LayerStyle.getDefStyle(this.type);
        let defaults = Cesium.clone(mstyle , true); 
        for(let item in defaults){
            if(!Cesium.defined(sytle[item]))
                sytle[item] =defaults[item] ;
      }
    }


}

 
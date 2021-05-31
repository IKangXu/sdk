


import GroupLayer from './GroupLayer'
import ImageLayer from './ImageLayer'
import VectorLayer from './VectorLayer'
import ModelLayer from './ModelLayer'
import LayerType from '../Enums/LayerType';
import TerrainLayer from './TerrainLayer'

class LayerManager{

    constructor(viewer){
        this.earth = viewer;
        this._layerDataSet = new Map();
        this._layerConfigs = [];

        this.imageryLayers =  this.earth.imageryLayers;
        this.dataSources = this.earth.dataSources;
        this.primitives = this.earth.scene.primitives;
        this.terrainUrl = null;
    }
    
    getLayerByName(name){
        let rlayer;
        for(const [key, value] of   this._layerDataSet){
            let layer = this._layerDataSet.get(item);
            if(value.name == name){
                rlayer=value;
                break;
            }
        }
        return rlayer;

    }

    getLayerByID(id){
        let rlayer;
        for(const [key, value] of  this._layerDataSet){ 
            if(value.id == id){
                rlayer=value;
                break;
            }
        }
        return rlayer;

    }

   
    toJSON(){

    }
    fromJSON(){

    }
 
  
    //影像图层
    addImageLayer(config,isBaseImage=false){
        let mLayer = new ImageLayer(config);        
        this.imageryLayers.add(mLayer.getLayer());  
        this._layerDataSet.set(mLayer.id,mLayer);   
    }

    //矢量图层
    addVectorLayer(config){       
        let mLayer = new VectorLayer(config);
        this.earth.dataSources.add(mLayer.getLayer());  
        this._layerDataSet.set(mLayer.id,mLayer);          
    }
 

    //模型图层
    add3DModelLayer(config){
        let mLayer = new ModelLayer(config);
        this.primitives.add(mLayer.getLayer());  
        this._layerDataSet.set(mLayer.id,mLayer);     
    }

    //地形图层
    addTerrainLayer(config){
        let mLayer = new TerrainLayer(config);
        this.earth.terrainProvider  = mLayer.getLayer(); 
        this._layerDataSet.set(mLayer.id,mLayer);    
    }
 
    addLayer(layer){

        let type = layer.layerType;

        switch(type){
            case LayerType.Terrain:{
                this.addTerrainLayer(layer);
                break;
            }
            case LayerType.Image:{
                this.addImageLayer(layer);
                break;
            }
            case LayerType.Vector:{
                this.addVectorLayer(layer);
                break;
            }
            case LayerType.Model:{
                this.add3DModelLayer(layer);
                break;
            }
            
           default:{               
                break;
            }
        }

    }

    addLayers(layers){
        layers.map(item=>this.addLayer(item))
    }

    removeLayer(clayer){
        if(clayer.layerType == LayerType.Image){
             this.imageryLayers.remove(clayer.layer);                
        }else  if(clayer.layerType == LayerType.Vector){
                
        }else  if(clayer.layerType == LayerType.Model){
                
        }else  if(clayer.layerType == LayerType.ModelGLTF){
                
        }
 

    }

    clearLayer(){
       let imgLayers = this.getLayersByType(LayerType.Image);
       imgLayers.map(item=> this.imageryLayers.remove(item.layer));

        this.dataSources.removeAll();
        this.primitives.removeAll(); 
        this.earth.entities.removeAll();

        this._layerDataSet = new Map();

    }
    
    //初始化图层管理
    fromJSON(layers){
        this.clearLayer();
        this.addLayers(layers); 
    }

    toJSON(){
        
       
    }


    
}


export default LayerManager;
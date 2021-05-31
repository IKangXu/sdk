 
 

class ScenePick {
    
     static pickPosition (viewer,windowPosition) {
        if(!Cesium.defined(windowPosition))
            return null;
        var pickedPosition;
        var scene = viewer.scene;

        var ray = viewer.camera.getPickRay(windowPosition);

        if (scene.mode !==  Cesium.SceneMode.MORPHING) {
            var pickedObject = scene.pick(windowPosition);
            if (ScenePick.isModel(scene,pickedObject)) {
                pickedPosition =scene.pickPosition(windowPosition);
            }
            else {
                pickedPosition =  viewer.scene.globe.pick(ray, scene);
				//viewer.camera.pickEllipsoid(windowPosition, scene.globe.ellipsoid);
            }
          }
            return pickedPosition;
    }

    static isModel(scene,pickObj){
        if(Cesium.defined(pickObj)&&scene.pickPositionSupported ){
            if( pickObj.primitive&&pickObj.primitive.asset||(pickObj.id&&pickObj.id.model))
                return true;
        }
        return false;
   }
    
}

export default  ScenePick;


import CTMap from './CTMap'; 

const scope = (typeof window !== 'undefined') ? window : ((typeof self !== 'undefined') ? self : {});
if(scope.CTMap) {
    Object.assign(scope.CTMap, CTMap);
     
} else {
    scope['CTMap'] = CTMap;
}

scope['Cesium'] = CTMap;
 
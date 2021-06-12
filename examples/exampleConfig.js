const defaultUrl = ' '
const isDefault = true;
const rootUrl="./data/";
function getOriginUrl () {
    const tempUrl = window.location.origin.split(':');
    return `${tempUrl[0]}:${tempUrl[1]}${tempUrl[2]!==undefined ? ':' : ''}`
}

window.getBaseUrl = function() {
    if(isDefault) {
        return defaultUrl;
    } else {
        return `${getOriginUrl()}${port}`
    }
}

window.dataUrls =  {
     root: rootUrl,
     dataHome:"../../sampleData/",
     baseTerrain:"../../sampleData/terrain_L11/",
     model_Max:"",
     model_Gltf:"",
     model_Building1:"",
     model_Building2:"",
     model_QX:"",
     model_PointCld:"",
     model_BIM:"",
     
}
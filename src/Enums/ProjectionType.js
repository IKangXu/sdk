class ProjectionType {

}

ProjectionType.WebMercatorTilingScheme= "WebMercatorTilingScheme";
ProjectionType.GeographicTilingScheme = "GeographicTilingScheme";

ProjectionType.fromString=function(type){
    if(type =="GeographicTilingScheme"){
        return new Cesium.GeographicTilingScheme();

    }else if (type =="WebMercatorTilingScheme"){
        return new Cesium.WebMercatorTilingScheme();
    }else{
        return null;
    }
}  

export default  ProjectionType;
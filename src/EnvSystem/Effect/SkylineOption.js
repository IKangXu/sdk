
class SkylineOption  {

    constructor(viewer) {
        this._viewer = viewer;
        this._width = 2;
        this._bjColor =  Cesium.Color.RED;
        this._strokeDistance = 500;
        this._color = Cesium.Color.RED;
        this._strokeType = new Cesium.Cartesian3(1,0,0);

    }

    get viewer(){
        return this._viewer;
    }

    get width() {
        return this._width;
    }
    set width(val) {
        this._width = val;
    }

    get strokeType() {
        return this._strokeType;
    }
   
    get enabeEdge() {
        return (this._strokeType.x==1&&this._strokeType.y==1&&this._strokeType.z==1)?true:false;
    }

    set enabeEdge(val) {
        val? this._strokeType = new Cesium.Cartesian3(1,1,1):this._strokeType = new Cesium.Cartesian3(1,0,0);
         
    }

    get bjColor() {
        return this._bjColor;
    } 
    set bjColor(val) {
        this._bjColor = val;
    } 

    get color() {
        return this._color;
    }
    set color(val) {
        this._color= val;
    }

    get strokeDistance() {
        return this._strokeDistance;
    }
    set strokeDistance(val) {
        this._strokeDistance= val;
    }
 
}

export default  SkylineOption 
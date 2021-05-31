
import matrixEditor from "../Tools/matrixEditor"

class transformer {

    constructor(tileset) {
        this.tileset = tileset;
        this.tileset._matrixEditor = new matrixEditor(tileset);
        this.matrixEditor = this.tileset._matrixEditor;
    }

    /**
     * 获取或设置模型的位置，[经度,纬度,高度].
     * @memberof transformer.position
     * @type {Array}
     */
    get position() {
        let pos = this.tileset._root.customTransform.position;
        let lat = Cesium.Math.toDegrees(pos.latitude);
        let lon = Cesium.Math.toDegrees(pos.longitude);
        let alt = pos.height;
        return [lat, lon, alt];

    }
    set position(val) {
        this.matrixEditor.translateTo(val[0], val[1], val[2]);
    }


    /**
     * 获取或设置模型的缩放比例
     * @memberof transformer.scale
     * @type {number}
     */
    get scale() {
        return this.tileset._root.customTransform.scale;
    }
    set scale(val) {
        this.matrixEditor.scale(val);
    }

    /**
     * 获取或设置模型的旋转参数
     * @memberof transformer.rotate
     * @type {Object}
     */
    get rotate() {
        let rotation = this.tileset._root.customTransform.rotation;
        return [rotation.x, rotation.y, rotation.z];
    }
    set rotate(val) {
        this.matrixEditor.rotate(val[0], val[1], val[2]);
    }

    /**
     * 获取或设置模型的高度
     * @memberof transformer.height
     * @type {Number}
     */
    get height() {
        let pos = this.tileset._root.customTransform.position;
        return pos.height;
    }
    set height(val) {
        let pos = this.position;
        this.position = [pos[0], pos[1], val];
    }

}
class clippingTool {

    constructor(tileset) {
        this.tileset = tileset;
        this.enabled = true;

        this.edgeStylingEnabled = true;
        this.edgeWidth = 2.0;
        this.edgeColor = Cesium.Color.WHITE;
        this._polygon = [];

        this._heightPlane =[];
        this._clipHeight=null;
        this._rotateX=0;
        this._rotateY=0;
        this._rotateZ=0;
    }

    createHeightPlane(val){
        if(this.tileset.ready ){
            var clippingPlanes = new Cesium.ClippingPlaneCollection({
                planes : [
                    new Cesium.ClippingPlane(new Cesium.Cartesian3(0.0, 0.0, -1.0), val)
                ],
                edgeWidth: this.edgeWidth,
                edgeColor: this.edgeColor,
                enabled: this.enabled 
            });
    
            // if (!Cesium.Matrix4.equals(this.tileset.root.transform, Cesium.Matrix4.IDENTITY)) {
            //     var transformCenter = Cesium.Matrix4.getTranslation(this.tileset.root.transform, new Cesium.Cartesian3());
            //     var transformCartographic = Cesium.Cartographic.fromCartesian(transformCenter);
            //     var boundingSphereCartographic = Cesium.Cartographic.fromCartesian(this.tileset.boundingSphere.center);
            //     var height = boundingSphereCartographic.height - transformCartographic.height;
            //     clippingPlanes.modelMatrix = Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(0.0, 0.0, height));
            // }
            this.tileset.clippingPlanes  = clippingPlanes;
            let matrix = this.tileset.clippingPlanes.modelMatrix;
            var rotationx = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(this._rotateX)));
            var rotationy = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(this._rotateY)));
            var rotationz = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(this._rotateZ)));
            Cesium.Matrix4.multiply(matrix, rotationx, matrix);
            Cesium.Matrix4.multiply(matrix, rotationy, matrix);
            Cesium.Matrix4.multiply(matrix, rotationz, matrix);
            this.tileset.clippingPlanes.modelMatrix = matrix;

        }
        
    }

    createclippingPlanes(points) {
         
        var pointsLength = points.length;

        var clippingPlanes = [];
        for (var i = 0; i < pointsLength; ++i) {
            var nextIndex = (i + 1) % pointsLength;
            var midpoint = Cesium.Cartesian3.add(points[i], points[nextIndex], new Cesium.Cartesian3());
            midpoint = Cesium.Cartesian3.multiplyByScalar(midpoint, 0.5, midpoint);

            var up = Cesium.Cartesian3.normalize(midpoint, new Cesium.Cartesian3());
            var right = Cesium.Cartesian3.subtract(points[nextIndex], midpoint, new Cesium.Cartesian3());
            right = Cesium.Cartesian3.normalize(right, right);

            var normal = Cesium.Cartesian3.cross(right, up, new Cesium.Cartesian3());
            normal = Cesium.Cartesian3.normalize(normal, normal);

            // Compute distance by pretending the plane is at the origin
            var originCenteredPlane = new Cesium.Plane(normal, 0.0);
            var distance = Cesium.Plane.getPointDistance(originCenteredPlane, midpoint);

            clippingPlanes.push(new Cesium.ClippingPlane(normal, distance));
        }
        return clippingPlanes;

    }

    /**
     * 获取或设置模型的裁剪多边形，[经度,纬度,高度].
     * @memberof clippingTool.polygon
     * @type {Array}
     */
    get polygon() {
        return this._polygon;
    }
    set polygon(val) {
        if(val.length>0){
            let points = Cesium.Cartesian3.fromDegreesArrayHeights(val);
            let clippingPlanes = this.createclippingPlanes(points);
            this.tileset.clippingPlanes = new Cesium.ClippingPlaneCollection({
                planes: clippingPlanes,
                edgeWidth: this.edgeWidth,
                edgeColor: this.edgeColor,
                enabled: this.enabled
            });
            this._polygon = val; 
        } 
    }

    /**
     * 获取或设置模型的裁剪多边形，[经度,纬度,高度].
     * @memberof clippingTool.polygon
     * @type {Array}
     */
    get clipHeight() {
        return this._clipHeight;
    }
    set clipHeight(val) { 
        if(this._heightPlane.length==0){
            if(this.tileset.ready){
                this.createHeightPlane(val);          
            }else{
                let that = this;
                this.tileset.readyPromise.then((tileset) =>{
                    that.createHeightPlane(val);
                });
            }    
            this._heightPlane = this.tileset.clippingPlanes;
            
        }else{
            for (var i = 0; i < this._heightPlane.length; ++i) {
                var plane = this._heightPlane.get(i);
                plane.distance = val;
            }
        }
        this._clipHeight = val; 
    }

    /**
     * 获取或设置模型的裁剪面X轴的旋转角度
     * @memberof clippingTool.rotateX
     * @type {Number}
     */
    get rotateX() {
        return this._rotateX;         
    }
    set rotateX(val) {
        let  clippingPlanes = this.tileset.clippingPlanes; 
        if(clippingPlanes){
            let matrix = clippingPlanes.modelMatrix;
            var rotationx = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(val)));
            Cesium.Matrix4.multiply(matrix, rotationx, matrix); 
            clippingPlanes.modelMatrix = matrix;
        }
        
        this._rotateX = val;
    }

    /**
     * 获取或设置模型的裁剪面Y轴的旋转角度
     * @memberof clippingTool.rotateX
     * @type {Number}
     */
    get rotateY() {
        return this._rotateY;
    }
    set rotateY(val) { 
        let  clippingPlanes = this.tileset.clippingPlanes; 
        if(clippingPlanes){
            let matrix = clippingPlanes.modelMatrix;
            var rotationy = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(val)));
            Cesium.Matrix4.multiply(matrix, rotationy, matrix); 
            clippingPlanes.modelMatrix = matrix;
        }
        
        this._rotateY = val;
         
    }

     /**
     * 获取或设置模型的裁剪面Z轴的旋转角度
     * @memberof clippingTool.rotateX
     * @type {Number}
     */
    get rotateZ() {
        return this._rotateZ;
    }
    set rotateZ(val) { 
        let  clippingPlanes = this.tileset.clippingPlanes; 
        if(clippingPlanes){
            let matrix = clippingPlanes.modelMatrix;
            var rotationz = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(val)));
            Cesium.Matrix4.multiply(matrix, rotationz, matrix); 
            clippingPlanes.modelMatrix = matrix;
        } 
        this._rotateZ = val; 
    }
 
    clear() {
        this.tileset.clippingPlanes.removeAll();
        this._polygon = [];
    }

}
 
Object.defineProperties(Cesium.Cesium3DTileset.prototype, {
    showBound: {
        get: function () {
            return this._showBound;
        },
        set: function (value) {
            if (value == this._showBound) return;
            if (!this.ready && value) {
                this.readyPromise.then(tileset => {
                    tileset.createBound();
                })
                //throw new DeveloperError('The tileset is not loaded.  Use Cesium3DTileset.readyPromise or wait for Cesium3DTileset.ready to be true.');
            } else {
                this.setBoundVisible(value);
            }
            this._showBound = value;
        }
    },
    boundColor: {
        get: function () {
            return this._showBound;
        },
        set: function (value) {
            this._showBound = value;
        }
    },
    transformer: {
        get: function () {
            if (!this._transformer)
                this._transformer = new transformer(this);
            return this._transformer;
        }

    },
    clippingTool: {
        get: function () {
            if (!this._clippingPolygon)
                this._clippingPolygon = new clippingTool(this);
            return this._clippingPolygon;
        }
    },
    maxVal: {
        get: function () {
            return this._maxVal;
        },
        set: function (val) {
            this._maxVal = val;
            let conditions = [];
            let lv1 = this._maxVal-10;
            let lv2 = this._maxVal-20;
            conditions.push( ['${z} >= '+this._maxVal, "color('red')"]);
            conditions.push( ['${z} >= '+lv1, "color('yellow')"]);
            conditions.push( ['${z} >= '+lv2, "color('blue')"]);            
            conditions.push( ['true', "color('green')"]);
            this.style = new Cesium.Cesium3DTileStyle({
                pointSize: 2.0,             
                color: {
                    conditions: conditions 
                } 
            });

        }
    },
    psize: {
        get: function () {
            return this._psize;
        },
        set: function (val) {
            this._psize = val;
            if(!this.style){
                this.style = new Cesium.Cesium3DTileStyle();
            } 
            this.style.pointSize = val;
        }
    }

    
});


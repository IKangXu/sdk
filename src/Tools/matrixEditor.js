

class matrixEditor {

     /**
	 * 位置编辑器 构造函数
	 * @method constructor
	 * @param scene Cesium.scene 对象
     * 
	 */
    constructor(tileset){
        this.tileset=tileset;
        this._transformInitialize();       
    }

    
rotate(x, y, z) {
    let customTransform = this.tileset._root.customTransform;
    if (x === undefined) {
        x = customTransform.rotation.x;
    }

    if (y === undefined) {
        y = customTransform.rotation.y;
    }

    if (z === undefined) {
        z = customTransform.rotation.z;
    }

    let rotMat3 = Cesium.Matrix3.fromHeadingPitchRoll(
        new Cesium.HeadingPitchRoll(
            Cesium.Math.toRadians(z),
            Cesium.Math.toRadians(y),
            Cesium.Math.toRadians(x)
        )
    );
    let rotMat4 = Cesium.Matrix4.fromRotationTranslation(rotMat3, undefined, undefined);

   
    customTransform.matrix.rotation = rotMat4;
    this._transform();
    customTransform.rotation.x = x;
    customTransform.rotation.y = y;
    this.tileset._root.customTransform.rotation.z = z;
}

resetRotation() {
    this.tileset._root.customTransform.matrix.rotation = Cesium.Matrix4.IDENTITY;
    this.tileset._root.customTransform.rotation = { x: 0, y: 0, z: 0 };
    this._transform();
 
}

scale(s) {
    let m = Cesium.Matrix4.fromScale(new Cesium.Cartesian3(s, s, s));
    this.tileset._root.customTransform.matrix.scale = m;
    this.tileset._root.customTransform.scale = s;
    this._transform();
}

resetScale() {
    this.tileset._root.customTransform.matrix.scale = Cesium.Matrix4.IDENTITY;
    this.tileset._root.customTransform.scale = 1.0;
    this._transform();
 
}

translateTo(latitude, longitude, height) {
     let position = this.tileset._root.customTransform.position;

    var oldPlace = Cesium.Cartesian3.fromRadians(
        position.originalLongitude,
        position.originalLatitude,
        position.originalHeight
    );
    var newPlace = Cesium.Cartesian3.fromDegrees(
        longitude,
        latitude,
        height
    );
    var translation = Cesium.Cartesian3.subtract(newPlace, oldPlace, new Cesium.Cartesian3());
    this.tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
    //viewer.zoomTo(tileset);

    position.latitude = Cesium.Math.toRadians(latitude);
    position.longitude = Cesium.Math.toRadians(longitude);
    position.height = height;
}

resetTranslation() {
    let pos = this.tileset._root.customTransform.position;
    pos.latitude =  pos.originalLatitude;
    pos.longitude = pos.originalLongitude;
    pos.height= pos.originalHeight;
     
}
 

_translate(x, y, z) {

    var cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);
    var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
    var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude + y, cartographic.latitude + x, z);
    var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());

    Cesium.Matrix4.multiply(this.tileset.modelMatrix, Cesium.Matrix4.fromTranslation(translation), this.tileset.modelMatrix);
}
_transform() {
    let m = new Cesium.Matrix4;
    
    Cesium.Matrix4.multiply(this.tileset._root.customTransform.matrix.origin, this.tileset._root.customTransform.matrix.rotation, m);
    Cesium.Matrix4.multiply(m, this.tileset._root.customTransform.matrix.scale, m);
    Cesium.Matrix4.multiply(m, this.tileset._root.customTransform.matrix.translation, this.tileset._root.transform);
}
 
_transformInitialize() {	
        let cartographic = Cesium.Cartographic.fromCartesian(this.tileset.boundingSphere.center);
        this.tileset._root.customTransform = {
            matrix: {
                origin: this.tileset._root.transform.clone(),
                rotation: Cesium.Matrix4.IDENTITY,
                translation: Cesium.Matrix4.IDENTITY,
                scale: Cesium.Matrix4.IDENTITY
            },
            rotation: {
                x: 0,
                y: 0,
                z: 0
            },
            scale: 1.0,
            position: {
                originalLatitude: cartographic.latitude,
                originalLongitude: cartographic.longitude,
                originalHeight: cartographic.height,
                height: cartographic.height,
                latitude: cartographic.latitude,
                longitude: cartographic.longitude
            }
        }; 
    
}
 

}
export default matrixEditor;
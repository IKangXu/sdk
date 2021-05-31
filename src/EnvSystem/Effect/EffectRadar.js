import PostProcessEffects from "../../Enums/PostProcessEffects"

class EffectRadar extends Cesium.PostProcessStage {

    constructor(viewer, center, radius, scanColor, duration) {

        if (!Cesium.defined(viewer)) {
            console.error("viewer 未定义");
            return;
        }
        if (!Cesium.defined(center)) {
            console.error("中心点未定义");
            return;
        }

        let _radius = Cesium.defaultValue(radius, 1500.0);
        let _scanColor = Cesium.defaultValue(scanColor, Cesium.Color.RED);
        let _duration = Cesium.defaultValue(duration, 4000.0);


        let _Cartesian4Center = new Cesium.Cartesian4(center.x, center.y, center.z, 1);
        let _CartographicCenter1 = Cesium.Cartographic.fromCartesian (center); 
        _CartographicCenter1.height +=500;
        let _Cartesian3Center1 = Cesium.Cartographic.toCartesian(_CartographicCenter1);
        let _Cartesian4Center1 = new Cesium.Cartesian4(_Cartesian3Center1.x, _Cartesian3Center1.y, _Cartesian3Center1.z, 1);


        let _CartographicCenter2 = Cesium.Cartographic.fromCartesian (center); 
        _CartographicCenter2.longitude += Cesium.Math.toRadians(0.001) ;
        let c4= Cesium.Cartographic.toCartesian(_CartographicCenter2);
        let _Cartesian4Center2 = new Cesium.Cartesian4(c4.x, c4.y, c4.z, 1);
 
         
        
        let _RotateQ = new Cesium.Quaternion();
        let _RotateM = new Cesium.Matrix3();

        let _time = (new Date()).getTime();

        let _scratchCartesian4Center = new Cesium.Cartesian4();
        let _scratchCartesian4Center1 = new Cesium.Cartesian4();
        let _scratchCartesian4Center2 = new Cesium.Cartesian4();
        let _scratchCartesian3Normal = new Cesium.Cartesian3();
        let _scratchCartesian3Normal1 = new Cesium.Cartesian3();



        var radarEffect = {
            fragmentShader: PostProcessEffects.FS_RADAR,
            uniforms: {
                u_scanCenterEC: function () {
                    return Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
                },
                u_scanPlaneNormalEC: function () {
                    var temp = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
                    var temp1 = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center1, _scratchCartesian4Center1);
                    _scratchCartesian3Normal.x = temp1.x - temp.x;
                    _scratchCartesian3Normal.y = temp1.y - temp.y;
                    _scratchCartesian3Normal.z = temp1.z - temp.z;

                    Cesium.Cartesian3.normalize(_scratchCartesian3Normal, _scratchCartesian3Normal);
                    return _scratchCartesian3Normal;
                },
                u_radius: _radius,
                u_scanLineNormalEC: function () {
                    var temp = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
                    var temp1 = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center1, _scratchCartesian4Center1);
                    var temp2 = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center2, _scratchCartesian4Center2);

                    _scratchCartesian3Normal.x = temp1.x - temp.x;
                    _scratchCartesian3Normal.y = temp1.y - temp.y;
                    _scratchCartesian3Normal.z = temp1.z - temp.z;

                    Cesium.Cartesian3.normalize(_scratchCartesian3Normal, _scratchCartesian3Normal);

                    _scratchCartesian3Normal1.x = temp2.x - temp.x;
                    _scratchCartesian3Normal1.y = temp2.y - temp.y;
                    _scratchCartesian3Normal1.z = temp2.z - temp.z;

                    var tempTime = (((new Date()).getTime() - _time) % _duration) / _duration;
                    Cesium.Quaternion.fromAxisAngle(_scratchCartesian3Normal, tempTime * Cesium.Math.PI * 2, _RotateQ);
                    Cesium.Matrix3.fromQuaternion(_RotateQ, _RotateM);
                    Cesium.Matrix3.multiplyByVector(_RotateM, _scratchCartesian3Normal1, _scratchCartesian3Normal1);
                    Cesium.Cartesian3.normalize(_scratchCartesian3Normal1, _scratchCartesian3Normal1);
                    return _scratchCartesian3Normal1;
                },
                u_scanColor: _scanColor
            }
        };

        super(radarEffect)
    }

    get scanColor() {
        return this._scanColor;
    }

    set scanColor(val) {
        this._scanColor = val;
    } 
    get maxRadius() {

    }
    set maxRadius(val) {

    }
 
}

export default  EffectRadar 
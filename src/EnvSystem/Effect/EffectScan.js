import PostProcessEffects from "../../Enums/PostProcessEffects"

 class EffectScan extends Cesium.PostProcessStage {

    constructor(viewer, center, maxRadius, scanColor, duration) {

        if (!Cesium.defined(viewer)) {
            console.error("viewer 未定义");
            return;
        }
        if (!Cesium.defined(center)) {
            console.error("中心点未定义");
            return;
        }
        let _viewer = viewer;
      
        let _maxRadius = Cesium.defaultValue(maxRadius, 1500.0);

        let _scanColor = Cesium.defaultValue(scanColor, Cesium.Color.RED);
        let _duration = Cesium.defaultValue(duration, 4000.0);
        let _time = (new Date()).getTime();
  
        let _Cartesian4Center = new Cesium.Cartesian4(center.x, center.y, center.z, 1);

        let _CartographicCenter1 = Cesium.Cartographic.fromCartesian(center); 
        _CartographicCenter1.height +=500;

        let _Cartesian3Center1 = Cesium.Cartographic.toCartesian(_CartographicCenter1);
        let _Cartesian4Center1 = new Cesium.Cartesian4(_Cartesian3Center1.x, _Cartesian3Center1.y, _Cartesian3Center1.z, 1);



        let _scratchCartesian4Center = new Cesium.Cartesian4();
        let _scratchCartesian4Center1 = new Cesium.Cartesian4();
        let _scratchCartesian3Normal = new Cesium.Cartesian3();


        let scan = {
            fragmentShader: PostProcessEffects.FS_SCAN,
            uniforms: {
                u_scanCenterEC: function () {
                    return Cesium.Matrix4.multiplyByVector(_viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
                },
                u_scanPlaneNormalEC: function () {
                    let temp = Cesium.Matrix4.multiplyByVector(_viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
                    let temp1 = Cesium.Matrix4.multiplyByVector(_viewer.camera._viewMatrix, _Cartesian4Center1, _scratchCartesian4Center1);
                    _scratchCartesian3Normal.x = temp1.x - temp.x;
                    _scratchCartesian3Normal.y = temp1.y - temp.y;
                    _scratchCartesian3Normal.z = temp1.z - temp.z;

                    Cesium.Cartesian3.normalize(_scratchCartesian3Normal, _scratchCartesian3Normal);
                    return _scratchCartesian3Normal;
                },
                u_radius: function () {
                    return _maxRadius * (((new Date()).getTime() - _time) % _duration) / _duration;
                },
                u_scanColor: _scanColor

            }
        }
        super(scan);

        this.center = center;

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

export default  EffectScan ;
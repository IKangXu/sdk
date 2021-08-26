 

export default class Latlng {
    constructor(options) {
     
    } 
      
      //格式化坐标点为可显示的可理解格式
      static  formatPositon(position) {
        var carto = Cesium.Cartographic.fromCartesian(position);
        var result = {};
        result.y = Number(Cesium.Math.toDegrees(carto.latitude).toFixed(6));
        result.x = Number(Cesium.Math.toDegrees(carto.longitude).toFixed(6));
        result.z = Number(carto.height.toFixed(1));
        return result;
    }



    /**
     * 获取鼠标当前的屏幕坐标位置的三维Cesium坐标
     * @param {Cesium.Scene} scene 
     * @param {Cesium.Cartesian2} position 二维屏幕坐标位置
     */
    static  getCurrentMousePosition(scene, position) {
        var cartesian;

        //在模型上提取坐标
        var pickobject = scene.pick(position); //取模型
        if (scene.pickPositionSupported && Cesium.defined(pickobject)) {   //!scene.pickPositionSupported : 不支持深度拾取,无法进行鼠标交互绘制
            cartesian = scene.pickPosition(position);
            // if (cartesian) {
                if (Cesium.defined(cartesian)) {
                    // var pgeo = scene.globe.ellipsoid.cartesianToCartographic(cartesian);
                    var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                    var height = cartographic.height; //模型高度
                    if (height >= 0) return cartesian;
    
                    //不是entity时，支持3dtiles地下
                    if (!Cesium.defined(pickobject.id) && height >= -2000)
                        return cartesian;
            }
        }

        //提取鼠标点的地理坐标
    if (scene.mode === Cesium.SceneMode.SCENE3D) {
        var pickRay = scene.camera.getPickRay(position);
        cartesian = scene.globe.pick(pickRay, scene);
    } else {
        cartesian = scene.camera.pickEllipsoid(position, scene.globe.ellipsoid);
    }
        return cartesian;
    }

    //提取地球中心点坐标
    static getCenter(viewer, isToWgs) {
        var scene = viewer.scene;
        var target = pickCenterPoint(scene);
        var bestTarget = target;
        if (!bestTarget) {
            var globe = scene.globe;
            var carto = scene.camera.positionCartographic.clone();
            var height = globe.getHeight(carto);
            carto.height = height || 0;
            bestTarget = Cesium.Ellipsoid.WGS84.cartographicToCartesian(carto);
        }
        var result = formatPositon(bestTarget);
        if (isToWgs)
            result = viewer.mars.point2wgs(result); //坐标转换为wgs

        return result;
    }
    static pickCenterPoint(scene) {
        var canvas = scene.canvas;
        var center = new Cesium.Cartesian2(
            canvas.clientWidth / 2,
            canvas.clientHeight / 2);

        var ray = scene.camera.getPickRay(center);
        var target = scene.globe.pick(ray, scene);
        return target || scene.camera.pickEllipsoid(center);
    }

    //提取地球视域边界
    static getExtent(viewer, isToWgs) {
        // 范围对象
        var extent = { xmin: 70, xmax: 140, ymin: 0, ymax: 55 }; //默认值：中国区域

        // 得到当前三维场景
        var scene = viewer.scene;

        // 得到当前三维场景的椭球体
        var ellipsoid = scene.globe.ellipsoid;
        var canvas = scene.canvas;

        // canvas左上角
        var car3_lt = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(0, 0), ellipsoid);
        if (car3_lt) {// 在椭球体上
            var carto_lt = ellipsoid.cartesianToCartographic(car3_lt);
            extent.xmin = Cesium.Math.toDegrees(carto_lt.longitude);
            extent.ymax = Cesium.Math.toDegrees(carto_lt.latitude);
        }
        else {// 不在椭球体上 
            var xMax = canvas.width / 2;
            var yMax = canvas.height / 2;

            var car3_lt2;
            // 这里每次10像素递加，一是10像素相差不大，二是为了提高程序运行效率
            for (var yIdx = 0 ; yIdx <= yMax; yIdx += 10) {
                var xIdx = yIdx <= xMax ? yIdx : xMax;
                car3_lt2 = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(xIdx, yIdx), ellipsoid);
                if (car3_lt2) break;
            }
            if (car3_lt2) {
                var carto_lt = ellipsoid.cartesianToCartographic(car3_lt2);
                extent.xmin = Cesium.Math.toDegrees(carto_lt.longitude);
                extent.ymax = Cesium.Math.toDegrees(carto_lt.latitude);
            }
        }

        // canvas右下角
        var car3_rb = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(canvas.width, canvas.height), ellipsoid);
        if (car3_rb) {   // 在椭球体上
            var carto_rb = ellipsoid.cartesianToCartographic(car3_rb);
            extent.xmax = Cesium.Math.toDegrees(carto_rb.longitude);
            extent.ymin = Cesium.Math.toDegrees(carto_rb.latitude);
        }
        else {// 不在椭球体上
            var xMax = canvas.width / 2;
            var yMax = canvas.height / 2;

            var car3_rb2;
            // 这里每次10像素递减，一是10像素相差不大，二是为了提高程序运行效率
            for (var yIdx = canvas.height ; yIdx >= yMax; yIdx -= 10) {
                var xIdx = yIdx >= xMax ? yIdx : xMax;
                car3_rb2 = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(xIdx, yIdx), ellipsoid);
                if (car3_rb2) break;
            }
            if (car3_rb2) {
                var carto_rb = ellipsoid.cartesianToCartographic(car3_rb2);
                extent.xmax = Cesium.Math.toDegrees(carto_rb.longitude);
                extent.ymin = Cesium.Math.toDegrees(carto_rb.latitude);
            }
        }

        if (isToWgs) {//坐标转换为wgs
            var pt1 = viewer.mars.point2wgs({ x: extent.xmin, y: extent.ymin });
            extent.xmin = pt1.x;
            extent.ymin = pt1.y;

            var pt2 = viewer.mars.point2wgs({ x: extent.xmax, y: extent.ymax });
            extent.xmax = pt2.x;
            extent.ymax = pt2.y;
        }

        return extent;
    }

    //提取相机视角范围参数 
    static getCameraView(viewer, isToWgs) {
        var camera = viewer.camera;
        var position = camera.positionCartographic;

        var bookmark = {};
        bookmark.y = Number(Cesium.Math.toDegrees(position.latitude).toFixed(6));
        bookmark.x = Number(Cesium.Math.toDegrees(position.longitude).toFixed(6));
        bookmark.z = Number(position.height.toFixed(1));
        bookmark.heading = Number(Cesium.Math.toDegrees(camera.heading).toFixed(1));
        bookmark.pitch = Number(Cesium.Math.toDegrees(camera.pitch).toFixed(1));
        bookmark.roll = Number(Cesium.Math.toDegrees(camera.roll).toFixed(1));

        if (isToWgs)
            bookmark = viewer.mars.point2wgs(bookmark); //坐标转换为wgs

        return bookmark;
    }



}
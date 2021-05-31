

import * as turf from '@turf/turf' ;
export default class Util {
      
    static isNumber(obj) {
        return (typeof obj == 'number') && obj.constructor == Number;
    }

    static isString(str) {
        return (typeof str == 'string') && str.constructor == String;
    }


    //url参数获取
    static getRequest() {
        var url = location.search; //获取url中"?"符后的字串   
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    }
    static getRequestByName(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    }

  
    static clone(obj) {
        if (null == obj || "object" != typeof obj) return obj;

        // Handle Date
        if (obj instanceof Date) {
            var copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        // Handle Array
        if (obj instanceof Array) {
            var copy = [];
            for (var i = 0, len = obj.length; i < len; ++i) {
                copy[i] = clone(obj[i]);
            }
            return copy;
        }

        // Handle Object
        if (typeof obj === 'object') {
            var copy = {};
            for (var attr in obj) {
                if (attr == "_layer" || attr == "_layers" || attr == "_parent") continue;

                if (obj.hasOwnProperty(attr))
                    copy[attr] = clone(obj[attr]);
            }
            return copy;
        }
        return obj;
    }


    static isPCBroswer() {
        var sUserAgent = navigator.userAgent.toLowerCase();

        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        var bIsIphoneOs = sUserAgent.match(/iphone/i) == "iphone";
        var bIsMidp = sUserAgent.match(/midp/i) == "midp";
        var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
        var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
        var bIsAndroid = sUserAgent.match(/android/i) == "android";
        var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
        var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
        if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
            return false;
        } else {
            return true;
        }
    }

    //检测浏览器webgl支持
    static webglreport() {
        var exinfo = haoutil.system.getExplorerInfo();
        if (exinfo.type == "IE" && exinfo.version < 11) {
            return false;
        }

        try {
            var glContext;
            var canvas = document.createElement('canvas');
            var requestWebgl2 = (typeof WebGL2RenderingContext !== 'undefined');
            if (requestWebgl2) {
                glContext = canvas.getContext('webgl2') || canvas.getContext('experimental-webgl2') || undefined;
            }
            if (glContext == null) {
                glContext = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') || undefined;
            }
            if (glContext == null) {
                return false;
            }
        } catch (e) {
            return false;
        }
        return true;
    }

    //计算贴地路线
    static terrainPolyline(params) {
        var viewer = params.viewer;
        var positions = params.positions;
        if (positions == null || positions.length == 0) {
            if (params.calback)
                params.calback(positions);
            return;
        }

        var flatPositions = Cesium.PolylinePipeline.generateArc({
            positions: positions,
            granularity: params.granularity || 0.00001
        });


        var cartographicArray = [];
        var ellipsoid = viewer.scene.globe.ellipsoid;
        for (var i = 0; i < flatPositions.length; i += 3) {
            var cartesian = Cesium.Cartesian3.unpack(flatPositions, i);
            cartographicArray.push(ellipsoid.cartesianToCartographic(cartesian));
        }

        //用于缺少地形数据时，赋值的高度
        var tempHeight = Cesium.Cartographic.fromCartesian(positions[0]).height;

        Cesium.when(Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, cartographicArray), function (samples) {
            var noHeight = false;
            var offset = params.offset || 2; //增高高度，便于可视

            for (var i = 0; i < samples.length; ++i) {
                if (samples[i].height == null) {
                    noHeight = true;
                    samples[i].height = tempHeight;
                }
                else {
                    samples[i].height = offset + (samples[i].height * viewer.scene._terrainExaggeration);
                }
            }

            var raisedPositions = ellipsoid.cartographicArrayToCartesianArray(samples);
            if (params.calback)
                params.calback(raisedPositions, noHeight);
            else if (positions.setValue)
                positions.setValue(raisedPositions);
        });
    }
    //创建模型
    static createModel(cfg, viewer) {
        cfg = viewer.mars.point2map(cfg);//转换坐标系

        var position = Cesium.Cartesian3.fromDegrees(cfg.x, cfg.y, cfg.z || 0);
        var heading = Cesium.Math.toRadians(cfg.heading || 0)
        var pitch = Cesium.Math.toRadians(cfg.pitch || 0)
        var roll = Cesium.Math.toRadians(cfg.roll || 0);
        var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
        var orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);

        var model = viewer.entities.add({
            name: cfg.name || "",
            position: position,
            orientation: orientation,
            model: cfg,
            tooltip: cfg.tooltip,
            popup: cfg.popup,
        });
        return model;
    }



    static toLatLon(point) {
        var t = Cesium.Cartographic.fromCartesian(point);
        return  [Cesium.Math.toDegrees(t.longitude),  Cesium.Math.toDegrees(t.latitude), t.height]
    }
    static cartesians2lonlats(pointList) {
        for (var t = [], i = 0, r = pointList.length; i < r; i++) {
            var n =Util.toLatLon(pointList[i]);
            t.push(n)
        }
        return t;
    }

    //计算面积
    static getArea(posList){
        var ptList = Util.cartesians2lonlats(posList);
        ptList.push(ptList[0]);       
        return turf.area({
            type: "Feature",
            geometry: {
                type: "Polygon",
                coordinates: [ptList]
            }
        });
     
            var indices =  Cesium.PolygonPipeline.triangulate(posList, null);
            var area = 0; // 平方公里
    
            for (var i = 0; i < indices.length; i += 3) {               
                var vector1 = posList[indices[i]];
                var vector2 = posList[indices[i + 1]];
                var vector3 = posList[indices[i + 2]];   
                
                var vectorC =  Cesium.Cartesian3.subtract(vector2, vector1, new  Cesium.Cartesian3());
                var vectorD =  Cesium.Cartesian3.subtract(vector3, vector1, new  Cesium.Cartesian3());
                var areaVector =  Cesium.Cartesian3.cross(vectorC, vectorD, new  Cesium.Cartesian3());
                area +=  Cesium.Cartesian3.magnitude(areaVector) / 2.0;
            }
            area = area.toFixed(3);          
            return  area;
    
        
    }


       
}
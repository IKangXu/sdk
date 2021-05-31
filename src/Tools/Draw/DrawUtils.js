


/*
 * 对象绘制公共方法库
 */
export default class DrawUtils {
    constructor(options) {

    }
    /**
     * 创建Dragger拖动点的公共方法
     */
    static createDragger(dataSource, options) {
        var dragger;
        if (options.dragger) {
            dragger = options.dragger;
        } else {
            var position = Cesium.defaultValue(options.position, Cesium.Cartesian3.ZERO);
            var icon = Cesium.defaultValue(options.dragIcon, "dragIcon.png");
            dragger = dataSource.entities.add({
                position: position,
                // point:{
                //     color:Cesium.Color.YELLOW,
                //     outlineWidth:2,
                //     pixelSize:6,
                //     outlineColor:Cesium.Color.LIME
                // }
                billboard: {
                    scale: 1,
                    heightReference: options.heightReference ? Cesium.HeightReference.CLAMP_TO_GROUND : Cesium.HeightReference.NONE,
                    image: icon
                }
            });
        }

        dragger._isDragger = true;
        dragger.onDrag = Cesium.defaultValue(options.onDrag, null);
        dragger.horizontal = Cesium.defaultValue(options.horizontal, true);
        dragger.vertical = Cesium.defaultValue(options.vertical, false);
        dragger.verticalCtrl = Cesium.defaultValue(options.vertical, false);

        return dragger;
    }
    /**
     * 将Cartesian坐标数组  转换为  经纬度坐标数组
     * @param {Array} positions Array<Cartesian3> 笛卡尔坐标数组
     */
    static getCoordinates(positions) {
        var coordinates = [];
        for (var i = 0; i < positions.length; i++) {
            var carto = Cesium.Cartographic.fromCartesian(positions[i]);

            var lng = Number(Cesium.Math.toDegrees(carto.longitude).toFixed(6));
            var lat = Number(Cesium.Math.toDegrees(carto.latitude).toFixed(6));
            var height = Number(carto.height.toFixed(1));

            coordinates.push([lng, lat, height]);
        }
        return coordinates;
    }
    /**
     * 获取坐标数组中最高高程值
     * @param {Array} positions Array<Cartesian3> 笛卡尔坐标数组
     * @param {Number} defaultVal 默认高程值
     */
    static getMaxHeightForPositions(positions, defaultVal) {
        if (defaultVal == null) defaultVal = 0;

        var maxHeight = defaultVal;
        if (positions == null || positions.length == 0) return maxHeight;

        var extrudedPosition = positions[0];
        for (var i = 0; i < positions.length; i++) {
            var tempCarto = Cesium.Cartographic.fromCartesian(positions[i]);
            if (tempCarto.height > maxHeight) {
                maxHeight = tempCarto.height;
            }
        }
        return maxHeight;
    }
    /**
     * 设定带有高度的坐标,参数positions为Cartesian3类型,返回类型为Cartesian3类型(的数组)
     * @param {Array} positions Cartesian3类型的数组
     * @param {Number} height 高度值
     * @return {Array} Cartesian3类型的数组
     */
    static getPositionsWithHeight(positions, height) {
        if (positions instanceof Array) {
            var lonlats = [];
            for (var i = 0; i < positions.length; i++) {
                var cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(positions[i]);
                var tempcarto = {
                    lon: Cesium.Math.toDegrees(cartographic.longitude),
                    lat: Cesium.Math.toDegrees(cartographic.latitude),
                    hgt: Math.ceil(Number(cartographic.height) + Number(height))
                };
                var lonlat = ([tempcarto.lon, tempcarto.lat, tempcarto.hgt]);
                lonlats = lonlats.concat(lonlat);
            }
            return Cesium.Cartesian3.fromDegreesArrayHeights(lonlats);
        } else {
            var cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(positions);
            var lon = Cesium.Math.toDegrees(cartographic.longitude);
            var lat = Cesium.Math.toDegrees(cartographic.latitude);
            return Cesium.Cartesian3.fromDegrees(lon, lat, Number(cartographic.height) + Number(height));
        }
    }

    /**
     * 带有高度差的两点，判断其直角点
     * @param {Cartesian3} cartesian1
     * @param {Cartesian3} cartesian2
     * @return {Cartesian3}
     */
    static getZHeightPosition(cartesian1, cartesian2) {
        var carto1 = Cesium.Cartographic.fromCartesian(cartesian1);
        var lng1 = Number(Cesium.Math.toDegrees(carto1.longitude));
        var lat1 = Number(Cesium.Math.toDegrees(carto1.latitude));
        var height1 = Number(carto1.height.toFixed(2));

        var carto2 = Cesium.Cartographic.fromCartesian(cartesian2);
        var lng2 = Number(Cesium.Math.toDegrees(carto2.longitude));
        var lat2 = Number(Cesium.Math.toDegrees(carto2.latitude));
        var height2 = Number(carto2.height.toFixed(2));

        if (height1 > height2)
            return Cesium.Cartesian3.fromDegrees(lng2, lat2, height1);
        else
            return Cesium.Cartesian3.fromDegrees(lng1, lat1, height2)
    }

    /**
     * 带有高度差的两点，计算两点间的水平距离
     * @param {Cartesian3} cartesian1
     * @param {Cartesian3} cartesian2
     * @return {Number}
     */
    static getHDistance(cartesian1, cartesian2) {
        var zCartesian = this.getZHeightPosition(cartesian1, cartesian2);

        var carto1 = Cesium.Cartographic.fromCartesian(cartesian2);
        var cartoZ = Cesium.Cartographic.fromCartesian(zCartesian);

        var hDistance = Cesium.Cartesian3.distance(cartesian1, zCartesian);

        if (Math.abs(Number(cartoZ.height) - Number(carto1.height)) < 0.01) {
            hDistance = Cesium.Cartesian3.distance(cartesian2, zCartesian);
        }

        return hDistance;
    }

    /**
     * 计算两点之间的中点
     * @param {Cartesian3} cartesian1
     * @param {Cartesian3} cartesian2
     * @return {Cartesian3}
     */
    static getMidPosition(cartesian1, cartesian2) {
        var carto1 = Cesium.Cartographic.fromCartesian(cartesian1);
        var lng1 = Number(Cesium.Math.toDegrees(carto1.longitude));
        var lat1 = Number(Cesium.Math.toDegrees(carto1.latitude));
        var height1 = Number(carto1.height.toFixed(2));

        var carto2 = Cesium.Cartographic.fromCartesian(cartesian2);
        var lng2 = Number(Cesium.Math.toDegrees(carto2.longitude));
        var lat2 = Number(Cesium.Math.toDegrees(carto2.latitude));
        var height2 = Number(carto2.height.toFixed(2));

        var newLng = (lng1 + lng2) / 2;
        var newLat = (lat1 + lat2) / 2;
        var newHeight = (height1 + height2) / 2;

        return Cesium.Cartesian3.fromDegrees(newLng, newLat, newHeight)
    }

    static getPositionsFromJson(geometry) {
        if (!geometry) {
            return null;
        }
        switch (geometry.type) {
            case 'Point':
                return this.lonLatToCartesian(geometry.coordinates[0]);
            case 'MultiPoint':
                return this.lonLatsToCartesians(geometry.coordinates);
            case 'LineString':
                return this.lonLatsToCartesians(geometry.coordinates);
            case "MultiLineString":
                return this.lonLatsToCartesians(geometry.coordinates[0]);
            case 'Polygon':
                return this.lonLatsToCartesians(geometry.coordinates[0]);
            case 'MultiPolygon':
                return this.lonLatsToCartesians(geometry.coordinates[0][0]);
            default:
                throw new Error('Invalid GeoJSON object.');
        }
    }

    /**
     * 根据单个经纬度坐标值数组,求出笛卡尔坐标
     * @param {Array} [coords=[longitude,latitude,height]] 值数组
     * @return {Cartesian3}
     */
    static lonLatToCartesian(coords) {
        return Cesium.Cartesian3.fromDegrees(Number(coords[0]), Number(coords[1]), Number(coords[2] || 0));
    }

    /**
     * 根据多个经纬度坐标值数组,求出笛卡尔坐标
     * @param {Array} [coords=[[longitude,latitude,height],[longitude,latitude,height],...]]
     * @return {Array} Cartesian3类型的数组
     */
    static lonLatsToCartesians(coords) {
        var lonlats = [];
        for (var i = 0; i < coords.length; i++) {
            var lonlat = [Number(coords[i][0]), Number(coords[i][1]), Number(coords[i][2] || 0)];
            lonlats = lonlats.concat(lonlat);
        }
        return Cesium.Cartesian3.fromDegreesArrayHeights(lonlats);
    }

    //格式化为业务格式数据
    static normalizeJsonData(businessData) {
        var jsonData = {};
        jsonData.type = "FeatureCollection";
        jsonData.features = [];
        var _businessData;
        if (typeof businessData == "string") {
            _businessData = JSON.parse(businessData);
        } else
            _businessData = businessData;
        if (_businessData instanceof Array) {
            for (var i = 0; i < _businessData.length; i++) {
                var tempObj = {
                    type: "Feature"
                };
                tempObj.properties = _businessData[i].properties || _businessData[i].PROPERTIES;
                tempObj.geometry = _businessData[i].geometry || _businessData[i].GEOMETRY;
                jsonData.features.push(tempObj);
            }
            return JSON.stringify(jsonData);
        } else if (businessData.features && (businessData.features instanceof Array)) {
            return businessData;
        }
    }
    //格式化为geojson数据
    static normalizeBusinessData(jsonData) {
        var jsonObjs = {};
        try {
            jsonObjs = JSON.parse(jsonData);
        } catch (e) {
            haoutil.alert(e.name + ": " + e.message + " \n请确认json文件格式正确!!!");
            return;
        }
        var features = jsonObjs.features;
        var terminalObjs = [];
        for (var i = 0; i < features.length; i++) {
            var feature = features[i];
            var tempObj = {
                dataID: feature.properties.attr.id,
                dataType: feature.properties.attr.type,
                properties: feature.properties,
                geometry: feature.geometry
            };
            terminalObjs.push(tempObj);
        }
        return JSON.stringify(terminalObjs);
    }
}
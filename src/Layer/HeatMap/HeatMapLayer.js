import HeatmapImageryProvider from './HeatMapImageryProvider'

/**
 *  需要用户创建的类</br>
 *  热力图</br>
 * @see <a href='../../../examples/gallery/editor.html#heatMap'>热力图</a>
 */
export class HeatMapLayer {

    constructor(heatOpt) {
        this._heatMapOption = heatOpt;
        this._heatMapLayer = null
        this._zAxisHeight = null
        this._zoomLevel = [0, 25000, 50000, 100000, 225000, 300000, 500000, 750000, 1000000, 2500000,
            3750000, 5000000, 7500000, 10000000, 20000000, 50000000, 100000000, 250000000, 500000000];
        this._zoomRadius = [1, 1.25, 1.5, 2, 2.25, 3, 5, 7.5, 10, 12.5, 13.75, 15, 17.5, 20, 25, 27.5, 35, 50];
    }

     _calcBound(points) {
        let longitude = [];
        let latitude = [];
        let west, south, east, north;
        for (let i = 0; i < points.length; i++) {
            longitude.push(points[i].lon);
            latitude.push(points[i].lat);
        }
        west = Math.min.apply(null, longitude);
        south = Math.min.apply(null, latitude);
        if (Math.max.apply(null, longitude) >= 178.5) {
            east = 178.5;
        } else { east = Math.max.apply(null, longitude) }
        north = Math.max.apply(null, latitude);
        return {
            west: west,
            south: south,
            east: east,
            north: north
        };
    }

     _formatPoints(points) {
        return points.map(item => {
            return { x: item.lon, y: item.lat, value: item.value }
        })
    }



     _updateFllowCamera() {
        this.destroyItem()
        let camera = this._viewer.camera;
        let cameraPosition = (camera.positionCartographic.height) / 1;
        let heatOptions = JSON.parse(JSON.stringify(this._heatMapParams));
        this._zAxisHeight = cameraPosition;
        for (let i = 0; i < this._zoomLevel.length; i++) {
            if (this._zoomLevel[i] < cameraPosition && cameraPosition < this._zoomLevel[i + 1]) {
                heatOptions.heatmapoptions.radius = this._zoomRadius[i] * (this._heatMapParams.heatmapoptions.radius) / 1;
            }
        }
        let heatMap = new HeatmapImageryProvider(heatOptions);
        this._heatMapLayer = this._viewer.imageryLayers.addImageryProvider(heatMap);
        this._heatMapLayer.show = true;
        camera.moveEnd.addEventListener(this._moveEnd = () => {
            let positionHigh = (camera.positionCartographic.height) / 1;
            if (positionHigh > 16293756) {
                this.destroyItem()
                this._create()
                return;
            }
            for (let i = 0; i < this._zoomLevel.length; i++) {
                if (this._zAxisHeight === null || this._zAxisHeight === undefined || this._zAxisHeight === 0) {
                    this._zAxisHeight = positionHigh;
                    this._updateFllowCamera()
                } else if ((this._zoomLevel[i] < this._zAxisHeight && this._zAxisHeight < this._zoomLevel[i + 1]) &&
                    (positionHigh < this._zoomLevel[i] || positionHigh > this._zoomLevel[i + 1])) {
                    this._zAxisHeight = positionHigh;
                    this._updateFllowCamera()
                }
            }
        });
    }

    /**
     * 初始化
     * @param viewer
     */
    addToMap(viewer) {
        this._viewer = viewer;
        this._create();
    }

    /**
     * 获取热力图参数信息
     */
    getHeatMapOpt() {
        return this._heatMapOption;
    }

    /**
     * 热力图更新
     * @param opt 
     */
    update(opt) {
        this.destroyItem()
        this._heatMapOption = opt
        this._create()
    }
    /**
     * 创建热力图
     * @param opt
     */
     _create() {
        this.destroyItem()
        let bound = this._calcBound(this._heatMapOption.points)
        let heatPoints = {
            min: this._heatMapOption.limitMin,
            max: this._heatMapOption.limitMax,
            points: this._formatPoints(this._heatMapOption.points)
        }
        this._heatMapParams = {
            heatmapoptions: {
                backgroundColor: "rgba(0,0,0,0)",
                radius: this._heatMapOption.radius,
                blur: this._heatMapOption.blur,
                gradient: this._heatMapOption.gradient,
                maxOpacity: this._heatMapOption.opacity
            },
            bounds: bound,
            data: heatPoints
        };
        this._updateFllowCamera()
    }

    /**
     * 销毁热力图
     */
    destroyItem() {
        if (this._heatMapLayer !== null) {
            this._heatMapLayer.show = false;
            this._viewer.imageryLayers.remove(this._heatMapLayer)
            this._viewer.camera.moveEnd.removeEventListener(this._moveEnd);
            this._heatMapLayer = null;
        }
    }

}

/**
 *  需要用户创建的类 </br>
 *  热力图参数类 </br>
 * @see <a href='../../../examples/gallery/editor.html#heatMap'>热力图</a>
 */
export class HeatMapOpt {
     
     /**
     * 视角信息类
     *
     * @alias HeatMapOpt
     * @constructor
     *
     * @param {points} object  热力点数据集 </br>参数格式：[{经度：数字，纬度：数字，此位置上的数据值：数字}...] </br> 如：{lon:80,lat:40,value:90}
     * @param {radius} number  每个数据点将具有的半径 </br> 默认值：10 </br>范围：>0 && <=100
     * @param {limitMin} number  数据集下限
     * @param {limitMax} number  数据集上限
     * @param {gradient} object  表示渐变的对象（语法：数字字符串[0,1]：颜色字符串） </br>如：{ 0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1.0: "rgb(255,0,0)" }
     * @param {opacity} number  热图中最高值的最大不透明度。（如果设置了不透明度，将被覆盖） </br>范围：>=0 && <=1
     * @param {blur} number  将应用于所有数据点的模糊因子。模糊因子越高，渐变越平滑 </br>范围：>=0 && <= 1
     * @param {opacity} number  热图中最高值的最大不透明度。（如果设置了不透明度，将被覆盖） </br>范围：>=0 && <=1
     *
     *
     */
    constructor(points, radius = 10, limitMin, limitMax, gradient = { 0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1.0: "rgb(255,0,0)" }, opacity = 0.8, blur = 0.85) {
        this.points = points;
        this.radius = radius;
        this.limitMin = limitMin;
        this.limitMax = limitMax;
        this.gradient = gradient;
        this.opacity = opacity;
        this.blur = blur;
    }
}
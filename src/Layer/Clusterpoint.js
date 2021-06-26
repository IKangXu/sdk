/**
 * 聚合
 * @param {viewer} viewer对象
 * @param {Object} options - 参数。
 * @param {string/geojson} options.dataOrUrl -  数据url/geojson数据
 * @param {Number} options.pixelRange -  聚合像素范围
 * @param {Array} options.style -  聚合时显示样式
 * @param {string} options.img -  未配置聚合时显示图片
 */
export default class Clusterpoint {
    constructor(opt) {
        this.options = {
            dataOrUrl: '',
            pixelRange: 15,
            enabled: true,
            style: [{
                num: 1,
                size: 48,
                color: "#e6a23cbb"
            }],
            img: "",
        };
        this.options = Object.assign(this.options, opt);
        this.viewer = opt.viewer;
        this.dataSources = null;
        this.clustericon = {};
        if (this.options.dataOrUrl && this.options.dataOrUrl != "") {
            this.loadjson();
        }
    }
    loadjson() {
        var this_ = this;
        new Cesium.GeoJsonDataSource().load(this_.options.dataOrUrl).then(
            geoJsonDataSource => {
                this_.showcluster(geoJsonDataSource);
            })
    }
    showcluster(geoJsonDataSource) {
        var this_ = this;
        this.dataSources = geoJsonDataSource;
        this.viewer.dataSources.add(this.dataSources);

        var pixelRange = this.options.pixelRange;
        var minimumClusterSize = 1;
        var enabled = this.options.enabled;
        //开启聚合
        this.dataSources.clustering.enabled = enabled;
        this.dataSources.clustering.pixelRange = pixelRange;
        this.dataSources.clustering.minimumClusterSize = minimumClusterSize;


        var removeListener;
        //聚合
        function customStyle() {
            if (Cesium.defined(removeListener)) {
                removeListener();
                removeListener = undefined;
            } else {
                removeListener = this_.dataSources.clustering.clusterEvent.addEventListener(
                    function (clusteredEntities, cluster) {


                        cluster.billboard.show = true;
                        cluster.billboard.id = cluster.label.id;
                        cluster.billboard.verticalOrigin =
                            Cesium.VerticalOrigin.CENTER;

                        var xx = -1;
                        for (var i = 0; i < this_.options.style.length; i++) {
                            if (clusteredEntities.length > this_.options.style[i].num) {
                                xx = i;
                            }
                        }
                        if (xx == -1) {
                            cluster.billboard.image = this_.options.img
                        } else {
                            cluster.billboard.image = this_.drawImage(this_.options.style[xx]
                                .size, this_.options.style[xx].color);
                        }



                        if (xx !== -1) {
                            cluster.label.show = true;
                            cluster.label.style = Cesium.LabelStyle.FILL;
                            cluster.label.fillColor = Cesium.Color.WHITE;
                            cluster.label.font = "normal 16px MicroSoft YaHei";
                            cluster.label.outlineWidth = 4;
                            cluster.label.horizontalOrigin = Cesium.HorizontalOrigin.CENTER;
                            cluster.label.verticalOrigin = Cesium.VerticalOrigin.CENTER;
                            cluster.label.disableDepthTestDistance = Number.POSITIVE_INFINITY;
                            cluster.label.pixelOffset = new Cesium.Cartesian2(0, 0);
                            cluster.label.eyeOffset = new Cesium.Cartesian3(0, 0, 0);


                            if (this_.options.style[xx].textstyle) {
                                for (var t in this_.options.style[xx].textstyle) {
                                    cluster.label[t] = this_.options.style[xx].textstyle[t]
                                }
                            }
                        } else {
                            cluster.label.show = false;
                        }
                    }
                );
            }

            // force a re-cluster with the new styling
            var pixelRange = this_.dataSources.clustering.pixelRange;
            this_.dataSources.clustering.pixelRange = 0;
            this_.dataSources.clustering.pixelRange = pixelRange;
        }
        customStyle();
    };

    drawImage(size, color) {
        if (this.clustericon[size + "_" + color]) {
            return this.clustericon[size + "_" + color];
        }
        var canvas = document.createElement("canvas");
        canvas.height = size;
        canvas.width = size;
        var ctx = canvas.getContext('2d');
        //画圈
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, true);
        ctx.fillStyle = color;
        ctx.closePath();
        ctx.fill();


        var canvasdataurl = canvas.toDataURL();
        this.clustericon[size + "_" + color] = canvasdataurl;
        return canvasdataurl;
    }
    remove() {
        this.viewer.dataSources.remove(this.dataSources)
        this.dataSources = null;
        this.clustericon = {};
    }
}
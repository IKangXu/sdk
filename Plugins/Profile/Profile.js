class Profile extends CTMap.Tool {
    reference() {
        this.html = "./profile.html";
        this.css = [];
        this.script = ['./echarts.js'];
    }
    init() {
        this.distance = null
        this.tempPoints = null
        this.plottingPosi = null
        this.entity = null;
        this.measureTool =  new CTMap.Measure(this.earth);
        this.earth.canvas.style.cursor = 'crosshair'
        this._addProfile()

    }

    _addProfile() {
        var earth = this.earth
        const that = this;
        //显示窗体
        document.getElementById('profileWrap').style.display = 'block';
        var container = that.earth.getCurrentTool().container
            container.style.top = '0'
        //关闭按钮
        document.getElementById('closeTool').onclick = function () {
            that.earth.setCurrentTool();
        };
        
        this.measureTool.measureSection({
            calback: showResult
        });

        function showResult(data) {
            if (!data.arrPoint)
                return;
            let geoPoints = [];
            for (let item of data.arrPoint) {
                geoPoints.push(Cesium.Cartographic.fromDegrees(item.x, item.y, item.z))
            }
            that.pointsObj = data.arrPoint;

            let url = that.formatURL('./jian2.png')
            that.entity = that.earth.entities.add({
                name: 'Blank blue pin',
                position: new CTMap.CallbackProperty(function () {
                    return that.plottingPosi;
                }, false),
                billboard: {
                    image: url,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                }
            });

            console.log("sdfsdfsdfsdfs");
 
            addEcharts(that, data.arrLen, geoPoints);
        }

        function addEcharts(that, points, updatedPoints) {
            var myChart = echarts.init(document.getElementById('content'));
            var option = null;

            var pointsHeight = [];
            for (const updatedPoint of updatedPoints) {
                pointsHeight.push(updatedPoint.height.toFixed(2))
            }

            //生成colorRange
            var colorRange = []
            for (let i = 500; i < 5000; i += 50) {
                colorRange.push(`rgba(0,138,235,${i / 5000})`)
            }

            //计算maxColor
            var maxColor = 0
            for (let i = 0; i < pointsHeight.length; i++) {
                if (parseInt(pointsHeight[i]) > maxColor) maxColor = pointsHeight[i]
            }

            option = {
                backgroundColor: 'rgb(49, 49, 49)',
                visualMap: [{
                    show: false,
                    type: 'continuous',
                    seriesIndex: 0,
                    min: 0,
                    max: maxColor,
                    inRange: {
                        color: colorRange,
                        symbolSize: [1, 4]
                    }
                }],
                grid: {
                    left: '20px',
                    right: '20px',
                    bottom: '10px',
                    top: '30px',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: points,
                    splitLine: {
                        show: false
                        // color: 'rgb(67,67,67)'
                    },
                    axisLine: {
                        lineStyle: {
                            color: 'rgb(101,101,101)',
                            width: 1
                        }
                    },
                    axisLabel: {
                        color: '#fff',
                        formatter: function (value, index) {
                            // 格式化成月/日，只在第一个刻度显示年份
                            let res = value + 'm'
                            if (value > 1000) {
                                res = (value / 1000).toFixed(1) + 'km'
                            }
                            return res;
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    splitLine: {
                        show: false
                        // color: 'rgb(67,67,67)'
                    },
                    axisLine: {
                        lineStyle: {
                            color: 'rgb(101,101,101)',
                            width: 1
                        }
                    },
                    axisLabel: {
                        color: '#fff',
                        formatter: '{value} m'
                    }

                },
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        // console.log(params)
                        let lonlat = that.pointsObj[params[0].dataIndex]
                        if (typeof (lonlat) !== 'undefined') {
                            that.plottingPosi = Cesium.Cartesian3.fromDegrees(lonlat.x, lonlat.y);
                        }

                        params = params[0];
                        var res = params.value + 'm'
                        return res;
                    },
                    axisPointer: {
                        type: 'line',
                        lineStyle: {
                            type: 'dashed',
                            color: 'rgb(133,222,222)'
                        }
                    }
                },

                series: [{
                    data: pointsHeight,
                    type: 'line',
                    smooth: true,
                    lineStyle: {
                        color: "rgb(63,158,255)"
                    },
                    areaStyle: {
                        normal: {}
                    }
                }]
            };
            if (option && typeof option === "object") {
                myChart.setOption(option);
            }
        }

    }
    remove() {
        this.earth.canvas.style.cursor = 'default';
        if (this.entity) {
            this.earth.entities.remove(this.entity)
        } 
        this.measureTool.clearMeasure();      
    }
}

//# sourceURL=Profile.js

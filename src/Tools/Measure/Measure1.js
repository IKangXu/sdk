
import DrawTool from "../Draw/DrawTool"
import Util from "../Draw/Util"
import DrawUtils from "../Draw/DrawUtils"

/**
 *空间测量类
 */
class Measure { 

    /**
     * 绘制类
     *
     * @alias Measure
     * @constructor
     *
     * @param {Object} viewer viewer对象
     * 
     * @example
     * 
     * 初始化测量工具
     * var tool = new Uninpho.Measure();
     * 
     *
     */
    constructor(viewer){
        this.mType = "";//当前正在绘制的类别 
        this.viewer = viewer;
        this._font = "16px SimHei"; //显示测量结果文本的字体
        let self = this;         
        //初始化绘制类
        this.drawControl = new DrawTool({
            viewer: this.viewer,
            hasEdit: false
        });
        this.dataSource = this.drawControl.getDataSource();      
        this._initWorker(this.dataSource);

        this.drawControl.onChangeDrawing =function(entity){
            switch (self.mType) {
                case "length":
                case "section":
                self.workLength.showAddPointLength(entity);
                    break;
                case "area":
                self.workArea.showAddPointLength(entity);
                    break;
                case "height":
                self.workHeight.showAddPointLength(entity);
                    break;
                case "super_height":
                self.workSuperHeight.showAddPointLength(entity);
                    break;
            }
        };
        this.drawControl.onMoveDrawing= function(entity){
            switch (self.mType) {
                case "length":
                case "section":
                self.workLength.showMoveDrawing(entity);
                    break;
                case "area":
                self.workArea.showMoveDrawing(entity);
                    break;
                case "height":
                self.workHeight.showMoveDrawing(entity);
                    break;
                case "super_height":
                self.workSuperHeight.showMoveDrawing(entity);
                    break;
            }
    
        };
        this.drawControl.onStopDrawing= function(entity){
            switch (self.mType) {
                case "length":
                case "section":
                self.workLength.showDrawEnd(entity);
                    break;
                case "area":
                self.workArea.showDrawEnd(entity);
                    break;
                case "height":
                self.workHeight.showDrawEnd(entity);
                    break;
                case "super_height":
                self.workSuperHeight.showDrawEnd(entity);
                    break;
            }
        };
        
    } 

    _initWorker(dataSource){
        let measureCtrl = this;

        this.workLength = {
            options: null,
            arrLables: [],      //各线段label
            totalLable: null,   //总长label 
            //清除未完成的数据
            clearLastNoEnd: function () {
                if (this.totalLable != null)
                    dataSource.entities.remove(this.totalLable);
                if (this.arrLables && this.arrLables.length > 0) {
                    var arrLables = this.arrLables;
                    if (arrLables && arrLables.length > 0) {
                        for (var i in arrLables) {
                            dataSource.entities.remove(arrLables[i]);
                        }
                    }
                }
                this.totalLable = null;
                this.arrLables = [];
            },
            //开始绘制
            start: function (options) {
                this.options = options;
    
                //总长label 
                this.totalLable = dataSource.entities.add({
                    label: {
                        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                        fillColor: Cesium.Color.AZURE,
                        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        pixelOffset: new Cesium.Cartesian2(0, -15),   //偏移量    
                        outlineColor: Cesium.Color.BLACK,
                        outlineWidth: 3,
                        font: measureCtrl._font,
                        show: false
                    },
                    isMarsMeasureLabel: true,
                    attribute: {
                        unit: this.options.unit,
                        type: this.options.type,
                    }
                });
                this.arrLables = [];
    
    
                measureCtrl.drawControl.startDraw({
                    type: "polyline",
                    addHeight: options.addHeight,
                    style: {
                        color: "#00FF00",
                        clampToGround: (this.options.type == "section" || this.options.terrain),//是否贴地
                        width: 3
                    }
                });
            },
            //绘制增加一个点后，显示该分段的长度
            showAddPointLength: function (entity) {
                var positions = measureCtrl.drawControl.getPositions(entity);
    
                var tempSingleLabel = dataSource.entities.add({
                    position: positions[positions.length - 1],
                    label: {
                        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                        fillColor: Cesium.Color.AZURE,
                        outlineColor: Cesium.Color.BLACK,
                        outlineWidth: 3,
                        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        pixelOffset: new Cesium.Cartesian2(0, -15),   //偏移量  
                        font: measureCtrl._font,
                        show: true
                    },
                    isMarsMeasureLabel: true,
                    attribute: {
                        unit: this.options.unit,
                        type: this.options.type,
                    }
                });
    
                if (positions.length == 1) {
                    tempSingleLabel.label.text = "起点";
                    //tempSingleLabel.attribute.value = 0;
                }
                else {
                    var distance = this.getLength(positions);
                    var distancestr = measureCtrl.formatLength(distance, this.options.unit);
    
                    tempSingleLabel.label.text = distancestr;
                    tempSingleLabel.attribute.value = distance;
    
                    //屏蔽比较小的数值
                    if (this.getLength([positions[positions.length - 2], positions[positions.length - 1]]) < 5)
                        tempSingleLabel.show = false;
                }
                this.arrLables.push(tempSingleLabel);
            },
            //绘制过程移动中，动态显示长度信息
            showMoveDrawing: function (entity) {
                var positions = measureCtrl.drawControl.getPositions(entity);
                if (positions.length < 2) return;
    
                var distance = this.getLength(positions);
                var distancestr = measureCtrl.formatLength(distance, this.options.unit);
    
                this.totalLable.position = positions[positions.length - 1];
                this.totalLable.label.text = "全长:" + distancestr;
                this.totalLable.label.show = true;
    
                this.totalLable.attribute.value = distance;
                this.totalLable.attribute.textEx = "全长:";
    
                if (this.options.calback)
                    this.options.calback(distancestr, distance);
            },
            //绘制完成后
            showDrawEnd: function (entity) {
                var positions = measureCtrl.drawControl.getPositions(entity);
                var count = this.arrLables.length - positions.length;
                if (count >= 0) {
                    for (var i = this.arrLables.length - 1; i >= positions.length - 1; i--) {
                        dataSource.entities.remove(this.arrLables[i]);
                    }
                    this.arrLables.splice(positions.length - 1, count + 1);
                }
                entity._totalLable = this.totalLable;
                entity._arrLables = this.arrLables;
    
                this.totalLable = null;
                this.arrLables = [];
    
                if (entity.polyline == null) return;
    
                if (this.options.type == "section")
                    this.updateSectionForTerrain(entity);
                else if (this.options.terrain)
                    this.updateLengthForTerrain(entity);
    
            },
            //计算贴地线
            updateLengthForTerrain: function (entity) {
                var that = this;
                var positions = entity.polyline.positions.getValue();
                var arrLables = entity._arrLables;
                var totalLable = entity._totalLable;
                var unit = totalLable && totalLable.unit;
    
                var index = 0;
                var positionsNew = [];
    
                function getLineFD() {
                    index++;
    
                    var arr = [positions[index - 1], positions[index]];
                    Util.terrainPolyline({
                        viewer: measureCtrl.viewer,
                        positions: arr,
                        calback: function (raisedPositions, noHeight) {
                            if (noHeight) {
                                if (index == 1)
                                    positionsNew = positionsNew.concat(arr);
                                else
                                    positionsNew = positionsNew.concat([positions[index]]);
                            }
                            else {
                                positionsNew = positionsNew.concat(raisedPositions);
                            }
    
                            if (index >= positions.length - 1) {
                                entity.polyline.positions.setValue(positionsNew);
                                if (totalLable) {
                                    var distance = that.getLength(positionsNew);
                                    var distancestr = measureCtrl.formatLength(distance, unit);
    
                                    totalLable.label.text = "全长:" + distancestr;
                                    totalLable.attribute.value = distance;
    
                                    if (that.options.calback)
                                        that.options.calback(distancestr, distance);
                                }
                            }
                            else {
                                var distance = that.getLength(raisedPositions);
                                var distancestr = measureCtrl.formatLength(distance, unit);
    
                                var thisLabel = arrLables[index];
                                thisLabel.label.text = distancestr;
                                thisLabel.attribute.value = distance;
    
                                getLineFD();
                            }
                        }
                    });
                }
                getLineFD();
            },
    
            //计算剖面
            updateSectionForTerrain: function (entity) {
                var positions = entity.polyline.positions.getValue();
                if (positions.length < 2) return;
    
                var arrLables = entity._arrLables;
                var totalLable = entity._totalLable;
                var unit = totalLable && totalLable.unit;
    
                var index = 0;
                var positionsNew = [];
    
                var alllen = 0;
                var arrLen = [];
                var arrHB = [];
                var arrLX = [];
                var arrPoint = [];
    
    
                var that = this;
                function getLineFD() {
                    index++;
    
                    var arr = [positions[index - 1], positions[index]];
                    Util.terrainPolyline({
                        viewer: measureCtrl.viewer,
                        positions: arr,
                        calback: function (raisedPositions, noHeight) {
                            if (noHeight) {
                                if (index == 1)
                                    positionsNew = positionsNew.concat(arr);
                                else
                                    positionsNew = positionsNew.concat([positions[index]]);
                            }
                            else {
                                positionsNew = positionsNew.concat(raisedPositions);
                            }
    
                            var h1 = Cesium.Cartographic.fromCartesian(positions[index - 1]).height;
                            var h2 = Cesium.Cartographic.fromCartesian(positions[index]).height;
                            var hstep = (h2 - h1) / raisedPositions.length;
    
                            for (var i = 0; i < raisedPositions.length; i++) {
                                //长度
                                if (i != 0) {
                                    alllen += Cesium.Cartesian3.distance(raisedPositions[i], raisedPositions[i - 1]);
                                }
                                arrLen.push(Number(alllen.toFixed(1)));
    
                                //海拔高度
                                var point = _latlng.formatPositon(raisedPositions[i]);
                                arrHB.push(point.z);
                                arrPoint.push(point);
    
                                //路线高度
                                var fxgd = Number((h1 + hstep * i).toFixed(1));
                                arrLX.push(fxgd);
                            }
    
    
                            if (index >= positions.length - 1) {
                                if (totalLable) {
                                    var distance = that.getLength(positionsNew);
                                    var distancestr = measureCtrl.formatLength(distance, unit);
    
                                    totalLable.label.text = "全长:" + distancestr;
                                    totalLable.attribute.value = distance;
                                }
                                if (that.options.calback)
                                    that.options.calback({
                                        distancestr: distancestr,
                                        distance: distance,
                                        arrLen: arrLen,
                                        arrLX: arrLX,
                                        arrHB: arrHB,
                                        arrPoint: arrPoint,
                                    });
                            }
                            else {
                                var distance = that.getLength(raisedPositions);
                                var distancestr = measureCtrl.formatLength(distance, unit);
    
                                var thisLabel = arrLables[index];
                                thisLabel.label.text = distancestr;
                                thisLabel.attribute.value = distance;
    
                                getLineFD();
                            }
                        }
                    });
                }
                getLineFD();
            },
            //计算长度，单位：米
            getLength: function (positions) {
                var distance = 0;
                for (var i = 0, len = positions.length - 1; i < len; i++) {
                    distance += Cesium.Cartesian3.distance(positions[i], positions[i + 1]);
                }
                return distance;
            }
        };
    
    
        this.workArea = {
            options: null,
            totalLable: null,  //面积label
            //清除未完成的数据
            clearLastNoEnd: function () {
                if (this.totalLable != null)
                    dataSource.entities.remove(this.totalLable);
                this.totalLable = null;
            },
            //开始绘制
            start: function (options) {
                this.options = options;
    
                this.totalLable = dataSource.entities.add({
                    label: {
                        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                        fillColor: Cesium.Color.AZURE,
                        outlineColor: Cesium.Color.BLACK,
                        outlineWidth: 3,
                        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        pixelOffset: new Cesium.Cartesian2(0, -15),   //偏移量  
                        font: measureCtrl._font,
                        show: false
                    },
                    isMarsMeasureLabel: true,
                    attribute: {
                        unit: this.options.unit,
                        type: this.options.type,
                    }
                });
    
                measureCtrl.drawControl.startDraw({
                    type: "polygon",
                    style: {
                        color: "#ffff00",
                        outline: true,
                        outlineColor: "#ffff00",
                        outlineWidth: 4,
                        opacity: 0.4,
                        perPositionHeight: false //贴地
                    }
                });
            },
            //绘制增加一个点后，显示该分段的长度
            showAddPointLength: function (entity) {
    
            },
            //绘制过程移动中，动态显示长度信息
            showMoveDrawing: function (entity) {
                var positions = measureCtrl.drawControl.getPositions(entity);
                if (positions.length < 3) return;
                var area = Util.getArea(positions);
                var areastr = measureCtrl.formatArea(area, this.options.unit);
    
                //求中心点 
               // var center = turf.centerOfMass(polygon); 
               var maxHeight = DrawUtils.getMaxHeightForPositions(positions);
               var cartograhphic = Cesium.Cartographic.fromCartesian(positions[0]);

               var lat=Cesium.Math.toDegrees(cartograhphic.latitude);
                var lng=Cesium.Math.toDegrees(cartograhphic.longitude);
               var ptcenter = Cesium.Cartesian3.fromDegrees(lng,lat, maxHeight + 1);
    
                this.totalLable.position = ptcenter;
                this.totalLable.label.text = "面积:" + areastr;
                this.totalLable.label.show = true;
    
                this.totalLable.attribute.value = area;
                this.totalLable.attribute.textEx = "面积:";
    
                if (this.options.calback)
                    this.options.calback(areastr, area);
            },
            //绘制完成后
            showDrawEnd: function (entity) {
                if (entity.polygon == null) return;
    
                var polyPositions = entity.polygon.hierarchy.getValue();
                polyPositions.map(item=>{
                    item.z = item.z + 1; 
                })
    
                entity._totalLable = this.totalLable;
                this.totalLable = null;
            },
        };
    
    
        this.workHeight = {
            options: null,
            totalLable: null,   //高度label  
            //清除未完成的数据
            clearLastNoEnd: function () {
                if (this.totalLable != null)
                    dataSource.entities.remove(this.totalLable);
                this.totalLable = null;
            },
            //开始绘制
            start: function (options) {
                this.options = options;
    
                this.totalLable = dataSource.entities.add({
                    label: {
                        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                        fillColor: Cesium.Color.AZURE,
                        outlineColor: Cesium.Color.BLACK,
                        outlineWidth: 3,
                        horizontalOrigin: Cesium.HorizontalOrigin.RIGHT,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        pixelOffset: new Cesium.Cartesian2(0, -15),   //偏移量  
                        font: measureCtrl._font,
                        show: false
                    },
                    isMarsMeasureLabel: true,
                    attribute: {
                        unit: this.options.unit,
                        type: this.options.type,
                    }
                });
    
                measureCtrl.drawControl.startDraw({
                    type: "polyline",
                    minMaxPoints: { min: 2, max: 2, isSuper: false },
                    style: {
                        color: "#ffff00",
                        width: 3
                    }
                });
            },
            //绘制增加一个点后，显示该分段的长度
            showAddPointLength: function (entity) {
    
    
            },
            //绘制过程移动中，动态显示长度信息
            showMoveDrawing: function (entity) {
                var positions = measureCtrl.drawControl.getPositions(entity);
                if (positions.length < 2) return;
    
                var cartographic = Cesium.Cartographic.fromCartesian(positions[0]);
                var cartographic1 = Cesium.Cartographic.fromCartesian(positions[1]);
                var height = Math.abs(cartographic1.height - cartographic.height);
                var heightstr = measureCtrl.formatLength(height, this.options.unit);
    
                this.totalLable.position = DrawUtils.getMidPosition(positions[0], positions[1]);
                this.totalLable.label.text = "高度差:" + heightstr;
                this.totalLable.label.show = true;
    
                this.totalLable.attribute.value = height;
                this.totalLable.attribute.textEx = "高度差:";
    
                if (this.options.calback)
                    this.options.calback(heightstr, height);
            },
            //绘制完成后
            showDrawEnd: function (entity) {
                entity._totalLable = this.totalLable;
                this.totalLable = null;
    
            }
        };
    
    
        this.workSuperHeight = {
            options: null,
            totalLable: null,   //高度差label
            xLable: null,       //水平距离label
            hLable: null,       //水平距离label
            //清除未完成的数据
            clearLastNoEnd: function () {
                if (this.totalLable != null)
                    dataSource.entities.remove(this.totalLable);
                if (this.xLable != null)
                    dataSource.entities.remove(this.xLable);
                if (this.hLable != null)
                    dataSource.entities.remove(this.hLable);
    
                this.totalLable = null;
                this.xLable = null;
                this.hLable = null;
            },
            //开始绘制
            start: function (options) {
                this.options = options;
    
                this.totalLable = dataSource.entities.add({
                    label: {
                        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                        fillColor: Cesium.Color.AZURE,
                        outlineColor: Cesium.Color.BLACK,
                        outlineWidth: 3,
                        font: measureCtrl._font,
                        show: false,
                        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                        verticalOrigin: Cesium.VerticalOrigin.CENTER,
                        pixelOffset: new Cesium.Cartesian2(10, 0),   //偏移量  
                    },
                    isMarsMeasureLabel: true,
                    attribute: {
                        unit: this.options.unit,
                        type: this.options.type,
                    }
                });
    
                this.xLable = dataSource.entities.add({
                    label: {
                        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                        fillColor: Cesium.Color.AZURE,
                        outlineColor: Cesium.Color.BLACK,
                        outlineWidth: 3,
                        font: measureCtrl._font,
                        show: false,
                        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        pixelOffset: new Cesium.Cartesian2(0, -15),   //偏移量   
                    },
                    isMarsMeasureLabel: true,
                    attribute: {
                        unit: this.options.unit,
                        type: this.options.type,
                    }
                });
    
                this.hLable = dataSource.entities.add({
                    label: {
                        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                        fillColor: Cesium.Color.AZURE,
                        outlineColor: Cesium.Color.BLACK,
                        outlineWidth: 3,
                        font: measureCtrl._font,
                        show: false,
                        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        pixelOffset: new Cesium.Cartesian2(0, -15),   //偏移量  
                    },
                    isMarsMeasureLabel: true,
                    attribute: {
                        unit: this.options.unit,
                        type: this.options.type,
                    }
                });
    
                measureCtrl.drawControl.startDraw({
                    type: "polyline",
                    minMaxPoints: { min: 2, max: 2, isSuper: true },
                    style: {
                        color: "#ffff00",
                        width: 3
                    }
                });
            },
            //绘制增加一个点后，显示该分段的长度
            showAddPointLength: function (entity) {
                var lonlats = measureCtrl.drawControl.getPositions(entity);
                if (lonlats.length == 4) {
                    var mouseEndPosition = lonlats[3].clone();
                    lonlats.pop();
                    lonlats.pop();
                    lonlats.pop();
                    lonlats.push(mouseEndPosition);
                }
    
                if (lonlats.length == 2) {
                    var zCartesian = DrawUtils.getZHeightPosition(lonlats[0], lonlats[1])
                    var hDistance = DrawUtils.getHDistance(lonlats[0], lonlats[1]);
                    if (hDistance > 3.0) {
                        lonlats.push(zCartesian);
                        lonlats.push(lonlats[0]);
                    }
                }
    
                this.showSuperHeight(lonlats);
            },
            //绘制过程移动中，动态显示长度信息
            showMoveDrawing: function (entity) {
                var lonlats = measureCtrl.drawControl.getPositions(entity);
                if (lonlats.length == 4) {
                    var mouseEndPosition = lonlats[3].clone();
                    lonlats.pop();
                    lonlats.pop();
                    lonlats.pop();
                    lonlats.push(mouseEndPosition);
                }
    
                if (lonlats.length == 2) {
                    var zCartesian = DrawUtils.getZHeightPosition(lonlats[0], lonlats[1])
                    var hDistance = DrawUtils.getHDistance(lonlats[0], lonlats[1]);
                    if (hDistance > 3.0) {
                        lonlats.push(zCartesian);
                        lonlats.push(lonlats[0]);
                    }
                }
                this.showSuperHeight(lonlats);
            },
            //绘制完成后
            showDrawEnd: function (entity) {
                entity._arrLables = [
                    this.totalLable,
                    this.hLable,
                    this.xLable
                ];
    
                this.totalLable = null;
                this.hLable = null;
                this.xLable = null;
            },
    
            /**
             *  高程测量
             * 由4个点形成的三角形（首尾点相同），计算该三角形三条线段的长度
             * @param {Array} positions 4个点形成的点数组
             */
            showSuperHeight: function (positions) {
                var vLength; //垂直距离
                var hLength; //水平距离
                var lLength; //长度
                var height;
                if (positions.length == 4) {
                    var midLPoint = DrawUtils.getMidPosition(positions[0], positions[1]);
                    var midXPoint, midHPoint;
                    var cartographic0 = Cesium.Cartographic.fromCartesian(positions[0]);
                    var cartographic1 = Cesium.Cartographic.fromCartesian(positions[1]);
                    var cartographic2 = Cesium.Cartographic.fromCartesian(positions[2]);
                    var tempHeight = cartographic1.height - cartographic2.height;
                    height = cartographic1.height - cartographic0.height;
                    lLength = Cesium.Cartesian3.distance(positions[0], positions[1]);
                    if (height > -1 && height < 1) {
                        midHPoint = positions[1];
                        this.updateSuperHeightLabel(this.totalLable, midHPoint, "高度差", height);
                        this.updateSuperHeightLabel(this.hLable, midLPoint, "长度", lLength);
                    } else {
                        if (tempHeight > -0.1 && tempHeight < 0.1) {
                            midXPoint = DrawUtils.getMidPosition(positions[2], positions[1]);
                            midHPoint = DrawUtils.getMidPosition(positions[2], positions[3]);
                            hLength = Cesium.Cartesian3.distance(positions[1], positions[2]);
                            vLength = Cesium.Cartesian3.distance(positions[3], positions[2]);
                        } else {
                            midHPoint = DrawUtils.getMidPosition(positions[2], positions[1]);
                            midXPoint = DrawUtils.getMidPosition(positions[2], positions[3]);
                            hLength = Cesium.Cartesian3.distance(positions[3], positions[2]);
                            vLength = Cesium.Cartesian3.distance(positions[1], positions[2]);
                        }
                        this.updateSuperHeightLabel(this.totalLable, midHPoint, "高度差", vLength);
                        this.updateSuperHeightLabel(this.xLable, midXPoint, "水平距离", hLength);
                        this.updateSuperHeightLabel(this.hLable, midLPoint, "长度", lLength);
                    }
                } else if (positions.length == 2) {
                    vLength = Cesium.Cartesian3.distance(positions[1], positions[0]);
                    var midHPoint = DrawUtils.getMidPosition(positions[0], positions[1]);
                    if (xLable.label.show) {
                        xLable.label.show = false;
                        hLable.label.show = false;
                    }
                    this.updateSuperHeightLabel(this.totalLable, midHPoint, "高度差", vLength);
                }
    
                var heightstr = measureCtrl.formatLength(vLength, this.options.unit);
                if (this.options.calback)
                    this.options.calback(heightstr, vLength);
            },
            /**
             * 超级 高程测量 显示标签
             * @param {Cesium.Label} currentLabel 显示标签
             * @param {Cesium.Cartesian3} postion 坐标位置
             * @param {String} type 类型("高度差"，"水平距离"，"长度")
             * @param {Object} value 值
             */
            updateSuperHeightLabel: function (currentLabel, postion, type, value) {
                if (currentLabel == null) return;
    
                currentLabel.position = postion;
                currentLabel.label.text = type + ":" + measureCtrl.formatLength(value, this.options.unit);
                currentLabel.label.show = true;
    
                currentLabel.attribute.value = value;
                currentLabel.attribute.textEx = type + ":";
            }
    
        };
    

    }
    

  
     /**
     * 长度测量.
     * @param {Object} [options] 配置如下.
     *
     */
    measuerLength(options) {
        this.endLastDraw();
        this.mType = "length";
        options = options || {};
        options.type =  this.mType ;
        if (!options.hasOwnProperty("terrain")) options.terrain = true;

        this.workLength.start(options);
    }


   
    /**
     * 坡度测量.
     * @param {Object} [options] 配置如下.
     *
     */
    measureSection(options) {
        this.endLastDraw();

        this.mType  = "section";
        options = options || {};
        options.type =  this.mType ;
        options.terrain = true;

        this.workLength.start(options);
    }


     /**
     * 面积测量.
     * @param {Object} [options] 配置如下.
     *
     */
    measureArea(options) {
        this.endLastDraw();

        this.mType  = "area";
        options = options || {};
        options.type =  this.mType ;

        this.workArea.start(options);
    };

    /**
     * 高度测量.
     * @param {Object} [options] 配置如下.
     *
     */
     measureHeight(options) {
        this.endLastDraw();

        options = options || {};      
        this.mType  = "height";
        options.type =  this.mType ;
        this.workHeight.start(options);
        
    }; 

    /**
     * 三角测量.
     * @param {Object} [options] 配置如下.
     *
     */
      measureTriangle(options) {
        this.endLastDraw();
        options = options || {};
        this.mType  = "super_height";
        options.type =  this.mType ;
        this.workSuperHeight.start(options);
        
    };


    //如果上次未完成绘制就单击了新的，清除之前未完成的。
    endLastDraw() {
        this.workLength.clearLastNoEnd();
        this.workArea.clearLastNoEnd();
        this.workHeight.clearLastNoEnd();
        this.workSuperHeight.clearLastNoEnd();
        this.drawControl.stopDraw();
    }
 
     /**
     * 清除测量.
     *
     */
    clearMeasure() {
        this.mType = "";
        this.endLastDraw();  
        this.drawControl.deleteAll();
    };


    /** 更新量测结果的单位  */
    updateUnit(thisType, unit) {
        var arr = this.dataSource.entities.values;
        for (var i in arr) {
            var entity = arr[i];
            if (entity.label && entity.isMarsMeasureLabel && entity.attribute && entity.attribute.value) {
                if (entity.attribute.type != thisType) continue;
                if (thisType == "area") {
                    entity.label.text._value = (entity.attribute.textEx || "") + this.formatArea(entity.attribute.value, unit);
                }
                else {
                    entity._label.text._value = (entity.attribute.textEx || "") + this.formatLength(entity.attribute.value, unit);
                }
            }
        }
    }
 
    /**  进行单位换算，格式化显示面积    */
    formatArea(val, unit) {
        if (val == null) return "";

        if (unit == null || unit == "auto") {
            if (val < 1000000)
                unit = "m";
            else
                unit = "km";
        }
        val = parseFloat(val);

        var valstr = "";
        switch (unit) {
            default:
            case "m":
                valstr = val.toFixed(2) + ' 平方米';
                break;
            case "km":
                valstr = (val / 1000000).toFixed(2) + ' 平方公里';
                break;
            case "mu":
                valstr = (val * 0.0015).toFixed(2) + ' 亩';
                break;
            case "ha":
                valstr = (val * 0.0001).toFixed(2) + ' 公顷';
                break;
        }

        return valstr;
    }

    /**  单位换算，格式化显示长度     */
     formatLength(val, unit) {
        if (val == null) return "";

        if (unit == null || unit == "auto") {
            if (val < 1000)
                unit = "m";
            else
                unit = "km";
        }
        val = parseFloat(val);
        var valstr = "";
        switch (unit) {
            default:
            case "m":
                valstr = val.toFixed(2) + ' 米';
                break;
            case "km":
                valstr = (val * 0.001).toFixed(2) + ' 公里';
                break;
            case "mile":
                valstr = (val * 0.00054).toFixed(2) + ' 海里';
                break;
            case "zhang":
                valstr = (val * 0.3).toFixed(2) + ' 丈';
                break;
        }
        return valstr;
    } 
}

export default Measure;
 
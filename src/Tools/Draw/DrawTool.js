import Drawutils from "./DrawUtils";
import BillboardControl from "./BillboardControl";
import PolylineControl from "./PolylineControl";
import PolylineExControl from "./PolylineExControl";

import PolygonControl from "./PolygonControl";
import ModelControl from "./ModelControl";
import LabelControl from "./LabelControl";
import WallControl from "./WallControl";
import RectangleControl from "./RectangleControl";
import PolylineVolumeControl from "./PolylineVolumeControl";
import EllipseControl from "./EllipseControl";
import EllipsoidControl from "./EllipsoidControl";
import PointControl from "./BillboardControl"; //todo 
import EventControl from "./EventControl";
import Util from "./Util";
import Config from "../../Utility/Config"


/*
 * 作者：zhuwz
 * 描述:对象绘制
 * 日期：2019.5.16
 */
class DrawTool {
    /**
     * 绘制类
     *
     * @alias DrawTool
     * @constructor
     *
     * @param {Object} [options] 配置项如下:
     * @param {Strng} [options.dragIcon='Assets/Images/plotIcon/marker/dragIcon.png'] 编辑后拖动的节点图标.
     * @param {Object} [options.onStopDrawing=null] 绘制结束事件.
     * @param {Object} [options.onStartEditing=null] 开始编辑事件. 
     * @param {Object} [options.onStopEditing=null] 停止标绘事件.
     * @param {Object} [options.onChangeEditing=null] 标绘对象改变事件.
     * @param {Boolean} [options.hasEdit=false] 绘制的对象是否可编辑.
     * 
     * @example
     * 
     * //初始化绘制工具
     * var tool = new Cesium.Draw( {
     *     hasEdit : true
     *      });
     * 
     *
     */
    constructor(viewer, options = {}) {
        this.control = {
            billboard: BillboardControl,
            label: LabelControl,
            ellipse: EllipseControl,
            polyline: PolylineControl,
            //polylineEx:PolylineExControl,
            polylineVolume: PolylineVolumeControl,
            polygon: PolygonControl,

            ellipsoid: EllipsoidControl,
            wall: WallControl,
            point: PointControl,
            rectangle: RectangleControl,
            model: ModelControl
        }

        this.defDragIcon = Cesium.defaultValue(options.dragIcon,Config.getResource('Assets/Images/plotIcon/marker/dragIcon.png'));

        this._onStopDrawing = options.onStopDrawing;
        this.onStartEditing = options.onStartEditing;
        this._onStopEditing = options.onStopEditing;
        this._onChangeEditing = options.onChangeEditing;

        this._onChangeDrawing = options.onChangeDrawing;
        this._onMoveDrawing = options.onMoveDrawing;

        this.options = options;

        this.viewer = viewer;
        this.scene = this.viewer.scene;

        this.dragIcon = this.defDragIcon;

        this.dataSource = new Cesium.CustomDataSource();
        this.viewer.dataSources.add(this.dataSource);
        this.currentEntity = null;
        this.arrEntity = [];
        this.eventCortol = new EventControl(this.viewer);

        //是否可以编辑
        this._hasEdit = false;
        this.hasEdit(options.hasEdit);

    }

    set onChangeDrawing(val) {
        this._onChangeDrawing = val;
    }

    set onMoveDrawing(val) {
        this._onMoveDrawing = val;
    }
    /**
     * 设置绘制停止事件.
     * @param {Object} val 回调事件.
     *
     */
    set onStopDrawing(val) {
        this._onStopDrawing = val;
    }
    /**
     * 设置编辑开始事件.
     * @param {Object}  val 回调事件.
     *
     */
    set onStartEditing(val) {
        this._onStartEditing = val;
    }
    /**
     * 设置编辑结束事件.
     * @param {Object}  val 回调事件.
     *
     */
    set onStopEditing(val) {
        this._onStopEditing = val;
    }
    /**
     * 设置编辑对象变化事件.
     * @param {Object}  val 回调事件.
     *
     */
    set onChangeEditing(val) {
        this._onChangeEditing = val;
    }

    /**
     * 设置对象是否可编辑.
     * @param {Boolean}  val 是否编辑
     *
     */
    hasEdit(val) {
        if (this._hasEdit != null && this._hasEdit == val) return;
        let onStopEditing = this._onStopEditing;
        this._hasEdit = val;
        let self = this;
        let eventCortol = this.eventCortol;

        if (val) {
            //初始化编辑相关事件
            eventCortol.createEditSelectHandler(function (pickedEntity) {

                //正在绘制中跳出
                if (self.currentEntity && self.currentEntity.inProgress)
                    return;

                if (pickedEntity !== self.currentEntity) {
                    if (self.currentEntity && self.currentEntity.stopEditing) {
                        self.currentEntity.stopEditing();
                        self.currentEntity = null;
                    }
                    self.currentEntity = pickedEntity;
                    if (self.currentEntity && self.currentEntity.startEditing) {
                        self.currentEntity.startEditing();
                    }
                } else {
                    if (self._onStopEditing && typeof (self._onStopEditing) == "function") {
                        self._onStopEditing(pickedEntity);
                    }
                }
            });
            eventCortol.createEditDraggerHandler();
        } else {
            this.stopDraw();
            eventCortol.destroyEditHandler();
        }
    }

    /**
     * 停止绘制.
     * @param {Object} noevent 回调函数返回绘制的对象
     *
     */
    stopDraw(noevent) {
        let currentEntity = this.currentEntity;
        let arrEntity = this.arrEntity;
        let dataSource = this.dataSource;
        //释放上次未完成的绘制
        this.eventCortol.destroyDrawHandler();
        if (currentEntity && currentEntity.inProgress) {
            currentEntity.stopDrawing(noevent);
            dataSource.entities.remove(currentEntity);
            this.removeArrayOne(arrEntity, currentEntity); //arrEntity.remove(currentEntity);
        }

        //释放在编辑的对象
        if (currentEntity && currentEntity.stopEditing) {
            currentEntity.stopEditing(noevent);
            currentEntity = null;
        }
        return this;
    }

    /**
     * 开始绘制.
     * @param {Object} option 绘制选项
     * 
     * @example
     * 
     * 绘制点标
     * 
     * //初始化绘图工具
     * var drawTool = new Uninpho.Draw();
     * //绘制点
     * var pointOption = {
			edittype: "imagepoint", //编辑类型
			style: {
				image: '../../../pointPlotting/icon/location_1.png',
				opacity: 1,
				rotation: 0,
				scale: 1,
				distanceDisplayCondition: false,
				distanceDisplayCondition_far: 10000,
				distanceDisplayCondition_near: 0,
				scaleByDistance: false,
				scaleByDistance_far: 1000000,
				scaleByDistance_farValue: 0.1,
				scaleByDistance_near: 1000,
				scaleByDistance_nearValue: 1,
				width: 35,
				height: 45
			},
			attr: { //属性信息
				id: "20181127103054",
				name: '点',
				remark: ''

			},
			name: "点",
			type: "billboard" // 绘制的对象类型
        };
         //开始绘制线标
        drawTool.startDraw(defLine);
        //绘制完成的回调函数       
        drawTool.onStopDrawing(function(entity){
            //write your code herer
        });
     * @example
     * 
     * 绘制线
     * 
     * 
     * var defLine = {
			attr: {  //默认属性
				id: "20181127104055",
				name: "线",
				remark: ""
			},
			edittype: "polyline",
			name: "线",
			style: { //样式信息
				clampToGround: false,
				color: "#3388ff",
				lineType: "solid",
				opacity: 1,
				outline: false,
				outlineColor: "#ffffff",
				outlineWidth: 2,
				width: 4
			},
			position: { 
				height: true,
				minCount: 2
			},
			type: "polyline" //绘制的类型
        };
        //开始绘制线标
        drawTool.startDraw(defLine);
        //绘制完成的回调函数
        drawTool.onStopDrawing(function(entity){
            //write your code herer
        });

    * @example
     * 
     * 绘制多边形    
     * 
     * var defPolygon= {
            attr:{
                id:"20181127103055",
                name:"面",
                remark:""
            },
            edittype:"polygon",//多边形类型
            name:"面",
            style:{ //默认样式
                color: "#3388ff",
                opacity: 0.6,
                outline: true,
                outlineColor: "#ffffff",
                outlineOpacity: 1,
                perPositionHeight: false
            },
            position:{
                height:true,
                minCount:3
            },
            type:"polygon" //多边形类型
        }
        //开始绘制线标
        drawTool.startDraw(defLine);
        //绘制完成的回调函数
        drawTool.onStopDrawing(function(entity){
            //write your code herer
        });

     * @example
     * 
     * 绘制体对象    
     * 
     * var defPolygonEx= {
            attr:{
                id: "20181127104055",
                name: "拉伸面", 
                remark: ""
            },
            edittype:"extrudedPolygon",
            name:"拉伸面",
            style:{
                color:"#00FF00",
                extrudedHeight:100,
                opacity:0.6,
                outline:true,
                outlineColor:"#ffffff",
                outlineOpacity:1,
                perPositionHeight:true
            },
            position:{
                height:true,
                minCount:3
            },
            type:"polygon"
        }
        //开始绘制线标
        drawTool.startDraw(defPolygonEx);
        //绘制完成的回调函数
        drawTool.onStopDrawing(function(entity){
            //write your  code herer
        });
     
     * @example
     * 
     * 绘制矩形对象    
     * 
     * 
     * var defRectangle= {
            attr:{
                id: "20181127104055",
                name: "矩形",
                type:"RectanglePlotting",
                remark: ""
            },
            edittype:"rectangle",
            name:"矩形",
            style:{
                color: "#3388ff",
                opacity:0.81,
                rotation:0
            },
            position:{
                height: false,
                minCount: 2,
                maxCount: 2
            },
            type:"rectangle"
        }
        //开始绘制线标
        drawTool.startDraw(defRectangle);
        //绘制完成的回调函数
        drawTool.onStopDrawing(function(entity){
            //write your  code herer
        });
           
     *
     */
    startDraw(option) {
        this.stopDraw();
        if (option == null || option.type == null) {
            throw '请传入需要绘制的类型参数';
            return;
        }

        option.style = option.style || {};
        option.attr = option.attr || {};

        let type = option.type;
        let control = this.control;
        let eventCortol = this.eventCortol;


        let dataSource = this.dataSource;

        if (control[type] == null) {
            throw '传入的[' + type + ']类型参数有误';
            return;
        }
        let entity = control[type].startDraw(dataSource, option);
        //uid 用于唯一标示对象
        entity.uid = entity.id;

        switch (type) {
            case "label":
            case "point":
            case "billboard":
            case "model":
            case "ellipse":
            case "ellipsoid": //点
                eventCortol.createDrawPointHandler(entity);
                break;
            case "polyline":
            case "polylineEx":
            case "polylineVolume": //线

                eventCortol.createDrawPolylineHandler(entity, control[type].getPositions(entity));
                break;
            case "polygon": //面
                eventCortol.createDrawPolygonHandler(entity, control[type].getPositions(entity));
                break;
            case "rectangle":
            case "extrudedRectangle":
            case "measureHeight": //两个点的对象
                eventCortol.createTwoPointsModelHandler(entity, control[type].getPositions(entity));
                break;
            case "wall": //墙
                let ePositions = control[type].getPositions(entity);
                let eMinimumHeights = control[type].getMinimumHeights(entity);
                let eMaximumHeights = control[type].getMaximumHeights(entity);
                eventCortol.createDrawWallHandler(entity, ePositions, eMinimumHeights, eMaximumHeights);
                break;
        }
        this.extendEntity(entity);
        this.arrEntity.push(entity);

        entity.startDrawing();
        this.currentEntity = entity;

        return entity;
    }
    /**
     * 加载goejson数据
     * @param {Object} json geojson字符串
     * @param {Object} isClear 是否清空已有的模型
     */
    fromJSON(json, isClear, isFly) {

        if (!json) return;
        let control = this.control;

        let jsonObjs = json;
        try {
            if (Util.isString(json))
                jsonObjs = JSON.parse(json);
        } catch (e) {
            console.error(e.name + ": " + e.message + " \n请确认json文件格式正确!!!");
            return;
        }
        if (isClear) {
            this.removeAll();
        }
        let arrthis = [];
        let jsonFeatures = jsonObjs.features;
        if (!jsonFeatures)
            return;
        for (var i = 0; i < jsonFeatures.length; i++) {
            let feature = jsonFeatures[i];

            if (!feature.properties || !feature.properties.type) {
                //非本身保存的外部其他geojson数据
                feature.properties = feature.properties || {};
                debugger
                switch (feature.geometry.type) {
                    case "MultiPolygon":
                    case "Polygon":
                        feature.properties.type = "polygon";
                        break;
                    case "MultiLineString":
                    case "LineString":
                        feature.properties.type = "polyline";
                        break;
                    case "MultiPoint":
                    case "Point":
                        feature.properties.type = "point";
                        break;
                }

            }

            var type = feature.properties.type;
            if (control[type] == null) {
                throw '数据无法识别或者数据的[' + type + ']类型参数有误';
                return;
            }
            feature.properties.style = feature.properties.style || {};

            var entity = control[type].startDraw(this.dataSource, feature.properties);
            //添加id值
            //-------------------
            //todo:重复的id会有Bug
            //-------------------
            entity.uid = feature.properties.id;
            var positions = Drawutils.getPositionsFromJson(feature.geometry);
            control[type].setPositions(entity, positions);
            this.extendEntity(entity);
            this.arrEntity.push(entity);

            arrthis.push(entity);
        }

        if (isFly)
            this.viewer.flyTo(arrthis);

        return arrthis;
    }

    /**
     * 将所有标绘对象导出为JSON数据
     * @param {Object} entity geojson字符串
     */
    toJSON(entity) {
        let arrEntity = this.arrEntity;
        let control = this.control;
        if (entity == null) { //全部数据
            if (arrEntity.length == 0) return null;

            var features = [];
            for (var i = 0; i < arrEntity.length; i++) {
                var entity = arrEntity[i];

                var type = entity.attribute.type;
                var geojson = control[type].toGeoJSON(entity);
                //添加id值
                geojson.properties.id = entity.uid;
                features.push(geojson);
            }
            var geojson = {
                type: "FeatureCollection",
                features: features
            };
            return geojson;
        } else {
            var type = entity.attribute.type;
            var geojson = control[type].toGeoJSON(entity);
            geojson.properties.id = entity.id;
            return geojson;
        }
    }

    /**
     * 加载标记信息json文件，一数组的字符串Array<Object>，
     * @private
     * @param {Object} json   
     * @param {Object} style  标记的样式
     * @param {Object} isClear  是否清空已有模型 
     */
    markersInfoToEntity(json, style, isClear) {
        let arr = json;
        try {
            if (Util.isString(json))
                arr = JSON.parse(json);
        } catch (e) {
            console.error(e.name + ": " + e.message + " \n请确认json文件格式正确!!!");
            return;
        }

        if (!(arr instanceof Array)) {
            console.error("请确认json文件格式正确!!!");
            return;
        }
        if (isClear) {
            removeAll();
        }

        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            if (!(item.x) || !(item.y)) {
                console.error(e.name + ": " + e.message + " \n请确认json文件格式正确!!!");
                return;
            }
            var attr = {
                id: item.id || item.ID || "",
                name: item.name || item.NAME || "",
                remark: item.remark || item.REMA || ""
            };
            var attribute = {
                type: style.type || "billboard",
                attr: attr,
                style: style.style
            };

            var markerPosition = Cesium.Cartesian3.fromDegrees(item.x, item.y, item.z || 0.0);
            var entity = this.control[attribute.type].startDraw(this.dataSource, attribute);
            this.control[attribute.type].setPositions(entity, markerPosition);
            this.extendEntity(entity);
            this.arrEntity.push(entity);
        }

        return this.arrEntity;
    }

    /**
     * 获取当前的标绘对象
     * @returns {Object} 当前的标绘对象
     */
    getCurrentEntity() {
        return this.currentEntity;
    }


    /**
     * 获取所有绘制的实体对象列表
     * @returns {Array} 实体对象列表
     */
    getEntitys() {
        return this.arrEntity;
    }


    /**
     * 通过id获取实体对象列表
     * @returns {Object} 实体对象
     */
    getEntityById(id) {
        for (var i = 0; i < this.arrEntity.length; i++) {
            var entity = this.arrEntity[i];
            if (id == entity.uid) {
                return entity;
            }
        }
        return null;
    }

    /**
     * 删除所有标绘对象
     */
    removeAll() {
        this.stopDraw();
        this.dataSource.entities.removeAll();
        this.arrEntity = [];
    }
    /**
     * 设置标绘图层是否可见
     *  @param {Boolean} visible 是否可见
     */
    setVisible(visible) {
        var dataSource = this.dataSource;
        var arrEntity = this.arrEntity;

        arrEntity.forEach(function (i, item) {
            if (visible) {
                if (!dataSource.entities.contains(item))
                    dataSource.entities.add(item);
            } else {
                if (dataSource.entities.contains(item))
                    dataSource.entities.remove(item);
            }
        });
    }
    /**
     * 删除标绘对象
     *  @param {Object} entity 需要删除的对象
     */
    deleteEntity(entity) {
        if (entity == null) return;
        entity.stopEditing(true);
        this.removeArrayOne(this.arrEntity, entity); //arrEntity.remove(entity);
        this.dataSource.entities.remove(entity);
    }


    /**
     * @private
     */
    hasDraw() {
        return this.arrEntity.length > 0;
    }
    /**
     * @private
     * 获取数据源
     */
    getDataSource() {
        return this.dataSource;
    }
    /**
     * @private
     * 获取实体的经纬度值 坐标数组
     */
    getCoordinates(entity) {
        var type = entity.attribute.type;
        var positions = this.control[type].getCoordinates(entity);
        return positions;
    }


    /**
     * @private
     * 获取实体的坐标数组
     */
    getPositions(entity) {
        var type = entity.attribute.type;
        var positions = this.control[type].getPositions(entity);
        return positions;
    }

    /**
     * @private
     * 设置实体的坐标数组
     */
    setPositions(entity, positions) {
        var type = entity.attribute.type;
        this.control[type].setPositions(entity, positions);
    }
    /**
     * @private
     * 删除当前entity
     */
    deleteCurrentEntity() {
        var currentEntity = this.currentEntity;
        var dataSource = this.dataSource;
        if (currentEntity) {
            currentEntity.stopEditing(true);
            this.removeArrayOne(this.arrEntity, currentEntity); //arrEntity.remove(currentEntity); 
            dataSource.entities.remove(currentEntity);
            currentEntity = null;
        }
    }

    /**
     * @private
     * 修改了属性
     */
    updateAttribute(attribute, entity) {
        var control = this.control;
        var currentEntity = this.currentEntity;
        if (entity != null)
            currentEntity = entity;

        if (currentEntity == null || attribute == null) return;
        attribute.style = attribute.style || {};
        attribute.attr = attribute.attr || {};

        var type = currentEntity.attribute.type;
        control[type].attribute2Entity(attribute, currentEntity[type]);
        if (type == "model")
            control[type].attribute2Model(attribute, currentEntity);
        currentEntity.attribute = attribute;

        if (type == "ellipse" || type == "polygon" || type == "wall" || type == "rectangle") {
            currentEntity.editor.updateDraggers();
        }
        return currentEntity;
    }


    /**
     * @private
     * 修改坐标、高程
     */
    updateGeometry(positions, entity) {

        var dragIcon = this.dragIcon;
        var control = this.control;
        if (entity == null) entity = this.currentEntity;
        if (entity == null || positions == null) return;
        var type = entity.attribute.type;

        control[type].setPositions(entity, positions);

        if (entity.editor && entity.editor.destroy) {

            entity.editor.destroy();
            var type1 = entity.attribute.type;
            entity.editor = control[type1].getEditor(dataSource, entity, {
                dragIcon: dragIcon
            });
        }

        return entity;
    }

    /**
     * @private
     * 扩展entity实体，绑定一些方法
     */
    extendEntity(entity) {

        var control = this.control;
        var _hasEdit = this._hasEdit;
        var dataSource = this.dataSource;
        var self = this;

        var dragIcon = this.dragIcon;
        //绘制开始、修改、结束
        entity.startDrawing = function () {
            //修改鼠标样式
            //$('.cesium-viewer').css('cursor', 'crosshair');

            var entity = this;
            if (self._onStartDrawing && typeof (self._onStartDrawing) == "function") {
                self._onStartDrawing(entity);
            }
        };
        entity.changeDrawing = function () {
            var entity = this;
            if (self._onChangeDrawing && typeof (self._onChangeDrawing) == "function") {
                self._onChangeDrawing(entity);
            }
        };
        entity.moveDrawing = function () {
            var entity = this;
            if (self._onMoveDrawing && typeof (self._onMoveDrawing) == "function") {
                self._onMoveDrawing(entity);
            }
        };
        entity.stopDrawing = function () {
            //恢复鼠标样式
            //$('.cesium-viewer').css('cursor', '');

            var entity = this;
            if (self._onStopDrawing && typeof (self._onStopDrawing) == "function") {
                self._onStopDrawing(entity);
            }
        };

        //编辑开始、修改、结束
        entity.startEditing = function () {
            if (!self._hasEdit) return;

            var entity = this;
            self.currentEntity = entity;

            //绑定编辑器
            if (entity.editor == null) {
                var type = entity.attribute.type;
                entity.editor = control[type].getEditor(dataSource, entity, {
                    dragIcon: dragIcon
                });
            }

            if (self._onStartEditing && typeof (self._onStartEditing) == "function") {
                self._onStartEditing(entity);
            }
        };

        entity.stopEditing = function (noevent) {
            var entity = this;

            //释放编辑器
            if (entity.editor) {
                entity.editor.destroy();
                entity.editor = null;
            }

            if (!noevent && self._onStopEditing && typeof (self._onStopEditing) == "function") {
                self._onStopEditing(entity);
            }
        };

        entity.changeEditing = function () {
            var entity = this;
            if (self._onChangeEditing && typeof (self._onChangeEditing) == "function") {
                self._onChangeEditing(entity);
            }
        };

        entity.updatePositions = function (positions) {
            var entity = this;
            var type = entity.attribute.type;
            if (type == "ellipse") {
                var height = Cesium.Cartographic.fromCartesian(positions).height;
                entity.attribute.style.height = Number(height.toFixed(2));
                if (entity.ellipse.height)
                    entity.ellipse.height._value = entity.attribute.style.height;
                else
                    entity.ellipse.height = entity.attribute.style.height;
                if (entity.attribute.style.extrudedHeight) {
                    var extrudedHeight = Number(height) + Number(entity.attribute.style.extrudedHeight);
                    entity.ellipse.extrudedHeight._value = Number(extrudedHeight.toFixed(2));
                    entity.attribute.style.extrudedHeight = Number(extrudedHeight.toFixed(2));
                }
            }
            control[type].setPositions(self.currentEntity, positions);
        }
    }


    /**
     * @private
     * 删除数组的1个
     */
    removeArrayOne(arr, val) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == val) {
                arr.splice(i, 1);
                break;
            }
        }
    }



}
export default DrawTool
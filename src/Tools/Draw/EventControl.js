 
import DrawUtils from "./DrawUtils"; 
import Latlng from "./Latlng";

export default class EventControl {
    constructor(viewer) {
        this.viewer = viewer;
        // 禁用默认的实体双击动作。
        viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);

    }

    setCursor (style) {
        document.getElementById(this.viewer._container.id).style.cursor = style || '';
    }
    /**
      * 【绘制】单个坐标点的对象（点、字）绘制处理程序，绑定单击事件 
      */
    createDrawPointHandler (entity) {
        this.setCursor('crosshair');

        var that = this;
        entity.inProgress = true;
        var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        handler.setInputAction(function (event) {
            var cartesian = Latlng.getCurrentMousePosition(that.viewer.scene, event.position);
            if (cartesian) {
                that.setCursor();

                entity.updatePositions(cartesian);
                entity.inProgress = false;
                entity.stopDrawing();
                entity.startEditing();
                handler.destroy();
                that.drawHandler = null;
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        //记录最近一次值 
        this.drawHandler = handler;
        return handler;
    };

    /**
     *多个坐标点的对象（线）绘制处理程序，绑定单击、鼠标移动、双击事件
     * Creates a handler that lets you modify a list of positions.
     */
    createDrawPolylineHandler (entity, positions) {
        this.setCursor('crosshair');
        var that = this;

        entity.inProgress = true;
        var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);

        // Adds a point to the positions list.
        handler.lastPointTemporary = false;
        handler.setInputAction(function (event) {
            var cartesian = Latlng.getCurrentMousePosition(that.viewer.scene, event.position);
            if (cartesian) {
                if (handler.lastPointTemporary) {
                    positions.pop();
                }
                if (entity.attribute && entity.attribute.addHeight)////在绘制点基础自动增加高度
                    cartesian =  DrawUtils.getPositionsWithHeight(cartesian, entity.attribute.addHeight);

                positions.push(cartesian);

                handler.lastPointTemporary = false;
                if (entity.attribute && entity.attribute.minMaxPoints) {
                    if ((positions.length == entity.attribute.minMaxPoints.min &&
                        positions.length == entity.attribute.minMaxPoints.max) ||
                        (entity.attribute.minMaxPoints.isSuper && positions.length == 4)) {
                        entity.inProgress = false;
                        handler.destroy();
                        that.drawHandler = null;
                        entity.stopDrawing();
                        entity.startEditing();
                        that.setCursor();
                    }

                }
                entity.changeDrawing();
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        // Replaces the last point in the list with the point under the mouse.
        handler.setInputAction(function (event) {
            if (event.endPosition) {
                var cartesian = Latlng.getCurrentMousePosition(that.viewer.scene, event.endPosition);
                if (cartesian) {
                    if (handler.lastPointTemporary) {
                        positions.pop();
                    }
                    positions.push(cartesian);
                    handler.lastPointTemporary = true;
                    entity.moveDrawing();
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        handler.setInputAction(function (event) {
            entity.inProgress = false;
            handler.destroy();
            that.drawHandler = null;

            positions.pop();//必要代码 消除双击带来的多余经纬度 

            entity.stopDrawing();
            entity.startEditing();
            that.setCursor();

        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK );

        //记录最近一次值 
        this.drawHandler = handler;

        return handler;
    };

    /**
     * 面绘制处理程序，绑定单击、鼠标移动、双击事件
     * Creates a handler that lets you modify a list of positions.
     */
    createDrawPolygonHandler (entity, positions) {
        this.setCursor('crosshair');
        var that = this;

        entity.inProgress = true;
        var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);

        // Adds a point to the positions list.
        handler.lastPointTemporary = false;
        handler.setInputAction(function (event) {
            var cartesian = Latlng.getCurrentMousePosition(that.viewer.scene, event.position);
            if (cartesian) {
                if (handler.lastPointTemporary) {
                    positions.pop();
                }
                positions.push(cartesian);

                if (entity.attribute.style.extrudedHeight) {
                    //存在extrudedHeight高度设置时
                    var maxHight =  DrawUtils.getMaxHeightForPositions(positions);
                    entity.polygon.extrudedHeight = maxHight + Number(entity.attribute.style.extrudedHeight);
                }

                handler.lastPointTemporary = false;
                entity.changeDrawing();
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        // Replaces the last point in the list with the point under the mouse.
        handler.setInputAction(function (event) {
            if (event.endPosition) {
                var cartesian = Latlng.getCurrentMousePosition(that.viewer.scene, event.endPosition);
                if (cartesian) {
                    if (handler.lastPointTemporary) {
                        positions.pop();
                    }
                    positions.push(cartesian);

                    if (entity.attribute.style.extrudedHeight) {
                        //存在extrudedHeight高度设置时
                        var maxHight =  DrawUtils.getMaxHeightForPositions(positions);
                        entity.polygon.extrudedHeight = maxHight + Number(entity.attribute.style.extrudedHeight);
                    }

                    handler.lastPointTemporary = true;
                    entity.moveDrawing();
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        handler.setInputAction(function (event) {
            entity.inProgress = false;
            handler.destroy();
            that.drawHandler = null;

            positions.pop();//必要代码 消除双击带来的多余经纬度 

            entity.stopDrawing();
            entity.startEditing();
            that.setCursor();

        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

        //记录最近一次值 
        this.drawHandler = handler;

        return handler;
    };

    /**
     * Cesium矩形，绑定单击、鼠标移动、双击事件;
     * Creates a handler that lets you modify a list of positions.
     */
    createTwoPointsModelHandler  (entity, coordinates) {
        this.setCursor('crosshair');
        var that = this;
        entity.inProgress = true;
        var positions = [];
        var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        handler.lastPointTemporary = false;
        handler.setInputAction(function (event) {
            var cartesian = Latlng.getCurrentMousePosition(that.viewer.scene, event.position);
            if (cartesian) {
                if (handler.lastPointTemporary) {
                    positions.pop();
                }
                positions.push(cartesian);
                if (positions.length == 1 && entity.attribute.style.extrudedHeight) {
                    var modelHeight = Number(Cesium.Cartographic.fromCartesian(cartesian).height).toFixed(2);
                    entity.rectangle.height = Number(modelHeight);
                    entity.rectangle.extrudedHeight = Number(modelHeight) + Number(entity.attribute.style.extrudedHeight);
                    entity.attribute.style.height = Number(modelHeight);
                }

                if (positions.length == 2) {
                    var coord = Cesium.Rectangle.fromCartesianArray(positions);
                    coordinates.setValue(coord);
                }
                handler.lastPointTemporary = false;
                entity.changeDrawing();

                if (positions.length == 2) {
                    entity.inProgress = false;
                    handler.destroy();
                    that.drawHandler = null;
                    //				positions.pop();//必要代码 消除双击带来的多余经纬度 
                    entity.stopDrawing();
                    entity.startEditing();
                    that.setCursor();
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        // Replaces the last point in the list with the point under the mouse.
        handler.setInputAction(function (event) {
            if (event.endPosition) {
                var cartesian = Latlng.getCurrentMousePosition(that.viewer.scene, event.endPosition);
                if (cartesian) {
                    if (handler.lastPointTemporary) {
                        positions.pop();
                    }
                    positions.push(cartesian);
                    if (positions.length == 2) {
                        var coord = Cesium.Rectangle.fromCartesianArray(positions);
                        coordinates.setValue(coord);
                    }
                    handler.lastPointTemporary = true;
                    entity.moveDrawing();
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        //记录最近一次值 
        this.drawHandler = handler;
        return handler;
    }

    /**
     * Cesium墙体，绑定单击、鼠标移动、双击事件;
     * 除记录墙体的鼠标拾取的坐标外,还需记录顶部和底部的高程,并赋值给墙体Entity
     * Creates a handler that lets you modify a list of positions.
     */
    createDrawWallHandler (entity, positions, minimumHeights, maximumHeights) {
        this.setCursor('crosshair');
        var that = this;

        entity.inProgress = true;
        var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);

        // Adds a point to the positions list.
        handler.lastPointTemporary = false;
        handler.setInputAction(function (event) {
            var cartesian = Latlng.getCurrentMousePosition(that.viewer.scene, event.position);
            if (cartesian) {
                if (handler.lastPointTemporary) {
                    positions.pop();
                    minimumHeights.pop();
                    maximumHeights.pop();
                }
                positions.push(cartesian);
                var cartoPs = Cesium.Cartographic.fromCartesian(cartesian);
                var minHeight = Number(cartoPs.height).toFixed(2);
                var maxHeight = Number(minHeight) + Number(entity.attribute.style.extrudedHeight);
                minimumHeights.push(minHeight);
                maximumHeights.push(maxHeight);
                handler.lastPointTemporary = false;

                entity.changeDrawing();
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        // Replaces the last point in the list with the point under the mouse.
        handler.setInputAction(function (event) {
            if (event.endPosition) {
                //var cartesian = this.viewer.camera.pickEllipsoid(event.endPosition, this.viewer.scene.globe.ellipsoid);
                var cartesian = Latlng.getCurrentMousePosition(that.viewer.scene, event.endPosition);
                if (cartesian) {
                    if (handler.lastPointTemporary) {
                        positions.pop();
                        minimumHeights.pop();
                        maximumHeights.pop();
                    }
                    positions.push(cartesian);
                    var cartoPs = Cesium.Cartographic.fromCartesian(cartesian);
                    var minHeight = Number(cartoPs.height).toFixed(2);
                    var maxHeight = Number(minHeight) + Number(entity.attribute.style.extrudedHeight);
                    minimumHeights.push(minHeight);
                    maximumHeights.push(maxHeight);

                    handler.lastPointTemporary = true;
                    entity.moveDrawing();
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        handler.setInputAction(function (event) {
            entity.inProgress = false;
            handler.destroy();
            that.drawHandler = null;

            positions.pop();//必要代码 消除双击带来的多余经纬度 
            minimumHeights.pop();
            maximumHeights.pop();

            entity.stopDrawing();
            entity.startEditing();
            that.setCursor();
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

        //记录最近一次值 
        this.drawHandler = handler;

        return handler;
    };

    /**
     * 释放未完成的创建绘制
     */
    destroyDrawHandler () {
        this.setCursor();
        if (this.drawHandler) {
            this.setCursor();
            this.drawHandler.destroy();
            this.drawHandler = null;
        }
    };

    /**
     * 绑定左键单击事件[选中激活编辑+单击空白处取消编辑]
     */
    createEditSelectHandler  (calback) {

        var that = this;
        var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
        handler.setInputAction(function (e) {
            var picked = that.viewer.scene.pick(e.position);
            var pickedEntity = null;
            if (Cesium.defined(picked)) {
                var id = Cesium.defaultValue(picked.id, picked.primitive.id);
                if (id instanceof Cesium.Entity) {
                    var inProgress = Cesium.defaultValue(id.inProgress, false);
                    if (!inProgress) {
                        pickedEntity = id;
                    }
                }
            }

            calback(pickedEntity);//回调

        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        this.selectHandler = handler;
    };

    /**
     * 【编辑】将协助选择和拖动编辑绑定的拖动到，实体对象 
     * Initialize the utility handler that will assist in selecting and manipulating Dragger billboards.
     */
    createEditDraggerHandler () {
        var draggerHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
        draggerHandler.dragger = null;

        var that = this;
        // Left down selects a dragger
        draggerHandler.setInputAction(function (click) {
            var pickedObject = that.viewer.scene.pick(click.position);
            if (Cesium.defined(pickedObject)) {
                var entity = pickedObject.id;
                if (entity && Cesium.defaultValue(entity._isDragger, false)) {
                    // Resize the dragger.
                    if (entity.point) {

                       // entity.billboard.scale_src = entity.billboard.scale._value;
                       // entity.billboard.scale._value = entity.billboard.scale_src * 1.2;

                       entity.point.color=Cesium.Color.RED;
                       entity.point.pixelSize=10;


                    }

                    draggerHandler.dragger = entity;
                    that.viewer.scene.screenSpaceCameraController.enableRotate = false;
                    that.viewer.scene.screenSpaceCameraController.enableTilt = false;
                    that.viewer.scene.screenSpaceCameraController.enableTranslate = false;
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

        // Left down selects a dragger
        draggerHandler.setInputAction(function (click) {
            var pickedObject = that.viewer.scene.pick(click.position);
            if (Cesium.defined(pickedObject)) {
                var entity = pickedObject.id;
                if (entity && Cesium.defaultValue(entity._isDragger, false)) {
                    // Resize the dragger.    
                    if (entity.billboard) {


                        entity.billboard.scale_src = entity.billboard.scale._value;
                        entity.billboard.scale._value = entity.billboard.scale_src * 1.2;

                        // entity.point.color=Cesium.Color.RED;
                        // entity.point.outlineColor=Cesium.Color.WHITE;
                        // entity.point.pixelSize=10;

                    }

                    draggerHandler.dragger = entity;
                    that.viewer.scene.screenSpaceCameraController.enableRotate = false;
                    that.viewer.scene.screenSpaceCameraController.enableTilt = false;
                    that.viewer.scene.screenSpaceCameraController.enableTranslate = false;
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN, Cesium.KeyboardEventModifier.CTRL);

        // Mouse move drags the draggers and calls their onDrag callback.
        draggerHandler.setInputAction(function (event) {
            if (draggerHandler.dragger) {
                if (draggerHandler.dragger.horizontal) {

                    var hit;
                    if (draggerHandler.dragger.model) {  //点

                        //在模型上提取坐标
                        var scene = that.viewer.scene;
                        var pickobject = scene.pick(event.endPosition);
                        if (Cesium.defined(pickobject) && pickobject.id == draggerHandler.dragger) {
                            var pickRay = scene.camera.getPickRay(event.endPosition); //提取鼠标点的地理坐标
                            hit = scene.globe.pick(pickRay, scene);
                        }
                    }

                    //var hit = this.viewer.camera.pickEllipsoid(event.endPosition);
                    if (hit == null)
                        hit = Latlng.getCurrentMousePosition(that.viewer.scene, event.endPosition);

                    if (hit) {
                        draggerHandler.dragger.position = hit;
                        if (draggerHandler.dragger.onDrag) {
                            draggerHandler.dragger.onDrag(draggerHandler.dragger, hit);
                        }
                    }
                }

                if (draggerHandler.dragger.vertical) {
                    var dy = event.endPosition.y - event.startPosition.y;
                    var position = draggerHandler.dragger.position._value;
                    var tangentPlane = new Cesium.EllipsoidTangentPlane(position);

                    scratchBoundingSphere.center = position;
                    scratchBoundingSphere.radius = 1;

                    var metersPerPixel = that.viewer.scene.frameState.camera.getPixelSize(scratchBoundingSphere,
                                that.viewer.scene.frameState.context.drawingBufferWidth,
                                that.viewer.scene.frameState.context.drawingBufferHeight);

                    var zOffset = new Cesium.Cartesian3();

                    Cesium.Cartesian3.multiplyByScalar(tangentPlane.zAxis, -dy * metersPerPixel, zOffset);
                    var newPosition = Cesium.Cartesian3.clone(position);
                    Cesium.Cartesian3.add(position, zOffset, newPosition);

                    draggerHandler.dragger.position = newPosition;
                    if (draggerHandler.dragger.onDrag) {
                        draggerHandler.dragger.onDrag(draggerHandler.dragger, newPosition);
                    }
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        var scratchBoundingSphere = new Cesium.BoundingSphere();

        // Mouse move drags the draggers and calls their onDrag callback.
        draggerHandler.setInputAction(function (event) {
            if (draggerHandler.dragger && draggerHandler.dragger.verticalCtrl) {
                var dy = event.endPosition.y - event.startPosition.y;
                var position = draggerHandler.dragger.position._value;
                var tangentPlane = new Cesium.EllipsoidTangentPlane(position);

                scratchBoundingSphere.center = position;
                scratchBoundingSphere.radius = 1;

                var metersPerPixel = that.viewer.scene.frameState.camera.getPixelSize(scratchBoundingSphere,
                                                                                 that.viewer.scene.frameState.context.drawingBufferWidth,
                                                                                that.viewer.scene.frameState.context.drawingBufferHeight);

                var zOffset = new Cesium.Cartesian3();

                Cesium.Cartesian3.multiplyByScalar(tangentPlane.zAxis, -dy * metersPerPixel, zOffset);
                var newPosition = Cesium.Cartesian3.clone(position);
                Cesium.Cartesian3.add(position, zOffset, newPosition);

                draggerHandler.dragger.position = newPosition;
                if (draggerHandler.dragger.onDrag) {
                    draggerHandler.dragger.onDrag(draggerHandler.dragger, newPosition);
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE, Cesium.KeyboardEventModifier.CTRL);

        // Left up stops dragging.
        draggerHandler.setInputAction(function () {
            if (draggerHandler.dragger) {
                if (draggerHandler.dragger.billboard||draggerHandler.dragger.model||draggerHandler.dragger.label) {
                    if(draggerHandler.dragger.billboard){
                        //恢复大小
                        draggerHandler.dragger.billboard.scale._value = draggerHandler.dragger.billboard.scale_src;
                    }
                    else if (draggerHandler.dragger.model){
                         //恢复大小
                        //draggerHandler.dragger.model;
                    }
                    else if (draggerHandler.dragger.label){
                        //恢复大小
                       //draggerHandler.dragger.model;
                   }
                    draggerHandler.dragger._isDragger =false;
                }

                draggerHandler.dragger = null;
                that.viewer.scene.screenSpaceCameraController.enableRotate = true;
                that.viewer.scene.screenSpaceCameraController.enableTilt = true;
                that.viewer.scene.screenSpaceCameraController.enableTranslate = true;
            }
        }, Cesium.ScreenSpaceEventType.LEFT_UP);

        // Left up stops dragging.
        draggerHandler.setInputAction(function () {
            if (draggerHandler.dragger) {
                if (draggerHandler.dragger.billboard||draggerHandler.dragger.model||draggerHandler.dragger.label) {
                    if(draggerHandler.dragger.billboard){
                        //恢复大小
                        draggerHandler.dragger.billboard.scale._value = draggerHandler.dragger.billboard.scale_src;
                    }
                    else if (draggerHandler.dragger.model){
                         //恢复大小
                        //draggerHandler.dragger.model;
                    }
                    else if (draggerHandler.dragger.label){
                        //恢复大小
                       //draggerHandler.dragger.model;
                   }
                    draggerHandler.dragger._isDragger =false;
                }

                draggerHandler.dragger = null;
                that.viewer.scene.screenSpaceCameraController.enableRotate = true;
                that.viewer.scene.screenSpaceCameraController.enableTilt = true;
                that.viewer.scene.screenSpaceCameraController.enableTranslate = true;
            }
        }, Cesium.ScreenSpaceEventType.LEFT_UP, Cesium.KeyboardEventModifier.CTRL);

        this.draggerHandler = draggerHandler;
    }

    destroyEditHandler () {

        if (this.selectHandler) {
            this.selectHandler.destroy();
            this.selectHandler = null;
        }

        if (this.draggerHandler) {
            this.draggerHandler.destroy();
            this.draggerHandler = null;
        }
    };





}
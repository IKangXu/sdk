 
import DrawUtils from "./DrawUtils";

export default class ExtrudedPolygonEditor {

    constructor(dataSource, entity, options) {
        this.dataSource = dataSource;
        this.entity = entity;
        this.draggers = [];
        this.heightDraggers = [];

        var that = this;
        var i = 0;
        var positions = entity.polygon.hierarchy._value;
        //entity.polygon.hierarchy.isConstant = false;
        for (i = 0; i < positions.length; i++) {
            var loc = positions[i];
            if (entity.polygon.height != undefined) {
                var carto = Cesium.Cartographic.fromCartesian(loc);
                carto.height += entity.polygon.height._value;
                loc = Cesium.Cartesian3.fromRadians(carto.longitude, carto.latitude, carto.height);
            }

            var dragger = DrawUtils.createDragger(this.dataSource, {
                dragIcon: options.dragIcon,
                position: loc,
                onDrag: function (dragger, position) {
                    dragger.positions[dragger.index] = position;

                    var entityPositions = entity.polygon.hierarchy._value;
                    var extrudedPs = entityPositions[0];
                    for (var i = 1; i < entityPositions.length; i++) {
                        var tempCarto1 = Cesium.Cartographic.fromCartesian(extrudedPs);
                        var tempCarto2 = Cesium.Cartographic.fromCartesian(entityPositions[i]);
                        if (Number(tempCarto2.height) > Number(tempCarto1.height)) {
                            extrudedPs = entityPositions[i];
                        }
                    }
                    var extrHeight = Number(entity.polygon.extrudedHeight) - Number(Cesium.Cartographic.fromCartesian(extrudedPs).height);
                    entity.attribute.style.extrudedHeight = Number(extrHeight).toFixed(2);

                    that.updateDraggers();
                    entity.changeEditing();
                }
            });
            dragger.index = i;
            dragger.positions = positions;
            this.draggers.push(dragger);
        }

        // Add a dragger that will change the extruded height on the polygon.
        //创建高程拖拽点
        if (entity.polygon.extrudedHeight) {
            for (i = 0; i < positions.length; i++) {
                var position = positions[i];
                var cartoLoc = Cesium.Cartographic.fromCartesian(position);
                cartoLoc.height = entity.polygon.extrudedHeight._value;
                var draggerPs = Cesium.Cartesian3.fromRadians(cartoLoc.longitude, cartoLoc.latitude, cartoLoc.height);

                var dragger = DrawUtils.createDragger(this.dataSource, {
                    dragIcon: options.dragIcon,
                    position: draggerPs,
                    onDrag: function (dragger, position) {
                        var entityPositions = that.entity.polygon.hierarchy._value;
                        var extrudedPs = entityPositions[0];
                        for (var i = 1; i < entityPositions.length; i++) {
                            var tempCarto1 = Cesium.Cartographic.fromCartesian(extrudedPs);
                            var tempCarto2 = Cesium.Cartographic.fromCartesian(entityPositions[i]);
                            if (Number(tempCarto2.height) > Number(tempCarto1.height)) {
                                extrudedPs = entityPositions[i];
                            }
                        }
                        var cartoLoc = Cesium.Cartographic.fromCartesian(position);
                        entity.polygon.extrudedHeight = new Cesium.ConstantProperty(Number(cartoLoc.height));
                        var extrHeight = Number(cartoLoc.height) - Number(Cesium.Cartographic.fromCartesian(extrudedPs).height);
                        entity.attribute.style.extrudedHeight = Number(extrHeight).toFixed(2);
                        that.updateDraggers();
                        entity.changeEditing();
                    },
                    vertical: true,
                    horizontal: false
                });
                dragger.index = i;
                this.heightDraggers.push(dragger);
            }
        }
    
    }  
    updateDraggers() {
        var positions = this.entity.polygon.hierarchy._value;
        var extrudedHeight = this.entity.polygon.extrudedHeight._value;
        var height = 0;
        if (this.entity.polygon.height != undefined) {
            height = this.entity.polygon.height._value;
        }
        for (var i = 0; i < this.heightDraggers.length; i++) {
            var position = positions[i];
            var heightDragger = this.heightDraggers[i];
            var extrudedCarto = Cesium.Cartographic.fromCartesian(position);
            extrudedCarto.height = extrudedHeight;
            var loc = Cesium.Cartesian3.fromRadians(extrudedCarto.longitude, extrudedCarto.latitude, extrudedCarto.height);
            heightDragger.position = loc;

            var dragger = this.draggers[i];
            var carto = Cesium.Cartographic.fromCartesian(position);
            carto.height += height;
            loc = Cesium.Cartesian3.fromRadians(carto.longitude, carto.latitude, carto.height);
            dragger.position = loc;
        }
   

        }
    destroy() {
        var i = 0;

        for (i = 0; i < this.draggers.length; i++) {
            this.dataSource.entities.remove(this.draggers[i]);
        }
        this.draggers = [];

        for (i = 0; i < this.heightDraggers.length; i++) {
            this.dataSource.entities.remove(this.heightDraggers[i]);
        }
        this.heightDraggers = [];
    
        }

}
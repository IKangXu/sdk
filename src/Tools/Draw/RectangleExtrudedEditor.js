 
import DrawUtils from "./DrawUtils";

export default class RectangleExtrudedEditor {

    constructor(dataSource, entity, options) {
        this.dataSource = dataSource;
        this.entity = entity;
        this.draggers = [];
        this.heightDraggers = [];

        var that = this;
        var i = 0;

        var positions = this.getDraggersPositions();// entity.rectangle.coordinates._value;
        //entity.rectangle.coordinates.isConstant = false;
        for (i = 0; i < positions.length; i++) {
            var loc = positions[i];
            if (entity.rectangle.height != undefined) {
                var carto = Cesium.Cartographic.fromCartesian(loc);
                carto.height += entity.rectangle.height._value;
                loc = Cesium.Cartesian3.fromRadians(carto.longitude, carto.latitude, carto.height);
            }

            var dragger = DrawUtils.createDragger(this.dataSource, {
                dragIcon: options.dragIcon,
                position: loc,
                onDrag: function (dragger, position) {
                    dragger.positions[dragger.index] = position;
                    var coord;
                    if (dragger.index == 0) {
                        coord = Cesium.Rectangle.fromCartesianArray([position, dragger.positions[1]]);
                    } else {
                        coord = Cesium.Rectangle.fromCartesianArray([position, dragger.positions[0]]);
                    }
                    entity.rectangle.coordinates.setValue(coord);
                    that.updateDraggers();
                    entity.changeEditing();
                }
            });
            dragger.index = i;
            dragger.positions = positions;
            this.draggers.push(dragger);
        }

        // Add a dragger that will change the extruded height on the rectangle.
        if (entity.rectangle.extrudedHeight) {
            for (i = 0; i < positions.length; i++) {
                var position = positions[i];
                var carto = Cesium.Cartographic.fromCartesian(position);
                carto.height += entity.rectangle.extrudedHeight._value;

                var loc = Cesium.Cartesian3.fromRadians(carto.longitude, carto.latitude, carto.height);

                var dragger = DrawUtils.createDragger(this.dataSource, {
                    dragIcon: options.dragIcon,
                    position: loc,
                    onDrag: function (dragger, position) {
                        var cartoLoc = Cesium.Cartographic.fromCartesian(position);
                        entity.rectangle.extrudedHeight = new Cesium.ConstantProperty(cartoLoc.height);
                        var extrudedHeight = Number(cartoLoc.height) - Number(entity.rectangle.height);
                        entity.attribute.style.extrudedHeight = Number(extrudedHeight).toFixed(2);
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
    getDraggersPositions  () {
        var rectangle = this.entity.rectangle.coordinates._value;

        var nw = Cesium.Rectangle.northwest(rectangle);
        var se = Cesium.Rectangle.southeast(rectangle);

        return Cesium.Cartesian3.fromRadiansArray([nw.longitude, nw.latitude, se.longitude, se.latitude]);
    }
    updateDraggers () {
        var positions = this.getDraggersPositions();
        var extrudedHeight = this.entity.rectangle.extrudedHeight._value;
        var height = 0;
        if (this.entity.rectangle.height != undefined) {
            height = this.entity.rectangle.height._value;
        }
        for (var i = 0; i < this.heightDraggers.length; i++) {
            var position = positions[i];
            var heightDragger = this.heightDraggers[i];
            var extrudedCarto = Cesium.Cartographic.fromCartesian(position);
            extrudedCarto.height += extrudedHeight;
            var loc = Cesium.Cartesian3.fromRadians(extrudedCarto.longitude, extrudedCarto.latitude, extrudedCarto.height);
            heightDragger.position = loc;

            var dragger = this.draggers[i];
            var carto = Cesium.Cartographic.fromCartesian(position);
            carto.height += height;
            loc = Cesium.Cartesian3.fromRadians(carto.longitude, carto.latitude, carto.height);
            dragger.position = loc;
        }
    
        
    }

    destroy () {
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
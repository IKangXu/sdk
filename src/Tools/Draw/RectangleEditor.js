 
import DrawUtils from "./DrawUtils";

export default class RectangleEditor {

    constructor(dataSource, entity, options) {
        this.dataSource = dataSource;
        this.entity = entity;
        this.draggers = [];

        var positions = this.getDraggersPositions();
        //entity.rectangle.coordinates.isConstant = false;
        for (var i = 0; i < positions.length; i++) {
            var loc = positions[i];
            var dragger = DrawUtils.createDragger(this.dataSource, {
                dragIcon: options.dragIcon,
                position: loc,
                heightReference: !entity.attribute.style.perPositionHeight,
                onDrag: function (dragger, position) {
                    dragger.positions[dragger.index] = position;
                    var coord;
                    if (dragger.index == 0) {
                        coord = Cesium.Rectangle.fromCartesianArray([position, dragger.positions[1]]);
                    } else {
                        coord = Cesium.Rectangle.fromCartesianArray([position, dragger.positions[0]]);
                    }
                    entity.rectangle.coordinates.setValue(coord);
                    entity.changeEditing();
                }
            });
            dragger.index = i;
            dragger.positions = positions;
            this.draggers.push(dragger);
        } 
    }
    getDraggersPositions  () {
        var rectangle = this.entity.rectangle.coordinates._value;

        var nw = Cesium.Rectangle.northwest(rectangle);
        var se = Cesium.Rectangle.southeast(rectangle);

        return Cesium.Cartesian3.fromRadiansArray([nw.longitude, nw.latitude, se.longitude, se.latitude]);
    
    }
    updateDraggers () {
        var positions = this.getDraggersPositions()
        for (var i = 0; i < this.draggers.length; i++) {
            var position = positions[i];
            this.draggers[i].position = position;
        }
    }

    destroy () {
        for (var i = 0; i < this.draggers.length; i++) {
            this.dataSource.entities.remove(this.draggers[i]);
        }
        this.draggers = [];
    }
    

}
 
import DrawUtils from "./DrawUtils";

export default class PolylineExEditor {

    constructor(dataSource, entity, options) {
        this.dataSource = dataSource;
        this.entity = entity;
        this.draggers = [];

        var positions = entity.polyline.positions._value; 
        for (var i = 0; i < positions.length; i++) {
            var loc = positions[i];
            var dragger = DrawUtils.createDragger(this.dataSource, {
                dragIcon: options.dragIcon,
                position: loc,
                onDrag: function (dragger, position) {
                    positions[dragger.index] = position;
                    entity.polyline.positions = positions;
                    entity.changeEditing();
                }
            });
            dragger.index = i; 
            this.draggers.push(dragger);
        }
        

    }

    updateDraggers () {
        var positions = this.entity.polyline.positions.getValue();
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
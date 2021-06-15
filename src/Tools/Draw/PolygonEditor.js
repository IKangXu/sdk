
import DrawUtils from "./DrawUtils";

export default class PolygonEditor {

    constructor(dataSource, entity, options) {
        this.dataSource = dataSource;
        this.entity = entity;
        this.draggers = [];

        var positions = entity.polygon.hierarchy._value.positions;
        //entity.polygon.hierarchy.isConstant = false;
        for (var i = 0; i < positions.length; i++) {
            var loc = positions[i];
            var dragger = DrawUtils.createDragger(this.dataSource, {
                dragIcon: options.dragIcon,
                position: loc,
                heightReference: !entity.attribute.style.perPositionHeight,
                onDrag: function (dragger, position) {
                    dragger.positions[dragger.index] = position;
                    entity.polygon.hierarchy = dragger.positions;
                    entity.changeEditing();
                }
            });
            dragger.index = i;
            dragger.positions = positions;
            this.draggers.push(dragger);
        }

    }
    updateDraggers() {
        var positions = this.entity.polygon.hierarchy._value;
        for (var i = 0; i < this.draggers.length; i++) {
            var position = positions[i];
            this.draggers[i].position = position;
        }

    }
    destroy() {
        for (var i = 0; i < this.draggers.length; i++) {
            this.dataSource.entities.remove(this.draggers[i]);
        }
        this.draggers = [];
    }

}
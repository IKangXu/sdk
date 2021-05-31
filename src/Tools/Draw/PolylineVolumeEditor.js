 
import DrawUtils from "./DrawUtils";

export default class PolylineVolumeEditor {

    constructor(dataSource, entity, options) {
         
        this.dataSource = dataSource;
        this.entity = entity;
        this.draggers = [];

        var positions = entity.polylineVolume.positions.getValue();
        //entity.polylineVolume.positions.isConstant = false;
        for (var i = 0; i < positions.length; i++) {
            var loc = positions[i];
            var dragger = DrawUtils.createDragger(this.dataSource, {
                dragIcon: options.dragIcon,
                position: loc,
                onDrag: function (dragger, position) {
                    positions[dragger.index] = position;
                    entity.polylineVolume.positions = positions;
                    entity.changeEditing();
                }
            });
            dragger.index = i;
            //dragger.positions = positions;
            this.draggers.push(dragger);
        }
    }

    updateDraggers () {

        var positions = this.entity.polylineVolume.positions.getValue();
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
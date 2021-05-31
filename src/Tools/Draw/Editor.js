
import DrawUtils from "./DrawUtils";

export default class Editor {
    constructor(dataSource, entity, options) {
        this.dataSource = dataSource;
        this.entity = entity;
        this.draggers = [];

        var dragger = DrawUtils.createDragger(this.dataSource, {
            dragger: entity,
            
            onDrag: function (dragger, newPosition) {
                var diff = new Cesium.Cartesian3();
                Cesium.Cartesian3.subtract(newPosition, entity.position._value, diff);
                entity.position._value = newPosition;

                entity.changeEditing();
            }
        });
    } 
     
    updateDraggers() {

        }
    destroy() {
            this.draggers = [];
        }

}
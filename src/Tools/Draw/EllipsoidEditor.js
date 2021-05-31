 
import DrawUtils from "./DrawUtils";

export default class EllipsoidEditor {

    constructor(dataSource, entity, options) {
        this.dataSource = dataSource;
        this.entity = entity;
        this.options = options;
        this.draggers = [];
        this.initDraggers();
    }

      //创建拖拽点
     initDraggers  () {
        var that = this;
        var ellipsoidPs = this.entity.position._value;
        var radii = Number(this.entity.attribute.style.heightRadii) || 0;
        var carto = Cesium.Cartographic.fromCartesian(ellipsoidPs);
        carto.height += radii;
        var draggerPs = Cesium.Cartesian3.fromRadians(carto.longitude, carto.latitude, carto.height);
 
        var dragger = DrawUtils.createDragger(this.dataSource, {
            dragIcon: this.options.dragIcon,
            position: draggerPs,
            onDrag: function (dragger, newPosition) {
                var diff = new Cesium.Cartesian3();
                Cesium.Cartesian3.subtract(newPosition, that.entity.position._value, diff);

                var carto = Cesium.Cartographic.fromCartesian(newPosition);
                var radii = Number(that.entity.attribute.style.heightRadii) || 0;
                carto.height -= radii;
                var draggerPs = Cesium.Cartesian3.fromRadians(carto.longitude, carto.latitude, carto.height);

                that.entity.position._value = draggerPs;//newPosition;

                that.entity.changeEditing();
            }
        });
        this.draggers.push(dragger);
    }

     updateDraggers  () {
        this.destroy();
        this.initDraggers();
    }

     destroy  () {
        for (var i = 0; i < this.draggers.length; i++) {
            this.dataSource.entities.remove(this.draggers[i]);
        }
        this.draggers = [];
    }


    

}
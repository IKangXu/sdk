 
import DrawUtils from "./DrawUtils";

export default class WallEditor {

    constructor(dataSource, entity, options) {
        this.dataSource = dataSource;
        this.entity = entity;
        this.draggers = [];
        this.heightDraggers = [];

        var that = this;
        var i = 0;
        var positions = entity.wall.positions._value;
        //entity.wall.positions.isConstant = false;
        for (i = 0; i < positions.length; i++) {
            var loc = positions[i];
            var dragger = _drawutils.createDragger(this.dataSource, {
                dragIcon: options.dragIcon,
                position: loc,
                onDrag: function (dragger, position) {
                    dragger.positions[dragger.index] = position;
                    that.updateDraggers();
                    entity.changeEditing();
                }
            });
            dragger.index = i;
            dragger.positions = positions;
            this.draggers.push(dragger);
        }
 
        if (entity.wall.maximumHeights) {
            for (i = 0; i < positions.length; i++) {
                var position = positions[i];
                var carto = Cesium.Cartographic.fromCartesian(position.clone());
                carto.height = entity.wall.maximumHeights._value[i];
                var loc = Cesium.Cartesian3.fromRadians(carto.longitude, carto.latitude, carto.height);

                var dragger = _drawutils.createDragger(this.dataSource, {
                    dragIcon: options.dragIcon,
                    position: loc,
                    onDrag: function (dragger, position) {
                        var cartoLoc = Cesium.Cartographic.fromCartesian(position);
                        var minimumHeights = that.entity.wall.minimumHeights._value;
                        var extrudedHeight = Number(cartoLoc.height) - Number(minimumHeights[dragger.index]);
                        entity.attribute.style.extrudedHeight = extrudedHeight.toFixed(2);
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

    updateDraggers () {
        var positions = this.entity.wall.positions._value;
        var minimumHeights = this.entity.wall.minimumHeights._value;
        var maximumHeights = this.entity.wall.maximumHeights._value;
        var miniHeights;
        for (var i = 0; i < this.heightDraggers.length; i++) {
            var position = positions[i].clone();
            var heightDragger = this.heightDraggers[i];
            var extrudedCarto = Cesium.Cartographic.fromCartesian(position);
            minimumHeights[i] = extrudedCarto.height;
            maximumHeights[i] = Number(extrudedCarto.height) + Number(this.entity.attribute.style.extrudedHeight);

            heightDragger.position = DrawUtils.getPositionsWithHeight(position, this.entity.attribute.style.extrudedHeight);

            this.draggers[i].position = position;
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
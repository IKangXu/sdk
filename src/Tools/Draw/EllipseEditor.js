 
import DrawUtils from "./DrawUtils";

export default class EllipseEditor {

    constructor(dataSource, entity, options) {
        this.dataSource = dataSource;
        this.entity = entity;
        this.options = options;
        this.draggers = [];
        this.heightDraggers = [];
        this.initDraggers();
 
    }

    initDraggers () {
        var that = this;
        // Create a dragger that just modifies the entities position.
        var dragger = DrawUtils.createDragger(this.dataSource, {
            dragIcon: this.options.dragIcon,
            //      position: DrawUtils.getPositionsWithHeight(this.entity.position._value,Number(this.entity.attribute.style.height || 0)),
            position: this.entity.position._value,
            onDrag: function (dragger, newPosition) {
                var diff = new Cesium.Cartesian3();
                Cesium.Cartesian3.subtract(newPosition, that.entity.position._value, diff);
                var cartoLoc = Cesium.Cartographic.fromCartesian(newPosition);
                var modelHeight = Number(cartoLoc.height).toFixed(2);
                that.entity.ellipse.height = new Cesium.ConstantProperty(cartoLoc.height);
                that.entity.attribute.style.height = modelHeight;
                that.entity.position._value = newPosition;

                var newPos = new Cesium.Cartesian3();
                Cesium.Cartesian3.add(dragger.majorDragger.position._value, diff, newPos)
                dragger.majorDragger.position = new Cesium.ConstantProperty(newPos);

                Cesium.Cartesian3.add(dragger.minorDragger.position._value, diff, newPos)
                dragger.minorDragger.position = new Cesium.ConstantProperty(newPos);

                if (that.entity.attribute.style.extrudedHeight != undefined)
                    that.updateHeightDraggers();
                that.entity.changeEditing();
            }
        });
        this.draggers.push(dragger);

        //获取椭圆上的坐标点数组
        var cep = Cesium.EllipseGeometryLibrary.computeEllipsePositions({
            center: this.entity.position._value,
            semiMinorAxis: this.entity.ellipse.semiMinorAxis._value,
            semiMajorAxis: this.entity.ellipse.semiMajorAxis._value,
            rotation: Cesium.Math.toRadians(Number(this.entity.attribute.style.rotation || 0)),
            granularity: 2.0
        }, true, false);

        //长半轴上的坐标点
        var majorPos = new Cesium.Cartesian3(cep.positions[0], cep.positions[1], cep.positions[2]);

        var majorDragger = DrawUtils.createDragger(this.dataSource, {
            dragIcon: this.options.dragIcon,
            position: majorPos,
            onDrag: function (dragger, newPosition) {
                var majorRadius = Cesium.Cartesian3.distance(that.entity.position._value, newPosition);
                var thisradius = Number(majorRadius.toFixed(2));
                
                that.entity.ellipse.semiMajorAxis = new Cesium.ConstantProperty(thisradius);
                if (that.entity.attribute.style.radius) {
                    that.entity.attribute.style.radius = thisradius;
                    that.entity.ellipse.semiMinorAxis = new Cesium.ConstantProperty(thisradius);
                }
                else {
                    that.entity.attribute.style.semiMajorAxis = thisradius;
                }
                if (that.entity.attribute.style.extrudedHeight != undefined)
                    that.updateHeightDraggers();
                that.entity.changeEditing();
            }
        });
        dragger.majorDragger = majorDragger;
        this.draggers.push(majorDragger);

        //短半轴上的坐标点
        var minorPos = new Cesium.Cartesian3(cep.positions[3], cep.positions[4], cep.positions[5]);
        var minorDragger = DrawUtils.createDragger(this.dataSource, {
            dragIcon: this.options.dragIcon,
            position: minorPos,
            onDrag: function (dragger, newPosition) {
                var minorRadius = Cesium.Cartesian3.distance(that.entity.position._value, newPosition);
                var thisradius = Number(minorRadius.toFixed(2));
                that.entity.ellipse.semiMinorAxis = new Cesium.ConstantProperty(thisradius);
                if (that.entity.attribute.style.radius) {
                    that.entity.attribute.style.radius = thisradius;
                    that.entity.ellipse.semiMajorAxis = new Cesium.ConstantProperty(thisradius);
                }
                else {
                    that.entity.attribute.style.semiMinorAxis = thisradius;
                }
                if (that.entity.attribute.style.extrudedHeight != undefined)
                    that.updateHeightDraggers();
                that.entity.changeEditing();
            }
        });
        dragger.minorDragger = minorDragger;
        this.draggers.push(minorDragger);

        if (this.entity.attribute.style.extrudedHeight != undefined)
            this.initHeightDraggers();
    }

    //创建高程拖拽点
    initHeightDraggers () {
        var that = this;
        // Create a dragger that just modifies the entities position.
        var extrudedHeight = Number(this.entity.attribute.style.extrudedHeight) - Number(this.entity.attribute.style.height);
        var hDragger = DrawUtils.createDragger(this.dataSource, {
            dragIcon: this.options.dragIcon,
            position: DrawUtils.getPositionsWithHeight(this.entity.position._value, extrudedHeight),
            onDrag: function (dragger, newPosition) {
                var diff = new Cesium.Cartesian3();
                Cesium.Cartesian3.subtract(newPosition, that.entity.position._value, diff);
                var cartoLoc = Cesium.Cartographic.fromCartesian(newPosition);
                var modelHeight = Number(cartoLoc.height).toFixed(2);
                that.entity.position._value = newPosition;
                that.entity.ellipse.extrudedHeight = new Cesium.ConstantProperty(Number(modelHeight) + Number(extrudedHeight));
                that.entity.ellipse.height = new Cesium.ConstantProperty(cartoLoc.height);
                that.entity.attribute.style.extrudedHeight = Number(modelHeight) + Number(extrudedHeight);
                that.entity.attribute.style.height = modelHeight;
                that.updateDraggers();
                that.entity.changeEditing();
            }
        });

        this.heightDraggers.push(hDragger);

        var cep = Cesium.EllipseGeometryLibrary.computeEllipsePositions({
            center: this.entity.position._value,
            semiMinorAxis: this.entity.ellipse.semiMinorAxis._value,
            semiMajorAxis: this.entity.ellipse.semiMajorAxis._value,
            rotation: Cesium.Math.toRadians(Number(this.entity.attribute.style.rotation || 0)),
            granularity: 2.0
        }, true, false);
        var majorPos = new Cesium.Cartesian3(cep.positions[0], cep.positions[1], cep.positions[2]);

        var majorHDragger = DrawUtils.createDragger(this.dataSource, {
            dragIcon: this.options.dragIcon,
            position: DrawUtils.getPositionsWithHeight(majorPos, extrudedHeight),
            onDrag: function (dragger, position) {
                var cartoLoc = Cesium.Cartographic.fromCartesian(position);
                that.entity.ellipse.extrudedHeight = new Cesium.ConstantProperty(cartoLoc.height);
                that.entity.attribute.style.extrudedHeight = Number(cartoLoc.height).toFixed(2);
                that.updateHeightDraggers();
                that.entity.changeEditing();
            },
            vertical: true,
            horizontal: false
        });
        this.heightDraggers.push(majorHDragger);

        var minorPos = new Cesium.Cartesian3(cep.positions[3], cep.positions[4], cep.positions[5]);
        var minorHDragger = DrawUtils.createDragger(this.dataSource, {
            dragIcon: this.options.dragIcon,
            position: DrawUtils.getPositionsWithHeight(minorPos, extrudedHeight),
            onDrag: function (dragger, position) {
                var cartoLoc = Cesium.Cartographic.fromCartesian(position);
                that.entity.ellipse.extrudedHeight = new Cesium.ConstantProperty(cartoLoc.height);
                that.entity.attribute.style.extrudedHeight = Number(cartoLoc.height).toFixed(2);
                that.updateHeightDraggers();
                that.entity.changeEditing();
            },
            vertical: true,
            horizontal: false
        });
        this.heightDraggers.push(minorHDragger);
    }

    //更新拖拽点
    updateDraggers () {
        this.destroy();
        this.initDraggers();
    }

    //更新高程拖拽点
    updateHeightDraggers () {
        for (var i = 0; i < this.heightDraggers.length; i++) {
            this.dataSource.entities.remove(this.heightDraggers[i]);
        }
        this.heightDraggers = [];
        this.initHeightDraggers();
    }

    destroy () {
        var i = 0;
        for (i = 0; i < this.draggers.length; i++) {
            this.dataSource.entities.remove(this.draggers[i]);
        }
        this.draggers = [];
        if (this.entity.attribute.style.extrudedHeight != undefined) {
            for (i = 0; i < this.heightDraggers.length; i++) {
                this.dataSource.entities.remove(this.heightDraggers[i]);
            }
            this.heightDraggers = [];
        }
    }

    

}
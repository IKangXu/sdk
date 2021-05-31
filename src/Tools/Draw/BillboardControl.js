 
import DynamicProperty from "./DynamicProperty";
import DrawUtils from "./DrawUtils";
import Editor from "./PointEditor";


export default class BillboardControl {
    constructor(options) {
        this.typename = "billboard";
    }

    static startDraw(dataSource, attribute) {
        var entityattr = this.attribute2Entity(attribute);
        var entity = dataSource.entities.add({
            billboard: entityattr,
            attribute: attribute
        });

        return entity;
    }
    static attribute2Entity(attribute, entityattr) {
        attribute = attribute || {};
        attribute.style = attribute.style || {};
        if (entityattr == null) {
            //默认值
            entityattr = {
                scale: 1,
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM
            }
        }

        //Style赋值值Entity
        for (var key in attribute.style) {
            var value = attribute.style[key];
            switch (key) {
                default: //直接赋值
                    entityattr[key] = value;
                    break;
                case "scaleByDistance_near": //跳过扩展其他属性的参数
                case "scaleByDistance_nearValue":
                case "scaleByDistance_far":
                case "scaleByDistance_farValue":
                case "distanceDisplayCondition_far":
                case "distanceDisplayCondition_near":
                    break;
                case "opacity": //透明度
                    entityattr.color = new Cesium.Color.fromCssColorString("#FFFFFF")
                        .withAlpha(Number(value || 1.0));
                    break;
                case "rotation": //旋转角度
                    entityattr.rotation = Cesium.Math.toRadians(value);
                    break;
                case "scaleByDistance": //是否按视距缩放
                    if (value) {
                        entityattr.scaleByDistance = new Cesium.NearFarScalar(
                            Number(attribute.style.scaleByDistance_near || 1000),
                            Number(attribute.style.scaleByDistance_nearValue || 1.0),
                            Number(attribute.style.scaleByDistance_far || 1000000),
                            Number(attribute.style.scaleByDistance_farValue || 0.1));
                    } else {
                        entityattr.scaleByDistance = null;
                    }
                    break;
                case "distanceDisplayCondition": //是否按视距显示
                    if (value) {
                        entityattr.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(
                            Number(attribute.style.distanceDisplayCondition_near || 0),
                            Number(attribute.style.distanceDisplayCondition_far || 100000));
                    } else {
                        entityattr.distanceDisplayCondition = null;
                    }
                    break;
            }
        }


        return entityattr;
    }
    static getEditor(dataSource, entity, options) {
        return new Editor(dataSource, entity, options);
    }
    static setPositions(entity, position) {
        entity.position = new DynamicProperty(position);
    }
    static getPositions(entity) {
        return [entity.position._value];
    }
    static getCoordinates(entity) {
        var positions = this.getPositions(entity);
        var coordinates = DrawUtils.getCoordinates(positions);
        return coordinates;
    }
    static toGeoJSON(entity) {
        var coordinates = this.getCoordinates(entity);

        return {
            type: "Feature",
            properties: entity.attribute,
            geometry: {
                type: "Point",
                coordinates: coordinates
            }
        };
    }
}
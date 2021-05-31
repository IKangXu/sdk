 
import DrawUtils from "./DrawUtils";
import Editor1 from "./RectangleExtrudedEditor";
import Editor2 from "./RectangleEditor";
 

export default class PolygonControl {
    constructor(options) {
        this.typename = "rectangle";

    }

    static typename(){
        return "rectangle"; 
    }
   

   static startDraw (dataSource, attribute) {
        var entityattr = this.attribute2Entity(attribute);

        var entity = dataSource.entities.add({
            rectangle: entityattr,
            attribute: attribute
        });

        return entity;
    }
    static attribute2Entity (attribute, entityattr) {
        attribute = attribute || {};
        attribute.style = attribute.style || {};

        if (!entityattr) {
            var coor = Cesium.Rectangle.fromDegrees(78.654473, 34.878143, 78.654673, 34.878316);
            entityattr = {
                fill: true,
                closeTop: true,
                closeBottom: true,
                coordinates: coor
            }
        }

        //Style赋值值Entity
        for (var key in attribute.style) {
            var value = attribute.style[key];
            switch (key) {
                default:    //直接赋值
                    entityattr[key] = value;
                    break;
                case "opacity":     //跳过扩展其他属性的参数
                case "outlineOpacity":
                    break;
                case "outlineColor":    //边框颜色
                    entityattr.outlineColor = new Cesium.Color.fromCssColorString(value || "#FFFF00")
                        .withAlpha(attribute.style.outlineOpacity || attribute.style.opacity || 1.0);
                    break;
                case "height":
                    entityattr.height = Number(value);
                    entityattr.extrudedHeight = Number(attribute.style.extrudedHeight) + Number(value);
                    break;
                case "extrudedHeight":
                    entityattr.extrudedHeight = Number(entityattr.height) + Number(value);
                    break;
                case "color":   //填充颜色
                    entityattr.material = new Cesium.Color.fromCssColorString(value || "#FFFF00")
                            .withAlpha(Number(attribute.style.opacity || 1.0));
                    break;
                case "image":   //填充图片
                    entityattr.material = attribute.style.image;
                    break;
                case "rotation":   //旋转角度 
                    entityattr.rotation = Cesium.Math.toRadians(value);
                    if (!attribute.style.stRotation)
                        entityattr.stRotation = Cesium.Math.toRadians(value);
                    break;
                case "stRotation":
                    entityattr.stRotation = Cesium.Math.toRadians(value);
                    break;
            }
        }

        //如果未设置任何material，设置默认颜色
        if (entityattr.material == null) {
            entityattr.material = Cesium.Color.fromRandom({
                minimumGreen: 0.75,
                maximumBlue: 0.75,
                alpha: Number(attribute.style.opacity || 1.0)
            });
        }

        return entityattr;
    }
    static  getEditor (dataSource, entity, options) {
        if (entity.rectangle.extrudedHeight) {
            return new Editor1(dataSource, entity, options);
        } else {
            return new Editor2(dataSource, entity, options);
        }
    }
    static setPositions (entity, position) {
        if (position instanceof Array) {
            position = Cesium.Rectangle.fromCartesianArray(position);
        }
        entity.rectangle.coordinates.setValue(position);// = new _DynamicProperty(position);
    }
    static  getPositions (entity) {
        return entity.rectangle.coordinates;
    }
    static  getCoordinates (entity) {
        var positions = this.getDiagonalPositions(entity);
        var coordinates = DrawUtils.getCoordinates(positions);
        return coordinates;
    }
    static  getDiagonalPositions (entity) {
        var rectangle = entity.rectangle.coordinates._value;
        var nw = Cesium.Rectangle.northwest(rectangle);
        var se = Cesium.Rectangle.southeast(rectangle);
        return Cesium.Cartesian3.fromRadiansArray([nw.longitude, nw.latitude, se.longitude, se.latitude]);
    }
    static   toGeoJSON (entity) {
        var coordinates = this.getCoordinates(entity);

        return {
            type: "Feature",
            properties: entity.attribute,
            geometry: {
                type: "MultiPoint",
                coordinates: coordinates
            }
        };
    }

}
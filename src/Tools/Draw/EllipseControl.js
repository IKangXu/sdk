 
import DynamicProperty from"./DynamicProperty";
import DrawUtils from "./DrawUtils";
import Editor from "./EllipseEditor";


export default class EllipseControl {
    constructor(options) {
        this.typename= "ellipse";
     
    }  
      static  startDraw (dataSource, attribute) {
            var entityattr = this.attribute2Entity(attribute);

            var entity = dataSource.entities.add({
                //name: 'Entity ' + arrEntity.length,
                ellipse: entityattr,
                attribute: attribute
            });

            return entity;
        }
        static  attribute2Entity (attribute, entityattr) {
            attribute = attribute || {};
            attribute.style = attribute.style || {};
            if (entityattr == null) {
                //默认值
                entityattr = {
                    fill: true
                };
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
                    case "color":       //填充颜色
                        entityattr.material = new Cesium.Color.fromCssColorString(value || "#FFFF00")
                                .withAlpha(Number(attribute.style.opacity || 1.0));
                        break;
                    case "rotation":    //旋转角度
                        entityattr.rotation = Cesium.Math.toRadians(value);
                        break;
                    case "radius":    //半径
                        entityattr.semiMinorAxis = value;
                        entityattr.semiMajorAxis = value;
                        break;

                }
            }



            return entityattr;
        }
        static  getEditor (dataSource, entity, options) {
            return new Editor(dataSource, entity, options);
        }
        static  setPositions (entity, position) {
            entity.position = new DynamicProperty(position);
        }
        static  getPositions (entity) {
            return [entity.position._value];
        }
        static getCoordinates (entity) {
            var positions = this.getPositions(entity);
            var coordinates = DrawUtils.getCoordinates(positions);
            return coordinates;
        }
        static  toGeoJSON (entity) {
            var coordinates = this.getCoordinates(entity);

            return {
                type: "Feature",
                properties: entity.attribute,
                geometry: { type: "Point", coordinates: coordinates }
            };
        }


}
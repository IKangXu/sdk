 
import DynamicProperty from"./DynamicProperty";
import Drawutils from "./DrawUtils";
import Editor from "./PolylineVolumeEditor";


export default class PolylineVolumeControl {
    
    static typename(){
        return "polylineVolume";
    }
    static startDraw (dataSource,attribute) {
        var entityattr = this.attribute2Entity(attribute);

        var entity = dataSource.entities.add({
            polylineVolume: entityattr,
            attribute: attribute
        });

        return entity;
    }
    static attribute2Entity (attribute, entityattr) {
        attribute = attribute || {};
        attribute.style = attribute.style || {};
        if (entityattr == null) {
            entityattr = {
                positions: new DynamicProperty([])
                //positions: new Cesium.ConstantProperty([])
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
                case "radius":
                case "shape":
                    break;
                case "outlineColor":    //边框颜色
                    entityattr.outlineColor = new Cesium.Color.fromCssColorString(value || "#FFFF00")
                        .withAlpha(attribute.style.outlineOpacity || attribute.style.opacity || 1.0);
                    break;
                case "color":   //填充颜色
                    entityattr.material = new Cesium.Color.fromCssColorString(value || "#FFFF00")
                            .withAlpha(Number(attribute.style.opacity || 1.0));
                    break;
            }
        }

        //管道样式 
        attribute.style.radius = attribute.style.radius || 10;
        switch (attribute.style.shape) {
            default:
            case "pipeline":
                entityattr.shape = this._getCorridorShape1(attribute.style.radius);//（厚度固定为半径的1/3）
                break;
            case "circle":
                entityattr.shape = this._getCorridorShape2(attribute.style.radius);
                break;
            case "star":
                entityattr.shape = this._getCorridorShape3(attribute.style.radius);
                break;
        }

        return entityattr;
    }

     //管道形状1【内空管道】 radius整个管道的外半径 
     static _getCorridorShape1 (radius) {
        var hd = radius / 3;
        var startAngle = 0;
        var endAngle = 360;

        var pss = [];
        for (var i = startAngle; i <= endAngle; i++) {
            var radians = Cesium.Math.toRadians(i);
            pss.push(new Cesium.Cartesian2(radius * Math.cos(radians), radius * Math.sin(radians)));
        }
        for (var i = endAngle; i >= startAngle; i--) {
            var radians = Cesium.Math.toRadians(i);
            pss.push(new Cesium.Cartesian2((radius - hd) * Math.cos(radians), (radius - hd) * Math.sin(radians)));
        }
        return pss;
    }
    
    static _getCorridorShape2 (radius) {
        var startAngle = 0;
        var endAngle = 360;

        var pss = [];
        for (var i = startAngle; i <= endAngle; i++) {
            var radians = Cesium.Math.toRadians(i);
            pss.push(new Cesium.Cartesian2(radius * Math.cos(radians), radius * Math.sin(radians)));
        }
        return pss;
    }
     
    static _getCorridorShape3 (radius, arms) {
        var arms = arms || 6;
        var angle = Math.PI / arms;
        var length = 2 * arms;
        var pss = new Array(length);
        for (var i = 0; i < length; i++) {
            var r = (i % 2) === 0 ? radius : radius / 3;
            pss[i] = new Cesium.Cartesian2(Math.cos(i * angle) * r, Math.sin(i * angle) * r);
        }
        return pss;
    }
    static getEditor (dataSource, entity, options) {
        return new Editor(dataSource, entity, options);
    }
    static  setPositions (entity, positions) {
        //entity.polylineVolume.positions = new DynamicProperty(positions);
        entity.polylineVolume.positions = positions;
    }
    static getPositions (entity) {
        return entity.polylineVolume.positions._value;
    }
    static getCoordinates (entity) {
        var positions = this.getPositions(entity);
        var coordinates = Drawutils.getCoordinates(positions);
        return coordinates;
    }
    static  toGeoJSON (entity) {
        var coordinates = this.getCoordinates(entity);
        return {
            type: "Feature",
            properties: entity.attribute,
            geometry: {
                type: "LineString",
                coordinates: coordinates
            }
        };
    }
 

}
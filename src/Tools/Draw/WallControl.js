 
import DynamicProperty from"./DynamicProperty";
import Drawutils from "./DrawUtils";
import Editor from "./WallEditor";


export default class WallControl {
    
    static typename(){
        return "wall";
    }
    static startDraw (dataSource, attribute) {
        var entityattr = this.attribute2Entity(attribute);

        var entity = dataSource.entities.add({
            //name: 'Entity ' + arrEntity.length,
            wall: entityattr,
            attribute: attribute
        });

        return entity;
    }
    static attribute2Entity (attribute, entityattr) {
        attribute = attribute || {};
        attribute.style = attribute.style || {};

        if (!entityattr) {
            entityattr = {
                fill: true,
                minimumHeights: [],
                maximumHeights: [],
                positions: new DynamicProperty([])
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
                case "color":   //填充颜色
                    entityattr.material = new Cesium.Color.fromCssColorString(value || "#FFFF00")
                            .withAlpha(Number(attribute.style.opacity || 1.0));
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
    static getEditor (dataSource, entity, options) {
        return new Editor(dataSource, entity, options);
    }
    static setPositions (entity, position) {
        entity.wall.positions = new DynamicProperty(position);

        if (entity.wall.maximumHeights && entity.wall.minimumHeights) {
            for (var i = 0; i < position.length; i++) {
                var carto = Cesium.Cartographic.fromCartesian(position[i]);
                entity.wall.minimumHeights._value[i] = Number(carto.height);
                entity.wall.maximumHeights._value[i] = Number(carto.height) + Number(entity.attribute.style.extrudedHeight);
            }
        }
    }
    static getPositions (entity) {
        return entity.wall.positions._value;
    }

    static setMaximumHeights (entity, maximumHeights) {
        entity.wall.maximumHeights = new DynamicProperty(maximumHeights);
    }
    static getMaximumHeights (entity) {
        return entity.wall.maximumHeights._value;
    }
    static setMinimumHeights (entity, minimumHeights) {
        entity.wall.minimumHeights = new DynamicProperty(minimumHeights);
    }
    static getMinimumHeights (entity) {
        return entity.wall.minimumHeights._value;
    }

    static getCoordinates (entity) {
        var positions = this.getPositions(entity);
        var coordinates = Drawutils.getCoordinates(positions);
        return coordinates;
    }
    static toGeoJSON (entity) {
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
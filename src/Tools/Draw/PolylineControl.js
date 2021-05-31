 
import DynamicProperty from"./DynamicProperty";
import DrawUtils from "./DrawUtils";
import Editor from "./PolylineEditor";


export default class PolylineControl {
    
    static typename(){
        return "polyline";
    }
    static startDraw (dataSource,attribute) {
        var entityattr = this.attribute2Entity(attribute);

        var entity = dataSource.entities.add({
            //name: 'Entity ' + arrEntity.length,
            polyline: entityattr,
            attribute: attribute
        });

        return entity;
    }
    static attribute2Entity (attribute, entityattr) {
        attribute = attribute || {};
        attribute.style = attribute.style || {};
        if (entityattr == null) {
            entityattr = {
                followSurface: true,
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
                case "lineType":    //跳过扩展其他属性的参数
                case "color":
                case "opacity":
                case "outline":
                case "outlineWidth":
                case "outlineColor":
                case "outlineOpacity":
                    break;
            }
        }

        var color = new Cesium.Color.fromCssColorString(attribute.style.color || "#FFFF00")
                            .withAlpha(Number(attribute.style.opacity || 1.0));

        switch (attribute.style.lineType) {
            default:
            case "solid"://实线

                if (attribute.style.outline) {
                    //存在衬色时
                    entityattr.material = new Cesium.PolylineOutlineMaterialProperty({
                        color: color,
                        outlineWidth: Number(attribute.style.outlineWidth || 1.0),
                        outlineColor: new Cesium.Color.fromCssColorString(attribute.style.outlineColor || "#FFFF00")
                            .withAlpha(Number(attribute.style.outlineOpacity || attribute.style.opacity || 1.0))
                    });
                } else {
                    entityattr.material = color;
                }
                break;
            case "dash"://虚线
                entityattr.material = new Cesium.PolylineDashMaterialProperty({
                    color: color
                })
                break;
        } 

        if(attribute.style.material){
            let material = attribute.style.material;
            let reverse = material.reverse||false;
            let offset = 0.001;
            entityattr.material =   new Cesium.StripeMaterialProperty({
                    evenColor : new Cesium.Color.fromCssColorString(material.evenColor || "#000000")
                    .withAlpha(Number(attribute.style.opacity  || 1.0)),
                    oddColor :new Cesium.Color.fromCssColorString(material.oddColor || "#FFFFFF")
                    .withAlpha(Number(attribute.style.opacity  || 1.0)),
                    repeat :  Number(material.repeat || 20.0),
                    orientation:Cesium.StripeOrientation.VERTICAL,
                    offset :new Cesium.CallbackProperty(function(){
                        reverse? offset+=0.001:offset-=0.001;
                        return offset; 
                    }, false)
                }); 

        }

        return entityattr;
    }
    static getEditor (dataSource, entity, options) {
        return new Editor(dataSource, entity, options);
    }
    static setPositions (entity, positions) {
        entity.polyline.positions.setValue(positions);
    }
    static getPositions (entity) {
        return entity.polyline.positions._value;
    }
    static getCoordinates (entity) {
        var positions = this.getPositions(entity);
        var coordinates = DrawUtils.getCoordinates(positions);
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
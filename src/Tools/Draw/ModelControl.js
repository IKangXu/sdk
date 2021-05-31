 import Drawutils from "./DrawUtils"
 import Editor from "./PointEditor"
 import DynamicProperty from "./DynamicProperty";
 export default class ModelControl {

     constructor(options) {
         this.typename = "model";
     }
  
     static startDraw(dataSource, attribute) {
         var entityattr = this.attribute2Entity(attribute);

         var entity = dataSource.entities.add({
             model: entityattr,
             attribute: attribute
         });

         return entity;
     }
     static attribute2Entity(attribute, entityattr) {
         attribute = attribute || {};
         attribute.style = attribute.style || {};
         if (entityattr == null) {
             //默认值
             entityattr = {}
         }

         //Style赋值值Entity
         for (var key in attribute.style) {
             var value = attribute.style[key];
             switch (key) {
                 default: //直接赋值
                     entityattr[key] = value;
                     break;
                 case "silhouette": //跳过扩展其他属性的参数
                 case "silhouetteColor":
                 case "silhouetteAlpha":
                 case "silhouetteSize":
                 case "fill":
                 case "color":
                 case "opacity":
                     break;
                 case "modelUrl": //模型uri
                     entityattr.uri = value;
                     break;
             }
         }




         //轮廓
         if (attribute.style.silhouette) {
             entityattr.silhouetteColor = new Cesium.Color.fromCssColorString(attribute.style.silhouetteColor || "#FFFFFF")
                 .withAlpha(Number(attribute.style.silhouetteAlpha || 1.0));
             entityattr.silhouetteSize = Number(attribute.style.silhouetteSize || 1.0);
         } else
             entityattr.silhouetteSize = 0.0;

         //透明度、颜色
         if (attribute.style.fill)
             entityattr.color = new Cesium.Color.fromCssColorString(attribute.style.color || "#FFFFFF")
             .withAlpha(Number(attribute.style.opacity || 1.0));
         else
             entityattr.color = new Cesium.Color.fromCssColorString("#FFFFFF")
             .withAlpha(Number(attribute.style.opacity || 1.0));


         return entityattr;
     }
     static attribute2Model(attribute, model) {
         //角度控制
         var heading = Cesium.Math.toRadians(Number(model.attribute.style.heading || 0.0));
         var pitch = Cesium.Math.toRadians(Number(model.attribute.style.pitch || 0.0));
         var roll = Cesium.Math.toRadians(Number(model.attribute.style.roll || 0.0));
         var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);

         if (model.orientation) {
             model.orientation = Cesium.Transforms.headingPitchRollQuaternion(model.position._value, hpr);
         }
     }
     static getEditor(dataSource, entity, options) {
         return new Editor(dataSource, entity, options);
     }
     static setPositions(entity, position) {
         entity.position = new DynamicProperty(position);
         var heading = Cesium.Math.toRadians(Number(entity.attribute.style.heading || 0.0));
         var pitch = Cesium.Math.toRadians(Number(entity.attribute.style.pitch || 0.0));
         var roll = Cesium.Math.toRadians(Number(entity.attribute.style.roll || 0.0));
         var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
         entity.orientation = Cesium.Transforms.headingPitchRollQuaternion(entity.position._value, hpr);
     }
     static getPositions(entity) {
         return [entity.position._value];
     }
     static getCoordinates(entity) {
         var positions = this.getPositions(entity);
         var coordinates = Drawutils.getCoordinates(positions);
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
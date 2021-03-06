

let fixGltf = function(gltf) {
    if (!gltf.extensionsUsed) {  
        console.log("no use extensionsUsed");      
        return;
    }
 
    var v = gltf.extensionsUsed.indexOf('KHR_technique_webgl');
    var t = gltf.extensionsRequired.indexOf('KHR_technique_webgl');
    //console.log("v:"+v);
    //console.log("t:"+v);
    // 版本兼容
    if (v !== -1) {
        console.log("gltf 1.0版本,修正 KHR_techniques_webgl...");
        gltf.extensionsRequired.splice(t, 1, 'KHR_techniques_webgl');
        gltf.extensionsUsed.splice(v, 1, 'KHR_techniques_webgl');
        gltf.extensions = gltf.extensions || {};
        gltf.extensions['KHR_techniques_webgl'] = {};
        gltf.extensions['KHR_techniques_webgl'].programs = gltf.programs;
        gltf.extensions['KHR_techniques_webgl'].shaders = gltf.shaders;
        gltf.extensions['KHR_techniques_webgl'].techniques = gltf.techniques;
        var techniques = gltf.extensions['KHR_techniques_webgl'].techniques;
 
        gltf.materials.forEach(function (mat, index) {
            gltf.materials[index].extensions['KHR_technique_webgl'].values = gltf.materials[index].values;
            gltf.materials[index].extensions['KHR_techniques_webgl'] = gltf.materials[index].extensions['KHR_technique_webgl'];
 
            var vtxfMaterialExtension = gltf.materials[index].extensions['KHR_techniques_webgl'];
 
            for (var value in vtxfMaterialExtension.values) {
                var us = techniques[vtxfMaterialExtension.technique].uniforms;
                for (var key in us) {
                    if (us[key] === value) {
                        vtxfMaterialExtension.values[key] = vtxfMaterialExtension.values[value];
                        delete vtxfMaterialExtension.values[value];
                        break;
                    }
                }
            };
        });
 
        techniques.forEach(function (t) {
            for (var attribute in t.attributes) {
                var name = t.attributes[attribute];
                t.attributes[attribute] = t.parameters[name];
            };
 
            for (var uniform in t.uniforms) {
                var name = t.uniforms[uniform];
                t.uniforms[uniform] = t.parameters[name];
            };
        });
    }
}
 
// Object.defineProperties(Cesium.Model.prototype, {
//     _cachedGltf: {
//         set: function (value) {
//             this._vtxf_cachedGltf = value;
//             if (this._vtxf_cachedGltf && this._vtxf_cachedGltf._gltf) {
//                 fixGltf(this._vtxf_cachedGltf._gltf);
//             }
//         },
//         get: function () {
//             return this._vtxf_cachedGltf;
//         }
//     }
// });

Cesium.Model.test = function(){
    console.log("测试成");
}
var PrimitiveWaterFace = (
    function () {
        var degreesArrayHeights;
        var fragmentShader;
        var normalMapUrl;
        var geometry;
        var appearance=null;
        var viewer;
        function _(options) {
            viewer = options.viewer;
            fragmentShader = FSWaterFace();
            normalMapUrl = options.normalMapUrl;
            if (options.DegreesArrayHeights && options.DegreesArrayHeights.length >= 3) {
                degreesArrayHeights = options.DegreesArrayHeights;

            } else {
                degreesArrayHeights = [116.04437, 30.10932, -100,
                    116.04537, 30.10932, -120,
                    116.04537, 30.11032, -100,
                    116.04437, 30.11032, -120,
                    116.04437, 30.10932, -100];
            }
            if (options.extrudedHeight) {
                geometry = CreateGeometry(degreesArrayHeights, options.startH || 0, options.extrudedHeight);
            } else {
                geometry = CreateGeometry(degreesArrayHeights, options.startH || 0);
            }

            if (!options.fillcolor) {
            appearance = CreateAppearence(fragmentShader, normalMapUrl,options);
            }
            if (options.ClassificationPrimitive) {
                // this.primitive = viewer.scene.primitives.add(new Cesium.Primitive(
                    var cfp= new Cesium.ClassificationPrimitive({
                        // allowPicking: false,
                        geometryInstances: new Cesium.GeometryInstance({
                            geometry: geometry,
                            attributes: {
                                color: Cesium.ColorGeometryInstanceAttribute.fromColor(options
                                    .fillcolor || Cesium.Color.WHITE.withAlpha(1)),
                                show: new Cesium.ShowGeometryInstanceAttribute(true)
                            },
                        }),

                        classificationType: Cesium.ClassificationType.CESIUM_3D_TILE,
                          appearance: appearance,
                        // asynchronous: false
                    })
                    if(!appearance){
                        console.log(appearance)
                    this.primitive = new Cesium.PrimitiveCollection();
		viewer.scene.primitives.add(this.primitive);
        this.primitive.add(cfp)
    }else{
        this.primitive = viewer.scene.primitives.add(new Cesium.Primitive(cfp))
    }
                    // ));
            } else {
                this.primitive = viewer.scene.primitives.add(new Cesium.Primitive({
                    allowPicking: false,
                    geometryInstances: new Cesium.GeometryInstance({
                        geometry: geometry
                    }),
                    // classificationType: Cesium.ClassificationType.CESIUM_3D_TILE,
                    appearance: appearance,
                    asynchronous: false
                }));
            }
        }
        //_degreesArrayHeights是一个组成多边形顶点数组[lon,lat,alt]
        function CreateGeometry(_degreesArrayHeights, startH, _extrudedHeight) {
			if(_extrudedHeight || startH){
            return new Cesium.PolygonGeometry({
                polygonHierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArrayHeights(_degreesArrayHeights)),
                 height: startH || 0,
                 extrudedHeight: _extrudedHeight ? _extrudedHeight : 0,
                // perPositionHeight: true
            });
			}else{
            return new Cesium.PolygonGeometry({
                polygonHierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArrayHeights(_degreesArrayHeights)),
                perPositionHeight: true
            });
			}
        }

        function CreateAppearence(fs, url, opts) {
            return new Cesium.EllipsoidSurfaceAppearance({
                material: new Cesium.Material({
                    fabric: {
                        type: 'Water',
                        uniforms: {
							baseWaterColor: new Cesium.Color.fromCssColorString(opts.waterColor || "#006ab4").withAlpha(0.5),// 颜色对象水的基色。
// blendColor：从水混合到非水区域时使用的 rgba 颜色对象。
// specularMap：用于指示水域区域的单通道纹理。
// specularIntensity：控制镜面反射强度的数字。

							normalMap: url,//水法线扰动的法线贴图。
							frequency: 400.0, //控制波数的数字。
							animationSpeed: 0.02,//控制水的动画速度的数字。
                            amplitude: 5.0//控制水波幅度的数字。
                        }
                    }
                }),
                fragmentShaderSource: fs
            });
        }

        function FSWaterFace() {
            return `
            varying vec3 v_positionMC;
            varying vec3 v_positionEC;
            varying vec2 v_st;
            void main()
            {
                czm_materialInput materialInput;
                vec3 normalEC = normalize(czm_normal3D * czm_geodeticSurfaceNormal(v_positionMC, vec3(0.0), vec3(1.0)));
                #ifdef FACE_FORWARD
                    normalEC = faceforward(normalEC, vec3(0.0, 0.0, 1.0), -normalEC);
                #endif
                materialInput.s = v_st.s;
                materialInput.st = v_st;
                materialInput.str = vec3(v_st, 0.0);
                materialInput.normalEC = normalEC;
                materialInput.tangentToEyeMatrix = czm_eastNorthUpToEyeCoordinates(v_positionMC, materialInput.normalEC);
                vec3 positionToEyeEC = -v_positionEC;
                materialInput.positionToEyeEC = positionToEyeEC;
                czm_material material = czm_getMaterial(materialInput);
                #ifdef FLAT
                    gl_FragColor = vec4(material.diffuse + material.emission, material.alpha);
                #else
                    gl_FragColor = czm_phong(normalize(positionToEyeEC), material, czm_lightDirectionEC);
                #endif
                gl_FragColor.a=0.7;
            }
`;
        }

        _.prototype.remove = function () {
            if (this.primitive != null) {
                viewer.scene.primitives.remove(this.primitive);
                this.primitive = null;
            }
        }
        _.prototype.updateDegreesPosition = function (_degreesArrayHeights, _extrudedHeight) {
            if (this.primitive != null) {
                viewer.scene.primitives.remove(this.primitive);
                if (_degreesArrayHeights && _degreesArrayHeights.length < 3) { return; }
                geometry = CreateGeometry(_degreesArrayHeights, _extrudedHeight ? _extrudedHeight : 0);

                this.primitive = viewer.scene.primitives.add(new Cesium.Primitive({
                    allowPicking: false,
                    geometryInstances: new Cesium.GeometryInstance({
                        geometry: geometry
                    }),
                    appearance: appearance,
                    asynchronous: false
                }));
            } else { return; }
        }
        return _;
    })();

export default PrimitiveWaterFace;
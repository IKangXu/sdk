/**
 * Uninpho GeoExplorer 示例配置文件：包含示例的分类、名称、缩略图、文件路径
 */
var identification = {
     name: "CTMap Explorer SDK1.1"
 
};


var exampleConfig = [{
        "id": "BasicLayer",
        "icon": "iconfont icon-wenjianjia",
        "name": "图层加载",
        "content": [{
            "id": "Initialize",
            "icon": "",
            "name": "初始化地球",
            "content": [{
                "name": "初始化",
                "thumbnail": "init.jpg",
                "fileName": "init"
            },
            {
                "name": "导航罗盘",
                "thumbnail": "widgets_navigation.jpg",
                "fileName": "widgets_navigation"
            }, 
            {
                "name": "鼠标状态栏/中心点/帧率",
                "thumbnail": "widgets.jpg",
                "fileName": "widgets"
            }, {
                "name": "缩放/正北",
                "thumbnail": "widgets_basic.jpg",
                "fileName": "widgets_basic"
            }, {
                "name": "二三维切换",
                "thumbnail": "widgets_sceneMode.jpg",
                "fileName": "widgets_sceneMode"
            }, {
                "name": "地名搜索",
                "thumbnail": "widgets_geocoder.jpg",
                "fileName": "widgets_geocoder"
            }]
        }, {
            "id": "BasicLayer",
            "icon": "",
            "name": "OGC服务图层",
            "content": [{
                "name": "本地影像",
                "thumbnail": "image_Local.jpg",
                "fileName": "image_Local"
            }, {
                "name": "WMS服务",
                "thumbnail": "ogc_wms.jpg",
                "fileName": "ogc_wms"
            }, {
                "name": "WMTS服务",
                "thumbnail": "ogc_wmts.jpg",
                "fileName": "ogc_wmts"
            }, {
                "name": "TMS服务",
                "thumbnail": "ogc_tms.jpg",
                "fileName": "ogc_tms"
            }, {
                "name": "GeoJSON",
                "thumbnail": "customDataSource.jpg",
                "fileName": "customDataSource"
            }, {
                "name": "KML/KMZ",
                "thumbnail": "ds_KMZ.jpg",
                "fileName": "ds_KMZ"
            }, {
                "name": "CZML",
                "thumbnail": "czml.jpg",
                "fileName": "czml"
            }, {
                "name": "国界省界数据",
                "thumbnail": "ds_SHP.jpg",
                "fileName": "ds_SHP"
            }]
        }, {
            "id": "OnlineLayer",
            "icon": "",
            "name": "在线地图",
            "content": [{
                "name": "天地图影像",
                "thumbnail": "image_tdt.jpg",
                "fileName": "image_tdt"
            }, {
                "name": "谷歌影像",
                "thumbnail": "google_img.jpg",
                "fileName": "image_google.img"
            }, {
                "name": "谷歌矢量",
                "thumbnail": "google_vec.jpg",
                "fileName": "image_google.vec"
            }, {
                "name": "OSM地图",
                "thumbnail": "image_osm.jpg",
                "fileName": "image_osm"
            },{
                "name": "经纬网图层",
                "thumbnail": "lonlatLayer.jpg",
                "fileName": "lonlatLayer"
            }, {
                "name": "MapBox地图",
                "thumbnail": "mapbox.jpg",
                "fileName": "image_mapbox"
            }, {
                "name": "暗色底图",
                "thumbnail": "image_mapboxDark.jpg",
                "fileName": "image_mapboxDark"
            }, {
                "name": "Arcgis地图",
                "thumbnail": "image_arcgis.jpg",
                "fileName": "image_arcgis"
            }, {
                "name": "百度地图",
                "thumbnail": "image_baidu.jpg",
                "fileName": "image_baidu"
            }, {
                "name": "腾讯地图",
                "thumbnail": "image_tengx.jpg",
                "fileName": "image_tengx"
            }, {
                "name": "高德影像地图",
                "thumbnail": "image_gaode.img.jpg",
                "fileName": "image_gaode.img"
            }, {
                "name": "高德矢量地图",
                "thumbnail": "image_gaode.vec.jpg",
                "fileName": "image_gaode.vec"
            }, {
                "name": "影像色调调节",
                "thumbnail": "image_adjust.jpg",
                "fileName": "image_adjust"
            }, {
                "name": "影像可视区域",
                "thumbnail": "image_rectangle.jpg",
                "fileName": "image_rectangle"
            }, {
                "name": "卷帘对比",
                "thumbnail": "image_contrast.jpg",
                "fileName": "image_contrast"
            }, {
                "name": "分屏对比",
                "thumbnail": "image_split.jpg",
                "fileName": "image_split"
            },{
                "name": "二三维联动",
                "thumbnail": "view2D_3D.jpg",
                "fileName": "view2D_3D"
            } ]
        }, {
            "id": "TerrainLayer",
            "icon": "",
            "name": "地形",
            "content": [{
                "name": "STK地形数据",
                "thumbnail": "terrian_stk.jpg",
                "fileName": "terrian_stk"
            }, {
                "name": "VRTheWorld地形数据",
                "thumbnail": "terrian_VRTheWorld.jpg",
                "fileName": "terrian_VRTheWorld"
            }, {
                "name": "全国30米地形数据",
                "thumbnail": "terrian_china.jpg",
                "fileName": "terrian_china"
            }, {
                "name": "地形夸张",
                "thumbnail": "terrian_exaggerate.jpg",
                "fileName": "terrian_exaggerate"
            } ]
        }, {
            "id": "ModelLayer",
            "icon": "",
            "name": "三维模型数据",
            "content": [{
                "name": "单体模型",
                "thumbnail": "model_gltf.jpg",
                "fileName": "model_gltf"
            }, {
                "name": "3DMax 城市模型",
                "thumbnail": "model_max.jpg",
                "fileName": "model_max"
            }, {
                "name": "3DMax 规划模型",
                "thumbnail": "model_max2.jpg",
                "fileName": "model_max2"
            }, {
                "name": "倾斜模型",
                "thumbnail": "model_qx.jpg",
                "fileName": "model_qx"
            }, {
                "name": "点云模型",
                "thumbnail": "model_pointcld.jpg",
                "fileName": "model_pointcld"
            }, {
                "name": "BIM模型",
                "thumbnail": "model_BIM.jpg",
                "fileName": "model_BIM"
            }, {
                "name": "城市白模",
                "thumbnail": "model_city.jpg",
                "fileName": "model_city"
            },  {
                "name": "城市夜光",
                "thumbnail": "model_cityDark.jpg",
                "fileName": "model_cityDark"
            }, {
                "name": "位置调整",
                "thumbnail": "model_transform.jpg",
                "fileName": "model_transform"
            },   {
                "name": "模型压平",
                "thumbnail": "model_flat.jpg",
                "fileName": "model_flat"
            }, {
                "name": "模型裁剪",
                "thumbnail": "model_clipping.jpg",
                "fileName": "model_clipping"
            }, {
                "name": "渲染模式",
                "thumbnail": "model_rendermode.jpg",
                "fileName": "model_rendermode"
            }, {
                "name": "亮度/对比度调节",
                "thumbnail": "model_hueadjust.jpg",
                "fileName": "model_hueadjust"
            } ]
        }]
    }, {
        "id": "Visualization",
        "icon": "iconfont icon-tuceng",
        "name": "场景管理",
        "content": [{
            "id": "Visualization",
            "icon": "",
            "name": "场景管理",
            "content": [{
                "name": "创建场景",
                "thumbnail": "project_new.jpg",
                "fileName": "project_new"
            }, {
                "name": "场景导入导出",
                "thumbnail": "project_export.jpg",
                "fileName": "project_export"
            }]
        }]
    }, {
        "id": "sceneView",
        "icon": "iconfont icon-qianshitu",
        "name": "三维浏览",
        "content": [{
            "id": "Tools",
            "icon": "",
            "name": "漫游飞行",
            "content": [{
                "name": "飞行定位",
                "thumbnail": "goto.jpg",
                "fileName": "goto"
            }, {
                "name": "VR模式",
                "thumbnail": "vr_view.jpg",
                "fileName": "vr_view"
            }, {
                "name": "路径漫游",
                "thumbnail": "routfly.jpg",
                "fileName": "routfly"
            }, {
                "name": "中心点漫游",
                "thumbnail": "fly_center.jpg",
                "fileName": "fly_center"
            }, {
                "name": "镜头环视",
                "thumbnail": "fly_around.jpg",
                "fileName": "fly_around"
            }, {
                "name": "键盘漫游",
                "thumbnail": "fly_Key.jpg",
                "fileName": "fly_Key"
            }, {
                "name": "地下模式",
                "thumbnail": "underground.jpg",
                "fileName": "underground"
            }]
        }]
    }, {
        "id": "Plotting",
        "icon": "",
        "name": "三维标绘",
        "content": [{
            "id": "Plotting1",
            "icon": "",
            "name": "基础标绘",
            "content": [{
                "name": "点、图标、模型、文字",
                "thumbnail": "plotting_point.jpg",
                "fileName": "plotting_point"
            }, {
                "name": "线对象",
                "thumbnail": "plotting_line.jpg",
                "fileName": "plotting_line"
            }, {
                "name": "多边形",
                "thumbnail": "plotting_polygon.jpg",
                "fileName": "plotting_polygon"
            }  ]
        }]
    }, {
        "id": "target",
        "icon": "iconfont icon-pin",
        "name": "基础工具",
        "content": [{
                "id": "measureTool",
                "icon": "",
                "name": "测量工具",
                "content": [{
                    "name": "距离测量",
                    "thumbnail": "measure_distance.jpg",
                    "fileName": "measure_distance"
                }, {
                    "name": "面积测量",
                    "thumbnail": "measure_area.jpg",
                    "fileName": "measure_area"
                }, {
                    "name": "高度测量",
                    "thumbnail": "measure_height.jpg",
                    "fileName": "measure_height"
                }, {
                    "name": "三角测量",
                    "thumbnail": "measure_triangel.jpg",
                    "fileName": "measure_triangel"
                } ]
            }, {
                "id": "target",
                "icon": "",
                "name": "书签管理",
                "content": [{
                    "name": "书签飞行",
                    "thumbnail": "bookmark_fly.jpg",
                    "fileName": "bookmark_fly"
                }, {
                    "name": "导入/出书签",
                    "thumbnail": "bookmark_save.jpg",
                    "fileName": "bookmark_save"
                }]
            }, {
                "id": "canvasRecoder",
                "icon": "",
                "name": "其他工具",
                "content": [{
                    "name": "录屏工具",
                    "thumbnail": "tool_recoder.jpg",
                    "fileName": "tool_recoder"
                }, {
                    "name": "截屏输出",
                    "thumbnail": "capture.jpg",
                    "fileName": "capture"
                } ]
            }
        ]
    }, {
        "id": "iconfont icon-productfeatures",
        "icon": "",
        "name": "空间分析",
        "content": [{
            "id": "Analysis",
            "icon": "",
            "name": "地形分析",
            "content": [{
                "name": "等高线",
                "thumbnail": "ana_contour.jpg",
                "fileName": "ana_contour"
            }, {
                "name": "高程渲染",
                "thumbnail": "ana_elevation.jpg",
                "fileName": "ana_elevation"
            }, {
                "name": "坡度分析",
                "thumbnail": "ana_slope.jpg",
                "fileName": "ana_slope"
            }, {
                "name": "坡向分析",
                "thumbnail": "ana_aspect.jpg",
                "fileName": "ana_aspect"
            },   {
                "name": "淹没分析",
                "thumbnail": "ana_flood.jpg",
                "fileName": "ana_flood"
            }, {
                "name": "天际线分析",
                "thumbnail": "ana_skyline.jpg",
                "fileName": "ana_skyline"
            }, {
                "name": "可视域分析",
                "thumbnail": "ana_viewshad.jpg",
                "fileName": "ana_viewshad"
            },  {
                "name": "控高分析",
                "thumbnail": "ana_height.jpg",
                "fileName": "ana_height"
            },  {
                "name": "缓冲分析",
                "thumbnail": "ana_buffer.jpg",
                "fileName": "ana_buffer"
            }  ]
        }]
    }, {
        "id": "Animation",
        "icon": "",
        "name": "三维动画",
        "content": [{
            "id": "Animation",
            "icon": "",
            "name": "动画",
            "content": [  {
                "name": "路径动画",
                "thumbnail": "animate_rout.jpg",
                "fileName": "animate_rout"
            }, {
                "name": "纹理动画",
                "thumbnail": "animate_material.jpg",
                "fileName": "animate_material"
            },   {
                "name": "动态波纹",
                "thumbnail": "animate_Ripple.jpg",
                "fileName": "animate_Ripple"
            },  {
                "name": "雷达扫描波",
                "thumbnail": "animate_radar.jpg",
                "fileName": "animate_radar"
            }, {
                "name": "雷达传感器",
                "thumbnail": "animate_sensor.jpg",
                "fileName": "animate_sensor"
            } ]
        }]
    }, {
        "id": "DynamicObject1",
        "icon": "iconfont icon-icon",
        "name": "行业数据集成",
        "content": [{
            "id": "DynamicObject11",
            "icon": "",
            "name": "气象数据展示",
            "content": [{
                "name": "热力图",
                "thumbnail": "heatMap.jpg",
                "fileName": "heatMap"
            }
            ]
        },  {
            "id": "DynamicObject13",
            "icon": "",
            "name": "复合可视化",
            "content": [{
                "name": "蜂巢网格",
                "thumbnail": "MapVLayer-honeyComb.jpg",
                "fileName": "MapVLayer-honeyComb"
            }, {
                "name": "迁徙图",
                "thumbnail": "MapVLayer-migrate.jpg",
                "fileName": "MapVLayer-migrate"
            }, {
                "name": "微博点",
                "thumbnail": "MapVLayer-weibo.jpg",
                "fileName": "MapVLayer-weibo"
            }, {
                "name": "数据链路",
                "thumbnail": "MapVLayer-linkData.jpg",
                "fileName": "MapVLayer-linkData"
            }, {
                "name": "方形网格",
                "thumbnail": "MapVLayer-square.jpg",
                "fileName": "MapVLayer-square"
            }]
        }]
    }, {
        "id": "Effect",
        "icon": "iconfont icon-earth",
        "name": "粒子特效",
        "content": [{
            "id": "Effect",
            "icon": "",
            "name": "粒子特效",
            "content": [{
                "name": "火特效",
                "thumbnail": "effect_Fire.jpg",
                "fileName": "effect_Fire"
            }, {
                "name": "下雨",
                "thumbnail": "effect_Rain.jpg",
                "fileName": "effect_Rain"
            }, {
                "name": "下雪",
                "thumbnail": "effect_Snow.jpg",
                "fileName": "effect_Snow"
            }, {
                "name": "水面绘制",
                "thumbnail": "waterSurface.jpg",
                "fileName": "waterSurface"
            }]
        }]
    }, {
        "id": "VRWithThreeJS",
        "icon": "iconfont icon-yunzhineng",
        "name": "视频融合",
        "content": [ {
            "id": "el-station",
            "icon": "",
            "name": "视频纹理",
            "content": [{
                "name": "视频纹理",
                "thumbnail": "videoMaterial.jpg",
                "fileName": "videoMaterial"
            },{
                "name": "画中画",
                "thumbnail": "smallScene.jpg",
                "fileName": "smallScene"
            }  ]
        }]
    } ,
    {
        "id": "application",
        "icon": "iconfont icon-settinggear",
        "name": "应用案例",
        "content": [{
                "id": "el-station",
                "icon": "",
                "name": "三维场站",
                "content": [  {
                    "name": "无人机扫描",
                    "thumbnail": "ana_viewshad_scan.jpg",
                    "fileName": "ana_viewshad_scan"
                },{
                    "name": "摄像头布控",
                    "thumbnail": "ana_viewshad_parms.jpg",
                    "fileName": "ana_viewshad_parms"
                },{
                    "name": "区域通视",
                    "thumbnail": "ana_visibility.jpg",
                    "fileName": "ana_visibility"
                } ,{
                    "name": "驾驶模拟",
                    "thumbnail": "ana_viewshad_flight.jpg",
                    "fileName": "ana_viewshad_flight"
                } 
        ]}]
    },   {
        "id": "application",
        "icon": "iconfont icon-settinggear",
        "name": "插件示例",
        "content": [{
                "id": "pluginsDemo",
                "icon": "",
                "name": "插件示例",
                "content": [{
                    "name": "显示帧率",
                    "thumbnail": "plugin_fps.jpg",
                    "fileName": "plugin_fps"
                },{
                    "name": "卷帘对比",
                    "thumbnail": "plugin_layersplit.jpg",
                    "fileName": "plugin_layersplit"
                },{
                    "name": "影像调色",
                    "thumbnail": "plugin_contrast.jpg",
                    "fileName": "plugin_contrast"
                },{
                    "name": "剖面分析",
                    "thumbnail": "plugin_profile.jpg",
                    "fileName": "plugin_profile"
                } 
            ]
            }

        ]
    }

]
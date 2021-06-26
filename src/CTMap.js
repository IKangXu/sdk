
import * as Util from './Core/Util';
import PluginManager from './Plugin/PluginManager';
import Widget from './Plugin/Widget';
import Tool from './Plugin/Tool';

import Viewer from "./Viewer/Viewer"
import DrawTool from "./Tools/Draw/DrawTool"
import Measure from "./Tools/Measure/Measure"
// import tile3DLayer from "./Layer/tile3DLayer"
//通视分析
import ViewshedAnalyze from "./Analyze/ViewshedAnalyze"
import FloodAnalyze from "./Analyze/FloodAnalyze"
//粒子特效
import EnvEffects from "./EnvSystem/EnvEffects"
//模型位置编辑
import TransformEditor from "./Tools/transformEditor"
import LayerType from "./Enums/LayerType"
import LayerStyle from "./Enums/LayerStyle"
import gltfWraper from "./Global/gltfWraper"
import Cesium3dTilesetExt from "./Global/Cesium3dTilesetExt"
import TerrainLayerList from "./Layer/TerrainLayerList"
import BaiDuImageryProvider from "./Layer/BaiDuImageryProvider"
import KeyboardNavigation from "./Utility/KeyboardNavigation"

import { HeatMapLayer, HeatMapOpt } from './Layer/HeatMap/HeatMapLayer'
import { MapVLayer, MapVOpt } from './Layer/MapV/MapVLayer'
import Clusterpoint from './Layer/Clusterpoint';
import licManager from "./LicManager/LicManager"
import welcom from "./LicManager/WelcomAPI"
import LatLonGridLayer from './Layer/LatLonGridLayer'
import WaterFacePrimitive from "./Layer/Primitive/WaterFacePrimitive"

let CTMap = Cesium;
CTMap['DrawTool'] = DrawTool;
CTMap['PluginManager'] = PluginManager;
CTMap['Util'] = Util;
CTMap['Widget'] = Widget;
CTMap['Tool'] = Tool;
CTMap['Measure'] = Measure;
CTMap['EnvEffects'] = EnvEffects;
CTMap['ViewshedAnalyze'] = ViewshedAnalyze;
CTMap['FloodAnalyze'] = FloodAnalyze;
CTMap['transformEditor'] = TransformEditor;
CTMap['LayerType'] = LayerType;
CTMap['LayerStyle'] = LayerStyle;
CTMap['TerrainLayerList'] = TerrainLayerList;
CTMap['Viewer'] = Viewer;
CTMap['KeyboardNavigation'] = KeyboardNavigation;
CTMap['BaiDuImageryProvider'] = BaiDuImageryProvider;

CTMap['MapVLayer'] = MapVLayer;
CTMap['Clusterpoint'] = Clusterpoint;
CTMap['MapVOpt'] = MapVOpt;
CTMap['HeatMapLayer'] = HeatMapLayer;
CTMap['HeatMapOpt'] = HeatMapOpt;
CTMap['LatLonGridLayer'] = LatLonGridLayer;
CTMap['WaterFacePrimitive'] = WaterFacePrimitive;


try {
  CTMap = licManager.checkLicense() ? CTMap : {};
} catch (err) {

}

welcom.greeting()

export default CTMap;
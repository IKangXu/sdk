 
import './styles/cesium-navigation.css' 
import naviWidget from "./NavigationWidget"

/**
 * A mixin which adds the Compass/Navigation widget to the Viewer widget.
 * Rather than being called directly, this function is normally passed as
 * a parameter to {@link Viewer#extend}, as shown in the example below.
 * @exports viewerNavigationWidgetMixin
 *
 * @param {Viewer} viewer The viewer instance.
 * @param {{}} options The options.
 *
 * @exception {DeveloperError} viewer is required.
 *
 * @demo {@link http://localhost:8080/index.html|run local server with examples}
 *
 * @example
 * var viewer = new Cesium.Viewer('cesiumContainer');
 * viewer.extend(viewerNavigationWidgetMixin);
 */
function viewerNavigationWidgetMixin (viewer, options) {
  if (!Cesium.defined(viewer)) {
    throw new Cesium.DeveloperError('viewer is required.')
  }

  var NavigationWidget = init(viewer, options)

  NavigationWidget.addOnDestroyListener((function (viewer) {
    return function () {
      delete viewer.NavigationWidget
    }
  })(viewer))

  Object.defineProperties(viewer.prototype, {
    NavigationWidget: {
      configurable: true,
      get: function () {
        return viewer.cesiumWidget.NavigationWidget
      }
    }
  })
}

/**
 *
 * @param {CesiumWidget} cesiumWidget The cesium widget instance.
 * @param {{}} options The options.
 */
viewerNavigationWidgetMixin.mixinWidget = function (cesiumWidget, options) {
  return init.apply(undefined, arguments)
}

/**
 * @param {Viewer|CesiumWidget} viewerCesiumWidget The Viewer or CesiumWidget instance
 * @param {{}} options the options
 */
var init = function (viewerCesiumWidget, options) {
  var NavigationWidget = new naviWidget(viewerCesiumWidget, options)

  var cesiumWidget = Cesium.definedviewerCesiumWidget.cesiumWidget ? viewerCesiumWidget.cesiumWidget : viewerCesiumWidget

  Object.defineProperties(cesiumWidget.prototype, {
    NavigationWidget: {
      configurable: true,
      get: function () {
        return NavigationWidget
      }
    }
  })

  NavigationWidget.addOnDestroyListener((function (cesiumWidget) {
    return function () {
      delete cesiumWidget.NavigationWidget
    }
  })(cesiumWidget))

  return NavigationWidget
}

export default viewerNavigationWidgetMixin

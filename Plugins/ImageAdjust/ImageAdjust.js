class ImageAdjust  extends CTMap.Tool {
    reference() {
        this.html = "./imgAdjust.html";
        this.css = "./imgAdjust.css";
    }
    init() {
		console.log("23423423432423");
        let that = this;
        var imageryLayers = this.earth.imageryLayers;        
        let uiConfig = [   
            {id:"titleImg" ,src:"./调色板.png"},
            {id:"img-gamma" , src : "./伽马.png" },
            {id:"img-saturation", src : "./饱和度.png"},
            {id:"img-hue" ,  src : "./色调.png" },
            {id:"img-contrast"  ,  src : "./对比度.png"},
            {id:"img-brightness", src : "./亮度.png"}
        ];
        uiConfig.map(item=>{
            document.getElementById(item.id).src = this.formatURL(item.src);
        });
        
        document.getElementById('closeImgAjust').onclick = function () {
            that.earth.setCurrentTool();
        };

        var viewModel = {
            brightness: 0,
            contrast: 0,
            hue: 0,
            saturation: 0,
            gamma: 0
        };
       
        CTMap.knockout.track(viewModel);
     
        var tooPanel = document.getElementById('tooPanel');
        CTMap.knockout.applyBindings(viewModel, tooPanel);
        
        var parentNode = tooPanel.parentNode;
        parentNode.style.top = '0' ;
        function subscribeLayerParameter(name) {
            CTMap.knockout.getObservable(viewModel, name).subscribe(
                function (newValue) {
                    if (imageryLayers.length > 0) {
                        var index = imageryLayers.length - 1
                        var layer = imageryLayers.get(index);
                        layer[name] = newValue;
                    }
                }
            );
        }
        subscribeLayerParameter('brightness');
        subscribeLayerParameter('contrast');
        subscribeLayerParameter('hue');
        subscribeLayerParameter('saturation');
        subscribeLayerParameter('gamma');

        // Make the viewModel react to base layer changes.
        function updateViewModel() {
            if (imageryLayers.length > 0) {
                var index = imageryLayers.length - 1
                var layer = imageryLayers.get(index);
                viewModel.brightness = layer.brightness;
                viewModel.contrast = layer.contrast;
                viewModel.hue = layer.hue;
                viewModel.saturation = layer.saturation;
                viewModel.gamma = layer.gamma;
            }
        }
        imageryLayers.layerAdded.addEventListener(updateViewModel);
        imageryLayers.layerRemoved.addEventListener(updateViewModel);
        imageryLayers.layerMoved.addEventListener(updateViewModel);
        updateViewModel();

        var reset = document.getElementById('reset');
        reset.onclick = function () {
            viewModel.brightness = 1;
            viewModel.contrast = 1;
            viewModel.hue = 0;
            viewModel.saturation = 1;
            viewModel.gamma = 1;
        }
    }
}

//# sourceURL=ImgAdjust.js

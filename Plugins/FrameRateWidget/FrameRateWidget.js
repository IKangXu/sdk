class FrameRateWidget extends CTMap.Widget {
	init() { 
		this._isShow = this.earth.scene.debugShowFramesPerSecond;
		this.earth.scene.debugShowFramesPerSecond = true;
	} 
	remove() {
		this.earth.scene.debugShowFramesPerSecond = this._isShow;
	}
}
 
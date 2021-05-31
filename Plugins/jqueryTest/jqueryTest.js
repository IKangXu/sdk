class jqueryTest extends CTMap.Tool {
    reference() {
        this.html = "./jqueryTest.html";//主页面
        this.css = []; //在这里引入css，例如 ['./css/123.css','./456.css',]
        this.script = ['./jquery.min.js'];//在这里引入第三方库，例如 ['./jquery.min.js','./123/541.js']
    }
    init() {
        let version = $.fn.jquery
		alert('jquery已引入，jquery 版本为:'+version);        

    }
	remove() {
        this.earth.canvas.style.cursor = 'default';
        if (this.entity) {
            this.earth.entities.remove(this.entity)
        } 
        this.measureTool.clearMeasure();      
    }
}

//# sourceURL=Profile.js

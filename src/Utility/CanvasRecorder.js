

/*
 * 作者：zhuwz
 * 描述:场景录屏，将场景动画录制为视频导出
 * 日期：2019.5.16
 */

export default class CanvasRecorder {

    constructor(canvas, mbps) {      
        this.recordedBlobs = [];
        this._videoType = "video/webm";
        this.mediaRecorder = null;

        this.stream = canvas.captureStream();
        if (typeof this.stream == undefined || !this.stream) {
            return;
        }
        this._mbps = mbps || 2.5;

        this.video = document.createElement('video');
        this.video.style.display = 'none';
    }

     /**
     * 获取设置录制视频的码率
     * @type number
     *
     * @default 2.5
     */
    get mbps(){
        return  this._mbps;
    }
    set mbps(val){
        this._mbps = val;
    }
    
    /**
     * 获取设置录制视频的格式
     * @type string
     *
     * @default video/webm
     */
    get videoType(){
        return  this._videoType;
    }
    set videoType(val){
        this._videoType = val;
    }
    

     /**
     * 开始录制视频
     * @type string
     *
     * @default video/webm
     */
    start() {
        let types = [
            "video/webm",
            'video/webm,codecs=vp9',
            'video/vp8',
            "video/webm\;codecs=vp8",
            "video/webm\;codecs=daala",
            "video/webm\;codecs=h264",
            "video/mpeg",
            'video/mp4'
        ]; 
        if (!MediaRecorder.isTypeSupported(this._videoType)) {
            console.log("No supported type found for MediaRecorder");
            for (let i in types) {
                if (MediaRecorder.isTypeSupported(types[i])) {
                    this._videoType = types[i];
                    break;
                }
            }
        }
        
        let options = { 
            mimeType: this._videoType,
            videoBitsPerSecond: this._mbps*1000000 // 2.5Mbps
        };

        this.recordedBlobs = [];
        try {
            this.mediaRecorder = new MediaRecorder(this.stream, options);
        } catch (e) {
            alert('MediaRecorder is not supported by this browser.');
            console.error('Exception while creating MediaRecorder:', e);
            return;
        }

        console.log('Created MediaRecorder', this.mediaRecorder, 'with options', options);

        this.mediaRecorder.onstop =()=>{
            const superBuffer = new Blob(this.recordedBlobs, { type: this.supportedType });
            this.video.src = window.URL.createObjectURL(superBuffer);
        }
        //this.handleStop;
        this.mediaRecorder.ondataavailable = (event)=>{
            if (event.data && event.data.size > 0) {
                this.recordedBlobs.push(event.data);
            }
        }
        //this.handleDataAvailable;

        this.mediaRecorder.start(100); // collect 100ms of data blobs
        console.log('MediaRecorder started', this.mediaRecorder);
    }

     /**
     * 停止录制视频
     *
     */
    stop() {
        this.mediaRecorder.stop();
        this.video.controls = true;
    }

    /**
     * 保存录制的视频
     * @param file_name 文件的名称
     *
     */
    save(file_name) {
        const name = file_name || 'recording.webm';
        const blob = new Blob(this.recordedBlobs, { type: this.supportedType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);
    }



    handleDataAvailable(event) {
        if (event.data && event.data.size > 0) {
            this.recordedBlobs.push(event.data);
        }
    }

    handleStop(event) {
       // console.log('Recorder stopped: ', event);
        const superBuffer = new Blob(this.recordedBlobs, { type: this.supportedType });
        this.video.src = window.URL.createObjectURL(superBuffer);
    }

    
}

 
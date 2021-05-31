
/*
 * 作者：zhuwz
 * 描述:书签管理类
 * 日期：2019.5.16
 */
class BookmarkManager{
    /**
     * @param {viewer} viewer viewer对象
     */
    constructor(viewer){
        this.viewer = viewer;
        this._itemList = [];
        this._currentItems = [];
        this._isFly=false;
        this._relayTime = 1000;
    }

    _playAnimation(complete,that){             
        var bkItem = that._currentItems[that._currentIndex];        
        that._currentIndex++;
        if (that._currentIndex > that._currentItems.length){
            that.stopPlay();
            return;
        } 
        let view = bkItem.view;
        var destination = new Cesium.Cartesian3(view.position[0], view.position[1], view.position[2]);
        that.viewer.camera.flyTo({
            destination: destination,
            orientation: {
                heading :view.orientation[0],
                pitch :view.orientation[1],
                roll : view.orientation[2]
            } ,
            duration: view.duration,
            easingFunction:Cesium.EasingFunction.LINEAR_NONE,
            complete: function () {
                if (that._isFly)
                    complete(complete,that)
                //that._playTimer = setTimeout(complete(complete,that), that._relayTime)
            }
        });         
    }

    _getNewItem(name){
        let view = this.viewer.viewPort.getCurrent();    
        return {
            view:view,
            id:Cesium.createGuid(),
            name:name
        }
    }

    
    /**
     * 加载json对象
     * @param {Object} config 书签对象
     */
    fromJSON(config){
        this._itemList = config;
    }
 
    /**
     * 导出json对象
     * @return {string} 书签对象
     */
    toJSON(){
        return  this._itemList;
    }


     /**
     * 添加书签组
     * @param {string} name 书签名称
     * @return {Object} 书签组对象
     */
    addGroup(name){
        if(this._isFly)
            return;
        let bkItem = {
            type:"gruop",
            children:[],
            id:Cesium.createGuid(),
            name:name,
        }
        this._itemList.push(bkItem);    
        return bkItem;
    }

     /**
     * 删除书签组
     * @param {string} id 书签组的id
     * @return {Boolean} 删除成功返回true,否则返回false
     */
    removeGroup(id){
        if(this._isFly)
            return false;
        for(let i=0;i<this._itemList.length;i++){
            if(this._itemList[i].id==id){
                this._itemList.splice(i,1);
                break;
            }
        }   
        return true;
    }


     /**
     * 添加书签
     * @param {string} groupid 组的ID
     * @param {string} name 书签名称
     * @return {Object} 书签对象
     */
    addItem(groupid,name){
        if(this._isFly)
            return false;
        let item;
        for(let i=0;i<this._itemList.length;i++){
            if(this._itemList[i].id==groupid){
                item = this._getNewItem(name);
                this._itemList[i].children.push(item);               
                break;
            }
        } 
        return item;
    }

    /**
     * 删除书签
     * @param {string} pid 组节点id
     * @param {string} id 书签id
     * @return {Boolean} 添加成功返回true,否则返回false
     */
    removeItem(pid,id){
        if(this._isFly)
            return false;
        for(let i=0;i<this._itemList.length;i++){
            if(this._itemList[i].id==pid){
                let bkList = this._itemList[i].children;                
                for(let j=0;j<bkList.length;j++){
                    if(bkList[j].id==id){
                        bkList.splice(j,1);
                        break;
                    }
                }              
            }
        }
        return true; 
    }
    /**
     * 清空书签
     * @return {Boolean} 添加成功返回true,否则返回false
     */
    removeAll(){
        if(this._isFly)
            return false;
        this._itemList = [];
        return true;
    }

    /**
     * 定位书签
     * @param {Object} item 书签对象
     * @return {Boolean} 添加成功返回true,否则返回false
     */
    flyToItem(item){
        if(!item)
            return;         
        this.viewer.viewPort.setCurrent(item.view);       
    }

    /**
     * 播放书签组
     * @param {string} id 书签组对象的id
     */
    playGroup(id){
        for(let i=0;i<this._itemList.length;i++){
            if(this._itemList[i].id==id){
                let bkList = this._itemList[i].children;                
                this.playItems(bkList); 
                break;

            }
        }
         
    } 
    /**
     * 播放书签
     * @param {Array} items 书签数组
     */
    playItems(items){
        if(this._isFly)
            this.stopPlay();    
        this._isFly = true;
        this._currentItems =items;
        this._currentIndex = 0;
        this._playAnimation(this._playAnimation,this);
         
    } 

     /**
     * 停止飞行
     *
     */
    stopPlay(){
        if (this._playTimer) {
            clearTimeout(this._playTimer);
        } 
        this.viewer.camera.cancelFlight();
        this._currentIndex = 0;
        this._currentItems =[];
        this._isFly = false;
    } 
     /**
     * 是否在飞行模式
     * @return {Boolean} 是否处于飞行状态
     * @readonly 
     */
    get isFly(){
        return this._isFly;
    }

    /**
     * 飞行间隔时间
     * @return {number} 飞行间隔时间
     */
    get relayTime(){
        return this._relayTime;
    }

    /**
     * 飞行间隔时间
     * @param {number} val 飞行间隔时间
     */
    set relayTime(val){
        this._relayTime = val;
    }

    /**
     * 书签列表
     * @return {Object}  书签列表
     * @readonly
     */
    get itemList(){
        return this._itemList;
    }

}

export default BookmarkManager;
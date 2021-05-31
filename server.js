const path = require('path');
const fs = require('fs');
const Express = require('express');
const bodyParser = require('body-parser');
const webpack = require('webpack');
const serveIndex = require('serve-index');

const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./config/webpack.dev.config.js');

const app = new Express();
const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 9090 : process.env.PORT;

fs.existsSync = function (p) {
    try {
        if (/^\//.test(p)) {
            p = `.${p}`;
        }
        const buf = fs.readFileSync(p);
    } catch (e) {
        return undefined;
    }
    return path;
};

// app.use(Express.static(path.join(__dirname, '/')));
app.use(bodyParser());

if (isDeveloping) {
    const compiler = webpack(config);
    const middleware = webpackMiddleware(compiler, {
        publicPath: config.output.publicPath,
        contentBase: 'src',
        stats: {
            colors: true,
            hash: false,
            timings: true,
            chunks: false,
            chunkModules: false,
            modules: false,
            warnings: false
        }
    });

    app.use(middleware);
    app.use(webpackHotMiddleware(compiler));

    app.use('/', serveIndex(path.join(__dirname, '/'), { icons: true }))


    app.use(Express.static(path.join(__dirname, '/')));
    app.use('*', (req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With');
        res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
        res.header('Content-Type', 'text/html;charset=utf-8');
        // res.sendFile(path.join(__dirname, '/'));
        next();
    });

} else {
    app.use(Express.static(path.join(__dirname, '/')));
    app.get('*', (req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With');
        res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
        res.header('Content-Type', 'text/html;charset=utf-8');
        // res.sendFile(path.join(__dirname, '/'));
        next();
    });

}

  
app.get('/markFileList',(req, res) => {
    var files = fs.readdirSync(path.join(__dirname, '/save'));//需要用到同步读取
    var fileList = [];
    files.forEach(walk);
    function walk(file){
        states = fs.statSync(path.join(__dirname, '/save' ,file));
        if(!states.isDirectory())
        {
            //创建一个对象保存信息
            var obj = new Object();
            obj.size = (states.size/1024).toFixed(2) + "KB";//文件大小，以字节为单位
            obj.name = file;//文件名
            var date = states.mtime;
            obj.mtime = `${date.getFullYear()}/${date.getMonth()}/${date.getDay()+date.getHours()}:${date.getMinutes()}`; //文件绝对路径
            obj.type = "JSON"; //文件绝对路径
            fileList.push(obj);
        }
    }
    res.send(fileList);
});


function readDirSync(route, menu) {
    const pa = fs.readdirSync(route);
    for (const ele of pa) {
        const info = fs.statSync(`${route}/${ele}`)
        if (info.isDirectory()) {
            // console.log("dir: "+ele)
            menu[ele] = {};
            menu[ele] = readDirSync(`${route}/${ele}`, menu[ele]);
        } else {
            // console.log("file: "+ele)
            if (!menu._files || !(menu._files instanceof Array)) menu._files = [];
            menu._files.push(ele);
        }
    }
    return menu;
}

app.get('/api/examples', (req, res) => {
    const menu = readDirSync('./examples', {});
    if (menu._files) delete menu._files;
    res.send(menu);
});

app.post('/save', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    res.header('Content-Type', 'application/json;charset=utf-8');
    //写入文件
    fs.writeFile(`./save/${req.body.fileName}`, req.body.data, (err) => {
        if (err) throw err;
        console.log(`File ${req.body.fileName} Saved !`); //文件被保存
    });
    res.send({status: 'ok'});
});


app.listen(port, '0.0.0.0', (err) => {
    if (err) console.log(err);
    console.info('===> Listening on port %s. Open up http://0.0.0.0:%s/ in your broswer.', port, port);
});

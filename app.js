var fs = require('fs');
var express = require('express');
var multer  = require('multer')

var app = express();
//var upload = multer({ dest: 'upload/' });

var createFolder = function(folder){
    try{
        fs.accessSync(folder); 
    }catch(e){
        //console.log('e:',e);
        var pathAry = folder.split('/');
        for(var i=0;i<pathAry.length;i++){
            var curPath = pathAry.slice(0,i+1).join('/');
            var isExist = fs.existsSync(curPath);
            console.log('curPath:'+curPath+' isExist:'+isExist);
            !isExist?fs.mkdirSync(curPath):null;
        }
    }  
};

//user可由登录成功时返回
var user = {
    "nickname" : "allen",
    "avator" : "http://wx.qlogo.cn/mmopen/0ZhNSIZIBnxVxicgIwPU4pFs4hPKuOhB5aur5NazQTz3iavJFpZ2lAlPBCjSVZe5icnTlgtC8mwLUXLg2oer8qDE0rWOFQpkjPh/0",
    "openid" : "1231243fef31swsqd23dd2d23d4d4d4",
    "code" : "061Qh9JG09HVZk2tu1NG0stUIG0Qh9JI",
    "role" : "R",
    "roles" : [],
    "clients" : [ 
        "dc69547da507c7223b4273f4874156c7b333e996c0e60eeb72aa880df3a33f53", 
        "ed6fca9544811ba682e7f51b76702999e9c0d193797ffa7a9b21dcfd0764a1d4"
    ],
    "email" : "allen.h.chen@pwc.com",
    "token" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiZGM2OTU0N2RhNTA3YzcyMjNiNDI3M2Y0ODc0MTU2YzdiMzMzZTk5NmMwZTYwZWViNzJhYTg4MGRmM2EzM2Y1MyIsImlhdCI6MTUxMTMzNDkwOX0.MH6ZGWOtEXmcug1-7fGSN2ouS9cNvLIhwv98cll6yyE"
}
var openid = user.openid;
var uploadFolder = 'upload/user/' + openid;

console.log(uploadFolder);
createFolder(uploadFolder);

// 通过 filename 属性定制
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder);    // 保存的路径，备注：需要自己创建
    },
    filename: function (req, file, cb) {
        // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
        cb(null,Date.now() + '-' +file.originalname);  
    }
});

// 通过 storage 选项来对 上传行为 进行定制化
var upload = multer({ storage: storage })

app.get('/',function(req,res,next){
    res.send('ok');
})

// 单图上传
app.post('/upload-single', upload.single('logo'), function(req, res, next){
    let data = req.file;
    console.log(data);
    let mimetype = data.mimetype.toString();
    console.log('mimetype: ',mimetype);
    if(mimetype !== 'image/jpeg' && mimetype !== 'image/png' && mimetype !== 'image/gif' && mimetype != 'application/pdf'){
        res.send('file format error');
    }
    res.send({success:true,data:data});
});

// 多图上传
app.post('/upload-multiple', upload.array('logo', 2), function(req, res, next){
    let data = req.files;
    console.log(data);
    res.send({success:true,data:data});
});

// 下载
let path = '1512715725498-WechatIMG17.JPEG';
app.get('/download',function(req,res,next){
    let filepath = req.query.path;
    let originalname = filepath.split('/').pop().slice(14);
    console.log('filepath:',filepath);
    console.log('originalname:',originalname);
    res.download(filepath,originalname,function(err){
        if(err){
            res.send(err);
        }
    })
})


app.get('/form', function(req, res, next){
    var form = fs.readFileSync('./form.html', {encoding: 'utf8'});
    res.send(form);
});


app.listen(3000,function(){
    console.log('Server Up');
    console.log('INFO', 'Startup complete on port', 3000);
});
app.timeout = 240000;
// 在 Cloud code 里初始化 Express 框架
var express = require('express');
var app = express();

// App 全局配置
app.set('views', 'cloud/views'); // 设置模板目录
app.set('view engine', 'ejs'); // 设置 template 引擎
app.use(express.bodyParser()); // 读取请求 body 的中间件

// 创建AV.Object子类.
// 该语句应该只声明一次
var Barrage = AV.Object.extend("Barrage");

// 发送弹幕
app.post('/send', function(req, res) {
	var data = req.body;
	var barrage = Barrage.new({
		'color': data.color,
		'fontSize': data.fontSize,
		'text': data.text,
		'time': data.time
	});
	barrage.save(null, {
		success: function(barrage) {
			console.log('New object created with objectId: ' + barrage.id);
		},
		error: function(barrage, error) {
			console.log('Failed to create new object, with error code: ' + error.description);
		}
	});
});

// 获取弹幕
app.get('/get', function(req, res) {
	var query = new AV.Query(Barrage);
	query.find({
		success: function(results) {
			res.send(results);
		},
		error: function(error) {
			console.log("Error: " + error.code + " " + error.message);
		}
	});
});

// 最后，必须有这行代码来使 express 响应 HTTP 请求
app.listen();
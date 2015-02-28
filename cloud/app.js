// 在 Cloud code 里初始化 Express 框架
var express = require('express');
var app = express();

// App 全局配置
app.set('views', 'cloud/views'); // 设置模板目录
app.set('view engine', 'ejs'); // 设置 template 引擎
app.use(express.bodyParser()); // 读取请求 body 的中间件

// 发送弹幕
app.post('/send', function(req, res) {
	res.render('message', {
		message: 'success'
	});
});

// 获取弹幕
app.get('/get', function(req, res) {
	res.render('message', {
		message: [{
			'time': 5,
			'text': 'hello world'
		}, {
			'time': 10,
			'text': '你好 世界',
			'color': 'red',
			'fontSize': '22px'
		}, {
			'time': 15,
			'text': '这是一个',
			'color': 'green'
		}, {
			'time': 20,
			'text': 'HTML5弹幕视频播放器',
			'color': 'blue'
		}, {
			'time': 25,
			'text': '样例'
		}]
	});
});

// 最后，必须有这行代码来使 express 响应 HTTP 请求
app.listen();
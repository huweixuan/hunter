/*!
 * 弹幕视频播放器
 */

(function(factory) {
	if (typeof define === "function" && define.amd) {
		// AMD. Register as an anonymous module.
		define(["jquery"], factory);
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function($) {

	function isArray(obj) {
		return (typeof obj == 'object') && obj.constructor == Array;
	}

	function getSecond() {
		var timenow = new Date();
		var second = timenow.getHours() * 3600;
		second += timenow.getMinutes() * 60;
		second += timenow.getSeconds();
	}

	$.Barrage = function(option, pool) {
		var defaultOption = {
			'color': 'white',
			'fontSize': '16px',
			'animate': 'normal',
			'speed': 'normal',
			'position': 'normal'
		}

		this.option = $.extend({}, defaultOption, option);
		this.pool = pool;
		this.createEl();
	}

	$.Barrage.prototype.createEl = function() {
		var _opt = this.option;
		var _pool = this.pool;
		this.$el = $('<li></li>').text(_opt.text).css({
			'color': _opt.color,
			'fontSize': _opt.fontSize,
			'position': 'absolute',
			'whiteSpace': 'nowrap',
			'top': '10px',
			'left': _pool.width()
		}).hide().appendTo(_pool.$el);
	}

	$.Barrage.prototype.play = function(currentTime) {
		//todo 增加animate&speed&position
		var self = this;
		var interval = self.option.time - currentTime;
		var el = self.$el;
		if (interval < 0) {
			return;
		}
		self.timer = setTimeout(function() {
			el.show().animate({
				'left': -el.width()
			}, 8000);
		}, interval * 1000);
	}

	$.Barrage.prototype.pause = function(currentTime) {
		if (this.timer) {
			clearTimeout(this.timer);
		}
	}

	$.BarragePool = function(video, url) {
		var self = this;
		self.barrages = [];
		self.video = video;
		self.createPoolEl(video);
		self.state = 'pause';

		$.ajax({
			url: url,
			type: 'GET',
			dataType: 'json',
			success: function(data) {
				$.each(data, function(index, option) {
					self.barrages.push(new $.Barrage(option, self));
				});
			},
			error: function() {}
		});
	}

	$.BarragePool.prototype.width = function() {
		return this.$el.width();
	}

	$.BarragePool.prototype.height = function() {
		return this.$el.height();
	}

	$.BarragePool.prototype.createPoolEl = function(video) {
		var offset = video.offset();
		this.$el = $('<ul></ul>').css({
			'position': 'absolute',
			'overflow': 'hidden',
			'top': offset.top,
			'left': offset.left,
			'width': video.width(),
			'height': video.height() - 50
		});
		video.after(this.$el);
	}

	$.BarragePool.prototype.playBarrage = function() {
		var currentTime = this.video[0].currentTime;
		this.state = 'play';
		$.each(this.barrages, function(index, barrage) {
			barrage.play(currentTime);
		});
	}

	$.BarragePool.prototype.pauseBarrage = function() {
		this.state = 'pause';
		$.each(this.barrages, function(index, barrage) {
			barrage.pause();
		});
	}

	$.BarragePool.prototype.addBarrage = function(option) {
		var barrage = new $.Barrage(option, this);
		barrage.$el.css({
			'border': '1px solid #00d200'
		})
		this.barrages.push(barrage);
		if (this.state = 'play') {
			barrage.play();
		}
	}

	$.BarrageSender = function(video, url, barragePool) {
		this.url = url;
		this.video = video;
		this.pool = barragePool;

		this.createSenderEl(video);
		this.bindEvent();
	}

	$.BarrageSender.prototype.createSenderEl = function(video) {
		var offset = video.offset();
		this.$el = $('<div><input type="text" placeholder="请输入弹幕～"><button type="button">发送da☆ze～</button></div>').css({
			'position': 'absolute',
			'top': offset.top + video.height() + 10,
			'left': offset.left,
			'width': video.width()
		});
		video.after(this.$el);
	}

	$.BarrageSender.prototype.bindEvent = function() {
		var self = this;
		var button = self.button = $('button', self.$el);
		var input = self.input = $('input', self.$el);
		button.on('click', function() {
			self.sendBarrage();
		});
		input.on('keypress', function(e) {
			if (e.keyCode == 13) { // enter 键
				self.sendBarrage();
			}
		});
	}

	$.BarrageSender.prototype.sendBarrage = function() {
		var self = this;
		var barrage = {
			'text': self.input.val(),
			'time': self.video[0].currentTime + 3 // 弹幕延迟3秒
		};
		$.ajax({
			url: self.url,
			type: 'POST',
			data: barrage,
			traditional: true,
			dataType: 'json',
			success: function(data) {
				self.pool.addBarrage(barrage);
			},
			error: function() {}
		});
		self.input.val('');
	}

	$.fn.extend({
		hunter: function(getUrl, sendUrl) {
			var bPool = new $.BarragePool(this, getUrl);
			this.on('play', function() {
				bPool.playBarrage();
			});
			this.on('pause', function() {
				bPool.pauseBarrage();
			});

			var bSender = new $.BarrageSender(this, sendUrl, bPool);

			return $;
		}
	});
}));
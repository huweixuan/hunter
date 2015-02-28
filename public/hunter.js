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

		var _opt = this.option = $.extend({}, defaultOption, option);
		var _pool = this.pool = pool;

		this.$el = $('<li></li>').text(_opt.text).css({
			'color': _opt.color,
			'fontSize': _opt.fontSize,
			'position': 'absolute',
			'whiteSpace': 'nowrap',
			'top': '10px',
			'left': _pool.width()
		}).hide().appendTo(_pool.$el);

		return this;
	}

	$.Barrage.prototype.play = function(currentTime) {
		//todo 增加animate&speed&position
		var self = this;
		var interval = self.option.time - currentTime;
		var el = self.$el;
		if (interval < 0) {
			return
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

	$.BarragePool = function(video, barrageData) {
		var self = this;
		self.barrages = [];
		self.video = video;
		var offset = video.offset();
		self.$el = $('<ul></ul>').css({
			'position': 'absolute',
			'overflow': 'hidden',
			'top': offset.top,
			'left': offset.left,
			'width': video.width(),
			'height': video.height() - 50
		});

		self.createPoolEl(video);
		if (!isArray(barrageData)) {
			return;
		}
		$.each(barrageData, function(index, option) {
			self.barrages.push(new $.Barrage(option, self));
		});
		return this;
	}

	$.BarragePool.prototype.width = function() {
		return this.$el.width();
	}

	$.BarragePool.prototype.height = function() {
		return this.$el.height();
	}

	$.BarragePool.prototype.createPoolEl = function(video) {
		video.after(this.$el);
	}

	$.BarragePool.prototype.playBarrage = function() {
		var currentTime = this.video[0].currentTime;
		$.each(this.barrages, function(index, barrage) {
			barrage.play(currentTime);
		});
	}

	$.BarragePool.prototype.pauseBarrage = function() {
		$.each(this.barrages, function(index, barrage) {
			barrage.pause();
		});
	}

	$.fn.extend({
		hunter: function(barrageData) {
			var bPool = new $.BarragePool(this, barrageData);
			this.on('play', function() {
				bPool.playBarrage();
			});
			this.on('pause', function() {
				bPool.pauseBarrage();
			});
			return this;
		}
	});
}));
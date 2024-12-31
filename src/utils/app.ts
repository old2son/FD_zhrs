import { timestamp } from '@/utils/randomRange';
import { storeToRefs } from 'pinia';
import { $store } from '@/stores/$store';


const { state } = storeToRefs($store());

const extend = function (a: { [propName: string]: any }, b: { [propName: string]: any }, deep?: boolean) {
	for (let i in b) {
		if (deep && typeof b[i] === 'object' && b[i] !== null) {
			a[i] = a[i] || {};
			extend(a[i], b[i], true);
		} else {
			if (b.hasOwnProperty(i)) {
				a[i] = b[i];
			}
		}
	}
	return a;
};

function md5(sourceString: string) {
	/*
	 * JavaScript MD5
	 * https://github.com/blueimp/JavaScript-MD5
	 *
	 * Copyright 2011, Sebastian Tschan
	 * https://blueimp.net
	 *
	 * Licensed under the MIT license:
	 * https://opensource.org/licenses/MIT
	 */
	function safeAdd(x: any, y: any) {
		var lsw = (x & 0xffff) + (y & 0xffff);
		var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
		return (msw << 16) | (lsw & 0xffff);
	}

	function bitRotateLeft(num: any, cnt: any) {
		return (num << cnt) | (num >>> (32 - cnt));
	}

	function md5cmn(q: any, a: any, b: any, x: any, s: any, t: any) {
		return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
	}

	function md5ff(a: any, b: any, c: any, d: any, x: any, s: any, t: any) {
		return md5cmn((b & c) | (~b & d), a, b, x, s, t);
	}

	function md5gg(a: any, b: any, c: any, d: any, x: any, s: any, t: any) {
		return md5cmn((b & d) | (c & ~d), a, b, x, s, t);
	}

	function md5hh(a: any, b: any, c: any, d: any, x: any, s: any, t: any) {
		return md5cmn(b ^ c ^ d, a, b, x, s, t);
	}

	function md5ii(a: any, b: any, c: any, d: any, x: any, s: any, t: any) {
		return md5cmn(c ^ (b | ~d), a, b, x, s, t);
	}

	function binlMD5(x: any, len: any) {
		/* append padding */
		x[len >> 5] |= 0x80 << len % 32;
		x[(((len + 64) >>> 9) << 4) + 14] = len;

		var i;
		var olda;
		var oldb;
		var oldc;
		var oldd;
		var a = 1732584193;
		var b = -271733879;
		var c = -1732584194;
		var d = 271733878;

		for (i = 0; i < x.length; i += 16) {
			olda = a;
			oldb = b;
			oldc = c;
			oldd = d;

			a = md5ff(a, b, c, d, x[i], 7, -680876936);
			d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
			c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
			b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
			a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
			d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
			c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
			b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
			a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
			d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
			c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
			b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
			a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
			d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
			c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
			b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);

			a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
			d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
			c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
			b = md5gg(b, c, d, a, x[i], 20, -373897302);
			a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
			d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
			c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
			b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
			a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
			d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
			c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
			b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
			a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
			d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
			c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
			b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);

			a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
			d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
			c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
			b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
			a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
			d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
			c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
			b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
			a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
			d = md5hh(d, a, b, c, x[i], 11, -358537222);
			c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
			b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
			a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
			d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
			c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
			b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);

			a = md5ii(a, b, c, d, x[i], 6, -198630844);
			d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
			c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
			b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
			a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
			d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
			c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
			b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
			a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
			d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
			c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
			b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
			a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
			d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
			c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
			b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);

			a = safeAdd(a, olda);
			b = safeAdd(b, oldb);
			c = safeAdd(c, oldc);
			d = safeAdd(d, oldd);
		}
		return [a, b, c, d];
	}

	function binl2rstr(input: any) {
		var i;
		var output = '';
		var length32 = input.length * 32;
		for (i = 0; i < length32; i += 8) {
			output += String.fromCharCode((input[i >> 5] >>> i % 32) & 0xff);
		}
		return output;
	}

	function rstr2binl(input: any) {
		var i;
		var output: any = [];
		output[(input.length >> 2) - 1] = undefined;
		for (i = 0; i < output.length; i += 1) {
			output[i] = 0;
		}
		var length8 = input.length * 8;
		for (i = 0; i < length8; i += 8) {
			output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << i % 32;
		}
		return output;
	}

	function rstrMD5(s: any) {
		return binl2rstr(binlMD5(rstr2binl(s), s.length * 8));
	}

	function rstrHMACMD5(key: any, data: any) {
		var i;
		var bkey = rstr2binl(key);
		var ipad = [];
		var opad = [];
		var hash;
		ipad[15] = opad[15] = undefined;
		if (bkey.length > 16) {
			bkey = binlMD5(bkey, key.length * 8);
		}
		for (i = 0; i < 16; i += 1) {
			ipad[i] = bkey[i] ^ 0x36363636;
			opad[i] = bkey[i] ^ 0x5c5c5c5c;
		}
		hash = binlMD5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
		return binl2rstr(binlMD5(opad.concat(hash), 512 + 128));
	}

	function rstr2hex(input: any) {
		var hexTab = '0123456789abcdef';
		var output = '';
		var x;
		var i;
		for (i = 0; i < input.length; i += 1) {
			x = input.charCodeAt(i);
			output += hexTab.charAt((x >>> 4) & 0x0f) + hexTab.charAt(x & 0x0f);
		}
		return output;
	}

	function str2rstrUTF8(input: any) {
		return unescape(encodeURIComponent(input));
	}

	function rawMD5(s: any) {
		return rstrMD5(str2rstrUTF8(s));
	}

	function hexMD5(s: any) {
		return rstr2hex(rawMD5(s));
	}

	function rawHMACMD5(k: any, d: any) {
		return rstrHMACMD5(str2rstrUTF8(k), str2rstrUTF8(d));
	}

	function hexHMACMD5(k: any, d: any) {
		return rstr2hex(rawHMACMD5(k, d));
	}

	function _md5(string: any, key?: any, raw?: any) {
		if (!key) {
			if (!raw) {
				return hexMD5(string);
			}
			return rawMD5(string);
		}
		if (!raw) {
			return hexHMACMD5(key, string);
		}
		return rawHMACMD5(key, string);
	}

	return _md5(sourceString);
}

function getTk(): Promise<{ key: string; sign: string | number}> {
    return new Promise((resolve, reject) => {
        try {
            const token = state.value.token;
            const date = new Date();
            let sign;

            if (date?.getTime()) {
                sign = date.getTime();
            } 
			else {
                sign = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${(date.getSeconds() + '').length === 1 ? '0' + date.getSeconds() : date.getSeconds()}`;
            }

            const key = Base.md5(token + Base.md5(Base.md5(sign.toString())));
            resolve({ key, sign });
        } 
		catch (error) {
            reject(error);
        }
    });
}

interface UploaderType {
	defaults: any;
	fileEle: any;
	_upload: Function;
}
function Uploader(this: UploaderType, fileEle: any, options: any) {
	var that = this;

	that.defaults = {
		url: '',
		data: {},
		before: function () {
			return true;
		},
		success: function () {},
		error: function () {},
		complete: function () {},
		progress: function () {}
	};

	extend(that.defaults, options || {});
	that.fileEle = fileEle;
	that._upload();
}

Uploader.prototype._upload = function () {
	var that = this;
	var xhr = new XMLHttpRequest();
	var formData = new FormData();

	for (var key in that.defaults.data) {
		formData.append(key, that.defaults.data[key]);
	}

	formData.append(that.fileEle.name || 'file', that.fileEle.files[0]);
	xhr.open('POST', that.defaults.url);

	xhr.onload = function () {
		if (xhr.status === 200) {
			that.defaults.success(JSON.parse(xhr.responseText));
			that.fileEle.value = '';
		} else {
			that.defaults.error(xhr.status);
		}

		that.defaults.complete(xhr.status);
	};

	xhr.upload.onprogress = function (event) {
		if (event.lengthComputable) {
			that.defaults.progress((((event.loaded / event.total) * 100) | 0).toFixed(2));
		}
	};

	xhr.send(formData);
};

function loadImage(url: string, callback: { (): void; (arg0: HTMLImageElement): void }) {
	var img = new Image();
	img.src = url;

	if (img.complete) {
		callback(img);
		return;
	}

	img.onload = function () {
		callback(img);
	};
}

// slider plugin
interface UploaderType {
	defaults: any;
	[propName: string]: any;
}
type directionType = 'horizon' | 'vertical' | 'next' | 'prev';

function Slider(this: UploaderType, elem: HTMLElement, options: any) {
	this.defaults = {
		speed: 0.5, // 动画移动速度
		direction: 'horizon', // 滚动方向 = 'horizon' || 'vertical'
		duration: 3, // 动画时间间隔
		autoRun: false, // 是否自动运行
		showAction: true, // 是否显示上一张下一张
		showNav: false, // 是否显示导航
		showTitle: false, // 是否显示标题
		showNumber: false, // 是否显示数字
		touch: true, // 是否开启手势
		onInited: function () {}, // 初始化完成回调
		onBefore: function () {}, // 动画前回调
		onAfter: function () {} // 动画后回调
	};

	this.defaults = extend(this.defaults, options || {});
	this.$elem = elem;
	this.$box = document.createElement('div');
	this.$items = this.$elem.querySelectorAll('.fd-slider-item');
	this.$title = document.createElement('div');
	this.$number = document.createElement('div');
	this.$curNum = document.createElement('span');
	this.$totalNum = document.createElement('span');
	this.$prev = document.createElement('a');
	this.$next = document.createElement('a');
	this.$nav = null;
	this.width = 0;
	this.height = 0;
	this.center = 0;
	this.count = this.$items.length;
	this.current = 0;
	this.runing = false;
	this.timer = null;
	this.timeId = null;
	this.isFirst = true;
	this.start = { x: 0, y: 0 };
	this.titles = [];

	this.$box.className = 'fd-slider-wrap';

	var fragment = document.createDocumentFragment();

	for (var i = 0, len = this.count; i < len; i++) {
		fragment.appendChild(this.$items[i]);
	}

	this.$box.appendChild(fragment);
	this.$elem.innerHTML = '';
	this.$elem.appendChild(this.$box);

	if (this.count) {
		this._init();
	}
}

Slider.prototype._init = function () {
	var that = this;
	var img = that.$items[0].querySelector('img');

	if (img) {
		loadImage(img.src, function () {
			setTimeout(function () {
				init();
			}, 0);
		});
	} else {
		setTimeout(function () {
			init();
		}, 0);
	}

	function init() {
		that.width = that.$elem.clientWidth;
		that.height = img.clientHeight;
		that.$elem.style.height = that.height + 'px';
		that.$elem.style.overflow = 'hidden';
		that.$box.appendChild(that.$items[0].cloneNode(true));
		that.$box.insertAdjacentElement('afterbegin', that.$items[that.count - 1].cloneNode(true));

		if (that.defaults.direction === 'horizon') {
			that.$box.style.width = that.width * (that.count + 2) + 'px';
			that.$box.style.height = that.height + 'px';
			that.delta = that.width;
		}

		if (that.defaults.direction === 'vertical') {
			that.$box.style.width = that.width + 'px';
			that.$box.style.height = that.height * (that.count + 2) + 'px';
			that.delta = that.height;
		}

		[].forEach.call(that.$box.querySelectorAll('.fd-slider-item'), function (item: HTMLElement) {
			item.style.width = that.width + 'px';
		});

		that._setStyle(-that.delta);

		if (that.defaults.showAction) {
			that.$prev.href = 'javascript:;';
			that.$prev.className = 'fd-slider-action iconfont icon-left prev';
			that.$prev.style.display = 'block';
			that.$next.href.display = 'javascript:;';
			that.$next.className = 'fd-slider-action iconfont icon-right next';
			that.$next.style.display = 'block';
			that.$elem.appendChild(that.$prev);
			that.$elem.appendChild(that.$next);

			that.$prev.addEventListener(
				'click',
				function () {
					that.scrollPrev();
				},
				false
			);

			that.$next.addEventListener(
				'click',
				function () {
					that.scrollNext();
				},
				false
			);
		}

		if (that.defaults.showNav) {
			that._randerNav();
		}

		if (that.defaults.showTitle) {
			that.$title.className = 'fd-slider-title';
			that.$elem.appendChild(that.$title);

			[].forEach.call(that.$items, function (item: HTMLElement, i) {
				var img = item.querySelector('img');

				var title = (img && img.title) || '';
				that.titles.push(title);
			});

			that.$title.innerText = that.titles[0];
		}

		if (that.defaults.showNumber) {
			that.$number.className = 'fd-slider-num';
			that.$number.appendChild(that.$curNum);
			that.$number.appendChild(that.$totalNum);
			that.$elem.appendChild(that.$number);

			that.$curNum.innerText = 1;
			that.$totalNum.innerText = '/' + that.count;
		}

		if (that.defaults.autoRun) {
			that.autoRun();
		}

		if (that.defaults.touch) {
			that.$box.addEventListener(
				'touchstart',
				function (e: { changedTouches: any[]; preventDefault: () => void }) {
					var touch = e.changedTouches[0];

					that.start = { x: touch.clientX, y: touch.clientY };

					if (that.defaults.direction === 'vertical') {
						e.preventDefault();
					}
				},
				false
			);

			that.$box.addEventListener(
				'touchmove',
				function (e: { changedTouches: any[] }) {
					var touch = e.changedTouches[0];
					var end = { x: touch.clientX, y: touch.clientY };
					var dir: 'x' | 'y', ban: 'x' | 'y';

					if (that.defaults.direction === 'horizon') {
						dir = 'x';
						ban = 'y';
					}

					if (that.defaults.direction === 'vertical') {
						dir = 'y';
						ban = 'x';
					}

					if (
						Math.abs(end[ban! as 'x' | 'y'] - that.start[ban! as 'x' | 'y']) >
						Math.abs(end[dir! as 'x' | 'y'] - that.start[dir! as 'x' | 'y'])
					) {
						return;
					}

					if (Math.abs(end[dir! as 'x' | 'y'] - that.start[dir! as 'x' | 'y']) < 30) {
						return;
					}

					if (end[dir! as 'x' | 'y'] - that.start[dir! as 'x' | 'y'] > 0) {
						that.scrollPrev();
					} else {
						that.scrollNext();
					}
				},
				false
			);
		}

		that.defaults.onInited(that);
	}
};

Slider.prototype._randerNav = function () {
	var that = this;
	var buffer = '';

	that.$nav = document.createElement('div');

	[].forEach.call(that.$items, function (item, i) {
		buffer += '<a href="javascript:;"' + (i === 0 ? 'class="on"' : '') + '>' + (i + 1) + '</a>';
	});

	that.$nav.className = 'fd-slider-nav';
	that.$nav.innerHTML = buffer;
	that.$elem.appendChild(that.$nav);

	that.$nav.addEventListener('click', function (e: { target: any }) {
		var target = e.target;

		if (target.nodeName === 'A') {
			if (target.classList.contains('on')) {
				return;
			}
			that.current = parseInt(target.innerText) - 2;
			that.scroll('next');
		}
	});
};

Slider.prototype.scroll = function (direction: directionType) {
	direction = direction || 'next';

	if (direction === 'next') {
		this.scrollNext();
	} else {
		this.scrollPrev();
	}
};

Slider.prototype.autoRun = function () {
	var that = this;

	that.timer = setTimeout(function () {
		that.scroll();
		that.autoRun();
	}, 1000 * that.defaults.duration);
};

Slider.prototype.scrollNext = function () {
	var that = this;
	if (that.runing) {
		return;
	}
	that.current++;
	that._scroll('next');
};

Slider.prototype.scrollPrev = function () {
	var that = this;
	if (that.runing) {
		return;
	}
	that.current--;
	that._scroll('prev');
};

Slider.prototype._stopAndRestart = function () {
	var that = this;

	if (that.defaults.autoRun) {
		clearInterval(that.timer);
		clearTimeout(that.timeId);

		that.timeId = setTimeout(function () {
			that.autoRun();
		}, 1000 * 10);
	}
};

Slider.prototype._useAnimate = function () {
	var that = this;
	that.$box.style.webkitTransition = 'transform ' + that.defaults.speed + 's ease-out';
	that.$box.style.transition = 'transform ' + that.defaults.speed + 's ease-out';
};

Slider.prototype._noAnimate = function () {
	this.$box.style.webkitTransition = 'none';
	this.$box.style.transition = 'none';
};

Slider.prototype._scrollInit = function () {
	var that = this;

	that._useAnimate();
	that._setStyle(-that.delta * (that.current + 1));
};

Slider.prototype._setStyle = function (val: any) {
	var that = this;

	if (that.defaults.direction === 'horizon') {
		that.$box.style.webkitTransform = 'translate3d(' + val + 'px,0,0)';
		that.$box.style.transform = 'translate3d(' + val + 'px,0,0)';
	}

	if (that.defaults.direction === 'vertical') {
		that.$box.style.webkitTransform = 'translate3d(0,' + val + 'px,0)';
		that.$box.style.transform = 'translate3d(0,' + val + 'px,0)';
	}
};

Slider.prototype._scroll = function (direction: directionType) {
	var that = this;

	that.runing = true;
	that.defaults.onBefore(that);
	that._stopAndRestart();
	that._scrollInit();

	setTimeout(function () {
		that.runing = false;

		if (that.current === that.count) {
			that._noAnimate();
			that._setStyle(-that.delta);
			that.current = 0;
		} else if (that.current === -1) {
			that._noAnimate();
			that._setStyle(-that.count * that.delta);
			that.current = that.count - 1;
		}

		that.defaults.onAfter(that);
	}, 1000 * that.defaults.speed);

	var realIndex = that.current;

	if (that.current === that.count) {
		realIndex = 0;
	} else if (that.current === -1) {
		realIndex = that.count - 1;
	}

	if (that.defaults.showNav) {
		var curNav = that.$nav.querySelector('a.on');

		curNav && curNav.classList.remove('on');
		that.$nav.querySelectorAll('a')[realIndex].classList.add('on');
	}

	if (that.defaults.showTitle) {
		that.$title.innerText = that.titles[realIndex];
	}

	if (that.defaults.showNumber) {
		that.$curNum.innerText = realIndex + 1;
	}
};

// 自动补全
interface AutoComplete {
	defaults: any;
	[propName: string]: any;
}

var AutoComplete = (function () {
	function AutoComplete(this: AutoComplete, input: string, box: HTMLElement, options: any) {
		if (!(this instanceof AutoComplete)) {
			return new (AutoComplete as any)(input, box, options);
		}

		this.defaults = {
			maxWidth: '768px',
			width: '100%', // 宽度 string
			offset: [0, 0], // [left, top] int 偏移量
			className: 'auto-cpl-box', // 样式类名
			delay: 300, // 延迟触发的时间间隔
			atleast: 500, // 至少触发一次的时间
			onInput: function () {} // 输入触发回调函数
		};
		this.box = box;
		this.input = input;
		this.defaults = Base.extend(this.defaults, options);
	}

	AutoComplete.prototype._initBox = function () {
		var that = this;
		var pos = Base.getOffset(that.input);
		var width = that.defaults.width === 'auto' ? that.input.offsetWidth - 2 + 'px' : that.defaults.width;
		var height = that.input.offsetHeight;

		that.box.className = that.defaults.className;
		that.box.style.display = 'none';
		that.box.style.position = 'absolute';
		that.box.style.width = width;
		that.box.style.maxWidth = that.defaults.maxWidth;

		that.box.style.top = pos.top + height + parseInt(that.defaults.offset[1]) + 'px';

		if (that.defaults.offset[0] !== null) {
			that.box.style.left = pos.left + parseInt(that.defaults.offset[0]) + 'px';
		} else {
			that.box.style.left = 0;
		}
	};

	AutoComplete.prototype.hide = function () {
		this.box.style.display = 'none';
	};

	AutoComplete.prototype.show = function () {
		this.box.style.display = 'block';
	};

	return AutoComplete;
})();

var tk1 = ['B', 'C', 'D', 'G', 'J', 'J', 'U', 'F'];
var tk2 = ['K', 'O', '9', '8', '7', 'L', 'L', 'F'];
var tk3 = ['S', 'F', 'D', '2', '1', 'V', '7', '4'];
var tk4 = ['S', 'Q', 'Q', 'P', 'N', 'F', 'H', '0'];

var Base = {
	api: {
		tk: tk1.join('') + tk2.join('') + tk3.join('') + tk4.join(''),
		art: {
			domain: import.meta.env.VITE_API_URL
		}
	},

	defaultShareImgUrl: `https://zhrs-health.familydoctor.cn/static/img/logo_zhrs.png?v=${timestamp}`,

	extend: extend,
	Uploader: Uploader,
	AutoComplete: AutoComplete,
	loadImage: loadImage,
	Slider: Slider,
	md5: md5,
	getTk: getTk,

	cookie: {
		get: function (sMainName: string, sSubName: string) {
			var re = new RegExp(
				sSubName ? sMainName + '=(?:.*?&)*?' + sSubName + '=([^&;$]*)' : sMainName + '=([^;$]*)',
				'i'
			);
			return re.test(unescape(document.cookie)) ? RegExp['$1'] : '';
		},
		set: function (
			cookieName: string,
			cookieValue: any,
			minutes: number,
			path: string,
			domain: string,
			secure: any
		) {
			var expires = new Date();
			expires.setTime(expires.getTime() + minutes * 60 * 1000);
			document.cookie =
				escape(cookieName) +
				'=' +
				escape(cookieValue) +
				(expires ? '; expires=' + expires.toUTCString() : '') +
				(path ? '; path=' + path : '/') +
				(domain ? '; domain=' + domain : '') +
				(secure ? '; secure' : '');
		}
	},

	ajax: function (options: { [propName: string]: any }) {
		let defaults: { [propName: string]: any } = {
			xhr: '',
			url: '',
			type: 'GET',
			dataType: 'json',
			responseType: '',
			data: {},
			headers: {},
			config: {},
			withCredentials: false,
			timeout: null,
			noCache: true,
			success: function () {},
			error: function () {},
			complete: function () {}
		};

		let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };

		defaults = Base.extend(defaults, options);
		defaults.type = defaults.type.toUpperCase();

		if (defaults?.config && defaults?.config.headers) {
			defaults.headers = Base.extend(headers, defaults.config.headers);
		} else {
			defaults.headers = Base.extend(headers, defaults.headers);
		}

		let data: any = '';
		let xhr: XMLHttpRequest;
		if (defaults.xhr && defaults.xhr instanceof XMLHttpRequest) {
			xhr = defaults.xhr;
		} else {
			xhr = new XMLHttpRequest();
		}
		let result = null;

		const setHeaders = function () {
			for (let key in defaults.headers) {
				xhr.setRequestHeader(key, defaults.headers[key]);
			}
		};

		if (typeof defaults.data === 'string' || defaults.data instanceof FormData) {
			data = defaults.data;
		} else if (typeof defaults.data === 'object') {
			data = Base.formatParams(defaults.data);
		}

		if (defaults.timeout) {
			let sec = parseInt(defaults.timeout);

			sec = (sec || 60) * 1000;
			xhr.timeout = sec;
		}

		if (defaults.withCredentials) {
			xhr.withCredentials = true;
		}

		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) {
				let status = xhr.status;

				try {
					if (defaults.responseType && defaults.responseType !== 'text') {
						result = xhr.response;
					} else {
						result = defaults.dataType === 'json' ? JSON.parse(xhr.responseText) : xhr.responseText;
					}

					if ((status >= 200 && status < 300) || status === 304) {
						defaults.success(result, status, xhr);
					} else {
						defaults.error(result, status, xhr);
					}
				} catch (error: any) {
					defaults.error(xhr.responseText, status, xhr);
					throw new Error(error);
				} finally {
					defaults.complete(xhr);
				}
			}
		};

		xhr.responseType = defaults.responseType;

		if (defaults.data instanceof FormData) {
			xhr.open('POST', defaults.url, true);
			setHeaders();
			xhr.send(data);
		} else if (defaults.type == 'GET') {
			defaults.url = defaults.url.indexOf('?') !== -1 ? defaults.url + '&' : defaults.url + '?';
			xhr.open('GET', defaults.url + data, true);
			setHeaders();
			xhr.send(null);
		} else if (defaults.type == 'POST') {
			xhr.open('POST', defaults.url, true);
			setHeaders();
			xhr.send(data);
		}

		return xhr;
	},

	formatParams: function (data: any, noCache?: boolean) {
		var arr = [];

		if (noCache === void 0) {
			noCache = false;
		}

		for (var name in data) {
			arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
		}

		// 不用生成
		// noCache && arr.push("_random_=" + new Date().getTime());

		return arr.join('&');
	},

	getQueryString: function (url: string, name: string) {
		var reg = new RegExp('(^|\\?|&)' + name + '=([^&]*)(\\s|&|$)', 'i');

		if (reg.test(url)) {
			return decodeURIComponent(RegExp.$2.replace(/\+/g, ' '));
		}

		return '';
	},

	throttle: function (func: Function, wait: number, options?: any) {
		var timeout: null | undefined | number, context: null, args: IArguments | null, result: any;
		var previous = 0;

		wait = wait || 300;
		options = options || {};

		var later = function () {
			previous = options.leading === false ? 0 : new Date().getTime();
			timeout = null;
			result = func.apply(context, args);
			if (!timeout) {
				context = args = null;
			}
		};

		var throttled: any = function (this: any) {
			var now = new Date().getTime();
			if (!previous && options.leading === false) {
				previous = now;
			}

			var remaining = wait - (now - previous);
			context = this;
			args = arguments;

			if (remaining <= 0 || remaining > wait) {
				if (timeout) {
					clearTimeout(timeout);
					timeout = null;
				}
				previous = now;
				result = func.apply(context, args);
				if (!timeout) {
					context = args = null;
				}
			} else if (!timeout && options.trailing !== false) {
				timeout = setTimeout(later, remaining) as unknown as number;
			}
			return result;
		};

		throttled.cancel = function () {
			if (!timeout) {
				return;
			}
			clearTimeout(timeout);
			previous = 0;
			timeout = context = args = null;
		};

		return throttled;
	},

	debounce: function (func: Function, wait: number, immediate: boolean) {
		var timeout: null | undefined | number,
			context: null,
			args: IArguments | null,
			timestamp: number,
			result: any;

		var later = function () {
			var last = new Date().getTime() - timestamp;

			if (last < wait && last >= 0) {
				timeout = setTimeout(later, wait - last) as unknown as number;
			} else {
				timeout = null;
				if (!immediate) {
					result = func.apply(context, args);
					if (!timeout) {
						context = args = null;
					}
				}
			}
		};

		return function (this: any) {
			context = this;
			args = arguments;
			timestamp = +new Date();
			var callNow = immediate && !timeout;

			if (!timeout) {
				timeout = setTimeout(later, wait) as unknown as number;
			}

			if (callNow) {
				result = func.apply(context, args);
				context = args = null;
			}

			return result;
		};
	},

	whenScrollBottom: function (offset?: number | Function, callback?: Function, onNotButtom?: Function) {
		offset = offset || 50;

		if (typeof offset === 'function') {
			callback = offset;
			offset = 50;
		}

		if (typeof callback !== 'function') {
			callback = function () {};
		}

		if (typeof onNotButtom !== 'function') {
			onNotButtom = function () {};
		}

		var lastScrollTop = 0;

		var fn = Base.throttle(function () {
			var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
			var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;

			lastScrollTop = scrollTop;

			if (scrollTop + window.innerHeight >= scrollHeight - (offset as number)) {
				if (scrollTop === 0 && lastScrollTop === 0) {
					return;
				} else if (scrollTop >= lastScrollTop) {
					callback && callback();
				}

				window.removeEventListener('scroll', fn);

				setTimeout(function () {
					window.addEventListener('scroll', fn);
				}, 300);
			} else {
				onNotButtom && onNotButtom();
			}
		}, 300);

		window.addEventListener('scroll', fn);

		var off = function () {
			window.removeEventListener('scroll', fn);
		};

		return { off: off };
	},

	padTime: function (str: any) {
		str = '0' + str;
		return str.slice(-2);
	},

	AudioPlay: function (options: { [propName: string]: any }) {
		var defaults = {
			url: '',
			onPlay: function () {},
			onPlaying: function () {},
			onPause: function () {},
			onEnded: function () {},
			onLoad: function () {}
		};

		extend(defaults, options);

		var audio = document.createElement('audio');

		audio.style.display = 'none';
		audio.preload = 'auto';
		audio.controls = true;
		audio.onplay = defaults.onPlay;
		audio.onplaying = defaults.onPlaying;
		audio.onpause = defaults.onPause;
		audio.onended = defaults.onEnded;
		audio.src = defaults.url;
		document.body.appendChild(audio);

		audio.addEventListener('loadeddata', defaults.onLoad);
		audio.load();

		return {
			play: function () {
				audio.play();
			},
			pause: function () {
				audio.pause();
			}
		};
	},

	isWeiXin: function () {
		var ua = navigator.userAgent.toLowerCase();

		return ua.indexOf('micromessenger') !== -1;
	},

	formatTime: function (str: string | number, showTime?: number, separtor?: string) {
		var t = null;
		var s = '';

		separtor = separtor || '-';

		try {
			t = new Date(str);

			s = t.getFullYear() + separtor + this.padTime(t.getMonth() + 1) + separtor + this.padTime(t.getDate());

			if (showTime) {
				s +=
					' ' +
					this.padTime(t.getHours()) +
					':' +
					this.padTime(t.getMinutes()) +
					':' +
					this.padTime(t.getSeconds());
			}

			return s;
		} catch (e) {
			return '';
		}
	},

	scrollToBottom: function () {
		setTimeout(function () {
			window.scrollTo(0, document.body.scrollHeight);
		}, 500);
	},

	scrollToTop: function () {
		setTimeout(function () {
			window.scrollTo(0, 0);
		}, 500);
	},

	scrollTo: function (eleId: string, offset: number) {
		var ele = document.querySelector(eleId);

		offset = offset || 0;

		if (!ele) {
			return;
		}

		var rect = ele.getBoundingClientRect();

		setTimeout(function () {
			window.scrollTo(0, rect.top + offset);
		}, 500);
	},

	vectorTable: [
		{
			value: 2,
			text: '2级量表'
		},
		{
			value: 3,
			text: '3级量表'
		},
		{
			value: 4,
			text: '4级量表'
		},
		{
			value: 5,
			text: '5级量表'
		},
		{
			value: 6,
			text: '6级量表'
		},
		{
			value: 7,
			text: '7级量表'
		},
		{
			value: 8,
			text: '8级量表'
		},
		{
			value: 9,
			text: '9级量表'
		},
		{
			value: 10,
			text: '10级量表'
		}
	],

	styles: [
		{
			value: 1,
			text: '分值'
		},
		{
			value: 2,
			text: '星形'
		},
		{
			value: 3,
			text: '心形'
		}
	],

	propTypes: [
		{
			text: '无',
			value: 1,
			reg: ''
		},
		{
			text: '整数',
			tips: '请输入整数',
			value: 2,
			reg: /^\d+$/
		},
		{
			text: '小数',
			tips: '请输入小数',
			value: 3,
			reg: /^(-?\d+)(\.\d+)?$/
		},
		{
			text: '日期',
			tips: '请输入正确的日期，如： 2018-10-10',
			value: 4,
			reg: /^\d{4}-\d{1,2}-\d{1,2}/
		},
		{
			text: '手机',
			tips: '请输入正确的手机号码',
			value: 5,
			reg: /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
		},
		{
			text: '固话',
			tips: '请输入正确的固话号码，如： 020-87654321',
			value: 6,
			reg: /\d{3}-\d{8}|\d{4}-\d{7}/
		},
		{
			text: '手机或固话',
			tips: '请输入正确的手机或固话号码，如：13800138000 或 020-87654321',
			value: 7,
			reg: '(^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])[0-9]{8}$)|([0-9]{3}-[0-9]{8}|[0-9]{4}-[0-9]{7})'
		},
		{
			text: '省份城市',
			tips: '请输入正确的省份城市',
			value: 8,
			reg: /\/(\S+)/
		},
		{
			text: '省市区',
			tips: '请输入正确的省市区',
			value: 9,
			reg: /\/(\S+)\/(\S+)/
		},
		{
			text: '身份证号',
			tips: '请输入正确的身份证号， 15位或18位',
			value: 10,
			reg: /(^\d{15}$)|(^\d{17}([0-9]|X)$)/
		},
		{
			text: '汉字',
			tips: '只可以输入汉字',
			value: 11,
			reg: /^[\u4e00-\u9fa5]{0,}$/
		},
		{
			text: '中文姓名',
			tips: '请输入中文姓名，2到4个汉字',
			value: 12,
			reg: '^[\u4e00-\u9fa5]{2,4}$'
		},
		{
			text: '英文',
			tips: '请输入英文字母',
			value: 13,
			reg: /^[A-Za-z]+$/
		}
	],

	cloneObject: function (obj: any) {
		return JSON.parse(JSON.stringify(obj));
	},

	toast: function (options: any) {
		var box = document.createElement('div');
		var callback = options.callback || function () {};
		var sec = options.sec ? parseInt(options.sec) : 3;
		var p = document.createElement('p');
		var close = function () {
			try {
				document.body.removeChild(box);
			} catch (e) {}
		};

		box.className = options.className || 'toast-msg';

		if (options.type && options.type !== 'loading') {
			var icon = document.createElement('span');

			icon.className = 'icon-' + options.type;
			box.appendChild(icon);
		}

		p.appendChild(document.createTextNode(options.msg || ''));
		box.appendChild(p);
		document.body.appendChild(box);

		if (sec >= 0) {
			setTimeout(function () {
				close();
				callback();
			}, sec * 1000);
		}

		if (options.type !== 'loading') {
			setTimeout(function () {
				box.style.transform = 'translate(-50%, -50%)';
				box.style.webkitTransform = 'translate(-50%, -50%)';
			}, 0);
		}

		return {
			box: box,
			close: close
		};
	},

	loading: function () {
		return Base.toast({
			sec: -1,
			className: 'icon-loading',
			type: 'loading'
		});
	},

	success: function (options: any) {
		extend(options, {
			msg: options.msg,
			type: 'success',
			sec: options.sec
		});

		return Base.toast(options);
	},

	wrong: function (options: any) {
		extend(options, {
			msg: options.msg,
			type: 'wrong',
			sec: options.sec
		});

		return Base.toast(options);
	},

	getOffset: function (elem: HTMLElement) {
		var rect = elem.getBoundingClientRect(); // 这种支持fixed的元素

		return {
			left: rect.left + (document.body.scrollLeft || document.documentElement.scrollLeft),
			top: rect.top + (document.body.scrollTop || document.documentElement.scrollTop)
		};
	},

	// 初始化微信分享
	initShare: function (options: any) {
        if (!Base.isWeiXin()) {
            return;
        }

        let $desc = document.querySelector('meta[name=description]');
        let $link = document.querySelector('meta[name=wechatShareLink]');
        let $imgUrl = document.querySelector('meta[name=wechatShareImgUrl]');

        let defaults = {
            title: document.title,
            link: ($link && $link.getAttribute('content')) || location.href,
            imgUrl: ($imgUrl && $imgUrl.getAttribute('content')) || Base.defaultShareImgUrl,
            desc: ($desc && $desc.getAttribute('content')) || document.title || '',
            success: function () {},
            cancel: function () {}
        };

        Base.extend(defaults, options);

        let getWechatConfig = function () {
            Base.ajax({
                url: '',
                type: 'POST',
                dataType: 'json',
                data: {'appid': ''}, // 服务号千家万户生活网
                headers:{'wx-client-href':location.href.split('#')[0]},
                success: function (res: any) {
                    if (res) {
                        try {
                            if (typeof res !== 'object') {
                                res = JSON.parse(res);
                            }

                            res.data.appId && setConfig(res);
                        } catch (e) {
                            console.error(e);
                        }
                    } else {
                        console.error('server error ' + res);
                    }
                }
            });
        };

        let setConfig = function (res: any) {
            wx.config({
                debug: false,
                appId: res.data.appId,
                timestamp: res.data.timestamp,
                nonceStr: res.data.nonceStr,
                signature: res.data.signature,
                jsApiList: [
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo',
                    'onMenuShareQZone',
                    'hideMenuItems',
                    'updateAppMessageShareData',
                    'updateTimelineShareData'
                ]
            });
        };

        let ready = function () {
            wx.ready(function () {
                if (wx.updateAppMessageShareData) {
                    wx.updateAppMessageShareData(defaults);
                    wx.updateTimelineShareData(defaults);
                } 
				else {
                    wx.onMenuShareTimeline(defaults);
                    wx.onMenuShareAppMessage(defaults);
                    wx.onMenuShareQQ(defaults);
                    wx.onMenuShareWeibo(defaults);
                    wx.onMenuShareQZone(defaults);
                }
            });
        };

        let init = function () {
            getWechatConfig();
            ready();
			// @ts-ignore
            window.isWechatShareInit = true;
        };

		// @ts-ignore
        if (window.wx) {
            init();
        }
    },

	getShareLink: function (routePath: string) {
		// var link = window.location.href.split('?')[0];
		var link = window.location.href;

		// 资讯文章页转发不判断用户 id
		if (/Article\/\d+/i.test(routePath)) {
			link = link.split('#')[0] + '?thirdPartyid=1';
		}

		return decodeURIComponent(link.split('#')[0] + '#' + routePath);
	},

	removeHtmlTag: function (str: string) {
		if (!str) {
			return '';
		}

		return str.replace(/<[^>]+>/g, '');
	},

	track: function (type: any, data: any) {
		console.log('track', type, JSON.stringify(data));
		// @ts-ignore
		if (window.collector) {
			// @ts-ignore
			window.collector.track(type, data);
		}
	},

	loadCss: function (src: string, callback: () => any) {
		var style = document.createElement('link');

		style.rel = 'stylesheet';
		style.onload = function () {
			typeof callback === 'function' && callback();
		};
		style.href = src;
		document.body.appendChild(style);
	},

	// 滚动屏幕的元素位置
	scrollToElement(ele: string | HTMLElement) {
		ele = typeof ele === 'object' ? ele : (document.getElementById(ele) as HTMLElement);

		var duration = 100;
		var startingY = window.pageYOffset;
		var elementY = window.pageYOffset + (ele ? ele.getBoundingClientRect().top : 0);
		var targetY =
			document.body.scrollHeight - elementY < window.innerHeight
				? document.body.scrollHeight - window.innerHeight
				: elementY;
		var diff = targetY - startingY;
		var start: number;
		var easing = function (t: number) {
			return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
		};

		if (!diff) {
			return;
		}

		window.requestAnimationFrame(function step(timestamp) {
			if (!start) {
				start = timestamp;
			}

			var time = timestamp - start;
			var percent = Math.min(time / duration, 1);
			percent = easing(percent);

			window.scrollTo(0, startingY + diff * percent);

			if (time < duration) {
				window.requestAnimationFrame(step);
			}
		});
	},

	// 检测元素是否在窗口内
	elementInViewport(el: HTMLElement) {
		var top = el.offsetTop;
		var left = el.offsetLeft;
		var width = el.offsetWidth;
		var height = el.offsetHeight;

		while (el.offsetParent) {
			el = el.offsetParent as HTMLElement;
			top += el.offsetTop;
			left += el.offsetLeft;
		}

		return (
			top >= window.scrollY &&
			left >= window.scrollY &&
			top + height <= window.scrollY + window.innerHeight &&
			left + width <= window.scrollY + window.innerWidth
		);
	}
};

export default Base;

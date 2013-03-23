/*

1. 是否支持 navigator.geolocation API
Loc.support 
return bool

2. 获取经纬度
Loc.get()
return {

	// 纬
	lat: pos.coords.latitude,

	// 经
	lng: pos.coords.longitude,

	// 精度
	acc: pos.coords.accuracy
}

3. 监控位置
var locWatcher = Loc.watch(success, error, opts)
opts = {
	// 高精度
	enableHighAccuracy: opts.hi || true,

	// 更新频率
	maximumAge: opts.freq || 3000,

	// 超时时间
	timeout: opts.timeout || 60000
}

4. 取消监控
Loc.clear(locWatcher)
 */
window.Loc = function(geo) {
	return {
		support: !!geo,

		/*
		出错情况返回 String
		TIMEOUT:表示获取信息超时。
		PERMISSION_DENIED：表示用户选择了拒绝了位置服务。
		POSITION_UNAVAILABLE：表示位置不可知。
		 */
		get: function(success, error, opts) {
			opts = opts || {};
			geo.getCurrentPosition(success, error, {
				enableHighAccuracy: opts.hi || true, 
	    		timeout: opts.timeout || 60000
			})
		},
		watch: function(success, error, opts) {
			opts = opts || {};
			geo.watchPosition(success, error, {
				enableHighAccuracy: opts.hi || true,

				// update Interval
				maximumAge: opts.freq || 1000,
				timeout: opts.timeout || 60000
			})
		},
		clear: function(watcher) {
			watcher && geo.clearWatch(watcher);
			return Loc;
		}
	}
}(navigator.geolocation)
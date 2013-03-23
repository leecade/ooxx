window.gMap = function () {
	return {
		// 定位
		location: function (loc, team, delay) {
			delay = delay ? delay : 2000;

			// rewrite the GeoLocationControl.location function
			loc.location = function (noAutoPan) {
				!this.Of && this.Je ? (!noAutoPan && this.i.Zc(this.Je), this.zq()) : (this.sj && this.Ce("startLocation"), (!noAutoPan && this.$x()));
			}

			var marker = new BMap.Marker(point),        // 创建标注  
				size = new BMap.Size(20, 20),
				icon = team === "red" ? new BMap.Icon("ele-1.jpg", size) : new BMap.Icon("ele-2.jpg", size);

			marker.setIcon(icon);

			setInterval(function () {
				loc.location(true);
				// console.log(loc.getAddressComponent());
			}, delay);
			loc.addEventListener("locationSuccess", function (e) {
				// console.log( e.point.lng + " " + e.point.lat);
				map.addOverlay(marker);                     // 将标注添加到地图中 
				marker.setPosition(e.point);
				marker.addEventListener("click", function (ev) {
					gMap.openPositonWindow(ev.point, "你的位置：");
				});
			});

			return marker;

		},

		// 添加蓝队队员marker
		addBlueMarker: function (point, label) {
			var marker = new BMap.Marker(point),        // 创建标注  
				size = new BMap.Size(20, 20),
				icon = new BMap.Icon("defautlico.png", size);
			if (label) {
				var bLabel = new BMap.Label(label);
				bLabel.setStyle({"border": "1px solid #2763f3"});
				bLabel.setOffset(0, 0);
				marker.setLabel(bLabel);
			}
			marker.setIcon(icon);
			marker.enableDragging();
			map.addOverlay(marker);                     // 将标注添加到地图中 
			marker.addEventListener("click", function (e) {
				gMap.openPositonWindow(e.point);
			});

			return marker;
		},

		// 添加红队队员marker
		addRedMarker: function (point, label) {
			var marker = new BMap.Marker(point),        // 创建标注  
				size = new BMap.Size(20, 20),
				icon = new BMap.Icon("del_ative.png", size);
			if (label) {
				var bLabel = new BMap.Label(label);
				bLabel.setStyle({"border": "1px solid #f00"});
				bLabel.setOffset(0, 0);
				marker.setLabel(bLabel);
			}
			marker.setIcon(icon);
			// marker.enableDragging();
			map.addOverlay(marker);                     // 将标注添加到地图中 
			marker.addEventListener("click", function (e) {
				gMap.openPositonWindow(e.point, "她的位置：");
			});

			return marker;
		},

		// 添加自己的marker
		addSelfMarker: function (point, label) {
			var marker = new BMap.Marker(point),        // 创建标注  
				size = new BMap.Size(20, 20),
				icon = new BMap.Icon("ele-1.jpg", size);
			if (label) {
				var bLabel = new BMap.Label(label);
				bLabel.setStyle({"border": "1px solid #000"});
				bLabel.setOffset(0, 0);
				marker.setLabel(bLabel);
			}
			marker.setIcon(icon);
			// marker.enableDragging();
			map.addOverlay(marker);                     // 将标注添加到地图中 
			marker.addEventListener("click", function (e) {
				gMap.openPositonWindow(e.point, "你的位置：");
			});

			return marker;
		},

		// 打开对应point的位置信息窗口
		openPositonWindow: function (point, title, offset) {
			offset = offset ? offset : new BMap.Size(0, -10);
			var myGeo = new BMap.Geocoder(),
				opts = {
					title: title,
					offset: offset
				},
				pos = point.lng + " " + point.lat,
				infoWindow = new BMap.InfoWindow(pos, opts);  // 创建信息窗口对象

			myGeo.getLocation(point, function (result) {
				if (result) {
					pos = result.address;
					infoWindow.setContent(pos);
				}
			});
			map.openInfoWindow(infoWindow, point);      // 打开信息窗口 
		}
	}
}();
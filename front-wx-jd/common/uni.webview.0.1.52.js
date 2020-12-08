! function(e, n) {
	"object" == typeof exports && "undefined" != typeof module ? module.exports = n() : "function" == typeof define &&
		define.amd ? define(n) : e.uni = n()
}(this, function() {
	"use strict";
	var e = {},
		a = [],
		n = function(e, n) {
			if (0 === a.length) {
				var i = plus.webview.currentWebview();
				if (!i) throw new Error("plus.webview.currentWebview() is undefined");
				var t = i.parent();
				if (!t) throw new Error("plus.webview.currentWebview().parent() is undefined");
				a.push(t.id)
			}
			var r = JSON.stringify({
				options: {
					timestamp: +new Date
				},
				name: e,
				arg: n
			});
			plus.webview.getLaunchWebview().evalJS('UniPlusBridge.subscribeHandler("WEB_INVOKE_APPSERVICE",' + r + "," + JSON.stringify(
				a) + ");")
		};
	e.navigateTo = function() {
		var e = (0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {}).url;
		n("navigateTo", {
			url: encodeURI(e)
		})
	}, e.navigateBack = function() {
		var e = (0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {}).delta;
		n("navigateBack", {
			delta: parseInt(e) || 1
		})
	}, e.switchTab = function() {
		var e = (0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {}).url;
		n("switchTab", {
			url: encodeURI(e)
		})
	}, e.reLaunch = function() {
		var e = (0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {}).url;
		n("reLaunch", {
			url: encodeURI(e)
		})
	}, e.redirectTo = function() {
		var e = (0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {}).url;
		n("redirectTo", {
			url: encodeURI(e)
		})
	}, e.getEnv = function(e) {
		e({
			plus: !0
		})
	}, e.postMessage = function() {
		var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {};
		n("postMessage", e.data || {})
	};
	var i = {};
	"undefined" != typeof wx && wx.miniProgram && (i.navigateTo = wx.miniProgram.navigateTo, i.navigateBack = wx.miniProgram
		.navigateBack, i.switchTab = wx.miniProgram.switchTab, i.reLaunch = wx.miniProgram.reLaunch, i.redirectTo = wx.miniProgram
		.redirectTo, i.postMessage = wx.miniProgram.postMessage, i.getEnv = wx.miniProgram.getEnv);
	var t = /uni-app/i.test(navigator.userAgent),
		r = /micromessenger/i.test(navigator.userAgent),
		o = {},
		d = function() {
			window.UniAppJSBridge = !0, document.dispatchEvent(new CustomEvent("UniAppJSBridgeReady", {
				bubbles: !0,
				cancelable: !0
			}))
		};
	return t && (o = e, window.plus && /complete|loaded|interactive/.test(document.readyState) ? d() : document.addEventListener(
		"plusready", d)), r && (o = i, window.WeixinJSBridge && WeixinJSBridge.invoke ? d() : document.addEventListener(
		"WeixinJSBridgeReady", d)), o
});

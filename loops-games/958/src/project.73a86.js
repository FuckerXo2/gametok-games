window.__require = function e(t, a, i) {
	function n(o, s) {
		if (!a[o]) {
			if (!t[o]) {
				var c = o.split("/");
				if (c = c[c.length - 1], !t[c]) {
					var l = "function" == typeof __require && __require;
					if (!s && l) return l(c, !0);
					if (r) return r(c, !0);
					throw new Error("Cannot find module '" + o + "'")
				}
			}
			var d = a[o] = {
				exports: {}
			};
			t[o][0].call(d.exports,
				function (e) {
					return n(t[o][1][e] || e)
				},
				d, d.exports, e, t, a, i)
		}
		return a[o].exports
	}
	for (var r = "function" == typeof __require && __require,
		o = 0; o < i.length; o++) n(i[o]);
	return n
}({
	AdVideoButton: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "62197n4G/1Kcb64R6SX5CDo", "AdVideoButton"),
			cc.Class({
				extends: cc.Component,
				editor: {
					menu: "Extensions/AdVideoButton"
				},
				properties: {
					coolDown: !1,
					coolDownTag: 0,
					labMessage: cc.Label,
					sprLoading: {
						type: cc.Sprite,
						default:
							null
					},
					target: cc.Node,
					clickEvents: {
						default:
							[],
						type: cc.Component.EventHandler
					}
				},
				start: function () {
					if (Language.getName(this.labMessage.string)) {
						this.originString = Language.getName(this.labMessage.string);
					} else {
						// console.log(this.labMessage.string)
						this.originString = this.labMessage.string;
					}

					var e = new cc.Component.EventHandler;
					e.target = this,
						e.component = "AdVideoButton",
						e.handler = "_onTakeVideo",
						this.clickEvents.push(e),
						this.button = this.addComponent(cc.Button),
						this.button.clickEvents = this.clickEvents,
						this.button.target = this.target,
						this.button.enableAutoGrayEffect = !0,
						this.button.transition = cc.Button.Transition.SCALE,
						this.button.zoomScale = .96,
						this.ad = UserData.GameData.Ad,
						this.ad.coolDowns = this.ad.coolDowns || {},
						this.ad.availableDates = this.ad.availableDates || {},
						this.refresh(),
						this.schedule(this.refresh, .1)
				},
				_onTakeVideo: function () {
					this.coolDown && (this.ad.coolDowns[this.coolDownTag] || (this.ad.coolDowns[this.coolDownTag] = 0), this.ad.coolDowns[this.coolDownTag] += 18e5, this.ad.coolDowns[this.coolDownTag] >= 3e6 && (this.ad.availableDates[this.coolDownTag] = Date.now() + this.ad.coolDowns[this.coolDownTag], this.ad.coolDowns[this.coolDownTag] = 0))
				},
				refresh: function () {
					this.ad.availableDates[this.coolDownTag] || (this.ad.availableDates[this.coolDownTag] = Date.now()),
						this.ad.availableDates[this.coolDownTag] - Date.now() < 0 && (this.ad.availableDates[this.coolDownTag] = Date.now());
					var e = this.ad.availableDates[this.coolDownTag] - Date.now();
					e <= 0 || !this.coolDown ? Ad.isVideoLoading() ? (this.button.interactable = !1, this.labMessage.string = Language.getName("loading..."), this.sprLoading && (this.sprLoading.node.active = !0), this.sprLoading && 0 == this.sprLoading.node.getNumberOfRunningActions() && this.sprLoading.node.runAction(cc.repeatForever(cc.rotateBy(.07, -45)))) : (this.sprLoading && (this.sprLoading.node.active = !1), this.button.interactable = !0, this.labMessage.string = this.originString) : (this.sprLoading && (this.sprLoading.node.active = !1), this.button.interactable = !1, this.labMessage.string = Language.getName("Wait For") + "\r\n" + Tools.timespanFormat(e))
				}
			}),
			cc._RF.pop()
	},
	{}],
	AddCoinAni: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "2ce9esCrUhClZZpVH74AQz6", "AddCoinAni"),
			cc.Class({
				extends: cc.Component,
				properties: {
					prefabCoinAni: cc.Prefab
				},
				start: function () { },
				startWithAction: function (e, t, a, i) {
					for (var n = this,
						r = Math.floor(6 * Math.random()) + 8, o = 0; o < r; o++) for (var s = Math.floor(3 * Math.random()) + 3, c = 0; c < s; c++) this.node.runAction(cc.sequence(cc.delayTime(.1 * o), cc.callFunc(function () {
							var r = cc.instantiate(n.prefabCoinAni);
							r.getComponent("GoldAni").setType(i),
								n.node.addChild(r),
								r.x = 2 * Math.random() * 60 - 60 + e.x,
								r.y = 2 * Math.random() * 70 - 70 + e.y;
							var o = .5 + 2 * Math.random() * .1 - .1,
								s = e.x + 2.5 * (r.x - e.x),
								c = r.y + .25 * Math.abs(t.y - e.y),
								l = r.x > e.x ? e.x + 6 * (r.x - e.x) : 6 * (r.x - e.x) + e.x,
								d = [cc.v2(s, c), cc.v2(l, r.y + (t.y - r.y) / 2), t],
								h = cc.bezierTo(o, d),
								u = cc.moveTo(.15, cc.v2(s, c));
							r.runAction(cc.sequence(u, cc.delayTime(.05), h, cc.scaleTo(.01, 0), cc.callFunc(function () {
								if (r.destroy(), a && 0 == a.getNumberOfRunningActions()) {
									a.runAction(cc.sequence(cc.spawn(cc.scaleTo(.03, 1.1), cc.tintTo(.03, 255, 226, 92)), cc.spawn(cc.scaleTo(.03, 1), cc.tintTo(.03, 255, 255, 255))))
								}
							}))),
								r.scale = 0,
								r.runAction(cc.scaleTo(.075, 1)),
								r.opacity = 0,
								r.runAction(cc.fadeIn(.075))
						})))
				}
			}),
			cc._RF.pop()
	},
	{}],
	AdsManager: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "9803dJROYBPUaVz5ohqGqzi", "AdsManager"),
			Object.defineProperty(a, "__esModule", {
				value: !0
			});
		var i, n, r = cc._decorator,
			o = r.ccclass;
		r.property; (function (e) {
			e[e.none = 0] = "none",
				e[e.loading_normal = 1] = "loading_normal",
				e[e.loading_fail = 2] = "loading_fail",
				e[e.load_comlepte = 3] = "load_comlepte",
				e[e.load_error = 4] = "load_error"
		})(i || (i = {})),
			function (e) {
				e[e.none = 0] = "none",
					e[e.loading = 1] = "loading",
					e[e.load_comlepte = 2] = "load_comlepte",
					e[e.load_error = 3] = "load_error"
			}(n || (n = {}));
		var s = function () {
			function e() { }
			var t;
			return t = e,
				e.getInstance = function () {
					return t
				},
				e.getRewardedPlacementId = function () {
					return t.REWARDED_PLACEMENT_ID_NORMAL
				},
				e.createRewardedAd = function (e) {
					(console.log(t.getRewardedPlacementId()), console.log("\u5f00\u59cb\u521b\u5efa\u5e7f\u544a\u5b9e\u4f8b: " + t.getRewardedPlacementId()), "undefined" != typeof FBInstant) && (console.log("FBInstant..... invalid"), t.loadingRewardedVideoState === i.none && (console.log("FBInstant..... invalid22"), -1 !== FBInstant.getSupportedAPIs().indexOf("getRewardedVideoAsync") ? (console.log("FBInstant..... invalid 3"), FBInstant.getRewardedVideoAsync(t.getRewardedPlacementId()).then(function (a) {
						return t.preloadedRewardedVideo = a,
							t.loadingRewardedVideoState = e,
							console.log("\u51c6\u5907\u8bf7\u6c42\u5956\u52b1\u89c6\u9891.....1"),
							Analysis.sendEvent({
								type: "RewardVideoRequest"
							}),
							t.preloadedRewardedVideo.loadAsync()
					}).then(function () {
						t.loadingRewardedVideoState = i.load_comlepte,
							Analysis.sendEvent({
								type: "RewardVideoLoadSuccess"
							}),
							console.log("\u5956\u52b1\u89c6\u9891\u9884\u52a0\u8f7d\u5b8c\u6210")
					}).
						catch(function (e) {
							t.loadingRewardedVideoState = i.load_error,
								Analysis.sendEvent({
									type: "RewardVideoLoadFailed"
								}),
								console.log("\u5956\u52b1\u89c6\u9891\u9884\u52a0\u8f7d\u5931\u8d25:" + JSON.stringify(e)),
								setTimeout(function () {
									console.log("\u7b2c\u4e00\u6b21\u8bf7\u6c42\u5931\u8d25\uff0c\u91cd\u65b0\u8bf7\u6c42\u5e7f\u544a"),
										t.loadingRewardedVideoState = i.none,
										t.preloadedRewardedVideo = null,
										t.loadRewardedVideo(i.loading_fail)
								},
									5e3)
						})) : console.log("\u6b64\u5e73\u53f0\u6ca1\u6709\u5e7f\u544a\u63a5\u53e3 api\u627e\u4e0d\u5230")))
				},
				e.loadRewardedVideo = function (e) {
					void 0 === e && (e = i.loading_normal),
						console.log("\u5f00\u59cb\u52a0\u8f7d\u5956\u52b1\u89c6\u9891\uff1a " + t.getRewardedPlacementId()),
						"undefined" != typeof FBInstant && t.loadingRewardedVideoState !== i.load_comlepte && t.loadingRewardedVideoState !== i.loading_normal && t.loadingRewardedVideoState !== i.loading_fail && (t.preloadedRewardedVideo ? (console.log("\u51c6\u5907\u52a0\u8f7d\u5956\u52b1\u89c6\u9891.."), t.loadingRewardedVideoState = e, Analysis.sendEvent({
							type: "RewardVideoRequest"
						}), t.preloadedRewardedVideo.loadAsync().then(function () {
							console.log("\u5956\u52b1\u89c6\u9891\u52a0\u8f7d\u5b8c\u6210.."),
								Analysis.sendEvent({
									type: "RewardVideoLoadSuccess"
								}),
								t.loadingRewardedVideoState = i.load_comlepte
						}).
							catch(function (e) {
								t.loadingRewardedVideoState = i.load_error,
									Analysis.sendEvent({
										type: "RewardVideoLoadFailed"
									}),
									console.log("\u5956\u52b1\u89c6\u9891\u52a0\u8f7d\u5931\u8d25:" + e.message),
									setTimeout(function () {
										console.log("\u8bf7\u6c42\u5931\u8d25\uff0c\u91cd\u65b0\u8bf7\u6c42\u5e7f\u544a:" + Math.floor((new Date).getTime() / 1e3)),
											t.loadingRewardedVideoState = i.none,
											t.preloadedRewardedVideo = null,
											t.loadRewardedVideo(i.loading_fail)
									},
										5e3)
							})) : t.createRewardedAd(e))
				},
				e.showRewardedVideo = function (e, a) {
					console.log("\u5f00\u59cb\u663e\u793a\u5956\u52b1\u89c6\u9891 " + t.getRewardedPlacementId()),
						"undefined" != typeof FBInstant ? t.preloadedRewardedVideo.showAsync().then(function () {
							console.log("\u5956\u52b1\u89c6\u9891\u6210\u529f\u64ad\u653e."),
								e && e(),
								window.LastShowAdsTime = cc.sys.now() / 1e3,
								t.loadingRewardedVideoState = i.none,
								t.preloadedRewardedVideo = null,
								t.loadRewardedVideo(i.loading_normal)
						}).
							catch(function (e) {
								console.log("\u663e\u793a\u5956\u52b1\u89c6\u9891\u5931\u8d25 : " + e.message),
									a && a(),
									t.loadingRewardedVideoState = i.none,
									t.preloadedRewardedVideo = null,
									t.loadRewardedVideo(i.loading_normal)
							}) : a && a()
				},
				e.isCompleteVideoLoad = function () {
					return t.loadingRewardedVideoState === i.load_comlepte
				},
				e.isRewardVideoLoadingState = function () {
					return t.loadingRewardedVideoState === i.loading_normal
				},
				e.getInterstitialPlacementId = function () {
					return t.INTERSTITIAL_PLACEMENT_ID_NORMAL
				},
				e.createInterstitialAd = function () {
					(console.log("start createInterstitialAd: " + t.getInterstitialPlacementId()), "undefined" != typeof FBInstant) && (t.loadingInterstitialState === n.none && (- 1 !== FBInstant.getSupportedAPIs().indexOf("getInterstitialAdAsync") ? FBInstant.getInterstitialAdAsync(t.getInterstitialPlacementId()).then(function (e) {
						return t.preloadedInterstitial = e,
							t.loadingInterstitialState = n.loading,
							t.preloadedInterstitial.loadAsync()
					}).then(function () {
						t.loadingInterstitialState = n.load_comlepte,
							console.log("interstitial preloaded.")
					}).
						catch(function (e) {
							t.loadingInterstitialState = n.load_error,
								console.log("interstitial failed to preload:" + JSON.stringify(e))
						}) : console.log("Ads not supported in this session")))
				},
				e.loadInterstitial = function () {
					console.log("start loadInterstitial: " + t.getInterstitialPlacementId()),
						"undefined" != typeof FBInstant && t.loadingInterstitialState !== n.load_comlepte && t.loadingInterstitialState !== n.loading && (t.preloadedInterstitial ? (console.log("preloadedInterstitial start loadAsync."), t.loadingInterstitialState = n.loading, t.preloadedInterstitial.loadAsync().then(function () {
							console.log("loadInterstitial preloaded."),
								t.loadingInterstitialState = n.load_comlepte
						}).
							catch(function (e) {
								t.loadingInterstitialState = n.load_error,
									console.log("loadInterstitial failed to preload:" + e.message)
							})) : t.createInterstitialAd())
				},
				e.showInterstitial = function (e, a) {
					if (console.log("start showInterstitial: " + t.getInterstitialPlacementId()), "undefined" != typeof FBInstant) return t.loadingInterstitialState !== n.load_comlepte ? (console.log("showInterstitial: not load.. try loading ... "), a && a(), void t.loadInterstitial()) : window.LastShowAdsTime && cc.sys.now() / 1e3 - window.LastShowAdsTime <= window.AdsCDTime ? (console.log("showInterstitial: too often ... " + (cc.sys.now() / 1e3 - window.LastShowAdsTime)), void (a && a())) : void t.preloadedInterstitial.showAsync().then(function () {
						console.log("showInterstitial ok."),
							window.LastShowAdsTime = cc.sys.now() / 1e3,
							e && e(),
							t.loadingInterstitialState = n.none,
							t.preloadedInterstitial = null,
							t.loadInterstitial()
					}).
						catch(function (e) {
							console.log("showInterstitial error : " + e.message),
								a && a(),
								t.loadInterstitial()
						});
					a && a()
				},
				e.isCompleteInterstitialLoad = function () {
					var e = t.loadingInterstitialState === n.load_comlepte;
					return e || t.loadInterstitial(),
						e
				},
				e.REWARDED_PLACEMENT_ID_TEST = "2277803722266283_2279443202102335",
				e.REWARDED_PLACEMENT_ID_NORMAL = "2277803722266283_2279443202102335",
				e.preloadedRewardedVideo = null,
				e.loadingRewardedVideoState = i.none,
				e.INTERSTITIAL_PLACEMENT_ID_TEST = "1354179448058164_1354181561391286",
				e.INTERSTITIAL_PLACEMENT_ID_NORMAL = "2495281107213625_2503658159709253",
				e.preloadedInterstitial = null,
				e.loadingInterstitialState = n.none,
				e = t = __decorate([o], e)
		}();
		a.
			default = s,
			cc._RF.pop()
	},
	{}],
	AdsforceAndroid: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "99f1baCCzpHlq6JQLiM4Hlr", "AdsforceAndroid");
		var i = "org.cocos2dx.javascript.AppActivity",
			n = n || {
				devKey: "a23bl2383pi63gpjv6hj82",
				publicKey: "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBALLXP9/E3OYGL1HNbMQllsrzBWvm/WsAR49KSIBpnjtxok9bIIAZ7rUQaqbr2IkEZ9U9IMs0GEJtMnMuzy9Kd7MCAwEAAQ==",
				trackHost: "https://adv-track.adsforce.io",
				channelId: "32400",
				initSdk: function () {
					jsb.reflection.callStaticMethod(i, "initAdsforce", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", this.devKey, this.publicKey, this.trackHost, this.channelId)
				},
				logEventWithValue: function (e, t) {
					jsb.reflection.callStaticMethod(i, "adsforceLogEventWithValue", "(Ljava/lang/String;Ljava/lang/String;)V", e, t)
				},
				logEventWithMap: function (e, t) {
					jsb.reflection.callStaticMethod(i, "adsforceLogEventWithMap", "(Ljava/lang/String;Ljava/lang/String;)V", e, JSON.stringify(t))
				},
				logEventWithList: function (e, t) {
					jsb.reflection.callStaticMethod(i, "adsforceLogEventWithMap", "(Ljava/lang/String;Ljava/lang/String;)V", e, JSON.stringify(t))
				}
			};
		t.exports = n,
			cc._RF.pop()
	},
	{}],
	AdsforceIos: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "a6f77GixQtJuINeA/qa3tmh", "AdsforceIos");
		var i = i || {};
		t.exports = i,
			cc._RF.pop()
	},
	{}],
	Adsforce: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "aeb27iBZn1HLZjeN++/Nuhj", "Adsforce");
		var i = e("AdsforceAndroid"),
			n = (e("AdsforceIos"), n || {
				initSdk: function () {
					cc.sys.os === cc.sys.OS_IOS || cc.sys.os === cc.sys.OS_ANDROID && i.initSdk()
				},
				logEventWithValue: function (e, t) {
					cc.sys.os === cc.sys.OS_IOS || cc.sys.os === cc.sys.OS_ANDROID && i.logEventWithValue(e, t)
				},
				logEventWithMap: function (e, t) {
					cc.sys.os === cc.sys.OS_IOS || cc.sys.os === cc.sys.OS_ANDROID && i.logEventWithMap(e, t)
				},
				logEventWithList: function (e, t) {
					cc.sys.os === cc.sys.OS_IOS || cc.sys.os === cc.sys.OS_ANDROID && i.logEventWithList(e, t)
				}
			});
		t.exports = n,
			cc._RF.pop()
	},
	{
		AdsforceAndroid: "AdsforceAndroid",
		AdsforceIos: "AdsforceIos"
	}],
	Ad: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "309a4W4CKhLgIsxgW/E6+Y3", "Ad"),
			cc.Class({
				impl: null,
				init: function () {
					var t = this;["showBanner", "closeBanner", "hideBanner", "updateBannerStyle", "isVideoComplete", "isVideoLoading", "cashInterstitialAd", "showInterstitialAd"].forEach(function (e) {
						t[e] = function (t) {
							if (t || (t = {}), null != this.impl && "function" == typeof this.impl[e]) return this.impl[e](t);
							cc.warn("[Ad]\u65b9\u6cd5" + e + "\u672a\u5b9e\u73b0"),
								"function" == typeof t.fail && t.fail()
						}
					});
					var a = Framework.moduleCode + "Ad",
						i = void 0;
					try {
						i = e(a)
					} catch (e) { }
					null != i ? (this.impl = new i, "function" == typeof this.impl.init && this.impl.init(), console.log("[Ad]\u5df2\u542f\u7528 " + a)) : cc.warn("[Ad]" + a + " \u4e0d\u5b58\u5728,\u5e7f\u544aAPI\u4e0d\u53ef\u7528.")
				},
				showVideo: function (e) {
					console.log("播放视频");
					e && e.success(true)
				}
			}),
			cc._RF.pop()
	},
	{}],
	Analysis: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "accf4v58ZpM0qqD7YGxyV9H", "Analysis"),
			cc.Class({
				impl: null,
				init: function () {
					var t = this;["sendEvent"].forEach(function (e) {
						t[e] = function (t) {
							if (t || (t = {}), null != this.impl && "function" == typeof this.impl[e]) return this.impl[e](t);
							cc.warn("[Analysis]\u65b9\u6cd5" + e + "\u672a\u5b9e\u73b0"),
								"function" == typeof t.fail && t.fail()
						}
					});
					var a = Framework.moduleCode + "Analysis",
						i = void 0;
					try {
						i = e(a)
					} catch (e) { }
					null != i ? (this.impl = new i, "function" == typeof this.impl.init && this.impl.init(), console.log("[Analysis]\u5df2\u542f\u7528 " + a)) : cc.warn("[Analysis]" + a + " \u4e0d\u5b58\u5728,\u6570\u636e\u57cb\u70b9\u4e0d\u53ef\u7528.")
				}
			}),
			cc._RF.pop()
	},
	{}],
	AndroidAd: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "07a89jD8mFOuI/X9KxwFUHR", "AndroidAd"),
			cc.Class({
				extends: e("UPLTVAd")
			}),
			cc._RF.pop()
	},
	{
		UPLTVAd: "UPLTVAd"
	}],
	AndroidAnalysis: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "a66daUJfv5ICLQ78ODo4JS5", "AndroidAnalysis");
		var i = e("Adsforce"),
			n = e("FBAnalysis");
		cc.Class({
			extends: e("BaseAnalysis"),
			properties: {},
			init: function () {
				console.log("Android Analytics init()"),
					this.initPluginFirebase(),
					this.initAdsforce(),
					this.initFacebookAnalysis()
			},
			sendEvent: function (e) {
				e.type ? (console.log("fb log event :" + e.type), this.logEvent(e.type, e.num || 1, e.data || {})) : console.log("fb log event fail : no type prama")
			},
			logEvent: function (e, t, a) {
				sdkbox.firebase.Analytics.logEvent(e, a),
					i.logEventWithMap(e, a),
					n.logEvent(e, t, a)
			},
			initPluginFirebase: function () {
				void 0 !== sdkbox.firebase ? sdkbox.firebase.Analytics.init() : console.log("sdkbox.firebase is undefined")
			},
			initAdsforce: function () {
				i.initSdk()
			},
			initFacebookAnalysis: function () {
				n.initSdk()
			}
		}),
			cc._RF.pop()
	},
	{
		Adsforce: "Adsforce",
		BaseAnalysis: "BaseAnalysis",
		FBAnalysis: "FBAnalysis"
	}],
	AndroidDataStore: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "112ccnduO1HuK894ALzaZfd", "AndroidDataStore"),
			e("AndroidPlatform"),
			window._android_global._readSuccessCallbacks = {},
			window._android_global._readFailCallbacks = {},
			window._android_global._saveSuccessCallbacks = {},
			window._android_global._saveFailCallbacks = {},
			cc.Class({
				extends: e("BaseDataStore"),
				init: function () {
					this.successCallbacks = {},
						this.failCallbacks = {},
						console.log("Android Data Store\u521d\u59cb\u5316\u5b8c\u6210,\u57fa\u4e8esdkbox.PluginSdkboxPlay\u5b9e\u73b0.")
				},
				onConnectionStatusChanged: function (e) {
					console.log("############# status", e)
				},
				onLoadGameData: function (e, t) {
					console.log("####### =======PluginSdkboxPlay onLoadGameData #####savedData", JSON.stringify(e)),
						console.log("####### =======PluginSdkboxPlay onLoadGameData #####error", t),
						void 0 != e && (t && "" != t ? "function" == typeof window._android_global._readFailCallbacks[e.name] && (window._android_global._readFailCallbacks[e.name](), window._android_global._readFailCallbacks[e.name] = null) : "function" == typeof window._android_global._readSuccessCallbacks[e.name] && (window._android_global._readSuccessCallbacks[e.name](e.data), window._android_global._readSuccessCallbacks[e.name] = null))
				},
				onSaveGameData: function (e, t) {
					console.log("####### =======PluginSdkboxPlay onSaveGameData #####success", e),
						console.log("####### =======PluginSdkboxPlay onSaveGameData #####error", t)
				},
				readCloud: function (e) {
					window._android_global._initSucceeded && (sdkbox.PluginSdkboxPlay.setListener({
						onLoadGameData: this.onLoadGameData,
						onSaveGameData: this.onSaveGameData
					}), window._android_global._readSuccessCallbacks[e.key] = e.success, window._android_global._readFailCallbacks[e.key] = e.fail, console.log("#### PluginSdkboxPlay ==== \u8bfb\u53d6Cloud", JSON.stringify(e)), sdkbox.PluginSdkboxPlay.loadOneGameData(e.key))
				},
				saveCloud: function (e) {
					window._android_global._initSucceeded && (sdkbox.PluginSdkboxPlay.setListener({
						onLoadGameData: this.onLoadGameData,
						onSaveGameData: this.onSaveGameData
					}), console.log("#### PluginSdkboxPlay ==== \u4fdd\u5b58Cloud", JSON.stringify(e)), sdkbox.PluginSdkboxPlay.saveGameDataBinary(e.key, e.data))
				}
			}),
			cc._RF.pop()
	},
	{
		AndroidPlatform: "AndroidPlatform",
		BaseDataStore: "BaseDataStore"
	}],
	AndroidErrorHandler: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "ffd3dmXo5dDiqBicqUCIZNe", "AndroidErrorHandler"),
			cc.Class({
				extends: e("BaseErrorHandler")
			}),
			cc._RF.pop()
	},
	{
		BaseErrorHandler: "BaseErrorHandler"
	}],
	AndroidPlatform: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "dadd6vFW2ZM1Khbdz9wUZPa", "AndroidPlatform"),
			window._android_global = {},
			cc.Class({
				extends: e("BasePlatform"),
				init: function () {
					window._android_global._initSucceeded = this._isGooglePlayServicesAvailable() && sdkbox.PluginSdkboxPlay.init(),
						console.log("########### PluginSdkboxPlay \u521d\u59cb\u5316\u7ed3\u679c", window._android_global._initSucceeded),
						sdkbox.PluginSdkboxPlay.setListener({
							onConnectionStatusChanged: this.onConnectionStatusChanged
						}),
						console.log("############# sdkbox.PluginSdkboxPlay \u521d\u59cb\u5316\u5b8c\u6210")
				},
				_isGooglePlayServicesAvailable: function () {
					var e = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "isGooglePlayServicesAvailable", "()I");
					return console.log("##### result", e),
						console.log("##### result == 0 || result == 2", 0 == e || 2 == e),
						0 == e || 2 == e
				},
				onConnectionStatusChanged: function (e) {
					console.log("############# status", e),
						console.log("############# isConnected", sdkbox.PluginSdkboxPlay.isConnected()),
						console.log("############# getPlayerId", sdkbox.PluginSdkboxPlay.getPlayerId()),
						"1000" == e ? "function" == typeof window._android_global._loginSuccess && (console.log("############# \u767b\u5f55\u6210\u529f\u56de\u8c03"), window._android_global._loginSuccess(), window._android_global._loginSuccess = null) : "1002" == e && (window._android_global._initSucceeded = !1, "function" == typeof window._android_global._loginFail && (console.log("############# \u767b\u5f55\u5931\u8d25"), window._android_global._loginFail(), window._android_global._loginFail = null))
				},
				getPlayerId: function () {
					return sdkbox.PluginSdkboxPlay.getPlayerId()
				},
				login: function (e) {
					window._android_global._initSucceeded ? (window._android_global._loginSuccess = e.success, window._android_global._loginFail = e.fail, sdkbox.PluginSdkboxPlay.signin()) : e.success()
				},
				shareAppMessage: function (e) {
					console.log("Android shareAppMessage"),
						this.initImage()
				},
				initImage: function () {
					var e = new cc.Node;
					e.parent = cc.director.getScene().getChildByName("Canvas");
					var t = e.addComponent(cc.Camera);
					console.log("Android shareAppMessage2"),
						t.cullingMask = 4294967295;
					var a = new cc.RenderTexture;
					this.texture = a;
					var i = cc.game._renderContext;
					a.initWithSize(cc.visibleRect.width, cc.visibleRect.height, i.STENCIL_INDEX8),
						t.targetTexture = a,
						console.log("Android shareAppMessage3"),
						t.render();
					var n = this.texture.readPixels();
					this._width = this.texture.width,
						this._height = this.texture.height;
					var r = this.filpYImage(n, this._width, this._height);
					console.log("Android shareAppMessage 4");
					var o = jsb.fileUtils.getWritablePath() + "share.jpg";
					jsb.saveImageData(r, this._width, this._height, o) && (console.log("save image data success, file: " + o), jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "share", "(Ljava/lang/String;)V", "share.."))
				},
				filpYImage: function (e, t, a) {
					for (var i = new Uint8Array(t * a * 4), n = 4 * t, r = 0; r < a; r++) for (var o = (a - 1 - r) * t * 4, s = r * t * 4, c = 0; c < n; c++) i[s + c] = e[o + c];
					return i
				}
			}),
			cc._RF.pop()
	},
	{
		BasePlatform: "BasePlatform"
	}],
	BaiduAd: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "f80b9xyjwpMoKeg6+w2+Wku", "BaiduAd"),
			cc.Class({
				extends: e("BaseAd"),
				properties: {
					APP_SID: "ed104d6d",
					BANNER_ID: "6003791"
				},
				init: function () {
					this.VIDEO_IDS = {
						default:
							"6003795",
						healthPoint: "6003792",
						freeAnswer: "6003793",
						shop: "6003794",
						failedDialog: "6003796"
					}
				},
				showBanner: function (e) {
					var t = this;
					switch (this.bottomBannerAd && this.bottomBannerAd.destroy(), this.bottomBannerAd = swan.createBannerAd({
						appSid: this.APP_SID,
						adUnitId: this.BANNER_ID,
						style: {
							left: parseInt(.1 * swan.getSystemInfoSync().windowWidth),
							top: 0,
							width: parseInt(.8 * swan.getSystemInfoSync().windowWidth)
						}
					}), console.log("\u8bbe\u5907\u5c4f\u5e55\u9ad8\u5ea6", swan.getSystemInfoSync().windowHeight), console.log("\u8bbe\u5907\u5c4f\u5e55\u5bbd\u5ea6", swan.getSystemInfoSync().windowWidth), console.log("\u5e7f\u544a\u771f\u5b9e\u9ad8\u5ea6", this.bottomBannerAd.style.realHeight), e.position) {
						case "top":
							this.bottomBannerAd.style.top = 0;
							break;
						case "bottom":
							this.bottomBannerAd.style.top = parseInt(swan.getSystemInfoSync().windowHeight - this.bottomBannerAd.style.realHeight + 1);
							break;
						case "middle":
							this.bottomBannerAd.style.top = parseInt(swan.getSystemInfoSync().windowHeight * e.marginTop)
					}
					if (this.bottomBannerAd) {
						var a = this;
						this.bottomBannerAd.onLoad(function () {
							a.bottomBannerAd.show().then(function () {
								console.log("\u5e95\u90e8banner \u5e7f\u544a\u663e\u793a"),
									e.success && e.success(t.bottomBannerAd.style.realHeight / swan.getSystemInfoSync().windowHeight)
							}).
								catch(function (e) {
									cc.error(e)
								}),
								console.log("\u5e95\u90e8banner \u5e7f\u544a\u52a0\u8f7d\u6210\u529f")
						}),
							this.bottomBannerAd.onError(function (t) {
								cc.error(t),
									console.log("Banner \u9519\u8bef\uff0c\u65e0\u5e7f\u544a\u8fd4\u56de"),
									e.fail && e.fail()
							})
					} else console.log("Banner \u65e0\u5e7f\u544a\u8fd4\u56de"),
						e.fail && e.fail()
				},
				updateBannerStyle: function (e) {
					if (this.bottomBannerAd) switch (e.position) {
						case "top":
							this.bottomBannerAd.style.top = 0;
							break;
						case "bottom":
							this.bottomBannerAd.style.top = parseInt(swan.getSystemInfoSync().windowHeight - this.bottomBannerAd.style.realHeight + 1);
							break;
						case "middle":
							this.bottomBannerAd.style.top = parseInt(swan.getSystemInfoSync().windowHeight * e.marginTop)
					}
				},
				bannerShow: function () {
					this.bottomBannerAd && this.bottomBannerAd.show()
				},
				bannerHide: function () {
					this.bottomBannerAd && this.bottomBannerAd.hide()
				},
				closeBanner: function () {
					this.bottomBannerAd && (this.bottomBannerAd.destroy(), this.bottomBannerAd = null)
				},
				showVideo: function (e) {
					var t = null == this.VIDEO_IDS[e.videoType] ? this.VIDEO_IDS.
						default :
						this.VIDEO_IDS[e.videoType],
						a = swan.createRewardedVideoAd({
							appSid: this.APP_SID,
							adUnitId: t
						});
					if (a) {
						var i = function t(i) {
							AudioHandler.playBGM(),
								i && i.isEnded || void 0 === i ? e.success && e.success() : e.abort && e.abort(),
								a.offClose(t),
								a.offError(n)
						};
						a.load().then(function () {
							a.show(),
								AudioHandler.stopBGM()
						}).
							catch(function (e) {
								return cc.error(e.errMsg)
							}),
							a.onClose(i);
						var n = function t(n) {
							cc.warn("Video Error \u65e0\u5e7f\u544a\u8fd4\u56de", n),
								e.fail && e.fail(),
								a.offClose(i),
								a.offError(t)
						};
						a.onError(n)
					} else cc.warn("Video \u65e0\u5e7f\u544a\u8fd4\u56de"),
						e.fail && e.fail()
				}
			}),
			cc._RF.pop()
	},
	{
		BaseAd: "BaseAd"
	}],
	BaiduDataStore: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "1f7c2Rf7+RFcKtQqdKXYTo4", "BaiduDataStore"),
			cc.Class({
				extends: e("BaseDataStore")
			}),
			cc._RF.pop()
	},
	{
		BaseDataStore: "BaseDataStore"
	}],
	BaiduErrorHandler: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "86ed2LlWqFGR7s/FuPrmgQS", "BaiduErrorHandler"),
			cc.Class({
				extends: e("BaseErrorHandler")
			}),
			cc._RF.pop()
	},
	{
		BaseErrorHandler: "BaseErrorHandler"
	}],
	BaiduPlatform: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "a9218+r7/BEI64OolInwpup", "BaiduPlatform"),
			cc.Class({
				extends: e("BasePlatform"),
				init: function (e) {
					var t = this;["login", "getLaunchOptionsSync", "showLoading", "hideLoading", "shareAppMessage", "showToast", "postMessage", "getOpenDataContext", "setUserCloudStorage", "getUserCloudStorage", "createGameClubButton", "showShareMenu", "onShareAppMessage", "navigateToMiniProgram", "previewImage", "createShortCut", "openCustomerServiceConversation", "onShow", "onHide", "vibrateShort", "getSystemInfoSync", "request", "exit"].forEach(function (e) {
						t[e] = function (t) {
							if (t || (t = {}), "function" == typeof swan[e]) return swan[e](t);
							cc.warn("[BaiduPlatform] \u65b9\u6cd5" + e + "\u672a\u5b9e\u73b0"),
								"function" == typeof t.fail && t.fail()
						}
					})
				},
				navigateToMiniProgram: function (e) {
					return swan.navigateToMiniProgram(e)
				}
			}),
			cc._RF.pop()
	},
	{
		BasePlatform: "BasePlatform"
	}],
	BaseAd: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "cfcd09EzuVFXrcALQDMJRXv", "BaseAd"),
			cc.Class({}),
			cc._RF.pop()
	},
	{}],
	BaseAnalysis: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "f57e36wwHhPsorqS7tm6gkh", "BaseAnalysis"),
			cc.Class({}),
			cc._RF.pop()
	},
	{}],
	BaseDataStore: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "8841dJ2JWZMqonfxRJddM3P", "BaseDataStore"),
			cc.Class({
				read: function (e) {
					var t = cc.sys.localStorage.getItem(e.key);
					return "function" == typeof e.success && e.success(t),
						t
				},
				save: function (e) {
					var t = cc.sys.localStorage.setItem(e.key, e.data);
					return "function" == typeof e.success && e.success(t),
						t
				},
				delete: function (e) {
					var t = cc.sys.localStorage.removeItem(e.key);
					return "function" == typeof e.success && e.success(t),
						t
				},
				readCloud: function (e) {
					var t = cc.sys.localStorage.getItem("cloud_" + e.key);
					return "function" == typeof e.success && e.success(t),
						t
				},
				saveCloud: function (e) {
					var t = cc.sys.localStorage.setItem("cloud_" + e.key, e.data);
					return "function" == typeof e.success && e.success(t),
						t
				}
			}),
			cc._RF.pop()
	},
	{}],
	BaseDialog: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "62ee78HLvRK5aoMkqXI3zkr", "BaseDialog"),
			cc.Class({
				extends: cc.Component,
				editor: {
					executeInEditMode: !0
				},
				properties: {
					addNode: cc.Node,
					shade: cc.Node,
					_touchhide: !0
				},
				start: function () {
					this.node.width = cc.winSize.width,
						this.node.height = cc.winSize.height,
						this.shade.getComponent(cc.Widget).updateAlignment()
				},
				addDialog: function (e) {
					this.addNode.addChild(e),
						this.addNode.width = e.width,
						this.addNode.height = e.height
				},
				setArgs: function (e) {
					this.touchhide = e.touchhide,
						this.shade.active = e.shade,
						e.block || this.node.removeComponent(cc.BlockInputEvents)
				},
				show: function () {
					Music.play("SFX_Open Panel"),
						this.addNode.setScale(0),
						this.addNode.runAction(cc.scaleTo(.2, 1))
				},
				touchHide: function () {
					this.touchhide && this.hide()
				},
				hide: function () {
					this.addNode.runAction(cc.sequence(cc.scaleTo(.2, 0), cc.callFunc(this.hideDialog, this)))
				},
				hideDialog: function () {
					Music.play("SFX_Close Panel"),
						ViewMgr.hideDialogEnd()
				}
			}),
			cc._RF.pop()
	},
	{}],
	BaseErrorHandler: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "f4558EZyL5M55HQpiBawAVw", "BaseErrorHandler"),
			cc.Class({
				onException: function (e, t, a, i, n) {
					n = n || {},
						console.log("[\u6355\u83b7\u5230\u5168\u5c40\u5f02\u5e38]"),
						console.log("\u6587\u4ef6", e),
						console.log("\u884c\u6570", t),
						console.log("\u4fe1\u606f", a);
					var r = {};
					return r.file = e,
						r.line = t,
						r.message = a,
						r.stack = n.stack,
						this.report(r),
						!1
				},
				report: function (e) {
					e.platform = Framework.moduleCode;
					var t = {
						method: "POST",
						url: "https://top1test.gameabc2.com/front/report"
					};
					t.data = {
						game: "Idle Gold Miner",
						content: JSON.stringify(e)
					},
						t.success = function (e) { },
						t.fail = function () { },
						Platform.request(t)
				}
			}),
			cc._RF.pop()
	},
	{}],
	BaseLayer: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "6df01fuOjpLlY8XTNiZZw3y", "BaseLayer"),
			cc.Class({
				extends: e("EasyEvent"),
				editor: {
					menu: "Layer/BaseLayer"
				},
				properties: {},
				onLoad: function () {
					this.node.setContentSize(cc.winSize)
				}
			}),
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent"
	}],
	BasePay: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "35899kyIENKKqdoIjbgB1n8", "BasePay"),
			cc.Class({}),
			cc._RF.pop()
	},
	{}],
	BasePlatform: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "8954a90LzhDu5XyRoRtfSi7", "BasePlatform"),
			cc.Class({
				login: function (e) {
					console.log("BasePlatform Login"),
						"function" == typeof e.success && e.success()
				},
				onShow: function (e) {
					cc.game.on(cc.game.EVENT_SHOW, e.callback)
				},
				onHide: function (e) {
					cc.game.on(cc.game.EVENT_HIDE, e.callback)
				},
				request: function (e) {
					null == e && (e = {});
					var t = cc.loader.getXMLHttpRequest();
					t.open(e.method || "GET", e.url, !0),
						t.setRequestHeader("content-type", "application/x-www-form-urlencoded");
					var a = setTimeout(function () {
						t.abort(),
							e.fail && e.fail()
					},
						3e3);
					t.onreadystatechange = function () {
						if (4 == t.readyState) if (clearTimeout(a), t.status >= 200 && t.status < 400) {
							var i = null;
							try {
								i = JSON.parse(t.responseText)
							} catch (e) {
								i = t.responseText
							}
							var n = {};
							n.data = i,
								n.status = t.status,
								e.success && e.success(n)
						} else e.fail && e.fail()
					};
					var i = "";
					for (var n in e.data) i += n + "=" + e.data[n] + "&";
					t.send(i)
				},
				showToast: function (e) {
					e = e || {};
					var t = new cc.Node;
					e.isMask && t.on(cc.Node.EventType.TOUCH_START,
						function (e) {
							e.stopPropagation()
						});
					var a = new cc.Node,
						i = a.addComponent(cc.Label);
					i.string = e.title,
						i._updateRenderData(!0),
						i.fontSize = 40,
						i.lineHeight = i.fontSize + 10,
						i.horizontalAlign = cc.Label.HorizontalAlign.CENTER,
						i.verticalAlign = cc.Label.VerticalAlign.CENTER,
						a.parent = t,
						a.y = -3;
					var n = t.addComponent(cc.Graphics),
						r = i.node.getContentSize();
					n.lineWidth = r.height + 40,
						n.lineCap = cc.Graphics.LineCap.ROUND,
						n.schedule(function () {
							n.strokeColor.setA(.75 * t.opacity),
								n.clear(),
								n.moveTo(- r.width / 2 - 10, 0),
								n.lineTo(r.width / 2 + 10, 0),
								n.stroke()
						},
							.01),
						t.setContentSize(cc.winSize),
						t.color = cc.Color.WHITE,
						t.opacity = 1,
						t.x = cc.winSize.width / 2,
						t.y = cc.winSize.height / 1.8,
						t.runAction(cc.sequence(cc.fadeTo(.2, 255), cc.delayTime(1.5), cc.fadeOut(.2), cc.callFunc(function () {
							t.destroy()
						}))),
						cc.director.getScene().addChild(t)
				}
			}),
			cc._RF.pop()
	},
	{}],
	Blink: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "b942dC3e8ZKHrcxdCd1ZWs8", "Blink"),
			cc.Class({
				extends: cc.Component,
				editor: {
					menu: "Effect/Blink"
				},
				properties: {
					rate: .1,
					random: !0
				},
				start: function () {
					this.random ? this.node.runAction(cc.repeatForever(cc.sequence(cc.fadeOut(cc.random0To1() * this.rate), cc.fadeIn(cc.random0To1() * this.rate), cc.fadeOut(cc.random0To1() * this.rate), cc.fadeIn(cc.random0To1() * this.rate)))) : this.node.runAction(cc.repeatForever(cc.sequence(cc.fadeOut(this.rate), cc.fadeIn(this.rate))))
				}
			}),
			cc._RF.pop()
	},
	{}],
	BoostAd: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "6ee9fZym1dE4ZO8BEvizK2j", "BoostAd"),
			cc.Class({
				extends: cc.Component,
				properties: {
					multValue: cc.Label,
					mineAddPro: cc.ProgressBar,
					mineAddPro1: cc.ProgressBar,
					mineAddLabel: cc.Label,
					mineAddressLabel: cc.Label,
					AdBtnNode: cc.Node,
					tutorialBtnNode: cc.Node,
					shareNode: cc.Node,
					boostOverViewPrefab: cc.Prefab
				},
				start: function () {
					this.tutorial = window.Tutorial && "Boost" == window.Tutorial.currentTutorial,
						this.timeInterval = 1,
						this.mineAddPro.progress = 0,
						this.mineAddLabel.string = 0,
						this.multValue.string = "x" + ItemMgr.getActiveItemEffect() * ItemMgr.getAdEffect(),
						this.mineAddressLabel.string = "in the " + CfgApi.get("String", CfgApi.get("AllMines", UserData.GameData.CurrentMine).name).en,
						this.tutorial ? (this.tutorialBtnNode.active = !0, this.AdBtnNode.active = !1, this.shareNode.active = !1) : (this.tutorialBtnNode.active = !1, Platform.shareOrVideo({
							type: "boost",
							sharenode: this.shareNode,
							videonode: this.AdBtnNode
						}))
				},
				onAdClicked: function () {
					Music.play("SFX_Button General");
					var e = this;
					this.tutorial ? (ItemMgr.activeAd(), e.multValue.string = "x" + ItemMgr.getActiveItemEffect() * ItemMgr.getAdEffect(), this.tutorial = !1, this.tutorialBtnNode.active = !1, this.AdBtnNode.active = !0) : Ad.showVideo({
						type: "boost",
						success: function (t) {
							t && t.virtual || Analysis.sendEvent({
								type: "boostAdSuccess"
							}),
								ItemMgr.activeAd(),
								e.multValue.string = "x" + ItemMgr.getActiveItemEffect() * ItemMgr.getAdEffect(),
								console.log("ad show success")
						},
						fail: function (e) {
							console.log("ad show failed :" + e)
						}
					})
				},
				onShareClicked: function (e) {
					var t = this;
					Platform.chooseContext({
						type: "boost",
						success: function (e) {
							ItemMgr.activeAd(),
								t.multValue.string = "x" + ItemMgr.getActiveItemEffect() * ItemMgr.getAdEffect()
						},
						fail: function (e) {
							e && Platform.showToast({
								title: e
							})
						}
					})
				},
				refresh: function () {
					this.multValue.string = "x" + ItemMgr.getActiveItemEffect() * ItemMgr.getAdEffect()
				},
				update: function (e) {
					if (this.timeInterval < 1) this.timeInterval += e;
					else {
						this.timeInterval = 0;
						var t = Date.now(),
							a = ItemMgr.getAdEffectEndTime() - t,
							i = Tools.time2hms(a),
							n = "";
						a >= 864e5 ? (this.mineAddPro.progress = 1, this.mineAddPro1.progress = 1, n += i.h > 0 ? i.h + "h" : "", this.mineAddLabel.string = n) : a >= 756e5 ? (this.mineAddPro.progress = 1, this.mineAddPro1.progress = a / 864e5, n += i.h > 0 ? i.h + "h" : "", n += i.m > 0 ? i.m + "m" : "", n += i.s > 0 ? i.s + "s" : "", this.mineAddLabel.string = n) : a >= 0 ? (this.mineAddPro1.progress = a / 864e5, this.mineAddPro.progress = this.mineAddPro1.progress + 4 / 24, n += i.h > 0 ? i.h + "h" : "", n += i.m > 0 ? i.m + "m" : "", n += i.s > 0 ? i.s + "s" : "", this.mineAddLabel.string = n) : (this.mineAddPro.progress = 4 / 24, this.mineAddPro1.progress = 0, this.mineAddLabel.string = n)
					}
				},
				onHelpClicked: function () {
					var e = cc.instantiate(this.boostOverViewPrefab);
					ViewMgr.showDialog(e)
				}
			}),
			cc._RF.pop()
	},
	{}],
	BoostBoosts: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "653adhciIxARqFudFlwaqrk", "BoostBoosts"),
			cc.Class({
				extends: e("EasyEvent"),
				properties: {
					icon: cc.Sprite,
					valueLabel: cc.Label,
					content: cc.Node,
					boostsItem: cc.Prefab,
					boostsActiveItem: cc.Prefab,
					superCashNum: cc.Label,
					spriteFrame: cc.SpriteFrame,
					lineSpriteFrame: cc.SpriteFrame,
					font: cc.Font,
					boostOverViewPrefab: cc.Prefab
				},
				start: function () {
					this.tutorial = window.Tutorial && "Boost" == window.Tutorial.currentTutorial,
						this.initData()
				},
				initData: function () {
					this.refresh(),
						this.content.removeAllChildren(),
						this.initActiveItem(),
						this.initInventory(),
						this.initIncomeBoosts(),
						this.initTimeJumps()
				},
				initActiveItem: function () {
					var e = UserData.GameData.Item.active;
					if (e) {
						var t = new cc.Node;
						this.activeItemNode = t,
							t.addComponent(cc.Sprite).type = cc.Sprite.Type.SLICED,
							t.width = 780,
							t.height = 40,
							this.content.addChild(t);
						var a = new cc.Node;
						a.y = 10,
							a.color = cc.Color.WHITE;
						var i = a.addComponent(cc.Label);
						i.string = Language.getName("Active Boosts"),
							i.font = this.font,
							i.fontSize = 30;
						var n = a.addComponent(cc.LabelOutline);
						n.color = cc.color(43, 43, 43),
							n.width = 2;
						var r = a.addComponent(cc.LabelShadow);
						r.color = cc.color(43, 43, 43),
							r.offset.x = 0,
							r.offset.y = -2,
							r.offset.blur = 0,
							t.addChild(a);
						var o = new cc.Node;
						o.width = 750;
						var s = o.addComponent(cc.Layout);
						s.resizeMode = cc.Layout.ResizeMode.CONTAINER,
							s.type = cc.Layout.Type.GRID,
							s.paddingTop = 10,
							s.paddingBottom = 10,
							s.paddingLeft = 10,
							s.paddingRight = 10,
							s.spacingX = 20,
							s.spacingY = 10,
							this.content.addChild(o);
						var c = 0,
							l = Date.now();
						for (var d in e) if (e[d].endTime > l) {
							var h = cc.instantiate(this.boostsActiveItem);
							h.getComponent("BoostsActiveItem").setData(e[d].icon, e[d].endTime - l),
								o.addChild(h),
								c++
						}
						var u = new cc.Node;
						this.activeItemLineNode = u;
						var m = u.addComponent(cc.Sprite);
						m.type = cc.Sprite.Type.SLICED,
							m.spriteFrame = this.lineSpriteFrame,
							u.width = 780,
							u.height = 11,
							this.content.addChild(u),
							this.activeItemLayoutNode = o,
							this.activeItemNode.active = c > 0,
							this.activeItemLayoutNode.active = c > 0,
							this.activeItemLineNode.active = c > 0
					}
				},
				initInventory: function () {
					var e = UserData.GameData.Item.inventory;
					if (e) {
						var t = new cc.Node;
						this.inventoryNode = t,
							this.inventoryNode.active = Object.keys(e).length > 0,
							t.addComponent(cc.Sprite).type = cc.Sprite.Type.SLICED,
							t.width = 780,
							t.height = 100,
							this.content.addChild(t);
						var a = new cc.Node;
						a.y = 10,
							a.color = cc.Color.WHITE;
						var i = a.addComponent(cc.Label);
						i.string = Language.getName("Inventory"),
							i.font = this.font,
							i.fontSize = 30;
						var n = a.addComponent(cc.LabelOutline);
						n.color = cc.color(43, 43, 43),
							n.width = 2;
						var r = a.addComponent(cc.LabelShadow);
						r.color = cc.color(43, 43, 43),
							r.offset.x = 0,
							r.offset.y = -2,
							r.offset.blur = 0,
							t.addChild(a);
						var o = new cc.Node;
						o.y = -30,
							o.color = cc.color("#99c7f1");
						var s = o.addComponent(cc.Label);
						s.string = Language.getName("Use your boost item now!"),
							s.font = this.font,
							s.fontSize = 22;
						var c = o.addComponent(cc.LabelOutline);
						c.color = cc.color(43, 43, 43),
							c.width = 2;
						var l = o.addComponent(cc.LabelShadow);
						l.color = cc.color(43, 43, 43),
							l.offset.x = 0,
							l.offset.y = -2,
							l.offset.blur = 0,
							t.addChild(o);
						var d = new cc.Node;
						d.width = 750;
						var h = d.addComponent(cc.Layout);
						for (var u in h.resizeMode = cc.Layout.ResizeMode.CONTAINER,
							h.type = cc.Layout.Type.GRID,
							h.paddingTop = 10,
							h.paddingBottom = 10,
							h.paddingLeft = 10,
							h.paddingRight = 10,
							h.spacingX = 20,
							h.spacingY = 10,
							this.content.addChild(d), e) if (e[u] > 0) {
								var m = CfgApi.get("Item", u),
									g = cc.instantiate(this.boostsItem);
								g.getComponent("BoostsItem").setData(m, e[u]),
									d.addChild(g)
							}
						this.inventoryLayoutNode = d,
							this.inventoryLayoutNode.active = Object.keys(e).length > 0
					}
				},
				initTimeJumps: function () {
					var e = CfgApi.get("Shop", "2");
					if (e) {
						var t = new cc.Node,
							a = t.addComponent(cc.Sprite);
						a.spriteFrame = this.spriteFrame,
							a.type = cc.Sprite.Type.SLICED,
							a.sizeMode = cc.Sprite.SizeMode.CUSTOM,
							t.width = 780,
							t.height = 100,
							this.content.addChild(t);
						var i = new cc.Node;
						i.y = 10,
							i.color = cc.Color.WHITE;
						var n = i.addComponent(cc.Label);
						n.string = Language.getName("Time Jump"),
							n.font = this.font,
							n.fontSize = 30;
						var r = i.addComponent(cc.LabelOutline);
						r.color = cc.color(43, 43, 43),
							r.width = 2;
						var o = i.addComponent(cc.LabelShadow);
						o.color = cc.color(43, 43, 43),
							o.offset.x = 0,
							o.offset.y = -2,
							o.offset.blur = 0,
							t.addChild(i);
						var s = new cc.Node;
						s.y = -50,
							s.color = cc.color("#99c7f1");
						var c = s.addComponent(cc.Label);
						c.string = Language.getName("Gain resources from the future instantly!"),
							c.font = this.font,
							c.fontSize = 22;
						var l = s.addComponent(cc.LabelOutline);
						l.color = cc.color(43, 43, 43),
							l.width = 2;
						var d = s.addComponent(cc.LabelShadow);
						d.color = cc.color(43, 43, 43),
							d.offset.x = 0,
							d.offset.y = -2,
							d.offset.blur = 0,
							t.addChild(s);
						var h = new cc.Node;
						h.width = 750;
						var u = h.addComponent(cc.Layout);
						u.resizeMode = cc.Layout.ResizeMode.CONTAINER,
							u.type = cc.Layout.Type.GRID,
							u.paddingTop = 10,
							u.paddingBottom = 10,
							u.paddingLeft = 10,
							u.paddingRight = 10,
							u.spacingX = 20,
							u.spacingY = 10,
							this.content.addChild(h);
						var m = !0;
						for (var g in e) {
							var p = cc.instantiate(this.boostsItem); !m && this.tutorial ? (p.getComponent("BoostsItem").setData(e[g], null, this.tutorial), m = !0) : p.getComponent("BoostsItem").setData(e[g]),
								h.addChild(p)
						}
						this.timeJumpLayoutNode = h
					}
				},
				initIncomeBoosts: function () {
					var e = CfgApi.get("Shop", "1");
					if (e) {
						var t = new cc.Node,
							a = t.addComponent(cc.Sprite);
						a.spriteFrame = this.spriteFrame,
							a.type = cc.Sprite.Type.SLICED,
							a.sizeMode = cc.Sprite.SizeMode.CUSTOM,
							t.width = 780,
							t.height = 100,
							this.content.addChild(t);
						var i = new cc.Node;
						i.y = 10,
							i.color = cc.Color.WHITE;
						var n = i.addComponent(cc.Label);
						n.string = Language.getName("Income Boosts"),
							n.font = this.font,
							n.fontSize = 30;
						var r = i.addComponent(cc.LabelOutline);
						r.color = cc.color(43, 43, 43),
							r.width = 2;
						var o = i.addComponent(cc.LabelShadow);
						o.color = cc.color(43, 43, 43),
							o.offset.x = 0,
							o.offset.y = -2,
							o.offset.blur = 0,
							t.addChild(i);
						var s = new cc.Node;
						s.y = -50,
							s.color = cc.color("#99c7f1");
						var c = s.addComponent(cc.Label);
						c.string = Language.getName("Gain extra income for one click!"),
							c.font = this.font,
							c.fontSize = 22,
							t.addChild(s);
						var l = new cc.Node;
						l.width = 750;
						var d = l.addComponent(cc.Layout);
						d.resizeMode = cc.Layout.ResizeMode.CONTAINER,
							d.type = cc.Layout.Type.GRID,
							d.paddingTop = 10,
							d.paddingBottom = 10,
							d.paddingLeft = 10,
							d.paddingRight = 10,
							d.spacingX = 20,
							d.spacingY = 10,
							this.content.addChild(l);
						var h = !1;
						for (var u in e) {
							var m = cc.instantiate(this.boostsItem); !h && this.tutorial ? (m.getComponent("BoostsItem").setData(e[u], null, this.tutorial), h = !0) : m.getComponent("BoostsItem").setData(e[u]),
								l.addChild(m)
						}
					}
				},
				refreshData: function () {
					if (this.activeItemLayoutNode) {
						this.activeItemLayoutNode.removeAllChildren(),
							this.activeItemLayoutNode.height = 0;
						var e = 0,
							t = Date.now(),
							a = UserData.GameData.Item.active;
						for (var i in a) if (a[i].endTime > t) {
							var n = cc.instantiate(this.boostsActiveItem);
							n.getComponent("BoostsActiveItem").setData(a[i].icon, a[i].endTime - t),
								this.activeItemLayoutNode.addChild(n),
								e++
						}
						this.activeItemNode.active = e > 0,
							this.activeItemLayoutNode.active = e > 0,
							this.activeItemLineNode.active = e > 0
					}
					if (this.inventoryLayoutNode) {
						this.inventoryLayoutNode.removeAllChildren(),
							this.inventoryLayoutNode.height = 0;
						var r = UserData.GameData.Item.inventory;
						for (var o in r) if (r[o] > 0) {
							var s = CfgApi.get("Item", o),
								c = cc.instantiate(this.boostsItem);
							c.getComponent("BoostsItem").setData(s, r[o]),
								this.inventoryLayoutNode.addChild(c)
						}
						this.inventoryNode.active = Object.keys(r).length > 0,
							this.inventoryLayoutNode.active = Object.keys(r).length > 0
					}
					for (var l = this.timeJumpLayoutNode.children,
						d = 0; d < l.length; d++) l[d].getComponent("BoostsItem").refresh();
					this.refresh()
				},
				refresh: function () {
					var e = Tools.time2hms(ItemMgr.getEffectMaxTime()),
						t = "";
					t += e.h > 0 ? e.h + "h" : "",
						t += e.m > 0 ? e.m + "m" : "",
						this.valueLabel.string = "x" + ItemMgr.getActiveItemEffect() * ItemMgr.getAdEffect() + ("" == t ? "" : "\n" + t),
						this.superCashNum.string = "x" + UserData.GameData.SuperCash
				},
				onGetItem: function () {
					this.refreshData()
				},
				onHelpClicked: function () {
					var e = cc.instantiate(this.boostOverViewPrefab);
					ViewMgr.showDialog(e)
				}
			}),
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent"
	}],
	BoostOverView: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "13f1cNemytJLIn5aJpwmeD1", "BoostOverView");
		e("constants");
		cc.Class({
			extends: cc.Component,
			properties: {
				content: cc.Label
			},
			start: function () {
				var e = "",
					t = Date.now(),
					a = 0;
				for (var i in UserData.GameData.Item.active) if (UserData.GameData.Item.active[i].endTime > t) {
					var n = UserData.GameData.Item.active[i].endTime - t,
						r = Tools.time2hms(n),
						o = "";
					o += r.h > 0 ? r.h + "h " : "",
						o += r.m > 0 ? r.m + "m " : "",
						0 == r.m && (o += r.s > 0 ? r.s + "s " : "");
					for (var s = "+   " + UserData.GameData.Item.active[i].value + "x " + Language.getName("Income Boosts"), c = 28 - s.length, l = 0; l < c; ++l) s += "  ";
					e += s += o + "\n",
						a += UserData.GameData.Item.active[i].value
				}
				0 != a && (e += "=   " + a + "x " + Language.getName("Income") + "\n"),
					e += "\n",
					e += "\n";
				var d = ItemMgr.getAdEffectEndTime();
				if (d.endTime > t) {
					var h = d.endTime - t,
						u = Tools.time2hms(h),
						m = "";
					m += u.h > 0 ? u.h + "h " : "",
						m += u.m > 0 ? u.m + "m " : "",
						0 == u.m && (m += u.s > 0 ? u.s + "s " : "");
					for (var g = "x   " + d.value + "x " + Language.getName("Ad"),
						p = 28 - g.length,
						f = 0; f < p; ++f) g += "  ";
					e += g += m + "\n",
						e += "=   " + ItemMgr.getAdEffect() * ItemMgr.getActiveItemEffect() + "x " + Language.getName("Income") + "\n"
				}
				this.content.string = e,
					Analysis.sendEvent({
						type: "openBoostOverView"
					})
			},
			onCancelClicked: function () {
				ViewMgr.hideDialogBegin()
			}
		}),
			cc._RF.pop()
	},
	{
		constants: 4
	}],
	BoostsActiveItem: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "aec6b82q3RCBYrvyPMsSokR", "BoostsActiveItem"),
			cc.Class({
				extends: e("EasyEvent").declareEvent("AddCash", "GetItem"),
				properties: {
					icon: cc.Sprite,
					effectIcon: cc.Sprite,
					effectLabel: cc.Label
				},
				start: function () { },
				setData: function (e, t) {
					var a = this;
					cc.loader.loadRes("texture/itemIcon/" + e, cc.SpriteFrame,
						function (e, t) {
							e || (a.icon.spriteFrame = t)
						});
					var i = Tools.time2hms(t),
						n = "";
					n += i.h > 0 ? i.h + "h " : "",
						n += i.m > 0 ? i.m + "m " : "",
						n += 0 == i.h && i.s > 0 ? i.s + "s " : "",
						this.effectLabel.string = n,
						this.dtTime = Math.ceil(t / 1e3),
						this.schedule(this.scheduleEffectTime, 1)
				},
				scheduleEffectTime: function () {
					if (this.dtTime -= 1, this.dtTime <= 0) return this.unschedule(this.scheduleEffectTime),
						void this.publishEvent({
							type: "GetItem"
						});
					var e = Tools.time2hms(1e3 * this.dtTime),
						t = "";
					t += e.h > 0 ? e.h + "h " : "",
						t += e.m > 0 ? e.m + "m " : "",
						t += 0 == e.h && e.s > 0 ? e.s + "s " : "",
						this.effectLabel.string = t
				}
			}),
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent"
	}],
	BoostsItem: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "1f1fcIepm9DHboWDSasMfB3", "BoostsItem"),
			cc.Class({
				extends: e("EasyEvent").declareEvent("AddCash", "GetItem"),
				properties: {
					icon: cc.Sprite,
					itemName: cc.Label,
					effectIcon: cc.Sprite,
					effectLabel: cc.Label,
					buttonLabel: cc.Label,
					cashIcon: cc.Node,
					dialogItemPrefab: cc.Prefab,
					dialogGoodPrefab: cc.Prefab
				},
				start: function () { },
				setData: function (e, t) {
					var a = this,
						i = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
					if (this.data = e, this.num = t, this.tutorial = i, this.data.type) this.itemName.string = CfgApi.get("String", this.data.name).en,
						cc.loader.loadRes("texture/itemIcon/" + this.data.icon, cc.SpriteFrame,
							function (e, t) {
								try {
									e || (a.icon.spriteFrame = t)
								} catch {
									console.log(3)
								}
							});
					else if (this.data.shop_type) {
						var n = CfgApi.get("Item", this.data.item_id);
						this.itemName.string = CfgApi.get("String", n.name).en,
							cc.loader.loadRes("texture/itemIcon/" + n.icon, cc.SpriteFrame,
								function (e, t) {
									try {
										e || (a.icon.spriteFrame = t)
									} catch {
										console.log(2)
									}

								})
					}
					this.refresh()
				},
				onButtonClicked: function (e) {
					var t = this;
					if (this.data.type) {
						ItemMgr.activeItem(this.data),
							this.publishEvent({
								type: "GetItem",
								itemId: this.data.item_id
							});
						var a = cc.instantiate(this.dialogGoodPrefab);
						1 == this.data.type ? (a.getComponent("DialogGood").setData({
							title: Language.getName("You Used"),
							explan: CfgApi.get("String", this.data.desc).en,
							icon: this.data.icon
						}), UserData.GameData.Analytics.BoostMultipleFrist || (UserData.GameData.Analytics.BoostMultipleFrist = !0, Analysis.sendEvent({
							type: "BoostMultipleFrist"
						}))) : 2 == this.data.type && (a.getComponent("DialogGood").setData({
							title: Language.getName("You Used"),
							explan: CfgApi.get("String", this.data.desc).en,
							icon: this.data.icon
						}), this.publishEvent({
							type: "ShowAddCoinAct",
							cashType: 1,
							start: e.target.parent.convertToWorldSpaceAR(e.target)
						}), UserData.GameData.Analytics.BoostIntimeFrist || (UserData.GameData.Analytics.BoostIntimeFrist = !0, Analysis.sendEvent({
							type: "BoostIntimeFrist"
						}))),
							ViewMgr.showDialog(a),
							Analysis.sendEvent({
								type: "usedItem"
							})
					} else if (this.data.shop_type) {
						var i = this.tutorial ? 0 : this.data.currency_num;
						if (i > UserData.GameData.SuperCash) {
							var n = cc.instantiate(this.dialogItemPrefab);
							return n.getComponent("DialogItem").setData({
								title: Language.getName("Not Enough Super Cash"),
								explan: Language.getName("You don't have enough Super Cash for that."),
								icon: this.data.icon,
								btn: !1
							}),
								void ViewMgr.showDialog(n)
						}
						var r = this,
							o = CfgApi.get("Item", this.data.item_id);
						async.waterfall([function (e) {
							var a = cc.instantiate(t.dialogItemPrefab);
							a.getComponent("DialogItem").setData({
								title: Language.getName("Comfirm Purchase"),
								content: CfgApi.get("String", o.desc).en,
								cost: i,
								icon: o.icon,
								btn: !0,
								callback: function (t) {
									t ? (Music.play("SFX_Get Multiple"), e(null)) : e("err")
								}
							}),
								ViewMgr.showDialog(a, {
									touchhide: !1
								})
						},
						function (e) {
							r.publishEvent({
								type: "SpendSuperCash",
								superCashNum: i
							}),
								ItemMgr.addItem(t.data.item_id, 1),
								r.publishEvent({
									type: "GetItem",
									itemId: t.data.item_id
								}),
								e(null)
						},
						function (e) {
							var a = cc.instantiate(t.dialogGoodPrefab);
							a.getComponent("DialogGood").setData({
								title: Language.getName("You Bought"),
								explan: CfgApi.get("String", o.desc).en,
								icon: o.icon,
								callback: function () {
									e()
								}
							}),
								ViewMgr.showDialog(a),
								Analysis.sendEvent({
									type: "buyItem"
								})
						},
						function (e) {
							var a = cc.instantiate(t.dialogItemPrefab);
							a.getComponent("DialogItem").setData({
								title: Language.getName("Use Now") + "?",
								effect: 2 == o.type ? t.effectLabel.string : null,
								explan: "Use your " + CfgApi.get("String", o.desc).en,
								icon: o.icon,
								btn: !0,
								callback: function (i) {
									i ? (Music.play("SFX_Get Multiple"), 2 == o.type && t.publishEvent({
										type: "ShowAddCoinAct",
										cashType: 1,
										start: a.parent.convertToWorldSpaceAR(a)
									}), e(null)) : e("err")
								}
							}),
								ViewMgr.showDialog(a, {
									touchhide: !1
								})
						},
						function (e) {
							ItemMgr.activeItem(o),
								t.publishEvent({
									type: "GetItem",
									itemId: o.item_id
								});
							var a = cc.instantiate(t.dialogGoodPrefab);
							a.getComponent("DialogGood").setData({
								title: Language.getName("You Used"),
								explan: CfgApi.get("String", o.desc).en,
								icon: o.icon,
								callback: function () {
									e()
								}
							}),
								ViewMgr.showDialog(a),
								1 == o.type ? UserData.GameData.Analytics.BoostMultipleFrist || (UserData.GameData.Analytics.BoostMultipleFrist = !0, Analysis.sendEvent({
									type: "BoostMultipleFrist"
								})) : 2 == o.type && (UserData.GameData.Analytics.BoostIntimeFrist || (UserData.GameData.Analytics.BoostIntimeFrist = !0, Analysis.sendEvent({
									type: "BoostIntimeFrist"
								}))),
								Analysis.sendEvent({
									type: "usedItem"
								})
						}],
							function (e, a) {
								t.tutorial && (t.tutorial = !1, t.refresh())
							})
					}
				},
				refresh: function () {
					if (this.data.type) {
						if (2 == this.data.type) {
							var t = CfgApi.get("AllMines"),
								a = new (e("NumberData"))(0),
								i = t[UserData.GameData.CurrentMine].init_currency_type;
							for (var n in t) t[n].init_currency_type == i && a.add(IdleCashMgr.getInlineCash(t[n].miner, !0));
							a.mult(60 * this.data.param2),
								a.mult(Math.pow(ItemMgr.getAdEffect() * ItemMgr.getActiveItemEffect(), .5)),
								this.effectLabel.string = "+" + a.toString()
						} else this.effectIcon.node.active = !1,
							this.effectLabel.node.active = !1;
						this.cashIcon.active = !1,
							this.buttonLabel.string = this.num + " " + Language.getName("use")
					} else if (this.data.shop_type) {
						var r = CfgApi.get("Item", this.data.item_id);
						if (2 == r.type) {
							var o = CfgApi.get("AllMines"),
								s = new (e("NumberData"))(0),
								c = o[UserData.GameData.CurrentMine].init_currency_type;
							for (var l in o) o[l].init_currency_type == c && s.add(IdleCashMgr.getInlineCash(o[l].miner, !0));
							s.mult(60 * r.param2),
								s.mult(Math.pow(ItemMgr.getAdEffect() * ItemMgr.getActiveItemEffect(), .5)),
								this.effectLabel.string = "+" + s.toString()
						} else this.effectIcon.node.active = !1,
							this.effectLabel.node.active = !1;
						this.cashIcon.active = !0,
							this.buttonLabel.string = this.tutorial ? 0 : this.data.currency_num
					}
				}
			}),
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent",
		NumberData: "NumberData"
	}],
	Boost: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "24829T5l2FM+Z73u35xKuOj", "Boost"),
			cc.Class({
				extends: e("EasyEvent").declareEvent("ButtomButtonClosed"),
				properties: {
					baseNode: cc.Node,
					AdContent: cc.Node,
					BoostsContent: cc.Node,
					IapContent: cc.Node,
					toggleAdNode: cc.Node,
					toggleBoostsNode: cc.Node
				},
				onLoad: function () {
					this.commonData = UserData.getMineDataRef("Common")
				},
				start: function () {
					this.node.width = cc.winSize.width,
						this.node.height = cc.winSize.height,
						this.show()
				},
				onToggleContainerClicked: function (e) {
					Music.play("SFX_Button General"),
						"toggle1" == e.node.name ? (this.AdContent.active = !0, this.AdContent.getComponent("BoostAd").refresh(), this.BoostsContent.active = !1, this.IapContent.active = !1, Analysis.sendEvent({
							type: "clickBoostAd"
						})) : "toggle2" == e.node.name ? (this.AdContent.active = !1, this.BoostsContent.active = !0, this.BoostsContent.getComponent("BoostBoosts").refresh(), this.IapContent.active = !1, Analysis.sendEvent({
							type: "clickBoostBoosts"
						})) : "toggle3" == e.node.name && (this.AdContent.active = !1, this.BoostsContent.active = !1, this.IapContent.active = !0)
				},
				show: function () {
					Music.play("SFX_Open Panel"),
						this.baseNode.scaleY = 0,
						this.baseNode.runAction(cc.scaleTo(.2, 1, 1)),
						Analysis.sendEvent({
							type: "openBoost"
						}),
						this.toggleBoostsNode.active = this.commonData.initStep >= 5.5,
						"Boost" == Tutorial.currentTutorial && (this.AdContent.active = !1, this.BoostsContent.active = !0, this.toggleBoostsNode.getComponent(cc.Toggle).isChecked = !0, this.BoostsContent.getComponent("BoostBoosts").refresh(), this.IapContent.active = !1)
				},
				onCloseClicked: function () {
					var e = this;
					Music.play("SFX_Close Panel"),
						this.baseNode.runAction(cc.sequence(cc.scaleTo(.1, 1, 0), cc.callFunc(function () {
							e.node.removeFromParent(),
								e.publishEvent({
									type: "ButtomButtonClosed"
								})
						},
							this)))
				}
			}),
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent"
	}],
	Breathe: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "cab7bsUrKhMQJycyI028vnS", "Breathe"),
			cc.Class({
				extends: cc.Component,
				editor: {
					menu: "Effect/Breathe"
				},
				properties: {},
				start: function () {
					var e = this;
					this.schedule(function () {
						e.node.runAction(cc.sequence(cc.fadeTo(1, 150), cc.fadeTo(1, 255)))
					},
						2)
				}
			}),
			cc._RF.pop()
	},
	{}],
	BtnUpgrade: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "9c9d4OG5XBJRYEJIBV2Yyj+", "BtnUpgrade");
		var i = e("PrisonerManager"),
			n = e("NumberData");
		cc.Class({
			extends: e("EasyEvent").declareEvent("LevelUpStoreHouse", "LevelUpElevator", "LevelUpSeam", "RequestUpgradeNeedMoneyStoreHouse", "RequestUpgradeNeedMoneyElevator", "RequestUpgradeNeedMoneySeam", "SpendCash", "CheckBottleNeck", "AddSuperCash", "RequestElevatorTotalPower", "RequestStoreTotalPower", "RequestSeamTotalPower", "AddStoreHouseSuperCash", "AddElevatorSuperCash", "AddSeamSuperCash", "SubStoreHouseSuperCash", "SubElevatorSuperCash", "SubSeamSuperCash"),
			properties: {
				labelLevel: {
					type: cc.Label,
					default:
						null
				},
				labelMoney: {
					type: cc.Label,
					default:
						null
				},
				labelUpgradeLevel: {
					type: cc.Label,
					default:
						null
				},
				progressLevel: cc.ProgressBar,
				prefabDialogLevelUp: cc.Prefab,
				spriteFrameBottleNeckNormal: cc.SpriteFrame,
				spriteFrameBottleNeckWarning: cc.SpriteFrame,
				spriteBottle: cc.Sprite,
				nodeReward: cc.Node,
				labReward: cc.Label,
				nodeArrow: cc.Node,
				tapHand: cc.Node
			},
			onLoad: function () { },
			start: function () { },
			initData: function (e, t, a) {
				var i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 1;
				this.minerBranch = a,
					this.minerId = i,
					this.level = e,
					this.requestLevelData()
			},
			requestLevelData: function () {
				var e = this,
					t = UserData.getMineDataRef("Setting");
				this.levelUpMode = t.LevelUpMode;
				var a = void 0;
				this.minerBranch == i.EnumMinerBranch.Seam ? a = "Seam" : this.minerBranch == i.EnumMinerBranch.Elevator ? a = "Elevator" : this.minerBranch == i.EnumMinerBranch.StoreHouse && (a = "StoreHouse"),
					this.publishEvent({
						type: "RequestUpgradeNeedMoney" + a,
						minerBranch: this.minerBranch,
						minerId: this.minerId,
						levelUpMode: this.levelUpMode,
						callback: function (t) {
							e.limitLevel = t.limitLevel,
								e.money = t.money,
								e.level = t.curLevel || 1,
								e.startLevel = t.startLevel,
								e.endLevel = t.endLevel,
								e.isMaxLevel = t.isMaxLevel || !1,
								e.cashNum = t.cashNum,
								e.superCash = t.superCash,
								e.refreshBtnState()
						},
						target: this
					}),
					this.superCash > 0 ? (this.labReward.string = "x" + this.superCash, this.changeNodeRewardState(!0)) : this.changeNodeRewardState(!1, !1)
			},
			changeNodeRewardState: function (e) {
				var t = this,
					a = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
				if (e) {
					this.nodeReward.active = !0;
					var i = cc.sequence(cc.scaleTo(.15, 1.1), cc.scaleTo(.05, 1), cc.callFunc(function () {
						var e = t.nodeReward.getChildByName("center"),
							a = cc.sequence(cc.scaleTo(.15, 1.1), cc.scaleTo(.15, 1), cc.scaleTo(.15, 1.1), cc.scaleTo(.15, 1), cc.delayTime(.2));
						e.runAction(cc.repeatForever(a))
					},
						this));
					if (i.setTag(1), !this.nodeReward.getActionByTag(1)) this.nodeReward.getChildByName("center").stopAllActions(),
						this.nodeReward.runAction(i)
				} else if (a) {
					this.nodeReward.getChildByName("center").stopAllActions();
					var n = cc.sequence(cc.scaleTo(.15, 1.1), cc.scaleTo(.05, 0));
					n.setTag(2),
						this.nodeReward.getActionByTag(2) || this.nodeReward.runAction(cc.sequence(n, cc.callFunc(function () {
							t.nodeReward.active = !1
						})))
				} else this.nodeReward.scale = 0,
					this.nodeReward.active = !1
			},
			refreshBtnState: function () {
				if (this.labelMoney.string = this.money.toString(), this.labelUpgradeLevel.string = Language.getName("UPGRADE") + " x" + this.limitLevel, this.labelLevel.string = "Lv " + this.level.toString(), this.progressLevel.progress = (this.level - this.startLevel) / (this.endLevel - this.startLevel), this.isMaxLevel) this.node.getComponent(cc.Button).interactable = !1,
					this.progressLevel.progress = 1,
					this.nodeArrow.active = !1,
					this.nodeArrow.getComponent(cc.Animation).stop(),
					this.tapHand.active = !1;
				else if (new n(UserData.GameData.TotalCash).compare(this.money) < 0) this.node.getComponent(cc.Button).interactable = !1,
					this.nodeArrow.active = !1,
					this.nodeArrow.getComponent(cc.Animation).stop(),
					this.tapHand.active = !1;
				else {
					this.node.getComponent(cc.Button).interactable = !0,
						this.nodeArrow.active = !0,
						this.tapHand.active = UserData.getMineDataRef("Common").initStep < 4 && UserData.getMineDataRef("Common").initStep >= 2.6;
					var e = this.nodeArrow.getComponent(cc.Animation).getAnimationState("upgradeArrow");
					e && !e.isPlaying && this.nodeArrow.getComponent(cc.Animation).play(),
						this.nodeArrow.getChildByName("arrow1").active = !0,
						this.nodeArrow.getChildByName("arrow2").active = !0,
						this.nodeArrow.getChildByName("arrow3").active = !0,
						this.limitLevel >= 50 || (this.limitLevel >= 10 ? this.nodeArrow.getChildByName("arrow1").active = !1 : (this.nodeArrow.getChildByName("arrow1").active = !1, this.nodeArrow.getChildByName("arrow2").active = !1))
				}
			},
			checkBottleNeck: function () {
				var e = this;
				this.minerBranch != i.EnumMinerBranch.Seam && (this.publishEvent({
					type: "RequestElevatorTotalPower",
					notIgnoreManager: !1,
					callback: function (t) {
						e.elevatorTotalPower = t.totalPower
					},
					target: this
				}), this.publishEvent({
					type: "RequestStoreTotalPower",
					notIgnoreManager: !1,
					callback: function (t) {
						e.storeTotalPower = t.totalPower
					},
					target: this
				}), this.publishEvent({
					type: "RequestSeamTotalPower",
					notIgnoreManager: !1,
					callback: function (t) {
						e.seamTotalPower = t.totalPower
					},
					target: this
				}), this.refreshBottleNeck())
			},
			refreshBottleNeck: function () {
				this.spriteBottle.spriteFrame = this.spriteFrameBottleNeckNormal;
				var e = !1;
				this.isMaxLevel || this.elevatorTotalPower && this.storeTotalPower && this.seamTotalPower && ((this.elevatorTotalPower.compare(this.storeTotalPower) < 0 ? this.elevatorTotalPower : this.storeTotalPower).compare(this.seamTotalPower.clone().mult(Constant.BOTTLE_NECK_RADIO)) < 0 ? this.elevatorTotalPower.compare(this.storeTotalPower) < 0 ? this.minerBranch == i.EnumMinerBranch.Elevator && (this.spriteBottle.spriteFrame = this.spriteFrameBottleNeckWarning, e = !0) : this.minerBranch == i.EnumMinerBranch.StoreHouse && (this.spriteBottle.spriteFrame = this.spriteFrameBottleNeckWarning, e = !0) : this.spriteBottle.spriteFrame = this.spriteFrameBottleNeckNormal);
				e ? this.spriteBottle.node.getComponent("RotateShake").play() : this.spriteBottle.node.getComponent("RotateShake").stop()
			},
			btnShowDialogLevelUp: function () {
				Analysis.sendEvent({
					type: "OpenDialogLevelUp"
				});
				var e = cc.instantiate(this.prefabDialogLevelUp);
				e.getComponent("DialogLevelUp").initData(this.minerBranch, this.minerId),
					ViewMgr.showDialog(e)
			},
			btnGetCash: function (e) {
				if (Music.play("SFX_Button General"), !(this.superCash < 0)) {
					var t = null;
					this.minerBranch == i.EnumMinerBranch.Seam ? t = "Seam" : this.minerBranch == i.EnumMinerBranch.Elevator ? t = "Elevator" : this.minerBranch == i.EnumMinerBranch.StoreHouse && (t = "StoreHouse"),
						this.publishEvent({
							type: "Sub" + t + "SuperCash",
							minerId: this.minerId,
							cashNum: parseInt(this.superCash)
						}),
						this.changeNodeRewardState(!1),
						this.publishEvent({
							type: "AddSuperCash",
							superCashNum: parseInt(this.superCash)
						}),
						this.superCash = 0;
					var a = cc.Camera.findCamera(e.target).getWorldToCameraPoint(e.target.parent.convertToWorldSpaceAR(e.target));
					this.publishEvent({
						type: "ShowAddCoinAct",
						cashType: 2,
						start: a
					})
				}
			},
			btnUpgradeClick: function () {
				Music.play("SFX_Popup General");
				var e = null;
				this.minerBranch == i.EnumMinerBranch.Seam ? e = "Seam" : this.minerBranch == i.EnumMinerBranch.Elevator ? e = "Elevator" : this.minerBranch == i.EnumMinerBranch.StoreHouse && (e = "StoreHouse"),
					Analysis.sendEvent({
						type: "Upgrade" + e + "Click"
					}),
					this.level += this.limitLevel,
					this.labelLevel.string = this.level.toString(),
					this.level >= this.endLevel && this.publishEvent({
						type: "Add" + e + "SuperCash",
						minerId: this.minerId,
						cashNum: parseInt(this.cashNum)
					}),
					this.publishEvent({
						type: "LevelUp" + e,
						minerId: this.minerId,
						addLevel: this.limitLevel
					}),
					this.publishEvent({
						type: "SpendCash",
						cashNum: this.money.toNumber()
					}),
					this.publishEvent({
						type: "CheckBottleNeck",
						target: this
					})
			},
			onCashChanged: function (e) {
				this.requestLevelData()
			},
			onUseSaleManager: function (e) {
				e.minerBranch == this.minerBranch && e.minerId == this.minerId && this.requestLevelData()
			},
			onLevelUpModeChanged: function (e) {
				this.requestLevelData()
			},
			onLevelUpBtnUpgrade: function (e) {
				e.minerBranch == this.minerBranch && e.minerId == this.minerId && (this.labelLevel.string = this.level.toString(), this.publishEvent({
					type: "CheckBottleNeck",
					target: this
				}))
			},
			onCheckBottleNeck: function (e) {
				this.checkBottleNeck()
			}
		}),
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent",
		NumberData: "NumberData",
		PrisonerManager: "PrisonerManager"
	}],
	ButtonUnclickableAudio: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "58504WGYb1B1YiF0GNooge9", "ButtonUnclickableAudio"),
			cc.Class({
				extends: cc.Component,
				editor: {
					menu: "Extensions/ButtonUnclickableAudio",
					requireComponent: cc.Button
				},
				properties: {},
				onLoad: function () {
					var e = this;
					this.button = this.node.getComponent(cc.Button),
						this.node.on(cc.Node.EventType.TOUCH_START,
							function () {
								e.button.interactable || Music.play("SFX_Button Unclickable")
							},
							this)
				}
			}),
			cc._RF.pop()
	},
	{}],
	ByteDanceAd: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "a09259CjUtCTIT3kuvmowDf", "ByteDanceAd"),
			cc.Class({
				extends: e("BaseAd"),
				properties: {
					BANNER_ID: "2bac95j31mb21h3j2k",
					VIDEO_ID: "2348fg8ad9hk94gmd6"
				},
				showBanner: function (e) {
					var t = this;
					if (this.bottomBannerAd && this.bottomBannerAd.destroy(), this.bottomBannerAd = tt.createBannerAd({
						adUnitId: this.BANNER_ID,
						style: {
							left: 0,
							top: 704,
							width: 1e3
						}
					}), this.bottomBannerAd) {
						this.bottomBannerAd.onLoad(function () {
							return console.log("\u5e95\u90e8banner \u5e7f\u544a\u52a0\u8f7d\u6210\u529f")
						}),
							this.bottomBannerAd.onError(function (t) {
								cc.error(t),
									console.log("Banner \u9519\u8bef\uff0c\u65e0\u5e7f\u544a\u8fd4\u56de"),
									e.fail && e.fail()
							}),
							this.bottomBannerAd.show().then(function () {
								e.success && e.success(100 / tt.getSystemInfoSync().windowHeight),
									console.log("\u5e95\u90e8banner \u5e7f\u544a\u663e\u793a")
							}).
								catch(function (e) {
									cc.error(e)
								}),
							this.bottomBannerAd.onResize(function (a) {
								switch (t.bottomBannerAd.style.left = (tt.getSystemInfoSync().windowWidth - a.width) / 2, t.bottomBannerAd.style.width = 1 * tt.getSystemInfoSync().windowWidth, e.position) {
									case "top":
										t.bottomBannerAd.style.top = 0;
										break;
									case "bottom":
										t.bottomBannerAd.style.top = tt.getSystemInfoSync().windowHeight - 100 + 1;
										break;
									case "middle":
										t.bottomBannerAd.style.top = tt.getSystemInfoSync().windowHeight * e.marginTop
								}
							})
					} else console.log("Banner \u65e0\u5e7f\u544a\u8fd4\u56de"),
						e.fail && e.fail()
				},
				updateBannerStyle: function (e) {
					if (this.bottomBannerAd) switch (e.position) {
						case "top":
							this.bottomBannerAd.style.top = 0;
							break;
						case "bottom":
							this.bottomBannerAd.style.top = tt.getSystemInfoSync().windowHeight - this.bottomBannerAd.style.realHeight + 1;
							break;
						case "middle":
							this.bottomBannerAd.style.top = tt.getSystemInfoSync().windowHeight * e.marginTop
					}
				},
				closeBanner: function () {
					this.bottomBannerAd && (this.bottomBannerAd.destroy(), this.bottomBannerAd = null)
				},
				showVideo: function (e) {
					var t = tt.createRewardedVideoAd({
						adUnitId: this.VIDEO_ID
					});
					if (t) {
						var a = function a(n) {
							AudioHandler.playBGM(),
								n && n.isEnded || void 0 === n ? e.success && e.success() : e.abort && e.abort(),
								t.offClose(a),
								t.offError(i)
						};
						t.load().then(function () {
							t.show(),
								AudioHandler.stopBGM()
						}).
							catch(function (e) {
								return cc.error(e.errMsg)
							}),
							t.onClose(a);
						var i = function i(n) {
							cc.warn("Video Error \u65e0\u5e7f\u544a\u8fd4\u56de", n),
								e.fail && e.fail(),
								t.offClose(a),
								t.offError(i)
						};
						t.onError(i)
					} else cc.warn("Video \u65e0\u5e7f\u544a\u8fd4\u56de"),
						e.fail && e.fail()
				}
			}),
			cc._RF.pop()
	},
	{
		BaseAd: "BaseAd"
	}],
	ByteDanceDataStore: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "05dd0kqXNxIK5fK86/X0d9p", "ByteDanceDataStore"),
			cc.Class({
				extends: e("BaseDataStore")
			}),
			cc._RF.pop()
	},
	{
		BaseDataStore: "BaseDataStore"
	}],
	ByteDanceErrorHandler: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "b9843J+7MpEsptSaS/zURYr", "ByteDanceErrorHandler"),
			cc.Class({
				extends: e("BaseErrorHandler")
			}),
			cc._RF.pop()
	},
	{
		BaseErrorHandler: "BaseErrorHandler"
	}],
	ByteDancePlatform: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "05968p1IudKrrRDalBE/Myo", "ByteDancePlatform"),
			cc.Class({
				extends: e("BasePlatform"),
				init: function () {
					var e = this;["login", "getLaunchOptionsSync", "showLoading", "hideLoading", "shareAppMessage", "showToast", "postMessage", "getOpenDataContext", "setUserCloudStorage", "getUserCloudStorage", "createGameClubButton", "showShareMenu", "onShareAppMessage", "navigateToMiniProgram", "previewImage", "createShortCut", "openCustomerServiceConversation", "onShow", "onHide", "vibrateShort", "getSystemInfoSync", "request", "exit"].forEach(function (t) {
						e[t] = function (e) {
							if (e || (e = {}), "function" == typeof tt[t]) return tt[t](e);
							cc.warn("[ByteDancePlatform] \u65b9\u6cd5" + t + "\u672a\u5b9e\u73b0"),
								"function" == typeof e.fail && e.fail()
						}
					})
				}
			}),
			cc._RF.pop()
	},
	{
		BasePlatform: "BasePlatform"
	}],
	1: [function (e, t, a) {
		"use strict";
		a.byteLength = function (e) {
			var t = l(e),
				a = t[0],
				i = t[1];
			return 3 * (a + i) / 4 - i
		},
			a.toByteArray = function (e) {
				for (var t, a = l(e), i = a[0], o = a[1], s = new r(d(e, i, o)), c = 0, h = o > 0 ? i - 4 : i, u = 0; u < h; u += 4) t = n[e.charCodeAt(u)] << 18 | n[e.charCodeAt(u + 1)] << 12 | n[e.charCodeAt(u + 2)] << 6 | n[e.charCodeAt(u + 3)],
					s[c++] = t >> 16 & 255,
					s[c++] = t >> 8 & 255,
					s[c++] = 255 & t;
				2 === o && (t = n[e.charCodeAt(u)] << 2 | n[e.charCodeAt(u + 1)] >> 4, s[c++] = 255 & t);
				1 === o && (t = n[e.charCodeAt(u)] << 10 | n[e.charCodeAt(u + 1)] << 4 | n[e.charCodeAt(u + 2)] >> 2, s[c++] = t >> 8 & 255, s[c++] = 255 & t);
				return s
			},
			a.fromByteArray = function (e) {
				for (var t, a = e.length,
					n = a % 3,
					r = [], o = 0, s = a - n; o < s; o += 16383) r.push(u(e, o, o + 16383 > s ? s : o + 16383));
				1 === n ? (t = e[a - 1], r.push(i[t >> 2] + i[t << 4 & 63] + "==")) : 2 === n && (t = (e[a - 2] << 8) + e[a - 1], r.push(i[t >> 10] + i[t >> 4 & 63] + i[t << 2 & 63] + "="));
				return r.join("")
			};
		for (var i = [], n = [], r = "undefined" != typeof Uint8Array ? Uint8Array : Array, o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", s = 0, c = o.length; s < c; ++s) i[s] = o[s],
			n[o.charCodeAt(s)] = s;
		function l(e) {
			var t = e.length;
			if (t % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
			var a = e.indexOf("=");
			return - 1 === a && (a = t),
				[a, a === t ? 0 : 4 - a % 4]
		}
		function d(e, t, a) {
			return 3 * (t + a) / 4 - a
		}
		function h(e) {
			return i[e >> 18 & 63] + i[e >> 12 & 63] + i[e >> 6 & 63] + i[63 & e]
		}
		function u(e, t, a) {
			for (var i, n = [], r = t; r < a; r += 3) i = (e[r] << 16 & 16711680) + (e[r + 1] << 8 & 65280) + (255 & e[r + 2]),
				n.push(h(i));
			return n.join("")
		}
		n["-".charCodeAt(0)] = 62,
			n["_".charCodeAt(0)] = 63
	},
	{}],
	2: [function (e, t, a) {
		(function (t) {
			"use strict";
			var i = e("base64-js"),
				n = e("ieee754"),
				r = e("isarray");
			function o() {
				return c.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823
			}
			function s(e, t) {
				if (o() < t) throw new RangeError("Invalid typed array length");
				return c.TYPED_ARRAY_SUPPORT ? (e = new Uint8Array(t)).__proto__ = c.prototype : (null === e && (e = new c(t)), e.length = t),
					e
			}
			function c(e, t, a) {
				if (!(c.TYPED_ARRAY_SUPPORT || this instanceof c)) return new c(e, t, a);
				if ("number" == typeof e) {
					if ("string" == typeof t) throw new Error("If encoding is specified then the first argument must be a string");
					return u(this, e)
				}
				return l(this, e, t, a)
			}
			function l(e, t, a, i) {
				if ("number" == typeof t) throw new TypeError('"value" argument must not be a number');
				return "undefined" != typeof ArrayBuffer && t instanceof ArrayBuffer ? p(e, t, a, i) : "string" == typeof t ? m(e, t, a) : f(e, t)
			}
			function d(e) {
				if ("number" != typeof e) throw new TypeError('"size" argument must be a number');
				if (e < 0) throw new RangeError('"size" argument must not be negative')
			}
			function h(e, t, a, i) {
				return d(t),
					t <= 0 ? s(e, t) : void 0 !== a ? "string" == typeof i ? s(e, t).fill(a, i) : s(e, t).fill(a) : s(e, t)
			}
			function u(e, t) {
				if (d(t), e = s(e, t < 0 ? 0 : 0 | v(t)), !c.TYPED_ARRAY_SUPPORT) for (var a = 0; a < t; ++a) e[a] = 0;
				return e
			}
			function m(e, t, a) {
				if ("string" == typeof a && "" !== a || (a = "utf8"), !c.isEncoding(a)) throw new TypeError('"encoding" must be a valid string encoding');
				var i = 0 | _(t, a),
					n = (e = s(e, i)).write(t, a);
				return n !== i && (e = e.slice(0, n)),
					e
			}
			function g(e, t) {
				var a = t.length < 0 ? 0 : 0 | v(t.length);
				e = s(e, a);
				for (var i = 0; i < a; i += 1) e[i] = 255 & t[i];
				return e
			}
			function p(e, t, a, i) {
				if (t.byteLength, a < 0 || t.byteLength < a) throw new RangeError("'offset' is out of bounds");
				if (t.byteLength < a + (i || 0)) throw new RangeError("'length' is out of bounds");
				return t = void 0 === a && void 0 === i ? new Uint8Array(t) : void 0 === i ? new Uint8Array(t, a) : new Uint8Array(t, a, i),
					c.TYPED_ARRAY_SUPPORT ? (e = t).__proto__ = c.prototype : e = g(e, t),
					e
			}
			function f(e, t) {
				if (c.isBuffer(t)) {
					var a = 0 | v(t.length);
					return 0 === (e = s(e, a)).length ? e : (t.copy(e, 0, 0, a), e)
				}
				if (t) {
					if ("undefined" != typeof ArrayBuffer && t.buffer instanceof ArrayBuffer || "length" in t) return "number" != typeof t.length || $(t.length) ? s(e, 0) : g(e, t);
					if ("Buffer" === t.type && r(t.data)) return g(e, t.data)
				}
				throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")
			}
			function v(e) {
				if (e >= o()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + o().toString(16) + " bytes");
				return 0 | e
			}
			function _(e, t) {
				if (c.isBuffer(e)) return e.length;
				if ("undefined" != typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && (ArrayBuffer.isView(e) || e instanceof ArrayBuffer)) return e.byteLength;
				"string" != typeof e && (e = "" + e);
				var a = e.length;
				if (0 === a) return 0;
				for (var i = !1; ;) switch (t) {
					case "ascii":
					case "latin1":
					case "binary":
						return a;
					case "utf8":
					case "utf-8":
					case void 0:
						return K(e).length;
					case "ucs2":
					case "ucs-2":
					case "utf16le":
					case "utf-16le":
						return 2 * a;
					case "hex":
						return a >>> 1;
					case "base64":
						return Y(e).length;
					default:
						if (i) return K(e).length;
						t = ("" + t).toLowerCase(),
							i = !0
				}
			}
			function y(e, t, a) {
				var i = !1;
				if ((void 0 === t || t < 0) && (t = 0), t > this.length) return "";
				if ((void 0 === a || a > this.length) && (a = this.length), a <= 0) return "";
				if ((a >>>= 0) <= (t >>>= 0)) return "";
				for (e || (e = "utf8"); ;) switch (e) {
					case "hex":
						return P(this, t, a);
					case "utf8":
					case "utf-8":
						return T(this, t, a);
					case "ascii":
						return L(this, t, a);
					case "latin1":
					case "binary":
						return B(this, t, a);
					case "base64":
						return I(this, t, a);
					case "ucs2":
					case "ucs-2":
					case "utf16le":
					case "utf-16le":
						return F(this, t, a);
					default:
						if (i) throw new TypeError("Unknown encoding: " + e);
						e = (e + "").toLowerCase(),
							i = !0
				}
			}
			function b(e, t, a) {
				var i = e[t];
				e[t] = e[a],
					e[a] = i
			}
			function S(e, t, a, i, n) {
				if (0 === e.length) return - 1;
				if ("string" == typeof a ? (i = a, a = 0) : a > 2147483647 ? a = 2147483647 : a < -2147483648 && (a = -2147483648), a = +a, isNaN(a) && (a = n ? 0 : e.length - 1), a < 0 && (a = e.length + a), a >= e.length) {
					if (n) return - 1;
					a = e.length - 1
				} else if (a < 0) {
					if (!n) return - 1;
					a = 0
				}
				if ("string" == typeof t && (t = c.from(t, i)), c.isBuffer(t)) return 0 === t.length ? -1 : C(e, t, a, i, n);
				if ("number" == typeof t) return t &= 255,
					c.TYPED_ARRAY_SUPPORT && "function" == typeof Uint8Array.prototype.indexOf ? n ? Uint8Array.prototype.indexOf.call(e, t, a) : Uint8Array.prototype.lastIndexOf.call(e, t, a) : C(e, [t], a, i, n);
				throw new TypeError("val must be string, number or Buffer")
			}
			function C(e, t, a, i, n) {
				var r, o = 1,
					s = e.length,
					c = t.length;
				if (void 0 !== i && ("ucs2" === (i = String(i).toLowerCase()) || "ucs-2" === i || "utf16le" === i || "utf-16le" === i)) {
					if (e.length < 2 || t.length < 2) return - 1;
					o = 2,
						s /= 2,
						c /= 2,
						a /= 2
				}
				function l(e, t) {
					return 1 === o ? e[t] : e.readUInt16BE(t * o)
				}
				if (n) {
					var d = -1;
					for (r = a; r < s; r++) if (l(e, r) === l(t, -1 === d ? 0 : r - d)) {
						if (- 1 === d && (d = r), r - d + 1 === c) return d * o
					} else - 1 !== d && (r -= r - d),
						d = -1
				} else for (a + c > s && (a = s - c), r = a; r >= 0; r--) {
					for (var h = !0,
						u = 0; u < c; u++) if (l(e, r + u) !== l(t, u)) {
							h = !1;
							break
						}
					if (h) return r
				}
				return - 1
			}
			function D(e, t, a, i) {
				a = Number(a) || 0;
				var n = e.length - a;
				i ? (i = Number(i)) > n && (i = n) : i = n;
				var r = t.length;
				if (r % 2 != 0) throw new TypeError("Invalid hex string");
				i > r / 2 && (i = r / 2);
				for (var o = 0; o < i; ++o) {
					var s = parseInt(t.substr(2 * o, 2), 16);
					if (isNaN(s)) return o;
					e[a + o] = s
				}
				return o
			}
			function w(e, t, a, i) {
				return Q(K(t, e.length - a), e, a, i)
			}
			function A(e, t, a, i) {
				return Q(J(t), e, a, i)
			}
			function M(e, t, a, i) {
				return A(e, t, a, i)
			}
			function E(e, t, a, i) {
				return Q(Y(t), e, a, i)
			}
			function k(e, t, a, i) {
				return Q(Z(t, e.length - a), e, a, i)
			}
			function I(e, t, a) {
				return 0 === t && a === e.length ? i.fromByteArray(e) : i.fromByteArray(e.slice(t, a))
			}
			function T(e, t, a) {
				a = Math.min(e.length, a);
				for (var i = [], n = t; n < a;) {
					var r, o, s, c, l = e[n],
						d = null,
						h = l > 239 ? 4 : l > 223 ? 3 : l > 191 ? 2 : 1;
					if (n + h <= a) switch (h) {
						case 1:
							l < 128 && (d = l);
							break;
						case 2:
							128 == (192 & (r = e[n + 1])) && (c = (31 & l) << 6 | 63 & r) > 127 && (d = c);
							break;
						case 3:
							r = e[n + 1],
								o = e[n + 2],
								128 == (192 & r) && 128 == (192 & o) && (c = (15 & l) << 12 | (63 & r) << 6 | 63 & o) > 2047 && (c < 55296 || c > 57343) && (d = c);
							break;
						case 4:
							r = e[n + 1],
								o = e[n + 2],
								s = e[n + 3],
								128 == (192 & r) && 128 == (192 & o) && 128 == (192 & s) && (c = (15 & l) << 18 | (63 & r) << 12 | (63 & o) << 6 | 63 & s) > 65535 && c < 1114112 && (d = c)
					}
					null === d ? (d = 65533, h = 1) : d > 65535 && (d -= 65536, i.push(d >>> 10 & 1023 | 55296), d = 56320 | 1023 & d),
						i.push(d),
						n += h
				}
				return N(i)
			}
			a.Buffer = c,
				a.SlowBuffer = function (e) {
					+ e != e && (e = 0);
					return c.alloc(+ e)
				},
				a.INSPECT_MAX_BYTES = 50,
				c.TYPED_ARRAY_SUPPORT = void 0 !== t.TYPED_ARRAY_SUPPORT ? t.TYPED_ARRAY_SUPPORT : function () {
					try {
						var e = new Uint8Array(1);
						return e.__proto__ = {
							__proto__: Uint8Array.prototype,
							foo: function () {
								return 42
							}
						},
							42 === e.foo() && "function" == typeof e.subarray && 0 === e.subarray(1, 1).byteLength
					} catch (e) {
						return !1
					}
				}(),
				a.kMaxLength = o(),
				c.poolSize = 8192,
				c._augment = function (e) {
					return e.__proto__ = c.prototype,
						e
				},
				c.from = function (e, t, a) {
					return l(null, e, t, a)
				},
				c.TYPED_ARRAY_SUPPORT && (c.prototype.__proto__ = Uint8Array.prototype, c.__proto__ = Uint8Array, "undefined" != typeof Symbol && Symbol.species && c[Symbol.species] === c && Object.defineProperty(c, Symbol.species, {
					value: null,
					configurable: !0
				})),
				c.alloc = function (e, t, a) {
					return h(null, e, t, a)
				},
				c.allocUnsafe = function (e) {
					return u(null, e)
				},
				c.allocUnsafeSlow = function (e) {
					return u(null, e)
				},
				c.isBuffer = function (e) {
					return !(null == e || !e._isBuffer)
				},
				c.compare = function (e, t) {
					if (!c.isBuffer(e) || !c.isBuffer(t)) throw new TypeError("Arguments must be Buffers");
					if (e === t) return 0;
					for (var a = e.length,
						i = t.length,
						n = 0,
						r = Math.min(a, i); n < r; ++n) if (e[n] !== t[n]) {
							a = e[n],
								i = t[n];
							break
						}
					return a < i ? -1 : i < a ? 1 : 0
				},
				c.isEncoding = function (e) {
					switch (String(e).toLowerCase()) {
						case "hex":
						case "utf8":
						case "utf-8":
						case "ascii":
						case "latin1":
						case "binary":
						case "base64":
						case "ucs2":
						case "ucs-2":
						case "utf16le":
						case "utf-16le":
							return !0;
						default:
							return !1
					}
				},
				c.concat = function (e, t) {
					if (!r(e)) throw new TypeError('"list" argument must be an Array of Buffers');
					if (0 === e.length) return c.alloc(0);
					var a;
					if (void 0 === t) for (t = 0, a = 0; a < e.length; ++a) t += e[a].length;
					var i = c.allocUnsafe(t),
						n = 0;
					for (a = 0; a < e.length; ++a) {
						var o = e[a];
						if (!c.isBuffer(o)) throw new TypeError('"list" argument must be an Array of Buffers');
						o.copy(i, n),
							n += o.length
					}
					return i
				},
				c.byteLength = _,
				c.prototype._isBuffer = !0,
				c.prototype.swap16 = function () {
					var e = this.length;
					if (e % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
					for (var t = 0; t < e; t += 2) b(this, t, t + 1);
					return this
				},
				c.prototype.swap32 = function () {
					var e = this.length;
					if (e % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
					for (var t = 0; t < e; t += 4) b(this, t, t + 3),
						b(this, t + 1, t + 2);
					return this
				},
				c.prototype.swap64 = function () {
					var e = this.length;
					if (e % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
					for (var t = 0; t < e; t += 8) b(this, t, t + 7),
						b(this, t + 1, t + 6),
						b(this, t + 2, t + 5),
						b(this, t + 3, t + 4);
					return this
				},
				c.prototype.toString = function () {
					var e = 0 | this.length;
					return 0 === e ? "" : 0 === arguments.length ? T(this, 0, e) : y.apply(this, arguments)
				},
				c.prototype.equals = function (e) {
					if (!c.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
					return this === e || 0 === c.compare(this, e)
				},
				c.prototype.inspect = function () {
					var e = "",
						t = a.INSPECT_MAX_BYTES;
					return this.length > 0 && (e = this.toString("hex", 0, t).match(/.{2}/g).join(" "), this.length > t && (e += " ... ")),
						"<Buffer " + e + ">"
				},
				c.prototype.compare = function (e, t, a, i, n) {
					if (!c.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
					if (void 0 === t && (t = 0), void 0 === a && (a = e ? e.length : 0), void 0 === i && (i = 0), void 0 === n && (n = this.length), t < 0 || a > e.length || i < 0 || n > this.length) throw new RangeError("out of range index");
					if (i >= n && t >= a) return 0;
					if (i >= n) return - 1;
					if (t >= a) return 1;
					if (t >>>= 0, a >>>= 0, i >>>= 0, n >>>= 0, this === e) return 0;
					for (var r = n - i,
						o = a - t,
						s = Math.min(r, o), l = this.slice(i, n), d = e.slice(t, a), h = 0; h < s; ++h) if (l[h] !== d[h]) {
							r = l[h],
								o = d[h];
							break
						}
					return r < o ? -1 : o < r ? 1 : 0
				},
				c.prototype.includes = function (e, t, a) {
					return - 1 !== this.indexOf(e, t, a)
				},
				c.prototype.indexOf = function (e, t, a) {
					return S(this, e, t, a, !0)
				},
				c.prototype.lastIndexOf = function (e, t, a) {
					return S(this, e, t, a, !1)
				},
				c.prototype.write = function (e, t, a, i) {
					if (void 0 === t) i = "utf8",
						a = this.length,
						t = 0;
					else if (void 0 === a && "string" == typeof t) i = t,
						a = this.length,
						t = 0;
					else {
						if (!isFinite(t)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
						t |= 0,
							isFinite(a) ? (a |= 0, void 0 === i && (i = "utf8")) : (i = a, a = void 0)
					}
					var n = this.length - t;
					if ((void 0 === a || a > n) && (a = n), e.length > 0 && (a < 0 || t < 0) || t > this.length) throw new RangeError("Attempt to write outside buffer bounds");
					i || (i = "utf8");
					for (var r = !1; ;) switch (i) {
						case "hex":
							return D(this, e, t, a);
						case "utf8":
						case "utf-8":
							return w(this, e, t, a);
						case "ascii":
							return A(this, e, t, a);
						case "latin1":
						case "binary":
							return M(this, e, t, a);
						case "base64":
							return E(this, e, t, a);
						case "ucs2":
						case "ucs-2":
						case "utf16le":
						case "utf-16le":
							return k(this, e, t, a);
						default:
							if (r) throw new TypeError("Unknown encoding: " + i);
							i = ("" + i).toLowerCase(),
								r = !0
					}
				},
				c.prototype.toJSON = function () {
					return {
						type: "Buffer",
						data: Array.prototype.slice.call(this._arr || this, 0)
					}
				};
			var R = 4096;
			function N(e) {
				var t = e.length;
				if (t <= R) return String.fromCharCode.apply(String, e);
				for (var a = "",
					i = 0; i < t;) a += String.fromCharCode.apply(String, e.slice(i, i += R));
				return a
			}
			function L(e, t, a) {
				var i = "";
				a = Math.min(e.length, a);
				for (var n = t; n < a; ++n) i += String.fromCharCode(127 & e[n]);
				return i
			}
			function B(e, t, a) {
				var i = "";
				a = Math.min(e.length, a);
				for (var n = t; n < a; ++n) i += String.fromCharCode(e[n]);
				return i
			}
			function P(e, t, a) {
				var i = e.length; (!t || t < 0) && (t = 0),
					(!a || a < 0 || a > i) && (a = i);
				for (var n = "",
					r = t; r < a; ++r) n += X(e[r]);
				return n
			}
			function F(e, t, a) {
				for (var i = e.slice(t, a), n = "", r = 0; r < i.length; r += 2) n += String.fromCharCode(i[r] + 256 * i[r + 1]);
				return n
			}
			function x(e, t, a) {
				if (e % 1 != 0 || e < 0) throw new RangeError("offset is not uint");
				if (e + t > a) throw new RangeError("Trying to access beyond buffer length")
			}
			function U(e, t, a, i, n, r) {
				if (!c.isBuffer(e)) throw new TypeError('"buffer" argument must be a Buffer instance');
				if (t > n || t < r) throw new RangeError('"value" argument is out of bounds');
				if (a + i > e.length) throw new RangeError("Index out of range")
			}
			function V(e, t, a, i) {
				t < 0 && (t = 65535 + t + 1);
				for (var n = 0,
					r = Math.min(e.length - a, 2); n < r; ++n) e[a + n] = (t & 255 << 8 * (i ? n : 1 - n)) >>> 8 * (i ? n : 1 - n)
			}
			function O(e, t, a, i) {
				t < 0 && (t = 4294967295 + t + 1);
				for (var n = 0,
					r = Math.min(e.length - a, 4); n < r; ++n) e[a + n] = t >>> 8 * (i ? n : 3 - n) & 255
			}
			function G(e, t, a, i, n, r) {
				if (a + i > e.length) throw new RangeError("Index out of range");
				if (a < 0) throw new RangeError("Index out of range")
			}
			function H(e, t, a, i, r) {
				return r || G(e, 0, a, 4),
					n.write(e, t, a, i, 23, 4),
					a + 4
			}
			function W(e, t, a, i, r) {
				return r || G(e, 0, a, 8),
					n.write(e, t, a, i, 52, 8),
					a + 8
			}
			c.prototype.slice = function (e, t) {
				var a, i = this.length;
				if (e = ~~e, t = void 0 === t ? i : ~~t, e < 0 ? (e += i) < 0 && (e = 0) : e > i && (e = i), t < 0 ? (t += i) < 0 && (t = 0) : t > i && (t = i), t < e && (t = e), c.TYPED_ARRAY_SUPPORT) (a = this.subarray(e, t)).__proto__ = c.prototype;
				else {
					var n = t - e;
					a = new c(n, void 0);
					for (var r = 0; r < n; ++r) a[r] = this[r + e]
				}
				return a
			},
				c.prototype.readUIntLE = function (e, t, a) {
					e |= 0,
						t |= 0,
						a || x(e, t, this.length);
					for (var i = this[e], n = 1, r = 0; ++r < t && (n *= 256);) i += this[e + r] * n;
					return i
				},
				c.prototype.readUIntBE = function (e, t, a) {
					e |= 0,
						t |= 0,
						a || x(e, t, this.length);
					for (var i = this[e + --t], n = 1; t > 0 && (n *= 256);) i += this[e + --t] * n;
					return i
				},
				c.prototype.readUInt8 = function (e, t) {
					return t || x(e, 1, this.length),
						this[e]
				},
				c.prototype.readUInt16LE = function (e, t) {
					return t || x(e, 2, this.length),
						this[e] | this[e + 1] << 8
				},
				c.prototype.readUInt16BE = function (e, t) {
					return t || x(e, 2, this.length),
						this[e] << 8 | this[e + 1]
				},
				c.prototype.readUInt32LE = function (e, t) {
					return t || x(e, 4, this.length),
						(this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3]
				},
				c.prototype.readUInt32BE = function (e, t) {
					return t || x(e, 4, this.length),
						16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3])
				},
				c.prototype.readIntLE = function (e, t, a) {
					e |= 0,
						t |= 0,
						a || x(e, t, this.length);
					for (var i = this[e], n = 1, r = 0; ++r < t && (n *= 256);) i += this[e + r] * n;
					return i >= (n *= 128) && (i -= Math.pow(2, 8 * t)),
						i
				},
				c.prototype.readIntBE = function (e, t, a) {
					e |= 0,
						t |= 0,
						a || x(e, t, this.length);
					for (var i = t,
						n = 1,
						r = this[e + --i]; i > 0 && (n *= 256);) r += this[e + --i] * n;
					return r >= (n *= 128) && (r -= Math.pow(2, 8 * t)),
						r
				},
				c.prototype.readInt8 = function (e, t) {
					return t || x(e, 1, this.length),
						128 & this[e] ? -1 * (255 - this[e] + 1) : this[e]
				},
				c.prototype.readInt16LE = function (e, t) {
					t || x(e, 2, this.length);
					var a = this[e] | this[e + 1] << 8;
					return 32768 & a ? 4294901760 | a : a
				},
				c.prototype.readInt16BE = function (e, t) {
					t || x(e, 2, this.length);
					var a = this[e + 1] | this[e] << 8;
					return 32768 & a ? 4294901760 | a : a
				},
				c.prototype.readInt32LE = function (e, t) {
					return t || x(e, 4, this.length),
						this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24
				},
				c.prototype.readInt32BE = function (e, t) {
					return t || x(e, 4, this.length),
						this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]
				},
				c.prototype.readFloatLE = function (e, t) {
					return t || x(e, 4, this.length),
						n.read(this, e, !0, 23, 4)
				},
				c.prototype.readFloatBE = function (e, t) {
					return t || x(e, 4, this.length),
						n.read(this, e, !1, 23, 4)
				},
				c.prototype.readDoubleLE = function (e, t) {
					return t || x(e, 8, this.length),
						n.read(this, e, !0, 52, 8)
				},
				c.prototype.readDoubleBE = function (e, t) {
					return t || x(e, 8, this.length),
						n.read(this, e, !1, 52, 8)
				},
				c.prototype.writeUIntLE = function (e, t, a, i) {
					(e = +e, t |= 0, a |= 0, i) || U(this, e, t, a, Math.pow(2, 8 * a) - 1, 0);
					var n = 1,
						r = 0;
					for (this[t] = 255 & e; ++r < a && (n *= 256);) this[t + r] = e / n & 255;
					return t + a
				},
				c.prototype.writeUIntBE = function (e, t, a, i) {
					(e = +e, t |= 0, a |= 0, i) || U(this, e, t, a, Math.pow(2, 8 * a) - 1, 0);
					var n = a - 1,
						r = 1;
					for (this[t + n] = 255 & e; --n >= 0 && (r *= 256);) this[t + n] = e / r & 255;
					return t + a
				},
				c.prototype.writeUInt8 = function (e, t, a) {
					return e = +e,
						t |= 0,
						a || U(this, e, t, 1, 255, 0),
						c.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)),
						this[t] = 255 & e,
						t + 1
				},
				c.prototype.writeUInt16LE = function (e, t, a) {
					return e = +e,
						t |= 0,
						a || U(this, e, t, 2, 65535, 0),
						c.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8) : V(this, e, t, !0),
						t + 2
				},
				c.prototype.writeUInt16BE = function (e, t, a) {
					return e = +e,
						t |= 0,
						a || U(this, e, t, 2, 65535, 0),
						c.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, this[t + 1] = 255 & e) : V(this, e, t, !1),
						t + 2
				},
				c.prototype.writeUInt32LE = function (e, t, a) {
					return e = +e,
						t |= 0,
						a || U(this, e, t, 4, 4294967295, 0),
						c.TYPED_ARRAY_SUPPORT ? (this[t + 3] = e >>> 24, this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = 255 & e) : O(this, e, t, !0),
						t + 4
				},
				c.prototype.writeUInt32BE = function (e, t, a) {
					return e = +e,
						t |= 0,
						a || U(this, e, t, 4, 4294967295, 0),
						c.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e) : O(this, e, t, !1),
						t + 4
				},
				c.prototype.writeIntLE = function (e, t, a, i) {
					if (e = +e, t |= 0, !i) {
						var n = Math.pow(2, 8 * a - 1);
						U(this, e, t, a, n - 1, -n)
					}
					var r = 0,
						o = 1,
						s = 0;
					for (this[t] = 255 & e; ++r < a && (o *= 256);) e < 0 && 0 === s && 0 !== this[t + r - 1] && (s = 1),
						this[t + r] = (e / o >> 0) - s & 255;
					return t + a
				},
				c.prototype.writeIntBE = function (e, t, a, i) {
					if (e = +e, t |= 0, !i) {
						var n = Math.pow(2, 8 * a - 1);
						U(this, e, t, a, n - 1, -n)
					}
					var r = a - 1,
						o = 1,
						s = 0;
					for (this[t + r] = 255 & e; --r >= 0 && (o *= 256);) e < 0 && 0 === s && 0 !== this[t + r + 1] && (s = 1),
						this[t + r] = (e / o >> 0) - s & 255;
					return t + a
				},
				c.prototype.writeInt8 = function (e, t, a) {
					return e = +e,
						t |= 0,
						a || U(this, e, t, 1, 127, -128),
						c.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)),
						e < 0 && (e = 255 + e + 1),
						this[t] = 255 & e,
						t + 1
				},
				c.prototype.writeInt16LE = function (e, t, a) {
					return e = +e,
						t |= 0,
						a || U(this, e, t, 2, 32767, -32768),
						c.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8) : V(this, e, t, !0),
						t + 2
				},
				c.prototype.writeInt16BE = function (e, t, a) {
					return e = +e,
						t |= 0,
						a || U(this, e, t, 2, 32767, -32768),
						c.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, this[t + 1] = 255 & e) : V(this, e, t, !1),
						t + 2
				},
				c.prototype.writeInt32LE = function (e, t, a) {
					return e = +e,
						t |= 0,
						a || U(this, e, t, 4, 2147483647, -2147483648),
						c.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24) : O(this, e, t, !0),
						t + 4
				},
				c.prototype.writeInt32BE = function (e, t, a) {
					return e = +e,
						t |= 0,
						a || U(this, e, t, 4, 2147483647, -2147483648),
						e < 0 && (e = 4294967295 + e + 1),
						c.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e) : O(this, e, t, !1),
						t + 4
				},
				c.prototype.writeFloatLE = function (e, t, a) {
					return H(this, e, t, !0, a)
				},
				c.prototype.writeFloatBE = function (e, t, a) {
					return H(this, e, t, !1, a)
				},
				c.prototype.writeDoubleLE = function (e, t, a) {
					return W(this, e, t, !0, a)
				},
				c.prototype.writeDoubleBE = function (e, t, a) {
					return W(this, e, t, !1, a)
				},
				c.prototype.copy = function (e, t, a, i) {
					if (a || (a = 0), i || 0 === i || (i = this.length), t >= e.length && (t = e.length), t || (t = 0), i > 0 && i < a && (i = a), i === a) return 0;
					if (0 === e.length || 0 === this.length) return 0;
					if (t < 0) throw new RangeError("targetStart out of bounds");
					if (a < 0 || a >= this.length) throw new RangeError("sourceStart out of bounds");
					if (i < 0) throw new RangeError("sourceEnd out of bounds");
					i > this.length && (i = this.length),
						e.length - t < i - a && (i = e.length - t + a);
					var n, r = i - a;
					if (this === e && a < t && t < i) for (n = r - 1; n >= 0; --n) e[n + t] = this[n + a];
					else if (r < 1e3 || !c.TYPED_ARRAY_SUPPORT) for (n = 0; n < r; ++n) e[n + t] = this[n + a];
					else Uint8Array.prototype.set.call(e, this.subarray(a, a + r), t);
					return r
				},
				c.prototype.fill = function (e, t, a, i) {
					if ("string" == typeof e) {
						if ("string" == typeof t ? (i = t, t = 0, a = this.length) : "string" == typeof a && (i = a, a = this.length), 1 === e.length) {
							var n = e.charCodeAt(0);
							n < 256 && (e = n)
						}
						if (void 0 !== i && "string" != typeof i) throw new TypeError("encoding must be a string");
						if ("string" == typeof i && !c.isEncoding(i)) throw new TypeError("Unknown encoding: " + i)
					} else "number" == typeof e && (e &= 255);
					if (t < 0 || this.length < t || this.length < a) throw new RangeError("Out of range index");
					if (a <= t) return this;
					var r;
					if (t >>>= 0, a = void 0 === a ? this.length : a >>> 0, e || (e = 0), "number" == typeof e) for (r = t; r < a; ++r) this[r] = e;
					else {
						var o = c.isBuffer(e) ? e : K(new c(e, i).toString()),
							s = o.length;
						for (r = 0; r < a - t; ++r) this[r + t] = o[r % s]
					}
					return this
				};
			var q = /[^+\/0-9A-Za-z-_]/g;
			function j(e) {
				if ((e = z(e).replace(q, "")).length < 2) return "";
				for (; e.length % 4 != 0;) e += "=";
				return e
			}
			function z(e) {
				return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "")
			}
			function X(e) {
				return e < 16 ? "0" + e.toString(16) : e.toString(16)
			}
			function K(e, t) {
				var a;
				t = t || 1 / 0;
				for (var i = e.length,
					n = null,
					r = [], o = 0; o < i; ++o) {
					if ((a = e.charCodeAt(o)) > 55295 && a < 57344) {
						if (!n) {
							if (a > 56319) {
								(t -= 3) > -1 && r.push(239, 191, 189);
								continue
							}
							if (o + 1 === i) {
								(t -= 3) > -1 && r.push(239, 191, 189);
								continue
							}
							n = a;
							continue
						}
						if (a < 56320) {
							(t -= 3) > -1 && r.push(239, 191, 189),
								n = a;
							continue
						}
						a = 65536 + (n - 55296 << 10 | a - 56320)
					} else n && (t -= 3) > -1 && r.push(239, 191, 189);
					if (n = null, a < 128) {
						if ((t -= 1) < 0) break;
						r.push(a)
					} else if (a < 2048) {
						if ((t -= 2) < 0) break;
						r.push(a >> 6 | 192, 63 & a | 128)
					} else if (a < 65536) {
						if ((t -= 3) < 0) break;
						r.push(a >> 12 | 224, a >> 6 & 63 | 128, 63 & a | 128)
					} else {
						if (!(a < 1114112)) throw new Error("Invalid code point");
						if ((t -= 4) < 0) break;
						r.push(a >> 18 | 240, a >> 12 & 63 | 128, a >> 6 & 63 | 128, 63 & a | 128)
					}
				}
				return r
			}
			function J(e) {
				for (var t = [], a = 0; a < e.length; ++a) t.push(255 & e.charCodeAt(a));
				return t
			}
			function Z(e, t) {
				for (var a, i, n, r = [], o = 0; o < e.length && !((t -= 2) < 0); ++o) i = (a = e.charCodeAt(o)) >> 8,
					n = a % 256,
					r.push(n),
					r.push(i);
				return r
			}
			function Y(e) {
				return i.toByteArray(j(e))
			}
			function Q(e, t, a, i) {
				for (var n = 0; n < i && !(n + a >= t.length || n >= e.length); ++n) t[n + a] = e[n];
				return n
			}
			function $(e) {
				return e != e
			}
		}).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
	},
	{
		"base64-js": 1,
		ieee754: 5,
		isarray: 3
	}],
	3: [function (e, t, a) {
		var i = {}.toString;
		t.exports = Array.isArray ||
			function (e) {
				return "[object Array]" == i.call(e)
			}
	},
	{}],
	4: [function (e, t, a) {
		t.exports = {
			O_RDONLY: 0,
			O_WRONLY: 1,
			O_RDWR: 2,
			S_IFMT: 61440,
			S_IFREG: 32768,
			S_IFDIR: 16384,
			S_IFCHR: 8192,
			S_IFBLK: 24576,
			S_IFIFO: 4096,
			S_IFLNK: 40960,
			S_IFSOCK: 49152,
			O_CREAT: 512,
			O_EXCL: 2048,
			O_NOCTTY: 131072,
			O_TRUNC: 1024,
			O_APPEND: 8,
			O_DIRECTORY: 1048576,
			O_NOFOLLOW: 256,
			O_SYNC: 128,
			O_SYMLINK: 2097152,
			O_NONBLOCK: 4,
			S_IRWXU: 448,
			S_IRUSR: 256,
			S_IWUSR: 128,
			S_IXUSR: 64,
			S_IRWXG: 56,
			S_IRGRP: 32,
			S_IWGRP: 16,
			S_IXGRP: 8,
			S_IRWXO: 7,
			S_IROTH: 4,
			S_IWOTH: 2,
			S_IXOTH: 1,
			E2BIG: 7,
			EACCES: 13,
			EADDRINUSE: 48,
			EADDRNOTAVAIL: 49,
			EAFNOSUPPORT: 47,
			EAGAIN: 35,
			EALREADY: 37,
			EBADF: 9,
			EBADMSG: 94,
			EBUSY: 16,
			ECANCELED: 89,
			ECHILD: 10,
			ECONNABORTED: 53,
			ECONNREFUSED: 61,
			ECONNRESET: 54,
			EDEADLK: 11,
			EDESTADDRREQ: 39,
			EDOM: 33,
			EDQUOT: 69,
			EEXIST: 17,
			EFAULT: 14,
			EFBIG: 27,
			EHOSTUNREACH: 65,
			EIDRM: 90,
			EILSEQ: 92,
			EINPROGRESS: 36,
			EINTR: 4,
			EINVAL: 22,
			EIO: 5,
			EISCONN: 56,
			EISDIR: 21,
			ELOOP: 62,
			EMFILE: 24,
			EMLINK: 31,
			EMSGSIZE: 40,
			EMULTIHOP: 95,
			ENAMETOOLONG: 63,
			ENETDOWN: 50,
			ENETRESET: 52,
			ENETUNREACH: 51,
			ENFILE: 23,
			ENOBUFS: 55,
			ENODATA: 96,
			ENODEV: 19,
			ENOENT: 2,
			ENOEXEC: 8,
			ENOLCK: 77,
			ENOLINK: 97,
			ENOMEM: 12,
			ENOMSG: 91,
			ENOPROTOOPT: 42,
			ENOSPC: 28,
			ENOSR: 98,
			ENOSTR: 99,
			ENOSYS: 78,
			ENOTCONN: 57,
			ENOTDIR: 20,
			ENOTEMPTY: 66,
			ENOTSOCK: 38,
			ENOTSUP: 45,
			ENOTTY: 25,
			ENXIO: 6,
			EOPNOTSUPP: 102,
			EOVERFLOW: 84,
			EPERM: 1,
			EPIPE: 32,
			EPROTO: 100,
			EPROTONOSUPPORT: 43,
			EPROTOTYPE: 41,
			ERANGE: 34,
			EROFS: 30,
			ESPIPE: 29,
			ESRCH: 3,
			ESTALE: 70,
			ETIME: 101,
			ETIMEDOUT: 60,
			ETXTBSY: 26,
			EWOULDBLOCK: 35,
			EXDEV: 18,
			SIGHUP: 1,
			SIGINT: 2,
			SIGQUIT: 3,
			SIGILL: 4,
			SIGTRAP: 5,
			SIGABRT: 6,
			SIGIOT: 6,
			SIGBUS: 10,
			SIGFPE: 8,
			SIGKILL: 9,
			SIGUSR1: 30,
			SIGSEGV: 11,
			SIGUSR2: 31,
			SIGPIPE: 13,
			SIGALRM: 14,
			SIGTERM: 15,
			SIGCHLD: 20,
			SIGCONT: 19,
			SIGSTOP: 17,
			SIGTSTP: 18,
			SIGTTIN: 21,
			SIGTTOU: 22,
			SIGURG: 16,
			SIGXCPU: 24,
			SIGXFSZ: 25,
			SIGVTALRM: 26,
			SIGPROF: 27,
			SIGWINCH: 28,
			SIGIO: 23,
			SIGSYS: 12,
			SSL_OP_ALL: 2147486719,
			SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION: 262144,
			SSL_OP_CIPHER_SERVER_PREFERENCE: 4194304,
			SSL_OP_CISCO_ANYCONNECT: 32768,
			SSL_OP_COOKIE_EXCHANGE: 8192,
			SSL_OP_CRYPTOPRO_TLSEXT_BUG: 2147483648,
			SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS: 2048,
			SSL_OP_EPHEMERAL_RSA: 0,
			SSL_OP_LEGACY_SERVER_CONNECT: 4,
			SSL_OP_MICROSOFT_BIG_SSLV3_BUFFER: 32,
			SSL_OP_MICROSOFT_SESS_ID_BUG: 1,
			SSL_OP_MSIE_SSLV2_RSA_PADDING: 0,
			SSL_OP_NETSCAPE_CA_DN_BUG: 536870912,
			SSL_OP_NETSCAPE_CHALLENGE_BUG: 2,
			SSL_OP_NETSCAPE_DEMO_CIPHER_CHANGE_BUG: 1073741824,
			SSL_OP_NETSCAPE_REUSE_CIPHER_CHANGE_BUG: 8,
			SSL_OP_NO_COMPRESSION: 131072,
			SSL_OP_NO_QUERY_MTU: 4096,
			SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION: 65536,
			SSL_OP_NO_SSLv2: 16777216,
			SSL_OP_NO_SSLv3: 33554432,
			SSL_OP_NO_TICKET: 16384,
			SSL_OP_NO_TLSv1: 67108864,
			SSL_OP_NO_TLSv1_1: 268435456,
			SSL_OP_NO_TLSv1_2: 134217728,
			SSL_OP_PKCS1_CHECK_1: 0,
			SSL_OP_PKCS1_CHECK_2: 0,
			SSL_OP_SINGLE_DH_USE: 1048576,
			SSL_OP_SINGLE_ECDH_USE: 524288,
			SSL_OP_SSLEAY_080_CLIENT_DH_BUG: 128,
			SSL_OP_SSLREF2_REUSE_CERT_TYPE_BUG: 0,
			SSL_OP_TLS_BLOCK_PADDING_BUG: 512,
			SSL_OP_TLS_D5_BUG: 256,
			SSL_OP_TLS_ROLLBACK_BUG: 8388608,
			ENGINE_METHOD_DSA: 2,
			ENGINE_METHOD_DH: 4,
			ENGINE_METHOD_RAND: 8,
			ENGINE_METHOD_ECDH: 16,
			ENGINE_METHOD_ECDSA: 32,
			ENGINE_METHOD_CIPHERS: 64,
			ENGINE_METHOD_DIGESTS: 128,
			ENGINE_METHOD_STORE: 256,
			ENGINE_METHOD_PKEY_METHS: 512,
			ENGINE_METHOD_PKEY_ASN1_METHS: 1024,
			ENGINE_METHOD_ALL: 65535,
			ENGINE_METHOD_NONE: 0,
			DH_CHECK_P_NOT_SAFE_PRIME: 2,
			DH_CHECK_P_NOT_PRIME: 1,
			DH_UNABLE_TO_CHECK_GENERATOR: 4,
			DH_NOT_SUITABLE_GENERATOR: 8,
			NPN_ENABLED: 1,
			RSA_PKCS1_PADDING: 1,
			RSA_SSLV23_PADDING: 2,
			RSA_NO_PADDING: 3,
			RSA_PKCS1_OAEP_PADDING: 4,
			RSA_X931_PADDING: 5,
			RSA_PKCS1_PSS_PADDING: 6,
			POINT_CONVERSION_COMPRESSED: 2,
			POINT_CONVERSION_UNCOMPRESSED: 4,
			POINT_CONVERSION_HYBRID: 6,
			F_OK: 0,
			R_OK: 4,
			W_OK: 2,
			X_OK: 1,
			UV_UDP_REUSEADDR: 4
		}
	},
	{}],
	5: [function (e, t, a) {
		a.read = function (e, t, a, i, n) {
			var r, o, s = 8 * n - i - 1,
				c = (1 << s) - 1,
				l = c >> 1,
				d = -7,
				h = a ? n - 1 : 0,
				u = a ? -1 : 1,
				m = e[t + h];
			for (h += u, r = m & (1 << -d) - 1, m >>= -d, d += s; d > 0; r = 256 * r + e[t + h], h += u, d -= 8);
			for (o = r & (1 << -d) - 1, r >>= -d, d += i; d > 0; o = 256 * o + e[t + h], h += u, d -= 8);
			if (0 === r) r = 1 - l;
			else {
				if (r === c) return o ? NaN : 1 / 0 * (m ? -1 : 1);
				o += Math.pow(2, i),
					r -= l
			}
			return (m ? -1 : 1) * o * Math.pow(2, r - i)
		},
			a.write = function (e, t, a, i, n, r) {
				var o, s, c, l = 8 * r - n - 1,
					d = (1 << l) - 1,
					h = d >> 1,
					u = 23 === n ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
					m = i ? 0 : r - 1,
					g = i ? 1 : -1,
					p = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;
				for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (s = isNaN(t) ? 1 : 0, o = d) : (o = Math.floor(Math.log(t) / Math.LN2), t * (c = Math.pow(2, -o)) < 1 && (o--, c *= 2), (t += o + h >= 1 ? u / c : u * Math.pow(2, 1 - h)) * c >= 2 && (o++, c /= 2), o + h >= d ? (s = 0, o = d) : o + h >= 1 ? (s = (t * c - 1) * Math.pow(2, n), o += h) : (s = t * Math.pow(2, h - 1) * Math.pow(2, n), o = 0)); n >= 8; e[a + m] = 255 & s, m += g, s /= 256, n -= 8);
				for (o = o << n | s, l += n; l > 0; e[a + m] = 255 & o, m += g, o /= 256, l -= 8);
				e[a + m - g] |= 128 * p
			}
	},
	{}],
	Cabin: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "31903fNg3xF9qIo0jKCbv8n", "Cabin"),
			cc.Class({
				extends: e("EasyEvent"),
				properties: {
					gold: cc.Sprite,
					worker: cc.Node,
					logicPos: {
						default:
							cc.v2(0, 0)
					}
				},
				onLoad: function () {
					this.commonData = UserData.getMineDataRef("Common");
					var t = e("NumberData");
					this.mineNum = new t(0),
						this.totalLength = 170,
						this.progress = 0
				},
				start: function () {
					var e = this;
					this.worker.opacity = this.commonData.initStep >= 1 ? 255 : 0,
						this.gold.y = this.totalLength * this.progress,
						this.gold.fillStart = 1 - this.progress,
						this.gold.fillEnd = 1,
						this.scheduleOnce(function () {
							e.changeSkin("mouth_smile", "default", "mouth_laugh")
						},
							.01)
				},
				setGoldProgress: function (e) {
					this.gold.node.y = this.totalLength * e,
						this.gold.fillStart = 1 - e,
						this.gold.fillEnd = 1
				},
				setMineMax: function (e) {
					this.maxNum = e;
					var t = this.mineNum.ratio(this.maxNum);
					this.progress = t >= 1 ? 1 : t
				},
				refreshProgress: function (e) {
					var t = this;
					if (e >= .2) {
						this.oldProgress = this.progress;
						var a = this.tmpNum.ratio(this.maxNum);
						this.progress = a >= 1 ? 1 : a;
						var i = e / .1,
							n = (this.progress - this.oldProgress) / i,
							r = e / i;
						this.gold.node.runAction(cc.sequence(cc.repeat(cc.sequence(cc.delayTime(r), cc.callFunc(function () {
							t.oldProgress += n,
								t.setGoldProgress(t.oldProgress)
						})), i), cc.callFunc(function () {
							t.mineNum = t.tmpNum
						})))
					} else {
						var o = this.tmpNum.ratio(this.maxNum);
						this.progress = o >= 1 ? 1 : o,
							this.setGoldProgress(this.progress),
							this.mineNum = this.tmpNum
					}
				},
				addMineNum: function (e, t) {
					this.tmpNum = this.mineNum.clone().add(e),
						this.refreshProgress(t)
				},
				removeMineNum: function (e, t) {
					this.tmpNum = this.mineNum.clone().remove(e),
						this.refreshProgress(t)
				},
				mineIsFull: function () {
					return this.progress >= 1
				},
				changeSkin: function (e, t) {
					var a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null,
						i = this.worker.getComponent(sp.Skeleton),
						n = i.findSlot(e),
						r = i.skeletonData.getRuntimeData(),
						o = r.findSlotIndex(e),
						s = r.findSkin(t).getAttachment(o, a);
					n.setAttachment(s)
				},
				onInitStepMoveForward: function (e) {
					e.currentStep >= 1 && (this.worker.opacity = e.currentStep >= 1 ? 255 : 0)
				}
			}),
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent",
		NumberData: "NumberData"
	}],
	CashAddListViewItem: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "c1487Kd/oZOS4llKkHynAZa", "CashAddListViewItem"),
			cc.Class({
				extends: e("EasyEvent").declareEvent("GetSignItem", "ShowAddCoinAct"),
				properties: {
					bgSprite: cc.Sprite,
					label: cc.Label,
					getNode: cc.Node,
					lockNode: cc.Node,
					watchNode: cc.Node,
					bgSpriteFrames: [cc.SpriteFrame]
				},
				start: function () { },
				updateData: function (e) {
					this.data = e,
						this.label.string = e.cash,
						this.getNode.active = !1,
						this.lockNode.active = !1,
						this.watchNode.active = !1,
						UserData.GameData.CashAdd.get < e.indexId ? (this.lockNode.active = !0, this.bgSprite.spriteFrame = this.bgSpriteFrames[0]) : UserData.GameData.CashAdd.get == e.indexId ? (this.watchNode.active = !0, this.bgSprite.spriteFrame = this.bgSpriteFrames[1]) : UserData.GameData.CashAdd.get > e.indexId && (this.getNode.active = !0, this.bgSprite.spriteFrame = this.bgSpriteFrames[2])
				}
			}),
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent"
	}],
	CfgApi: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "18420olAs5OQ4RVJGXhwexm", "CfgApi"),
			window.CfgApi = {
				_moduleCfg: null,
				init: function () {
					this._moduleCfg = e("Cfg_headers")
				},
				get: function (e) {
					var t = this._moduleCfg["Cfg_" + e];
					if (!t) return cc.error("CfgApi\u914d\u7f6e\u8bfb\u53d6\u9519\u8bef: \u6a21\u5757\u4e0d\u5b58\u5728, cfgName:%s ", e),
						null;
					t = t.data || t;
					for (var a = e,
						i = arguments.length,
						n = Array(i > 1 ? i - 1 : 0), r = 1; r < i; r++) n[r - 1] = arguments[r];
					for (var o = 0; o < n.length; o++) if (a += "." + n[o], void 0 === (t = t[n[o]])) return cc.error("CfgApi\u914d\u7f6e\u8bfb\u53d6\u9519\u8bef:", e, "\u8868\u7f3a\u5c11", a, " \u7684\u914d\u7f6e."),
						t;
					return t
				}
			},
			window.CfgApi.init(),
			cc._RF.pop()
	},
	{
		Cfg_headers: "Cfg_headers"
	}],
	CfgMgr: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "965f0MvQDtAmJBBmuM1Yfc1", "CfgMgr");
		var i = e("NumberData"),
			n = e("PrisonerManager");
		window.CfgMgr = {
			Common: {
				getIdleRate: function () {
					return CfgApi.get("GameConst").idle_rate
				},
				getImmediateCashPrice: function () {
					return CfgApi.get("GameConst").immediate_cash_price
				}
			},
			Mine: {
				getMineConfig: function (e) {
					return e = e || UserData.GameData.CurrentMine,
						CfgApi.get("AllMines", e)
				},
				getPrestigeConfig: function (e, t) {
					return e > 5 ? null : (t = t || UserData.GameData.CurrentMine, CfgApi.get("Prestige", t, e))
				},
				getAbilityRate: function (e, t) {
					t = t || UserData.GameData.CurrentMine;
					return 0 == e ? CfgMgr.Mine.getMineConfig(t).ability_rate : CfgMgr.Mine.getPrestigeConfig(e, t).ability_rate
				}
			},
			Seam: {
				upgradeConsumeCache: {},
				workerAbilityCache: {},
				_calcRangeRate: function (e, t) {
					for (var a = void 0,
						i = 0; i < t.length; i++) {
						var n = t[i].split("-")[0],
							r = t[i].split("-")[1];
						if (!(e >= n)) break;
						a = r
					}
					return a
				},
				getSuperCashUnlockMinConsume: function () {
					return CfgApi.get("GameConst").buy_mine_cost_min
				},
				getSuperCashUnlockMaxConsume: function () {
					return CfgApi.get("GameConst").buy_mine_cost_max
				},
				getWorkerSpeedByLevel: function (e) {
					var t = 2,
						a = CfgApi.get("SeamMoveSpeed");
					for (var i in a) e >= i && (t = a[i].move_speed);
					return t
				},
				getWorkerMoveDistance: function (e) {
					return 2 + e * CfgApi.get("GameConst").mine_length_increase
				},
				getWorkerMoveDur: function (e) {
					return this.getWorkerMoveDistance(e) / this.getWorkerSpeedByLevel(e)
				},
				getUnlockTime: function (e) {
					var t = CfgApi.get("SeamMine", 1, e);
					return t && t.unlock_time || 0
				},
				getUnlockConsume: function (e, t) {
					t = t || UserData.GameData.CurrentMine;
					var a = CfgApi.get("SeamMine", 1, e),
						n = CfgMgr.Mine.getMineConfig(t).spend_rate;
					return new i(a.unlock_consume || 0).mult(n)
				},
				getMaxLevel: function () {
					return CfgApi.get("GameConst").miner_lv_up
				},
				getWorkerNumByLevel: function (e) {
					var t = 1,
						a = CfgApi.get("SeamWorkerNum");
					for (var i in a) e >= i && (t = a[i].worker_num);
					return t
				},
				getWorkerBaseAbility: function (e) {
					return CfgApi.get("SeamMine", 1, e).ability
				},
				getWorkerAbility: function (e, t, a, n) {
					this.workerAbilityCache[e] || (this.workerAbilityCache[e] = {}),
						a = a || UserData.GameData.CurrentMine,
						n = n || UserData.getMineDataRef("Prestige", a).time;
					var r = CfgMgr.Mine.getAbilityRate(n, a),
						o = void 0,
						s = CfgApi.get("SeamMine", 1, e),
						c = 1;
					o = new i(s.ability);
					for (var l = t; l > 0; l--) if (this.workerAbilityCache[e][l]) {
						c = l,
							o = new i(this.workerAbilityCache[e][c]);
						break
					}
					if (this.workerAbilityCache[e][t]) o = new i(this.workerAbilityCache[e][t]);
					else {
						var d = void 0;
						for (l = c; l <= t; l++) this.workerAbilityCache[e][l] ? o = new i(this.workerAbilityCache[e][l]) : (d = this._calcRangeRate(l, s.ability_rate), l > 1 && o.mult(d), this.workerAbilityCache[e][l] = o.toNumber())
					}
					var h = CfgApi.get("SeamPowerUp");
					for (var u in h) t >= u && o.mult(h[u].ability_rate);
					return o.mult(r),
						o
				},
				getExcavateTime: function () {
					var e = CfgApi.get("GameConst");
					return parseInt(e.excavate_time)
				},
				getUpgradeConsume: function (e, t, a, n) {
					n = n || UserData.GameData.CurrentMine,
						this.upgradeConsumeCache[n] || (this.upgradeConsumeCache[n] = {}),
						this.upgradeConsumeCache[n][a] || (this.upgradeConsumeCache[n][a] = {});
					var r = this.upgradeConsumeCache[n][a],
						o = CfgMgr.Mine.getMineConfig(n).spend_rate,
						s = new i(0);
					if (t < 1 || t < e || e < 0) return s;
					var c = CfgApi.get("SeamMine", 1, a);
					if (!c) return s;
					var l = void 0,
						d = new i(c.upgrade_consume);
					if (r[e]) d = new i(r[e]);
					else for (var h = 2; h <= e; h++) l = this._calcRangeRate(h, c.consume_rate),
						d.mult(l).mult(o),
						r[h] || (r[h] = d.toNumber());
					for (h = e + 1; h <= t; h++) l = this._calcRangeRate(h, c.consume_rate),
						1 == h ? s.add(d.mult(o)) : s.add(d.mult(l).mult(o)),
						r[h] || (r[h] = d.toNumber());
					return s.length < 3 && s.floor(),
						s
				},
				getLevelRange: function (e, t) {
					for (var a = {
						cashNum: 2,
						startLevel: 1,
						endLevel: 1
					},
						i = CfgApi.get("SeamMine", 1, t), n = 0; n < i.reward_stage.length; n++) {
						var r = i.reward_stage[n].split("-");
						if (!(e >= r[0])) {
							a.endLevel = r[0],
								a.cashNum = r[1];
							break
						}
						a.startLevel = r[0]
					}
					return a
				},
				getRewardOfRange: function (e, t, a) {
					e = parseInt(e);
					var i = 0,
						n = CfgApi.get("SeamMine", 1, t),
						r = void 0;
					r = a ? n.reward_stage_reborn : n.reward_stage;
					for (var o = 0; o < r.length; o++) {
						var s = r[o].split("-");
						if (!(e >= s[0])) break;
						i += parseInt(s[1])
					}
					return i
				},
				getMaxLevelAbleGradeTo: function (e, t, a, n, r) {
					n = n || 1,
						r = r || UserData.GameData.CurrentMine,
						this.upgradeConsumeCache[r] || (this.upgradeConsumeCache[r] = {}),
						this.upgradeConsumeCache[r][t] || (this.upgradeConsumeCache[r][t] = {});
					for (var o = this.upgradeConsumeCache[r][t], s = CfgMgr.Mine.getMineConfig(r).spend_rate, c = CfgApi.get("SeamMine", 1, t), l = this.getMaxLevel(), d = this.getUpgradeConsume(e - 1, e, t), h = new i(0), u = e, m = !0; a.compare(h) >= 0;) {
						if (++u > l) {
							m = !1;
							break
						}
						o[u] ? d = new i(o[u]) : (d.mult(this._calcRangeRate(u, c.consume_rate)).mult(s), o[u] = d.toNumber()),
							h.add(d.clone().mult(n))
					}
					return u--,
						m && h.remove(d.clone().mult(n)),
						u == e && (h = d.clone().mult(n), u++),
					{
						consume: h,
						levelUp: u - e,
						maxLevel: u
					}
				},
				getSpeedNextUpgradeLevel: function (e) {
					var t = e,
						a = CfgApi.get("SeamMoveSpeed");
					for (var i in a) if (e < i) {
						t = i;
						break
					}
					return t
				},
				getWorkerNumNextUpgradeLevel: function (e) {
					var t = e,
						a = CfgApi.get("SeamWorkerNum");
					for (var i in a) if (e < i) {
						t = i;
						break
					}
					return t
				}
			},
			Elevator: {
				freightMap: {},
				getVariable: function () {
					return {
						mine: UserData.GameData.CurrentMine,
						freightRate: 1,
						freightSpeedRate: 1,
						moveSpeedRate: 1,
						consumeRate: 1
					}
				},
				getElevatorFreight: function (e, t) {
					var a = (t = t || this.getVariable()).mine;
					this.freightMap[a] || (this.freightMap[a] = [], this.freightMap[a][0] = CfgApi.get("ElevatorOverview", a.toString()).carry);
					var n = void 0;
					if (e < this.freightMap[a].length) n = new i(this.freightMap[a][e]);
					else {
						n = new i(this.freightMap[a][this.freightMap[a].length - 1]);
						var r = CfgApi.get("ElevatorPowerCoefficient"),
							o = CfgApi.get("ElevatorPowerUp"),
							s = Object.keys(r);
						s.sort(function (e, t) {
							return r[e].lv < r[t].lv ? -1 : 1
						});
						for (var c = 1,
							l = s.length - 1; l >= 0; --l) if (this.freightMap[a].length - 1 >= r[s[l]].lv) {
								c = r[s[l]].rate;
								break
							}
						for (var d = this.freightMap[a].length; d <= e; ++d) {
							var h = o[d] ? o[d].rate : 1;
							c = r[d] ? r[d].rate : c,
								n.mult(c * h),
								this.freightMap[a][d] = n.toNumber()
						}
					}
					return n.mult(CfgMgr.Mine.getAbilityRate(UserData.getMineDataRef("Prestige", a).time, a)),
						n.mult(t.freightRate),
						n
				},
				getOnceFreight: function (e, t, a, i) {
					var n = this.getElevatorFreight(e, i).remove(t);
					return n.compare(a) > 0 ? a : n
				},
				getFreightSpeed: function (e, t) {
					return t = t || this.getVariable(),
						this.getElevatorFreight(e, t).divi(CfgApi.get("GameConst", "elevator_load_time")).mult(t.freightSpeedRate)
				},
				getOnceFreightTime: function (e, t, a) {
					var i = this.getFreightSpeed(e, a);
					return t.clone().divi(i).toFloat()
				},
				getFreightTime: function (e, t) {
					var a = this.getElevatorFreight(e, t),
						i = this.getFreightSpeed(e, t);
					return a.divi(i).toFloat()
				},
				getTotalPower: function (e, t, a) {
					var i = this.getElevatorFreight(e, a),
						n = this.getFreightTime(e, a),
						r = this.getMoveTime(e, t, a);
					return i.divi(2 * n + r)
				},
				getHeight: function (e) {
					var t = parseFloat(CfgApi.get("GameConst").elevator_height);
					return parseFloat(CfgApi.get("GameConst").miner_height) * e + t
				},
				getMoveSpeed: function (e, t) {
					var a = (t = t || this.getVariable()).mine,
						i = CfgApi.get("ElevatorOverview", a.toString()).speed;
					if (1 != e) for (var n = CfgApi.get("ElevatorSpeed"), r = 0, o = 1; o < e; ++o) i += r = n[o] ? n[o].rate : r;
					return i *= t.moveSpeedRate
				},
				getMoveTime: function (e, t, a) {
					return 2 * this.getHeight(t) / this.getMoveSpeed(e, a)
				},
				getUpgradeConsume: function (e, t, a) {
					var n = (a = a || this.getVariable()).mine;
					if (t < 1 || t < e || e < 0) return 0;
					for (var r = CfgApi.get("ElevatorOverview", n.toString()), o = CfgApi.get("ElevatorConsumeCoefficient"), s = void 0, c = new i(r.upgrade_consume), l = 1; l <= e; l++) s = o[l] ? o[l].rate : s,
						1 != l && c.mult(s);
					var d = new i(0);
					for (l = e + 1; l <= t; l++) s = o[l] ? o[l].rate : s,
						1 == l ? d.add(c) : d.add(c.mult(s));
					return d.mult(a.consumeRate),
						d.length < 3 && d.floor(),
						d
				},
				getMaxLevel: function () {
					return parseInt(CfgApi.get("GameConst", "elevator_lv_up"))
				},
				getUpMaxLevelAndConsume: function (e, t, a) {
					for (var n = (a = a || this.getVariable()).mine, r = CfgApi.get("ElevatorOverview", n), o = CfgApi.get("ElevatorConsumeCoefficient"), s = new i(r.upgrade_consume), c = void 0, l = 1; l <= e; l++) c = o[l] ? o[l].rate : c,
						1 != l && s.mult(c);
					var d = parseInt(CfgApi.get("GameConst", "elevator_lv_up")),
						h = e,
						u = new i(0);
					for (l = e + 1; l <= d; l++) {
						if (c = o[l] ? o[l].rate : c, 1 == l ? u.add(s) : u.add(s.mult(c)), !(t.compare(u.clone().mult(a.consumeRate)) >= 0)) {
							l == e + 1 ? h++ : u.remove(s);
							break
						}
						h++
					}
					return u.mult(a.consumeRate),
						u.length < 3 && u.floor(),
					{
						targetLevel: h,
						consume: u
					}
				},
				getLevelAdvancedRange: function (e, t) {
					var a = 0,
						i = 1,
						n = 1,
						r = !1;
					t = t || UserData.GameData.CurrentMine;
					for (var o = CfgApi.get("ElevatorOverview", t), s = UserData.getMineDataRef("Prestige", t).time ? o.reward_stage_reborn : o.reward_stage, c = 0; c < s.length; c++) {
						var l = s[c].split("-");
						if (e >= l[0] && (i = l[0]), e < l[0]) {
							n = l[0],
								a = l[1];
							break
						}
					}
					return 1 == n && (r = !0),
					{
						startLevel: i,
						endLevel: n,
						max: r,
						cashNum: a
					}
				},
				getUpgradeTargetLevelCashNum: function (e, t) {
					for (var a = 0,
						i = !1,
						n = 1,
						r = CfgApi.get("ElevatorOverview", UserData.GameData.CurrentMine), o = UserData.getMineDataRef("Prestige").time ? r.reward_stage_reborn : r.reward_stage, s = 0; s < o.length; s++) {
						var c = o[s].split("-");
						e >= n && e < c[0] && (i = !0),
							i && c[0] <= t && (a += parseInt(c[1])),
							n = c[0]
					}
					return a
				}
			},
			StoreHouse: {
				getTotalTransportationNumByLevel: function (e, t, a, i, n) {
					var r = e.clone().divi(a),
						o = 2 * CfgApi.get("StoreOverview", n, "len") / i;
					return e.mult(t).divi(r.mult(2).add(o))
				},
				getWorkNumAdvancedRange: function (e) {
					var t = CfgApi.get("StoreWorkerNum"),
						a = 1,
						i = 1,
						n = !1;
					for (var r in t) if (t.hasOwnProperty(r) && (e >= parseInt(r) && (a = parseInt(r)), e < parseInt(r))) {
						i = parseInt(r);
						break
					}
					return 1 == i && (n = !0),
					{
						startLevel: a,
						endLevel: i,
						max: n
					}
				},
				getLevelAdvancedRange: function (e) {
					for (var t = 0,
						a = 1,
						i = 1,
						n = !1,
						r = CfgApi.get("StoreOverview", UserData.GameData.CurrentMine), o = UserData.getMineDataRef("Prestige").time ? r.reward_stage_reborn : r.reward_stage, s = 0; s < o.length; s++) {
						var c = o[s].split("-");
						if (e >= c[0] && (a = c[0]), e < c[0]) {
							i = c[0],
								t = c[1];
							break
						}
					}
					return 1 == i && (n = !0),
					{
						startLevel: a,
						endLevel: i,
						max: n,
						cashNum: t
					}
				},
				getUpgradeTargetLevelCashNum: function (e, t) {
					for (var a = 0,
						i = !1,
						n = 1,
						r = CfgApi.get("StoreOverview", UserData.GameData.CurrentMine), o = UserData.getMineDataRef("Prestige").time ? r.reward_stage_reborn : r.reward_stage, s = 0; s < o.length; s++) {
						var c = o[s].split("-");
						e >= n && e < c[0] && (i = !0),
							i && c[0] <= t && (a += parseInt(c[1])),
							n = c[0]
					}
					return a
				},
				getMoveSpeedAdvancedRange: function (e) {
					var t = CfgApi.get("StoreMoveSpeed"),
						a = 1,
						i = 1,
						n = !1;
					for (var r in t) if (t.hasOwnProperty(r) && (e >= parseInt(r) && (a = parseInt(r)), e < parseInt(r))) {
						i = parseInt(r);
						break
					}
					return 1 == i && (n = !0),
					{
						startLevel: a,
						endLevel: i,
						max: n
					}
				},
				getMoveTime: function (e) {
					return 2 * CfgApi.get("StoreOverview", UserData.GameData.CurrentMine, "len") / e
				},
				getStoreWorkerNum: function (e) {
					var t = CfgApi.get("StoreWorkerNum"),
						a = 1;
					for (var i in t) if (t.hasOwnProperty(i)) {
						var n = t[i];
						if (e < parseInt(i)) return a;
						a = n.num
					}
					return a
				},
				getPowerConsumeCoe: function (e) {
					var t = CfgApi.get("StorePowerCoefficient"),
						a = t[1].rate;
					return Object.keys(t).map(function (i) {
						if (i > e) return a;
						a = t[i].rate
					}),
						a
				},
				getPerTransport: function (e) {
					var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1,
						a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0,
						n = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 1,
						r = arguments.length > 4 && void 0 !== arguments[4] && arguments[4];
					1 == t && (a = CfgApi.get("StoreOverview", n).carry);
					for (var o = new i(a), s = a, c = CfgApi.get("StorePowerCoefficient"), l = this.getPowerConsumeCoe(e), d = CfgApi.get("StorePowerUp"), h = void 0, u = t; u <= e; u++) l = c[u] ? c[u].rate : l,
						h = d[u] ? d[u].rate : 1,
						o = o.mult(l * h),
						s = s * l * h;
					if (r) return o;
					var m = UserData.getMineDataRef("Prestige", n),
						g = CfgMgr.Mine.getAbilityRate(m.time, n);
					return o.mult(g)
				},
				getLoadingSpeed: function (e, t) {
					return e.divi(t)
				},
				getLoadingTime: function () {
					return parseInt(CfgApi.get("GameConst", "storehouse_load_time"))
				},
				getMoveSpeed: function (e) {
					var t = CfgApi.get("StoreMoveSpeed"),
						a = 0;
					for (var i in t) t.hasOwnProperty(i) && i <= e && (a = t[i].speed);
					return a
				},
				getUpgradeConsumeCoe: function (e) {
					var t = CfgApi.get("StoreConsumeCoefficient"),
						a = t[1].rate;
					return Object.keys(t).map(function (i) {
						if (i > e) return a;
						a = t[i].rate
					}),
						a
				},
				getUpgradeNeedCoin: function (e) {
					for (var t = CfgApi.get("StoreOverview", UserData.GameData.CurrentMine, "upgrade_consume"), a = new i(t), n = CfgApi.get("StoreConsumeCoefficient"), r = this.getUpgradeConsumeCoe(e), o = 1; o <= e; o++) r = n[o] ? n[o].rate : r,
						a = a.mult(r);
					return a.length < 3 && a.floor(),
						a
				},
				getUpgradeToLevelNeedCoin: function (e, t, a) {
					for (var n = new i(a), r = new i(0), o = CfgApi.get("StoreConsumeCoefficient"), s = this.getUpgradeConsumeCoe(e), c = e + 1; c <= t; c++) s = o[c] ? o[c].rate : s,
						n = n.mult(s),
						r.add(n);
					return r.length < 3 && r.floor(),
					{
						totalCoin: r,
						upgradeNum: n
					}
				},
				getUpgradeLimit: function (e, t, a) {
					for (var n = new i(0), r = new i(t), o = new i(UserData.GameData.TotalCash), s = CfgApi.get("StoreConsumeCoefficient"), c = this.getUpgradeConsumeCoe(e), l = e + 1, d = l; d <= this.getStoreHouseMaxLevel() && (c = s[d] ? s[d].rate : c, r = r.mult(c), n.add(r), !(n.clone().mult(a).compare(o) > 0)); d++);
					var h = d;
					return h > l && (h -= 1) != this.getStoreHouseMaxLevel() && n.remove(r),
						n.length < 3 && n.floor(),
					{
						level: h,
						coin: n
					}
				},
				getStoreHouseMaxLevel: function () {
					return CfgApi.get("GameConst", "storehouse_lv_up")
				}
			},
			Manager: {
				getManagerIndexByBranch: function (e, t) {
					var a = CfgApi.get("ManagerFixedRecruit");
					if (t <= Object.keys(a).length) {
						if (e == n.EnumMinerBranch.Seam) return a[t].miner_manager;
						if (e == n.EnumMinerBranch.Elevator) return a[t].elevator_manager;
						if (e == n.EnumMinerBranch.StoreHouse) return a[t].storehouse_manager
					}
					var i = CfgApi.get("Manager"),
						r = [],
						o = 0;
					for (var s in i) i[s].range == e && (r.push(i[s]), o += i[s].weight);
					for (var c = Math.floor(Math.random() * o), l = 0, d = 0, h = 0; h < r.length; h++) if (c < (d += r[h].weight)) {
						l = h;
						break
					}
					return r[l].id
				},
				getManagerDataById: function (e) {
					return CfgApi.get("Manager", e)
				},
				getManagerUpgradeBaseVal: function (e) {
					var t = CfgApi.get("ManagerRecruitCost");
					return e == n.EnumMinerBranch.Seam ? t[1].miner_rate : e == n.EnumMinerBranch.Elevator ? t[1].elevator_rate : e == n.EnumMinerBranch.StoreHouse ? t[1].storehouse_rate : void 0
				},
				getManagerCostCoin: function (e, t, a) {
					for (var r = t,
						o = t + a,
						s = CfgApi.get("ManagerRecruitCost"), c = new i(this.getManagerUpgradeBaseVal(e)), l = new i(0), d = 1, h = 1; h <= o; h++) e == n.EnumMinerBranch.Seam ? d = s[h] ? s[h].miner_rate : d : e == n.EnumMinerBranch.Elevator ? d = s[h] ? s[h].elevator_rate : d : e == n.EnumMinerBranch.StoreHouse && (d = s[h] ? s[h].storehouse_rate : d),
							1 != h && (c = c.mult(d)),
							h > r && l.add(c);
					return l
				},
				getManagerCostLimit: function (e, t) {
					for (var a = t + 1,
						r = CfgApi.get("ManagerRecruitCost"), o = new i(0), s = new i(0), c = 1, l = new i(UserData.GameData.TotalCash), d = 1; s.compare(l) < 0;) {
						if (e == n.EnumMinerBranch.Seam ? c = r[d] ? r[d].miner_rate : c : e == n.EnumMinerBranch.Elevator ? c = r[d] ? r[d].elevator_rate : c : e == n.EnumMinerBranch.StoreHouse && (c = r[d] ? r[d].storehouse_rate : c), d <= a) o = 1 == d ? o.add(c) : o.mult(c),
							1 == d && s.add(o);
						else {
							var h = o.mult(c);
							s.add(h)
						}
						d++
					}
					var u = d - a - 1,
						m = s;
					return 1 == u ? (u = 1, m = o.divi(c)) : m = s.remove(o),
					{
						count: u,
						money: m
					}
				},
				getRandManagerName: function () {
					var e = parseInt(CfgApi.get("GameConst", "surname_num")),
						t = parseInt(CfgApi.get("GameConst", "name_num"));
					return CfgApi.get("ManagerName", Math.floor(Math.random() * (e - 2)) + 1).surname + " " + CfgApi.get("ManagerName", Math.floor(Math.random() * (t - 2) + 1)).name
				},
				getQualityStr: function (e) {
					return 1 == e ? Language.getName("Junior") : 2 == e ? Language.getName("Senior") : 3 == e ? Language.getName("Executive") : ""
				},
				getQualityLabelColor: function (e) {
					return 1 == e ? cc.color("#057BFF") : 2 == e ? cc.color("#0AA32F") : 3 == e ? cc.color("#B62EDB") : ""
				},
				getPropertyName: function (e, t) {
					return 1 == e ? "x" + t + Language.getName(" Walking Speed \nBoost") : 2 == e ? "x" + t + Language.getName(" Mining Speed \nBoost") : 3 == e ? "-" + 100 * t + "% " + Language.getName("Upgrade Cost") : 4 == e ? "x" + t + " " + Language.getName("Movement Speed \nBoost") : 5 == e ? "x" + t + " " + Language.getName("Loading Speed \nBoost") : 6 == e ? "-" + 100 * t + "% " + Language.getName("Upgrade Cost") : 7 == e ? "x" + t + " " + Language.getName("Loading Expansion") : 8 == e ? "x" + t + Language.getName(" Walking Speed \nBoost") : 9 == e ? "x" + t + " " + Language.getName("Loading Speed \nBoost") : 10 == e ? "-" + 100 * t + "% " + Language.getName("Upgrade Cost") : 11 == e ? "x" + t + " " + Language.getName("Loading Expansion") : ""
				},
				getPropertyIcon: function (e) {
					var t = 1;
					return 1 == e ? t = 5 : 2 == e ? t = 3 : 3 == e ? t = 4 : 4 == e ? t = 5 : 5 == e ? t = 2 : 6 == e ? t = 4 : 7 == e ? t = 1 : 8 == e ? t = 5 : 9 == e ? t = 2 : 10 == e ? t = 4 : 11 == e && (t = 1),
						"texture/managerEffectIcon/ManagerEffect" + t
				}
			}
		},
			cc._RF.pop()
	},
	{
		NumberData: "NumberData",
		PrisonerManager: "PrisonerManager"
	}],
	Cfg_AllMines: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "300d12i0NlOZIIaHvezmKBh", "Cfg_AllMines"),
			t.exports = {
				data: {
					1: {
						miner: 1,
						ability_rate: 1,
						spend_rate: 1,
						unlock_currency: 1,
						unlock_spend: "0",
						init_currency_type: 1,
						init_currency: 10,
						name: "miner_name_1"
					},
					2: {
						miner: 2,
						ability_rate: 3,
						spend_rate: 1,
						unlock_currency: 1,
						unlock_spend: "7.68e+19",
						init_currency_type: 1,
						init_currency: 10,
						name: "miner_name_2"
					},
					3: {
						miner: 3,
						ability_rate: 6,
						spend_rate: 1,
						unlock_currency: 1,
						unlock_spend: "6.14e+24",
						init_currency_type: 1,
						init_currency: 10,
						name: "miner_name_3"
					},
					4: {
						miner: 4,
						ability_rate: 10,
						spend_rate: 1,
						unlock_currency: 1,
						unlock_spend: "3.68e+29",
						init_currency_type: 1,
						init_currency: 10,
						name: "miner_name_4"
					},
					5: {
						miner: 5,
						ability_rate: 14,
						spend_rate: 1,
						unlock_currency: 1,
						unlock_spend: "4.19e+35",
						init_currency_type: 1,
						init_currency: 10,
						name: "miner_name_5"
					},
					6: {
						miner: 6,
						ability_rate: 1,
						spend_rate: 1.2,
						unlock_currency: 1,
						unlock_spend: "7.37e+36",
						init_currency_type: 2,
						init_currency: 12,
						name: "miner_name_6"
					},
					7: {
						miner: 7,
						ability_rate: 3,
						spend_rate: 1.2,
						unlock_currency: 2,
						unlock_spend: "4.6e+20",
						init_currency_type: 2,
						init_currency: 12,
						name: "miner_name_7"
					},
					8: {
						miner: 8,
						ability_rate: 6,
						spend_rate: 1.2,
						unlock_currency: 2,
						unlock_spend: "5.89e+25",
						init_currency_type: 2,
						init_currency: 12,
						name: "miner_name_8"
					},
					9: {
						miner: 9,
						ability_rate: 10,
						spend_rate: 1.2,
						unlock_currency: 2,
						unlock_spend: "3.24e+30",
						init_currency_type: 2,
						init_currency: 12,
						name: "miner_name_9"
					},
					10: {
						miner: 10,
						ability_rate: 14,
						spend_rate: 1.2,
						unlock_currency: 2,
						unlock_spend: "4.12e+36",
						init_currency_type: 2,
						init_currency: 12,
						name: "miner_name_10"
					},
					11: {
						miner: 11,
						ability_rate: 1,
						spend_rate: 1.5,
						unlock_currency: 2,
						unlock_spend: "1.59e+38",
						init_currency_type: 3,
						init_currency: 15,
						name: "miner_name_11"
					},
					12: {
						miner: 12,
						ability_rate: 3,
						spend_rate: 1.5,
						unlock_currency: 3,
						unlock_spend: "1.72e+21",
						init_currency_type: 3,
						init_currency: 15,
						name: "miner_name_12"
					},
					13: {
						miner: 13,
						ability_rate: 6,
						spend_rate: 1.5,
						unlock_currency: 3,
						unlock_spend: "1.47e+26",
						init_currency_type: 3,
						init_currency: 15,
						name: "miner_name_13"
					},
					14: {
						miner: 14,
						ability_rate: 10,
						spend_rate: 1.5,
						unlock_currency: 3,
						unlock_spend: "6.45e+30",
						init_currency_type: 3,
						init_currency: 15,
						name: "miner_name_14"
					},
					15: {
						miner: 15,
						ability_rate: 14,
						spend_rate: 1.5,
						unlock_currency: 3,
						unlock_spend: "7.37e+36",
						init_currency_type: 3,
						init_currency: 15,
						name: "miner_name_15"
					},
					16: {
						miner: 16,
						ability_rate: 1,
						spend_rate: 30,
						unlock_currency: 3,
						unlock_spend: "2.75e+38",
						init_currency_type: 4,
						init_currency: 300,
						name: "miner_name_16"
					},
					17: {
						miner: 17,
						ability_rate: 3,
						spend_rate: 30,
						unlock_currency: 4,
						unlock_spend: "2.3e+21",
						init_currency_type: 4,
						init_currency: 300,
						name: "miner_name_17"
					},
					18: {
						miner: 18,
						ability_rate: 6,
						spend_rate: 30,
						unlock_currency: 4,
						unlock_spend: "1.84e+26",
						init_currency_type: 4,
						init_currency: 300,
						name: "miner_name_18"
					},
					19: {
						miner: 19,
						ability_rate: 10,
						spend_rate: 30,
						unlock_currency: 4,
						unlock_spend: "7.37e+30",
						init_currency_type: 4,
						init_currency: 300,
						name: "miner_name_19"
					},
					20: {
						miner: 20,
						ability_rate: 14,
						spend_rate: 30,
						unlock_currency: 4,
						unlock_spend: "7.34e+36",
						init_currency_type: 4,
						init_currency: 300,
						name: "miner_name_20"
					}
				},
				check: {
					miner: {
						miner: "int",
						ability_rate: "float",
						spend_rate: "float",
						unlock_currency: "int",
						unlock_spend: "string",
						init_currency_type: "int",
						init_currency: "float",
						name: "string"
					}
				}
			},
			t.exports.protocol_version = "0.0.1",
			cc._RF.pop()
	},
	{}],
	Cfg_ElevatorConsumeCoefficient: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "b98ddz6+ctOgLhu1uvCNlqN", "Cfg_ElevatorConsumeCoefficient"),
			t.exports = {
				data: {
					1: {
						lv: 1,
						rate: 1
					},
					2: {
						lv: 2,
						rate: 1.2
					},
					21: {
						lv: 21,
						rate: 1.1293
					},
					601: {
						lv: 601,
						rate: 1.1393
					},
					801: {
						lv: 801,
						rate: 1.098
					}
				},
				check: {
					lv: {
						lv: "int",
						rate: "float"
					}
				}
			},
			t.exports.protocol_version = "0.0.1",
			cc._RF.pop()
	},
	{}],
	Cfg_ElevatorOverview: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "9cb66AyHDVHBYlnjDamMwGg", "Cfg_ElevatorOverview"),
			t.exports = {
				data: {
					1: {
						miner_type: 1,
						carry: 600,
						upgrade_type: 1,
						upgrade_consume: 400,
						speed: .5,
						reward_stage: ["10-15", "40-15", "80-15", "150-15", "250-15", "350-15", "450-15", "550-15", "650-15", "750-15", "850-15", "950-15", "1050-15", "1150-15", "1250-15", "1350-15", "1450-15", "1550-15", "1650-15", "1750-15", "1850-15", "1950-15", "2050-15", "2150-15", "2250-15", "2400-15"],
						reward_stage_reborn: ["10-5", "40-5", "80-5", "150-5", "250-5", "350-5", "450-5", "550-5", "650-5", "750-5", "850-5", "950-5", "1050-5", "1150-5", "1250-5", "1350-5", "1450-5", "1550-5", "1650-5", "1750-5", "1850-5", "1950-5", "2050-5", "2150-5", "2250-5", "2400-5"]
					},
					2: {
						miner_type: 2,
						carry: 600,
						upgrade_type: 1,
						upgrade_consume: 400,
						speed: .5,
						reward_stage: ["10-15", "40-15", "80-15", "150-15", "250-15", "350-15", "450-15", "550-15", "650-15", "750-15", "850-15", "950-15", "1050-15", "1150-15", "1250-15", "1350-15", "1450-15", "1550-15", "1650-15", "1750-15", "1850-15", "1950-15", "2050-15", "2150-15", "2250-15", "2400-15"],
						reward_stage_reborn: ["10-5", "40-5", "80-5", "150-5", "250-5", "350-5", "450-5", "550-5", "650-5", "750-5", "850-5", "950-5", "1050-5", "1150-5", "1250-5", "1350-5", "1450-5", "1550-5", "1650-5", "1750-5", "1850-5", "1950-5", "2050-5", "2150-5", "2250-5", "2400-5"]
					},
					3: {
						miner_type: 3,
						carry: 600,
						upgrade_type: 1,
						upgrade_consume: 400,
						speed: .5,
						reward_stage: ["10-15", "40-15", "80-15", "150-15", "250-15", "350-15", "450-15", "550-15", "650-15", "750-15", "850-15", "950-15", "1050-15", "1150-15", "1250-15", "1350-15", "1450-15", "1550-15", "1650-15", "1750-15", "1850-15", "1950-15", "2050-15", "2150-15", "2250-15", "2400-15"],
						reward_stage_reborn: ["10-5", "40-5", "80-5", "150-5", "250-5", "350-5", "450-5", "550-5", "650-5", "750-5", "850-5", "950-5", "1050-5", "1150-5", "1250-5", "1350-5", "1450-5", "1550-5", "1650-5", "1750-5", "1850-5", "1950-5", "2050-5", "2150-5", "2250-5", "2400-5"]
					},
					4: {
						miner_type: 4,
						carry: 600,
						upgrade_type: 1,
						upgrade_consume: 400,
						speed: .5,
						reward_stage: ["10-15", "40-15", "80-15", "150-15", "250-15", "350-15", "450-15", "550-15", "650-15", "750-15", "850-15", "950-15", "1050-15", "1150-15", "1250-15", "1350-15", "1450-15", "1550-15", "1650-15", "1750-15", "1850-15", "1950-15", "2050-15", "2150-15", "2250-15", "2400-15"],
						reward_stage_reborn: ["10-5", "40-5", "80-5", "150-5", "250-5", "350-5", "450-5", "550-5", "650-5", "750-5", "850-5", "950-5", "1050-5", "1150-5", "1250-5", "1350-5", "1450-5", "1550-5", "1650-5", "1750-5", "1850-5", "1950-5", "2050-5", "2150-5", "2250-5", "2400-5"]
					},
					5: {
						miner_type: 5,
						carry: 600,
						upgrade_type: 1,
						upgrade_consume: 400,
						speed: .5,
						reward_stage: ["10-15", "40-15", "80-15", "150-15", "250-15", "350-15", "450-15", "550-15", "650-15", "750-15", "850-15", "950-15", "1050-15", "1150-15", "1250-15", "1350-15", "1450-15", "1550-15", "1650-15", "1750-15", "1850-15", "1950-15", "2050-15", "2150-15", "2250-15", "2400-15"],
						reward_stage_reborn: ["10-5", "40-5", "80-5", "150-5", "250-5", "350-5", "450-5", "550-5", "650-5", "750-5", "850-5", "950-5", "1050-5", "1150-5", "1250-5", "1350-5", "1450-5", "1550-5", "1650-5", "1750-5", "1850-5", "1950-5", "2050-5", "2150-5", "2250-5", "2400-5"]
					},
					6: {
						miner_type: 6,
						carry: 600,
						upgrade_type: 2,
						upgrade_consume: 400,
						speed: .5,
						reward_stage: ["10-15", "40-15", "80-15", "150-15", "250-15", "350-15", "450-15", "550-15", "650-15", "750-15", "850-15", "950-15", "1050-15", "1150-15", "1250-15", "1350-15", "1450-15", "1550-15", "1650-15", "1750-15", "1850-15", "1950-15", "2050-15", "2150-15", "2250-15", "2400-15"],
						reward_stage_reborn: ["10-5", "40-5", "80-5", "150-5", "250-5", "350-5", "450-5", "550-5", "650-5", "750-5", "850-5", "950-5", "1050-5", "1150-5", "1250-5", "1350-5", "1450-5", "1550-5", "1650-5", "1750-5", "1850-5", "1950-5", "2050-5", "2150-5", "2250-5", "2400-5"]
					},
					7: {
						miner_type: 7,
						carry: 600,
						upgrade_type: 2,
						upgrade_consume: 400,
						speed: .5,
						reward_stage: ["10-15", "40-15", "80-15", "150-15", "250-15", "350-15", "450-15", "550-15", "650-15", "750-15", "850-15", "950-15", "1050-15", "1150-15", "1250-15", "1350-15", "1450-15", "1550-15", "1650-15", "1750-15", "1850-15", "1950-15", "2050-15", "2150-15", "2250-15", "2400-15"],
						reward_stage_reborn: ["10-5", "40-5", "80-5", "150-5", "250-5", "350-5", "450-5", "550-5", "650-5", "750-5", "850-5", "950-5", "1050-5", "1150-5", "1250-5", "1350-5", "1450-5", "1550-5", "1650-5", "1750-5", "1850-5", "1950-5", "2050-5", "2150-5", "2250-5", "2400-5"]
					},
					8: {
						miner_type: 8,
						carry: 600,
						upgrade_type: 2,
						upgrade_consume: 400,
						speed: .5,
						reward_stage: ["10-15", "40-15", "80-15", "150-15", "250-15", "350-15", "450-15", "550-15", "650-15", "750-15", "850-15", "950-15", "1050-15", "1150-15", "1250-15", "1350-15", "1450-15", "1550-15", "1650-15", "1750-15", "1850-15", "1950-15", "2050-15", "2150-15", "2250-15", "2400-15"],
						reward_stage_reborn: ["10-5", "40-5", "80-5", "150-5", "250-5", "350-5", "450-5", "550-5", "650-5", "750-5", "850-5", "950-5", "1050-5", "1150-5", "1250-5", "1350-5", "1450-5", "1550-5", "1650-5", "1750-5", "1850-5", "1950-5", "2050-5", "2150-5", "2250-5", "2400-5"]
					},
					9: {
						miner_type: 9,
						carry: 600,
						upgrade_type: 2,
						upgrade_consume: 400,
						speed: .5,
						reward_stage: ["10-15", "40-15", "80-15", "150-15", "250-15", "350-15", "450-15", "550-15", "650-15", "750-15", "850-15", "950-15", "1050-15", "1150-15", "1250-15", "1350-15", "1450-15", "1550-15", "1650-15", "1750-15", "1850-15", "1950-15", "2050-15", "2150-15", "2250-15", "2400-15"],
						reward_stage_reborn: ["10-5", "40-5", "80-5", "150-5", "250-5", "350-5", "450-5", "550-5", "650-5", "750-5", "850-5", "950-5", "1050-5", "1150-5", "1250-5", "1350-5", "1450-5", "1550-5", "1650-5", "1750-5", "1850-5", "1950-5", "2050-5", "2150-5", "2250-5", "2400-5"]
					},
					10: {
						miner_type: 10,
						carry: 600,
						upgrade_type: 2,
						upgrade_consume: 400,
						speed: .5,
						reward_stage: ["10-15", "40-15", "80-15", "150-15", "250-15", "350-15", "450-15", "550-15", "650-15", "750-15", "850-15", "950-15", "1050-15", "1150-15", "1250-15", "1350-15", "1450-15", "1550-15", "1650-15", "1750-15", "1850-15", "1950-15", "2050-15", "2150-15", "2250-15", "2400-15"],
						reward_stage_reborn: ["10-5", "40-5", "80-5", "150-5", "250-5", "350-5", "450-5", "550-5", "650-5", "750-5", "850-5", "950-5", "1050-5", "1150-5", "1250-5", "1350-5", "1450-5", "1550-5", "1650-5", "1750-5", "1850-5", "1950-5", "2050-5", "2150-5", "2250-5", "2400-5"]
					},
					11: {
						miner_type: 11,
						carry: 600,
						upgrade_type: 3,
						upgrade_consume: 400,
						speed: .5,
						reward_stage: ["10-15", "40-15", "80-15", "150-15", "250-15", "350-15", "450-15", "550-15", "650-15", "750-15", "850-15", "950-15", "1050-15", "1150-15", "1250-15", "1350-15", "1450-15", "1550-15", "1650-15", "1750-15", "1850-15", "1950-15", "2050-15", "2150-15", "2250-15", "2400-15"],
						reward_stage_reborn: ["10-5", "40-5", "80-5", "150-5", "250-5", "350-5", "450-5", "550-5", "650-5", "750-5", "850-5", "950-5", "1050-5", "1150-5", "1250-5", "1350-5", "1450-5", "1550-5", "1650-5", "1750-5", "1850-5", "1950-5", "2050-5", "2150-5", "2250-5", "2400-5"]
					},
					12: {
						miner_type: 12,
						carry: 600,
						upgrade_type: 3,
						upgrade_consume: 400,
						speed: .5,
						reward_stage: ["10-15", "40-15", "80-15", "150-15", "250-15", "350-15", "450-15", "550-15", "650-15", "750-15", "850-15", "950-15", "1050-15", "1150-15", "1250-15", "1350-15", "1450-15", "1550-15", "1650-15", "1750-15", "1850-15", "1950-15", "2050-15", "2150-15", "2250-15", "2400-15"],
						reward_stage_reborn: ["10-5", "40-5", "80-5", "150-5", "250-5", "350-5", "450-5", "550-5", "650-5", "750-5", "850-5", "950-5", "1050-5", "1150-5", "1250-5", "1350-5", "1450-5", "1550-5", "1650-5", "1750-5", "1850-5", "1950-5", "2050-5", "2150-5", "2250-5", "2400-5"]
					},
					13: {
						miner_type: 13,
						carry: 600,
						upgrade_type: 3,
						upgrade_consume: 400,
						speed: .5,
						reward_stage: ["10-15", "40-15", "80-15", "150-15", "250-15", "350-15", "450-15", "550-15", "650-15", "750-15", "850-15", "950-15", "1050-15", "1150-15", "1250-15", "1350-15", "1450-15", "1550-15", "1650-15", "1750-15", "1850-15", "1950-15", "2050-15", "2150-15", "2250-15", "2400-15"],
						reward_stage_reborn: ["10-5", "40-5", "80-5", "150-5", "250-5", "350-5", "450-5", "550-5", "650-5", "750-5", "850-5", "950-5", "1050-5", "1150-5", "1250-5", "1350-5", "1450-5", "1550-5", "1650-5", "1750-5", "1850-5", "1950-5", "2050-5", "2150-5", "2250-5", "2400-5"]
					},
					14: {
						miner_type: 14,
						carry: 600,
						upgrade_type: 3,
						upgrade_consume: 400,
						speed: .5,
						reward_stage: ["10-15", "40-15", "80-15", "150-15", "250-15", "350-15", "450-15", "550-15", "650-15", "750-15", "850-15", "950-15", "1050-15", "1150-15", "1250-15", "1350-15", "1450-15", "1550-15", "1650-15", "1750-15", "1850-15", "1950-15", "2050-15", "2150-15", "2250-15", "2400-15"],
						reward_stage_reborn: ["10-5", "40-5", "80-5", "150-5", "250-5", "350-5", "450-5", "550-5", "650-5", "750-5", "850-5", "950-5", "1050-5", "1150-5", "1250-5", "1350-5", "1450-5", "1550-5", "1650-5", "1750-5", "1850-5", "1950-5", "2050-5", "2150-5", "2250-5", "2400-5"]
					},
					15: {
						miner_type: 15,
						carry: 600,
						upgrade_type: 3,
						upgrade_consume: 400,
						speed: .5,
						reward_stage: ["10-15", "40-15", "80-15", "150-15", "250-15", "350-15", "450-15", "550-15", "650-15", "750-15", "850-15", "950-15", "1050-15", "1150-15", "1250-15", "1350-15", "1450-15", "1550-15", "1650-15", "1750-15", "1850-15", "1950-15", "2050-15", "2150-15", "2250-15", "2400-15"],
						reward_stage_reborn: ["10-5", "40-5", "80-5", "150-5", "250-5", "350-5", "450-5", "550-5", "650-5", "750-5", "850-5", "950-5", "1050-5", "1150-5", "1250-5", "1350-5", "1450-5", "1550-5", "1650-5", "1750-5", "1850-5", "1950-5", "2050-5", "2150-5", "2250-5", "2400-5"]
					},
					16: {
						miner_type: 16,
						carry: 600,
						upgrade_type: 4,
						upgrade_consume: 400,
						speed: .5,
						reward_stage: ["10-15", "40-15", "80-15", "150-15", "250-15", "350-15", "450-15", "550-15", "650-15", "750-15", "850-15", "950-15", "1050-15", "1150-15", "1250-15", "1350-15", "1450-15", "1550-15", "1650-15", "1750-15", "1850-15", "1950-15", "2050-15", "2150-15", "2250-15", "2400-15"],
						reward_stage_reborn: ["10-5", "40-5", "80-5", "150-5", "250-5", "350-5", "450-5", "550-5", "650-5", "750-5", "850-5", "950-5", "1050-5", "1150-5", "1250-5", "1350-5", "1450-5", "1550-5", "1650-5", "1750-5", "1850-5", "1950-5", "2050-5", "2150-5", "2250-5", "2400-5"]
					},
					17: {
						miner_type: 17,
						carry: 600,
						upgrade_type: 4,
						upgrade_consume: 400,
						speed: .5,
						reward_stage: ["10-15", "40-15", "80-15", "150-15", "250-15", "350-15", "450-15", "550-15", "650-15", "750-15", "850-15", "950-15", "1050-15", "1150-15", "1250-15", "1350-15", "1450-15", "1550-15", "1650-15", "1750-15", "1850-15", "1950-15", "2050-15", "2150-15", "2250-15", "2400-15"],
						reward_stage_reborn: ["10-5", "40-5", "80-5", "150-5", "250-5", "350-5", "450-5", "550-5", "650-5", "750-5", "850-5", "950-5", "1050-5", "1150-5", "1250-5", "1350-5", "1450-5", "1550-5", "1650-5", "1750-5", "1850-5", "1950-5", "2050-5", "2150-5", "2250-5", "2400-5"]
					},
					18: {
						miner_type: 18,
						carry: 600,
						upgrade_type: 4,
						upgrade_consume: 400,
						speed: .5,
						reward_stage: ["10-15", "40-15", "80-15", "150-15", "250-15", "350-15", "450-15", "550-15", "650-15", "750-15", "850-15", "950-15", "1050-15", "1150-15", "1250-15", "1350-15", "1450-15", "1550-15", "1650-15", "1750-15", "1850-15", "1950-15", "2050-15", "2150-15", "2250-15", "2400-15"],
						reward_stage_reborn: ["10-5", "40-5", "80-5", "150-5", "250-5", "350-5", "450-5", "550-5", "650-5", "750-5", "850-5", "950-5", "1050-5", "1150-5", "1250-5", "1350-5", "1450-5", "1550-5", "1650-5", "1750-5", "1850-5", "1950-5", "2050-5", "2150-5", "2250-5", "2400-5"]
					},
					19: {
						miner_type: 19,
						carry: 600,
						upgrade_type: 4,
						upgrade_consume: 400,
						speed: .5,
						reward_stage: ["10-15", "40-15", "80-15", "150-15", "250-15", "350-15", "450-15", "550-15", "650-15", "750-15", "850-15", "950-15", "1050-15", "1150-15", "1250-15", "1350-15", "1450-15", "1550-15", "1650-15", "1750-15", "1850-15", "1950-15", "2050-15", "2150-15", "2250-15", "2400-15"],
						reward_stage_reborn: ["10-5", "40-5", "80-5", "150-5", "250-5", "350-5", "450-5", "550-5", "650-5", "750-5", "850-5", "950-5", "1050-5", "1150-5", "1250-5", "1350-5", "1450-5", "1550-5", "1650-5", "1750-5", "1850-5", "1950-5", "2050-5", "2150-5", "2250-5", "2400-5"]
					},
					20: {
						miner_type: 20,
						carry: 600,
						upgrade_type: 4,
						upgrade_consume: 400,
						speed: .5,
						reward_stage: ["10-15", "40-15", "80-15", "150-15", "250-15", "350-15", "450-15", "550-15", "650-15", "750-15", "850-15", "950-15", "1050-15", "1150-15", "1250-15", "1350-15", "1450-15", "1550-15", "1650-15", "1750-15", "1850-15", "1950-15", "2050-15", "2150-15", "2250-15", "2400-15"],
						reward_stage_reborn: ["10-5", "40-5", "80-5", "150-5", "250-5", "350-5", "450-5", "550-5", "650-5", "750-5", "850-5", "950-5", "1050-5", "1150-5", "1250-5", "1350-5", "1450-5", "1550-5", "1650-5", "1750-5", "1850-5", "1950-5", "2050-5", "2150-5", "2250-5", "2400-5"]
					}
				},
				check: {
					miner_type: {
						miner_type: "int",
						carry: "int",
						upgrade_type: "int",
						upgrade_consume: "int",
						speed: "float",
						reward_stage: "string|arr",
						reward_stage_reborn: "string|arr"
					}
				}
			},
			t.exports.protocol_version = "0.0.1",
			cc._RF.pop()
	},
	{}],
	Cfg_ElevatorPowerCoefficient: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "33fc4CK90tEZaQNzT4syLIu", "Cfg_ElevatorPowerCoefficient"),
			t.exports = {
				data: {
					1: {
						lv: 1,
						rate: 1
					},
					2: {
						lv: 2,
						rate: 1.33
					},
					21: {
						lv: 21,
						rate: 1.108
					},
					51: {
						lv: 51,
						rate: 1.113
					},
					101: {
						lv: 101,
						rate: 1.1
					},
					201: {
						lv: 201,
						rate: 1.107
					},
					401: {
						lv: 401,
						rate: 1.116
					},
					601: {
						lv: 601,
						rate: 1.1465
					},
					701: {
						lv: 701,
						rate: 1.135
					},
					801: {
						lv: 801,
						rate: 1.073
					},
					1601: {
						lv: 1601,
						rate: 1.08
					}
				},
				check: {
					lv: {
						lv: "int",
						rate: "float"
					}
				}
			},
			t.exports.protocol_version = "0.0.1",
			cc._RF.pop()
	},
	{}],
	Cfg_ElevatorPowerUp: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "6ff0efnukxHwpgIN52zrDFi", "Cfg_ElevatorPowerUp"),
			t.exports = {
				data: {
					10: {
						lv: 10,
						rate: 2
					},
					40: {
						lv: 40,
						rate: 2
					},
					80: {
						lv: 80,
						rate: 1.15
					},
					150: {
						lv: 150,
						rate: 1.848
					},
					250: {
						lv: 250,
						rate: 1.4
					},
					350: {
						lv: 350,
						rate: 2
					},
					550: {
						lv: 550,
						rate: 2
					},
					850: {
						lv: 850,
						rate: 2
					},
					950: {
						lv: 950,
						rate: 2
					},
					1050: {
						lv: 1050,
						rate: 2
					},
					1150: {
						lv: 1150,
						rate: 2
					},
					1250: {
						lv: 1250,
						rate: 2
					},
					1350: {
						lv: 1350,
						rate: 2
					},
					1450: {
						lv: 1450,
						rate: 2
					},
					1550: {
						lv: 1550,
						rate: 2.6
					},
					1650: {
						lv: 1650,
						rate: 2.75
					},
					1750: {
						lv: 1750,
						rate: 2
					},
					1850: {
						lv: 1850,
						rate: 2
					},
					1950: {
						lv: 1950,
						rate: 2
					},
					2050: {
						lv: 2050,
						rate: 2
					},
					2150: {
						lv: 2150,
						rate: 2
					},
					2250: {
						lv: 2250,
						rate: 2
					},
					2400: {
						lv: 2400,
						rate: 3
					}
				},
				check: {
					lv: {
						lv: "int",
						rate: "float"
					}
				}
			},
			t.exports.protocol_version = "0.0.1",
			cc._RF.pop()
	},
	{}],
	Cfg_ElevatorSpeed: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "dd40173K/JAarXFRG8E7O7q", "Cfg_ElevatorSpeed"),
			t.exports = {
				data: {
					1: {
						lv: 1,
						rate: .015
					},
					21: {
						lv: 21,
						rate: .01
					},
					51: {
						lv: 51,
						rate: .008
					},
					101: {
						lv: 101,
						rate: .006
					},
					401: {
						lv: 401,
						rate: .004
					},
					801: {
						lv: 801,
						rate: .001
					}
				},
				check: {
					lv: {
						lv: "int",
						rate: "float"
					}
				}
			},
			t.exports.protocol_version = "0.0.1",
			cc._RF.pop()
	},
	{}],
	Cfg_GameConst: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "11814yB+ipGNI0VE8TVoPUG", "Cfg_GameConst"),
			t.exports = {
				data: {
					excavate_time: "4",
					elevator_load_time: "4",
					storehouse_load_time: "4",
					miner_lv_up: "800",
					elevator_lv_up: "2400",
					storehouse_lv_up: "2400",
					elevator_height: "0",
					miner_height: "1",
					idle_rate: "0.1",
					mine_length: "2",
					mine_length_increase: "0.01",
					surname_num: "74",
					name_num: "310",
					immediate_cash_price: "50",
					buy_mine_cost_min: "10",
					buy_mine_cost_max: "10000"
				}
			},
			t.exports.protocol_version = "0.0.1",
			cc._RF.pop()
	},
	{}],
	Cfg_Item: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "1bff5N7zXdOeKfQB3I2ppxD", "Cfg_Item"),
			t.exports = {
				data: {
					1001: {
						id: 1001,
						type: 1,
						param1: 2,
						param2: 720,
						icon: "Icon_Boost_2x",
						name: "item_name_1001",
						desc: "item_desc_1001"
					},
					1002: {
						id: 1002,
						type: 1,
						param1: 4,
						param2: 4320,
						icon: "Icon_Boost_4x",
						name: "item_name_1002",
						desc: "item_desc_1002"
					},
					1003: {
						id: 1003,
						type: 1,
						param1: 50,
						param2: 60,
						icon: "Icon_Boost_50x",
						name: "item_name_1003",
						desc: "item_desc_1003"
					},
					1004: {
						id: 1004,
						type: 1,
						param1: 2,
						param2: 10,
						icon: "Icon_Boost_2x",
						name: "item_name_1004",
						desc: "item_desc_1004"
					},
					1005: {
						id: 1005,
						type: 1,
						param1: 2,
						param2: 60,
						icon: "Icon_Boost_2x",
						name: "item_name_1005",
						desc: "item_desc_1005"
					},
					1006: {
						id: 1006,
						type: 1,
						param1: 2,
						param2: 480,
						icon: "Icon_Boost_2x",
						name: "item_name_1006",
						desc: "item_desc_1006"
					},
					1007: {
						id: 1007,
						type: 1,
						param1: 4,
						param2: 10,
						icon: "Icon_Boost_4x",
						name: "item_name_1007",
						desc: "item_desc_1007"
					},
					1008: {
						id: 1008,
						type: 1,
						param1: 4,
						param2: 60,
						icon: "Icon_Boost_4x",
						name: "item_name_1008",
						desc: "item_desc_1008"
					},
					1009: {
						id: 1009,
						type: 1,
						param1: 4,
						param2: 20160,
						icon: "Icon_Boost_4x",
						name: "item_name_1009",
						desc: "item_desc_1009"
					},
					1010: {
						id: 1010,
						type: 1,
						param1: 5,
						param2: 10,
						icon: "Icon_Boost_5x",
						name: "item_name_1010",
						desc: "item_desc_1010"
					},
					1011: {
						id: 1011,
						type: 1,
						param1: 5,
						param2: 60,
						icon: "Icon_Boost_5x",
						name: "item_name_1011",
						desc: "item_desc_1011"
					},
					1012: {
						id: 1012,
						type: 1,
						param1: 10,
						param2: 5,
						icon: "Icon_Boost_10x",
						name: "item_name_1012",
						desc: "item_desc_1012"
					},
					1013: {
						id: 1013,
						type: 1,
						param1: 10,
						param2: 10,
						icon: "Icon_Boost_10x",
						name: "item_name_1013",
						desc: "item_desc_1013"
					},
					1014: {
						id: 1014,
						type: 1,
						param1: 10,
						param2: 60,
						icon: "Icon_Boost_10x",
						name: "item_name_1014",
						desc: "item_desc_1014"
					},
					1015: {
						id: 1015,
						type: 1,
						param1: 20,
						param2: 5,
						icon: "Icon_Boost_20x",
						name: "item_name_1015",
						desc: "item_desc_1015"
					},
					1016: {
						id: 1016,
						type: 1,
						param1: 20,
						param2: 10,
						icon: "Icon_Boost_20x",
						name: "item_name_1016",
						desc: "item_desc_1016"
					},
					1017: {
						id: 1017,
						type: 1,
						param1: 20,
						param2: 60,
						icon: "Icon_Boost_20x",
						name: "item_name_1017",
						desc: "item_desc_1017"
					},
					1018: {
						id: 1018,
						type: 1,
						param1: 50,
						param2: 5,
						icon: "Icon_Boost_50x",
						name: "item_name_1018",
						desc: "item_desc_1018"
					},
					1019: {
						id: 1019,
						type: 1,
						param1: 50,
						param2: 10,
						icon: "Icon_Boost_50x",
						name: "item_name_1019",
						desc: "item_desc_1019"
					},
					1020: {
						id: 1020,
						type: 1,
						param1: 100,
						param2: 5,
						icon: "Icon_Boost_100x",
						name: "item_name_1020",
						desc: "item_desc_1020"
					},
					1021: {
						id: 1021,
						type: 1,
						param1: 100,
						param2: 10,
						icon: "Icon_Boost_100x",
						name: "item_name_1021",
						desc: "item_desc_1021"
					},
					1022: {
						id: 1022,
						type: 1,
						param1: 100,
						param2: 60,
						icon: "Icon_Boost_100x",
						name: "item_name_1022",
						desc: "item_desc_1022"
					},
					1023: {
						id: 1023,
						type: 1,
						param1: 500,
						param2: 5,
						icon: "Icon_Boost_500x",
						name: "item_name_1023",
						desc: "item_desc_1023"
					},
					1024: {
						id: 1024,
						type: 1,
						param1: 1e3,
						param2: 5,
						icon: "Icon_Boost_1000x",
						name: "item_name_1024",
						desc: "item_desc_1024"
					},
					1025: {
						id: 1025,
						type: 1,
						param1: 10,
						param2: 720,
						icon: "Icon_Boost_10x",
						name: "item_name_1025",
						desc: "item_desc_1025"
					},
					1026: {
						id: 1026,
						type: 1,
						param1: 4,
						param2: 10080,
						icon: "Icon_Boost_4x",
						name: "item_name_1026",
						desc: "item_desc_1026"
					},
					1027: {
						id: 1027,
						type: 1,
						param1: 2,
						param2: 240,
						icon: "Icon_Boost_2x",
						name: "item_name_1027",
						desc: "item_desc_1027"
					},
					1028: {
						id: 1028,
						type: 1,
						param1: 10,
						param2: 240,
						icon: "Icon_Boost_10x",
						name: "item_name_1028",
						desc: "item_desc_1028"
					},
					1029: {
						id: 1029,
						type: 1,
						param1: 20,
						param2: 240,
						icon: "Icon_Boost_20x",
						name: "item_name_1029",
						desc: "item_desc_1029"
					},
					2001: {
						id: 2001,
						type: 2,
						param1: 1,
						param2: 60,
						icon: "InstantCash_01_128",
						name: "item_name_2001",
						desc: "item_desc_2001"
					},
					2002: {
						id: 2002,
						type: 2,
						param1: 1,
						param2: 240,
						icon: "InstantCash_02_128",
						name: "item_name_2002",
						desc: "item_desc_2002"
					},
					2003: {
						id: 2003,
						type: 2,
						param1: 1,
						param2: 1440,
						icon: "InstantCash_04_128",
						name: "item_name_2003",
						desc: "item_desc_2003"
					},
					2004: {
						id: 2004,
						type: 2,
						param1: 1,
						param2: 720,
						icon: "InstantCash_03_128",
						name: "item_name_2004",
						desc: "item_desc_2004"
					},
					2005: {
						id: 2005,
						type: 2,
						param1: 1,
						param2: 4320,
						icon: "InstantCash_06_128",
						name: "item_name_2005",
						desc: "item_desc_2005"
					},
					2006: {
						id: 2006,
						type: 2,
						param1: 1,
						param2: 2880,
						icon: "InstantCash_05_128",
						name: "item_name_2006",
						desc: "item_desc_2006"
					},
					2007: {
						id: 2007,
						type: 2,
						param1: 1,
						param2: 7200,
						icon: "InstantCash_07_128",
						name: "item_name_2007",
						desc: "item_desc_2007"
					},
					6001: {
						id: 6001,
						type: 6,
						icon: "IconSuperCash_128",
						name: "item_name_6001",
						desc: "item_desc_6001"
					}
				},
				check: {
					id: {
						id: "int",
						type: "int",
						param1: "int",
						param2: "int",
						param3: "int",
						icon: "string",
						name: "string",
						desc: "string"
					}
				}
			},
			t.exports.protocol_version = "0.0.1",
			cc._RF.pop()
	},
	{}],
	Cfg_ManagerFixedRecruit: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "e74d45orHJMtKeHtiYe8N7Z", "Cfg_ManagerFixedRecruit"),
			t.exports = {
				data: {
					1: {
						num: 1,
						miner_manager: 2012,
						elevator_manager: 1012,
						storehouse_manager: 3012
					},
					2: {
						num: 2,
						miner_manager: 2021,
						elevator_manager: 1021,
						storehouse_manager: 3021
					},
					3: {
						num: 3,
						miner_manager: 2022,
						elevator_manager: 1022,
						storehouse_manager: 3022
					},
					4: {
						num: 4,
						miner_manager: 2031,
						elevator_manager: 1031,
						storehouse_manager: 3031
					},
					5: {
						num: 5,
						miner_manager: 2011,
						elevator_manager: 1011,
						storehouse_manager: 3011
					}
				},
				check: {
					num: {
						num: "int",
						miner_manager: "int",
						elevator_manager: "int",
						storehouse_manager: "int"
					}
				}
			},
			t.exports.protocol_version = "0.0.1",
			cc._RF.pop()
	},
	{}],
	Cfg_ManagerName: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "87cabek+TRAK6s1jXgbMxlM", "Cfg_ManagerName"),
			t.exports = {
				data: {
					1: {
						id: 1,
						surname: "Aaron",
						name: "Emily"
					},
					2: {
						id: 2,
						surname: "Abel",
						name: "Olivi"
					},
					3: {
						id: 3,
						surname: "Abraham",
						name: "Emma"
					},
					4: {
						id: 4,
						surname: "Adam",
						name: "Andre"
					},
					5: {
						id: 5,
						surname: "Adrian",
						name: "Antho"
					},
					6: {
						id: 6,
						surname: "Alva",
						name: "Abiga"
					},
					7: {
						id: 7,
						surname: "Alex",
						name: "Ava"
					},
					8: {
						id: 8,
						surname: "Alva",
						name: "Alexi"
					},
					9: {
						id: 9,
						surname: "Alan",
						name: "Aiden"
					},
					10: {
						id: 10,
						surname: "Albert",
						name: "Olive"
					},
					11: {
						id: 11,
						surname: "Alfred",
						name: "Ella"
					},
					12: {
						id: 12,
						surname: "Andrew",
						name: "Angel"
					},
					13: {
						id: 13,
						surname: "Andy",
						name: "Ashle"
					},
					14: {
						id: 14,
						surname: "Angus",
						name: "Aaron"
					},
					15: {
						id: 15,
						surname: "Anthony",
						name: "Austi"
					},
					16: {
						id: 16,
						surname: "Arthur",
						name: "Ameli"
					},
					17: {
						id: 17,
						surname: "Austin",
						name: "Anna"
					},
					18: {
						id: 18,
						surname: "Ben",
						name: "Alyss"
					},
					19: {
						id: 19,
						surname: "Benson",
						name: "Avery"
					},
					20: {
						id: 20,
						surname: "Bill",
						name: "Alex"
					},
					21: {
						id: 21,
						surname: "Bob",
						name: "Adria"
					},
					22: {
						id: 22,
						surname: "Brandon",
						name: "Aidan"
					},
					23: {
						id: 23,
						surname: "Brant",
						name: "Addis"
					},
					24: {
						id: 24,
						surname: "Brent",
						name: "Ellie"
					},
					25: {
						id: 25,
						surname: "Brian",
						name: "Allis"
					},
					26: {
						id: 26,
						surname: "Bruce",
						name: "Eric"
					},
					27: {
						id: 27,
						surname: "Carl",
						name: "Oscar"
					},
					28: {
						id: 28,
						surname: "Cary",
						name: "Amy"
					},
					29: {
						id: 29,
						surname: "Caspar",
						name: "Alexa"
					},
					30: {
						id: 30,
						surname: "Charles",
						name: "Edwar"
					},
					31: {
						id: 31,
						surname: "Cheney",
						name: "Aubre"
					},
					32: {
						id: 32,
						surname: "Chris",
						name: "Audre"
					},
					33: {
						id: 33,
						surname: "Christian",
						name: "Aaliy"
					},
					34: {
						id: 34,
						surname: "Chris",
						name: "Erin"
					},
					35: {
						id: 35,
						surname: "Colin",
						name: "Eva"
					},
					36: {
						id: 36,
						surname: "Cosmo",
						name: "Arian"
					},
					37: {
						id: 37,
						surname: "Daniel",
						name: "Ashto"
					},
					38: {
						id: 38,
						surname: "Dennis",
						name: "Amber"
					},
					39: {
						id: 39,
						surname: "Derek",
						name: "Benja"
					},
					40: {
						id: 40,
						surname: "Donald",
						name: "Brand"
					},
					41: {
						id: 41,
						surname: "Douglas",
						name: "Brian"
					},
					42: {
						id: 42,
						surname: "David",
						name: "Brayd"
					},
					43: {
						id: 43,
						surname: "Denny",
						name: "Blake"
					},
					44: {
						id: 44,
						surname: "Edgar",
						name: "Brook"
					},
					45: {
						id: 45,
						surname: "Edward",
						name: "Baile"
					},
					46: {
						id: 46,
						surname: "Edwin",
						name: "Bryan"
					},
					47: {
						id: 47,
						surname: "Elliott",
						name: "Bryce"
					},
					48: {
						id: 48,
						surname: "Elvis",
						name: "Brody"
					},
					49: {
						id: 49,
						surname: "Eric",
						name: "Bradl"
					},
					50: {
						id: 50,
						surname: "Evan",
						name: "Bella"
					},
					51: {
						id: 51,
						surname: "Francis",
						name: "Brady"
					},
					52: {
						id: 52,
						surname: "Frank",
						name: "Paul"
					},
					53: {
						id: 53,
						surname: "Franklin",
						name: "Peter"
					},
					54: {
						id: 54,
						surname: "Fred",
						name: "Betha"
					},
					55: {
						id: 55,
						surname: "Gabriel",
						name: "Bryso"
					},
					56: {
						id: 56,
						surname: "Gaby",
						name: "Poppy"
					},
					57: {
						id: 57,
						surname: "Garfield",
						name: "Bentl"
					},
					58: {
						id: 58,
						surname: "Gary",
						name: "Braxt"
					},
					59: {
						id: 59,
						surname: "Gavin",
						name: "Brend"
					},
					60: {
						id: 60,
						surname: "George",
						name: "Brean"
					},
					61: {
						id: 61,
						surname: "Gino",
						name: "Brade"
					},
					62: {
						id: 62,
						surname: "Glen",
						name: "Bianc"
					},
					63: {
						id: 63,
						surname: "Glendon",
						name: "Briel"
					},
					64: {
						id: 64,
						surname: "Harrison",
						name: "Benne"
					},
					65: {
						id: 65,
						surname: "Hugo",
						name: "Britt"
					},
					66: {
						id: 66,
						surname: "Hunk",
						name: "Beau"
					},
					67: {
						id: 67,
						surname: "Howard",
						name: "Billy"
					},
					68: {
						id: 68,
						surname: "Henry",
						name: "Brenn"
					},
					69: {
						id: 69,
						surname: "Ignativs",
						name: "Bobby"
					},
					70: {
						id: 70,
						surname: "Ivan",
						name: "Brett"
					},
					71: {
						id: 71,
						surname: "Isaac",
						name: "Brock"
					},
					72: {
						id: 72,
						surname: "Jack",
						name: "Brynn"
					},
					73: {
						id: 73,
						surname: "Jackson",
						name: "Brant"
					},
					74: {
						id: 74,
						surname: "Jacob",
						name: "Charl"
					},
					75: {
						id: 75,
						name: "Chase"
					},
					76: {
						id: 76,
						name: "Chanc"
					},
					77: {
						id: 77,
						name: "Trent"
					},
					78: {
						id: 78,
						name: "Chad"
					},
					79: {
						id: 79,
						name: "Chaya"
					},
					80: {
						id: 80,
						name: "Chari"
					},
					81: {
						id: 81,
						name: "Chana"
					},
					82: {
						id: 82,
						name: "Tracy"
					},
					83: {
						id: 83,
						name: "Chasi"
					},
					84: {
						id: 84,
						name: "Chaim"
					},
					85: {
						id: 85,
						name: "Chace"
					},
					86: {
						id: 86,
						name: "Trist"
					},
					87: {
						id: 87,
						name: "Chaz"
					},
					88: {
						id: 88,
						name: "Chest"
					},
					89: {
						id: 89,
						name: "Trayv"
					},
					90: {
						id: 90,
						name: "Chaun"
					},
					91: {
						id: 91,
						name: "Chava"
					},
					92: {
						id: 92,
						name: "Trina"
					},
					93: {
						id: 93,
						name: "Chast"
					},
					94: {
						id: 94,
						name: "Chero"
					},
					95: {
						id: 95,
						name: "Chadw"
					},
					96: {
						id: 96,
						name: "Chet"
					},
					97: {
						id: 97,
						name: "Trici"
					},
					98: {
						id: 98,
						name: "Chaso"
					},
					99: {
						id: 99,
						name: "Chazz"
					},
					100: {
						id: 100,
						name: "Trish"
					},
					101: {
						id: 101,
						name: "Chay"
					},
					102: {
						id: 102,
						name: "Trixi"
					},
					103: {
						id: 103,
						name: "Chapm"
					},
					104: {
						id: 104,
						name: "Cana"
					},
					105: {
						id: 105,
						name: "Chas"
					},
					106: {
						id: 106,
						name: "Chave"
					},
					107: {
						id: 107,
						name: "Danie"
					},
					108: {
						id: 108,
						name: "David"
					},
					109: {
						id: 109,
						name: "Dylan"
					},
					110: {
						id: 110,
						name: "Domin"
					},
					111: {
						id: 111,
						name: "Desti"
					},
					112: {
						id: 112,
						name: "Diego"
					},
					113: {
						id: 113,
						name: "Daisy"
					},
					114: {
						id: 114,
						name: "Devin"
					},
					115: {
						id: 115,
						name: "Dakot"
					},
					116: {
						id: 116,
						name: "Damia"
					},
					117: {
						id: 117,
						name: "Derek"
					},
					118: {
						id: 118,
						name: "Diana"
					},
					119: {
						id: 119,
						name: "Decla"
					},
					120: {
						id: 120,
						name: "Dalto"
					},
					121: {
						id: 121,
						name: "Devon"
					},
					122: {
						id: 122,
						name: "Drew"
					},
					123: {
						id: 123,
						name: "Damie"
					},
					124: {
						id: 124,
						name: "Donov"
					},
					125: {
						id: 125,
						name: "Tiffa"
					},
					126: {
						id: 126,
						name: "Dawso"
					},
					127: {
						id: 127,
						name: "Dillo"
					},
					128: {
						id: 128,
						name: "Delan"
					},
					129: {
						id: 129,
						name: "Delil"
					},
					130: {
						id: 130,
						name: "Dean"
					},
					131: {
						id: 131,
						name: "Teaga"
					},
					132: {
						id: 132,
						name: "Danny"
					},
					133: {
						id: 133,
						name: "Dante"
					},
					134: {
						id: 134,
						name: "Drake"
					},
					135: {
						id: 135,
						name: "Dalla"
					},
					136: {
						id: 136,
						name: "Dusti"
					},
					137: {
						id: 137,
						name: "Derri"
					},
					138: {
						id: 138,
						name: "Tia"
					},
					139: {
						id: 139,
						name: "Dariu"
					},
					140: {
						id: 140,
						name: "Denni"
					},
					141: {
						id: 141,
						name: "Darre"
					},
					142: {
						id: 142,
						name: "Desir"
					},
					143: {
						id: 143,
						name: "Enzo"
					},
					144: {
						id: 144,
						name: "Earl"
					},
					145: {
						id: 145,
						name: "Irvin"
					},
					146: {
						id: 146,
						name: "Ervin"
					},
					147: {
						id: 147,
						name: "Irma"
					},
					148: {
						id: 148,
						name: "Enya"
					},
					149: {
						id: 149,
						name: "Ernie"
					},
					150: {
						id: 150,
						name: "Ursul"
					},
					151: {
						id: 151,
						name: "Obadi"
					},
					152: {
						id: 152,
						name: "Enric"
					},
					153: {
						id: 153,
						name: "Usher"
					},
					154: {
						id: 154,
						name: "Ensle"
					},
					155: {
						id: 155,
						name: "Irwin"
					},
					156: {
						id: 156,
						name: "Endia"
					},
					157: {
						id: 157,
						name: "Eniol"
					},
					158: {
						id: 158,
						name: "Olen"
					},
					159: {
						id: 159,
						name: "Erma"
					},
					160: {
						id: 160,
						name: "Urban"
					},
					161: {
						id: 161,
						name: "Endy"
					},
					162: {
						id: 162,
						name: "Erek"
					},
					163: {
						id: 163,
						name: "Ngozi"
					},
					164: {
						id: 164,
						name: "Erlin"
					},
					165: {
						id: 165,
						name: "Erna"
					},
					166: {
						id: 166,
						name: "Irmak"
					},
					167: {
						id: 167,
						name: "Ernst"
					},
					168: {
						id: 168,
						name: "Ermin"
					},
					169: {
						id: 169,
						name: "Early"
					},
					170: {
						id: 170,
						name: "Earle"
					},
					171: {
						id: 171,
						name: "Urja"
					},
					172: {
						id: 172,
						name: "Enzi"
					},
					173: {
						id: 173,
						name: "Erski"
					},
					174: {
						id: 174,
						name: "Enio"
					},
					175: {
						id: 175,
						name: "Enki"
					},
					176: {
						id: 176,
						name: "Endre"
					},
					177: {
						id: 177,
						name: "Engel"
					},
					178: {
						id: 178,
						name: "Erlen"
					},
					179: {
						id: 179,
						name: "Jilly"
					},
					180: {
						id: 180,
						name: "Enriq"
					},
					181: {
						id: 181,
						name: "Erlan"
					},
					182: {
						id: 182,
						name: "Faith"
					},
					183: {
						id: 183,
						name: "Vanes"
					},
					184: {
						id: 184,
						name: "Phoeb"
					},
					185: {
						id: 185,
						name: "Finle"
					},
					186: {
						id: 186,
						name: "Freya"
					},
					187: {
						id: 187,
						name: "Franc"
					},
					188: {
						id: 188,
						name: "Ferna"
					},
					189: {
						id: 189,
						name: "Finn"
					},
					190: {
						id: 190,
						name: "Fatim"
					},
					191: {
						id: 191,
						name: "Fredd"
					},
					192: {
						id: 192,
						name: "Felix"
					},
					193: {
						id: 193,
						name: "Frank"
					},
					194: {
						id: 194,
						name: "Phoen"
					},
					195: {
						id: 195,
						name: "Fiona"
					},
					196: {
						id: 196,
						name: "Fabia"
					},
					197: {
						id: 197,
						name: "Frede"
					},
					198: {
						id: 198,
						name: "Finla"
					},
					199: {
						id: 199,
						name: "Phill"
					},
					200: {
						id: 200,
						name: "Phili"
					},
					201: {
						id: 201,
						name: "Flore"
					},
					202: {
						id: 202,
						name: "Felic"
					},
					203: {
						id: 203,
						name: "Faye"
					},
					204: {
						id: 204,
						name: "Flynn"
					},
					205: {
						id: 205,
						name: "Felip"
					},
					206: {
						id: 206,
						name: "Fletc"
					},
					207: {
						id: 207,
						name: "Frase"
					},
					208: {
						id: 208,
						name: "Finne"
					},
					209: {
						id: 209,
						name: "Farra"
					},
					210: {
						id: 210,
						name: "Filip"
					},
					211: {
						id: 211,
						name: "Frida"
					},
					212: {
						id: 212,
						name: "Vaugh"
					},
					213: {
						id: 213,
						name: "Vance"
					},
					214: {
						id: 214,
						name: "Grace"
					},
					215: {
						id: 215,
						name: "Gavin"
					},
					216: {
						id: 216,
						name: "Gabri"
					},
					217: {
						id: 217,
						name: "Grays"
					},
					218: {
						id: 218,
						name: "Graci"
					},
					219: {
						id: 219,
						name: "Garre"
					},
					220: {
						id: 220,
						name: "Grant"
					},
					221: {
						id: 221,
						name: "Gage"
					},
					222: {
						id: 222,
						name: "Grego"
					},
					223: {
						id: 223,
						name: "Griff"
					},
					224: {
						id: 224,
						name: "Greys"
					},
					225: {
						id: 225,
						name: "Graha"
					},
					226: {
						id: 226,
						name: "Guada"
					},
					227: {
						id: 227,
						name: "Gusta"
					},
					228: {
						id: 228,
						name: "Gunne"
					},
					229: {
						id: 229,
						name: "Grady"
					},
					230: {
						id: 230,
						name: "Glori"
					},
					231: {
						id: 231,
						name: "Georg"
					},
					232: {
						id: 232,
						name: "Gunna"
					},
					233: {
						id: 233,
						name: "Guill"
					},
					234: {
						id: 234,
						name: "Greta"
					},
					235: {
						id: 235,
						name: "Geral"
					},
					236: {
						id: 236,
						name: "Gretc"
					},
					237: {
						id: 237,
						name: "Gordo"
					},
					238: {
						id: 238,
						name: "Glenn"
					},
					239: {
						id: 239,
						name: "Ganno"
					},
					240: {
						id: 240,
						name: "Gwen"
					},
					241: {
						id: 241,
						name: "Gwyne"
					},
					242: {
						id: 242,
						name: "Gauge"
					},
					243: {
						id: 243,
						name: "Garri"
					},
					244: {
						id: 244,
						name: "Gaige"
					},
					245: {
						id: 245,
						name: "Gonza"
					},
					246: {
						id: 246,
						name: "Glen"
					},
					247: {
						id: 247,
						name: "Grey"
					},
					248: {
						id: 248,
						name: "Glady"
					},
					249: {
						id: 249,
						name: "Gus"
					},
					250: {
						id: 250,
						name: "Gray"
					},
					251: {
						id: 251,
						name: "Hanna"
					},
					252: {
						id: 252,
						name: "Hunte"
					},
					253: {
						id: 253,
						name: "Henry"
					},
					254: {
						id: 254,
						name: "Haile"
					},
					255: {
						id: 255,
						name: "Wyatt"
					},
					256: {
						id: 256,
						name: "Harry"
					},
					257: {
						id: 257,
						name: "Hayde"
					},
					258: {
						id: 258,
						name: "Harri"
					},
					259: {
						id: 259,
						name: "Harpe"
					},
					260: {
						id: 260,
						name: "Haley"
					},
					261: {
						id: 261,
						name: "Holly"
					},
					262: {
						id: 262,
						name: "Hudso"
					},
					263: {
						id: 263,
						name: "Harle"
					},
					264: {
						id: 264,
						name: "Hope"
					},
					265: {
						id: 265,
						name: "Harve"
					},
					266: {
						id: 266,
						name: "Hecto"
					},
					267: {
						id: 267,
						name: "Hazel"
					},
					268: {
						id: 268,
						name: "Heidi"
					},
					269: {
						id: 269,
						name: "Hayle"
					},
					270: {
						id: 270,
						name: "Hadle"
					},
					271: {
						id: 271,
						name: "Hugo"
					},
					272: {
						id: 272,
						name: "Heath"
					},
					273: {
						id: 273,
						name: "Harmo"
					},
					274: {
						id: 274,
						name: "Heave"
					},
					275: {
						id: 275,
						name: "Holli"
					},
					276: {
						id: 276,
						name: "Helen"
					},
					277: {
						id: 277,
						name: "Holde"
					},
					278: {
						id: 278,
						name: "Halli"
					},
					279: {
						id: 279,
						name: "Halle"
					},
					280: {
						id: 280,
						name: "Haven"
					},
					281: {
						id: 281,
						name: "Warre"
					},
					282: {
						id: 282,
						name: "Whitn"
					},
					283: {
						id: 283,
						name: "Hamza"
					},
					284: {
						id: 284,
						name: "Hana"
					},
					285: {
						id: 285,
						name: "Hassa"
					},
					286: {
						id: 286,
						name: "Jack"
					},
					287: {
						id: 287,
						name: "Jayde"
					},
					288: {
						id: 288,
						name: "Jacks"
					},
					289: {
						id: 289,
						name: "Jessi"
					},
					290: {
						id: 290,
						name: "Justi"
					},
					291: {
						id: 291,
						name: "Jason"
					},
					292: {
						id: 292,
						name: "Jasmi"
					},
					293: {
						id: 293,
						name: "Jake"
					},
					294: {
						id: 294,
						name: "Jaden"
					},
					295: {
						id: 295,
						name: "Kimbe"
					},
					296: {
						id: 296,
						name: "Jesse"
					},
					297: {
						id: 297,
						name: "Jaxon"
					},
					298: {
						id: 298,
						name: "Jamie"
					},
					299: {
						id: 299,
						name: "Jade"
					},
					300: {
						id: 300,
						name: "Jerem"
					},
					301: {
						id: 301,
						name: "Giann"
					},
					302: {
						id: 302,
						name: "Jace"
					},
					303: {
						id: 303,
						name: "Genes"
					},
					304: {
						id: 304,
						name: "Jada"
					},
					305: {
						id: 305,
						name: "Jared"
					},
					306: {
						id: 306,
						name: "Giova"
					},
					307: {
						id: 307,
						name: "Jacqu"
					},
					308: {
						id: 308,
						name: "Jaxso"
					},
					309: {
						id: 309,
						name: "Javie"
					},
					310: {
						id: 310,
						name: "Jaide"
					}
				},
				check: {
					id: {
						id: "int",
						surname: "string",
						name: "string"
					}
				}
			},
			t.exports.protocol_version = "0.0.1",
			cc._RF.pop()
	},
	{}],
	Cfg_ManagerRecruitCost: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "085aaXSXVZMn5Fza3j7eJIJ", "Cfg_ManagerRecruitCost"),
			t.exports = {
				data: {
					1: {
						num: 1,
						miner_rate: 20,
						elevator_rate: 40,
						storehouse_rate: 40
					},
					2: {
						num: 2,
						miner_rate: 2,
						elevator_rate: 5,
						storehouse_rate: 5
					},
					5: {
						num: 5,
						miner_rate: 4,
						elevator_rate: 8,
						storehouse_rate: 8
					},
					6: {
						num: 6,
						miner_rate: 4.5,
						elevator_rate: 8,
						storehouse_rate: 8
					},
					40: {
						num: 40,
						miner_rate: 3.5,
						elevator_rate: 8,
						storehouse_rate: 8
					},
					48: {
						num: 48,
						miner_rate: 2,
						elevator_rate: 8,
						storehouse_rate: 8
					},
					144: {
						num: 144,
						miner_rate: 4,
						elevator_rate: 8,
						storehouse_rate: 8
					},
					154: {
						num: 154,
						miner_rate: 6,
						elevator_rate: 8,
						storehouse_rate: 8
					},
					160: {
						num: 160,
						miner_rate: 8,
						elevator_rate: 8,
						storehouse_rate: 8
					}
				},
				check: {
					num: {
						num: "int",
						miner_rate: "float",
						elevator_rate: "float",
						storehouse_rate: "float"
					}
				}
			},
			t.exports.protocol_version = "0.0.1",
			cc._RF.pop()
	},
	{}],
	Cfg_Manager: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "0c3acddYYtLbaH+pJ97rGPs", "Cfg_Manager"),
			t.exports = {
				data: {
					1011: {
						id: 1011,
						range: 1,
						quality: 1,
						skill_type: 4,
						skill_param: 2,
						skill_cd: 5,
						skill_time: 1,
						weight: 25
					},
					1012: {
						id: 1012,
						range: 1,
						quality: 2,
						skill_type: 4,
						skill_param: 4,
						skill_cd: 15,
						skill_time: 3,
						weight: 10
					},
					1013: {
						id: 1013,
						range: 1,
						quality: 3,
						skill_type: 4,
						skill_param: 6,
						skill_cd: 50,
						skill_time: 10,
						weight: 5
					},
					1021: {
						id: 1021,
						range: 1,
						quality: 1,
						skill_type: 5,
						skill_param: 2,
						skill_cd: 5,
						skill_time: 1,
						weight: 25
					},
					1022: {
						id: 1022,
						range: 1,
						quality: 2,
						skill_type: 5,
						skill_param: 4,
						skill_cd: 15,
						skill_time: 3,
						weight: 10
					},
					1023: {
						id: 1023,
						range: 1,
						quality: 3,
						skill_type: 5,
						skill_param: 6,
						skill_cd: 50,
						skill_time: 10,
						weight: 5
					},
					1031: {
						id: 1031,
						range: 1,
						quality: 1,
						skill_type: 6,
						skill_param: .4,
						skill_cd: 5,
						skill_time: 1,
						weight: 25
					},
					1032: {
						id: 1032,
						range: 1,
						quality: 2,
						skill_type: 6,
						skill_param: .7,
						skill_cd: 15,
						skill_time: 3,
						weight: 10
					},
					1033: {
						id: 1033,
						range: 1,
						quality: 3,
						skill_type: 6,
						skill_param: .8,
						skill_cd: 50,
						skill_time: 10,
						weight: 5
					},
					1041: {
						id: 1041,
						range: 1,
						quality: 1,
						skill_type: 7,
						skill_param: 3,
						skill_cd: 5,
						skill_time: 1,
						weight: 25
					},
					1042: {
						id: 1042,
						range: 1,
						quality: 2,
						skill_type: 7,
						skill_param: 5,
						skill_cd: 15,
						skill_time: 3,
						weight: 10
					},
					1043: {
						id: 1043,
						range: 1,
						quality: 3,
						skill_type: 7,
						skill_param: 7,
						skill_cd: 50,
						skill_time: 10,
						weight: 5
					},
					2011: {
						id: 2011,
						range: 2,
						quality: 1,
						skill_type: 1,
						skill_param: 3.5,
						skill_cd: 5,
						skill_time: 1,
						weight: 25
					},
					2012: {
						id: 2012,
						range: 2,
						quality: 2,
						skill_type: 1,
						skill_param: 5.5,
						skill_cd: 15,
						skill_time: 3,
						weight: 10
					},
					2013: {
						id: 2013,
						range: 2,
						quality: 3,
						skill_type: 1,
						skill_param: 7.5,
						skill_cd: 50,
						skill_time: 10,
						weight: 5
					},
					2021: {
						id: 2021,
						range: 2,
						quality: 1,
						skill_type: 2,
						skill_param: 3,
						skill_cd: 5,
						skill_time: 1,
						weight: 25
					},
					2022: {
						id: 2022,
						range: 2,
						quality: 2,
						skill_type: 2,
						skill_param: 5,
						skill_cd: 15,
						skill_time: 3,
						weight: 10
					},
					2023: {
						id: 2023,
						range: 2,
						quality: 3,
						skill_type: 2,
						skill_param: 7,
						skill_cd: 50,
						skill_time: 10,
						weight: 5
					},
					2031: {
						id: 2031,
						range: 2,
						quality: 1,
						skill_type: 3,
						skill_param: .4,
						skill_cd: 5,
						skill_time: 1,
						weight: 25
					},
					2032: {
						id: 2032,
						range: 2,
						quality: 2,
						skill_type: 3,
						skill_param: .7,
						skill_cd: 15,
						skill_time: 3,
						weight: 10
					},
					2033: {
						id: 2033,
						range: 2,
						quality: 3,
						skill_type: 3,
						skill_param: .8,
						skill_cd: 50,
						skill_time: 10,
						weight: 5
					},
					3011: {
						id: 3011,
						range: 3,
						quality: 1,
						skill_type: 8,
						skill_param: 3,
						skill_cd: 5,
						skill_time: 1,
						weight: 25
					},
					3012: {
						id: 3012,
						range: 3,
						quality: 2,
						skill_type: 8,
						skill_param: 5,
						skill_cd: 15,
						skill_time: 3,
						weight: 10
					},
					3013: {
						id: 3013,
						range: 3,
						quality: 3,
						skill_type: 8,
						skill_param: 7,
						skill_cd: 50,
						skill_time: 10,
						weight: 5
					},
					3021: {
						id: 3021,
						range: 3,
						quality: 1,
						skill_type: 9,
						skill_param: 3,
						skill_cd: 5,
						skill_time: 1,
						weight: 25
					},
					3022: {
						id: 3022,
						range: 3,
						quality: 2,
						skill_type: 9,
						skill_param: 5,
						skill_cd: 15,
						skill_time: 3,
						weight: 10
					},
					3023: {
						id: 3023,
						range: 3,
						quality: 3,
						skill_type: 9,
						skill_param: 8,
						skill_cd: 50,
						skill_time: 10,
						weight: 5
					},
					3031: {
						id: 3031,
						range: 3,
						quality: 1,
						skill_type: 10,
						skill_param: .4,
						skill_cd: 5,
						skill_time: 1,
						weight: 25
					},
					3032: {
						id: 3032,
						range: 3,
						quality: 2,
						skill_type: 10,
						skill_param: .7,
						skill_cd: 15,
						skill_time: 3,
						weight: 10
					},
					3033: {
						id: 3033,
						range: 3,
						quality: 3,
						skill_type: 10,
						skill_param: .8,
						skill_cd: 50,
						skill_time: 10,
						weight: 5
					},
					3041: {
						id: 3041,
						range: 3,
						quality: 1,
						skill_type: 11,
						skill_param: 3,
						skill_cd: 5,
						skill_time: 1,
						weight: 25
					},
					3042: {
						id: 3042,
						range: 3,
						quality: 2,
						skill_type: 11,
						skill_param: 5,
						skill_cd: 15,
						skill_time: 3,
						weight: 10
					},
					3043: {
						id: 3043,
						range: 3,
						quality: 3,
						skill_type: 11,
						skill_param: 7,
						skill_cd: 50,
						skill_time: 10,
						weight: 5
					}
				},
				check: {
					id: {
						id: "int",
						range: "int",
						quality: "int",
						skill_type: "int",
						skill_param: "float",
						skill_cd: "int",
						skill_time: "int",
						weight: "int"
					}
				}
			},
			t.exports.protocol_version = "0.0.1",
			cc._RF.pop()
	},
	{}],
	Cfg_Prestige: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "9f2c9TkhyVLKongH10isimr", "Cfg_Prestige"),
			t.exports = {
				data: {
					1: {
						1: {
							miner: 1,
							num: 1,
							currency_type: 1,
							currency: "2.33e+22",
							ability_rate: 4,
							reward: 100
						},
						2: {
							miner: 1,
							num: 2,
							currency_type: 1,
							currency: "5.76e+46",
							ability_rate: 20,
							reward: 100
						},
						3: {
							miner: 1,
							num: 3,
							currency_type: 1,
							currency: "9.13e+62",
							ability_rate: 30,
							reward: 100
						},
						4: {
							miner: 1,
							num: 4,
							currency_type: 1,
							currency: "7.02e+74",
							ability_rate: 45,
							reward: 100
						},
						5: {
							miner: 1,
							num: 5,
							currency_type: 1,
							currency: "1.1e+83",
							ability_rate: 60,
							reward: 100
						}
					},
					2: {
						1: {
							miner: 2,
							num: 1,
							currency_type: 1,
							currency: "1.42e+26",
							ability_rate: 8,
							reward: 100
						},
						2: {
							miner: 2,
							num: 2,
							currency_type: 1,
							currency: "6.89e+58",
							ability_rate: 28,
							reward: 100
						},
						3: {
							miner: 2,
							num: 3,
							currency_type: 1,
							currency: "1.32e+73",
							ability_rate: 42,
							reward: 100
						},
						4: {
							miner: 2,
							num: 4,
							currency_type: 1,
							currency: "4.2e+81",
							ability_rate: 63,
							reward: 100
						},
						5: {
							miner: 2,
							num: 5,
							currency_type: 1,
							currency: "8e+91",
							ability_rate: 90,
							reward: 100
						}
					},
					3: {
						1: {
							miner: 3,
							num: 1,
							currency_type: 1,
							currency: "5.85e+33",
							ability_rate: 12,
							reward: 100
						},
						2: {
							miner: 3,
							num: 2,
							currency_type: 1,
							currency: "3.32e+66",
							ability_rate: 33,
							reward: 100
						},
						3: {
							miner: 3,
							num: 3,
							currency_type: 1,
							currency: "4.62e+78",
							ability_rate: 52,
							reward: 100
						},
						4: {
							miner: 3,
							num: 4,
							currency_type: 1,
							currency: "3.21e+85",
							ability_rate: 76,
							reward: 100
						},
						5: {
							miner: 3,
							num: 5,
							currency_type: 1,
							currency: "2.7e+86",
							ability_rate: 80,
							reward: 100
						}
					},
					4: {
						1: {
							miner: 4,
							num: 1,
							currency_type: 1,
							currency: "2.4e+41",
							ability_rate: 17,
							reward: 100
						},
						2: {
							miner: 4,
							num: 2,
							currency_type: 1,
							currency: "1.66e+71",
							ability_rate: 38,
							reward: 100
						},
						3: {
							miner: 4,
							num: 3,
							currency_type: 1,
							currency: "9.54e+79",
							ability_rate: 57,
							reward: 100
						},
						4: {
							miner: 4,
							num: 4,
							currency_type: 1,
							currency: "4.56e+88",
							ability_rate: 84,
							reward: 100
						},
						5: {
							miner: 4,
							num: 5,
							currency_type: 1,
							currency: "1.1e+96",
							ability_rate: 120,
							reward: 100
						}
					},
					5: {
						1: {
							miner: 5,
							num: 1,
							currency_type: 1,
							currency: "9.8e+53",
							ability_rate: 24,
							reward: 100
						},
						2: {
							miner: 5,
							num: 2,
							currency_type: 1,
							currency: "8.81e+76",
							ability_rate: 48,
							reward: 100
						},
						3: {
							miner: 5,
							num: 3,
							currency_type: 1,
							currency: "3.24e+83",
							ability_rate: 70,
							reward: 100
						},
						4: {
							miner: 5,
							num: 4,
							currency_type: 1,
							currency: "3.14e+93",
							ability_rate: 100,
							reward: 100
						},
						5: {
							miner: 5,
							num: 5,
							currency_type: 1,
							currency: "1.5e+100",
							ability_rate: 140,
							reward: 100
						}
					},
					6: {
						1: {
							miner: 6,
							num: 1,
							currency_type: 2,
							currency: "2.796e+22",
							ability_rate: 4,
							reward: 100
						},
						2: {
							miner: 6,
							num: 2,
							currency_type: 2,
							currency: "6.912e+46",
							ability_rate: 20,
							reward: 100
						},
						3: {
							miner: 6,
							num: 3,
							currency_type: 2,
							currency: "1.0956e+63",
							ability_rate: 30,
							reward: 100
						},
						4: {
							miner: 6,
							num: 4,
							currency_type: 2,
							currency: "8.424e+74",
							ability_rate: 45,
							reward: 100
						},
						5: {
							miner: 6,
							num: 5,
							currency_type: 2,
							currency: "1.32e+83",
							ability_rate: 60,
							reward: 100
						}
					},
					7: {
						1: {
							miner: 7,
							num: 1,
							currency_type: 2,
							currency: "1.704e+26",
							ability_rate: 8,
							reward: 100
						},
						2: {
							miner: 7,
							num: 2,
							currency_type: 2,
							currency: "8.268e+58",
							ability_rate: 28,
							reward: 100
						},
						3: {
							miner: 7,
							num: 3,
							currency_type: 2,
							currency: "1.584e+73",
							ability_rate: 42,
							reward: 100
						},
						4: {
							miner: 7,
							num: 4,
							currency_type: 2,
							currency: "5.04e+81",
							ability_rate: 63,
							reward: 100
						},
						5: {
							miner: 7,
							num: 5,
							currency_type: 2,
							currency: "9.6e+91",
							ability_rate: 90,
							reward: 100
						}
					},
					8: {
						1: {
							miner: 8,
							num: 1,
							currency_type: 2,
							currency: "7.02e+33",
							ability_rate: 12,
							reward: 100
						},
						2: {
							miner: 8,
							num: 2,
							currency_type: 2,
							currency: "3.984e+66",
							ability_rate: 33,
							reward: 100
						},
						3: {
							miner: 8,
							num: 3,
							currency_type: 2,
							currency: "5.544e+78",
							ability_rate: 52,
							reward: 100
						},
						4: {
							miner: 8,
							num: 4,
							currency_type: 2,
							currency: "3.852e+85",
							ability_rate: 76,
							reward: 100
						},
						5: {
							miner: 8,
							num: 5,
							currency_type: 2,
							currency: "3.24e+86",
							ability_rate: 80,
							reward: 100
						}
					},
					9: {
						1: {
							miner: 9,
							num: 1,
							currency_type: 2,
							currency: "2.88e+41",
							ability_rate: 17,
							reward: 100
						},
						2: {
							miner: 9,
							num: 2,
							currency_type: 2,
							currency: "1.992e+71",
							ability_rate: 38,
							reward: 100
						},
						3: {
							miner: 9,
							num: 3,
							currency_type: 2,
							currency: "1.1448e+80",
							ability_rate: 57,
							reward: 100
						},
						4: {
							miner: 9,
							num: 4,
							currency_type: 2,
							currency: "5.472e+88",
							ability_rate: 84,
							reward: 100
						},
						5: {
							miner: 9,
							num: 5,
							currency_type: 2,
							currency: "1.32e+96",
							ability_rate: 120,
							reward: 100
						}
					},
					10: {
						1: {
							miner: 10,
							num: 1,
							currency_type: 2,
							currency: "1.176e+54",
							ability_rate: 24,
							reward: 100
						},
						2: {
							miner: 10,
							num: 2,
							currency_type: 2,
							currency: "1.0572e+77",
							ability_rate: 48,
							reward: 100
						},
						3: {
							miner: 10,
							num: 3,
							currency_type: 2,
							currency: "3.888e+83",
							ability_rate: 70,
							reward: 100
						},
						4: {
							miner: 10,
							num: 4,
							currency_type: 2,
							currency: "3.768e+93",
							ability_rate: 100,
							reward: 100
						},
						5: {
							miner: 10,
							num: 5,
							currency_type: 2,
							currency: "1.8e+100",
							ability_rate: 140,
							reward: 100
						}
					},
					11: {
						1: {
							miner: 11,
							num: 1,
							currency_type: 3,
							currency: "6.99e+22",
							ability_rate: 4,
							reward: 100
						},
						2: {
							miner: 11,
							num: 2,
							currency_type: 3,
							currency: "8.64e+46",
							ability_rate: 20,
							reward: 100
						},
						3: {
							miner: 11,
							num: 3,
							currency_type: 3,
							currency: "1.3695e+63",
							ability_rate: 30,
							reward: 100
						},
						4: {
							miner: 11,
							num: 4,
							currency_type: 3,
							currency: "1.053e+75",
							ability_rate: 45,
							reward: 100
						},
						5: {
							miner: 11,
							num: 5,
							currency_type: 3,
							currency: "1.8e+80",
							ability_rate: 60,
							reward: 100
						}
					},
					12: {
						1: {
							miner: 12,
							num: 1,
							currency_type: 3,
							currency: "4.26e+26",
							ability_rate: 8,
							reward: 100
						},
						2: {
							miner: 12,
							num: 2,
							currency_type: 3,
							currency: "1.0335e+59",
							ability_rate: 28,
							reward: 100
						},
						3: {
							miner: 12,
							num: 3,
							currency_type: 3,
							currency: "1.98e+73",
							ability_rate: 42,
							reward: 100
						},
						4: {
							miner: 12,
							num: 4,
							currency_type: 3,
							currency: "6.3e+81",
							ability_rate: 63,
							reward: 100
						},
						5: {
							miner: 12,
							num: 5,
							currency_type: 3,
							currency: "1.65e+87",
							ability_rate: 80,
							reward: 100
						}
					},
					13: {
						1: {
							miner: 13,
							num: 1,
							currency_type: 3,
							currency: "1.755e+34",
							ability_rate: 12,
							reward: 100
						},
						2: {
							miner: 13,
							num: 2,
							currency_type: 3,
							currency: "4.98e+66",
							ability_rate: 33,
							reward: 100
						},
						3: {
							miner: 13,
							num: 3,
							currency_type: 3,
							currency: "6.93e+78",
							ability_rate: 52,
							reward: 100
						},
						4: {
							miner: 13,
							num: 4,
							currency_type: 3,
							currency: "4.815e+85",
							ability_rate: 76,
							reward: 100
						},
						5: {
							miner: 13,
							num: 5,
							currency_type: 3,
							currency: "1.53e+90",
							ability_rate: 90,
							reward: 100
						}
					},
					14: {
						1: {
							miner: 14,
							num: 1,
							currency_type: 3,
							currency: "7.2e+41",
							ability_rate: 17,
							reward: 100
						},
						2: {
							miner: 14,
							num: 2,
							currency_type: 3,
							currency: "2.49e+71",
							ability_rate: 38,
							reward: 100
						},
						3: {
							miner: 14,
							num: 3,
							currency_type: 3,
							currency: "1.431e+80",
							ability_rate: 57,
							reward: 100
						},
						4: {
							miner: 14,
							num: 4,
							currency_type: 3,
							currency: "6.84e+88",
							ability_rate: 84,
							reward: 100
						},
						5: {
							miner: 14,
							num: 5,
							currency_type: 3,
							currency: "3.3e+96",
							ability_rate: 105,
							reward: 100
						}
					},
					15: {
						1: {
							miner: 15,
							num: 1,
							currency_type: 3,
							currency: "2.94e+54",
							ability_rate: 24,
							reward: 100
						},
						2: {
							miner: 15,
							num: 2,
							currency_type: 3,
							currency: "1.3215e+77",
							ability_rate: 48,
							reward: 100
						},
						3: {
							miner: 15,
							num: 3,
							currency_type: 3,
							currency: "4.86e+83",
							ability_rate: 70,
							reward: 100
						},
						4: {
							miner: 15,
							num: 4,
							currency_type: 3,
							currency: "4.71e+93",
							ability_rate: 100,
							reward: 100
						},
						5: {
							miner: 15,
							num: 5,
							currency_type: 3,
							currency: "4.8e+99",
							ability_rate: 110,
							reward: 100
						}
					},
					16: {
						1: {
							miner: 16,
							num: 1,
							currency_type: 4,
							currency: "6.99e+23",
							ability_rate: 4,
							reward: 100
						},
						2: {
							miner: 16,
							num: 2,
							currency_type: 4,
							currency: "1.728e+48",
							ability_rate: 20,
							reward: 100
						},
						3: {
							miner: 16,
							num: 3,
							currency_type: 4,
							currency: "2.739e+64",
							ability_rate: 30,
							reward: 100
						},
						4: {
							miner: 16,
							num: 4,
							currency_type: 4,
							currency: "2.106e+76",
							ability_rate: 45,
							reward: 100
						},
						5: {
							miner: 16,
							num: 5,
							currency_type: 4,
							currency: "3.6e+81",
							ability_rate: 60,
							reward: 100
						}
					},
					17: {
						1: {
							miner: 17,
							num: 1,
							currency_type: 4,
							currency: "4.26e+27",
							ability_rate: 8,
							reward: 100
						},
						2: {
							miner: 17,
							num: 2,
							currency_type: 4,
							currency: "2.067e+60",
							ability_rate: 28,
							reward: 100
						},
						3: {
							miner: 17,
							num: 3,
							currency_type: 4,
							currency: "3.96e+74",
							ability_rate: 42,
							reward: 100
						},
						4: {
							miner: 17,
							num: 4,
							currency_type: 4,
							currency: "1.26e+83",
							ability_rate: 63,
							reward: 100
						},
						5: {
							miner: 17,
							num: 5,
							currency_type: 4,
							currency: "3.3e+88",
							ability_rate: 80,
							reward: 100
						}
					},
					18: {
						1: {
							miner: 18,
							num: 1,
							currency_type: 4,
							currency: "1.755e+35",
							ability_rate: 12,
							reward: 100
						},
						2: {
							miner: 18,
							num: 2,
							currency_type: 4,
							currency: "9.96e+67",
							ability_rate: 33,
							reward: 100
						},
						3: {
							miner: 18,
							num: 3,
							currency_type: 4,
							currency: "1.386e+80",
							ability_rate: 52,
							reward: 100
						},
						4: {
							miner: 18,
							num: 4,
							currency_type: 4,
							currency: "9.63e+86",
							ability_rate: 76,
							reward: 100
						},
						5: {
							miner: 18,
							num: 5,
							currency_type: 4,
							currency: "3.06e+91",
							ability_rate: 90,
							reward: 100
						}
					},
					19: {
						1: {
							miner: 19,
							num: 1,
							currency_type: 4,
							currency: "7.2e+42",
							ability_rate: 17,
							reward: 100
						},
						2: {
							miner: 19,
							num: 2,
							currency_type: 4,
							currency: "4.98e+72",
							ability_rate: 38,
							reward: 100
						},
						3: {
							miner: 19,
							num: 3,
							currency_type: 4,
							currency: "2.862e+81",
							ability_rate: 57,
							reward: 100
						},
						4: {
							miner: 19,
							num: 4,
							currency_type: 4,
							currency: "1.368e+90",
							ability_rate: 84,
							reward: 100
						},
						5: {
							miner: 19,
							num: 5,
							currency_type: 4,
							currency: "6.6e+97",
							ability_rate: 105,
							reward: 100
						}
					},
					20: {
						1: {
							miner: 20,
							num: 1,
							currency_type: 4,
							currency: "2.94e+55",
							ability_rate: 24,
							reward: 100
						},
						2: {
							miner: 20,
							num: 2,
							currency_type: 4,
							currency: "2.643e+78",
							ability_rate: 48,
							reward: 100
						},
						3: {
							miner: 20,
							num: 3,
							currency_type: 4,
							currency: "9.72e+84",
							ability_rate: 70,
							reward: 100
						},
						4: {
							miner: 20,
							num: 4,
							currency_type: 4,
							currency: "9.42e+94",
							ability_rate: 100,
							reward: 100
						},
						5: {
							miner: 20,
							num: 5,
							currency_type: 4,
							currency: "9.6e+100",
							ability_rate: 110,
							reward: 100
						}
					}
				},
				check: {
					miner: {
						num: {
							miner: "#int",
							num: "#int",
							currency_type: "int",
							currency: "string",
							ability_rate: "int",
							reward: "int"
						}
					}
				}
			},
			t.exports.protocol_version = "0.0.1",
			cc._RF.pop()
	},
	{}],
	Cfg_SeamMine: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "2bb69gzPHNDEaPF17icw2bD", "Cfg_SeamMine"),
			t.exports = {
				data: {
					1: {
						1: {
							miner: 1,
							deep: 1,
							lv_up: 800,
							unlock_type: 1,
							unlock_consume: "0",
							ability: "20",
							upgrade_type: 1,
							upgrade_consume: "10",
							ability_rate: ["1-1.1", "21-1.08", "101-1.07", "401-1.15"],
							consume_rate: ["1-1.16", "21-1.148", "101-1.1", "401-1.199"],
							reward_stage: ["10-2", "25-2", "50-2", "100-2", "200-2", "300-2", "400-2", "500-2", "600-2", "700-2", "800-2"],
							reward_stage_reborn: ["10-1", "25-1", "50-1", "100-1", "200-1", "300-1", "400-1", "500-1", "600-1", "700-1", "800-1"]
						},
						2: {
							miner: 1,
							deep: 2,
							lv_up: 800,
							unlock_type: 1,
							ability: "1000",
							upgrade_type: 1,
							upgrade_consume: "1000",
							ability_rate: ["1-1.1", "21-1.08", "101-1.07", "401-1.15"],
							consume_rate: ["1-1.16", "21-1.146", "101-1.098", "401-1.199"],
							reward_stage: ["10-2", "25-2", "50-2", "100-2", "200-2", "300-2", "400-2", "500-2", "600-2", "700-2", "800-2"],
							reward_stage_reborn: ["10-1", "25-1", "50-1", "100-1", "200-1", "300-1", "400-1", "500-1", "600-1", "700-1", "800-1"]
						},
						3: {
							miner: 1,
							deep: 3,
							lv_up: 800,
							unlock_type: 1,
							ability: "10000",
							upgrade_type: 1,
							upgrade_consume: "30000",
							ability_rate: ["1-1.1", "21-1.08", "101-1.07", "401-1.15"],
							consume_rate: ["1-1.16", "21-1.144", "101-1.096", "401-1.199"],
							reward_stage: ["10-2", "25-2", "50-2", "100-2", "200-2", "300-2", "400-2", "500-2", "600-2", "700-2", "800-2"],
							reward_stage_reborn: ["10-1", "25-1", "50-1", "100-1", "200-1", "300-1", "400-1", "500-1", "600-1", "700-1", "800-1"]
						},
						4: {
							miner: 1,
							deep: 4,
							lv_up: 800,
							unlock_type: 1,
							ability: "100000",
							upgrade_type: 1,
							upgrade_consume: "600000",
							ability_rate: ["1-1.1", "21-1.08", "101-1.07", "401-1.15"],
							consume_rate: ["1-1.16", "21-1.142", "101-1.094", "401-1.199"],
							reward_stage: ["10-2", "25-2", "50-2", "100-2", "200-2", "300-2", "400-2", "500-2", "600-2", "700-2", "800-2"],
							reward_stage_reborn: ["10-1", "25-1", "50-1", "100-1", "200-1", "300-1", "400-1", "500-1", "600-1", "700-1", "800-1"]
						},
						5: {
							miner: 1,
							deep: 5,
							lv_up: 800,
							unlock_type: 1,
							ability: "1000000",
							upgrade_type: 1,
							upgrade_consume: "12000000",
							ability_rate: ["1-1.1", "21-1.08", "101-1.07", "401-1.15"],
							consume_rate: ["1-1.16", "21-1.14", "101-1.092", "401-1.199"],
							reward_stage: ["10-2", "25-2", "50-2", "100-2", "200-2", "300-2", "400-2", "500-2", "600-2", "700-2", "800-2"],
							reward_stage_reborn: ["10-1", "25-1", "50-1", "100-1", "200-1", "300-1", "400-1", "500-1", "600-1", "700-1", "800-1"]
						},
						6: {
							miner: 1,
							deep: 6,
							lv_up: 800,
							unlock_type: 1,
							unlock_consume: "240000000",
							unlock_time: 60,
							unlock_cash: 58,
							ability: "300000000",
							upgrade_type: 1,
							upgrade_consume: "2400000000",
							ability_rate: ["1-1.1", "21-1.08", "101-1.07", "401-1.15"],
							consume_rate: ["1-1.16", "21-1.138", "101-1.09", "401-1.199"],
							reward_stage: ["10-2", "25-2", "50-2", "100-2", "200-2", "300-2", "400-2", "500-2", "600-2", "700-2", "800-2"],
							reward_stage_reborn: ["10-1", "25-1", "50-1", "100-1", "200-1", "300-1", "400-1", "500-1", "600-1", "700-1", "800-1"]
						},
						7: {
							miner: 1,
							deep: 7,
							lv_up: 800,
							unlock_type: 1,
							ability: "3000000000",
							upgrade_type: 1,
							upgrade_consume: "48000000000",
							ability_rate: ["1-1.1", "21-1.08", "101-1.07", "401-1.15"],
							consume_rate: ["1-1.16", "21-1.136", "101-1.088", "401-1.199"],
							reward_stage: ["10-2", "25-2", "50-2", "100-2", "200-2", "300-2", "400-2", "500-2", "600-2", "700-2", "800-2"],
							reward_stage_reborn: ["10-1", "25-1", "50-1", "100-1", "200-1", "300-1", "400-1", "500-1", "600-1", "700-1", "800-1"]
						},
						8: {
							miner: 1,
							deep: 8,
							lv_up: 800,
							unlock_type: 1,
							ability: "30000000000",
							upgrade_type: 1,
							upgrade_consume: "960000000000",
							ability_rate: ["1-1.1", "21-1.08", "101-1.07", "401-1.15"],
							consume_rate: ["1-1.16", "21-1.134", "101-1.086", "401-1.199"],
							reward_stage: ["10-2", "25-2", "50-2", "100-2", "200-2", "300-2", "400-2", "500-2", "600-2", "700-2", "800-2"],
							reward_stage_reborn: ["10-1", "25-1", "50-1", "100-1", "200-1", "300-1", "400-1", "500-1", "600-1", "700-1", "800-1"]
						},
						9: {
							miner: 1,
							deep: 9,
							lv_up: 800,
							unlock_type: 1,
							ability: "300000000000",
							upgrade_type: 1,
							upgrade_consume: "19200000000000",
							ability_rate: ["1-1.1", "21-1.08", "101-1.07", "401-1.15"],
							consume_rate: ["1-1.16", "21-1.132", "101-1.084", "401-1.199"],
							reward_stage: ["10-2", "25-2", "50-2", "100-2", "200-2", "300-2", "400-2", "500-2", "600-2", "700-2", "800-2"],
							reward_stage_reborn: ["10-1", "25-1", "50-1", "100-1", "200-1", "300-1", "400-1", "500-1", "600-1", "700-1", "800-1"]
						},
						10: {
							miner: 1,
							deep: 10,
							lv_up: 800,
							unlock_type: 1,
							ability: "3000000000000",
							upgrade_type: 1,
							upgrade_consume: "384000000000000",
							ability_rate: ["1-1.1", "21-1.08", "101-1.07", "401-1.15"],
							consume_rate: ["1-1.16", "21-1.13", "101-1.082", "401-1.199"],
							reward_stage: ["10-2", "25-2", "50-2", "100-2", "200-2", "300-2", "400-2", "500-2", "600-2", "700-2", "800-2"],
							reward_stage_reborn: ["10-1", "25-1", "50-1", "100-1", "200-1", "300-1", "400-1", "500-1", "600-1", "700-1", "800-1"]
						},
						11: {
							miner: 1,
							deep: 11,
							lv_up: 800,
							unlock_type: 1,
							unlock_consume: "1.53e+16",
							unlock_time: 360,
							unlock_cash: 239,
							ability: "6000000000000000",
							upgrade_type: 1,
							upgrade_consume: "7.68e+17",
							ability_rate: ["1-1.1", "21-1.08", "101-1.07", "401-1.15"],
							consume_rate: ["1-1.16", "21-1.128", "101-1.08", "401-1.199"],
							reward_stage: ["10-2", "25-2", "50-2", "100-2", "200-2", "300-2", "400-2", "500-2", "600-2", "700-2", "800-2"],
							reward_stage_reborn: ["10-1", "25-1", "50-1", "100-1", "200-1", "300-1", "400-1", "500-1", "600-1", "700-1", "800-1"]
						},
						12: {
							miner: 1,
							deep: 12,
							lv_up: 800,
							unlock_type: 1,
							ability: "3e+17",
							upgrade_type: 1,
							upgrade_consume: "3.072e+19",
							ability_rate: ["1-1.1", "21-1.08", "101-1.07", "401-1.15"],
							consume_rate: ["1-1.16", "21-1.126", "101-1.08", "401-1.199"],
							reward_stage: ["10-2", "25-2", "50-2", "100-2", "200-2", "300-2", "400-2", "500-2", "600-2", "700-2", "800-2"],
							reward_stage_reborn: ["10-1", "25-1", "50-1", "100-1", "200-1", "300-1", "400-1", "500-1", "600-1", "700-1", "800-1"]
						},
						13: {
							miner: 1,
							deep: 13,
							lv_up: 800,
							unlock_type: 1,
							ability: "3e+18",
							upgrade_type: 1,
							upgrade_consume: "1.536e+21",
							ability_rate: ["1-1.1", "21-1.08", "101-1.07", "401-1.15"],
							consume_rate: ["1-1.16", "21-1.124", "101-1.08", "401-1.199"],
							reward_stage: ["10-2", "25-2", "50-2", "100-2", "200-2", "300-2", "400-2", "500-2", "600-2", "700-2", "800-2"],
							reward_stage_reborn: ["10-1", "25-1", "50-1", "100-1", "200-1", "300-1", "400-1", "500-1", "600-1", "700-1", "800-1"]
						},
						14: {
							miner: 1,
							deep: 14,
							lv_up: 800,
							unlock_type: 1,
							ability: "3e+19",
							upgrade_type: 1,
							upgrade_consume: "3.072e+22",
							ability_rate: ["1-1.1", "21-1.08", "101-1.07", "401-1.15"],
							consume_rate: ["1-1.16", "21-1.122", "101-1.08", "401-1.199"],
							reward_stage: ["10-2", "25-2", "50-2", "100-2", "200-2", "300-2", "400-2", "500-2", "600-2", "700-2", "800-2"],
							reward_stage_reborn: ["10-1", "25-1", "50-1", "100-1", "200-1", "300-1", "400-1", "500-1", "600-1", "700-1", "800-1"]
						},
						15: {
							miner: 1,
							deep: 15,
							lv_up: 800,
							unlock_type: 1,
							ability: "3e+20",
							upgrade_type: 1,
							upgrade_consume: "6.144e+23",
							ability_rate: ["1-1.1", "21-1.08", "101-1.07", "401-1.15"],
							consume_rate: ["1-1.16", "21-1.12", "101-1.08", "401-1.199"],
							reward_stage: ["10-2", "25-2", "50-2", "100-2", "200-2", "300-2", "400-2", "500-2", "600-2", "700-2", "800-2"],
							reward_stage_reborn: ["10-1", "25-1", "50-1", "100-1", "200-1", "300-1", "400-1", "500-1", "600-1", "700-1", "800-1"]
						},
						16: {
							miner: 1,
							deep: 16,
							lv_up: 800,
							unlock_type: 1,
							unlock_consume: "3.68e+25",
							unlock_time: 1440,
							unlock_cash: 714,
							ability: "6e+24",
							upgrade_type: 1,
							upgrade_consume: "1.2288e+28",
							ability_rate: ["1-1.1", "21-1.08", "101-1.07", "401-1.15"],
							consume_rate: ["1-1.16", "21-1.118", "101-1.08", "401-1.199"],
							reward_stage: ["10-2", "25-2", "50-2", "100-2", "200-2", "300-2", "400-2", "500-2", "600-2", "700-2", "800-2"],
							reward_stage_reborn: ["10-1", "25-1", "50-1", "100-1", "200-1", "300-1", "400-1", "500-1", "600-1", "700-1", "800-1"]
						},
						17: {
							miner: 1,
							deep: 17,
							lv_up: 800,
							unlock_type: 1,
							ability: "6e+25",
							upgrade_type: 1,
							upgrade_consume: "2.4576e+29",
							ability_rate: ["1-1.1", "21-1.08", "101-1.07", "401-1.15"],
							consume_rate: ["1-1.16", "21-1.116", "101-1.08", "401-1.199"],
							reward_stage: ["10-2", "25-2", "50-2", "100-2", "200-2", "300-2", "400-2", "500-2", "600-2", "700-2", "800-2"],
							reward_stage_reborn: ["10-1", "25-1", "50-1", "100-1", "200-1", "300-1", "400-1", "500-1", "600-1", "700-1", "800-1"]
						},
						18: {
							miner: 1,
							deep: 18,
							lv_up: 800,
							unlock_type: 1,
							ability: "6e+26",
							upgrade_type: 1,
							upgrade_consume: "4.9152e+30",
							ability_rate: ["1-1.1", "21-1.08", "101-1.07", "401-1.15"],
							consume_rate: ["1-1.16", "21-1.114", "101-1.08", "401-1.199"],
							reward_stage: ["10-2", "25-2", "50-2", "100-2", "200-2", "300-2", "400-2", "500-2", "600-2", "700-2", "800-2"],
							reward_stage_reborn: ["10-1", "25-1", "50-1", "100-1", "200-1", "300-1", "400-1", "500-1", "600-1", "700-1", "800-1"]
						},
						19: {
							miner: 1,
							deep: 19,
							lv_up: 800,
							unlock_type: 1,
							ability: "6e+27",
							upgrade_type: 1,
							upgrade_consume: "9.8304e+31",
							ability_rate: ["1-1.1", "21-1.08", "101-1.07", "401-1.15"],
							consume_rate: ["1-1.16", "21-1.112", "101-1.08", "401-1.199"],
							reward_stage: ["10-2", "25-2", "50-2", "100-2", "200-2", "300-2", "400-2", "500-2", "600-2", "700-2", "800-2"],
							reward_stage_reborn: ["10-1", "25-1", "50-1", "100-1", "200-1", "300-1", "400-1", "500-1", "600-1", "700-1", "800-1"]
						},
						20: {
							miner: 1,
							deep: 20,
							lv_up: 800,
							unlock_type: 1,
							ability: "6e+28",
							upgrade_type: 1,
							upgrade_consume: "1.96608e+33",
							ability_rate: ["1-1.1", "21-1.08", "101-1.07", "401-1.15"],
							consume_rate: ["1-1.16", "21-1.11", "101-1.08", "401-1.199"],
							reward_stage: ["10-2", "25-2", "50-2", "100-2", "200-2", "300-2", "400-2", "500-2", "600-2", "700-2", "800-2"],
							reward_stage_reborn: ["10-1", "25-1", "50-1", "100-1", "200-1", "300-1", "400-1", "500-1", "600-1", "700-1", "800-1"]
						},
						21: {
							miner: 1,
							deep: 21,
							lv_up: 800,
							unlock_type: 1,
							unlock_consume: "1.76e+37",
							unlock_time: 4320,
							unlock_cash: 1702,
							ability: "6e+32",
							upgrade_type: 1,
							upgrade_consume: "1.96608e+37",
							ability_rate: ["1-1.1", "21-1.08", "101-1.07", "401-1.15"],
							consume_rate: ["1-1.16", "21-1.108", "101-1.08", "401-1.199"],
							reward_stage: ["10-2", "25-2", "50-2", "100-2", "200-2", "300-2", "400-2", "500-2", "600-2", "700-2", "800-2"],
							reward_stage_reborn: ["10-1", "25-1", "50-1", "100-1", "200-1", "300-1", "400-1", "500-1", "600-1", "700-1", "800-1"]
						},
						22: {
							miner: 1,
							deep: 22,
							lv_up: 800,
							unlock_type: 1,
							ability: "4.5e+35",
							upgrade_type: 1,
							upgrade_consume: "1.96608e+40",
							ability_rate: ["1-1.1", "21-1.08", "101-1.07", "401-1.15"],
							consume_rate: ["1-1.16", "21-1.106", "101-1.08", "401-1.199"],
							reward_stage: ["10-2", "25-2", "50-2", "100-2", "200-2", "300-2", "400-2", "500-2", "600-2", "700-2", "800-2"],
							reward_stage_reborn: ["10-1", "25-1", "50-1", "100-1", "200-1", "300-1", "400-1", "500-1", "600-1", "700-1", "800-1"]
						},
						23: {
							miner: 1,
							deep: 23,
							lv_up: 800,
							unlock_type: 1,
							ability: "3.375e+38",
							upgrade_type: 1,
							upgrade_consume: "1.96608e+43",
							ability_rate: ["1-1.1", "21-1.08", "101-1.07", "401-1.15"],
							consume_rate: ["1-1.16", "21-1.104", "101-1.08", "401-1.199"],
							reward_stage: ["10-2", "25-2", "50-2", "100-2", "200-2", "300-2", "400-2", "500-2", "600-2", "700-2", "800-2"],
							reward_stage_reborn: ["10-1", "25-1", "50-1", "100-1", "200-1", "300-1", "400-1", "500-1", "600-1", "700-1", "800-1"]
						},
						24: {
							miner: 1,
							deep: 24,
							lv_up: 800,
							unlock_type: 1,
							ability: "2.53125e+41",
							upgrade_type: 1,
							upgrade_consume: "1.96608e+46",
							ability_rate: ["1-1.1", "21-1.08", "101-1.07", "401-1.15"],
							consume_rate: ["1-1.16", "21-1.104", "101-1.08", "401-1.199"],
							reward_stage: ["10-2", "25-2", "50-2", "100-2", "200-2", "300-2", "400-2", "500-2", "600-2", "700-2", "800-2"],
							reward_stage_reborn: ["10-1", "25-1", "50-1", "100-1", "200-1", "300-1", "400-1", "500-1", "600-1", "700-1", "800-1"]
						},
						25: {
							miner: 1,
							deep: 25,
							lv_up: 800,
							unlock_type: 1,
							ability: "1.893e+44",
							upgrade_type: 1,
							upgrade_consume: "1.96608e+49",
							ability_rate: ["1-1.1", "21-1.08", "101-1.07", "401-1.15"],
							consume_rate: ["1-1.16", "21-1.104", "101-1.08", "401-1.199"],
							reward_stage: ["10-2", "25-2", "50-2", "100-2", "200-2", "300-2", "400-2", "500-2", "600-2", "700-2", "800-2"],
							reward_stage_reborn: ["10-1", "25-1", "50-1", "100-1", "200-1", "300-1", "400-1", "500-1", "600-1", "700-1", "800-1"]
						},
						26: {
							miner: 1,
							deep: 26,
							lv_up: 800,
							unlock_type: 1,
							unlock_consume: "1.47e+53",
							unlock_time: 7200,
							unlock_cash: 2539,
							ability: "1.893e+48",
							upgrade_type: 1,
							upgrade_consume: "1.966608e+53",
							ability_rate: ["1-1.1", "21-1.08", "101-1.07", "401-1.15"],
							consume_rate: ["1-1.16", "21-1.104", "101-1.08", "401-1.199"],
							reward_stage: ["10-2", "25-2", "50-2", "100-2", "200-2", "300-2", "400-2", "500-2", "600-2", "700-2", "800-2"],
							reward_stage_reborn: ["10-1", "25-1", "50-1", "100-1", "200-1", "300-1", "400-1", "500-1", "600-1", "700-1", "800-1"]
						},
						27: {
							miner: 1,
							deep: 27,
							lv_up: 800,
							unlock_type: 1,
							ability: "1.14e+51",
							upgrade_type: 1,
							upgrade_consume: "1.966608e+56",
							ability_rate: ["1-1.1", "21-1.08", "101-1.07", "401-1.15"],
							consume_rate: ["1-1.16", "21-1.104", "101-1.08", "401-1.199"],
							reward_stage: ["10-2", "25-2", "50-2", "100-2", "200-2", "300-2", "400-2", "500-2", "600-2", "700-2", "800-2"],
							reward_stage_reborn: ["10-1", "25-1", "50-1", "100-1", "200-1", "300-1", "400-1", "500-1", "600-1", "700-1", "800-1"]
						},
						28: {
							miner: 1,
							deep: 28,
							lv_up: 800,
							unlock_type: 1,
							ability: "1.05e+54",
							upgrade_type: 1,
							upgrade_consume: "2.94e+59",
							ability_rate: ["1-1.1", "21-1.08", "101-1.07", "401-1.15"],
							consume_rate: ["1-1.16", "21-1.104", "101-1.08", "401-1.199"],
							reward_stage: ["10-2", "25-2", "50-2", "100-2", "200-2", "300-2", "400-2", "500-2", "600-2", "700-2", "800-2"],
							reward_stage_reborn: ["10-1", "25-1", "50-1", "100-1", "200-1", "300-1", "400-1", "500-1", "600-1", "700-1", "800-1"]
						},
						29: {
							miner: 1,
							deep: 29,
							lv_up: 800,
							unlock_type: 1,
							ability: "7.867e+56",
							upgrade_type: 1,
							upgrade_consume: "5.89e+62",
							ability_rate: ["1-1.1", "21-1.08", "101-1.07", "401-1.15"],
							consume_rate: ["1-1.16", "21-1.104", "101-1.08", "401-1.199"],
							reward_stage: ["10-2", "25-2", "50-2", "100-2", "200-2", "300-2", "400-2", "500-2", "600-2", "700-2", "800-2"],
							reward_stage_reborn: ["10-1", "25-1", "50-1", "100-1", "200-1", "300-1", "400-1", "500-1", "600-1", "700-1", "800-1"]
						},
						30: {
							miner: 1,
							deep: 30,
							lv_up: 800,
							unlock_type: 1,
							ability: "5.9e+59",
							upgrade_type: 1,
							upgrade_consume: "1.47e+66",
							ability_rate: ["1-1.1", "21-1.08", "101-1.07", "401-1.15"],
							consume_rate: ["1-1.16", "21-1.104", "101-1.08", "401-1.199"],
							reward_stage: ["10-2", "25-2", "50-2", "100-2", "200-2", "300-2", "400-2", "500-2", "600-2", "700-2", "800-2"],
							reward_stage_reborn: ["10-1", "25-1", "50-1", "100-1", "200-1", "300-1", "400-1", "500-1", "600-1", "700-1", "800-1"]
						}
					}
				},
				check: {
					miner: {
						deep: {
							miner: "#int",
							deep: "#int",
							lv_up: "int",
							unlock_type: "int",
							unlock_consume: "string",
							unlock_time: "int",
							unlock_cash: "int",
							ability: "string",
							upgrade_type: "int",
							upgrade_consume: "string",
							ability_rate: "string|arr",
							consume_rate: "string|arr",
							reward_stage: "string|arr",
							reward_stage_reborn: "string|arr"
						}
					}
				}
			},
			t.exports.protocol_version = "0.0.1",
			cc._RF.pop()
	},
	{}],
	Cfg_SeamMoveSpeed: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "46493xAn5JBW5WtvMLFe021", "Cfg_SeamMoveSpeed"),
			t.exports = {
				data: {
					1: {
						lv: 1,
						move_speed: 2
					},
					85: {
						lv: 85,
						move_speed: 3
					},
					265: {
						lv: 265,
						move_speed: 4
					},
					560: {
						lv: 560,
						move_speed: 5
					}
				},
				check: {
					lv: {
						lv: "int",
						move_speed: "int"
					}
				}
			},
			t.exports.protocol_version = "0.0.1",
			cc._RF.pop()
	},
	{}],
	Cfg_SeamPowerUp: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "eaea6yHhNJLkobCcIFrqhAq", "Cfg_SeamPowerUp"),
			t.exports = {
				data: {
					25: {
						lv: 25,
						ability_rate: 2,
						"1-1.1|21-1.08|101-1.07|401-1.15": "101"
					},
					50: {
						lv: 50,
						ability_rate: 2,
						"1-1.1|21-1.08|101-1.07|401-1.15": "401"
					},
					100: {
						lv: 100,
						ability_rate: 2
					},
					200: {
						lv: 200,
						ability_rate: 2
					},
					300: {
						lv: 300,
						ability_rate: 2
					},
					400: {
						lv: 400,
						ability_rate: 2
					},
					500: {
						lv: 500,
						ability_rate: 2
					},
					600: {
						lv: 600,
						ability_rate: 2
					},
					700: {
						lv: 700,
						ability_rate: 2
					},
					800: {
						lv: 800,
						ability_rate: 2
					}
				},
				check: {
					lv: {
						lv: "int",
						ability_rate: "int",
						"1-1.1|21-1.08|101-1.07|401-1.15": "1"
					}
				}
			},
			t.exports.protocol_version = "0.0.1",
			cc._RF.pop()
	},
	{}],
	Cfg_SeamWorkerNum: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "ce536jVrxNJG6ob2aA4habI", "Cfg_SeamWorkerNum"),
			t.exports = {
				data: {
					1: {
						lv: 1,
						worker_num: 1
					},
					10: {
						lv: 10,
						worker_num: 2
					},
					50: {
						lv: 50,
						worker_num: 3
					},
					100: {
						lv: 100,
						worker_num: 4
					},
					200: {
						lv: 200,
						worker_num: 5
					},
					400: {
						lv: 400,
						worker_num: 6
					}
				},
				check: {
					lv: {
						lv: "int",
						worker_num: "int"
					}
				}
			},
			t.exports.protocol_version = "0.0.1",
			cc._RF.pop()
	},
	{}],
	Cfg_Shop: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "618b4UgTOtDJJi3qtN1n/K6", "Cfg_Shop"),
			t.exports = {
				data: {
					1: {
						1: {
							shop_type: 1,
							rank: 1,
							item_id: 1005,
							item_num: 1,
							currency_type: 1,
							currency_num: 70
						},
						2: {
							shop_type: 1,
							rank: 2,
							item_id: 1001,
							item_num: 1,
							currency_type: 1,
							currency_num: 400
						},
						3: {
							shop_type: 1,
							rank: 3,
							item_id: 1026,
							item_num: 1,
							currency_type: 1,
							currency_num: 2700
						},
						4: {
							shop_type: 1,
							rank: 4,
							item_id: 1014,
							item_num: 1,
							currency_type: 1,
							currency_num: 300
						},
						5: {
							shop_type: 1,
							rank: 5,
							item_id: 1025,
							item_num: 1,
							currency_type: 1,
							currency_num: 1800
						},
						6: {
							shop_type: 1,
							rank: 6,
							item_id: 1003,
							item_num: 1,
							currency_type: 1,
							currency_num: 3e3
						}
					},
					2: {
						7: {
							shop_type: 2,
							rank: 7,
							item_id: 2001,
							item_num: 1,
							currency_type: 1,
							currency_num: 50
						},
						8: {
							shop_type: 2,
							rank: 8,
							item_id: 2004,
							item_num: 1,
							currency_type: 1,
							currency_num: 500
						},
						9: {
							shop_type: 2,
							rank: 9,
							item_id: 2005,
							item_num: 1,
							currency_type: 1,
							currency_num: 2e3
						}
					}
				},
				check: {
					shop_type: {
						rank: {
							shop_type: "#int",
							rank: "#int",
							item_id: "int",
							item_num: "int",
							currency_type: "int",
							currency_num: "int"
						}
					}
				}
			},
			t.exports.protocol_version = "0.0.1",
			cc._RF.pop()
	},
	{}],
	Cfg_Sign: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "f2fa3c6OGRFuK6RxrTXUyT/", "Cfg_Sign"),
			t.exports = {
				data: {
					1: {
						day: 1,
						reward: ["6001-30"],
						extra_reward: []
					},
					2: {
						day: 2,
						reward: ["1014-1"],
						extra_reward: []
					},
					3: {
						day: 3,
						reward: ["6001-100"],
						extra_reward: []
					},
					4: {
						day: 4,
						reward: ["1005-1"],
						extra_reward: []
					},
					5: {
						day: 5,
						reward: ["2001-1"],
						extra_reward: []
					},
					6: {
						day: 6,
						reward: ["6001-30"],
						extra_reward: []
					},
					7: {
						day: 7,
						reward: ["1008-1"],
						extra_reward: ["6001-100", "2004-1", "1021-1"]
					},
					8: {
						day: 8,
						reward: ["6001-30"],
						extra_reward: []
					},
					9: {
						day: 9,
						reward: ["1005-1"],
						extra_reward: []
					},
					10: {
						day: 10,
						reward: ["6001-45"],
						extra_reward: []
					},
					11: {
						day: 11,
						reward: ["2001-1"],
						extra_reward: []
					},
					12: {
						day: 12,
						reward: ["6001-30"],
						extra_reward: []
					},
					13: {
						day: 13,
						reward: ["1005-1"],
						extra_reward: []
					},
					14: {
						day: 14,
						reward: ["6001-45"],
						extra_reward: ["6001-100", "1010-1"]
					},
					15: {
						day: 15,
						reward: ["2001-1"],
						extra_reward: []
					},
					16: {
						day: 16,
						reward: ["6001-30"],
						extra_reward: []
					},
					17: {
						day: 17,
						reward: ["1005-1"],
						extra_reward: []
					},
					18: {
						day: 18,
						reward: ["6001-45"],
						extra_reward: []
					},
					19: {
						day: 19,
						reward: ["2001-1"],
						extra_reward: []
					},
					20: {
						day: 20,
						reward: ["6001-30"],
						extra_reward: []
					},
					21: {
						day: 21,
						reward: ["1008-1"],
						extra_reward: ["6001-100", "2004-1"]
					},
					22: {
						day: 22,
						reward: ["6001-45"],
						extra_reward: []
					},
					23: {
						day: 23,
						reward: ["2001-1"],
						extra_reward: []
					},
					24: {
						day: 24,
						reward: ["6001-30"],
						extra_reward: []
					},
					25: {
						day: 25,
						reward: ["1005-1"],
						extra_reward: []
					},
					26: {
						day: 26,
						reward: ["6001-45"],
						extra_reward: []
					},
					27: {
						day: 27,
						reward: ["2001-1"],
						extra_reward: []
					},
					28: {
						day: 28,
						reward: ["6001-30"],
						extra_reward: []
					},
					29: {
						day: 29,
						reward: ["6001-45"],
						extra_reward: []
					},
					30: {
						day: 30,
						reward: ["1008-1"],
						extra_reward: ["6001-200", "2003-1", "1023-1"]
					}
				},
				check: {
					day: {
						day: "int",
						reward: "string|arr",
						extra_reward: "string|arr"
					}
				}
			},
			t.exports.protocol_version = "0.0.1",
			cc._RF.pop()
	},
	{}],
	Cfg_StoreConsumeCoefficient: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "1c2f5viJVJOHoiOe1pouBCm", "Cfg_StoreConsumeCoefficient"),
			t.exports = {
				data: {
					1: {
						lv: 1,
						rate: 1
					},
					2: {
						lv: 2,
						rate: 1.2
					},
					21: {
						lv: 21,
						rate: 1.1293
					},
					601: {
						lv: 601,
						rate: 1.1393
					},
					801: {
						lv: 801,
						rate: 1.098
					}
				},
				check: {
					lv: {
						lv: "int",
						rate: "float"
					}
				}
			},
			t.exports.protocol_version = "0.0.1",
			cc._RF.pop()
	},
	{}],
	Cfg_StoreMoveSpeed: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "9db39xRxxlCk6WTcdtG8qQ+", "Cfg_StoreMoveSpeed"),
			t.exports = {
				data: {
					1: {
						lv: 1,
						speed: 2
					},
					500: {
						lv: 500,
						speed: 3
					},
					1500: {
						lv: 1500,
						speed: 4
					}
				},
				check: {
					lv: {
						lv: "int",
						speed: "int"
					}
				}
			},
			t.exports.protocol_version = "0.0.1",
			cc._RF.pop()
	},
	{}],
	Cfg_StoreOverview: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "c5debAb0ZtL64qxAkriQ/ng", "Cfg_StoreOverview"),
			t.exports = {
				data: {
					1: {
						miner_type: 1,
						carry: 1e3,
						upgrade_type: 1,
						upgrade_consume: 400,
						speed: 2,
						len: 10,
						reward_stage: ["20-15", "50-15", "100-15", "200-15", "300-15", "400-15", "500-15", "600-15", "700-15", "800-15", "900-15", "1000-15", "1100-15", "1200-15", "1300-15", "1400-15", "1500-15", "1600-15", "1700-15", "1800-15", "1900-15", "2000-15", "2100-15", "2200-15", "2300-15", "2400-15"],
						reward_stage_reborn: ["20-5", "50-5", "100-5", "200-5", "300-5", "400-5", "500-5", "600-5", "700-5", "800-5", "900-5", "1000-5", "1100-5", "1200-5", "1300-5", "1400-5", "1500-5", "1600-5", "1700-5", "1800-5", "1900-5", "2000-5", "2100-5", "2200-5", "2300-5", "2400-5"]
					},
					2: {
						miner_type: 2,
						carry: 1e3,
						upgrade_type: 1,
						upgrade_consume: 400,
						speed: 2,
						len: 10,
						reward_stage: ["20-15", "50-15", "100-15", "200-15", "300-15", "400-15", "500-15", "600-15", "700-15", "800-15", "900-15", "1000-15", "1100-15", "1200-15", "1300-15", "1400-15", "1500-15", "1600-15", "1700-15", "1800-15", "1900-15", "2000-15", "2100-15", "2200-15", "2300-15", "2400-15"],
						reward_stage_reborn: ["20-5", "50-5", "100-5", "200-5", "300-5", "400-5", "500-5", "600-5", "700-5", "800-5", "900-5", "1000-5", "1100-5", "1200-5", "1300-5", "1400-5", "1500-5", "1600-5", "1700-5", "1800-5", "1900-5", "2000-5", "2100-5", "2200-5", "2300-5", "2400-5"]
					},
					3: {
						miner_type: 3,
						carry: 1e3,
						upgrade_type: 1,
						upgrade_consume: 400,
						speed: 2,
						len: 10,
						reward_stage: ["20-15", "50-15", "100-15", "200-15", "300-15", "400-15", "500-15", "600-15", "700-15", "800-15", "900-15", "1000-15", "1100-15", "1200-15", "1300-15", "1400-15", "1500-15", "1600-15", "1700-15", "1800-15", "1900-15", "2000-15", "2100-15", "2200-15", "2300-15", "2400-15"],
						reward_stage_reborn: ["20-5", "50-5", "100-5", "200-5", "300-5", "400-5", "500-5", "600-5", "700-5", "800-5", "900-5", "1000-5", "1100-5", "1200-5", "1300-5", "1400-5", "1500-5", "1600-5", "1700-5", "1800-5", "1900-5", "2000-5", "2100-5", "2200-5", "2300-5", "2400-5"]
					},
					4: {
						miner_type: 4,
						carry: 1e3,
						upgrade_type: 1,
						upgrade_consume: 400,
						speed: 2,
						len: 10,
						reward_stage: ["20-15", "50-15", "100-15", "200-15", "300-15", "400-15", "500-15", "600-15", "700-15", "800-15", "900-15", "1000-15", "1100-15", "1200-15", "1300-15", "1400-15", "1500-15", "1600-15", "1700-15", "1800-15", "1900-15", "2000-15", "2100-15", "2200-15", "2300-15", "2400-15"],
						reward_stage_reborn: ["20-5", "50-5", "100-5", "200-5", "300-5", "400-5", "500-5", "600-5", "700-5", "800-5", "900-5", "1000-5", "1100-5", "1200-5", "1300-5", "1400-5", "1500-5", "1600-5", "1700-5", "1800-5", "1900-5", "2000-5", "2100-5", "2200-5", "2300-5", "2400-5"]
					},
					5: {
						miner_type: 5,
						carry: 1e3,
						upgrade_type: 1,
						upgrade_consume: 400,
						speed: 2,
						len: 10,
						reward_stage: ["20-15", "50-15", "100-15", "200-15", "300-15", "400-15", "500-15", "600-15", "700-15", "800-15", "900-15", "1000-15", "1100-15", "1200-15", "1300-15", "1400-15", "1500-15", "1600-15", "1700-15", "1800-15", "1900-15", "2000-15", "2100-15", "2200-15", "2300-15", "2400-15"],
						reward_stage_reborn: ["20-5", "50-5", "100-5", "200-5", "300-5", "400-5", "500-5", "600-5", "700-5", "800-5", "900-5", "1000-5", "1100-5", "1200-5", "1300-5", "1400-5", "1500-5", "1600-5", "1700-5", "1800-5", "1900-5", "2000-5", "2100-5", "2200-5", "2300-5", "2400-5"]
					},
					6: {
						miner_type: 6,
						carry: 1e3,
						upgrade_type: 2,
						upgrade_consume: 400,
						speed: 2,
						len: 10,
						reward_stage: ["20-15", "50-15", "100-15", "200-15", "300-15", "400-15", "500-15", "600-15", "700-15", "800-15", "900-15", "1000-15", "1100-15", "1200-15", "1300-15", "1400-15", "1500-15", "1600-15", "1700-15", "1800-15", "1900-15", "2000-15", "2100-15", "2200-15", "2300-15", "2400-15"],
						reward_stage_reborn: ["20-5", "50-5", "100-5", "200-5", "300-5", "400-5", "500-5", "600-5", "700-5", "800-5", "900-5", "1000-5", "1100-5", "1200-5", "1300-5", "1400-5", "1500-5", "1600-5", "1700-5", "1800-5", "1900-5", "2000-5", "2100-5", "2200-5", "2300-5", "2400-5"]
					},
					7: {
						miner_type: 7,
						carry: 1e3,
						upgrade_type: 2,
						upgrade_consume: 400,
						speed: 2,
						len: 10,
						reward_stage: ["20-15", "50-15", "100-15", "200-15", "300-15", "400-15", "500-15", "600-15", "700-15", "800-15", "900-15", "1000-15", "1100-15", "1200-15", "1300-15", "1400-15", "1500-15", "1600-15", "1700-15", "1800-15", "1900-15", "2000-15", "2100-15", "2200-15", "2300-15", "2400-15"],
						reward_stage_reborn: ["20-5", "50-5", "100-5", "200-5", "300-5", "400-5", "500-5", "600-5", "700-5", "800-5", "900-5", "1000-5", "1100-5", "1200-5", "1300-5", "1400-5", "1500-5", "1600-5", "1700-5", "1800-5", "1900-5", "2000-5", "2100-5", "2200-5", "2300-5", "2400-5"]
					},
					8: {
						miner_type: 8,
						carry: 1e3,
						upgrade_type: 2,
						upgrade_consume: 400,
						speed: 2,
						len: 10,
						reward_stage: ["20-15", "50-15", "100-15", "200-15", "300-15", "400-15", "500-15", "600-15", "700-15", "800-15", "900-15", "1000-15", "1100-15", "1200-15", "1300-15", "1400-15", "1500-15", "1600-15", "1700-15", "1800-15", "1900-15", "2000-15", "2100-15", "2200-15", "2300-15", "2400-15"],
						reward_stage_reborn: ["20-5", "50-5", "100-5", "200-5", "300-5", "400-5", "500-5", "600-5", "700-5", "800-5", "900-5", "1000-5", "1100-5", "1200-5", "1300-5", "1400-5", "1500-5", "1600-5", "1700-5", "1800-5", "1900-5", "2000-5", "2100-5", "2200-5", "2300-5", "2400-5"]
					},
					9: {
						miner_type: 9,
						carry: 1e3,
						upgrade_type: 2,
						upgrade_consume: 400,
						speed: 2,
						len: 10,
						reward_stage: ["20-15", "50-15", "100-15", "200-15", "300-15", "400-15", "500-15", "600-15", "700-15", "800-15", "900-15", "1000-15", "1100-15", "1200-15", "1300-15", "1400-15", "1500-15", "1600-15", "1700-15", "1800-15", "1900-15", "2000-15", "2100-15", "2200-15", "2300-15", "2400-15"],
						reward_stage_reborn: ["20-5", "50-5", "100-5", "200-5", "300-5", "400-5", "500-5", "600-5", "700-5", "800-5", "900-5", "1000-5", "1100-5", "1200-5", "1300-5", "1400-5", "1500-5", "1600-5", "1700-5", "1800-5", "1900-5", "2000-5", "2100-5", "2200-5", "2300-5", "2400-5"]
					},
					10: {
						miner_type: 10,
						carry: 1e3,
						upgrade_type: 2,
						upgrade_consume: 400,
						speed: 2,
						len: 10,
						reward_stage: ["20-15", "50-15", "100-15", "200-15", "300-15", "400-15", "500-15", "600-15", "700-15", "800-15", "900-15", "1000-15", "1100-15", "1200-15", "1300-15", "1400-15", "1500-15", "1600-15", "1700-15", "1800-15", "1900-15", "2000-15", "2100-15", "2200-15", "2300-15", "2400-15"],
						reward_stage_reborn: ["20-5", "50-5", "100-5", "200-5", "300-5", "400-5", "500-5", "600-5", "700-5", "800-5", "900-5", "1000-5", "1100-5", "1200-5", "1300-5", "1400-5", "1500-5", "1600-5", "1700-5", "1800-5", "1900-5", "2000-5", "2100-5", "2200-5", "2300-5", "2400-5"]
					},
					11: {
						miner_type: 11,
						carry: 1e3,
						upgrade_type: 3,
						upgrade_consume: 400,
						speed: 2,
						len: 10,
						reward_stage: ["20-15", "50-15", "100-15", "200-15", "300-15", "400-15", "500-15", "600-15", "700-15", "800-15", "900-15", "1000-15", "1100-15", "1200-15", "1300-15", "1400-15", "1500-15", "1600-15", "1700-15", "1800-15", "1900-15", "2000-15", "2100-15", "2200-15", "2300-15", "2400-15"],
						reward_stage_reborn: ["20-5", "50-5", "100-5", "200-5", "300-5", "400-5", "500-5", "600-5", "700-5", "800-5", "900-5", "1000-5", "1100-5", "1200-5", "1300-5", "1400-5", "1500-5", "1600-5", "1700-5", "1800-5", "1900-5", "2000-5", "2100-5", "2200-5", "2300-5", "2400-5"]
					},
					12: {
						miner_type: 12,
						carry: 1e3,
						upgrade_type: 3,
						upgrade_consume: 400,
						speed: 2,
						len: 10,
						reward_stage: ["20-15", "50-15", "100-15", "200-15", "300-15", "400-15", "500-15", "600-15", "700-15", "800-15", "900-15", "1000-15", "1100-15", "1200-15", "1300-15", "1400-15", "1500-15", "1600-15", "1700-15", "1800-15", "1900-15", "2000-15", "2100-15", "2200-15", "2300-15", "2400-15"],
						reward_stage_reborn: ["20-5", "50-5", "100-5", "200-5", "300-5", "400-5", "500-5", "600-5", "700-5", "800-5", "900-5", "1000-5", "1100-5", "1200-5", "1300-5", "1400-5", "1500-5", "1600-5", "1700-5", "1800-5", "1900-5", "2000-5", "2100-5", "2200-5", "2300-5", "2400-5"]
					},
					13: {
						miner_type: 13,
						carry: 1e3,
						upgrade_type: 3,
						upgrade_consume: 400,
						speed: 2,
						len: 10,
						reward_stage: ["20-15", "50-15", "100-15", "200-15", "300-15", "400-15", "500-15", "600-15", "700-15", "800-15", "900-15", "1000-15", "1100-15", "1200-15", "1300-15", "1400-15", "1500-15", "1600-15", "1700-15", "1800-15", "1900-15", "2000-15", "2100-15", "2200-15", "2300-15", "2400-15"],
						reward_stage_reborn: ["20-5", "50-5", "100-5", "200-5", "300-5", "400-5", "500-5", "600-5", "700-5", "800-5", "900-5", "1000-5", "1100-5", "1200-5", "1300-5", "1400-5", "1500-5", "1600-5", "1700-5", "1800-5", "1900-5", "2000-5", "2100-5", "2200-5", "2300-5", "2400-5"]
					},
					14: {
						miner_type: 14,
						carry: 1e3,
						upgrade_type: 3,
						upgrade_consume: 400,
						speed: 2,
						len: 10,
						reward_stage: ["20-15", "50-15", "100-15", "200-15", "300-15", "400-15", "500-15", "600-15", "700-15", "800-15", "900-15", "1000-15", "1100-15", "1200-15", "1300-15", "1400-15", "1500-15", "1600-15", "1700-15", "1800-15", "1900-15", "2000-15", "2100-15", "2200-15", "2300-15", "2400-15"],
						reward_stage_reborn: ["20-5", "50-5", "100-5", "200-5", "300-5", "400-5", "500-5", "600-5", "700-5", "800-5", "900-5", "1000-5", "1100-5", "1200-5", "1300-5", "1400-5", "1500-5", "1600-5", "1700-5", "1800-5", "1900-5", "2000-5", "2100-5", "2200-5", "2300-5", "2400-5"]
					},
					15: {
						miner_type: 15,
						carry: 1e3,
						upgrade_type: 3,
						upgrade_consume: 400,
						speed: 2,
						len: 10,
						reward_stage: ["20-15", "50-15", "100-15", "200-15", "300-15", "400-15", "500-15", "600-15", "700-15", "800-15", "900-15", "1000-15", "1100-15", "1200-15", "1300-15", "1400-15", "1500-15", "1600-15", "1700-15", "1800-15", "1900-15", "2000-15", "2100-15", "2200-15", "2300-15", "2400-15"],
						reward_stage_reborn: ["20-5", "50-5", "100-5", "200-5", "300-5", "400-5", "500-5", "600-5", "700-5", "800-5", "900-5", "1000-5", "1100-5", "1200-5", "1300-5", "1400-5", "1500-5", "1600-5", "1700-5", "1800-5", "1900-5", "2000-5", "2100-5", "2200-5", "2300-5", "2400-5"]
					},
					16: {
						miner_type: 16,
						carry: 1e3,
						upgrade_type: 4,
						upgrade_consume: 400,
						speed: 2,
						len: 10,
						reward_stage: ["20-15", "50-15", "100-15", "200-15", "300-15", "400-15", "500-15", "600-15", "700-15", "800-15", "900-15", "1000-15", "1100-15", "1200-15", "1300-15", "1400-15", "1500-15", "1600-15", "1700-15", "1800-15", "1900-15", "2000-15", "2100-15", "2200-15", "2300-15", "2400-15"],
						reward_stage_reborn: ["20-5", "50-5", "100-5", "200-5", "300-5", "400-5", "500-5", "600-5", "700-5", "800-5", "900-5", "1000-5", "1100-5", "1200-5", "1300-5", "1400-5", "1500-5", "1600-5", "1700-5", "1800-5", "1900-5", "2000-5", "2100-5", "2200-5", "2300-5", "2400-5"]
					},
					17: {
						miner_type: 17,
						carry: 1e3,
						upgrade_type: 4,
						upgrade_consume: 400,
						speed: 2,
						len: 10,
						reward_stage: ["20-15", "50-15", "100-15", "200-15", "300-15", "400-15", "500-15", "600-15", "700-15", "800-15", "900-15", "1000-15", "1100-15", "1200-15", "1300-15", "1400-15", "1500-15", "1600-15", "1700-15", "1800-15", "1900-15", "2000-15", "2100-15", "2200-15", "2300-15", "2400-15"],
						reward_stage_reborn: ["20-5", "50-5", "100-5", "200-5", "300-5", "400-5", "500-5", "600-5", "700-5", "800-5", "900-5", "1000-5", "1100-5", "1200-5", "1300-5", "1400-5", "1500-5", "1600-5", "1700-5", "1800-5", "1900-5", "2000-5", "2100-5", "2200-5", "2300-5", "2400-5"]
					},
					18: {
						miner_type: 18,
						carry: 1e3,
						upgrade_type: 4,
						upgrade_consume: 400,
						speed: 2,
						len: 10,
						reward_stage: ["20-15", "50-15", "100-15", "200-15", "300-15", "400-15", "500-15", "600-15", "700-15", "800-15", "900-15", "1000-15", "1100-15", "1200-15", "1300-15", "1400-15", "1500-15", "1600-15", "1700-15", "1800-15", "1900-15", "2000-15", "2100-15", "2200-15", "2300-15", "2400-15"],
						reward_stage_reborn: ["20-5", "50-5", "100-5", "200-5", "300-5", "400-5", "500-5", "600-5", "700-5", "800-5", "900-5", "1000-5", "1100-5", "1200-5", "1300-5", "1400-5", "1500-5", "1600-5", "1700-5", "1800-5", "1900-5", "2000-5", "2100-5", "2200-5", "2300-5", "2400-5"]
					},
					19: {
						miner_type: 19,
						carry: 1e3,
						upgrade_type: 4,
						upgrade_consume: 400,
						speed: 2,
						len: 10,
						reward_stage: ["20-15", "50-15", "100-15", "200-15", "300-15", "400-15", "500-15", "600-15", "700-15", "800-15", "900-15", "1000-15", "1100-15", "1200-15", "1300-15", "1400-15", "1500-15", "1600-15", "1700-15", "1800-15", "1900-15", "2000-15", "2100-15", "2200-15", "2300-15", "2400-15"],
						reward_stage_reborn: ["20-5", "50-5", "100-5", "200-5", "300-5", "400-5", "500-5", "600-5", "700-5", "800-5", "900-5", "1000-5", "1100-5", "1200-5", "1300-5", "1400-5", "1500-5", "1600-5", "1700-5", "1800-5", "1900-5", "2000-5", "2100-5", "2200-5", "2300-5", "2400-5"]
					},
					20: {
						miner_type: 20,
						carry: 1e3,
						upgrade_type: 4,
						upgrade_consume: 400,
						speed: 2,
						len: 10,
						reward_stage: ["20-15", "50-15", "100-15", "200-15", "300-15", "400-15", "500-15", "600-15", "700-15", "800-15", "900-15", "1000-15", "1100-15", "1200-15", "1300-15", "1400-15", "1500-15", "1600-15", "1700-15", "1800-15", "1900-15", "2000-15", "2100-15", "2200-15", "2300-15", "2400-15"],
						reward_stage_reborn: ["20-5", "50-5", "100-5", "200-5", "300-5", "400-5", "500-5", "600-5", "700-5", "800-5", "900-5", "1000-5", "1100-5", "1200-5", "1300-5", "1400-5", "1500-5", "1600-5", "1700-5", "1800-5", "1900-5", "2000-5", "2100-5", "2200-5", "2300-5", "2400-5"]
					}
				},
				check: {
					miner_type: {
						miner_type: "int",
						carry: "int",
						upgrade_type: "int",
						upgrade_consume: "int",
						speed: "int",
						len: "int",
						reward_stage: "string|arr",
						reward_stage_reborn: "string|arr"
					}
				}
			},
			t.exports.protocol_version = "0.0.1",
			cc._RF.pop()
	},
	{}],
	Cfg_StorePowerCoefficient: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "2e555H0HWZDkrxWpgryLSe2", "Cfg_StorePowerCoefficient"),
			t.exports = {
				data: {
					1: {
						1: "2.1970000000000005",
						lv: 1,
						rate: 1
					},
					2: {
						1: "2.856100000000001",
						lv: 2,
						rate: 1.3
					},
					21: {
						1: "3.7129300000000014",
						lv: 21,
						rate: 1.1
					},
					201: {
						1: "4.826809000000002",
						lv: 201,
						rate: 1.11
					},
					401: {
						1: "6.274851700000003",
						lv: 401,
						rate: 1.116
					},
					601: {
						1: "8.157307210000004",
						lv: 601,
						rate: 1.141
					},
					701: {
						1: "10.604499373000007",
						lv: 701,
						rate: 1.135
					},
					801: {
						1: "13.785849184900009",
						lv: 801,
						rate: 1.073
					},
					1601: {
						1: "17.921603940370012",
						lv: 1601,
						rate: 1.08
					}
				},
				check: {
					lv: {
						1: "1.3",
						lv: "int",
						rate: "float"
					}
				}
			},
			t.exports.protocol_version = "0.0.1",
			cc._RF.pop()
	},
	{}],
	Cfg_StorePowerUp: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "e8883TqjhtO74ErXSgvWkBB", "Cfg_StorePowerUp"),
			t.exports = {
				data: {
					50: {
						lv: 50,
						rate: 2
					},
					100: {
						lv: 100,
						rate: 1.2
					},
					200: {
						lv: 200,
						rate: 1.7
					},
					600: {
						lv: 600,
						rate: 2
					},
					800: {
						lv: 800,
						rate: 1.4
					},
					850: {
						lv: 850,
						rate: 2
					},
					950: {
						lv: 950,
						rate: 2
					},
					1050: {
						lv: 1050,
						rate: 2
					},
					1150: {
						lv: 1150,
						rate: 2
					},
					1250: {
						lv: 1250,
						rate: 2
					},
					1350: {
						lv: 1350,
						rate: 2
					},
					1450: {
						lv: 1450,
						rate: 2
					},
					1550: {
						lv: 1550,
						rate: 2
					},
					1600: {
						lv: 1600,
						rate: 2.25
					},
					1700: {
						lv: 1700,
						rate: 2
					},
					1800: {
						lv: 1800,
						rate: 2
					},
					1900: {
						lv: 1900,
						rate: 2
					},
					2000: {
						lv: 2e3,
						rate: 2
					},
					2100: {
						lv: 2100,
						rate: 2
					},
					2200: {
						lv: 2200,
						rate: 2
					},
					2300: {
						lv: 2300,
						rate: 2
					},
					2400: {
						lv: 2400,
						rate: 2
					}
				},
				check: {
					lv: {
						lv: "int",
						rate: "float"
					}
				}
			},
			t.exports.protocol_version = "0.0.1",
			cc._RF.pop()
	},
	{}],
	Cfg_StoreWorkerNum: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "de845qgXIVMU7kpJGw+uEIb", "Cfg_StoreWorkerNum"),
			t.exports = {
				data: {
					1: {
						lv: 1,
						num: 1
					},
					20: {
						lv: 20,
						num: 2
					},
					100: {
						lv: 100,
						num: 3
					},
					400: {
						lv: 400,
						num: 4
					},
					800: {
						lv: 800,
						num: 5
					}
				},
				check: {
					lv: {
						lv: "int",
						num: "int"
					}
				}
			},
			t.exports.protocol_version = "0.0.1",
			cc._RF.pop()
	},
	{}],
	Cfg_String: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "cde5cIUs1FPCIjKzsiCCV2p", "Cfg_String"),
			t.exports = {
				data: {
					item_name_1001: {
						id: "item_name_1001",
						en: "12h"
					},
					item_name_1002: {
						id: "item_name_1002",
						en: "3d"
					},
					item_name_1003: {
						id: "item_name_1003",
						en: "1h"
					},
					item_name_2001: {
						id: "item_name_2001",
						en: "1h " + Language.getName("Time Jump")
					},
					item_name_2002: {
						id: "item_name_2002",
						en: "4h " + Language.getName("Time Jump")
					},
					item_name_2003: {
						id: "item_name_2003",
						en: "1d " + Language.getName("Time Jump")
					},
					item_name_1004: {
						id: "item_name_1004",
						en: "10m"
					},
					item_name_1005: {
						id: "item_name_1005",
						en: "1h"
					},
					item_name_1006: {
						id: "item_name_1006",
						en: "8h"
					},
					item_name_1007: {
						id: "item_name_1007",
						en: "10m"
					},
					item_name_1008: {
						id: "item_name_1008",
						en: "1h"
					},
					item_name_1009: {
						id: "item_name_1009",
						en: "14d"
					},
					item_name_1010: {
						id: "item_name_1010",
						en: "10m"
					},
					item_name_1011: {
						id: "item_name_1011",
						en: "1h"
					},
					item_name_1012: {
						id: "item_name_1012",
						en: "5m"
					},
					item_name_1013: {
						id: "item_name_1013",
						en: "10m"
					},
					item_name_1014: {
						id: "item_name_1014",
						en: "1h"
					},
					item_name_1015: {
						id: "item_name_1015",
						en: "5m"
					},
					item_name_1016: {
						id: "item_name_1016",
						en: "10m"
					},
					item_name_1017: {
						id: "item_name_1017",
						en: "1h"
					},
					item_name_1018: {
						id: "item_name_1018",
						en: "5m"
					},
					item_name_1019: {
						id: "item_name_1019",
						en: "10m"
					},
					item_name_1020: {
						id: "item_name_1020",
						en: "5m"
					},
					item_name_1021: {
						id: "item_name_1021",
						en: "10m"
					},
					item_name_1022: {
						id: "item_name_1022",
						en: "1h"
					},
					item_name_1023: {
						id: "item_name_1023",
						en: "5m"
					},
					item_name_1024: {
						id: "item_name_1024",
						en: "5m"
					},
					item_name_1025: {
						id: "item_name_1025",
						en: "12h"
					},
					item_name_1026: {
						id: "item_name_1026",
						en: "7d"
					},
					item_name_1027: {
						id: "item_name_1027",
						en: "4h"
					},
					item_name_1028: {
						id: "item_name_1028",
						en: "5h"
					},
					item_name_1029: {
						id: "item_name_1029",
						en: "6h"
					},
					item_name_2004: {
						id: "item_name_2004",
						en: "12h " + Language.getName("Time Jump")
					},
					item_name_2005: {
						id: "item_name_2005",
						en: "3d " + Language.getName("Time Jump")
					},
					item_name_2006: {
						id: "item_name_2006",
						en: "2d " + Language.getName("Time Jump")
					},
					item_name_2007: {
						id: "item_name_2007",
						en: "5d " + Language.getName("Time Jump")
					},
					item_desc_1004: {
						id: "item_desc_1004",
						en: "2x " + Language.getName("income for")
					},
					item_desc_1005: {
						id: "item_desc_1005",
						en: "2x " + Language.getName("income for")
					},
					item_desc_1006: {
						id: "item_desc_1006",
						en: "2x " + Language.getName("income for")
					},
					item_desc_1007: {
						id: "item_desc_1007",
						en: "4x " + Language.getName("income for")
					},
					item_desc_1008: {
						id: "item_desc_1008",
						en: "4x " + Language.getName("income for")
					},
					item_desc_1009: {
						id: "item_desc_1009",
						en: "4x " + Language.getName("income for")
					},
					item_desc_1010: {
						id: "item_desc_1010",
						en: "5x " + Language.getName("income for")
					},
					item_desc_1011: {
						id: "item_desc_1011",
						en: "5x " + Language.getName("income for")
					},
					item_desc_1012: {
						id: "item_desc_1012",
						en: "10x " + Language.getName("income for")
					},
					item_desc_1013: {
						id: "item_desc_1013",
						en: "10x " + Language.getName("income for")
					},
					item_desc_1014: {
						id: "item_desc_1014",
						en: "10x " + Language.getName("income for")
					},
					item_desc_1015: {
						id: "item_desc_1015",
						en: "20x " + Language.getName("income for")
					},
					item_desc_1016: {
						id: "item_desc_1016",
						en: "20x " + Language.getName("income for")
					},
					item_desc_1017: {
						id: "item_desc_1017",
						en: "20x " + Language.getName("income for")
					},
					item_desc_1018: {
						id: "item_desc_1018",
						en: "50x " + Language.getName("income for")
					},
					item_desc_1019: {
						id: "item_desc_1019",
						en: "50x " + Language.getName("income for")
					},
					item_desc_1020: {
						id: "item_desc_1020",
						en: "100x " + Language.getName("income for")
					},
					item_desc_1021: {
						id: "item_desc_1021",
						en: "100x " + Language.getName("income for")
					},
					item_desc_1022: {
						id: "item_desc_1022",
						en: "100x " + Language.getName("income for")
					},
					item_desc_1023: {
						id: "item_desc_1023",
						en: "500x " + Language.getName("income for")
					},
					item_desc_1024: {
						id: "item_desc_1024",
						en: "1000x " + Language.getName("income for")
					},
					item_desc_1025: {
						id: "item_desc_1025",
						en: "10x " + Language.getName("income for")
					},
					item_desc_1001: {
						id: "item_desc_1001",
						en: "2x " + Language.getName("income for")
					},
					item_desc_1002: {
						id: "item_desc_1002",
						en: "4x " + Language.getName("income for")
					},
					item_desc_1003: {
						id: "item_desc_1003",
						en: "50x " + Language.getName("income for")
					},
					item_desc_1027: {
						id: "item_desc_1027",
						en: "2x " + Language.getName("income for")
					},
					item_desc_1028: {
						id: "item_desc_1028",
						en: "10x " + Language.getName("income for")
					},
					item_desc_1029: {
						id: "item_desc_1029",
						en: "20x " + Language.getName("income for")
					},
					item_desc_2001: {
						id: "item_desc_2001",
						en: Language.getName("Gain 1h resources from the future instantly!")
					},
					item_desc_2002: {
						id: "item_desc_2002",
						en: Language.getName("Gain 4h resources from the future instantly!")
					},
					item_desc_2003: {
						id: "item_desc_2003",
						en: Language.getName("Gain 1d resources from the future instantly!")
					},
					item_desc_2004: {
						id: "item_desc_2004",
						en: Language.getName("Gain 12h resources from the future instantly!")
					},
					item_desc_2005: {
						id: "item_desc_2005",
						en: Language.getName("Gain 3d resources from the future instantly!")
					},
					item_desc_2006: {
						id: "item_desc_2006",
						en: Language.getName("Gain 2d resources from the future instantly!")
					},
					item_desc_2007: {
						id: "item_desc_2007",
						en: Language.getName("Gain 5d resources from the future instantly!")
					},
					item_desc_1026: {
						id: "item_desc_1026",
						en: "4x " + Language.getName("income for")
					},
					miner_name_1: {
						id: "miner_name_1",
						en: Language.getName("Gold Mine")
					},
					miner_name_2: {
						id: "miner_name_2",
						en: "Ruby Mine"
					},
					miner_name_3: {
						id: "miner_name_3",
						en: "Sapphire Mine"
					},
					miner_name_4: {
						id: "miner_name_4",
						en: "Emerald Mine"
					},
					miner_name_5: {
						id: "miner_name_5",
						en: "Spodumene Mine"
					},
					miner_name_6: {
						id: "miner_name_6",
						en: Language.getName("dummy")
					},
					miner_name_7: {
						id: "miner_name_7",
						en: Language.getName("dummy")
					},
					miner_name_8: {
						id: "miner_name_8",
						en: Language.getName("dummy")
					},
					miner_name_9: {
						id: "miner_name_9",
						en: Language.getName("dummy")
					},
					miner_name_10: {
						id: "miner_name_10",
						en: Language.getName("dummy")
					},
					miner_name_11: {
						id: "miner_name_11",
						en: Language.getName("dummy")
					},
					miner_name_12: {
						id: "miner_name_12",
						en: Language.getName("dummy")
					},
					miner_name_13: {
						id: "miner_name_13",
						en: Language.getName("dummy")
					},
					miner_name_14: {
						id: "miner_name_14",
						en: Language.getName("dummy")
					},
					miner_name_15: {
						id: "miner_name_15",
						en: Language.getName("dummy")
					},
					miner_name_16: {
						id: "miner_name_16",
						en: Language.getName("dummy")
					},
					miner_name_17: {
						id: "miner_name_17",
						en: Language.getName("dummy")
					},
					miner_name_18: {
						id: "miner_name_18",
						en: Language.getName("dummy")
					},
					miner_name_19: {
						id: "miner_name_19",
						en: Language.getName("dummy")
					},
					miner_name_20: {
						id: "miner_name_20",
						en: Language.getName("dummy")
					}
				},
				check: {
					id: {
						id: "string",
						en: "string",
						cn: "string",
						t_ch: "string"
					}
				}
			},
			t.exports.protocol_version = "0.0.1",
			cc._RF.pop()
	},
	{}],
	Cfg_headers: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "c3ab90LM6BHh7OVBLdXgLON", "Cfg_headers");
		var i = {};
		i.Cfg_AllMines = e("./Cfg_AllMines.js"),
			i.Cfg_ElevatorConsumeCoefficient = e("./Cfg_ElevatorConsumeCoefficient.js"),
			i.Cfg_ElevatorOverview = e("./Cfg_ElevatorOverview.js"),
			i.Cfg_ElevatorPowerCoefficient = e("./Cfg_ElevatorPowerCoefficient.js"),
			i.Cfg_ElevatorPowerUp = e("./Cfg_ElevatorPowerUp.js"),
			i.Cfg_ElevatorSpeed = e("./Cfg_ElevatorSpeed.js"),
			i.Cfg_GameConst = e("./Cfg_GameConst.js"),
			i.Cfg_Item = e("./Cfg_Item.js"),
			i.Cfg_Manager = e("./Cfg_Manager.js"),
			i.Cfg_ManagerFixedRecruit = e("./Cfg_ManagerFixedRecruit.js"),
			i.Cfg_ManagerName = e("./Cfg_ManagerName.js"),
			i.Cfg_ManagerRecruitCost = e("./Cfg_ManagerRecruitCost.js"),
			i.Cfg_Prestige = e("./Cfg_Prestige.js"),
			i.Cfg_SeamMine = e("./Cfg_SeamMine.js"),
			i.Cfg_SeamMoveSpeed = e("./Cfg_SeamMoveSpeed.js"),
			i.Cfg_SeamPowerUp = e("./Cfg_SeamPowerUp.js"),
			i.Cfg_SeamWorkerNum = e("./Cfg_SeamWorkerNum.js"),
			i.Cfg_Shop = e("./Cfg_Shop.js"),
			i.Cfg_Sign = e("./Cfg_Sign.js"),
			i.Cfg_StoreConsumeCoefficient = e("./Cfg_StoreConsumeCoefficient.js"),
			i.Cfg_StoreMoveSpeed = e("./Cfg_StoreMoveSpeed.js"),
			i.Cfg_StoreOverview = e("./Cfg_StoreOverview.js"),
			i.Cfg_StorePowerCoefficient = e("./Cfg_StorePowerCoefficient.js"),
			i.Cfg_StorePowerUp = e("./Cfg_StorePowerUp.js"),
			i.Cfg_StoreWorkerNum = e("./Cfg_StoreWorkerNum.js"),
			i.Cfg_String = e("./Cfg_String.js"),
			t.exports = i,
			cc._RF.pop()
	},
	{
		"./Cfg_AllMines.js": "Cfg_AllMines",
		"./Cfg_ElevatorConsumeCoefficient.js": "Cfg_ElevatorConsumeCoefficient",
		"./Cfg_ElevatorOverview.js": "Cfg_ElevatorOverview",
		"./Cfg_ElevatorPowerCoefficient.js": "Cfg_ElevatorPowerCoefficient",
		"./Cfg_ElevatorPowerUp.js": "Cfg_ElevatorPowerUp",
		"./Cfg_ElevatorSpeed.js": "Cfg_ElevatorSpeed",
		"./Cfg_GameConst.js": "Cfg_GameConst",
		"./Cfg_Item.js": "Cfg_Item",
		"./Cfg_Manager.js": "Cfg_Manager",
		"./Cfg_ManagerFixedRecruit.js": "Cfg_ManagerFixedRecruit",
		"./Cfg_ManagerName.js": "Cfg_ManagerName",
		"./Cfg_ManagerRecruitCost.js": "Cfg_ManagerRecruitCost",
		"./Cfg_Prestige.js": "Cfg_Prestige",
		"./Cfg_SeamMine.js": "Cfg_SeamMine",
		"./Cfg_SeamMoveSpeed.js": "Cfg_SeamMoveSpeed",
		"./Cfg_SeamPowerUp.js": "Cfg_SeamPowerUp",
		"./Cfg_SeamWorkerNum.js": "Cfg_SeamWorkerNum",
		"./Cfg_Shop.js": "Cfg_Shop",
		"./Cfg_Sign.js": "Cfg_Sign",
		"./Cfg_StoreConsumeCoefficient.js": "Cfg_StoreConsumeCoefficient",
		"./Cfg_StoreMoveSpeed.js": "Cfg_StoreMoveSpeed",
		"./Cfg_StoreOverview.js": "Cfg_StoreOverview",
		"./Cfg_StorePowerCoefficient.js": "Cfg_StorePowerCoefficient",
		"./Cfg_StorePowerUp.js": "Cfg_StorePowerUp",
		"./Cfg_StoreWorkerNum.js": "Cfg_StoreWorkerNum",
		"./Cfg_String.js": "Cfg_String"
	}],
	ChildrenZIndex: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "4b2c2w38blHBLyM7C05VS8b", "ChildrenZIndex"),
			cc.Class({
				extends: cc.Component,
				editor: {
					menu: "Effect/ChildrenZIndex"
				},
				properties: {},
				update: function (e) {
					var t = 1;
					this.node.getContentSize().height <= 0 && (t = -1),
						this.node.children.forEach(function (e) {
							e.zIndex = -e.y * t
						})
				}
			}),
			cc._RF.pop()
	},
	{}],
	ColorFollow: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "73284+RsdxM1plZe3CYlYLr", "ColorFollow"),
			cc.Class({
				extends: cc.Component,
				editor: {
					menu: "Effect/ColorFollow"
				},
				properties: {
					target: cc.Node
				},
				update: function (e) {
					this.node.color = this.target.color
				}
			}),
			cc._RF.pop()
	},
	{}],
	CommonDialog: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "98672fGroxJcoaYLzhb1XCU", "CommonDialog"),
			cc.Class({
				extends: cc.Component,
				editor: {
					executeInEditMode: !0
				},
				properties: {
					title: cc.Label,
					content: cc.Label,
					leftBtn: cc.Node,
					rightBtn: cc.Node
				},
				start: function () { },
				setArgs: function (e, t, a, i) {
					this.title.string = e,
						this.content.string = t,
						a && (this.callback1 = a),
						i ? this.callback2 = i : (this.rightBtn.active = !1, this.leftBtn.x = 0)
				},
				leftclick: function () {
					ViewMgr.hideDialogBegin(this.callback1)
				},
				rightclick: function () {
					ViewMgr.hideDialogBegin(this.callback2)
				}
			}),
			cc._RF.pop()
	},
	{}],
	Constant: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "be487te7TZCpJS7nwyJscMu", "Constant"),
			window.Constant = {
				STORE_HOUSE_HEIGHT: 575,
				ELEVATOR_CABLE_START_HEIGHT: 240,
				SEAM_START_ITEM_HEIGHT: 188,
				SEAM_LAYER_HEIGHT: 400,
				ELEVATOR_BASE_HEIGHT: 120,
				MAX_SEAM_NUM_PER_MINE: 30,
				SEAM_FLOOR_BASE_HEIGHT: 375,
				PERSPECTIVE_EFFECT: 10,
				BOTTLE_NECK_RADIO: 1.1,
				RANKLIST_FRIEND: "friends",
				STORE_HOUSE_MOVE_END: -510,
				STORE_HOUSE_MOVE_START: -230
			},
			window.ManagerSkillState = cc.Enum({
				MS_USING: 0,
				MS_CD: 1,
				MS_IDLE: 2
			}),
			window.LevelUpMode = cc.Enum({
				LV_X1: 1,
				LV_X10: 2,
				LV_X50: 3,
				LV_MAX: 4
			}),
			window.SKILL_TYPE = {
				1: [4, 5, 6, 7],
				2: [1, 2, 3],
				3: [8, 9, 10, 11]
			},
			window.SKILL_NAME = {
				1: "\u884c\u8d70\u52a0\u901f",
				2: "\u91c7\u77ff\u52a0\u901f",
				3: "\u8d39\u7528\u964d\u4f4e",
				4: "\u884c\u8d70\u52a0\u901f",
				5: "\u88c5\u8f7d\u52a0\u901f",
				6: "\u8d39\u7528\u964d\u4f4e",
				7: "\u88c5\u8f7d\u91cf\u5927",
				8: "\u884c\u8d70\u52a0\u901f",
				9: "\u88c5\u8f7d\u52a0\u901f",
				10: "\u8d39\u7528\u964d\u4f4e",
				11: "\u88c5\u8f7d\u91cf\u5927"
			},
			cc._RF.pop()
	},
	{}],
	DataCenter: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "8a43aisqH9FlovW9meC55F1", "DataCenter");
		var i = e("NumberData");
		cc.Class({
			extends: e("EasyEvent").declareEvent("QueryData", "MineChanged"),
			editor: {
				menu: "GameModule/DataCenter"
			},
			properties: {
				prbDialogIdleReward: cc.Prefab,
				prbDialogSyncData: cc.Prefab
			},
			onLoad: function () {
				console.log(this);
				this.prbDialogIdleReward.data.children[3].children[3].children[0].children[0].getComponent(cc.Label).string = Language.getName("Collect");
				this.prbDialogIdleReward.data.children[3].children[2].getComponent(cc.Label).string = Language.getName("Your reward has increased") + "!";
				this.prbDialogIdleReward.data.children[1].getComponent(cc.Label).string = Language.getName("Idle Cash Gain");
				this.prbDialogIdleReward.data.children[2].children[3].getComponent(cc.Label).string = Language.getName("Your miners worked hard for you \nwhile you were away") + ".";
				this.prbDialogIdleReward.data.children[2].children[5].children[2].children[0].children[0].getComponent(cc.Label).string = Language.getName("Collect");
				var e = CfgMgr.Mine.getMineConfig(UserData.GameData.CurrentMine);
				UserData.GameData.Cashs[e.init_currency_type] || (UserData.GameData.Cashs[e.init_currency_type] = e.init_currency),
					UserData.GameData.TotalCash = UserData.GameData.Cashs[e.init_currency_type],
					this.SAVE_DUR = 1,
					this.SAVE_CLOUD_DUR = 30

				//500毫秒缓存
				setInterval(() => { this.saveData() }, 5000);
			},
			start: function () {
				var e = this;
				UserData.readCloud(null,
					function () {
						e._isNeedRestore(UserData.cloudData.GameData, UserData.GameData) ? ViewMgr.showDialog(cc.instantiate(e.prbDialogSyncData)) : console.log("[\u4e0d\u9700\u8981\u8fd8\u539f\u6570\u636e]")
					}),
					this.checkOfflineReward(),
					"undefined" != typeof FBInstant && this.schedule(function () {
						e.saveData()
					},
						this.SAVE_DUR),
					"undefined" != typeof FBInstant && this.schedule(function () {
						e._isNeedRestore(UserData.cloudData.GameData, UserData.GameData) || e.saveData(!0)
					},
						this.SAVE_CLOUD_DUR)
			},
			_isNeedRestore: function (e, t) {
				try {
					if (null == e) return !1;
					for (var a in e.Cashs) if (null == t.Cashs[a]) return !0;
					for (var a in t.Cashs) if (null == e.Cashs[a]) return !1;
					var n = 0;
					for (var a in e.Mine) e.Mine[a].Common.unlocked && n++;
					var r = 0;
					for (var a in t.Mine) t.Mine[a].Common.unlocked && r++;
					if (n > r) return !0;
					if (n < r) return !1;
					var o = 0;
					for (var a in e.Mine) o += e.Mine[a].Prestige.time;
					var s = 0;
					for (var a in t.Mine) s += t.Mine[a].Prestige.time;
					if (o > s) return !0;
					if (o < s) return !1;
					var c = 0;
					for (var a in e.Mine) c += e.Mine[a].Seam.unlockedLayerNum;
					var l = 0;
					for (var a in t.Mine) l += t.Mine[a].Seam.unlockedLayerNum;
					if (c > l) return !0;
					if (l > c) return !1;
					for (var a in t.Mine) {
						if (e.Mine[a].Elevator.level || (e.Mine[a].Elevator.level = 0), t.Mine[a].Elevator.level || (t.Mine[a].Elevator.level = 0), e.Mine[a].Elevator.level > t.Mine[a].Elevator.level) return !0;
						if (e.Mine[a].Elevator.level < t.Mine[a].Elevator.level) return !1
					}
					for (var a in t.Mine) {
						if (e.Mine[a].StoreHouse.level || (e.Mine[a].StoreHouse.level = 0), t.Mine[a].StoreHouse.level || (t.Mine[a].StoreHouse.level = 0), e.Mine[a].StoreHouse.level > t.Mine[a].StoreHouse.level) return !0;
						if (e.Mine[a].StoreHouse.level < t.Mine[a].StoreHouse.level) return !1
					}
					for (var a in t.Mine) {
						var d = 0;
						t.Mine[a].Seam.list.forEach(function (e) {
							e && (d += e.level)
						});
						var h = 0;
						if (e.Mine[a].Seam.list.forEach(function (e) {
							e && (h += e.level)
						}), d > h) return !1;
						if (d < h) return !0
					}
					for (var a in e.Cashs) {
						var u = new i(e.Cashs[a]),
							m = new i(t.Cashs[a]);
						if (u.clone().remove(m).compare(u.clone().mult(.5)) >= 0) return !0
					}
					return e.SuperCash - t.SuperCash > 1e3 || (t.SuperCash, e.SuperCash, !1)
				} catch (e) {
					return ErrorHandler.report({
						message: "\u7528\u6237\u6570\u636e\u6bd4\u5bf9\u5f02\u5e38",
						error: e
					}),
						!1
				}
			},
			checkOfflineReward: function () {
				if (null == Tutorial.currentTutorial && !Ad.isWatchingVideo) {
					var e = (new Date).getTime() - IdleCashMgr.getIdleDate();
					IdleCashMgr.getIdleCash().mult(Math.ceil(e / 1e3)).compare(0) > 0 && e >= 2e3 * this.SAVE_DUR ? (this._noRefreshIdleDate = !0, cc.isValid(this.idleRewardDialogHandler) || (this.idleRewardDialogHandler = ViewMgr.showDialog(cc.instantiate(this.prbDialogIdleReward), {
						touchhide: !1
					}))) : (this._noRefreshIdleDate = !1, IdleCashMgr.collectIdleCash())
				}
			},
			saveData: function () {
				var e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
				e && console.log("[\u4e91\u7aef\u6570\u636e\u4e0a\u4f20]"),
					this._noRefreshIdleDate || IdleCashMgr.collectIdleCash(),
					IdleCashMgr.setIdleDate();
				var t = CfgMgr.Mine.getMineConfig(UserData.GameData.CurrentMine).init_currency_type;
				UserData.GameData.Cashs[t] = UserData.GameData.TotalCash,
					UserData.GameData.UpdateDate = Date.now(),
					e ? UserData.saveCloud() : UserData.save()
			},
			onCollectedCash: function (e) {
				this._noRefreshIdleDate = !1
			},
			onGameHide: function (e) {
				// this.saveData(),
				// this._isNeedRestore(UserData.cloudData.GameData, UserData.GameData) || (console.log("[\u4e91\u7aef\u6570\u636e\u4e0a\u4f20]"), UserData.saveCloud()),
				// console.log("[\u6e38\u620f\u8fdb\u5165\u540e\u53f0,\u5df2\u81ea\u52a8\u4fdd\u5b58\u6570\u636e]")
			},
			onGameShow: function (e) {
				this.checkOfflineReward()
			},
			onMineSelected: function (e) {
				if (e.mine != UserData.GameData.CurrentMine) {
					this.saveData(),
						UserData.GameData.CurrentMine = e.mine;
					var t = CfgMgr.Mine.getMineConfig(UserData.GameData.CurrentMine);
					UserData.GameData.Cashs[t.init_currency_type] || (UserData.GameData.Cashs[t.init_currency_type] = t.init_currency),
						UserData.GameData.TotalCash = UserData.GameData.Cashs[t.init_currency_type],
						this.publishEvent({
							type: "MineChanged",
							mine: e.mine
						}),
						this.checkOfflineReward()
				}
			},
			onNewSeamLayerUnlock: function (e) {
				var t = 100 * parseInt(UserData.GameData.CurrentMine) + e.layerNum;
				Platform.submitScore({
					rankName: Constant.RANKLIST_FRIEND,
					score: t
				})
			},
			onSyncCloudData: function (e) {
				ViewMgr.removeDialog(this.idleRewardDialogHandler),
					this.idleRewardDialogHandler = null,
					this.checkOfflineReward()
			}
		}),
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent",
		NumberData: "NumberData"
	}],
	DataStore: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "4e55ekxBnRMZb6cCfSd+o88", "DataStore"),
			cc.Class({
				init: function () {
					var t = this;["save", "read", "delete", "readCloud", "saveCloud"].forEach(function (e) {
						t[e] = function (t) {
							if (t || (t = {}), null != this.impl && "function" == typeof this.impl[e]) return this.impl[e](t);
							cc.warn("[DataStore]\u65b9\u6cd5" + e + "\u672a\u5b9e\u73b0"),
								"function" == typeof t.fail && t.fail()
						}
					});
					var a = Framework.moduleCode + "DataStore",
						i = void 0;
					try {
						i = e(a)
					} catch (e) { }
					null != i ? (this.impl = new i, "function" == typeof this.impl.init && this.impl.init(), console.log("[DataStore]\u5df2\u542f\u7528 " + a)) : cc.warn("[DataStore]" + a + " \u4e0d\u5b58\u5728,\u5b58\u50a8API\u4e0d\u53ef\u7528.")
				}
			}),
			cc._RF.pop()
	},
	{}],
	DialogCashAdd: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "3c155b4+yZNV46EaeqH3+0Z", "DialogCashAdd");
		e("analytics-data");
		var i = [15, 20, 25, 30, 35];
		cc.Class({
			extends: e("EasyEvent"),
			properties: {
				adVideoButton: e("AdVideoButton"),
				labCDTime: cc.Label,
				tomorrowNode: cc.Node,
				videoNode: cc.Node,
				dialogGoodPrefab: cc.Prefab,
				cashNode: [cc.Node]
			},
			start: function () {
				this.checkTime(UserData.GameData.CashAdd.date, (new Date).getTime()) || (UserData.GameData.CashAdd.get = 0, UserData.GameData.CashAdd.date = (new Date).getTime()),
					this.updateData();
				var e = this.getTimeLeft();
				this.labCDTime.string = Language.getName("Resets in") + ": " + Tools.timespanFormat(e),
					this.adVideoButton.coolDownTag = "CashAdd"
			},
			updateData: function () {
				this.tomorrowNode.active = !1,
					this.videoNode.active = !1,
					UserData.GameData.CashAdd.get >= i.length ? this.tomorrowNode.active = !0 : this.videoNode.active = !0;
				for (var e = 0; e < this.cashNode.length; e++) this.cashNode[e].getComponent("CashAddListViewItem").updateData({
					indexId: e,
					cash: i[e]
				})
			},
			onCloseBtnClicked: function () {
				ViewMgr.hideDialogBegin()
			},
			onCheckClicked: function () {
				var e = this;
				Music.play("SFX_Button General");
				var t = this;
				Ad.showVideo({
					type: "cashadd",
					success: function (a) {
						a && a.virtual || Analysis.sendEvent({
							type: "cashaddAdSuccess"
						});
						var n = i[UserData.GameData.CashAdd.get],
							r = cc.instantiate(e.dialogGoodPrefab),
							o = {
								title: Language.getName("Congratulations"),
								icon: "IconSuperCash_128",
								num: n,
								explan: Language.getName("You Get Super Cash") + " " + n,
								callback: function () {
									t.publishEvent({
										type: "AddSuperCash",
										superCashNum: n
									})
								}
							};
						r.getComponent("DialogGood").setData(o),
							ViewMgr.showDialog(r),
							UserData.GameData.CashAdd.get++,
							Analysis.sendEvent({
								type: "cashadd",
								num: 1,
								data: {
									type: "" + UserData.GameData.CashAdd.get
								}
							}),
							t.updateData(),
							console.log("ad show success")
					},
					fail: function (e) {
						console.log("ad show failed :" + e)
					}
				})
			},
			getTimeLeft: function () {
				var e = new Date;
				return e.setHours(24, 0, 0, 0),
					e - new Date
			},
			checkTime: function (e, t) {
				if (e && t) {
					var a = new Date(parseInt(e)),
						i = new Date(parseInt(t));
					if (a.getFullYear() == i.getFullYear() && a.getMonth() == i.getMonth() && a.getDate() == i.getDate()) return !0
				}
				return !1
			},
			update: function (e) {
				var t = this.getTimeLeft();
				this.labCDTime.string = Language.getName("Resets in") + ": " + Tools.timespanFormat(t)
			}
		}),
			cc._RF.pop()
	},
	{
		AdVideoButton: "AdVideoButton",
		EasyEvent: "EasyEvent",
		"analytics-data": "analytics-data"
	}],
	DialogCusShare: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "d10a1cvHDZLpphRydu83nHX", "DialogCusShare"),
			cc.Class({
				extends: cc.Component,
				properties: {
					nodeshortcut: cc.Node,
					playerSprite: cc.Sprite,
					friendSprite: cc.Sprite
				},
				onLoad: function () {
					var e = this;
					e.playerSprite && cc.loader.load(Platform.getPlayerPhoto(),
						function (t, a) {
							e.playerSprite.spriteFrame = new cc.SpriteFrame(a)
						})
				},
				setData: function (e) {
					var t = this;
					this.type = e.type,
						e.friend && t.friendSprite && cc.loader.load(e.friend.url,
							function (e, a) {
								t.friendSprite.spriteFrame = new cc.SpriteFrame(a)
							})
				},
				btnShare: function () {
					Music.play("SFX_Button General"),
						Analysis.sendEvent({
							type: "BtnShareClick"
						}),
						Platform.shareCustom(this.nodeshortcut, this.type)
				},
				closeClicked: function () {
					ViewMgr.hideDialogBegin()
				}
			}),
			cc._RF.pop()
	},
	{}],
	DialogDebug: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "0140aH7FeRNRZP7tc3YbY1n", "DialogDebug");
		var i = e("NumberData");
		cc.Class({
			extends: e("EasyEvent"),
			editor: {
				menu: "Dialog/DialogDebug"
			},
			properties: {
				txtAddCash: cc.EditBox,
				txtAddSuperCash: cc.EditBox,
				toggleDebugEvent: cc.Toggle,
				toggleDebugStats: cc.Toggle
			},
			onLoad: function () {
				this.toggleDebugEvent.isChecked = window.DEBUG_EVENT,
					this.toggleDebugStats.isChecked = cc.debug.isDisplayStats()
			},
			btnClearUserDataClick: function (e, t) {
				UserData.clear(),
					location.reload()
			},
			btnCloseClick: function (e, t) {
				ViewMgr.hideDialogBegin()
			},
			btnAddCashClick: function (e, t) {
				var a = this.txtAddCash.string;
				"" == a && (a = this.txtAddCash.placeholder);
				var n = new i(a);
				isNaN(n.value) ? Platform.showToast({
					title: "\u5b57\u7b26\u4e32:" + a + "\u683c\u5f0f\u9519\u8bef."
				}) : this.publishEvent({
					type: "AddCash",
					cashNum: n
				})
			},
			btnAddSuperCashClick: function (e, t) {
				var a = this.txtAddSuperCash.string;
				"" == a && (a = this.txtAddSuperCash.placeholder);
				var i = parseInt(a);
				isNaN(i) ? Platform.showToast({
					title: "\u5b57\u7b26\u4e32:" + a + "\u683c\u5f0f\u9519\u8bef."
				}) : this.publishEvent({
					type: "AddSuperCash",
					superCashNum: i
				})
			},
			toggleDebugEventClick: function (e) {
				window.DEBUG_EVENT = e.isChecked
			},
			toggleDebugStatsClick: function (e) {
				cc.debug.setDisplayStats(e.isChecked)
			}
		}),
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent",
		NumberData: "NumberData"
	}],
	DialogGood: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "87a2aVi5klDF7m7cJmUGMUE", "DialogGood"),
			cc.Class({
				extends: cc.Component,
				properties: {
					title: cc.Label,
					icon: cc.Sprite,
					num: cc.Label,
					explan: cc.Label
				},
				start: function () {
					this.node.width = cc.winSize.width,
						this.node.height = cc.winSize.height
				},
				setData: function (e) {
					var t = this;
					this.title.string = e.title,
						this.num.string = e.num ? e.num : "",
						this.explan.string = e.explan,
						cc.loader.loadRes("texture/itemIcon/" + e.icon, cc.SpriteFrame,
							function (e, a) {
								e || (t.icon.spriteFrame = a)
							}),
						this.callback = e.callback
				},
				close: function () {
					ViewMgr.hideDialogBegin(this.callback)
				}
			}),
			cc._RF.pop()
	},
	{}],
	DialogIdleReward: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "ef384dxjh9OUKN4CmDIIJBk", "DialogIdleReward");
		e("NumberData");
		cc.Class({
			extends: e("EasyEvent").declareEvent("AddCash", "CollectedCash"),
			editor: {
				menu: "Dialog/DialogIdleReward"
			},
			properties: {
				labTime: cc.Label,
				labReward: cc.Label,
				labDoubleReward: cc.Label,
				normalPanel: cc.Node,
				doublePanel: cc.Node,
				shareNode: cc.Node,
				videoNode: cc.Node
			},
			onLoad: function () {
				this.normalPanel.active = !0,
					this.doublePanel.active = !1,
					this.offTime = Math.max((new Date).getTime() - IdleCashMgr.getIdleDate(), 1e3),
					this.labTime.string = Tools.timespanFormat(this.offTime),
					this.idleCash = IdleCashMgr.getTotalIdleCash(),
					this.labReward.string = this.idleCash.toString(),
					Platform.shareOrVideo({
						type: "DoubleIdleCash",
						sharenode: this.shareNode,
						videonode: this.videoNode
					})
			},
			btnCollectClick: function (e, t) {
				this.publishEvent({
					type: "ShowAddCoinAct",
					cashType: 1,
					start: e.target.parent.convertToWorldSpaceAR(e.target)
				}),
					this.publishEvent({
						type: "CollectedCash"
					}),
					this.publishEvent({
						type: "AddCash",
						cashNum: this.idleCash
					}),
					IdleCashMgr.collectIdleCash(),
					ViewMgr.hideDialogBegin(),
					Analysis.sendEvent({
						type: "CollectIdleCash"
					})
			},
			btnCollectDoubleClick: function (e) {
				var t = this;
				Ad.showVideo({
					type: "DoubleIdleCash",
					success: function (e) {
						e && e.virtual || Analysis.sendEvent({
							type: "DoubleIdleCashAdSuccess"
						}),
							console.log("ad video show success"),
							t.idleCash.mult(2),
							t.labDoubleReward.string = t.idleCash.toString(),
							t.normalPanel.active = !1,
							t.doublePanel.active = !0
					},
					fail: function (e) {
						console.log("ad video show failed :" + e)
					}
				})
			},
			btnCollectDoubleClickShare: function (e) {
				var t = this;
				Platform.chooseContext({
					type: "DoubleIdleCash",
					success: function (e) {
						console.log("ad video show success"),
							t.idleCash.mult(2),
							t.labDoubleReward.string = t.idleCash.toString(),
							t.normalPanel.active = !1,
							t.doublePanel.active = !0
					},
					fail: function (e) {
						console.log("ad video show failed :" + e),
							e && Platform.showToast({
								title: e
							})
					}
				})
			}
		}),
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent",
		NumberData: "NumberData"
	}],
	DialogItem: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "c4d66Jjgc5DT4bdggC7iQns", "DialogItem"),
			cc.Class({
				extends: cc.Component,
				properties: {
					title: cc.Label,
					content: cc.Label,
					effect: cc.Node,
					icon: cc.Sprite,
					explan: cc.Label,
					buy: cc.Node,
					buy1: cc.Label,
					buy2: cc.Label,
					costItem: cc.Sprite,
					okBtn: cc.Node,
					cancelBtn: cc.Node
				},
				start: function () {
					this.node.width = cc.winSize.width,
						this.node.height = cc.winSize.height
				},
				setData: function (e) {
					var t = this;
					this.title.string = e.title,
						this.content.node.active = !1,
						e.content && (this.content.node.active = !0, this.content.string = e.content),
						this.effect.active = !1,
						e.effect && (this.effect.active = !0, this.effect.getChildByName("EffectLabel").getComponent(cc.Label).string = e.effect),
						this.explan.node.active = !1,
						e.explan && (this.explan.node.active = !0, this.explan.string = e.explan),
						this.buy.active = !1,
						e.cost && (this.buy.active = !0, this.buy2.string = e.cost + "?"),
						this.okBtn.active = 1 == e.btn,
						this.cancelBtn.active = 0 == e.btn,
						cc.loader.loadRes("texture/itemIcon/" + e.icon, cc.SpriteFrame,
							function (e, a) {
								e || (t.icon.spriteFrame = a)
							}),
						e.callback && (this.callback = e.callback)
				},
				onOkClicked: function () {
					var e = this;
					ViewMgr.hideDialogBegin(function () {
						e.callback && e.callback(!0)
					})
				},
				onCancelClicked: function () {
					var e = this;
					ViewMgr.hideDialogBegin(function () {
						e.callback && e.callback(!1)
					})
				}
			}),
			cc._RF.pop()
	},
	{}],
	DialogLevelUp: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "21e58XMivxL1YBsatxT5ZuC", "DialogLevelUp");
		var i = e("PrisonerManager"),
			n = e("NumberData");
		cc.Class({
			extends: e("EasyEvent").declareEvent("ScrollToDesignationPosition", "ShowAddCoinAct", "RequestLevelUpDataStoreHouse", "RequestLevelUpDataElevator", "RequestLevelUpDataSeam", "SpendCash", "LevelUpModeChanged", "LevelUpBtnUpgrade"),
			properties: {
				items: [cc.Node],
				labTitle: {
					type: cc.Label,
					default:
						null
				},
				labMoney: {
					type: cc.Label,
					default:
						null
				},
				labCashNum: {
					type: cc.Label,
					default:
						null
				},
				progressLevel: {
					type: cc.ProgressBar,
					default:
						null
				},
				nodeCashNum: {
					type: cc.Node,
					default:
						null
				},
				nodeSlide: {
					type: cc.Node,
					default:
						null
				},
				spriteBranchIcon: {
					type: cc.Sprite,
					default:
						null
				},
				btnUpgrade: cc.Button,
				labCurLevel: cc.Label,
				labChildName: cc.Label,
				labNextUpgradeLevel: cc.Label,
				labUpCount: cc.Label,
				arrBtnLevelUpMode: [cc.Node],
				nodeBottleNeck: cc.Node,
				labBottileNeckHint: cc.Label,
				nodeInfoBg: cc.Node,
				nodeLine: cc.Node
			},
			onLoad: function () { },
			start: function () {
				this.refreshUpgradeBtnState()
			},
			initData: function (e, t) {
				var a = this;
				this.minerBranch = e,
					this.minerId = t,
					this.levelUpMode = UserData.getMineDataRef("Setting").LevelUpMode,
					this.nodeSlide.position = this.arrBtnLevelUpMode[this.levelUpMode - 1].position,
					cc.loader.loadRes("texture/dialogLevelUp/Common_" + this.minerBranch, cc.SpriteFrame,
						function (e, t) {
							try {
								e ? console.log("err:" + e) : a.spriteBranchIcon.spriteFrame = t
							} catch {
								console.log(111)
							}

						}),
					this.requestData()
			},
			requestData: function () {
				var e = this,
					t = null;
				this.minerBranch == i.EnumMinerBranch.Seam ? t = "Seam" : this.minerBranch == i.EnumMinerBranch.Elevator ? t = "Elevator" : this.minerBranch == i.EnumMinerBranch.StoreHouse && (t = "StoreHouse"),
					this.publishEvent({
						type: "RequestLevelUpData" + t,
						minerId: this.minerId,
						levelUpMode: this.levelUpMode,
						callback: function (t) {
							e.reloadData(t)
						},
						target: this
					})
			},
			reloadData: function (e) {
				var t = this;
				this.upgradeMoney = e.money,
					this.limitLevel = e.limitLevel,
					this.isMaxLevel = e.isMaxLevel,
					this.labChildName.string = e.childName,
					this.progressLevel.progress = e.progress,
					this.labUpCount.string = Language.getName("UPGRADE") + " x" + this.limitLevel,
					this.cashNum = e.cashNum,
					this.isMaxLevel ? this.nodeCashNum.active = !1 : e.cashNum > 0 ? (this.nodeCashNum.active = !0, this.labCashNum.string = "+" + e.cashNum.toString()) : this.nodeCashNum.active = !1,
					this.upgradeLevel = e.upgradeLevel,
					this.curLevel = e.curLevel,
					this.labCurLevel.string = Language.getName("Level") + " " + e.curLevel,
					e.isMaxLevel ? this.labNextUpgradeLevel.string = Language.getName("Max") : this.labNextUpgradeLevel.string = Language.getName("Next boost at Level") + " " + e.upgradeLevel,
					this.labMoney.string = e.money.toString(),
					this.labTitle.string = e.title,
					4 == e.properties.length ? (this.items[4].active = !1, this.nodeInfoBg.height = 248, this.nodeLine.active = !1, this.items[3].y = -203, this.items[3].getChildByName("bg").color = cc.color("#6683AA"), this.items[3].getChildByName("labProNow").color = cc.color("#F7CE76")) : (this.items[4].active = !0, this.nodeInfoBg.height = 332, this.nodeLine.active = !0, this.items[3].y = -93, this.items[3].getChildByName("bg").color = cc.color("#7A7A7A"), this.items[3].getChildByName("labProNow").color = cc.color("#FFFFFF"));
				for (var a = function (a) {
					var i = e.properties[a],
						n = t.items[a],
						r = n.getChildByName("labProName"),
						o = n.getChildByName("labProNow"),
						s = n.getChildByName("labProNext"),
						// c = n.getChildByName("bg").getChildByName("icon"),
						l = i.colorState ? cc.color("#75FB10") : cc.color(78, 89, 96);
					o.getComponent(cc.Label).string = i.valNow,
						r.getComponent(cc.Label).string = i.proName,
						s.getComponent(cc.Label).string = i.valNext,
						s.color = l,
						i.colorState ? (s.getComponent(cc.LabelShadow).offset = cc.v2(0, -2), s.getComponent(cc.LabelOutline).width = 2) : (s.getComponent(cc.LabelShadow).offset = cc.v2(0, 0), s.getComponent(cc.LabelOutline).width = 0),
						cc.loader.loadRes("texture/dialogLevelUp/MinerSkill" + i.iconId, cc.SpriteFrame,
							function (e, t) {
								e ? console.log("err:" + e) : console.log("err2:" + e)
							})
				},
					i = 0; i < e.properties.length; i++) a(i);
				this.refreshUpgradeBtnState(),
					this.publishEvent({
						type: "RequestElevatorTotalPower",
						notIgnoreManager: !1,
						callback: function (e) {
							t.elevatorTotalPower = e.totalPower
						},
						target: this
					}),
					this.publishEvent({
						type: "RequestStoreTotalPower",
						notIgnoreManager: !1,
						callback: function (e) {
							t.storeTotalPower = e.totalPower
						},
						target: this
					}),
					this.publishEvent({
						type: "RequestSeamTotalPower",
						notIgnoreManager: !1,
						callback: function (e) {
							t.seamTotalPower = e.totalPower
						},
						target: this
					}),
					this.refreshBottleNeck()
			},
			refreshUpgradeBtnState: function () {
				this.isMaxLevel ? this.btnUpgrade.interactable = !1 : this.upgradeMoney.compare(new n(UserData.GameData.TotalCash)) < 0 ? this.btnUpgrade.interactable = !0 : this.btnUpgrade.interactable = !1,
					this.checkShowUpgradeBtnAni(this.btnUpgrade.interactable)
			},
			checkShowUpgradeBtnAni: function (e) {
				if (e) {
					var t = this.btnUpgrade.node.getChildByName("Background").getComponent(cc.Animation).getAnimationState("btntest");
					t && !t.isPlaying && this.btnUpgrade.node.getChildByName("Background").getComponent(cc.Animation).play(),
						this.btnUpgrade.node.getChildByName("Background").getChildByName("Background").active = !0
				} else this.btnUpgrade.node.getChildByName("Background").getComponent(cc.Animation).stop(),
					this.btnUpgrade.node.getChildByName("Background").getChildByName("Background").active = !1
			},
			btnChooseUpgradeLevel: function (e, t) {
				Music.play("SFX_Change Tab"),
					this.levelUpMode = t,
					this.nodeSlide.position = e.target.position,
					UserData.getMineDataRef("Setting").LevelUpMode = t,
					this.publishEvent({
						type: "LevelUpModeChanged",
						mode: this.levelUpMode
					}),
					this.requestData()
			},
			refreshBottleNeck: function () {
				(this.nodeBottleNeck.active = !1, this.isMaxLevel) || this.elevatorTotalPower && this.storeTotalPower && this.seamTotalPower && ((this.elevatorTotalPower.compare(this.storeTotalPower) < 0 ? this.elevatorTotalPower : this.storeTotalPower).compare(this.seamTotalPower.clone().mult(Constant.BOTTLE_NECK_RADIO)) < 0 ? this.elevatorTotalPower.compare(this.storeTotalPower) < 0 ? this.minerBranch == i.EnumMinerBranch.Elevator && (this.nodeBottleNeck.active = !0, this.labBottileNeckHint.string = Language.getName("The elevator can't keep up with the shaft.")) : this.minerBranch == i.EnumMinerBranch.StoreHouse && (this.nodeBottleNeck.active = !0, this.labBottileNeckHint.string = "The warehouse can't keep up with the shaft.") : this.nodeBottleNeck.active = !1)
			},
			btnChangePage: function (e, t) {
				var a = UserData.getMineDataRef("Seam").unlockedLayerNum,
					n = [],
					r = 0;
				n.push({
					minerBranch: i.EnumMinerBranch.StoreHouse,
					minerId: 1
				}),
					n.push({
						minerBranch: i.EnumMinerBranch.Elevator,
						minerId: 1
					}),
					this.minerBranch == i.EnumMinerBranch.StoreHouse ? r = 0 : this.minerBranch == i.EnumMinerBranch.Elevator && (r = 1);
				for (var o = 1; o <= a; o++) n.push({
					minerBranch: i.EnumMinerBranch.Seam,
					minerId: o
				}),
					this.minerBranch == i.EnumMinerBranch.Seam && this.minerId == o && (r = 1 + o);
				r = 1 == t ? (r -= 1) < 0 ? n.length - 1 : r : (r += 1) >= n.length ? 0 : r,
					this.minerBranch != n[r].minerBranch && this.node.runAction(cc.sequence(cc.scaleTo(.1, 1.05), cc.scaleTo(.1, 1))),
					this.initData(n[r].minerBranch, n[r].minerId),
					this.publishEvent({
						type: "ScrollToDesignationPosition",
						minerBranch: this.minerBranch,
						minerId: this.minerId
					})
			},
			btnCloseDialogLevelUp: function () {
				ViewMgr.hideDialogBegin()
			},
			btnUpgradeClick: function () {
				if (Music.play("SFX_Popup General"), this.upgradeMoney.compare(new n(UserData.GameData.TotalCash)) < 0) {
					var e = null;
					this.minerBranch == i.EnumMinerBranch.Seam ? e = "Seam" : this.minerBranch == i.EnumMinerBranch.Elevator ? e = "Elevator" : this.minerBranch == i.EnumMinerBranch.StoreHouse && (e = "StoreHouse"),
						Analysis.sendEvent({
							type: "Upgrade" + e + "Click"
						}),
						this.curLevel + this.limitLevel >= this.upgradeLevel && this.publishEvent({
							type: "Add" + e + "SuperCash",
							minerId: this.minerId,
							cashNum: parseInt(this.cashNum)
						}),
						this.publishEvent({
							type: "LevelUp" + e,
							minerId: this.minerId,
							addLevel: this.limitLevel
						}),
						this.publishEvent({
							type: "SpendCash",
							cashNum: this.upgradeMoney.toNumber()
						}),
						this.requestData(),
						this.publishEvent({
							type: "LevelUpBtnUpgrade",
							minerBranch: this.minerBranch,
							minerId: this.minerId,
							addLevel: this.limitLevel
						})
				} else Platform.showToast({
					title: "Sorry, not enough money!"
				})
			},
			onCashChanged: function (e) {
				this.refreshUpgradeBtnState()
			},
			onUseSaleManager: function (e) {
				e.minerBranch == this.minerBranch && e.minerId == this.minerId && this.requestData()
			}
		}),
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent",
		NumberData: "NumberData",
		PrisonerManager: "PrisonerManager"
	}],
	DialogManager: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "01e8aJgFv9FeYHw8UZvUUnq", "DialogManager");
		var i = e("PrisonerManager"),
			n = e("NumberData");
		cc.Class({
			extends: e("EasyEvent").declareEvent("PrisonerManagerStateChange"),
			properties: {
				prefabManagerItem: {
					type: cc.Prefab,
					default:
						null
				},
				listViewManager: {
					type: cc.Node,
					default:
						null
				},
				nodeStateNormal: cc.Node,
				nodeStateBranch: cc.Node,
				nodeSliderSprite: cc.Node,
				nodeSlider: cc.Node,
				nodeHint: cc.Node,
				nodeHireManager: cc.Node,
				labBuyCount: cc.Label,
				labMoney: cc.Label,
				labTitle: cc.Label,
				arrNodeProperty: [cc.Node],
				nodeProperty: cc.Node,
				btnUpgrade: cc.Button,
				spriteFrameChoose: cc.SpriteFrame,
				spriteFrameNormal: cc.SpriteFrame
			},
			onLoad: function () { },
			initData: function (e, t, a, n) {
				var r = this;
				this.curManagerData = t,
					this.allManagerData = e,
					this.managerData = n,
					this.minerBranch = a,
					this.mode = 1,
					this.minerBranch == i.EnumMinerBranch.Seam ? this.labTitle.string = Language.getName("Mine Shaft Manager") : this.minerBranch == i.EnumMinerBranch.Elevator ? this.labTitle.string = Language.getName("Elevator Manager") : this.minerBranch == i.EnumMinerBranch.StoreHouse && (this.labTitle.string = Language.getName("warehouse manager")),
					this.aniManagerID = 0,
					this.showMainManagerAni = !1,
					0 == this.curManagerData.length && (this.nodeHint.active = !1),
					this.refreshHireInfo(this.mode),
					this.managerData.totalManager >= 10 ? this.showBranch = !0 : this.showBranch = !1,
					this.branchIndex = 1,
					this.refreshPropertyBtnState(),
					4 == SKILL_TYPE[this.minerBranch].length ? this.arrNodeProperty[4].active = !1 : (this.arrNodeProperty[3].active = !1, this.arrNodeProperty[4].active = !1);
				for (var o = function (e) {
					var t = r.arrNodeProperty[e].getChildByName("Gameicon01").getComponent(cc.Sprite);
					cc.loader.loadRes(CfgMgr.Manager.getPropertyIcon(SKILL_TYPE[r.minerBranch][e]), cc.SpriteFrame,
						function (e, a) {
							e ? cc.warn("\u52a0\u8f7d\u7ba1\u7406\u5458icon\u5931\u8d25") : t.spriteFrame = a
						})
				},
					s = 0; s < SKILL_TYPE[this.minerBranch].length; s++) o(s);
				this.calcBranchManager(),
					this.refreshDialog()
			},
			calcHireNeedMoney: function () {
				this.money = CfgMgr.Manager.getManagerCostCoin(this.minerBranch, this.managerData.totalManager, this.hireCount)
			},
			refreshHireBtnState: function () {
				this.money.compare(new n(UserData.GameData.TotalCash)) < 0 ? this.btnUpgrade.interactable = !0 : this.btnUpgrade.interactable = !1
			},
			calcBranchManager: function () {
				this.managerBranchData = {};
				for (var e = 0; e < SKILL_TYPE[this.minerBranch].length; e++) this.managerBranchData[SKILL_TYPE[this.minerBranch][e]] = [];
				for (var t = 0; t < this.allManagerData.length; t++) {
					var a = this.allManagerData[t];
					a.Index == this.aniManagerID ? a.showAni = !0 : a.showAni = !1;
					var i = CfgMgr.Manager.getManagerDataById(a.TableIndex);
					this.managerBranchData[i.skill_type].push(a)
				}
				for (var n = 0; n < SKILL_TYPE[this.minerBranch].length; n++) {
					this.managerBranchData[SKILL_TYPE[this.minerBranch][n]].sort(function (e, t) {
						var a = CfgMgr.Manager.getManagerDataById(e.TableIndex),
							i = CfgMgr.Manager.getManagerDataById(t.TableIndex);
						return a.quality < i.quality ? 1 : -1
					})
				}
			},
			refreshDialog: function () {
				var e = this;
				if (this.showBranch) {
					this.nodeStateNormal.active = !1,
						this.nodeStateBranch.active = !0,
						this.listViewManager.y = -120,
						this.listViewManager.height = 440,
						this.btnUpgrade.node.x = 171,
						this.nodeSlider.active = !0,
						this.nodeProperty.active = !0;
					var t = this.managerBranchData[SKILL_TYPE[this.minerBranch][this.branchIndex - 1]];
					if (this.listViewManager.getComponent("ListView").refreshData(t), 0 != this.aniManagerID) {
						for (var a = 0,
							i = 0; i < t.length; i++) if (t[i].showAni) {
								a += i;
								break
							}
						this.scheduleOnce(function () {
							e.listViewManager.getComponent("ListView").scrolltoIndex(a, .3)
						},
							.05)
					}
				} else this.nodeStateNormal.active = !0,
					this.nodeStateBranch.active = !1,
					this.listViewManager.y = -65,
					this.listViewManager.height = 526,
					this.btnUpgrade.node.x = 0,
					this.nodeSlider.active = !1,
					this.nodeProperty.active = !1,
					this.listViewManager.getComponent("ListView").refreshData(this.allManagerData);
				0 != this.curManagerData.TableIndex ? (this.nowManager || (this.nowManager = cc.instantiate(this.prefabManagerItem), this.node.addChild(this.nowManager), this.nowManager.position = cc.v2(0, 238)), this.showBranch ? this.nowManager.y = 339 : this.nowManager.y = 314, this.nowManager.active = !0, this.nodeHint.active = !1, this.nowManager.getComponent("ManagerItem").refreshData(- 1, this.curManagerData), this.showMainManagerAni && this.nowManager.runAction(cc.sequence(cc.scaleTo(.1, 1.2), cc.scaleTo(.1, 1)))) : (this.nodeHint.active = !0, this.showBranch ? this.nodeHint.y = 339 : this.nodeHint.y = 314, this.nowManager && (this.nowManager.active = !1))
			},
			start: function () { },
			refreshHireInfo: function (e) {
				if (1 == e) this.hireCount = 1;
				else if (2 == e) this.hireCount = 10;
				else if (3 == e) {
					var t = CfgMgr.Manager.getManagerCostLimit(this.minerBranch, this.managerData.totalManager);
					this.hireCount = t.count,
						this.money = t.money
				}
				3 != e && this.calcHireNeedMoney(),
					this.labMoney.string = this.money.toString(),
					this.labBuyCount.string = Language.getName("Hire Manager") + " x" + this.hireCount,
					this.refreshHireBtnState()
			},
			refreshPropertyBtnState: function () {
				for (var e = 0; e < this.arrNodeProperty.length; e++) e == this.branchIndex - 1 ? this.arrNodeProperty[e].getChildByName("Background").getComponent(cc.Sprite).spriteFrame = this.spriteFrameChoose : this.arrNodeProperty[e].getChildByName("Background").getComponent(cc.Sprite).spriteFrame = this.spriteFrameNormal
			},
			btnCloseDialogManager: function () {
				ViewMgr.hideDialogBegin()
			},
			btnChooseHireCount: function (e, t) {
				Music.play("SFX_Change Tab"),
					this.nodeSliderSprite.position = e.target.position,
					this.mode = t,
					this.refreshHireInfo(this.mode)
			},
			btnChangeProperty: function (e, t) {
				Music.play("SFX_Button General"),
					this.branchIndex = t,
					this.refreshPropertyBtnState(),
					this.refreshDialog()
			},
			btnHireManager: function (e) {
				Music.play("SFX_Button General"),
					UserData.GameData.Analytics.DialogManagerFirstHireManager || (UserData.GameData.Analytics.DialogManagerFirstHireManager = !0, Analysis.sendEvent({
						type: "FirstHireManager"
					})),
					Analysis.sendEvent({
						type: "BtnHireManagerClick",
						num: this.hireCount
					}),
					this.aniManagerID = 0,
					this.showMainManagerAni = !1,
					this.managerData.totalManager + this.hireCount >= 10 && (this.showBranch = !0);
				for (var t = 0; t < this.hireCount; t++) {
					this.managerData.totalManager++;
					var a = this.getNewTableData(this.managerData.totalManager);
					if (0 == this.curManagerData.TableIndex) this.curManagerData.TableIndex = a.TableIndex,
						this.curManagerData.SkillDate = a.SkillDate,
						this.curManagerData.Index = a.Index,
						this.curManagerData.Name = a.Name,
						this.showMainManagerAni = !0;
					else if (this.allManagerData.unshift(a), t == this.hireCount - 1 && (this.aniManagerID = this.managerData.totalManager, this.showBranch)) {
						var i = CfgMgr.Manager.getManagerDataById(a.TableIndex);
						this.branchIndex = SKILL_TYPE[this.minerBranch].indexOf(i.skill_type) + 1,
							this.refreshPropertyBtnState()
					}
				}
				this.calcBranchManager(),
					this.refreshDialog(),
					this.prisonerManagerState(),
					this.publishEvent({
						type: "SpendCash",
						cashNum: this.money.toNumber()
					}),
					this.refreshHireInfo(this.mode)
			},
			getNewTableData: function () {
				var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
					t = CfgMgr.Manager.getManagerIndexByBranch(this.minerBranch, this.managerData.totalManager);
				return {
					MinerBranch: this.minerBranch,
					MinerId: 1,
					TableIndex: t,
					SkillDate: 0,
					Index: e,
					Name: CfgMgr.Manager.getRandManagerName()
				}
			},
			onManagerAssign: function (e) {
				this.aniManagerID = 0,
					this.showMainManagerAni = !1;
				var t = Math.floor((new Date).getTime() / 1e3);
				if (t < this.curManagerData.SkillDate && (this.curManagerData.SkillDate = t), e.assign) {
					this.aniManagerID = this.curManagerData.Index;
					var a = this.getNewTableData();
					a.TableIndex = this.curManagerData.TableIndex,
						a.SkillDate = this.curManagerData.SkillDate,
						a.Index = this.curManagerData.Index,
						a.Name = this.curManagerData.Name,
						this.allManagerData.unshift(a),
						this.curManagerData.TableIndex = 0,
						this.curManagerData.Index = 0
				} else {
					this.showMainManagerAni = !0;
					for (var i = e.assignId,
						n = 0,
						r = 0; r < this.allManagerData.length; r++) if (this.allManagerData[r].Index == i) {
							n = r;
							break
						}
					var o = this.allManagerData[n].TableIndex,
						s = this.allManagerData[n].SkillDate,
						c = this.allManagerData[n].Index,
						l = this.allManagerData[n].Name;
					if (0 == this.curManagerData.TableIndex) this.curManagerData.TableIndex = o,
						this.curManagerData.SkillDate = s,
						this.curManagerData.Index = c,
						this.curManagerData.Name = l,
						this.allManagerData.splice(n, 1);
					else {
						this.aniManagerID = this.curManagerData.Index,
							this.allManagerData[n].TableIndex = this.curManagerData.TableIndex,
							this.allManagerData[n].SkillDate = this.curManagerData.SkillDate,
							this.allManagerData[n].Index = this.curManagerData.Index,
							this.allManagerData[n].Name = this.curManagerData.Name,
							this.curManagerData.TableIndex = o,
							this.curManagerData.SkillDate = s,
							this.curManagerData.Index = c,
							this.curManagerData.Name = l;
						var d = this.allManagerData.splice(n, 1);
						this.allManagerData.unshift(d[0])
					}
				}
				this.calcBranchManager(),
					this.refreshDialog(),
					this.prisonerManagerState()
			},
			prisonerManagerState: function () {
				this.publishEvent({
					type: "PrisonerManagerStateChange",
					minerBranch: this.minerBranch,
					minerId: this.curManagerData.MinerId,
					state: 0 != this.curManagerData.TableIndex
				})
			},
			onCashChanged: function (e) {
				this.refreshHireBtnState()
			},
			onSellManager: function (e) {
				for (var t = e.assignId,
					a = 0,
					i = 0; i < this.allManagerData.length; i++) if (this.allManagerData[i].Index == t) {
						a = i;
						break
					}
				this.allManagerData.splice(a, 1),
					this.calcBranchManager(),
					this.refreshDialog()
			}
		}),
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent",
		NumberData: "NumberData",
		PrisonerManager: "PrisonerManager"
	}],
	DialogMineDetail: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "2efa3hvvP9G+K1G+In/E3Kk", "DialogMineDetail");
		var i = e("NumberData");
		cc.Class({
			extends: e("EasyEvent"),
			editor: {
				menu: "Layer/Map/DialogMineDetail"
			},
			properties: {
				labCash_1: cc.Label,
				labCash_2: cc.Label,
				labCash_3: cc.Label,
				labCash_4: cc.Label,
				tabBtn_1: cc.Node,
				tabBtn_2: cc.Node,
				tabBtn_3: cc.Node,
				tabBtn_4: cc.Node,
				totalIconCash: cc.Sprite,
				cashType: 1,
				prbMineDetailItem: cc.Prefab,
				listContent: cc.Node,
				totalItem: cc.Node,
				labTotalIdleCash: cc.Label,
				shareCollectAllNode: cc.Node,
				videoCollectAllNode: cc.Node,
				shareBoostAllNode: cc.Node,
				videoBoostAllNode: cc.Node
			},
			onLoad: function () {
				for (var e = 1; e <= 4; e++) UserData.GameData.Cashs[e] ? this["tabBtn_" + e].active = !0 : this["tabBtn_" + e].active = !1;
				this.tabBtn_1.getComponent(cc.Button).interactable = !1,
					Platform.shareOrVideo({
						type: "CollectAllCashDouble",
						sharenode: this.shareCollectAllNode,
						videonode: this.videoCollectAllNode
					}),
					Platform.shareOrVideo({
						type: "BoostAllDouble",
						sharenode: this.shareBoostAllNode,
						videonode: this.videoBoostAllNode
					})
			},
			start: function () {
				this._loadList(),
					this._refresh(),
					this.schedule(this._refresh, 1)
			},
			calcTotalIdleCash: function () {
				var e = new i(0);
				return this.listItem.forEach(function (t) {
					t.refresh(),
						e.add(t.getIdleCash())
				}),
					e
			},
			_refresh: function () {
				this.labTotalIdleCash.string = this.calcTotalIdleCash().toString()
			},
			_loadList: function () {
				this.totalItem.removeFromParent(),
					this.listItem = [],
					this.listContent.destroyAllChildren();
				for (var e = 5 * (this.cashType - 1) + 1; e <= 5 * this.cashType; e++) {
					if (UserData.getMineDataRef("Common", e).unlocked) {
						var t = cc.instantiate(this.prbMineDetailItem);
						t.getComponent("MineDetailItem").setMine(e),
							this.listItem.push(t.getComponent("MineDetailItem")),
							this.listContent.addChild(t)
					}
				}
				this.listContent.addChild(this.totalItem)
			},
			tabButtonClick: function (e, t) {
				Music.play("SFX_Button General"),
					this.cashType = t;
				for (var a = 1; a <= 4; a++) this["tabBtn_" + a].getComponent(cc.Button).interactable = !0;
				e.target.getComponent(cc.Button).interactable = !1,
					this.totalIconCash.spriteFrame = e.target.getChildByName("IconCash").getComponent(cc.Sprite).spriteFrame,
					this._loadList(),
					this._refresh()
			},
			btnCloseClick: function (e, t) {
				ViewMgr.hideDialogBegin()
			},
			btnCollectAllDouble: function (e, t) {
				var a = this;
				Music.play("SFX_Button General"),
					Ad.showVideo({
						type: "CollectAllCashDouble",
						success: function (t) {
							t && t.virtual || Analysis.sendEvent({
								type: "CollectAllCashDoubleAdSuccess"
							});
							var n = new i(0);
							a.listItem.forEach(function (e) {
								if (e.mine != UserData.GameData.CurrentMine) {
									var t = IdleCashMgr.getTotalIdleCash(e.mine);
									IdleCashMgr.collectIdleCash(e.mine),
										IdleCashMgr.setIdleDate(e.mine),
										console.log("=======\u6536\u53d6\u79bb\u7ebf\u5956\u52b1", e.mine, t.toString()),
										n.add(t)
								}
							}),
								console.log("====\u603b\u8ba1:", n.toString() + "x2"),
								n.mult(2),
								a.publishEvent({
									type: "ShowAddCoinAct",
									cashType: 1,
									start: e.target.parent.convertToWorldSpaceAR(e.target)
								}),
								a.publishEvent({
									type: "AddCash",
									cashNum: n
								}),
								a._loadList(),
								a._refresh()
						},
						fail: function (e) { }
					})
			},
			btnCollectAllDoubleShrae: function (e, t) {
				Music.play("SFX_Button General");
				var a = this;
				Platform.chooseContext({
					type: "CollectAllCashDouble",
					success: function (t) {
						var n = new i(0);
						a.listItem.forEach(function (e) {
							if (e.mine != UserData.GameData.CurrentMine) {
								var t = IdleCashMgr.getTotalIdleCash(e.mine);
								IdleCashMgr.collectIdleCash(e.mine),
									IdleCashMgr.setIdleDate(e.mine),
									console.log("=======\u6536\u53d6\u79bb\u7ebf\u5956\u52b1", e.mine, t.toString()),
									n.add(t)
							}
						}),
							console.log("====\u603b\u8ba1:", n.toString() + "x2"),
							n.mult(2),
							a.publishEvent({
								type: "ShowAddCoinAct",
								cashType: 1,
								start: e.target.parent.convertToWorldSpaceAR(e.target)
							}),
							a.publishEvent({
								type: "AddCash",
								cashNum: n
							}),
							a._loadList(),
							a._refresh()
					},
					fail: function (e) {
						console.log("ad video show failed :" + e),
							e && Platform.showToast({
								title: e
							})
					}
				})
			},
			btnBoostAllDouble: function (e, t) {
				var a = this;
				Music.play("SFX_Button General"),
					this.listItem.length < 4 ? Platform.showToast({
						title: "All mines on continent must be\r\nunlocked first."
					}) : Ad.showVideo({
						type: "BoostAllDouble",
						success: function () {
							for (var e = 5 * (a.cashType - 1) + 1; e <= 5 * a.cashType; e++) ItemMgr.activeAd(e)
						},
						fail: function (e) { }
					})
			},
			btnBoostAllDoubleShare: function (e, t) {
				if (Music.play("SFX_Button General"), this.listItem.length < 4) Platform.showToast({
					title: "All mines on continent must be\r\nunlocked first."
				});
				else {
					var a = this;
					Platform.chooseContext({
						type: "BoostAllDouble",
						success: function (e) {
							for (var t = 5 * (a.cashType - 1) + 1; t <= 5 * a.cashType; t++) ItemMgr.activeAd(t)
						},
						fail: function (e) {
							console.log("ad video show failed :" + e),
								e && Platform.showToast({
									title: e
								})
						}
					})
				}
			}
		}),
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent",
		NumberData: "NumberData"
	}],
	DialogPrestigeSuccess: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "bdc94q8DslCEbpfQnNDe6qg", "DialogPrestigeSuccess"),
			cc.Class({
				extends: e("EasyEvent").declareEvent("AddSuperCash"),
				editor: {
					menu: "Dialog/DialogPrestigeSuccess"
				},
				properties: {
					mine: 1,
					labSuperCash: cc.Label,
					labMineInfo: cc.Label,
					labCurrentAbilityRate: cc.Label,
					labNextAbilityRate: cc.Label
				},
				onLoad: function () {
					this.prestige = UserData.getMineDataRef("Prestige", this.mine),
						console.log("\u91cd\u94f8\u6210\u529f:", this.prestige.time),
						this.preConf = CfgMgr.Mine.getPrestigeConfig(this.prestige.time, this.mine),
						this.reward = this.preConf.reward,
						this.labSuperCash.string = "+" + this.preConf.reward,
						this.mineConf = CfgMgr.Mine.getMineConfig(this.mine),
						this.labMineInfo.string = this.mine + "." + Localize.getString(this.mineConf.name) + " Prestige \n\rSuccessfull!"
				},
				setData: function (e) {
					this.mine = e.mine,
						this.labCurrentAbilityRate.string = e.currentAbilityRate + "x",
						this.labNextAbilityRate.string = e.nextAbilityRate + "x"
				},
				btnClaimClick: function (e, t) {
					this.publishEvent({
						type: "ShowAddCoinAct",
						cashType: 2,
						start: e.target.parent.convertToWorldSpaceAR(e.target)
					}),
						this.publishEvent({
							type: "AddSuperCash",
							superCashNum: this.reward
						}),
						ViewMgr.hideDialogBegin()
				}
			}),
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent"
	}],
	DialogPrestige: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "e6114iBAZ1P1au4ZAAbvInx", "DialogPrestige");
		var i = e("NumberData");
		cc.Class({
			extends: e("EasyEvent").declareEvent("PrestigeSuccess"),
			editor: {
				menu: "Dialog/DialogPrestige"
			},
			properties: {
				mine: 1,
				maxNode: cc.Node,
				normalNode: cc.Node,
				labTitle: cc.Label,
				labSubTitle: cc.Label,
				labConsume: cc.Label,
				labCurrentRate: cc.Label,
				labCurrentRate_2: cc.Label,
				labNextRate: cc.Label,
				labAddSuperCash: cc.Label,
				prbDialogPrestigeSuccess: cc.Prefab,
				btnPrestige: cc.Button,
				mineIcon: cc.Sprite
			},
			onLoad: function () {
				var e = this;
				console.log("\u91cd\u94f8\u754c\u9762\u6253\u5f00", this.mine),
					Analysis.sendEvent({
						type: "OpenPrestige"
					}),
					this.prestige = UserData.getMineDataRef("Prestige", this.mine),
					console.log("\u5f53\u524d\u91cd\u94f8\u6b21\u6570", this.prestige.time),
					this.mineConf = CfgMgr.Mine.getMineConfig(this.mine),
					this.labTitle.string = Localize.getString(this.mineConf.name) + " Prestige",
					this.labSubTitle.string = "Restart your " + Localize.getString(this.mineConf.name),
					this.conf = CfgMgr.Mine.getPrestigeConfig(this.prestige.time + 1, this.mine),
					null == this.conf ? (this.maxNode.active = !0, this.normalNode.active = !1, this.currentAbilityRate = CfgMgr.Mine.getAbilityRate(this.prestige.time, this.mine), this.labCurrentRate.string = this.currentAbilityRate + "x", this.labCurrentRate_2.string = this.currentAbilityRate + "x") : (this.labAddSuperCash.string = "+" + this.conf.reward, this.maxNode.active = !1, this.normalNode.active = !0, console.log("\u4e0b\u4e00\u6b21\u91cd\u94f8\u6d88\u8017", this.conf.currency), this.consume = new i(this.conf.currency), this.labConsume.string = this.consume.toString(), this.currentAbilityRate = CfgMgr.Mine.getAbilityRate(this.prestige.time, this.mine), this.nextAbilityRate = CfgMgr.Mine.getAbilityRate(this.prestige.time + 1, this.mine), this.labCurrentRate.string = this.currentAbilityRate + "x", this.labCurrentRate_2.string = this.currentAbilityRate + "x", this.labNextRate.string = this.nextAbilityRate + "x"),
					this._refresh(),
					cc.loader.loadRes("texture/theme/" + this.mine + "/Crate", cc.SpriteFrame,
						function (t, a) {
							t || (e.mineIcon.spriteFrame = a)
						})
			},
			_refresh: function () {
				if (this.conf) {
					var e = new i(UserData.GameData.TotalCash);
					this.btnPrestige.interactable = e.compare(this.consume) >= 0,
						this.labConsume.node.color = this.btnPrestige.interactable ? cc.Color.GREEN : cc.Color.RED
				}
			},
			setMine: function (e) {
				this.mine = e
			},
			btnCloseClick: function (e, t) {
				ViewMgr.hideDialogBegin()
			},
			btnPrestigeClick: function (e, t) {
				// var a = this;
				// this.publishEvent({
				// 	type: "SpendCash",
				// 	cashNum: this.consume
				// }),
				// UserData.prestigeMine(this.mine),
				// this.publishEvent({
				// 	type: "PrestigeSuccess",
				// 	mine: this.mine
				// }),
				// ViewMgr.hideDialogBegin(function() {
				// 	var e = cc.instantiate(a.prbDialogPrestigeSuccess);
				// 	e.getComponent("DialogPrestigeSuccess").setData({
				// 		mine: a.mine,
				// 		currentAbilityRate: a.currentAbilityRate,
				// 		nextAbilityRate: a.nextAbilityRate
				// 	}),
				// 	ViewMgr.showDialog(e, {
				// 		touchhide: !1
				// 	})
				// }),
				// Music.play("STING_Mine Prestige")
			},
			onCashChanged: function (e) {
				this._refresh()
			}
		}),
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent",
		NumberData: "NumberData"
	}],
	DialogShare: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "8b854yhPtRJAKqcLsQ48dFZ", "DialogShare"),
			cc.Class({
				extends: cc.Component,
				properties: {
					nodeItems: [cc.Node],
					labTotalRate: cc.Label,
					labTotal: cc.Label
				},
				onLoad: function () {
					var e = UserData.GameData.InviteCount,
						t = void 0,
						a = void 0;
					e < 2 ? (t = e, a = 1) : e > 18 ? (t = e % 4 == 0 ? 4 : e % 4, a = 17) : (t = 2, a = e - 1);
					for (var i = 0; i < this.nodeItems.length; i++) {
						var n = this.nodeItems[i],
							r = n.getChildByName("toggle"),
							o = n.getChildByName("ItemLabel");
						r.getComponent(cc.Toggle).isChecked = i < t,
							o.getComponent(cc.Label).string = "have " + (a + i) + " friends"
					}
					this.labTotal.string = e.toString(),
						this.labTotalRate.string = e >= 20 ? 5 * e + "%(max)" : 5 * e + "%",
						Analysis.sendEvent({
							type: "DialogShareClick"
						})
				},
				start: function () { },
				btnShare: function () {
					Music.play("SFX_Button General"),
						Analysis.sendEvent({
							type: "BtnShareClick"
						});
					var e = {
						callback: function () {
							console.log("fbshare success!")
						},
						failCB: function () {
							console.log("fbshare failed!")
						},
						type: "invitefriends"
					};
					Platform.shareAppMessage(e)
				},
				closeClicked: function () {
					ViewMgr.hideDialogBegin()
				}
			}),
			cc._RF.pop()
	},
	{}],
	DialogSign: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "c3c1elpQ1ZN0qgc6T4C+uQU", "DialogSign"),
			cc.Class({
				extends: e("EasyEvent"),
				properties: {
					listView: cc.Node,
					toggleContainer: cc.Node,
					extraSignItemNode: cc.Node,
					extragSignToggle: cc.Toggle,
					signItem: cc.Prefab,
					dialogGoodPrefab: cc.Prefab
				},
				start: function () {
					var e = [],
						t = CfgApi.get("Sign");
					for (var a in t) e.push(t[a]);
					e.sort(function (e, t) {
						return e.day < t.day ? -1 : 1
					}),
						UserData.GameData.Sign.extraDay > 0 && (UserData.GameData.Sign.extraList[7] = UserData.GameData.Sign.extraDay >= 7, UserData.GameData.Sign.extraList[14] = UserData.GameData.Sign.extraDay >= 14, UserData.GameData.Sign.extraList[21] = UserData.GameData.Sign.extraDay >= 21, UserData.GameData.Sign.extraList[30] = UserData.GameData.Sign.extraDay >= 30),
						UserData.GameData.Sign.extraDay = 0,
						this.checkTime() && UserData.GameData.Sign.day >= 30 && (UserData.GameData.Sign.day = 0, UserData.GameData.Sign.extraList[7] = !1, UserData.GameData.Sign.extraList[14] = !1, UserData.GameData.Sign.extraList[21] = !1, UserData.GameData.Sign.extraList[30] = !1),
						this.listView.getComponent("ListView").setData(e),
						this.listView.getComponent("ListView").scrolltoIndex(0 == UserData.GameData.Sign.day ? 0 : UserData.GameData.Sign.day - 1);
					var i = 0;
					for (var n in UserData.GameData.Sign.extraList) if (i++, 0 == UserData.GameData.Sign.extraList[n]) break;
					i >= 4 && (i = 4);
					var r = "toggle" + i;
					this.onToggleChanged({
						node: {
							name: r
						}
					});
					var o = this.toggleContainer.getChildByName(r).getComponent(cc.Toggle);
					o.isChecked = !0,
						this.toggleContainer.getComponent(cc.ToggleContainer).updateToggles(o),
						Analysis.sendEvent({
							type: "openSign"
						})
				},
				refreshExtraSign: function () {
					this.extraSignItemNode.removeAllChildren();
					for (var e = 0; e < this.extraSignData.extra_reward.length; ++e) {
						var t = cc.instantiate(this.signItem),
							a = this.extraSignData.extra_reward[e].split("-");
						t.getComponent("SignItem").setData({
							icon: "",
							id: a[0],
							num: a[1]
						}),
							this.extraSignItemNode.addChild(t)
					}
					this.extragSignToggle.node.active = this.extraSignData.day <= UserData.GameData.Sign.day,
						this.extragSignToggle.isCheck = UserData.GameData.Sign.extraList[this.extraSignData.day],
						this.extragSignToggle.interactable = this.extraSignData.day <= UserData.GameData.Sign.day && !UserData.GameData.Sign.extraList[this.extraSignData.day],
						this.extragSignToggle.checkMark.node.active = this.extragSignToggle.isCheck,
						this.extragSignToggle.target.active = !this.extragSignToggle.isCheck
				},
				onToggleChanged: function (e) {
					switch (Music.play("SFX_Button General"), this.toggleName = e.node.name, e.node.name) {
						case "toggle1":
							this.extraSignData = CfgApi.get("Sign", "7");
							break;
						case "toggle2":
							this.extraSignData = CfgApi.get("Sign", "14");
							break;
						case "toggle3":
							this.extraSignData = CfgApi.get("Sign", "21");
							break;
						case "toggle4":
							this.extraSignData = CfgApi.get("Sign", "30")
					}
					this.refreshExtraSign()
				},
				onCloseBtnClicked: function () {
					ViewMgr.hideDialogBegin()
				},
				onCheckClicked: function () {
					if (this.extraSignData.day === undefined) return;
					if (UserData.GameData.Sign.day === undefined) return;
					if (Music.play("SFX_Button General"), this.extraSignData.day <= UserData.GameData.Sign.day) {
						var e = !1;
						UserData.GameData.Sign.extraList[this.extraSignData.day] = !0;
						for (var t = 0; t < this.extraSignData.extra_reward.length; ++t) {
							var a = this.extraSignData.extra_reward[t].split("-");
							ItemMgr.addItem(a[0], parseInt(a[1])),
								e || 6 != CfgApi.get("Item", a[0]).type || (e = !0)
						}
						this.onGetSignItem({
							type: "GetSignItem",
							data: this.extraSignData.extra_reward
						}),
							e && this.publishEvent({
								type: "ShowAddCoinAct",
								cashType: 2,
								start: this.extragSignToggle.node.parent.convertToWorldSpaceAR(this.extragSignToggle.node.getPosition())
							})
					}
					this.extragSignToggle.node.active = this.extraSignData.day <= UserData.GameData.Sign.day,
						this.extragSignToggle.isCheck = UserData.GameData.Sign.extraList[this.extraSignData.day],
						this.extragSignToggle.interactable = this.extraSignData.day <= UserData.GameData.Sign.day && !UserData.GameData.Sign.extraList[this.extraSignData.day],
						this.extragSignToggle.checkMark.node.active = this.extragSignToggle.isCheck,
						this.extragSignToggle.target.active = !this.extragSignToggle.isCheck
				},
				checkTime: function (e, t, a) {
					var i = new Date;
					e = e || i.getFullYear(),
						t = t || i.getMonth(),
						a = a || i.getDate();
					var n = !1;
					if (e > UserData.GameData.Sign.date.year) n = !0;
					else if (e == UserData.GameData.Sign.date.year) if (t > UserData.GameData.Sign.date.month) n = !0;
					else if (t == UserData.GameData.Sign.date.month) {
						if (a > UserData.GameData.Sign.date.day) return !0;
						n = !1
					} else n = !1;
					else n = !1;
					return n
				},
				onGetSignItem: function (e) {
					var t = this,
						a = e.data,
						i = 0;
					async.whilst(function () {
						return i < a.length
					},
						function (e) {
							var n = a[i].split("-"),
								r = n[0],
								o = cc.instantiate(t.dialogGoodPrefab),
								s = CfgApi.get("Item", r),
								c = void 0;
							1 == s.type ? c = {
								title: Language.getName("Congratulations"),
								icon: s.icon,
								num: n[1],
								explan: s.param1 + "x " + Language.getName("Boost for") + s.param2 + "M",
								callback: function () {
									++i,
										e()
								}
							} : 2 == s.type ? c = {
								title: Language.getName("Congratulations"),
								icon: s.icon,
								num: n[1],
								explan: Language.getName("You Get ") + s.param2 + "m",
								callback: function () {
									++i,
										e()
								}
							} : 6 == s.type && (c = {
								title: Language.getName("Congratulations"),
								icon: s.icon,
								num: n[1],
								explan: Language.getName("You Get ") + n[1],
								callback: function () {
									++i,
										e()
								}
							}),
								o.getComponent("DialogGood").setData(c),
								ViewMgr.showDialog(o)
						},
						function () {
							t.onToggleChanged({
								node: {
									name: t.toggleName
								}
							})
						})
				}
			}),
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent"
	}],
	DialogSyncData: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "d5a9ck9paVC+JadASkaz1M4", "DialogSyncData"),
			cc.Class({
				extends: e("EasyEvent").declareEvent("SyncCloudData", "OpenSyncDataDialog", "CloseSyncDataDialog"),
				editor: {
					menu: "Dialog/DialogSyncData"
				},
				properties: {
					cloudCashInfoNode: cc.Node,
					localCashInfoNode: cc.Node,
					prbMapCashItem: cc.Prefab,
					labCloudDate: cc.Label,
					labLocalDate: cc.Label
				},
				onLoad: function () {
					this.labCloudDate.string = new Date(UserData.cloudData.GameData.UpdateDate).Format("yyyy-MM-dd hh:mm:ss"),
						this.labLocalDate.string = new Date(UserData.GameData.UpdateDate).Format("yyyy-MM-dd hh:mm:ss"),
						this._loadCashItems()
				},
				start: function () {
					this.publishEvent({
						type: "OpenSyncDataDialog"
					})
				},
				_loadCashItems: function () {
					for (var e in this.cloudCashInfoNode.destroyAllChildren(), UserData.cloudData.GameData.Cashs) {
						var t = cc.instantiate(this.prbMapCashItem);
						t.getComponent("SyncCashItem").setType(e, !0),
							this.cloudCashInfoNode.addChild(t)
					}
					for (var e in this.localCashInfoNode.destroyAllChildren(), UserData.GameData.Cashs) {
						var a = cc.instantiate(this.prbMapCashItem);
						a.getComponent("SyncCashItem").setType(e),
							this.localCashInfoNode.addChild(a)
					}
				},
				btnRestoreClick: function (e, t) {
					var a = this;
					UserData.GameData = JSON.parse(JSON.stringify(UserData.cloudData.GameData)),
						UserData.parseDataNByTemplate(),
						ViewMgr.hideDialogBegin(function () {
							a.publishEvent({
								type: "SyncCloudData"
							})
						})
				},
				btnCancelClick: function (e, t) {
					ViewMgr.hideDialogBegin(),
						this.publishEvent({
							type: "CloseSyncDataDialog"
						})
				}
			}),
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent"
	}],
	EasyEvent: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "2ccb82zdiNNObTdfcefZJcO", "EasyEvent"),
			window.__all_life_circle_events_map = [],
			window.__all_life_circle_events_list = [],
			t.exports = cc.Class({
				extends: cc.Component,
				statics: {
					declareEvent: function () {
						for (var e = void 0,
							t = arguments.length,
							a = Array(t), i = 0; i < t; i++) a[i] = arguments[i];
						return a.forEach(function (t) {
							e = "on" + t,
								-1 == window.__all_life_circle_events_list.indexOf(e) && window.__all_life_circle_events_list.push(e)
						}),
							this
					}
				},
				properties: {
					_lifeCircleEventsHandler: {
						default:
							null,
						type: cc.Component.EventHandler
					}
				},
				ctor: function () {
					var e = this;
					arguments.length > 0 && void 0 !== arguments[0] && arguments[0] || (this._lifeCircleEventsHandler = new cc.Component.EventHandler, this._lifeCircleEventsHandler.target = this, this._lifeCircleEventsHandler.component = "EasyEvent", this._lifeCircleEventsHandler.handler = "_onLifeCircleEvents", window.__all_life_circle_events_list.forEach(function (t) {
						null == window.__all_life_circle_events_map[t] && (window.__all_life_circle_events_map[t] = []),
							"function" == typeof e[t] && window.__all_life_circle_events_map[t].push(e._lifeCircleEventsHandler)
					}))
				},
				publishEvent: function (e) {
					if (null != e.type) {
						window.DEBUG_EVENT && console.log("[Event]", this.node.name, "\u53d1\u5e03\u4e8b\u4ef6:", e.type);
						var t = window.__all_life_circle_events_map["on" + e.type];
						t ? cc.Component.EventHandler.emitEvents(t, e) : cc.warn("[Event]", e.type, "\u8ba2\u9605\u5217\u8868\u4e3a\u7a7a,\u8bf7\u5148\u8c03\u7528declareEvent\u58f0\u660e\u8be5\u4e8b\u4ef6.")
					} else cc.error("\u9519\u8bef!\u8282\u70b9", this.node.name, "\u672a\u6307\u5b9a\u4e8b\u4ef6\u7c7b\u578b\uff0c\u4e8b\u4ef6\u88ab\u963b\u6b62:event.type == null")
				},
				_onLifeCircleEvents: function (e) {
					0 != this._isOnLoadCalled && this["on" + e.type].call(this, e)
				},
				onDestroy: function () {
					var e = this;
					window.__all_life_circle_events_list.forEach(function (t) {
						if (e[t]) {
							var a = [];
							window.__all_life_circle_events_map[t].forEach(function (t) {
								t.target != e && a.push(t)
							}),
								window.__all_life_circle_events_map[t] = a
						}
					})
				}
			}),
			cc._RF.pop()
	},
	{}],
	ElevatorCashInfo: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "592aesTATJGtLw6j11FxDfL", "ElevatorCashInfo"),
			cc.Class({
				extends: e("EasyEvent"),
				editor: {
					menu: "GameModule/Elevator/ElevatorCashInfo"
				},
				properties: {
					labCash: cc.Label
				},
				onLoad: function () {
					this.node.active = !1
				},
				onCabinData: function (e) {
					this.node.active = !0,
						this.labCash.string = e.mineNum,
						this.node.setPosition(this.node.parent.convertToNodeSpaceAR(e.worldPos)),
						this.node.y -= 10
				}
			}),
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent"
	}],
	Elevator: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "b3121NLP7VAupneX1VxAoib", "Elevator");
		var i = e("NumberData"),
			n = e("PrisonerManager"),
			r = cc.Enum({
				None: 0,
				Default: 1,
				Move: 2,
				Freight: 3,
				UnFreight: 4
			});
		cc.Class({
			extends: e("EasyEvent").declareEvent("Elevator", "AskSeamForMine", "MoveMineFromSeam", "ElevatorAnswerMine", "InitStepMoveForward", "CabinData", "AskIsSeamEmpty"),
			editor: {
				menu: "GameModule/Elevator/Elevator"
			},
			properties: {
				cable: cc.Node,
				noelElevator: cc.Node,
				layerFlag: cc.Node,
				managerNode: cc.Node,
				crashNum: cc.Label,
				cabinPrefab: cc.Prefab,
				cargo: cc.Sprite,
				prefabBtnUpgrade: cc.Prefab,
				prefabDialogLevelUp: cc.Prefab,
				managerPrefab: cc.Prefab,
				tapMark: cc.Node,
				tapMarkManager: cc.Node
			},
			onLoad: function () {
				this.cableTopLength = Constant.ELEVATOR_CABLE_START_HEIGHT,
					this.cableMiddleLength = Constant.SEAM_LAYER_HEIGHT,
					this.cableBottonLength = Constant.ELEVATOR_BASE_HEIGHT,
					this.cableFristY = -40,
					this.layerFlagParam = .25,
					this.layerStopParam = .16,
					this.cargoTotalLength = 80,
					this.freightTime = 4,
					this.unFreightTime = 4,
					this.onceFreightNum = new i(0),
					this.cabinDir = -1,
					this.cabinStage = this.cabinStage || r.None,
					this.cabinAuto = this.cabinAuto || !1,
					this.commonData = UserData.getMineDataRef("Common"),
					this.elevatorData = UserData.getMineDataRef("Elevator"),
					this.elevatorData.mineNum ? this.mineNum = new i(this.elevatorData.mineNum) : (this.elevatorData.mineNum = 0, this.mineNum = new i(0)),
					this.elevatorData.layerNum || (this.elevatorData.layerNum = this.elevatorData.storeyNum || 0),
					this.elevatorData.level || (this.elevatorData.level = 1),
					this.elevatorData.SuperCash || (this.elevatorData.SuperCash = 0),
					this.skillFreightRate = this.skillFreightRate || 1,
					this.skillFreightSpeedRate = this.skillFreightSpeedRate || 1,
					this.skillMoveSpeedRate = this.skillMoveSpeedRate || 1,
					this.skillConsumeRate = this.skillConsumeRate || 1,
					this._initfinsh = !1,
					this.contentCameraPosY = cc.winSize.height / 2
			},
			start: function () {
				this.crashNum.string = this.mineNum.toString(this.mineNum.length < 3 ? 0 : 2),
					this._initCabin(),
					this._initStorey(),
					this._applyOffset(this.contentCameraPosY),
					this.btnUpgrade = cc.instantiate(this.prefabBtnUpgrade),
					this.node.addChild(this.btnUpgrade),
					this.btnUpgrade.position = cc.v2(70, 90),
					this.btnUpgrade.getComponent("BtnUpgrade").initData(this.elevatorData.level, !1, n.EnumMinerBranch.Elevator),
					this.btnUpgrade.active = this.commonData.initStep >= 4,
					this.manager = cc.instantiate(this.managerPrefab),
					this.manager.getComponent("PrisonerManager").minerBranch = n.EnumMinerBranch.Elevator,
					this.managerNode.addChild(this.manager),
					this.managerNode.active = this.commonData.initStep >= 3,
					this._refreshElevatorParams(),
					this._initfinsh = !0,
					this._updateTapMark()
			},
			_updateTapMark: function () {
				var e = this;
				this.publishEvent({
					type: "AskIsSeamEmpty",
					callback: function (t) {
						e.tapMark.active = !t.isEmpty && e.commonData.initStep >= 2.6 && !e.cabinAuto && e.cabinStage == r.None && (!e._affordManager || e.commonData.initStep < 3) && null == Tutorial.currentTutorial && (!e.reviewStep || 2 == e.reviewStep),
							e.tapMarkManager.active = !e.cabinAuto && e._affordManager && e.commonData.initStep >= 3 && null == Tutorial.currentTutorial
					},
					target: this
				})
			},
			_initStorey: function () {
				this.cable.height = this.cableTopLength + this.cableMiddleLength * this.elevatorData.layerNum + this.cableBottonLength,
					this.cable.logicHeight = this.cable.height,
					this.layerArr = [];
				for (var e = 0; e < this.elevatorData.layerNum; ++e) {
					var t = cc.instantiate(this.layerFlag);
					t.active = !0,
						t.x = 0,
						t.y = -(this.cableTopLength + this.cableMiddleLength * (e + this.layerFlagParam)),
						this.layerArr.push(t),
						this.cable.addChild(t)
				}
				this.cabin.zIndex = this.elevatorData.layerNum + 1
			},
			addLayer: function (e) {
				this.cable.height += this.cableMiddleLength * e,
					this.cable.logicHeight += this.cableMiddleLength * e;
				var t = this.elevatorData.layerNum;
				this.elevatorData.layerNum += e;
				for (var a = t; a < this.elevatorData.layerNum; ++a) {
					var i = cc.instantiate(this.layerFlag);
					i.active = !0,
						i.x = 0,
						i.y = -(this.cableTopLength + this.cableMiddleLength * (a + this.layerFlagParam)),
						this.layerArr.push(i),
						this.cable.addChild(i)
				}
				this.cabin.zIndex = this.elevatorData.layerNum + e
			},
			_initCabin: function () {
				var e = this;
				this.cabin || (this.cabin = cc.instantiate(this.cabinPrefab), this.cabinComponent = this.cabin.getComponent("Cabin"), this.cabin.x = 0, this.cabinComponent.logicPos.y = this.cableFristY, this.fristViewPos = cc.v2(0, -45), this.cabin.y = this.fristViewPos.y, this.cabinDir = -1, this.cable.addChild(this.cabin), this.cabin.on(cc.Node.EventType.TOUCH_END,
					function (t) {
						e.commonData.initStep >= 1 && !e.cabinAuto && e.cabinStage == r.None && e.cabinComponent.logicPos.y == e.cableFristY && (e.cabinStage = r.Move, e.cabinComponent.logicPos.y = e.cableFristY, e.cabin.y = e.fristViewPos.y, e.cabinDir = -1, e._updateTapMark(), Analysis.sendEvent({
							type: "clickCabin"
						}))
					},
					this))
			},
			btnShowDialogLevelUp: function () {
				var e = cc.instantiate(this.prefabDialogLevelUp);
				e.getComponent("DialogLevelUp").initData(n.EnumMinerBranch.Elevator, 1),
					ViewMgr.showDialog(e)
			},
			update: function (e) {
				var t = this;
				if (this._initfinsh && !(this.elevatorData.layerNum <= 0)) {
					switch (this.cabinStage) {
						case r.Move:
							this.cabinComponent.mineIsFull() ? (this.cabinDir = 1, this.cabinComponent.logicPos.y <= this.cableFristY ? this.cabinComponent.logicPos.y += e * this.cabinSpeed : (this.cabinComponent.logicPos.y = this.cableFristY, this.cabinStage = r.UnFreight)) : this.cabinComponent.logicPos.y >= -(this.cable.logicHeight - this.cableBottonLength - this.cableMiddleLength * (1 - this.layerStopParam)) && this.cabinComponent.logicPos.y <= this.cableFristY ? (this.tmpStopLayerNum = this.getLayerNum(this.cabinComponent.logicPos.y), this.cabinComponent.logicPos.y += e * this.cabinSpeed * this.cabinDir, this.nowLayerNum = this.getLayerNum(this.cabinComponent.logicPos.y), -1 == this.cabinDir && this.tmpStopLayerNum != this.nowLayerNum && this.askStoreyHadMine(this.nowLayerNum)) : (- 1 == this.cabinDir ? this.cabinComponent.logicPos.y < -(this.cable.logicHeight - this.cableBottonLength - this.cableMiddleLength * (1 - this.layerStopParam)) && (this.cabinComponent.logicPos.y = -(this.cable.logicHeight - this.cableBottonLength - this.cableMiddleLength * (1 - this.layerStopParam))) : this.cabinComponent.logicPos.y > this.cableFristY && (this.cabinComponent.logicPos.y = this.cableFristY, this.cabinStage = r.UnFreight), this.cabinDir = -this.cabinDir);
							break;
						case r.Freight:
							this.cabinStage = r.Default,
								this.node.runAction(cc.sequence(cc.delayTime(this.freightTime), cc.callFunc(function () {
									t.cabinStage = r.Move
								},
									this)));
							break;
						case r.UnFreight:
							this.cabinStage = r.Default;
							var a = this.getVariable();
							this.unFreightTime = CfgMgr.Elevator.getOnceFreightTime(this.elevatorData.level, this.cabinComponent.mineNum, a);
							var i = this.cabinComponent.mineNum.clone();
							this.cabinComponent.removeMineNum(this.cabinComponent.mineNum.clone(), this.unFreightTime),
								this.node.runAction(cc.sequence(cc.delayTime(this.unFreightTime), cc.callFunc(function () {
									t.mineNum.add(i),
										t.elevatorData.mineNum = t.mineNum.toNumber(),
										t._updateTapMark(),
										t.cabinAuto ? t.cabinStage = r.Move : t.cabinStage = r.None,
										t.crashNum.string = t.mineNum.toString(t.mineNum.length < 3 ? 0 : 2),
										t.refreshMineHeight(),
										1 == t.commonData.initStep && t.publishEvent({
											type: "InitStepMoveForward",
											currentStep: 2
										}),
										2 == t.reviewStep && t.publishEvent({
											type: "ReviewStepMoveForward",
											step: 3
										})
								},
									this)))
					}
					if (this.cabinComponent.logicPos.y != this.cableFristY) {
						var n = this.getInCableViewPos(this.cabinComponent.logicPos);
						this.cabin.y = n.y
					} else this.cabin.y = this.fristViewPos.y;
					this.publishEvent({
						type: "CabinData",
						worldPos: this.cable.convertToWorldSpaceAR(this.cabin.getPosition()),
						mineNum: this.cabinComponent.mineNum.toString(this.cabinComponent.mineNum.length < 3 ? 0 : 2)
					})
				}
			},
			getInCableViewPos: function (e) {
				var t = this.cable.convertToWorldSpaceAR(e),
					a = -(t.y - this.contentCameraPosY) / Constant.PERSPECTIVE_EFFECT;
				return t.y += a,
					this.cable.convertToNodeSpaceAR(t)
			},
			getLayerNum: function (e) {
				var t = parseInt(- (e + this.cableTopLength) / this.cableMiddleLength),
					a = 0;
				return (e + this.cableTopLength) % this.cableMiddleLength <= -this.cableMiddleLength * this.layerStopParam && (a = 1),
					t + a
			},
			_refreshElevatorParams: function () {
				var e = this.getVariable(),
					t = CfgMgr.Elevator.getMoveTime(this.elevatorData.level, this.elevatorData.layerNum, e) / 2,
					a = Math.abs(this.cableFristY),
					i = this.cableMiddleLength * (this.elevatorData.layerNum - 1 + this.layerStopParam) + this.cableTopLength - a;
				this.cabinSpeed = i / t;
				var n = CfgMgr.Elevator.getElevatorFreight(this.elevatorData.level, e);
				this.cabinComponent.setMineMax(n),
					this.cabinTotalPower = CfgMgr.Elevator.getTotalPower(this.elevatorData.level, this.elevatorData.layerNum, e),
					this.refreshMineHeight()
			},
			refreshMineHeight: function () {
				var e = void 0,
					t = this.cabinComponent.maxNum.clone().mult(5);
				e = this.mineNum.compare(t) < 0 ? this.mineNum.clone() : t.clone();
				var a = Math.pow(e.ratio(t), .3);
				this.cargo.node.y = this.cargoTotalLength * (a >= 1 ? 1 : a),
					this.cargo.fillStart = 1 - (a >= 1 ? 1 : a),
					this.cargo.fillEnd = 1
			},
			_applyOffset: function (e) {
				this.contentCameraPosY = e;
				for (var t = 0; t < this.layerArr.length; ++t) {
					var a = this.getInCableViewPos(cc.v2(0, -(this.cableTopLength + this.cableMiddleLength * (t + this.layerFlagParam))));
					this.layerArr[t].y = a.y
				}
				var i = this.getInCableViewPos(cc.v2(0, -(this.cableTopLength + this.cableMiddleLength * this.layerArr.length)));
				this.cable.height = Math.abs(i.y) + this.cableBottonLength
			},
			onMainScrollViewScrolling: function (e) {
				this._applyOffset(e.contentCameraPosY)
			},
			askStoreyHadMine: function (e) {
				var t = this;
				this.publishEvent({
					type: "AskSeamForMine",
					layerNum: e,
					callback: function (e) {
						if (e.mineNum.compare() > 0) {
							t.cabinStage = r.Freight;
							var a = t.getVariable(),
								i = CfgMgr.Elevator.getOnceFreight(t.elevatorData.level, t.cabinComponent.mineNum, e.mineNum, a);
							t.onceFreightNum = i.clone(),
								t.freightTime = CfgMgr.Elevator.getOnceFreightTime(t.elevatorData.level, i, a),
								t.publishEvent({
									type: "MoveMineFromSeam",
									layerNum: t.nowLayerNum,
									mineNum: i,
									spendTime: t.freightTime
								}),
								t.cabinComponent.addMineNum(t.onceFreightNum, t.freightTime)
						}
					},
					target: this
				})
			},
			onAskElevatorForMine: function (e) {
				e.target ? e.callback.call(e.target, {
					mineNum: this.mineNum
				}) : e.callback({
					mineNum: this.mineNum
				})
			},
			onMoveMineFromElevator: function (e) {
				var t = this.mineNum.compare(e.mineNum) < 0 ? this.mineNum.clone() : e.mineNum;
				this.mineNum.remove(t),
					this.elevatorData.mineNum = this.mineNum.toNumber(),
					this.crashNum.string = this.mineNum.toString(this.mineNum.length < 3 ? 0 : 2),
					this.refreshMineHeight()
			},
			onNewSeamLayerUnlock: function (e) {
				e.layerNum > this.elevatorData.layerNum && (this.addLayer(e.layerNum - this.elevatorData.layerNum), this._refreshElevatorParams())
			},
			onManagerStateChangeElevator: function (e) {
				this.cabinAuto = e.state,
					!this.cabinAuto || this.cabinStage && this.cabinStage != r.None || (this.cabinStage = r.Move, this._updateTapMark())
			},
			onManagerSkillStateChange: function (e) {
				if (e.minerBranch == n.EnumMinerBranch.Elevator && 1 == e.minerId) {
					if (this.skillMoveSpeedRate = 1, this.skillFreightSpeedRate = 1, this.skillConsumeRate = 1, this.skillFreightRate = 1, e.state == ManagerSkillState.MS_USING) {
						if (console.log("\u6b63\u5728\u4f7f\u7528\u6280\u80fd..."), 0 != e.tabId) {
							var t = CfgMgr.Manager.getManagerDataById(e.tabId),
								a = t.skill_param;
							t.skill_type == SKILL_TYPE[1][0] ? this.skillMoveSpeedRate = a : t.skill_type == SKILL_TYPE[1][1] ? this.skillFreightSpeedRate = a : t.skill_type == SKILL_TYPE[1][2] ? this.skillConsumeRate = 1 - a : t.skill_type == SKILL_TYPE[1][3] && (this.skillFreightRate = a)
						}
					} else e.state == ManagerSkillState.MS_CD ? console.log("\u6280\u80fd\u5f00\u59cbCD...") : e.state == ManagerSkillState.MS_IDLE && console.log("\u6280\u80fd\u53ef\u4ee5\u4f7f\u7528\u4e86...");
					this._initfinsh && this._refreshElevatorParams()
				}
			},
			getVariable: function () {
				return {
					mine: UserData.GameData.CurrentMine,
					freightRate: this.skillFreightRate,
					freightSpeedRate: this.skillFreightSpeedRate,
					moveSpeedRate: this.skillMoveSpeedRate,
					consumeRate: this.skillConsumeRate
				}
			},
			getLevelUpData: function (e) {
				var t = this.getVariable(),
					a = {},
					n = void 0;
				if (e != LevelUpMode.LV_MAX) e == LevelUpMode.LV_X1 ? n = this.elevatorData.level + 1 : e == LevelUpMode.LV_X10 ? n = this.elevatorData.level + 10 : e == LevelUpMode.LV_X50 && (n = this.elevatorData.level + 50),
					n = Math.min(n, CfgMgr.Elevator.getMaxLevel()),
					a.money = CfgMgr.Elevator.getUpgradeConsume(this.elevatorData.level, n, t),
					a.targetlevel = n;
				else {
					var r = CfgMgr.Elevator.getUpMaxLevelAndConsume(this.elevatorData.level, new i(UserData.GameData.TotalCash), t);
					a.money = r.consume,
						n = r.targetLevel,
						a.targetlevel = r.targetLevel
				}
				return a
			},
			onRequestLevelUpDataElevator: function (e) {
				if ("function" == typeof e.callback) {
					var t = this.getVariable(),
						a = {},
						i = CfgMgr.Elevator.getLevelAdvancedRange(this.elevatorData.level);
					a.title = Language.getName("Elevator Details"),
						a.curLevel = this.elevatorData.level,
						a.progress = (this.elevatorData.level - i.startLevel) / (i.endLevel - i.startLevel),
						a.upgradeLevel = i.endLevel,
						a.childName = Language.getName("Elevator"),
						a.isMaxLevel = this.elevatorData.level == CfgMgr.Elevator.getMaxLevel();
					var n = this.getLevelUpData(e.levelUpMode);
					a.targetlevel = n.targetlevel,
						a.money = n.money,
						a.limitLevel = a.targetlevel - this.elevatorData.level,
						a.targetlevel <= i.endLevel ? a.cashNum = i.cashNum : a.cashNum = CfgMgr.Elevator.getUpgradeTargetLevelCashNum(this.elevatorData.level, a.targetlevel);
					var r = [1, 1, 1, 1],
						o = ["Load", "Loading Speed", "Movement Speed", "Total Transportation"],
						s = [0, 0, 0, 0],
						c = [6, 8, 7, 9],
						l = [CfgMgr.Elevator.getElevatorFreight(this.elevatorData.level, t), CfgMgr.Elevator.getFreightSpeed(this.elevatorData.level, t), parseFloat(CfgMgr.Elevator.getMoveSpeed(this.elevatorData.level, t).toFixed(3)), CfgMgr.Elevator.getTotalPower(this.elevatorData.level, this.elevatorData.layerNum, t)],
						d = [CfgMgr.Elevator.getElevatorFreight(a.targetlevel, t).remove(l[0]), CfgMgr.Elevator.getFreightSpeed(a.targetlevel.variable).remove(l[1]), parseFloat((CfgMgr.Elevator.getMoveSpeed(a.targetlevel, t) - l[2]).toFixed(3)), CfgMgr.Elevator.getTotalPower(a.targetlevel, this.elevatorData.layerNum, t).remove(l[3])];
					a.properties = [];
					for (var h = 0; h < 4; ++h) a.properties.push({
						proName: Language.getName(o[h]),
						coinflag: s[h],
						iconId: c[h],
						colorState: a.isMaxLevel ? 0 : r[h],
						valNow: l[h].toString() + (1 == h || 3 == h ? "/s" : ""),
						valNext: a.isMaxLevel ? Language.getName("Max") : "+" + d[h].toString()
					});
					e.callback.call(e.target, a)
				}
			},
			onRequestUpgradeNeedMoneyElevator: function (e) {
				if (e.minerBranch == n.EnumMinerBranch.Elevator && 1 == e.minerId && "function" == typeof e.callback) {
					this.getVariable();
					var t = {},
						a = this.getLevelUpData(e.levelUpMode);
					t.targetlevel = a.targetlevel,
						t.money = a.money;
					var i = CfgMgr.Elevator.getLevelAdvancedRange(this.elevatorData.level);
					t.startLevel = i.startLevel,
						t.curLevel = this.elevatorData.level,
						t.endLevel = i.endLevel,
						t.isMaxLevel = this.elevatorData.level == CfgMgr.Elevator.getMaxLevel(),
						t.targetlevel <= i.endLevel ? t.cashNum = i.cashNum : t.cashNum = CfgMgr.Elevator.getUpgradeTargetLevelCashNum(this.elevatorData.level, t.targetlevel),
						t.superCash = this.elevatorData.SuperCash,
						t.limitLevel = t.targetlevel - this.elevatorData.level,
						e.callback.call(e.target, t)
				}
			},
			onLevelUpElevator: function (e) {
				this.elevatorData.level += e.addLevel,
					this._refreshElevatorParams()
			},
			onRequestElevatorTotalPower: function (e) {
				"function" == typeof e.callback && (e.notIgnoreManager ? this.cabinAuto ? e.callback.call(e.target, {
					totalPower: this.cabinTotalPower
				}) : e.callback.call(e.target, {
					totalPower: new i(0)
				}) : e.callback.call(e.target, {
					totalPower: this.cabinTotalPower
				}))
			},
			onInitStepMoveForward: function (e) {
				e.currentStep >= 2.6 && this._updateTapMark(),
					e.currentStep >= 4 ? (this.btnUpgrade.active = !0, this.managerNode.active = !0) : e.currentStep >= 3 && (this.managerNode.active = !0)
			},
			onAddElevatorSuperCash: function (e) {
				this.elevatorData.SuperCash += e.cashNum
			},
			onSubElevatorSuperCash: function (e) {
				this.elevatorData.SuperCash -= e.cashNum
			},
			onSeamMineNumChanged: function (e) {
				this._updateTapMark()
			},
			onAffordManager: function (e) {
				e.minerBranch == n.EnumMinerBranch.Elevator && (this._affordManager = !0, this._updateTapMark())
			},
			onNoAffordManager: function (e) {
				e.minerBranch == n.EnumMinerBranch.Elevator && (this._affordManager = !1, this._updateTapMark())
			},
			onTutorialEnd: function (e) {
				this._updateTapMark()
			},
			onReviewStepMoveForward: function (e) {
				var t = this;
				this.reviewStep = e.step,
					2 == this.reviewStep && this.mineNum.compare(0) > 0 && (this.reviewStep = 3, this.scheduleOnce(function () {
						t.publishEvent({
							type: "ReviewStepMoveForward",
							step: 3
						})
					},
						0)),
					this._updateTapMark()
			}
		}),
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent",
		NumberData: "NumberData",
		PrisonerManager: "PrisonerManager"
	}],
	EngineExtensions: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "f0192ATfAdKTbbchhJp11a0", "EngineExtensions"),
			cc.director.preloadSceneWithProgress = function (e, t, a, i) {
				var n = cc.director._getSceneUuid(e);
				n ? (cc.director.emit(cc.Director.EVENT_BEFORE_SCENE_LOADING, e), cc.loader.load({
					uuid: n.uuid,
					type: "uuid"
				},
					function (e, a, i) {
						"function" == typeof t && t(parseInt(e / a * 100))
					},
					function (t, n) {
						t ? (cc.errorID(1210, e, t.message), "function" == typeof i && i()) : "function" == typeof a && a()
					})) : (cc.error("\u573a\u666f", e, "\u4e0d\u5b58\u5728"), "function" == typeof i && i())
			},
			cc.Camera.captureScreen = function (e) {
				var t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
					a = e.targetTexture,
					i = new cc.RenderTexture;
				if (1 == t) {
					var n = cc.game._renderContext;
					i.initWithSize(cc.visibleRect.width, cc.visibleRect.height, n.STENCIL_INDEX8)
				} else i.initWithSize(cc.visibleRect.width, cc.visibleRect.height);
				return e.targetTexture = i,
					e.render(),
					e.targetTexture = a,
					i
			},
			cc.director.publishEvent = function (e) {
				null != e.type ? cc.Component.EventHandler.emitEvents(window.__all_life_circle_events_map["on" + e.type], e) : cc.error("\u9519\u8bef! - cc.director.publishEvent - \u672a\u6307\u5b9a\u4e8b\u4ef6\u7c7b\u578b\uff0c\u4e8b\u4ef6\u88ab\u963b\u6b62:event.type == null")
			},
			cc._RF.pop()
	},
	{}],
	ErrorHandler: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "c7195rRZrJKq6gkGkEoAqKp", "ErrorHandler"),
			cc.Class({
				init: function () {
					var t = this;
					"H5" == Framework.moduleCode ? window.onerror = function (e, a, i, n, r) {
						return !!t.impl.onException && t.impl.onException(a, i, e, n, r)
					} : window.__errorHandler = function (e, a, i, n, r) {
						return !!t.impl.onException && t.impl.onException(e, a, i, n, r)
					};
					var a = Framework.moduleCode + "ErrorHandler",
						i = void 0;
					try {
						i = e(a)
					} catch (e) { }
					null != i ? (this.impl = new i, console.log("[ErrorHandler]\u5df2\u542f\u7528 " + a)) : cc.warn("[ErrorHandler]" + a + " \u4e0d\u5b58\u5728,\u5168\u5c40\u5f02\u5e38\u6355\u83b7\u4e0d\u53ef\u7528."),
						null != this.impl && "function" == typeof this.impl.init && this.impl.init()
				},
				_onException: function (e, t, a, i) {
					return !!this.impl.onException && this.impl.onException(e, t, a, i)
				},
				report: function (e) {
					null != this.impl && "function" == typeof this.impl.report && this.impl.report(e)
				}
			}),
			cc._RF.pop()
	},
	{}],
	ExampleListViewItem: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "e7686FeXFZAar/Qqhk8xHcG", "ExampleListViewItem"),
			cc.Class({
				extends: cc.Component,
				properties: {
					label: cc.Label
				},
				start: function () { },
				updateData: function (e, t) {
					this.label.string = t.id
				}
			}),
			cc._RF.pop()
	},
	{}],
	Example: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "c1fa7S+xB9HAZM2H6YthnBu", "Example"),
			cc.Class({
				extends: e("EasyEvent").declareEvent("Example", "LanguageChanged"),
				editor: {
					menu: "Framework-Example/Example"
				},
				properties: {
					animation: cc.Animation,
					CN: cc.JsonAsset,
					EN: cc.JsonAsset,
					localizeSprite: cc.Sprite,
					spriteCN: cc.SpriteFrame,
					spriteEN: cc.SpriteFrame,
					audioClip: {
						type: cc.AudioClip,
						default:
							null
					},
					listView: cc.Node
				},
				onLoad: function () {
					Music.clips.Capture = this.audioClip,
						Music.loadResDir("AudioClips").then(function () {
							Platform.showToast({
								title: "\u58f0\u97f3\u6587\u4ef6\u52a0\u8f7d\u5b8c\u6210."
							})
						}),
						ViewMgr.init();
					this.listView.getComponent("ListView").setData([{
						id: 1
					},
					{
						id: 2
					},
					{
						id: 3
					},
					{
						id: 4
					},
					{
						id: 5
					},
					{
						id: 6
					},
					{
						id: 7
					},
					{
						id: 8
					},
					{
						id: 9
					},
					{
						id: 10
					}])
				},
				onExample: function (e) {
					Platform.showToast({
						title: e.foo + e.bar
					})
				},
				btnEasyEventClick: function (e, t) {
					this.publishEvent({
						type: "Example",
						foo: "\u6d4b\u8bd5\u4e8b\u4ef6",
						bar: "\u6210\u529f"
					})
				},
				btnAudioClick: function (e, t) {
					Music.play(t)
				},
				btnShowBannerClick: function (e, t) {
					Ad.showBanner()
				},
				btnFrameEventClick: function (e, t) {
					this.animation.play()
				},
				btnVibrateClick: function (e, t) {
					Platform.vibrateShort()
				},
				btnShareClick: function (e, t) {
					Platform.shareAppMessage()
				},
				btnToastClick: function (e, t) {
					Platform.showToast({
						title: "Toast:" + t
					})
				},
				btnSetLanguageClick: function (e, t) {
					var a = this;
					Localize.setLanguage(t).then(function () {
						Localize.data = a[t].json,
							Platform.showToast({
								title: "\u8bbe\u7f6e\u6210\u529f."
							}),
							a.publishEvent({
								type: "LanguageChanged"
							}),
							a.localizeSprite.spriteFrame = a["sprite" + t]
					})
				},
				switchButtonChanged: function (e) {
					Platform.showToast({
						title: "\u6309\u94ae\u5207\u6362\u6210\u529f." + e
					})
				},
				dialogButtonClicked: function (e, t) {
					ViewMgr.showCommonDialog("\u901a\u7528\u5f39\u7a97", "\u5185\u5bb9",
						function () {
							Platform.showToast({
								title: "\u5de6\u8fb9\u6309\u94ae\u56de\u8c03."
							})
						},
						function () {
							Platform.showToast({
								title: "\u53f3\u8fb9\u6309\u94ae\u56de\u8c03."
							})
						})
				}
			}),
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent"
	}],
	FBAnalysis: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "646b07XkH5EM7LtyiG1NszJ", "FBAnalysis");
		var i = e("FBAndroid"),
			n = (e("FBIos"), n || {
				initSdk: function () {
					cc.sys.os === cc.sys.OS_IOS || cc.sys.os === cc.sys.OS_ANDROID && i.initSdk()
				},
				logEvent: function (e, t, a) {
					cc.sys.os === cc.sys.OS_IOS || cc.sys.os === cc.sys.OS_ANDROID && i.logEvent(e, t, a)
				}
			});
		t.exports = n,
			cc._RF.pop()
	},
	{
		FBAndroid: "FBAndroid",
		FBIos: "FBIos"
	}],
	FBAndroid: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "34991ZVdF5BzYKFZOj3Tw9F", "FBAndroid");
		var i = i || {
			initSdk: function () {
				jsb.reflection.callStaticMethod("org.cocos2dx.javascript.AppActivity", "initFacebookAnalysis", "()V")
			},
			logEvent: function (e, t, a) {
				jsb.reflection.callStaticMethod("org.cocos2dx.javascript.AppActivity", "facebooklogEvent", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", e, t, JSON.stringify(a))
			}
		};
		t.exports = i,
			cc._RF.pop()
	},
	{}],
	FBIos: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "90543zkyW5JqpwEHYCPjWWx", "FBIos");
		var i = i || {};
		t.exports = i,
			cc._RF.pop()
	},
	{}],
	FacebookAd: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "3f0a7sSOH9D45Cbw0M4FPx+", "FacebookAd");
		var i = function (e) {
			return e && e.__esModule ? e : {
				default:
					e
			}
		}(e("./AdsManager"));
		var n = e("analytics-data"),
			r = cc.Enum({
				video: 1,
				interstitial: 2,
				none: 3
			}),
			o = 0,
			s = (new Date).getTime(),
			c = {},
			l = {};
		cc.Class({
			extends: e("BaseAd"),
			properties: {},
			init: function () {
				i.
					default.loadRewardedVideo()
			},
			isVideoComplete: function () {
				return i.
					default.isCompleteVideoLoad()
			},
			isVideoLoading: function () {
				return i.
					default.isRewardVideoLoadingState()
			},
			showVideo: function (e) {
				var t = this;
				cc.loader.loadRes("watchvideo/videoConfirm",
					function (a, i) {
						(null != t.videoConfirmNode || cc.isValid(t.videoConfirmNode)) && t.videoConfirmNode.destroy(),
							t.videoConfirmNode = cc.instantiate(i),
							cc.director.getScene().getChildByName("Canvas").addChild(t.videoConfirmNode),
							t.videoConfirmNode.zIndex = cc.macro.MAX_ZINDEX,
							t.videoConfirmNode.getComponent("videoConfirm").setData(function () {
								t.playAds(e.success, e.fail, e.type)
							},
								t.getRewardAdsCD(e.type))
					})
			},
			playAds: function (e, t, a) {
				var o = this;
				n.watch_video_event(a),
					i.
						default.isCompleteVideoLoad() ? i.
							default.showRewardedVideo(function () {
								n.watch_video_success_event(a),
									globalManager.addWatchVideoCount(),
									o.setRewardAds(a),
									e && e(r.video)
							},
								function () {
									t && t(r.none)
								}) : t && t(r.none)
			},
			canInterstitialAds: function () {
				return 0 == s ? (s = (new Date).getTime(), !1) : !((new Date).getTime() - o <= 1e3) && (new Date).getTime() - s > 1e3
			},
			getRewardAdsCD: function (e) {
				var t = 1e3 - ((new Date).getTime() - o);
				t < 0 && (t = 0);
				var a = l[e];
				null == a && (a = 1e3);
				var i = c[e];
				null == i && (i = 0);
				var n = a - ((new Date).getTime() - i);
				return t > n ? t : n
			},
			setInterstitialAds: function () {
				requestTime = 1,
					s = (new Date).getTime(),
					o = (new Date).getTime()
			},
			setRewardAds: function (e) {
				s = (new Date).getTime(),
					c[e] = (new Date).getTime(),
					o = (new Date).getTime()
			}
		}),
			cc._RF.pop()
	},
	{
		"./AdsManager": "AdsManager",
		BaseAd: "BaseAd",
		"analytics-data": "analytics-data"
	}],
	FacebookAnalysis: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "e934eniWflIMJn1dGq32jbC", "FacebookAnalysis"),
			cc.Class({
				extends: e("BaseAnalysis"),
				properties: {},
				init: function () { },
				sendEvent: function (e) {
					e.type ? (console.log("fb log event :" + e.type), this.logEvent(e.type, e.num, e.data)) : console.log("fb log event fail : no type prama")
				},
				logEvent: function (e, t, a) {
					FBInstant.logEvent(e, t || 1, a || {})
				}
			}),
			cc._RF.pop()
	},
	{
		BaseAnalysis: "BaseAnalysis"
	}],
	FacebookDataStore: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "d01e685V8JB+plHUf39wYQ0", "FacebookDataStore");
		var i = e("StringCompress");
		cc.Class({
			extends: e("BaseDataStore"),
			readCloud: function (e) {
				FBInstant.player.getDataAsync([e.key]).then(function (t) {
					if (console.log("\u8bfb\u53d6\u5230\u4e91\u5b58\u50a8\u6570\u636e", t), null == t[e.key] || "" == t[e.key]) "function" == typeof e.success && e.success(null);
					else {
						var a = i.decompressArray(JSON.parse(t[e.key]));
						console.log("\u4e91\u5b58\u50a8\u4e0d\u4e3a\u7a7a", a),
							"function" == typeof e.success && e.success(a)
					}
				}).
					catch(function (t) {
						console.log("\u4e91\u5b58\u50a8\u8bfb\u53d6\u5f02\u5e38", t),
							"function" == typeof e.fail && e.fail(t)
					})
			},
			saveCloud: function (e) {
				return i.compressAsync(e.data,
					function (t) {
						var a = {};
						a[e.key] = JSON.stringify(t),
							FBInstant.player.setDataAsync(a).then(function () {
								"function" == typeof e.success && e.success()
							})
					}),
					cc.sys.localStorage.setItem(e.key, e.data)
			}
		}),
			cc._RF.pop()
	},
	{
		BaseDataStore: "BaseDataStore",
		StringCompress: "StringCompress"
	}],
	FacebookErrorHandler: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "fba99uc3ylDbbQ3mRY2sG+D", "FacebookErrorHandler"),
			cc.Class({
				extends: e("BaseErrorHandler")
			}),
			cc._RF.pop()
	},
	{
		BaseErrorHandler: "BaseErrorHandler"
	}],
	FacebookPlatform: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "be3e5xQRCBAlbKOa05tZ5r5", "FacebookPlatform");
		var i = e("server-util"),
			n = e("instant-util"),
			r = e("analytics-data"),
			o = cc.Class({
				extends: e("BasePlatform"),
				init: function () { },
				login: function (e) {
					console.log("\u5f53\u524dFacebook\u5e73\u53f0 ", FBInstant.getPlatform()),
						n.getPlayerInfo(function (e) {
							var t = e.playerName,
								a = e.playerId;
							i.login(t, a, e.photo,
								function () { })
						});
					var t = n.getEntryPointData();
					t && t.type && r.player_link_click_event(t.type),
						t ? console.log("entryData.type = " + t.type) : console.log("entryData is null"),
						t && t.type && "messenger_recall" == t.type && (console.log("event = bot_recall_" + t.count), r.bot_recall_event(t.count));
					FBInstant.player.getDataAsync(["firstLogin"]).then(function (e) {
						0 != e.firstLogin && (t && t.type && ("switch_game" == t.type ? r.new_player_switch_click_event(t.name) : r.new_player_link_click_event(t.type)), FBInstant.player.setDataAsync({
							firstLogin: !1
						}).then(function () { }))
					}),
						"function" == typeof e.success && e.success()
				},
				getPlayerPhoto: function () {
					return FBInstant.player.getPhoto()
				},
				shareAppMessage: function (e) {
					e.base64 = this.getBase64Data(),
						console.log("face book share api : id" + FBInstant.player.getID() + " name:" + FBInstant.player.getName()),
						null == e.type && (e.type = "share"),
						n.logEvent("all_share_click"),
						n.logEvent("user_value_start"),
						r.share_type_event(e.type),
						n.logEvent("all_tl_share"),
						FBInstant.shareAsync({
							intent: "SHARE",
							image: e.base64,
							text: e.text || "ComeOn",
							data: {
								userId: FBInstant.player.getID(),
								name: FBInstant.player.getName(),
								photo: FBInstant.player.getPhoto(),
								type: e.type,
								inviter: n.getPlayerID(),
								rewards: "1"
							}
						}).then(function () {
							e.callback && e.callback(),
								r.share_success_type_event(e.type)
						}).
							catch(function (t) {
								console.log("!!! fb error <" + t + ">, when use shareAsync"),
									e.failCB && e.failCB()
							})
				},
				chooseContext: function (e) {
					var t = {
						type: e.type,
						inviter: n.getPlayerID(),
						rewards: "1"
					},
						a = globalManager.getShareConfig(e.type);
					r.share_type_event(e.type),
						n.chooseContext(function (t) {
							r.share_success_type_event(e.type),
								e.success && e.success()
						},
							function (t, a) {
								e.fail && e.fail(a)
							}.bind(self), t, a.text, a.img)
				},
				shareOrVideo: function (e) {
					e.sharenode.active = !1,
						e.videonode.active = !1,
						globalManager.canShare(e.type, {}) ? e.sharenode.active = !0 : e.videonode.active = !0
				},
				showCustomShare: function (e, t) {
					var a = cc.instantiate(e);
					a.getComponent("DialogCusShare").setData(t),
						ViewMgr.showDialog(a)
				},
				shareCustom: function (e, t) {
					n.logEvent("all_share_click"),
						n.logEvent("user_value_start"),
						r.share_type_event(t),
						n.logEvent("all_tl_share"),
						n.captureScreen(e, e.width, e.height,
							function (e) {
								FBInstant.shareAsync({
									intent: "SHARE",
									image: e,
									text: "ComeOn",
									data: {
										type: t,
										inviter: n.getPlayerID(),
										rewards: "1"
									}
								}).then(function () {
									r.share_success_type_event(t)
								}).
									catch(function (e) {
										console.log("!!! fb error <" + e + ">, when use shareAsync")
									})
							})
				},
				getBase64Data: function (e, t) {
					var a = e || 750,
						i = t || 1334,
						n = cc.game._renderContext,
						r = new cc.RenderTexture;
					r.initWithSize(a, i, n.STENCIL_INDEX8);
					var o = document.createElement("canvas"),
						s = o.getContext("2d");
					o.width = a,
						o.height = i;
					var c = cc.director.getScene().getChildByName("Canvas").getChildByName("Main Camera").getComponent(cc.Camera);
					c.targetTexture = r,
						c.render(),
						c.targetTexture = null,
						c.render();
					for (var l = r.readPixels(), d = 4 * a, h = 0; h < i; h++) {
						for (var u = i - 1 - h,
							m = s.createImageData(a, 1), g = u * a * 4, p = 0; p < d; p++) m.data[p] = l[g + p];
						s.putImageData(m, 0, h)
					}
					return o.toDataURL("image/jpeg")
				},
				canPushNotification: function (e, t) {
					this.canSubscribeBotAsync(e, t)
				},
				canSubscribeBotAsync: function (e, t) {
					var a = this;
					console.log("do canSubscribeBotAsync xxxx"),
						FBInstant.player.canSubscribeBotAsync().then(function (i) {
							console.log("can subscribeBot callback"),
								i ? (console.log("can subscribeBot"), a.subscribeBotAsync(e, t)) : (console.log("can not subscribeBot"), t && t())
						}).
							catch(function (e) {
								for (var t in console.log("subscribe err:"), e) console.log("key :" + t + " val:" + e[t]);
								console.log("subscribe err........")
							})
				},
				subscribeBotAsync: function (e, t) {
					console.log("subscribeBotAsync..."),
						FBInstant.player.subscribeBotAsync().then(function () {
							console.log("\u8ba2\u9605success"),
								n.logEvent("subscribe_bot_success"),
								e && e()
						}).
							catch(function (e) {
								console.log("\u8ba2\u9605failed"),
									t && t()
							})
				},
				submitScore: function (e) {
					FBInstant.getLeaderboardAsync(e.rankName).then(function (t) {
						return t.setScoreAsync(e.score)
					}).then(function () {
						console.log("friend Score saved"),
							e.successCb && e.successCb()
					}).
						catch(function (t) {
							console.log("friend Score err" + t),
								e.failCb && e.failCb(t)
						})
				},
				getRanklistData: function (e) {
					console.log("getRanklistData...."),
						FBInstant.getLeaderboardAsync(e.rankName).then(function (e) {
							return e.getConnectedPlayerEntriesAsync()
						}).then(function (t) {
							console.log("get friend data:" + t.length);
							for (var a = 0; a < t.length; a++) {
								var i = t[a];
								if (FBInstant.player.getID() != i.getPlayer().getID()) {
									var n = i.getScore(),
										r = Math.floor(n / 100),
										o = n % 100,
										s = i.getPlayer().getPhoto(),
										c = i.getPlayer().getName();
									console.log("friend data:" + n + " " + r + " " + o + " url:" + s + " name:" + c),
										e.data[r] || (e.data[r] = {}),
										e.data[r][o] || (e.data[r][o] = []),
										e.data[r][o].push({
											url: s,
											name: c
										})
								}
							}
							e.successCb && e.successCb()
						})
				},
				requestInviteFriendsVal: function (e, t) {
					var a = FBInstant.getEntryPointData(),
						i = 0;
					a && a.userId && (i = a.userId);
					var n = {
						method: "POST",
						url: "https://top1studio.gameabc2.com/user/facebooklogin"
					};
					for (var r in n.data = {
						UID: 0,
						facebookId: FBInstant.player.getID(),
						inviterId: i
					},
						n.data) console.log("data key:" + r + " val:" + n.data[r]);
					n.success = function (a) {
						var i = a.data;
						0 == i.state ? ("function" == typeof e && e(i.data), console.log("get invite friends success:" + i.data.friends)) : ("function" == typeof t && t(i.data), console.log("get invite friends failed:" + i.data.errorCode))
					},
						n.fail = function () {
							"function" == typeof t && t(),
								console.log("get.. invite friends failed..")
						},
						Platform.request(n)
				}
			});
		if (t.exports = o, "undefined" != typeof FBInstant && "WEB" != FBInstant.getPlatform() && "ANDROID" != FBInstant.getPlatform()) {
			var s = cc.Class({
				name: "EqualToFrameEx",
				extends: cc.ContainerStrategy,
				apply: function (e) {
					var t = e._frameSize.height,
						a = cc.game.container.style;
					this._setupContainer(e, e._frameSize.width, e._frameSize.height),
						e._isRotated ? a.margin = "0 0 0 " + t + "px" : a.margin = "0px",
						a.padding = "0px",
						a.marginTop = cc.game.frame.clientWidth / 750 * 96 + "px",
						document.body.style.backgroundColor = "#000000"
				}
			});
			cc.ContainerStrategy.EQUAL_TO_FRAME = new s,
				cc.view._rpExactFit = new cc.ResolutionPolicy(cc.ContainerStrategy.EQUAL_TO_FRAME, cc.ContentStrategy.EXACT_FIT),
				cc.view._rpShowAll = new cc.ResolutionPolicy(cc.ContainerStrategy.EQUAL_TO_FRAME, cc.ContentStrategy.SHOW_ALL),
				cc.view._rpNoBorder = new cc.ResolutionPolicy(cc.ContainerStrategy.EQUAL_TO_FRAME, cc.ContentStrategy.NO_BORDER),
				cc.view._rpFixedHeight = new cc.ResolutionPolicy(cc.ContainerStrategy.EQUAL_TO_FRAME, cc.ContentStrategy.FIXED_HEIGHT),
				cc.view._rpFixedWidth = new cc.ResolutionPolicy(cc.ContainerStrategy.EQUAL_TO_FRAME, cc.ContentStrategy.FIXED_WIDTH),
				cc.view._initFrameSize = function () {
					cc.game.frame.__origin_clientHeight || (cc.game.frame.__origin_clientHeight = cc.game.frame.clientHeight),
						cc.game.frame.style.marginTop = cc.game.frame.clientWidth / 750 * 96;
					var e = this._frameSize,
						t = cc.game.frame.clientWidth,
						a = cc.game.frame.__origin_clientHeight - cc.game.frame.clientWidth / 750 * 96,
						i = t >= a; !cc.sys.isMobile || i && this._orientation & cc.macro.ORIENTATION_LANDSCAPE || !i && this._orientation & cc.macro.ORIENTATION_PORTRAIT ? (e.width = t, e.height = a, cc.game.container.style["-webkit-transform"] = "rotate(0deg)", cc.game.container.style.transform = "rotate(0deg)", this._isRotated = !1) : (e.width = a, e.height = t, cc.game.container.style["-webkit-transform"] = "rotate(90deg)", cc.game.container.style.transform = "rotate(90deg)", cc.game.container.style["-webkit-transform-origin"] = "0px 0px 0px", cc.game.container.style.transformOrigin = "0px 0px 0px", this._isRotated = !0),
							this._orientationChanging && setTimeout(function () {
								cc.view._orientationChanging = !1
							},
								1e3)
				}
		}
		cc._RF.pop()
	},
	{
		BasePlatform: "BasePlatform",
		"analytics-data": "analytics-data",
		"instant-util": "instant-util",
		"server-util": "server-util"
	}],
	Flow: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "844c4DEd0RMqIq1DGSgtLl8", "Flow"),
			cc.Class({
				extends: cc.Component,
				editor: {
					menu: "Effect/Flow"
				},
				properties: {
					radio: .1,
					speed: 1
				},
				start: function () {
					this.flowFloat = 100 * Math.random()
				},
				update: function (e) {
					this.flowFloat += e * this.speed,
						this.node.y += Math.sin(this.flowFloat) * this.radio
				}
			}),
			cc._RF.pop()
	},
	{}],
	FrameEvent: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "5bf1a1LYFJODYHjgRSgxDFz", "FrameEvent"),
			cc.Class({
				extends: cc.Component,
				editor: {
					menu: "Animation/FrameEvent"
				},
				properties: {},
				onLoad: function () { },
				audio: function (e) {
					Music.play(e)
				},
				vibrate: function (e) {
					switch (e) {
						case "short":
							Platform.vibrateShort();
							break;
						case "long":
							Platform.vibrateLong();
							break;
						default:
							Platform.vibrateShort()
					}
				}
			}),
			cc._RF.pop()
	},
	{}],
	Framework: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "256cb5diZVMKILh5HDWPAZe", "Framework"),
			window.Framework = {
				platformCode: 0,
				moduleCode: "Base",
				init: function () {
					cc.sys.BYTE_DANCE = 1001,
						cc.sys.QUICK_GAME = 1002,
						cc.sys.FACEBOOK = 1003,
						this.platformData = [],
						this.platformData[cc.sys.WECHAT_GAME] = {
							moduleCode: "WeChat",
							displayName: "\u5fae\u4fe1\u5c0f\u6e38\u620f"
						},
						this.platformData[cc.sys.BAIDU_GAME] = {
							moduleCode: "Baidu",
							displayName: "\u767e\u5ea6SWAN"
						},
						this.platformData[cc.sys.BYTE_DANCE] = {
							moduleCode: "ByteDance",
							displayName: "\u5b57\u8282\u8df3\u52a8"
						},
						this.platformData[cc.sys.QUICK_GAME] = {
							moduleCode: "QuickGame",
							displayName: "\u5feb\u6e38\u620f"
						},
						this.platformData[cc.sys.MOBILE_BROWSER] = {
							moduleCode: "H5",
							displayName: "H5"
						},
						this.platformData[cc.sys.DESKTOP_BROWSER] = {
							moduleCode: "H5",
							displayName: "H5"
						},
						this.platformData[cc.sys.IPHONE] = {
							moduleCode: "IOS",
							displayName: "IPhone IOS"
						},
						this.platformData[cc.sys.ANDROID] = {
							moduleCode: "Android",
							displayName: "Android"
						},
						this.platformData[cc.sys.FACEBOOK] = {
							moduleCode: "Facebook",
							displayName: "Facebook"
						},
						console.log("[Framework]\u521d\u59cb\u5316"),
						xmloadStart(),
						this.platformCode = cc.sys.platform,
						"undefined" != typeof tt && (this.platformCode = cc.sys.BYTE_DANCE),
						"undefined" != typeof FBInstant && (this.platformCode = cc.sys.FACEBOOK),
						"undefined" != typeof qg && (this.platformCode = cc.sys.QUICK_GAME),
						this.platformData[this.platformCode] ? (this.moduleCode = this.platformData[this.platformCode].moduleCode, console.log("[Framework]\u68c0\u6d4b\u5f53\u524d\u5e73\u53f0\u4e3a[" + this.platformData[this.platformCode].displayName + "]")) : cc.warn("[Framework]\u5c1a\u4e0d\u652f\u6301\u5f53\u524d\u5e73\u53f0."),
						["Ad", "Platform", "Music", "DataStore", "ErrorHandler", "Analysis", "Pay", "Localize", "ViewMgr"].forEach(function (t) {
							var a = e(t);
							null != a ? (null != window[t] && cc.warn("[\u5168\u5c40\u53d8\u91cf\u51b2\u7a81]", window[t], t, "\u5df2\u88ab Framework \u8986\u76d6."), window[t] = new a, "function" == typeof window[t].init && window[t].init()) : cc.warn("\u672a\u627e\u5230 " + t + " \u7ec4\u4ef6")
						}),
						cc.sys.platformCode = this.platformCode
				}
			},
			window.Framework.init(),
			cc._RF.pop()
	},
	{}],
	FriendInfoItem: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "c151fVPmLtP/JDml5HRHfm9", "FriendInfoItem"),
			cc.Class({
				extends: cc.Component,
				editor: {
					menu: "GameModule/Friend/FriendInfoItem"
				},
				properties: {
					labName: cc.Label,
					avatar: cc.Sprite
				},
				setData: function (e) {
					this.data = e
				},
				start: function () {
					this.labName.string = this.data.name
				}
			}),
			cc._RF.pop()
	},
	{}],
	FriendInfo: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "21b14loi/dFQK/KGrL0NKsI", "FriendInfo"),
			cc.Class({
				extends: e("EasyEvent"),
				editor: {
					menu: "GameModule/Friend/FriendInfo"
				},
				properties: {
					labFirstFriendName: cc.Label,
					prbInfoItem: cc.Prefab,
					prbSplitItem: cc.Prefab,
					listView: cc.ScrollView,
					moreFlag_1: cc.Node,
					moreFlag_2: cc.Node,
					moreFlag_3: cc.Node
				},
				start: function () {
					this.allLayer ? this._loadDataByMine(FriendsData) : this._loadData(FriendsData),
						this.listView.node.scale = 0,
						this.listView.node.active = !1,
						this.listView.isOpen = !1
				},
				init: function (e) {
					this.layerNum = e.layerNum,
						this.mine = e.mine || UserData.GameData.CurrentMine,
						this.allLayer = e.allLayer
				},
				_loadDataByMine: function (e) {
					if (e && e[this.mine]) {
						var t = [];
						if (e[this.mine]) for (var a in e[this.mine]) t = t.concat(e[this.mine][a]);
						t.length <= 0 ? this.node.destroy() : this._renderList(t)
					} else this.node.destroy()
				},
				_loadData: function (e) {
					if (e && e[this.mine] && e[this.mine][this.layerNum]) {
						var t = e[this.mine][this.layerNum];
						t.length <= 0 ? this.node.destroy() : this._renderList(t)
					} else this.node.destroy()
				},
				_renderList: function (e) {
					var t = this;
					this.moreFlag_1.active = e.length > 1,
						this.moreFlag_2.active = e.length > 2,
						this.moreFlag_3.active = e.length > 3,
						this.labFirstFriendName.string = Tools.nameTo2Char(e[0].name),
						this.listView.node.height = 0,
						e.forEach(function (a, i) {
							if (0 != i) {
								var n = cc.instantiate(t.prbSplitItem);
								t.listView.content.addChild(n),
									t.listView.node.height += n.height
							}
							var r = cc.instantiate(t.prbInfoItem);
							r.getComponent("FriendInfoItem").setData(a),
								1 == e.length && (r.height = 48),
								t.listView.content.addChild(r),
								t.listView.node.height += r.height
						}),
						this.listView.node.height = Math.max(this.listView.node.height, 48),
						this.listView.node.height = Math.min(this.listView.node.height, 126),
						this.listView.scrollToTop()
				},
				openList: function () {
					this.listView.node.active = !0,
						this.listView.isOpen = !0,
						this.listView.node.stopAllActions(),
						this.listView.node.runAction(cc.scaleTo(.1, 1))
				},
				closeList: function () {
					var e = this;
					this.listView.isOpen = !1,
						this.listView.node.stopAllActions(),
						this.listView.node.runAction(cc.sequence(cc.scaleTo(.1, 0), cc.callFunc(function () {
							e.listView.node.active = !1
						},
							this)))
				},
				btnShortViewClick: function (e, t) {
					Music.play("SFX_Button General"),
						this.listView.isOpen ? this.closeList() : this.openList()
				},
				onCloseWorldMap: function () {
					this.closeList()
				},
				onOpenWorldMap: function () {
					this.closeList()
				}
			}),
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent"
	}],
	GameLayer: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "cb00caeycxNaIC8P9VG+/kO", "GameLayer");
		var i = e("NumberData");
		cc.Class({
			extends: e("BaseLayer").declareEvent("OpenPrestige", "OpenWorldMap", "MainScrollViewScrolling", "SpendCash", "CashChanged", "LevelUpModeChanged", "CheckBottleNeck", "SuperCashChanged", "StartLoadGameModule"),
			editor: {
				menu: "Layer/GameLayer"
			},
			properties: {
				flushLight: cc.Node,
				idleCashNode: cc.Node,
				superCashNode: cc.Node,
				btnPrestige: cc.Button,
				btnLevelUpMode: cc.Button,
				controlButtons: cc.Node,
				sideButtonContainer: cc.Node,
				realContent: cc.Node,
				scrollView: cc.ScrollView,
				gameCameraNode: cc.Node,
				btnScrollToTop: cc.Button,
				btnScrollToBottom: cc.Button,
				footer: cc.Node,
				btnStats: cc.Button,
				btnBoosts: cc.Button,
				btnWorldMap: cc.Button,
				bottomBtnContainer: cc.Node,
				bottomButtons: [cc.Button],
				bottomViewNode: cc.Node,
				elevatorNode: cc.Node,
				prbElevator: cc.Prefab,
				seamNode: cc.Node,
				prbSeam: cc.Prefab,
				seamBackgroundNode: cc.Node,
				prbSeamBackground: cc.Prefab,
				storeHouseNode: cc.Node,
				prbStoreHouse: cc.Prefab,
				elevatorCashInfoNode: cc.Node,
				prbElevatorCashInfo: cc.Prefab,
				labCash: cc.Label,
				labSuperCash: cc.Label,
				labIdleCash: cc.Label,
				labIdleCashItemRate: cc.Label,
				labIdleCashItemTime: cc.Label,
				labLevelUpMode: cc.Label,
				prbDialogShare: cc.Prefab,
				prbInfoDetails: cc.Prefab,
				prbBoost: cc.Prefab,
				prbDialogSign: cc.Prefab,
				prbDialogCashAdd: cc.Prefab,
				prbDialogCusShare: cc.Prefab,
				prbDialogCusShare1: cc.Prefab,
				nodeSignLightAni: cc.Node
			},
			onLoad: function () {
				console.log(this.node)
				// this.btnWorldMap.node.active = false;
				this.prbBoost.data.children[1].children[2].children[1].children[1].children[5].active = false;
				this.prbInfoDetails.data.children[0].children[4].children[1].children[2].children[0].getComponent(cc.Label).string = Language.getName("Active all manager at once");
				this.prbInfoDetails.data.children[0].children[4].children[1].children[2].children[1].children[0].children[0].getComponent(cc.Label).string = Language.getName("Active all");
				this.prbInfoDetails.data.children[0].children[4].children[1].children[0].children[0].getComponent(cc.Label).string = Language.getName("Mineshafts Total Extraction") + ":";
				this.prbInfoDetails.data.children[0].children[4].children[0].children[2].children[4].getComponent(cc.Label).string = Language.getName("Total Extraction") + ":";
				this.prbInfoDetails.data.children[0].children[4].children[0].children[2].children[3].children[1].getComponent(cc.Label).string = Language.getName("Elevator");
				this.prbInfoDetails.data.children[0].children[4].children[0].children[1].children[4].getComponent(cc.Label).string = Language.getName("Total Extraction") + ":";
				this.prbInfoDetails.data.children[0].children[4].children[0].children[1].children[3].children[1].getComponent(cc.Label).string = Language.getName("Warehouae");
				this.prbInfoDetails.data.children[0].children[4].children[0].children[0].children[8].getComponent(cc.Label).string = Language.getName("Total Extraction") + ":";
				this.prbInfoDetails.data.children[0].children[4].children[0].children[0].children[7].children[0].getComponent(cc.Label).string = Language.getName("Mine Shaft");
				this.prbInfoDetails.data.children[0].children[4].children[0].children[4].getComponent(cc.Label).string = Language.getName("There is no significant bottlenecks right now");;
				this.prbInfoDetails.data.children[0].children[4].children[0].children[5].children[0].getComponent(cc.Label).string = Language.getName("Idle Cash") + ":";
				this.prbInfoDetails.data.children[0].children[2].children[2].children[2].getComponent(cc.Label).string = Language.getName("Workers");
				this.prbInfoDetails.data.children[0].children[2].children[1].children[2].getComponent(cc.Label).string = Language.getName("Shafts");
				this.prbInfoDetails.data.children[0].children[2].children[0].children[2].getComponent(cc.Label).string = Language.getName("stats");
				this.prbBoost.data.children[1].children[2].children[1].children[2].children[2].getComponent(cc.Label).string = Language.getName("income in the Coal Mine");
				// this.prbBoost.data.children[1].children[2].children[1].children[2].children[3].getComponent(cc.Label).string = Language.getName("in the Coal Mine ");
				this.prbBoost.data.children[1].children[2].children[1].children[2].children[4].getComponent(cc.Label).string = Language.getName("for an additional 4H");
				this.prbBoost.data.children[1].children[2].children[1].children[2].children[5].getComponent(cc.Label).string = Language.getName("Accumulative maximum time 24h");
				this.prbBoost.data.children[1].children[2].children[1].children[1].children[3].getComponent(cc.Label).string = Language.getName("Total Multiplier");
				this.prbDialogCashAdd.data.children[3].getComponent(cc.Label).string = Language.getName("Each video gives a better reward") + "!";
				this.prbDialogCashAdd.data.children[2].getComponent(cc.Label).string = Language.getName("Get Rewards") + "!";
				this.btnBoosts.node.children[1].getComponent(cc.Label).string = Language.getName("Boosts");
				this.btnStats.node.children[3].getComponent(cc.Label).string = Language.getName("stats");
				this.btnLevelUpMode.clickEvents[0].target.children[1].children[1].children[1].x = -200;
				this.btnLevelUpMode.clickEvents[0].target.children[1].children[1].children[0].active = false;
				this.btnLevelUpMode.clickEvents[0].target.children[1].children[2].children[0].children[1].getComponent(cc.Label).string = Language.getName("UPGRADE");
				this.prbDialogSign.data.getChildByName("Title").getComponent(cc.Label).string = Language.getName("Daily Reward");
				this.prbDialogSign.data.getChildByName("Explan").getComponent(cc.Label).string = Language.getName("Come back everyday to collect your reward") + "!";
				this.node.getChildByName("Header").getChildByName("TopBanner").getChildByName("node").y = -90;
				for (var i = 0; i < 4; i++) {
					this.prbDialogSign.data.getChildByName("ToggleContainer").children[i].getChildByName("Label1").getComponent(cc.Label).string = Language.getName("7days");
					this.prbDialogSign.data.getChildByName("ToggleContainer").children[i].getChildByName("Label2").getComponent(cc.Label).string = Language.getName("Collect");
				}

				var e = this;
				this._super(),
					this.scrollView.node.setContentSize(cc.winSize),
					this.scrollView.content.setContentSize(cc.size(cc.winSize.width, Constant.STORE_HOUSE_HEIGHT + 2 * Constant.SEAM_START_ITEM_HEIGHT + Constant.MAX_SEAM_NUM_PER_MINE * Constant.SEAM_LAYER_HEIGHT)),
					this.gameCameraNode.y = -cc.winSize.height / 2,
					this.realContent.y = -cc.winSize.height / 2,
					this.scrollView.node.on("scrolling", this._onScrollViewScrolling, this),
					this._loadGameModule(),
					this.labIdleCash.string = IdleCashMgr.getIdleCash().toString() + "/s",
					this.schedule(this.scheduleIdleCashItemTime, 1),
					Platform.requestInviteFriendsVal(function (e) {
						var t = UserData.GameData.InviteCount;
						UserData.GameData.InviteCount = Math.min(e.friends, 20),
							UserData.GameData.InviteCount > t && UserData.GameData.InviteCount > 0 && Analysis.sendEvent({
								type: "InviteFriendsCount_" + UserData.GameData.InviteCount
							})
					},
						function () {
							console.log("\u83b7\u53d6\u9080\u8bf7\u4eba\u6570\u5931\u8d25")
						}),
					this.checkDailySign(),
					this.schedule(function () {
						e.checkDailySign()
					},
						10),
					Platform.canPushNotification(function () {
						console.log("\u8ba2\u9605\u6210\u529f")
					},
						function () {
							console.log("\u8ba2\u9605\u5931\u8d25")
						}),
					Analysis.sendEvent({
						type: "EnterGameSuccessWithLoading"
					})
			},
			start: function () {
				var e = this;
				this.publishEvent({
					type: "MainScrollViewScrolling",
					contentCameraPosY: this.scrollView.content.convertToWorldSpaceAR(this.gameCameraNode).y
				}),
					this.flushLight.active = ItemMgr.getAdEffect() <= 1,
					this.schedule(function () {
						e.flushLight.active = ItemMgr.getAdEffect() <= 1,
							e.publishEvent({
								type: "MainScrollViewScrolling",
								contentCameraPosY: e.scrollView.content.convertToWorldSpaceAR(e.gameCameraNode).y
							})
					},
						1)
			},
			_refreshStepNodes: function (e) {
				this.controlButtons.active = e >= 2 || 1 != UserData.GameData.CurrentMine || this.prestige.time > 0,
					this.scrollView.enabled = e >= 2 || 1 != UserData.GameData.CurrentMine || this.prestige.time > 0,
					this.superCashNode.active = e >= 4 || 1 != UserData.GameData.CurrentMine || this.prestige.time > 0,
					this.btnLevelUpMode.node.active = e >= 4 || 1 != UserData.GameData.CurrentMine || this.prestige.time > 0,
					this.btnBoosts.node.active = e >= 5 || 1 != UserData.GameData.CurrentMine || this.prestige.time > 0,
					this.btnStats.node.active = e >= 5 || 1 != UserData.GameData.CurrentMine || this.prestige.time > 0,
					this.sideButtonContainer.active = e >= 5 || 1 != UserData.GameData.CurrentMine || this.prestige.time > 0,
					// this.btnPrestige.node.active = e >= 6 || 1 != UserData.GameData.CurrentMine || this.prestige.time > 0,
					// this.btnWorldMap.node.active = false >= 5.6 || 1 != UserData.GameData.CurrentMine || this.prestige.time > 0
					this.btnWorldMap.node.active = false;
				this.btnPrestige.node.active = false;
			},
			checkDailySign: function () {
				if (this.checkTime()) {
					this.nodeSignLightAni.active = !0;
					var e = this.nodeSignLightAni.getComponent(cc.Animation).getAnimationState("SpinSpark");
					e && !e.isPlaying && this.nodeSignLightAni.getComponent(cc.Animation).play()
				} else this.nodeSignLightAni.active = !1,
					this.nodeSignLightAni.getComponent(cc.Animation).stop()
			},
			checkTime: function (e, t, a) {
				var i = new Date;
				e = e || i.getFullYear(),
					t = t || i.getMonth(),
					a = a || i.getDate();
				var n = !1;
				if (e > UserData.GameData.Sign.date.year) n = !0;
				else if (e == UserData.GameData.Sign.date.year) if (t > UserData.GameData.Sign.date.month) n = !0;
				else if (t == UserData.GameData.Sign.date.month) {
					if (a > UserData.GameData.Sign.date.day) return !0;
					n = !1
				} else n = !1;
				else n = !1;
				return n
			},
			_onScrollViewScrolling: function (e) {
				this.btnScrollToTop.node.active = e.content.y > cc.winSize.height / 2 + 5,
					this.btnScrollToBottom.node.active = e.content.y < cc.winSize.height / 2 + Constant.SEAM_LAYER_HEIGHT * (this.seamData.unlockedLayerNum - .3) && Math.abs(e.content.y - (e.content.height - cc.winSize.height / 2)) > 2,
					this.publishEvent({
						type: "MainScrollViewScrolling",
						contentCameraPosY: e.content.convertToWorldSpaceAR(this.gameCameraNode).y
					})
			},
			_loadGameModule: function () {
				var e = this;
				this.btnScrollToBottom.node.active = !0,
					this.btnScrollToTop.node.active = !1,
					this.commonData = UserData.getMineDataRef("Common"),
					this.prestige = UserData.getMineDataRef("Prestige"),
					this.userCashNum = new i(UserData.GameData.TotalCash),
					this.labCash.string = this.userCashNum.toString(),
					this.labSuperCash.string = UserData.GameData.SuperCash,
					this.publishEvent({
						type: "StartLoadGameModule"
					}),
					this._refreshStepNodes(this.commonData.initStep),
					this.idleCashNode.active = this.commonData.showIdleCash,
					this.scrollView.stopAutoScroll(),
					this.scrollView.scrollToTop(),
					this.elevator && this.elevator.destroy(),
					this.storeHouse && this.storeHouse.destroy(),
					this.seam && this.seam.destroy(),
					this.elevatorCashInfo && this.elevatorCashInfo.destroy(),
					this.seamBackground && this.seamBackground.destroy(),
					this.scheduleOnce(function () {
						e.elevator = cc.instantiate(e.prbElevator),
							e.elevator.parent = e.elevatorNode,
							e.storeHouse = cc.instantiate(e.prbStoreHouse),
							e.storeHouse.parent = e.storeHouseNode,
							e.seam = cc.instantiate(e.prbSeam),
							e.seam.parent = e.seamNode,
							e.seamBackground = cc.instantiate(e.prbSeamBackground),
							e.seamBackground.parent = e.seamBackgroundNode,
							e.elevatorCashInfo = cc.instantiate(e.prbElevatorCashInfo),
							e.elevatorCashInfo.parent = e.elevatorCashInfoNode,
							e.seamData = UserData.getMineDataRef("Seam")
					},
						.01),
					this.labIdleCash.string = IdleCashMgr.getIdleCash().toString() + "/s",
					this.requestCurrentLevelUpMode(),
					this.scheduleOnce(function () {
						e.publishEvent({
							type: "CheckBottleNeck",
							target: e
						})
					},
						.7)
			},
			scheduleIdleCashItemTime: function (e) {
				(IdleCashMgr.getIdleCash().compare(0) > 0 || this.commonData.showIdleCash) && (this.commonData.showIdleCash = !0, this.idleCashNode.active = !0),
					this.labIdleCash.string = IdleCashMgr.getIdleCash().toString() + "/s";
				var t = ItemMgr.getActiveItemEffect() * ItemMgr.getAdEffect();
				if (t > 1) {
					this.labIdleCashItemRate.node.active = !0,
						this.labIdleCashItemTime.node.active = !0,
						this.labIdleCashItemRate.string = "x" + t;
					var a = ItemMgr.getEffectMaxTime();
					if (a > 0) {
						var i = Tools.time2hms(a),
							n = "";
						i.d > 0 ? (n += i.d > 0 ? i.d + "d " : "", n += i.h > 0 ? i.h + "h" : "") : i.h > 0 ? (n += i.h > 0 ? i.h + "h " : "", n += i.m > 0 ? i.m + "m" : "") : i.m > 0 ? (n += i.h > 0 ? i.h + "m " : "", n += i.m > 0 ? i.m + "s" : "") : n += i.s > 0 ? i.s + "s" : "",
							this.labIdleCashItemTime.string = n
					} else this.labIdleCashItemTime.string = ""
				} else this.labIdleCashItemRate.node.active = !1,
					this.labIdleCashItemTime.node.active = !1
			},
			btnPrestigeClick: function (e, t) {
				// this.publishEvent({
				// 	type: "OpenPrestige",
				// 	mine: UserData.GameData.CurrentMine
				// })
			},
			buttomButtonShowClicked: function (e, t) {
				if (1 == e) for (var a = 0; a < this.bottomButtons.length; ++a) this.bottomButtons[a].interactable = a + 1 != t;
				else for (var i = 0; i < this.bottomButtons.length; ++i) this.bottomButtons[i].interactable = !0
			},
			onButtomButtonClosed: function (e) {
				this.bottomButtonView && (this.bottomButtonView.destroy(), this.bottomButtonView = null),
					this.buttomButtonShowClicked(2)
			},
			onBottomBtnClick: function (e, t) {
				Music.play("SFX_Button General");
				var a = parseInt(t);
				switch (a) {
					case 1:
						break;
					case 2:
						this.bottomButtonView && (this.bottomButtonView.destroy(), this.bottomButtonView = null),
							this.bottomButtonView = cc.instantiate(this.prbInfoDetails);
						var i = this.bottomViewNode.parent.convertToWorldSpaceAR(this.bottomViewNode.getPosition()),
							n = this.node.convertToNodeSpaceAR(i);
						this.bottomButtonView.y = this.node.y - n.y,
							this.bottomViewNode.addChild(this.bottomButtonView),
							this.buttomButtonShowClicked(1, a);
						break;
					case 3:
						this.bottomButtonView && (this.bottomButtonView.destroy(), this.bottomButtonView = null),
							this.bottomButtonView = cc.instantiate(this.prbBoost),
							this.bottomViewNode.addChild(this.bottomButtonView),
							this.buttomButtonShowClicked(1, a);
						break;
					case 4:
						break;
					case 5:
						this.onButtomButtonClosed(),
							this.publishEvent({
								type: "OpenWorldMap"
							})
				}
				this.bottomBtnContainer.zIndex = 100,
					this.bottomButtonView && (this.bottomButtonView.zIndex = this.bottomBtnContainer.zIndex - 1)
			},
			btnScrollToClick: function (e, t) {
				switch (this.scrollView.stopAutoScroll(), t) {
					case "Top":
						this.scrollView.scrollToTop(1);
						break;
					case "Bottom":
						var a = Constant.SEAM_LAYER_HEIGHT / (this.scrollView.content.getContentSize().height - cc.winSize.height) * this.seamData.unlockedLayerNum;
						this.scrollView.scrollToPercentVertical(1 - a, 1)
				}
			},
			btnLevelUpModeClick: function (e, t) {
				Music.play("SFX_Change Tab");
				var a = UserData.getMineDataRef("Setting");
				a.LevelUpMode += 1,
					a.LevelUpMode = a.LevelUpMode > LevelUpMode.LV_MAX ? LevelUpMode.LV_X1 : a.LevelUpMode,
					this.reloadBtnLevelUp(a.LevelUpMode),
					this.publishEvent({
						type: "LevelUpModeChanged",
						mode: a.LevelUpMode
					})
			},
			requestCurrentLevelUpMode: function () {
				var e = UserData.getMineDataRef("Setting");
				this.reloadBtnLevelUp(e.LevelUpMode)
			},
			reloadBtnLevelUp: function (e) {
				this.labLevelUpMode.string = ["x1", "x10", "x50", "Max"][e - 1]
				if (this.labLevelUpMode.string == "Max") {
					this.labLevelUpMode.string = "xx"
				}
			},
			onLevelUpModeChanged: function (e) {
				this.reloadBtnLevelUp(e.mode)
			},
			onMineChanged: function (e) {
				this._loadGameModule()
			},
			onPrestigeSuccess: function (e) {
				UserData.GameData.CurrentMine = e.mine,
					this._loadGameModule()
			},
			onSyncCloudData: function (e) {
				this._loadGameModule()
			},
			onAddCash: function (e) {
				Music.play("SFX_Get Cash"),
					this.userCashNum.add(e.cashNum),
					this.labCash.string = this.userCashNum.toString(),
					UserData.GameData.TotalCash = this.userCashNum.toNumber(),
					this.publishEvent({
						type: "CashChanged"
					})
			},
			onSpendCash: function (e) {
				this.userCashNum.remove(e.cashNum),
					this.labCash.string = this.userCashNum.toString(),
					UserData.GameData.TotalCash = this.userCashNum.toNumber(),
					this.publishEvent({
						type: "CashChanged"
					})
			},
			onSpendSuperCash: function (e) {
				UserData.GameData.SuperCash -= e.superCashNum,
					this.labSuperCash.string = UserData.GameData.SuperCash,
					this.publishEvent({
						type: "SuperCashChanged"
					})
			},
			onAddSuperCash: function (e) {
				Music.play("SFX_Get Super Cash");
				for (var t = [0, 2, 4, 10, 20, 30, 50, 100, 150, 250, 400, 600, 800, 1100, 1500, 2e3], a = 0, i = 0; i < t.length - 1; i++) UserData.GameData.SuperCash > t[i] && UserData.GameData.SuperCash <= t[i + 1] && (a = i + 1);
				UserData.GameData.SuperCash > 2e3 && (a = t.length),
					UserData.GameData.SuperCash += e.superCashNum;
				for (var n = 0,
					r = 0; r < t.length - 1; r++) UserData.GameData.SuperCash > t[r] && UserData.GameData.SuperCash <= t[r + 1] && (n = r + 1);
				UserData.GameData.SuperCash > 2e3 && (n = t.length),
					a < n && Analysis.sendEvent({
						type: "AddSuperCash_" + n
					}),
					this.labSuperCash.string = UserData.GameData.SuperCash,
					this.publishEvent({
						type: "SuperCashChanged"
					})
			},
			onShareClicked: function () {
				// ViewMgr.showDialog(cc.instantiate(this.prbDialogShare))分享按钮
			},
			onSignClicked: function () {
				ViewMgr.showDialog(cc.instantiate(this.prbDialogSign))
			},
			onCashAddClicked: function () {
				ViewMgr.showDialog(cc.instantiate(this.prbDialogCashAdd))
			},
			onInitStepMoveForward: function (e) {
				if (this._refreshStepNodes(e.currentStep), 4 == e.currentStep && 1 == UserData.GameData.CurrentMine && this.btnScrollToClick(null, "Bottom"), 3.5 == e.currentStep && 1 == UserData.GameData.CurrentMine) {
					this.scrollView.stopAutoScroll();
					var t = Constant.SEAM_LAYER_HEIGHT / (this.scrollView.content.getContentSize().height - cc.winSize.height) * (this.seamData.unlockedLayerNum - .4);
					this.scrollView.scrollToPercentVertical(1 - t, .75)
				}
			},
			onTutorialStep: function (e) {
				"Boost" == e.tutorial && 8 == e.step && this.scrollView.scrollToTop(.6),
					"UpgradeSeamLayer" == e.tutorial && this.scrollView.scrollToTop(.6)
			},
			onScrollToDesignationPosition: function (t) {
				var a = e("PrisonerManager");
				if (this.scrollView.stopAutoScroll(), t.minerBranch != a.EnumMinerBranch.Seam) this.scrollView.scrollToTop(1);
				else {
					var i = Constant.SEAM_LAYER_HEIGHT / (this.scrollView.content.getContentSize().height - cc.winSize.height) * (t.minerId + .5);
					this.scrollView.scrollToPercentVertical(1 - i, 1)
				}
			},
			onNewSeamLayerUnlock: function (e) {
				var t = this;
				if (e.layerNum > 1 || 1 != UserData.GameData.CurrentMine || this.prestige.time > 0) {
					this.scheduleOnce(function () {
						t.btnScrollToClick(null, "Bottom")
					},
						.1);
					var a = FriendsData[UserData.GameData.CurrentMine];
					if (null != a) {
						var i = a[e.layerNum];
						i && i.length > 0 && Platform.showCustomShare(this.prbDialogCusShare, {
							curMine: UserData.GameData.CurrentMine,
							layerNum: e.layerNum,
							friend: i[0],
							type: "custom_surpass"
						})
					}
					e.layerNum == Constant.MAX_SEAM_NUM_PER_MINE && Platform.showCustomShare(this.prbDialogCusShare1, {
						type: "custom_maxlayer"
					})
				}
			},
			onOpenBoostsView: function (e) {
				if (this.onBottomBtnClick(null, "3"), this.bottomButtonView) {
					this.bottomButtonView.getComponent("Boost").onToggleContainerClicked({
						node: {
							name: "toggle2"
						}
					});
					var t = this.bottomButtonView.getChildByName("BaseNode").getChildByName("ToggleContainer").getChildByName("toggle2").getComponent(cc.Toggle);
					t.isChecked = !0,
						this.bottomButtonView.getChildByName("BaseNode").getChildByName("ToggleContainer").getComponent(cc.ToggleContainer).updateToggles(t)
				}
			},
			onGetSignItem: function (e) {
				this.checkDailySign()
			}
		}),
			cc._RF.pop()
	},
	{
		BaseLayer: "BaseLayer",
		NumberData: "NumberData",
		PrisonerManager: "PrisonerManager"
	}],
	Game: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "940dbXaK19H5IjJTvAkTm78", "Game"),
			cc.Class({
				extends: e("EasyEvent").declareEvent("GameHide", "GameShow", "ShowVirtualAd"),
				editor: {
					menu: "Scene/Game"
				},
				properties: {
					btnDebug: cc.Button,
					prbDebugDialog: cc.Prefab,
					prbWorldMap: cc.Prefab,
					worldMapNode: cc.Node,
					prbGameLayer: cc.Prefab,
					gameLayerNode: cc.Node,
					prbDataCenter: cc.Prefab,
					dataCenterNode: cc.Node,
					prbDialogPrestige: cc.Prefab,
					labVersion: cc.Label,
					prbTutorial: cc.Prefab,
					prbVirtualAdLayer: cc.Prefab,
					prbAddCoinAct: cc.Prefab,
					loadingMask: cc.Node
				},
				onLoad: function () {
					var e = this;
					Analysis.sendEvent({
						type: "on_game_page"
					}),
						this.btnDebug.node.active = !1,
						this.labVersion.node.active = !1,
						this.labVersion.string = "v-" + UserData.defaultData.Setting.Version,
						Platform.onShow({
							callback: function () {
								e.publishEvent({
									type: "GameShow"
								})
							}
						}),
						Platform.onHide({
							callback: function () {
								e.publishEvent({
									type: "GameHide"
								})
							}
						}),
						this.dataCenter = cc.instantiate(this.prbDataCenter),
						this.dataCenter.parent = this.dataCenterNode,
						this.tutorial = cc.instantiate(this.prbTutorial),
						this.tutorial.zIndex = cc.macro.MAX_ZINDEX - 1,
						this.tutorial.parent = cc.director.getScene().getChildByName("Canvas"),
						this.addCoinAct = cc.instantiate(this.prbAddCoinAct),
						this.addCoinAct.zIndex = cc.macro.MAX_ZINDEX - 2,
						this.addCoinAct.parent = cc.director.getScene().getChildByName("Canvas")
				},
				start: function () {
					var e = this;
					this.worldMap = cc.instantiate(this.prbWorldMap),
						this.worldMap.parent = this.worldMapNode,
						this.gameLayer = cc.instantiate(this.prbGameLayer),
						this.gameLayer.parent = this.gameLayerNode,
						this.scheduleOnce(function () {
							Music.loadResDir("audioClips/1").then(function () {
								Music.play("Bg", !0)
							});
							for (var t = [], a = function () {
								var a = i;
								t.push(cc.callFunc(function () {
									Music.loadResDir("audioClips/" + a)
								},
									e)),
									t.push(cc.delayTime(.5))
							},
								i = 2; i <= 6; i++) a();
							e.node.runAction(cc.sequence(t))
						},
							1)
				},
				btnDebugClick: function (e, t) {
					ViewMgr.showDialog(cc.instantiate(this.prbDebugDialog))
				},
				onOpenPrestige: function (e) {
					// var t = cc.instantiate(this.prbDialogPrestige);
					// t.getComponent("DialogPrestige").setMine(e.mine),
					// ViewMgr.showDialog(t)
				},
				onShowVirtualAd: function (e) {
					var t = cc.instantiate(this.prbVirtualAdLayer);
					t.getComponent("VirtualAdLayer").setSuccessCallback(e.success),
						cc.director.getScene().addChild(t)
				},
				onShowAddCoinAct: function (e) {
					if (e.cashType) {
						var t = 1 == e.cashType ? this.gameLayer.getComponent("GameLayer").labCash.node : this.gameLayer.getComponent("GameLayer").labSuperCash.node,
							a = t.parent.convertToWorldSpaceAR(t.position),
							i = this.addCoinAct.convertToNodeSpaceAR(a);
						console.log("p :" + this.addCoinAct.x, 0 + this.addCoinAct.y);
						var n = this.addCoinAct.convertToNodeSpaceAR(e.start);
						this.addCoinAct.getComponent("AddCoinAni").startWithAction(n, i, t, e.cashType)
					}
				},
				onStartLoadGameModule: function (e) {
					var t = this;
					this.loadingMask.opacity = 255,
						this.loadingMask.runAction(cc.fadeOut(1)),
						this.stayMineTime || (this.stayMineTime = 0),
						this.stayMineTimeData || (this.stayMineTimeData = {}),
						this.timeRangeArr = [1, 2, 4, 8, 12, 20, 30, 40, 60],
						this._addOnLineTime = function () {
							t.stayMineTime += 1,
								t.timeRangeArr.forEach(function (e) {
									t.stayMineTime >= e && !t.stayMineTimeData["UpTo_" + e] && (t.stayMineTimeData["UpTo_" + e] = !0, console.log("\u77ff\u533a\u7d2f\u8ba1\u65f6\u95f4\u8fbe\u5230:", t.stayMineTime, "\u5206\u949f,\u8bb0\u5f55\u57cb\u70b9."), Analysis.sendEvent({
										type: "StayMineTimeUpTo_" + e
									}))
								})
						},
						this.schedule(this._addOnLineTime, 60),
						this.stayTotalTime || (this.stayTotalTime = 0),
						this.stayTotalTimeData || (this.stayTotalTimeData = {}),
						this._addOnLineTotalTime = function () {
							t.stayTotalTime += 1,
								t.timeRangeArr.forEach(function (e) {
									t.stayTotalTime >= e && !t.stayTotalTimeData["UpTo_" + e] && (t.stayTotalTimeData["UpTo_" + e] = !0, Analysis.sendEvent({
										type: "StayTotalTimeUpTo_" + e
									}))
								})
						},
						this.schedule(this._addOnLineTotalTime, 60)
				},
				onOpenWorldMap: function (e) {
					this.unschedule(this._addOnLineTime)
				},
				onCloseWorldMap: function () {
					this.schedule(this._addOnLineTime, 60)
				}
			}),
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent"
	}],
	GoldAni: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "2484aCSRsFJ8bRvMFQ8m47+", "GoldAni"),
			cc.Class({
				extends: cc.Component,
				properties: {
					nodeCash: cc.Node
				},
				start: function () { },
				setType: function (e) {
					2 == e ? (this.nodeCash.active = !0, this.node.getComponent(cc.Animation).stop()) : this.nodeCash.active = !1
				}
			}),
			cc._RF.pop()
	},
	{}],
	H5Ad: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "2eb81vd1l1CearVehmWDJ4P", "H5Ad"),
			cc.Class({
				extends: e("BaseAd"),
				init: function () {
					var e = this;
					this._isLoading = !0,
						setTimeout(function () {
							e._isLoading = !1
						},
							12e3)
				},
				isVideoComplete: function () {
					return !0
				},
				isVideoLoading: function () {
					return this._isLoading
				},
				showVideo: function (e) {
					var t = this;
					this._isLoading = !0,
						setTimeout(function () {
							t._isLoading = !1
						},
							6e3),
						this.playAds(e.success, e.fail)
				},
				playAds: function (e, t) {
					t && t()
				}
			}),
			cc._RF.pop()
	},
	{
		BaseAd: "BaseAd"
	}],
	H5Analysis: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "82caaHHLe1LbpfaC+naCHaw", "H5Analysis"),
			cc.Class({
				extends: e("BaseAnalysis"),
				properties: {},
				init: function () { },
				sendEvent: function (e) {
					e.type ? console.log("h5 log event :" + e.type) : console.log("h5 log event fail : no type prama")
				}
			}),
			cc._RF.pop()
	},
	{
		BaseAnalysis: "BaseAnalysis"
	}],
	H5DataStore: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "dc4209BwPNMraKhXHLpq5yv", "H5DataStore"),
			cc.Class({
				extends: e("BaseDataStore")
			}),
			cc._RF.pop()
	},
	{
		BaseDataStore: "BaseDataStore"
	}],
	H5ErrorHandler: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "5b3b9S25NNEvKdr5M1/1Vyu", "H5ErrorHandler"),
			cc.Class({
				extends: e("BaseErrorHandler")
			}),
			cc._RF.pop()
	},
	{
		BaseErrorHandler: "BaseErrorHandler"
	}],
	H5Pay: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "22619uaqsVIiolrvkQ3/YpY", "H5Pay"),
			cc.Class({
				extends: e("BasePay"),
				init: function () {
					console.log("H5Pay \u521d\u59cb\u5316\u6210\u529f."),xmloadReady()
				}
			}),
			cc._RF.pop()
	},
	{
		BasePay: "BasePay"
	}],
	H5Platform: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "90a82SdoUJJEKqX/j+PGCSW", "H5Platform"),
			cc.Class({
				extends: e("BasePlatform"),
				submitScore: function (e) {
					e.successCb && e.successCb()
				},
				getRanklistData: function (e) {

				}
			}),
			cc._RF.pop()
	},
	{
		BasePlatform: "BasePlatform"
	}],
	IOSAd: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "98d9eZyr2pJTKF2Fx5FUO62", "IOSAd"),
			cc.Class({
				extends: e("SDKBoxAds")
			}),
			cc._RF.pop()
	},
	{
		SDKBoxAds: "SDKBoxAds"
	}],
	IOSDataStore: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "c48d2l+xGtDILlcUbp0vMiN", "IOSDataStore"),
			cc.Class({
				extends: e("BaseDataStore")
			}),
			cc._RF.pop()
	},
	{
		BaseDataStore: "BaseDataStore"
	}],
	IOSErrorHandler: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "cf4dbMAIGRHYol0xSHk+Q/N", "IOSErrorHandler"),
			cc.Class({
				extends: e("BaseErrorHandler")
			}),
			cc._RF.pop()
	},
	{
		BaseErrorHandler: "BaseErrorHandler"
	}],
	IOSPlatform: [function (e, t, a) {
		"use strict";
		if (cc._RF.push(t, "36e83hNkAxLBpbUjVI+V8Nj", "IOSPlatform"), cc.Class({
			extends: e("BasePlatform"),
			shareAppMessage: function (e) {
				console.log("Android shareAppMessage"),
					this.initImage()
			},
			initImage: function () {
				var e = new cc.Node;
				e.parent = cc.director.getScene().getChildByName("Canvas");
				var t = e.addComponent(cc.Camera);
				console.log("Android shareAppMessage2"),
					t.cullingMask = 4294967295;
				var a = new cc.RenderTexture;
				this.texture = a;
				var i = cc.game._renderContext;
				a.initWithSize(cc.visibleRect.width, cc.visibleRect.height, i.STENCIL_INDEX8),
					t.targetTexture = a,
					console.log("Android shareAppMessage3"),
					t.render();
				var n = this.texture.readPixels();
				this._width = this.texture.width,
					this._height = this.texture.height;
				var r = this.filpYImage(n, this._width, this._height);
				console.log("Android shareAppMessage 4");
				var o = jsb.fileUtils.getWritablePath() + "share.jpg";
				jsb.saveImageData(r, this._width, this._height, o) && (console.log("save image data success, file: " + o), jsb.reflection.callStaticMethod())
			},
			filpYImage: function (e, t, a) {
				for (var i = new Uint8Array(t * a * 4), n = 4 * t, r = 0; r < a; r++) for (var o = (a - 1 - r) * t * 4, s = r * t * 4, c = 0; c < n; c++) i[s + c] = e[o + c];
				return i
			}
		}), cc.sys.platform == cc.sys.IPHONE) {
			var i = cc.sys.getSafeAreaRect().y;
			cc.view._initFrameSize = function () {
				cc.game.frame.__origin_clientHeight || (cc.game.frame.__origin_clientHeight = cc.game.frame.clientHeight);
				var e = this._frameSize,
					t = cc.game.frame.clientWidth,
					a = cc.game.frame.__origin_clientHeight - i,
					n = t >= a; !cc.sys.isMobile || n && this._orientation & cc.macro.ORIENTATION_LANDSCAPE || !n && this._orientation & cc.macro.ORIENTATION_PORTRAIT ? (e.width = t, e.height = a, cc.game.container.style["-webkit-transform"] = "rotate(0deg)", cc.game.container.style.transform = "rotate(0deg)", this._isRotated = !1) : (e.width = a, e.height = t, cc.game.container.style["-webkit-transform"] = "rotate(90deg)", cc.game.container.style.transform = "rotate(90deg)", cc.game.container.style["-webkit-transform-origin"] = "0px 0px 0px", cc.game.container.style.transformOrigin = "0px 0px 0px", this._isRotated = !0),
						this._orientationChanging && setTimeout(function () {
							cc.view._orientationChanging = !1
						},
							1e3)
			}
		}
		cc._RF.pop()
	},
	{
		BasePlatform: "BasePlatform"
	}],
	IdleCashMgr: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "7ab8fHvPINN072T6pqrlh2n", "IdleCashMgr"),
			e("Constant"),
			window.IdleCashMgr = {
				setIdleDate: function (e) {
					e = e || UserData.GameData.CurrentMine;
					var t = UserData.getMineDataRef("Idle", e);
					t.waitCollected || (t.waitCollected = !0, t.idleDate = (new Date).getTime())
				},
				getIdleDate: function (e) {
					return e = e || UserData.GameData.CurrentMine,
						UserData.getMineDataRef("Idle", e).idleDate || (new Date).getTime()
				},
				collectIdleCash: function (e) {
					e = e || UserData.GameData.CurrentMine,
						UserData.getMineDataRef("Idle", e).waitCollected = !1
				},
				getIdleCash: function (e) {
					var t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
					return this.getInlineCash(e, t).mult(CfgMgr.Common.getIdleRate())
				},
				getInlineCash: function (t) {
					var a = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
						i = e("NumberData");
					if (t = t || UserData.GameData.CurrentMine, !UserData.GameData.Mine[t]) return new i(0);
					var n = UserData.GameData.Mine[t].Seam,
						r = new i(0);
					if (0 == n.list.length) return r;
					n.list.forEach(function (e, i) {
						if (e && e.unlock && (e.haveManager || a)) {
							var n = CfgMgr.Seam.getWorkerNumByLevel(e.level),
								o = CfgMgr.Seam.getWorkerAbility(i, e.level, t),
								s = CfgMgr.Seam.getExcavateTime(),
								c = o.mult(n).divi(s + 2 * CfgMgr.Seam.getWorkerMoveDur(e.level));
							r.add(c)
						}
					});
					var o = new i(0),
						s = !1,
						c = UserData.GameData.Mine[t].StoreHouse,
						l = UserData.GameData.Mine[t].Manager.StoreHouse;
					if (l && l.assign && l.assign.list && (s = 0 != l.assign.list[1].TableIndex), s = a || s) {
						var d = CfgMgr.StoreHouse.getMoveSpeed(c.level),
							h = CfgMgr.StoreHouse.getPerTransport(c.level, 1, 0, t, !1),
							u = CfgMgr.StoreHouse.getLoadingTime(),
							m = CfgMgr.StoreHouse.getLoadingSpeed(h.clone(), u),
							g = CfgMgr.StoreHouse.getStoreWorkerNum(c.level);
						o = CfgMgr.StoreHouse.getTotalTransportationNumByLevel(h.clone(), g, m.clone(), d, t)
					}
					var p = {
						mine: t,
						freightRate: 1,
						freightSpeedRate: 1,
						moveSpeedRate: 1,
						consumeRate: 1
					},
						f = void 0,
						v = UserData.GameData.Mine[t].Elevator;
					f = a || UserData.GameData.Mine[t].Manager.Elevator && UserData.GameData.Mine[t].Manager.Elevator.assign.list[1] && 0 != UserData.GameData.Mine[t].Manager.Elevator.assign.list[1].TableIndex ? CfgMgr.Elevator.getTotalPower(v.level, v.layerNum, p) : new i(0);
					var _ = o.compare(r);
					return _ < 0 ? (_ = o.compare(f)) < 0 ? o : f : (_ = r.compare(f)) < 0 ? r : f
				},
				getTotalIdleCash: function (t) {
					var a = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
					t = t || UserData.GameData.CurrentMine;
					var i = new (e("NumberData"))(0),
						n = Date.now(),
						r = IdleCashMgr.getIdleDate(t),
						o = IdleCashMgr.getIdleCash(t, a),
						s = ItemMgr.getAdEffectEndTime(t),
						c = Math.min(n, r + 2592e6),
						l = [],
						d = [];
					for (var h in UserData.GameData.Item.active) UserData.GameData.Item.active[h].endTime > r && d.push(UserData.GameData.Item.active[h]);
					d.sort(function (e, t) {
						return e.endTime < t.endTime ? -1 : 1
					});
					for (var u = !1,
						m = 0; m < d.length; ++m) {
						for (var g = {
							value: d[m].value,
							endTime: d[m].endTime > c ? c : d[m].endTime
						},
							p = m + 1; p < d.length; ++p) g.value += d[p].value;
						if (s.endTime > r && !u) if (g.endTime > s.endTime) {
							u = !0;
							var f = {
								value: g.value * s.value,
								endTime: s.endTime
							};
							l.push(f);
							var v = {
								value: g.value,
								endTime: g.endTime
							};
							l.push(v)
						} else g.value *= s.value,
							l.push(g);
						else l.push(g)
					}
					var _ = {
						value: 1,
						endTime: c
					};
					if (s.endTime > r && !u) if (_.endTime > s.endTime) {
						u = !0;
						var y = {
							value: _.value * s.value,
							endTime: s.endTime
						};
						l.push(y);
						var b = {
							value: _.value,
							endTime: _.endTime
						};
						l.push(b)
					} else _.value *= s.value,
						l.push(_);
					else l.push(_);
					for (var S = 0; S < l.length; ++S) if (0 == S) {
						var C = l[0].endTime - r;
						i.add(o.clone().mult(C / 1e3 * l[S].value))
					} else {
						var D = l[S].endTime - l[S - 1].endTime;
						i.add(o.clone().mult(D / 1e3 * l[S].value))
					}
					return i
				}
			},
			cc._RF.pop()
	},
	{
		Constant: "Constant",
		NumberData: "NumberData"
	}],
	InfoDetails: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "9be33pmXdFKsZ231x+gmBbq", "InfoDetails"),
			cc.Class({
				extends: e("EasyEvent").declareEvent("ButtomButtonClosed"),
				properties: {
					baseNode: cc.Node,
					statsToggle: cc.Toggle,
					shaftsToggle: cc.Toggle,
					workersToggle: cc.Toggle,
					statsContent: cc.Node,
					shaftsContent: cc.Node,
					workersContent: cc.Node,
					prefabDialogLevelUp: cc.Prefab,
					sprRole1: cc.Sprite,
					sprRole2: cc.Sprite,
					sprRole3: cc.Sprite
				},
				start: function () {
					var e = this;
					this.node.width = cc.winSize.width,
						this.node.height = cc.winSize.height,
						this.workersToggle.interactable = !1,
						this.show();
					var t = "texture/managerItem/",
						a = UserData.Setting.Mode2D ? "managerIcon2D" : "managerIcon3D";
					cc.loader.loadRes(t + a, cc.SpriteFrame,
						function (t, a) {
							t || (e.sprRole1.spriteFrame = a)
						}),
						cc.loader.loadRes(t + a, cc.SpriteFrame,
							function (t, a) {
								t || (e.sprRole2.spriteFrame = a)
							}),
						cc.loader.loadRes(t + a, cc.SpriteFrame,
							function (t, a) {
								t || (e.sprRole3.spriteFrame = a)
							})
				},
				onToggleContainerClicked: function (e) {
					Music.play("SFX_Button General"),
						"Stats" == e.node.name ? (this.statsContent.active = !0, this.shaftsContent.active = !1, this.workersContent.active = !1, Analysis.sendEvent({
							type: "clickInfoStats"
						})) : "Shafts" == e.node.name ? (this.statsContent.active = !1, this.shaftsContent.active = !0, this.workersContent.active = !1, Analysis.sendEvent({
							type: "clickInfoShafts"
						})) : "Workers" == e.node.name && (this.statsContent.active = !1, this.shaftsContent.active = !1, this.workersContent.active = !0)
				},
				show: function () {
					Music.play("SFX_Open Panel"),
						this.baseNode.scaleY = 0,
						this.baseNode.runAction(cc.scaleTo(.2, 1, 1)),
						Analysis.sendEvent({
							type: "openInfoDetails"
						})
				},
				onCloseClicked: function () {
					var e = this;
					Music.play("SFX_Close Panel"),
						this.baseNode.runAction(cc.sequence(cc.scaleTo(.1, 1, 0), cc.callFunc(function () {
							e.node.removeFromParent(),
								e.publishEvent({
									type: "ButtomButtonClosed"
								})
						},
							this)))
				},
				onLevelUpdialog: function (e) {
					var t = cc.instantiate(this.prefabDialogLevelUp);
					t.getComponent("DialogLevelUp").initData(e.minerBranch, e.minerId),
						ViewMgr.showDialog(t),
						Analysis.sendEvent({
							type: "OpenDialogLevelUpFromInfoDetail"
						})
				}
			}),
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent"
	}],
	InfoShaftListItem: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "b4c10KUHRpCILETg9mMuzVB", "InfoShaftListItem"),
			cc.Class({
				extends: e("EasyEvent").declareEvent("ManagerAssign", "ManagerItemUseSkill", "RequestManagerSkillState", "LevelUpdialog"),
				properties: {
					sprManagerIcon: {
						type: cc.Sprite,
						default:
							null
					},
					sprManagerBg: {
						type: cc.Sprite,
						default:
							null
					},
					labQuality: {
						type: cc.Label,
						default:
							null
					},
					labPropertyName1: {
						type: cc.Label,
						default:
							null
					},
					labPropertyName2: {
						type: cc.Label,
						default:
							null
					},
					labPropertyDetail1: {
						type: cc.Label,
						default:
							null
					},
					labPropertyDetail2: {
						type: cc.Label,
						default:
							null
					},
					btnSkill: {
						type: cc.Button,
						default:
							null
					},
					nodeDetail: cc.Node,
					nodeProgress: cc.Node,
					progress: cc.ProgressBar,
					labProgress: cc.Label,
					labProgressval: cc.Label,
					labName: cc.Label,
					labProName: cc.Label,
					seamName: cc.Label,
					seamPower: cc.Label,
					right: cc.Node,
					ratioLabel: cc.Label,
					explanLabel: cc.Label,
					iconSpirte: cc.Sprite,
					spriteFrames: [cc.SpriteFrame],
					barSpriteFrames: [cc.SpriteFrame],
					upBtn: cc.Node
				},
				start: function () { },
				refreshData: function (e, t) {
					this.index = e,
						this.managerData = t.manager,
						this.layerData = t.layer,
						this.refreshCell()
				},
				refreshCell: function () {
					var e = this;
					this.tbData = CfgMgr.Manager.getManagerDataById(this.managerData.TableIndex),
						this.labName.string = this.managerData.Name,
						this.labQuality.string = CfgMgr.Manager.getQualityStr(this.tbData.quality),
						this.labQuality.node.color = CfgMgr.Manager.getQualityLabelColor(this.tbData.quality),
						this.labPropertyName1.string = Language.getName("Effect") + ":",
						this.labPropertyDetail1.string = this.tbData.skill_time + "m",
						this.labPropertyName2.string = CfgMgr.Manager.getPropertyName(this.tbData.skill_type, this.tbData.skill_param),
						this.labPropertyDetail2.string = "",
						this.labProName.string = CfgMgr.Manager.getPropertyName(this.tbData.skill_type, this.tbData.skill_param);
					var t = this.btnSkill.node.getChildByName("Background").getChildByName("SkillIcon").getComponent(cc.Sprite);
					cc.loader.loadRes(CfgMgr.Manager.getPropertyIcon(this.tbData.skill_type), cc.SpriteFrame,
						function (e, a) {
							e ? console.log("\u52a0\u8f7d\u7ba1\u7406\u5458icon\u5931\u8d25" + e) : t.spriteFrame = a
						}),
						cc.loader.loadRes("texture/managerEffectIcon/HeroBox0" + (this.tbData.quality - 1), cc.SpriteFrame,
							function (t, a) {
								// t ? cc.warn("\u52a0\u8f7d\u7ba1\u7406\u5458head\u5931\u8d25" + t) : e.sprManagerBg.spriteFrame = a
							}),
						this.seamName.string = Language.getName("Mineshaft B") + this.managerData.MinerId,
						this.seamPower.string = Language.getName("Extraction") + "\uff1a" + this.layerData.power.toString() + "/s",
						this.layerData.isMaxPower ? (this.ratioLabel.string = this.layerData.powerRatio + "%", this.explanLabel.string = Language.getName("Best\n Mineshaft"), this.explanLabel.node.color = cc.color("#ffe25c"), this.explanLabel.node.y = -50, this.upBtn.active = !1, this.iconSpirte.spriteFrame = this.spriteFrames[0], this.iconSpirte.node.y = 15, this.explanLabel.node.active = !0, this.iconSpirte.node.active = !0) : this.layerData.isMaxUpgradeBenefit ? (this.ratioLabel.string = this.layerData.powerRatio + "%", this.explanLabel.string = Language.getName("Easier\n Profitable"), this.explanLabel.node.color = cc.color("#ff8181"), this.explanLabel.node.y = -10, this.upBtn.active = !0, this.iconSpirte.spriteFrame = this.spriteFrames[1], this.iconSpirte.node.y = 35, this.explanLabel.node.active = !0, this.iconSpirte.node.active = !0) : (this.ratioLabel.string = this.layerData.powerRatio + "%", this.upBtn.active = !1, this.explanLabel.node.active = !1, this.iconSpirte.node.active = !1),
						this.refreshSkillState()
				},
				refreshSkillState: function () {
					var e = Math.floor((new Date).getTime() / 1e3),
						t = 60 * this.tbData.skill_cd,
						a = 60 * this.tbData.skill_time;
					e < this.managerData.SkillDate ? (this.nodeDetail.active = !1, this.nodeProgress.active = !0, this.managerData.SkillDate - e > a && (console.log("\u6d89\u5acc\u4fee\u6539\u7cfb\u7edf\u65f6\u95f4 \u91cd\u7f6e\u65f6\u95f4"), this.managerData.SkillDate = e + a), this.seamPower.node.color = cc.color("#ffe25c"), this.totalTime = a, this.dtTime = this.managerData.SkillDate - e, this.labProgress.string = Language.getName("Effect") + ":", this.labProgress.node.color = cc.color("#ffe25c"), this.labProgressval.string = this.dtTime.toString(), this.labProgressval.node.color = cc.color("#ffe25c"), this.labProName.node.color = cc.color("#FFAD00"), this.progress.progress = this.dtTime / this.totalTime, this.progress.barSprite.spriteFrame = this.barSpriteFrames[0], this.schedule(this.scheduleUseSkill, 1), this.skillState = ManagerSkillState.MS_USING, this.btnSkill.interactable = !1) : e - this.managerData.SkillDate > t ? (this.nodeDetail.active = !0, this.nodeProgress.active = !1, this.seamPower.node.color = cc.color("#ffffff"), this.labProName.node.color = cc.color("#816F6F"), this.skillState = ManagerSkillState.MS_IDLE, this.btnSkill.interactable = !0) : (this.nodeProgress.active = !0, this.nodeDetail.active = !1, this.seamPower.node.color = cc.color("#ffffff"), this.labProgress.string = Language.getName("Cool Down") + ":", this.labProgress.node.color = cc.color("#ffffff"), this.dtTime = t + this.managerData.SkillDate - e, this.totalTime = t, this.labProgressval.string = this.dtTime.toString(), this.labProgressval.node.color = cc.color("#ffffff"), this.labProName.node.color = cc.color(104, 104, 104), this.progress.progress = this.dtTime / this.totalTime, this.progress.barSprite.spriteFrame = this.barSpriteFrames[1], this.schedule(this.scheduleSkillCd, 1), this.skillState = ManagerSkillState.MS_CD, this.btnSkill.interactable = !1)
				},
				scheduleSkillCd: function () {
					this.dtTime -= 1,
						this.dtTime = Math.max(0, this.dtTime),
						this.progress.progress = this.dtTime / this.totalTime,
						this.labProgressval.string = this.dtTime.toString(),
						this.dtTime <= 0 && (this.unschedule(this.scheduleSkillCd), this.refreshSkillState())
				},
				scheduleUseSkill: function (e) {
					this.dtTime -= 1,
						this.dtTime = Math.max(0, this.dtTime),
						this.progress.progress = this.dtTime / this.totalTime,
						this.labProgressval.string = this.dtTime.toString(),
						this.dtTime <= 0 && (this.unschedule(this.scheduleUseSkill), this.refreshSkillState())
				},
				btnUseSkill: function () {
					Music.play("SFX_Boost Manager"),
						console.log("skill state :" + this.skillState),
						this.skillState == ManagerSkillState.MS_IDLE && (this.publishEvent({
							type: "ManagerItemUseSkill",
							minerBranch: this.managerData.MinerBranch,
							minerId: this.managerData.MinerId
						}), this.refreshSkillState(), console.log("use skill tabindex :" + this.managerData.TableIndex))
				},
				onManagerSkillStateChange: function (e) {
					this.node.active && e.minerBranch == this.managerData.MinerBranch && e.minerId == this.managerData.MinerId && (this.skillState = e.state)
				},
				onUpBtnClicked: function () {
					this.publishEvent({
						type: "LevelUpdialog",
						minerBranch: this.managerData.MinerBranch,
						minerId: this.managerData.MinerId
					})
				}
			}),
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent"
	}],
	InfoShaft: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "89927gr4c1FsJoDfX7P8X/q", "InfoShaft"),
			cc.Class({
				extends: e("EasyEvent").declareEvent("ManagerItemUseSkill", "RequestSeamTotalPower", "RequestSeamAllLayerData"),
				properties: {
					totalSeam: cc.Label,
					listView: cc.Node
				},
				start: function () { },
				onEnable: function () {
					this._refresh()
				},
				_refresh: function () {
					var e = this,
						t = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
					this.publishEvent({
						type: "RequestSeamAllLayerData",
						callback: function (a) {
							var i = a;
							if (e.totalSeam.string = i.totalPower.toString() + "/s", UserData.getMineDataRef("Manager").Seam && UserData.getMineDataRef("Manager").Seam.assign && UserData.getMineDataRef("Manager").Seam.assign) {
								var n = UserData.getMineDataRef("Manager").Seam.assign.list;
								e.shaftData = [];
								for (var r = 1; r < n.length; ++r) if (0 != n[r].TableIndex) {
									var o = {
										manager: n[r],
										layer: i[r]
									};
									e.shaftData.push(o)
								}
								e.listView.getComponent("ListView").refreshData(e.shaftData, t)
							}
						},
						target: this
					})
				},
				onActiveClicked: function () {
					Music.play("SFX_Boost Manager");
					for (var e = Math.floor((new Date).getTime() / 1e3), t = 0; t < this.shaftData.length; ++t) {
						var a = 60 * CfgMgr.Manager.getManagerDataById(this.shaftData[t].manager.TableIndex).skill_cd;
						e - this.shaftData[t].manager.SkillDate > a && this.publishEvent({
							type: "ManagerItemUseSkill",
							minerBranch: this.shaftData[t].manager.MinerBranch,
							minerId: this.shaftData[t].manager.MinerId
						})
					}
					this.listView.getComponent("ListView").refreshData(this.shaftData)
				},
				onManagerSkillStateChange: function (t) {
					var a = e("PrisonerManager");
					t.minerBranch == a.EnumMinerBranch.Seam && this._refresh()
				},
				onLevelUpSeam: function (e) {
					var t = this;
					this.scheduleOnce(function () {
						t._refresh(!1)
					},
						.1)
				}
			}),
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent",
		PrisonerManager: "PrisonerManager"
	}],
	InfoStatsItem: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "b1848sbU5NJEqpy50i0mLlk", "InfoStatsItem"),
			cc.Class({
				extends: e("EasyEvent").declareEvent("ManagerAssign", "ManagerItemUseSkill", "RequestManagerSkillState"),
				properties: {
					labPropertyName1: {
						type: cc.Label,
						default:
							null
					},
					labPropertyName2: {
						type: cc.Label,
						default:
							null
					},
					labPropertyDetail1: {
						type: cc.Label,
						default:
							null
					},
					labPropertyDetail2: {
						type: cc.Label,
						default:
							null
					},
					btnSkill: {
						type: cc.Button,
						default:
							null
					},
					nodeDetail: cc.Node,
					nodeProgress: cc.Node,
					totalPower: cc.Label,
					progress: cc.ProgressBar,
					labProgress: cc.Label,
					labProgressval: cc.Label,
					labProName: cc.Label,
					barSpriteFrames: [cc.SpriteFrame],
					noManagerNode: cc.Node,
					totalAbilityNode: cc.Node
				},
				start: function () {
					this.refresh()
				},
				setData: function (e) {
					this.managerData = e
				},
				refresh: function () {
					if (this.managerData && 0 != this.managerData.TableIndex) {
						this.noManagerNode.active = !1,
							this.totalAbilityNode.active = !0,
							this.tbData = CfgMgr.Manager.getManagerDataById(this.managerData.TableIndex);
						var e = this.btnSkill.node.getChildByName("Background").getChildByName("SkillIcon").getComponent(cc.Sprite);
						cc.loader.loadRes(CfgMgr.Manager.getPropertyIcon(this.tbData.skill_type), cc.SpriteFrame,
							function (t, a) {
								t ? console.log("\u52a0\u8f7d\u7ba1\u7406\u5458icon\u5931\u8d25" + t) : e.spriteFrame = a
							}),
							this.tbData ? (this.labPropertyName1.string = Language.getName("Effect") + ":", this.labPropertyDetail1.string = this.tbData.skill_time + "m", this.labPropertyName2.string = CfgMgr.Manager.getPropertyName(this.tbData.skill_type, this.tbData.skill_param), this.labPropertyDetail2.string = "", this.labProName.string = CfgMgr.Manager.getPropertyName(this.tbData.skill_type, this.tbData.skill_param), this.refreshSkillState()) : (this.nodeDetail.active = !1, this.nodeProgress.active = !1, this.btnSkill.node.active = !1)
					} else this.noManagerNode.active = !0,
						this.totalAbilityNode.active = !1,
						this.nodeDetail.active = !1,
						this.nodeProgress.active = !1,
						this.btnSkill.node.active = !1
				},
				refreshSkillState: function () {
					var e = Math.floor((new Date).getTime() / 1e3),
						t = 60 * this.tbData.skill_cd,
						a = 60 * this.tbData.skill_time;
					e < this.managerData.SkillDate ? (this.nodeDetail.active = !1, this.nodeProgress.active = !0, this.managerData.SkillDate - e > a && (console.log("\u6d89\u5acc\u4fee\u6539\u7cfb\u7edf\u65f6\u95f4 \u91cd\u7f6e\u65f6\u95f4"), this.managerData.SkillDate = e + a), this.totalPower.node.color = cc.color("#ffe25c"), this.totalTime = a, this.dtTime = this.managerData.SkillDate - e, this.labProgress.string = Language.getName("Effect") + ":", this.labProgress.node.color = cc.color("#ffe25c"), this.labProgressval.string = this.dtTime.toString(), this.labProgressval.node.color = cc.color("#ffe25c"), this.labProName.node.color = cc.color("#FFAD00"), this.progress.progress = this.dtTime / this.totalTime, this.progress.barSprite.spriteFrame = this.barSpriteFrames[0], this.schedule(this.scheduleUseSkill, 1), this.btnSkill.interactable = !1, this.skillState = ManagerSkillState.MS_USING) : e - this.managerData.SkillDate > t ? (this.nodeDetail.active = !0, this.nodeProgress.active = !1, this.totalPower.node.color = cc.color("#ffffff"), this.labProName.node.color = cc.color("#816F6F"), this.skillState = ManagerSkillState.MS_IDLE, this.btnSkill.interactable = !0) : (this.nodeProgress.active = !0, this.nodeDetail.active = !1, this.totalPower.node.color = cc.color("#ffffff"), this.labProgress.string = "Cool Down:", this.labProgress.node.color = cc.color("#ffffff"), this.dtTime = t + this.managerData.SkillDate - e, this.totalTime = t, this.labProgressval.string = this.dtTime.toString(), this.labProgressval.node.color = cc.color("#ffffff"), this.labProName.node.color = cc.color(104, 104, 104), this.progress.progress = this.dtTime / this.totalTime, this.progress.barSprite.spriteFrame = this.barSpriteFrames[1], this.schedule(this.scheduleSkillCd, 1), this.skillState = ManagerSkillState.MS_CD, this.btnSkill.interactable = !1)
				},
				scheduleSkillCd: function () {
					this.dtTime -= 1,
						this.dtTime = Math.max(0, this.dtTime),
						this.progress.progress = this.dtTime / this.totalTime,
						this.labProgressval.string = this.dtTime.toString(),
						this.dtTime <= 0 && (this.unschedule(this.scheduleSkillCd), this.refreshSkillState())
				},
				scheduleUseSkill: function (e) {
					this.dtTime -= 1,
						this.dtTime = Math.max(0, this.dtTime),
						this.progress.progress = this.dtTime / this.totalTime,
						this.labProgressval.string = this.dtTime.toString(),
						this.dtTime <= 0 && (this.unschedule(this.scheduleUseSkill), this.refreshSkillState())
				},
				btnUseSkill: function () {
					Music.play("SFX_Boost Manager"),
						console.log("skill state :" + this.skillState),
						this.skillState == ManagerSkillState.MS_IDLE && (this.publishEvent({
							type: "ManagerItemUseSkill",
							minerBranch: this.managerData.MinerBranch,
							minerId: this.managerData.MinerId
						}), this.refreshSkillState(), console.log("use skill tabindex :" + this.managerData.TableIndex))
				},
				onManagerSkillStateChange: function (e) {
					this.managerData && e.minerBranch == this.managerData.MinerBranch && e.minerId == this.managerData.MinerId && (this.skillState = e.state)
				}
			}),
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent"
	}],
	InfoStatsSeam: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "22944QPPHVMUIz3Q8hw2uR/", "InfoStatsSeam"),
			cc.Class({
				extends: e("EasyEvent").declareEvent("ManagerAssign", "ManagerItemUseSkill", "RequestManagerSkillState"),
				properties: {
					btnSkill: cc.Button,
					explan: cc.Label,
					nodeProgress: cc.Node,
					totalPower: cc.Label,
					progress: cc.ProgressBar,
					labProgress: cc.Label,
					labProgressval: cc.Label,
					labProName: cc.Label,
					barSpriteFrames: [cc.SpriteFrame]
				},
				start: function () { },
				onEnable: function () {
					this.unschedule(this.scheduleSkillCd),
						this.unschedule(this.scheduleUseSkill),
						this.refresh()
				},
				refresh: function () {
					this.refreshSkillState()
				},
				refreshSkillState: function () {
					var e = Math.floor((new Date).getTime() / 1e3),
						t = 1e4,
						a = 1e4,
						i = 0,
						n = 0,
						r = 0;
					if (UserData.getMineDataRef("Manager").Seam && UserData.getMineDataRef("Manager").Seam.assign && UserData.getMineDataRef("Manager").Seam.assign.list) for (var o = UserData.getMineDataRef("Manager").Seam.assign.list, s = 1; s < o.length; ++s) if (o[s] && 0 != o[s].TableIndex) {
						r++;
						var c = CfgMgr.Manager.getManagerDataById(o[s].TableIndex),
							l = 60 * c.skill_cd;
						c.skill_time;
						if (e < o[s].SkillDate) {
							var d = o[s].SkillDate - e;
							t = Math.min(d, t),
								i++
						} else if (e - o[s].SkillDate > l);
						else {
							var h = l + o[s].SkillDate - e;
							a = Math.min(h, a),
								n++
						}
					}
					this.btnSkill.interactable = !1,
						this.nodeProgress.active = !1,
						this.explan.node.active = !1,
						0 == r ? (this.explan.node.active = !0, this.explan.string = Language.getName("No manager available")) : i == r ? (this.dtTime = t, this.nodeProgress.active = !0, this.labProgress.string = Language.getName("Effect") + ":", this.labProgress.node.color = cc.color("#ffe25c"), this.labProgressval.string = this.dtTime.toString(), this.labProgressval.node.color = cc.color("#ffe25c"), this.progress.progress = this.dtTime / this.totalTime, this.progress.barSprite.spriteFrame = this.barSpriteFrames[0], this.labProName.node.color = cc.color("#FFAD00"), this.labProName.string = Language.getName("All shaft manager actived") + "!", this.schedule(this.scheduleUseSkill, 1)) : n == r ? (this.dtTime = a, this.nodeProgress.active = !0, this.labProgress.string = Language.getName("Cool Down") + ":", this.labProgress.node.color = cc.color("#ffffff"), this.labProgressval.string = this.dtTime.toString(), this.labProgressval.node.color = cc.color("#ffffff"), this.progress.progress = this.dtTime / this.totalTime, this.progress.barSprite.spriteFrame = this.barSpriteFrames[1], this.labProName.node.color = cc.color(104, 104, 104), this.labProName.string = Language.getName("All shaft manager cool down") + "!", this.schedule(this.scheduleSkillCd, 1)) : i + n == r ? (this.explan.node.active = !0, this.explan.string = Language.getName("No manager skills available")) : (this.explan.node.active = !0, this.explan.string = Language.getName("Active all shaft manager skill\n at once") + "!", this.btnSkill.interactable = !0)
				},
				scheduleSkillCd: function () {
					this.dtTime -= 1,
						this.dtTime = Math.max(0, this.dtTime),
						this.progress.progress = this.dtTime / this.totalTime,
						this.labProgressval.string = this.dtTime.toString(),
						this.dtTime <= 0 && (this.unschedule(this.scheduleSkillCd), this.refreshSkillState())
				},
				scheduleUseSkill: function (e) {
					this.dtTime -= 1,
						this.dtTime = Math.max(0, this.dtTime),
						this.progress.progress = this.dtTime / this.totalTime,
						this.labProgressval.string = this.dtTime.toString(),
						this.dtTime <= 0 && (this.unschedule(this.scheduleUseSkill), this.refreshSkillState())
				},
				btnUseSkill: function () {
					Music.play("SFX_Boost Manager");
					for (var e = Math.floor((new Date).getTime() / 1e3), t = UserData.getMineDataRef("Manager").Seam.assign.list, a = 0; a < t.length; ++a) if (t[a] && 0 != t[a].TableIndex) {
						var i = 60 * CfgMgr.Manager.getManagerDataById(t[a].TableIndex).skill_cd;
						e - t[a].SkillDate > i && this.publishEvent({
							type: "ManagerItemUseSkill",
							minerBranch: t[a].MinerBranch,
							minerId: t[a].MinerId
						})
					}
					this.refreshSkillState()
				},
				onManagerSkillStateChange: function (e) { }
			}),
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent"
	}],
	InfoStats: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "229ecrTXftOrZMq7+Kc/Djp", "InfoStats");
		var i = e("PrisonerManager");
		cc.Class({
			extends: e("EasyEvent").declareEvent("RequestSeamTotalPower", "RequestElevatorTotalPower", "RequestStoreTotalPower"),
			properties: {
				crashNum: cc.Label,
				totalSeam: cc.Label,
				totalStoreHouse: cc.Label,
				totalElevator: cc.Label,
				storeWarn: cc.Node,
				elevatorWarn: cc.Node,
				powerUpNode: cc.Node,
				noPowerUpNode: cc.Node,
				powerUpLabel: cc.Label,
				icons: [cc.Sprite],
				storeHouseNode: cc.Node,
				elevatorNode: cc.Node,
				boostOverViewPrefab: cc.Prefab,
				prefabDialogLevelUp: cc.Prefab
			},
			start: function () {
				var e = this;
				this.elevatorWarn.active = !1,
					this.storeWarn.active = !1,
					this.crashNum.string = IdleCashMgr.getIdleCash().toString() + "/s x " + ItemMgr.getActiveItemEffect() * ItemMgr.getAdEffect(),
					this.checkSeam(),
					this.checkElevator(),
					this.checkStoreHouse();
				cc.loader.loadResArray(["texture/dialogLevelUp/Common_2", "texture/dialogLevelUp/Common_3", "texture/dialogLevelUp/Common_1"], cc.SpriteFrame,
					function (t, a) {
						if (t) console.log("err:" + t);
						else for (var i = 0; i < a.length; ++i) try { e.icons[i].spriteFrame = a[i] } catch { console.log(11) }
					})
			},
			onHelpClicked: function () {
				this.publishEvent({
					type: "LevelUpdialog",
					minerBranch: this.minerBranch,
					minerId: 1
				})
			},
			onManagerSkillStateChange: function (t) {
				var a = e("PrisonerManager");
				t.minerBranch == a.EnumMinerBranch.Seam ? this.checkSeam() : t.minerBranch == a.EnumMinerBranch.Elevator ? this.checkElevator() : t.minerBranch == a.EnumMinerBranch.StoreHouse && this.checkStoreHouse()
			},
			onLevelUpSeam: function (e) {
				this.scheduleOnce(this.checkSeam, .1)
			},
			onLevelUpElevator: function (e) {
				this.checkElevator()
			},
			onLevelUpStoreHouse: function (e) {
				this.checkStoreHouse()
			},
			checkSeam: function () {
				var e = this;
				this.publishEvent({
					type: "RequestSeamTotalPower",
					notIgnoreManager: !1,
					callback: function (t) {
						e.seamTotalPower = t.totalPower,
							e.warningCallback()
					},
					target: this
				}),
					this.publishEvent({
						type: "RequestSeamTotalPower",
						notIgnoreManager: !0,
						callback: function (t) {
							e.totalSeam.string = t.totalPower.toString() + "/s"
						},
						target: this
					})
			},
			checkElevator: function () {
				var e = this;
				this.publishEvent({
					type: "RequestElevatorTotalPower",
					notIgnoreManager: !1,
					callback: function (t) {
						e.elevatorTotalPower = t.totalPower,
							e.warningCallback()
					},
					target: this
				}),
					this.publishEvent({
						type: "RequestElevatorTotalPower",
						notIgnoreManager: !0,
						callback: function (t) {
							e.totalElevator.string = t.totalPower.toString() + "/s",
								UserData.getMineDataRef("Manager").Elevator && UserData.getMineDataRef("Manager").Elevator.assign && UserData.getMineDataRef("Manager").Elevator.assign.list && UserData.getMineDataRef("Manager").Elevator.assign.list[1] && e.elevatorNode.getComponent("InfoStatsItem").setData(UserData.getMineDataRef("Manager").Elevator.assign.list[1])
						},
						target: this
					})
			},
			checkStoreHouse: function () {
				var e = this;
				this.publishEvent({
					type: "RequestStoreTotalPower",
					notIgnoreManager: !1,
					callback: function (t) {
						e.storeTotalPower = t.totalPower,
							e.warningCallback()
					},
					target: this
				}),
					this.publishEvent({
						type: "RequestStoreTotalPower",
						notIgnoreManager: !0,
						callback: function (t) {
							e.totalStoreHouse.string = t.totalPower.toString() + "/s",
								UserData.getMineDataRef("Manager").StoreHouse && UserData.getMineDataRef("Manager").StoreHouse.assign && UserData.getMineDataRef("Manager").StoreHouse.assign.list && UserData.getMineDataRef("Manager").StoreHouse.assign.list[1] && e.storeHouseNode.getComponent("InfoStatsItem").setData(UserData.getMineDataRef("Manager").StoreHouse.assign.list[1])
						},
						target: this
					})
			},
			warningCallback: function () {
				this.elevatorTotalPower && this.storeTotalPower && this.seamTotalPower && ((this.elevatorTotalPower.compare(this.storeTotalPower) < 0 ? this.elevatorTotalPower : this.storeTotalPower).compare(this.seamTotalPower.clone().mult(Constant.BOTTLE_NECK_RADIO)) < 0 ? (this.noPowerUpNode.active = !1, this.powerUpNode.active = !0, this.elevatorTotalPower.compare(this.storeTotalPower) < 0 ? (this.minerBranch = i.EnumMinerBranch.Elevator, this.elevatorWarn.active = !0, this.storeWarn.active = !1, this.powerUpLabel.string = Language.getName("The elevator can't keep up with the shaft.")) : (this.minerBranch = i.EnumMinerBranch.StoreHouse, this.storeWarn.active = !0, this.elevatorWarn.active = !1, this.powerUpLabel.string = "The warehouse can't keep up with the shaft.")) : (this.elevatorWarn.active = !1, this.storeWarn.active = !1, this.noPowerUpNode.active = !0, this.powerUpNode.active = !1))
			}
		}),
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent",
		PrisonerManager: "PrisonerManager"
	}],
	Intro: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "6a8a0jcWpxIkYKR5Wh0KUVH", "Intro"),
			cc.Class({
				extends: cc.Component,
				editor: {
					menu: "Scene/Intro"
				},
				properties: {
					labProgress: cc.Label,
					labVersion: cc.Label,
					progressLoading: cc.ProgressBar
				},
				onLoad: function () {
					Analysis.sendEvent({
						type: "on_login_page"
					}),
						this.labVersion.string = "version " + UserData.defaultData.Setting.Version
				},
				start: function () {
					var e = this;
					cc.debug.setDisplayStats(!1);
					var t = function () {
						Analysis.sendEvent({
							type: "EnterGameSuccess"
						}),
							UserData.read(null,
								function () {
									UserData.getFriendsData(),
										UserData.parseDataNByTemplate(),
										e._loadAssets().then(function () {
											e._loadScene()
										})
								},
								function () {
									Platform.showToast({
										title: "\u6570\u636e\u8bfb\u53d6\u5931\u8d25,\u5df2\u4fee\u6b63\u4e3a\u9ed8\u8ba4\u503c."
									}),
										e._loadAssets().then(function () {
											e._loadScene()
										})
								})
					};
					Platform.login({
						success: t,
						fail: t
					})
				},
				_loadAssets: function () {
					Localize.setLanguage("en");
					var e = new Promise(function (e, t) {
						ViewMgr.initRes(function () {
							e()
						})
					});
					return Promise.all([e])
				},
				_loadScene: function () {
					var e = this;
					this.loadingVal = 20,
						this.labProgress.string = this.loadingVal + "%",
						this.progressLoading.progress = this.loadingVal / 100,
						this.virtualLoadingVal = 20,
						this.schedule(function () {
							e.virtualLoadingVal += 1,
								e.virtualLoadingVal = Math.min(80, e.virtualLoadingVal),
								e.loadingVal = Math.max(e.virtualLoadingVal, e.loadingVal),
								e.labProgress.string = e.loadingVal + "%",
								e.progressLoading.progress = e.loadingVal / 100
						},
							.01),
						cc.director.preloadSceneWithProgress("Game",
							function (t) {
								e.loadingVal = Math.max(e.virtualLoadingVal, t, e.loadingVal),
									e.labProgress.string = e.loadingVal + "%",
									e.progressLoading.progress = e.loadingVal / 100
							},
							function () {
								e.node.runAction(cc.sequence(cc.fadeOut(.5), cc.callFunc(function () {
									cc.director.loadScene("Game")
								},
									e)))
							},
							function () {
								Platform.showToast({
									title: "\u4e25\u91cd\u9519\u8bef!\u573a\u666f\u52a0\u8f7d\u5931\u8d25."
								})
							})
				}
			}),
			cc._RF.pop()
	},
	{}],
	ItemMgr: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "c29d8pV/01Ksr4D0Dsj37R1", "ItemMgr"),
			window.ItemMgr = {
				addItem: function (e, t) {
					this._compatible(),
						6 != CfgApi.get("Item", e).type ? UserData.GameData.Item.inventory[e] ? UserData.GameData.Item.inventory[e] += t : UserData.GameData.Item.inventory[e] = t : cc.director.publishEvent({
							type: "AddSuperCash",
							superCashNum: t
						})
				},
				activeItem: function (t) {
					if (this._compatible(), 1 == t.type) {
						var a = Date.now(),
							i = !1;
						for (var n in UserData.GameData.Item.active) if (n == t.param1) {
							UserData.GameData.Item.active[n].endTime < a ? UserData.GameData.Item.active[n].endTime = a + 60 * t.param2 * 1e3 : UserData.GameData.Item.active[n].endTime += 60 * t.param2 * 1e3,
								i = !0;
							break
						}
						i || (UserData.GameData.Item.active[t.param1] = {
							type: 1,
							icon: t.icon,
							value: t.param1,
							endTime: a + 60 * t.param2 * 1e3
						})
					} else if (2 == t.type) {
						var r = CfgApi.get("AllMines"),
							o = new (e("NumberData"))(0),
							s = r[UserData.GameData.CurrentMine].init_currency_type;
						for (var c in r) r[c].init_currency_type == s && o.add(IdleCashMgr.getInlineCash(r[c].miner, !0));
						o.mult(60 * t.param2),
							o.mult(Math.pow(this.getAdEffect() * this.getActiveItemEffect(), .5)),
							cc.director.publishEvent({
								type: "AddCash",
								cashNum: o
							})
					}
					if (!UserData.GameData.Item.inventory[t.id]) throw err;
					UserData.GameData.Item.inventory[t.id] -= 1,
						0 == UserData.GameData.Item.inventory[t.id] && delete UserData.GameData.Item.inventory[t.id]
				},
				getActiveItemEffect: function () {
					this._compatible();
					var e = 0,
						t = Date.now();
					for (var a in UserData.GameData.Item.active) UserData.GameData.Item.active[a].endTime > t && (e += UserData.GameData.Item.active[a].value);
					return 0 == e ? 1 : e
				},
				getActiveItemValueArr: function () {
					this._compatible();
					var e = [],
						t = Date.now();
					for (var a in UserData.GameData.Item.active) UserData.GameData.Item.active[a].endTime > t && e.push(UserData.GameData.Item.active[a].value);
					return e
				},
				activeAd: function (e) {
					this._compatible(),
						e = e || UserData.GameData.CurrentMine;
					var t = Date.now();
					UserData.GameData.Item.ad[e] || (UserData.GameData.Item.ad[e] = {
						endTime: 0,
						value: 1
					}),
						UserData.GameData.Item.ad[e].endTime > t ? (UserData.GameData.Item.ad[e].endTime += 144e5, UserData.GameData.Item.ad[e].endTime > t + 864e5 && (UserData.GameData.Item.ad[e].endTime = t + 864e5)) : UserData.GameData.Item.ad[e].endTime = t + 144e5,
						UserData.GameData.Item.ad[e].value = 2,
						Platform.showToast({
							title: "Boost successed!"
						})
				},
				getAdEffect: function (e) {
					this._compatible(),
						e = e || UserData.GameData.CurrentMine;
					var t = Date.now();
					return UserData.GameData.Item.ad[e].endTime > t ? UserData.GameData.Item.ad[e].value : 1
				},
				getAdEffectEndTime: function (e) {
					return this._compatible(),
						e = e || UserData.GameData.CurrentMine,
						UserData.GameData.Item.ad[e] || (UserData.GameData.Item.ad[e] = {
							endTime: 0,
							value: 1
						}),
						UserData.GameData.Item.ad[e].endTime
				},
				getEffectMaxTime: function () {
					this._compatible();
					var e = Date.now(),
						t = 0;
					for (var a in UserData.GameData.Item.active) t = Math.max(UserData.GameData.Item.active[a].endTime, t);
					return (t = Math.max(t, UserData.GameData.Item.ad.endTime)) > e ? t - e : 0
				},
				_compatible: function () {
					UserData.GameData.Item.ad.endTime && (UserData.GameData.Item.ad[1] || (UserData.GameData.Item.ad[1] = {
						endTime: 0,
						value: 1
					}), UserData.GameData.Item.ad[1].endTime = UserData.GameData.Item.ad.endTime, UserData.GameData.Item.ad[1].value = UserData.GameData.Item.ad.value, UserData.GameData.Item.ad.endTime = null, UserData.GameData.Item.ad.value = null)
				}
			},
			cc._RF.pop()
	},
	{
		NumberData: "NumberData"
	}],
	ListViewItem: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "d0151vpk4JDN6BAzRRgyHhx", "ListViewItem"),
			cc.Class({
				extends: cc.Component,
				properties: {
					updateUIEvents: {
						default:
							[],
						type: cc.Component.EventHandler,
						tooltip: !1
					},
					itemId: 0,
					dataId: 0
				},
				start: function () { },
				setDelegate: function (e) {
					this.delegate = e
				},
				updateItem: function (e, t, a) {
					this.itemId = e,
						this.dataId = t,
						a && cc.Component.EventHandler.emitEvents(this.updateUIEvents, t, a)
				}
			}),
			cc._RF.pop()
	},
	{}],
	ListView: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "d61016uHZ5Hy6orbbnld5Pa", "ListView");
		var i = cc.Enum({
			NODE: 0,
			PREFAB: 1
		}),
			n = cc.Enum({
				TOP_TO_BOTTOM: 0,
				LEFT_TO_RIGHT: 1,
				BOTTOM_TO_TOP: 2,
				RIGHT_TO_LEFT: 3
			});
		cc.Class({
			extends: cc.Component,
			editor: {
				menu: "Extensions/ListView",
				requireComponent: cc.ScrollView,
				executeInEditMode: !0
			},
			properties: {
				itemType: {
					type: i,
					default:
						i.NODE,
					tooltip: !1
				},
				itemTemplateNode: {
					type: cc.Node,
					default:
						null,
					visible: function () {
						return this.itemType == i.NODE
					},
					tooltip: !1
				},
				itemTemplatePrefab: {
					type: cc.Prefab,
					default:
						null,
					visible: function () {
						return this.itemType == i.PREFAB
					},
					tooltip: !1
				},
				scrollView: {
					type: cc.ScrollView,
					default:
						null,
					visible: !1
				},
				dir: {
					type: n,
					default:
						n.TOP_TO_BOTTOM,
					notify: function () {
						this._RestContent()
					},
					tooltip: !1
				},
				spawnCount: {
					type: cc.Integer,
					default:
						0,
					tooltip: !1
				},
				totalCount: {
					type: cc.Integer,
					default:
						0,
					visible: !1
				},
				spacing: {
					type: cc.Integer,
					default:
						0,
					tooltip: !1
				},
				bufferZone: {
					type: cc.Integer,
					default:
						0,
					tooltip: !1
				},
				updateInterval: {
					type: cc.Float,
					default:
						.2,
					tooltip: !1
				},
				initfinish: !1
			},
			_RestContent: function () {
				var e = this.node.getComponent(cc.ScrollView);
				if (e && e.content) {
					var t = e.node,
						a = e.content;
					switch (this.dir) {
						case n.TOP_TO_BOTTOM:
							a.anchorX = .5,
								a.anchorY = 1,
								a.x = 0,
								a.y = t.height / 2 - 10,
								e.vertical = !0,
								e.horizontal = !1;
							break;
						case n.LEFT_TO_RIGHT:
							a.anchorX = 0,
								a.anchorY = .5,
								a.y = 0,
								a.x = -t.width / 2 + 10,
								e.vertical = !1,
								e.horizontal = !0;
							break;
						case n.RIGHT_TO_LEFT:
							a.anchorX = 1,
								a.anchorY = .5,
								a.y = 0,
								a.x = t.width / 2 - 10,
								e.vertical = !1,
								e.horizontal = !0;
							break;
						case n.BOTTOM_TO_TOP:
							a.anchorX = .5,
								a.anchorY = 0,
								a.x = 0,
								a.y = -t.height / 2 + 10,
								e.vertical = !0,
								e.horizontal = !1
					}
				}
			},
			onLoad: function () { },
			start: function () {
				this.initfinish || this.initialize()
			},
			initialize: function () {
				if (this.initItemTemplate(), this.itemTemplate) {
					switch (this.scrollView = this.node.getComponent(cc.ScrollView), this.content = this.scrollView.content, this.data = [], this.items = [], this.updateTimer = 0, this.dir) {
						case n.TOP_TO_BOTTOM:
							this.lastContentPosY = 0,
								this.content.anchorX = .5,
								this.content.anchorY = 1,
								this.content.x = 0,
								this.content.y = this.scrollView.node.height / 2 - 10,
								this.content.height = this.totalCount * (this.itemTemplate.height + this.spacing) + this.spacing;
							for (var e = 0; e < this.spawnCount; ++e) {
								var t = cc.instantiate(this.itemTemplate);
								this.content.addChild(t),
									t.getComponent("ListViewItem").setDelegate(this),
									t.setPosition(0, -t.height * (.5 + e) - this.spacing * (e + 1)),
									t.active = !1,
									this.items.push(t)
							}
							break;
						case n.LEFT_TO_RIGHT:
							this.lastContentPosX = 0,
								this.content.anchorX = 0,
								this.content.anchorY = .5,
								this.content.y = 0,
								this.content.x = -this.scrollView.node.width / 2 + 10,
								this.content.width = this.totalCount * (this.itemTemplate.width + this.spacing) + this.spacing;
							for (var a = 0; a < this.spawnCount; ++a) {
								var i = cc.instantiate(this.itemTemplate);
								this.content.addChild(i),
									i.getComponent("ListViewItem").setDelegate(this),
									i.setPosition(i.width * (.5 + a) + this.spacing * (a + 1), 0),
									i.active = !1,
									this.items.push(i)
							}
							break;
						case n.RIGHT_TO_LEFT:
							this.lastContentPosY = 0,
								this.content.anchorX = 1,
								this.content.anchorY = .5,
								this.content.y = 0,
								this.content.x = this.scrollView.node.width / 2 - 10;
							for (var r = 0; r < this.spawnCount; ++r) {
								var o = cc.instantiate(this.itemTemplate);
								this.content.addChild(o),
									o.getComponent("ListViewItem").setDelegate(this),
									o.setPosition(- o.width * (.5 + r) - this.spacing * (r + 1), 0),
									o.active = !1,
									this.items.push(o)
							}
							break;
						case n.BOTTOM_TO_TOP:
							this.lastContentPosX = 0,
								this.content.anchorX = .5,
								this.content.anchorY = 0,
								this.content.x = 0,
								this.content.y = -this.scrollView.node.height / 2 + 10;
							for (var s = 0; s < this.spawnCount; ++s) {
								var c = cc.instantiate(this.itemTemplate);
								this.content.addChild(c),
									c.getComponent("ListViewItem").setDelegate(this),
									c.setPosition(0, c.height * (.5 + s) + this.spacing * (s + 1)),
									c.active = !1,
									this.items.push(c)
							}
					}
					this.initfinish = !0
				}
			},
			initItemTemplate: function () {
				this.itemType == i.NODE ? this.itemTemplateNode && (this.itemTemplate = this.itemTemplateNode) : this.itemTemplatePrefab && (this.itemTemplate = this.itemTemplatePrefab, this.itemTemplate.height = this.itemTemplate.data.height, this.itemTemplate.width = this.itemTemplate.data.width)
			},
			update: function (e) {
				if (this.initfinish && (this.updateTimer += e, !(this.updateTimer < this.updateInterval))) {
					this.updateTimer = 0;
					var t = this.items,
						a = this.bufferZone,
						i = 0;
					switch (this.dir) {
						case n.TOP_TO_BOTTOM:
							var r = this.scrollView.content.y < this.lastContentPosY;
							i = (this.itemTemplate.height + this.spacing) * t.length;
							for (var o = 0; o < t.length; ++o) {
								var s = this.getPositionInView(t[o]);
								if (r) {
									if (s.y < -this.scrollView.node.height / 2 - a && t[o].y + i < 0) {
										t[o].y = t[o].y + i;
										var c = t[o].getComponent("ListViewItem"),
											l = c.dataId - t.length;
										c.updateItem(o, l, this.data[l])
									}
								} else if (s.y > this.scrollView.node.height / 2 + a && t[o].y - i > -this.content.height) {
									t[o].y = t[o].y - i;
									var d = t[o].getComponent("ListViewItem"),
										h = d.dataId + t.length;
									d.updateItem(o, h, this.data[h])
								}
							}
							this.lastContentPosY = this.scrollView.content.y;
							break;
						case n.LEFT_TO_RIGHT:
							var u = this.scrollView.content.x < this.lastContentPosX;
							i = (this.itemTemplate.width + this.spacing) * t.length;
							for (var m = 0; m < t.length; ++m) {
								var g = this.getPositionInView(t[m]);
								if (u) {
									if (g.x < -this.scrollView.node.width / 2 - a && t[m].x + i < this.content.width) {
										t[m].x = t[m].x + i;
										var p = t[m].getComponent("ListViewItem"),
											f = p.dataId + t.length;
										p.updateItem(m, f, this.data[f])
									}
								} else if (g.x > this.scrollView.node.width / 2 + a && t[m].x - i > 0) {
									t[m].x = t[m].x - i;
									var v = t[m].getComponent("ListViewItem"),
										_ = v.dataId - t.length;
									v.updateItem(m, _, this.data[_])
								}
							}
							this.lastContentPosX = this.scrollView.content.x;
							break;
						case n.RIGHT_TO_LEFT:
							var y = this.scrollView.content.x > this.lastContentPosX;
							i = (this.itemTemplate.width + this.spacing) * t.length;
							for (var b = 0; b < t.length; ++b) {
								var S = this.getPositionInView(t[b]);
								if (y) {
									if (S.x > this.scrollView.node.width / 2 + a && t[b].x - i > -this.content.width) {
										t[b].x = t[b].x - i;
										var C = t[b].getComponent("ListViewItem"),
											D = C.dataId - t.length;
										C.updateItem(b, D, this.data[D])
									}
								} else if (S.x < -this.scrollView.node.width / 2 - a && t[b].x + i < 0) {
									t[b].x = t[b].x + i;
									var w = t[b].getComponent("ListViewItem"),
										A = w.dataId + t.length;
									w.updateItem(b, A, this.data[A])
								}
							}
							this.lastContentPosX = this.scrollView.content.x;
							break;
						case n.BOTTOM_TO_TOP:
							var M = this.scrollView.content.y > this.lastContentPosY;
							i = (this.itemTemplate.height + this.spacing) * t.length;
							for (var E = 0; E < t.length; ++E) {
								var k = this.getPositionInView(t[E]);
								if (M) {
									if (k.y > this.scrollView.node.height / 2 + a && t[E].y - i > 0) {
										t[E].y = t[E].y - i;
										var I = t[E].getComponent("ListViewItem"),
											T = I.dataId + t.length;
										I.updateItem(E, T, this.data[T])
									}
								} else if (k.y < -this.scrollView.node.height / 2 - a && t[E].y + i < this.content.height) {
									t[E].y = t[E].y + i;
									var R = t[E].getComponent("ListViewItem"),
										N = R.dataId - t.length;
									R.updateItem(E, N, this.data[N])
								}
							}
							this.lastContentPosY = this.scrollView.content.y
					}
				}
			},
			setData: function (e) {
				this.initfinish || this.initialize(),
					this.data = e;
				for (var t = 0; t < this.spawnCount; ++t) {
					var a = this.items[t].getComponent("ListViewItem");
					t < this.data.length ? (a.updateItem(t, t, this.data[t]), this.items[t].active = !0) : (a.updateItem(t, t), this.items[t].active = !1)
				}
				this.dir == n.TOP_TO_BOTTOM || this.dir == n.BOTTOM_TO_TOP ? this.content.height = this.data.length * (this.itemTemplate.height + this.spacing) + this.spacing : this.content.width = this.data.length * (this.itemTemplate.width + this.spacing) + this.spacing,
					this.totalCount = this.data.length
			},
			setDataUntimely: function (e, t) {
				this.initfinish || this.initialize(),
					this.data = t;
				for (var a = 0; a < this.spawnCount; ++a) this.scheduleOnce(function (e) {
					var t = this.items[e].getComponent("ListViewItem");
					e < this.data.length ? (t.updateItem(e, e, this.data[e]), this.items[e].active = !0) : (t.updateItem(e, e), this.items[e].active = !1)
				}.bind(this, a), e * a);
				this.dir == n.TOP_TO_BOTTOM || this.dir == n.BOTTOM_TO_TOP ? this.content.height = this.data.length * (this.itemTemplate.height + this.spacing) + this.spacing : this.content.width = this.data.length * (this.itemTemplate.width + this.spacing) + this.spacing,
					this.totalCount = this.data.length
			},
			refreshData: function (e) {
				var t = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
				if (this.initfinish || this.initialize(), t) {
					switch (this.dir) {
						case n.TOP_TO_BOTTOM:
							for (var a = 0; a < this.spawnCount; ++a) this.items[a].setPosition(0, -this.items[a].height * (.5 + a) - this.spacing * (a + 1)),
								this.items[a].active = !1;
							break;
						case n.LEFT_TO_RIGHT:
							for (var i = 0; i < this.spawnCount; ++i) this.items[i].setPosition(this.items[i].width * (.5 + i) + this.spacing * (i + 1), 0),
								this.items[i].active = !1;
							break;
						case n.RIGHT_TO_LEFT:
							for (var r = 0; r < this.spawnCount; ++r) this.items[r].setPosition(- this.items[r].width * (.5 + r) - this.spacing * (r + 1), 0),
								this.items[r].active = !1;
							break;
						case n.BOTTOM_TO_TOP:
							for (var o = 0; o < this.spawnCount; ++o) this.items[o].setPosition(0, this.items[o].height * (.5 + o) + this.spacing * (o + 1)),
								this.items[o].active = !1
					}
					this.setData(e),
						this.scrolltoFrist()
				} else {
					this.data = e;
					for (var s = 0; s < this.spawnCount; ++s) {
						var c = this.items[s].getComponent("ListViewItem");
						c.dataId < this.data.length ? (c.updateItem(c.itemId, c.dataId, this.data[c.dataId]), this.items[s].active = !0) : this.items[s].active = !1
					}
					this.dir == n.TOP_TO_BOTTOM || this.dir == n.BOTTOM_TO_TOP ? this.content.height = this.data.length * (this.itemTemplate.height + this.spacing) + this.spacing : this.content.width = this.data.length * (this.itemTemplate.width + this.spacing) + this.spacing,
						this.totalCount = this.data.length
				}
			},
			getPositionInView: function (e) {
				var t = e.parent.convertToWorldSpaceAR(e.position);
				return this.scrollView.node.convertToNodeSpaceAR(t)
			},
			scrolltoLast: function () {
				var e = this.scrollView.content;
				switch (this.dir) {
					case n.TOP_TO_BOTTOM:
						if (e.height <= this.scrollView.node.height) return;
						this.scrollView.scrollToBottom();
						break;
					case n.LEFT_TO_RIGHT:
						if (e.width <= this.scrollView.node.width) return;
						this.scrollView.scrollToRight();
						break;
					case n.RIGHT_TO_LEFT:
						if (e.width <= this.scrollView.node.width) return;
						this.scrollView.scrollToLeft();
						break;
					case n.BOTTOM_TO_TOP:
						if (e.height <= this.scrollView.node.height) return;
						this.scrollView.scrollToTop()
				}
			},
			scrolltoFrist: function () {
				var e = this.scrollView.content;
				switch (this.dir) {
					case n.TOP_TO_BOTTOM:
						if (e.height <= this.scrollView.node.height) return;
						this.scrollView.scrollToTop();
						break;
					case n.LEFT_TO_RIGHT:
						if (e.width <= this.scrollView.node.width) return;
						this.scrollView.scrollToLeft();
						break;
					case n.RIGHT_TO_LEFT:
						if (e.width <= this.scrollView.node.width) return;
						this.scrollView.scrollToRight();
						break;
					case n.BOTTOM_TO_TOP:
						if (e.height <= this.scrollView.node.height) return;
						this.scrollView.scrollToBottom()
				}
			},
			scrolltoIndex: function (e) {
				var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : .5;
				if (0 != this.items.length) {
					var a = this.scrollView.content;
					switch (this.dir) {
						case n.TOP_TO_BOTTOM:
							if (a.height <= this.scrollView.node.height) return;
							var i = this.itemTemplate.height * e + this.spacing * e;
							this.scrollView.scrollToOffset(cc.v2(0, i), t);
							break;
						case n.LEFT_TO_RIGHT:
							if (a.width <= this.scrollView.node.width) return;
							var r = -this.itemTemplate.width * e;
							this.scrollView.scrollToOffset(cc.v2(0, r), t);
							break;
						case n.RIGHT_TO_LEFT:
							if (a.width <= this.scrollView.node.width) return;
							var o = this.itemTemplate.width * e;
							this.scrollView.scrollToOffset(cc.v2(0, o), t);
							break;
						case n.BOTTOM_TO_TOP:
							if (a.height <= this.scrollView.node.height) return;
							var s = -this.itemTemplate.height * (e - 1);
							this.scrollView.scrollToOffset(cc.v2(0, s), t)
					}
				}
			}
		}),
			cc._RF.pop()
	},
	{}],
	LocalizeLabel: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "589bbfrfH9My4X2/3bmoCAF", "LocalizeLabel"),
			cc.Class({
				extends: e("EasyEvent"),
				editor: {
					menu: "Localize/LocalizeLabel",
					requireComponent: cc.Label,
					executeInEditMode: !0
				},
				properties: {
					_key: "",
					key: {
						get: function () {
							return this._key
						},
						set: function (e) {
							this._key = e,
								this._updateLabel()
						}
					}
				},
				onLoad: function () {
					this.label = this.node.getComponent(cc.Label),
						this._updateLabel()
				},
				_updateLabel: function () {
					var e = Localize.getString(this._key);
					this.label.string = e || this._key
				},
				onLanguageChanged: function () {
					this._updateLabel()
				}
			}),
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent"
	}],
	LocalizeSprite: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "cc933kJezxCP5kXrgRemx5S", "LocalizeSprite");
		var i = cc.Class({
			extends: e("EasyEvent"),
			editor: {
				menu: "Localize/LocalizeSprite",
				requireComponent: cc.Sprite,
				executeInEditMode: !0
			},
			properties: {
				_key: "",
				key: {
					get: function () {
						return this._key
					},
					set: function (e) {
						this._key = e
					}
				}
			},
			onLoad: function () {
				this.sprite = this.node.getComponent(cc.Sprite),
					this._updateSprite()
			},
			_updateSprite: function () {
				var e = this,
					t = Localize.getString(this._key); (this.sprite.spriteFrame = null, t) && cc.loader.loadRes(t, cc.SpriteFrame,
						function (t, a) {
							t ? cc.error("LocalizeSprite \u52a0\u8f7d\u56fe\u7247\u5f02\u5e38,key:", e._key, t) : e.sprite.spriteFrame = a
						})
			},
			onLanguageChanged: function () {
				this._updateSprite()
			}
		});
		t.exports = i,
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent"
	}],
	Localize: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "4da7aFUoAtIZpz2l7squDZq", "Localize"),
			cc.Class({
				properties: {
					isLoaded: !1,
					language: "en",
					data: null
				},
				init: function () {
					this.data = e("Cfg_String").data,
						this.isLoaded = !0,
						console.log("[Localize]\u672c\u5730\u5316\u6a21\u5757\u521d\u59cb\u5316\u5b8c\u6210")
				},
				setLanguage: function (e) {
					this.language = e,
						console.log("[Localize\u5df2\u914d\u7f6e\u8bed\u8a00" + this.language + "]")
				},
				getString: function (e) {
					return this.isLoaded ? this.data[e] ? this.data[e][this.language] : (cc.warn("[Localize] key:" + e + "\u4e0d\u5b58\u5728"), null) : (cc.warn("[Localize]\u672a\u521d\u59cb\u5316"), null)
				}
			}),
			cc._RF.pop()
	},
	{
		Cfg_String: "Cfg_String"
	}],
	MD5: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "f796d6lR7FN54nnAcZ3TGVe", "MD5");
		var i = {
			hexcase: 0,
			b64pad: "",
			chrsz: 8,
			hex_md5: function (e) {
				return this.binl2hex(this.core_md5(this.str2binl(e), e.length * this.chrsz))
			},
			b64_md5: function (e) {
				return this.binl2b64(this.core_md5(this.str2binl(e), e.length * this.chrsz))
			},
			str_md5: function (e) {
				return this.binl2str(this.core_md5(this.str2binl(e), e.length * this.chrsz))
			},
			hex_hmac_md5: function (e, t) {
				return this.binl2hex(this.core_hmac_md5(e, t))
			},
			b64_hmac_md5: function (e, t) {
				return this.binl2b64(this.core_hmac_md5(e, t))
			},
			str_hmac_md5: function (e, t) {
				return this.binl2str(this.core_hmac_md5(e, t))
			},
			md5_vm_test: function () {
				return "900150983cd24fb0d6963f7d28e17f72" == this.hex_md5("abc")
			},
			core_md5: function (e, t) {
				e[t >> 5] |= 128 << t % 32,
					e[14 + (t + 64 >>> 9 << 4)] = t;
				for (var a = 1732584193,
					i = -271733879,
					n = -1732584194,
					r = 271733878,
					o = 0; o < e.length; o += 16) {
					var s = a,
						c = i,
						l = n,
						d = r;
					a = this.md5_ff(a, i, n, r, e[o + 0], 7, -680876936),
						r = this.md5_ff(r, a, i, n, e[o + 1], 12, -389564586),
						n = this.md5_ff(n, r, a, i, e[o + 2], 17, 606105819),
						i = this.md5_ff(i, n, r, a, e[o + 3], 22, -1044525330),
						a = this.md5_ff(a, i, n, r, e[o + 4], 7, -176418897),
						r = this.md5_ff(r, a, i, n, e[o + 5], 12, 1200080426),
						n = this.md5_ff(n, r, a, i, e[o + 6], 17, -1473231341),
						i = this.md5_ff(i, n, r, a, e[o + 7], 22, -45705983),
						a = this.md5_ff(a, i, n, r, e[o + 8], 7, 1770035416),
						r = this.md5_ff(r, a, i, n, e[o + 9], 12, -1958414417),
						n = this.md5_ff(n, r, a, i, e[o + 10], 17, -42063),
						i = this.md5_ff(i, n, r, a, e[o + 11], 22, -1990404162),
						a = this.md5_ff(a, i, n, r, e[o + 12], 7, 1804603682),
						r = this.md5_ff(r, a, i, n, e[o + 13], 12, -40341101),
						n = this.md5_ff(n, r, a, i, e[o + 14], 17, -1502002290),
						i = this.md5_ff(i, n, r, a, e[o + 15], 22, 1236535329),
						a = this.md5_gg(a, i, n, r, e[o + 1], 5, -165796510),
						r = this.md5_gg(r, a, i, n, e[o + 6], 9, -1069501632),
						n = this.md5_gg(n, r, a, i, e[o + 11], 14, 643717713),
						i = this.md5_gg(i, n, r, a, e[o + 0], 20, -373897302),
						a = this.md5_gg(a, i, n, r, e[o + 5], 5, -701558691),
						r = this.md5_gg(r, a, i, n, e[o + 10], 9, 38016083),
						n = this.md5_gg(n, r, a, i, e[o + 15], 14, -660478335),
						i = this.md5_gg(i, n, r, a, e[o + 4], 20, -405537848),
						a = this.md5_gg(a, i, n, r, e[o + 9], 5, 568446438),
						r = this.md5_gg(r, a, i, n, e[o + 14], 9, -1019803690),
						n = this.md5_gg(n, r, a, i, e[o + 3], 14, -187363961),
						i = this.md5_gg(i, n, r, a, e[o + 8], 20, 1163531501),
						a = this.md5_gg(a, i, n, r, e[o + 13], 5, -1444681467),
						r = this.md5_gg(r, a, i, n, e[o + 2], 9, -51403784),
						n = this.md5_gg(n, r, a, i, e[o + 7], 14, 1735328473),
						i = this.md5_gg(i, n, r, a, e[o + 12], 20, -1926607734),
						a = this.md5_hh(a, i, n, r, e[o + 5], 4, -378558),
						r = this.md5_hh(r, a, i, n, e[o + 8], 11, -2022574463),
						n = this.md5_hh(n, r, a, i, e[o + 11], 16, 1839030562),
						i = this.md5_hh(i, n, r, a, e[o + 14], 23, -35309556),
						a = this.md5_hh(a, i, n, r, e[o + 1], 4, -1530992060),
						r = this.md5_hh(r, a, i, n, e[o + 4], 11, 1272893353),
						n = this.md5_hh(n, r, a, i, e[o + 7], 16, -155497632),
						i = this.md5_hh(i, n, r, a, e[o + 10], 23, -1094730640),
						a = this.md5_hh(a, i, n, r, e[o + 13], 4, 681279174),
						r = this.md5_hh(r, a, i, n, e[o + 0], 11, -358537222),
						n = this.md5_hh(n, r, a, i, e[o + 3], 16, -722521979),
						i = this.md5_hh(i, n, r, a, e[o + 6], 23, 76029189),
						a = this.md5_hh(a, i, n, r, e[o + 9], 4, -640364487),
						r = this.md5_hh(r, a, i, n, e[o + 12], 11, -421815835),
						n = this.md5_hh(n, r, a, i, e[o + 15], 16, 530742520),
						i = this.md5_hh(i, n, r, a, e[o + 2], 23, -995338651),
						a = this.md5_ii(a, i, n, r, e[o + 0], 6, -198630844),
						r = this.md5_ii(r, a, i, n, e[o + 7], 10, 1126891415),
						n = this.md5_ii(n, r, a, i, e[o + 14], 15, -1416354905),
						i = this.md5_ii(i, n, r, a, e[o + 5], 21, -57434055),
						a = this.md5_ii(a, i, n, r, e[o + 12], 6, 1700485571),
						r = this.md5_ii(r, a, i, n, e[o + 3], 10, -1894986606),
						n = this.md5_ii(n, r, a, i, e[o + 10], 15, -1051523),
						i = this.md5_ii(i, n, r, a, e[o + 1], 21, -2054922799),
						a = this.md5_ii(a, i, n, r, e[o + 8], 6, 1873313359),
						r = this.md5_ii(r, a, i, n, e[o + 15], 10, -30611744),
						n = this.md5_ii(n, r, a, i, e[o + 6], 15, -1560198380),
						i = this.md5_ii(i, n, r, a, e[o + 13], 21, 1309151649),
						a = this.md5_ii(a, i, n, r, e[o + 4], 6, -145523070),
						r = this.md5_ii(r, a, i, n, e[o + 11], 10, -1120210379),
						n = this.md5_ii(n, r, a, i, e[o + 2], 15, 718787259),
						i = this.md5_ii(i, n, r, a, e[o + 9], 21, -343485551),
						a = this.safe_add(a, s),
						i = this.safe_add(i, c),
						n = this.safe_add(n, l),
						r = this.safe_add(r, d)
				}
				return Array(a, i, n, r)
			},
			md5_cmn: function (e, t, a, i, n, r) {
				return this.safe_add(this.bit_rol(this.safe_add(this.safe_add(t, e), this.safe_add(i, r)), n), a)
			},
			md5_ff: function (e, t, a, i, n, r, o) {
				return this.md5_cmn(t & a | ~t & i, e, t, n, r, o)
			},
			md5_gg: function (e, t, a, i, n, r, o) {
				return this.md5_cmn(t & i | a & ~i, e, t, n, r, o)
			},
			md5_hh: function (e, t, a, i, n, r, o) {
				return this.md5_cmn(t ^ a ^ i, e, t, n, r, o)
			},
			md5_ii: function (e, t, a, i, n, r, o) {
				return this.md5_cmn(a ^ (t | ~i), e, t, n, r, o)
			},
			core_hmac_md5: function (e, t) {
				var a = this.str2binl(e);
				a.length > 16 && (a = this.core_md5(a, e.length * this.chrsz));
				for (var i = Array(16), n = Array(16), r = 0; r < 16; r++) i[r] = 909522486 ^ a[r],
					n[r] = 1549556828 ^ a[r];
				var o = this.core_md5(i.concat(this.str2binl(t)), 512 + t.length * this.chrsz);
				return this.core_md5(n.concat(o), 640)
			},
			safe_add: function (e, t) {
				var a = (65535 & e) + (65535 & t);
				return (e >> 16) + (t >> 16) + (a >> 16) << 16 | 65535 & a
			},
			bit_rol: function (e, t) {
				return e << t | e >>> 32 - t
			},
			str2binl: function (e) {
				for (var t = Array(), a = (1 << this.chrsz) - 1, i = 0; i < e.length * this.chrsz; i += this.chrsz) t[i >> 5] |= (e.charCodeAt(i / this.chrsz) & a) << i % 32;
				return t
			},
			binl2str: function (e) {
				for (var t = "",
					a = (1 << this.chrsz) - 1, i = 0; i < 32 * e.length; i += this.chrsz) t += String.fromCharCode(e[i >> 5] >>> i % 32 & a);
				return t
			},
			binl2hex: function (e) {
				for (var t = this.hexcase ? "0123456789ABCDEF" : "0123456789abcdef", a = "", i = 0; i < 4 * e.length; i++) a += t.charAt(e[i >> 2] >> i % 4 * 8 + 4 & 15) + t.charAt(e[i >> 2] >> i % 4 * 8 & 15);
				return a
			},
			binl2b64: function (e) {
				for (var t = "",
					a = 0; a < 4 * e.length; a += 3) for (var i = (e[a >> 2] >> a % 4 * 8 & 255) << 16 | (e[a + 1 >> 2] >> (a + 1) % 4 * 8 & 255) << 8 | e[a + 2 >> 2] >> (a + 2) % 4 * 8 & 255, n = 0; n < 4; n++) 8 * a + 6 * n > 32 * e.length ? t += this.b64pad : t += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(i >> 6 * (3 - n) & 63);
				return t
			}
		};
		t.exports = i,
			cc._RF.pop()
	},
	{}],
	ManagerItem: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "a1137hW3vpAs74/s+q1ycpd", "ManagerItem"),
			cc.Class({
				extends: e("EasyEvent").declareEvent("ManagerAssign", "ManagerItemUseSkill", "AddCash", "SellManager", "ShowAddCoinAct"),
				properties: {
					sprManagerIcon: {
						type: cc.Sprite,
						default:
							null
					},
					sprSkillIcon: {
						type: cc.Sprite,
						default:
							null
					},
					labQuality: {
						type: cc.Label,
						default:
							null
					},
					labPropertyName1: {
						type: cc.Label,
						default:
							null
					},
					labPropertyName2: {
						type: cc.Label,
						default:
							null
					},
					labPropertyDetail1: {
						type: cc.Label,
						default:
							null
					},
					labPropertyDetail2: {
						type: cc.Label,
						default:
							null
					},
					labAssign: {
						type: cc.Label,
						default:
							null
					},
					btnSkill: {
						type: cc.Button,
						default:
							null
					},
					nodeBtnAssign: {
						type: cc.Node,
						default:
							null
					},
					nodeBtnSell: {
						type: cc.Node,
						default:
							null
					},
					sprHeadBg: cc.Sprite,
					nodeDetail: cc.Node,
					nodeProgress: cc.Node,
					progress: cc.ProgressBar,
					labProgress: cc.Label,
					labProgressval: cc.Label,
					labName: cc.Label,
					labProName: cc.Label,
					spriteFrameChoose: cc.SpriteFrame,
					spriteFrameCd: cc.SpriteFrame,
					spriteFrameUse: cc.SpriteFrame
				},
				start: function () { },
				refreshData: function (e, t) {
					var a = this;
					this.index = e,
						this.managerData = t,
						this.scheduleOnce(function () {
							t.showAni && (a.node.runAction(cc.sequence(cc.scaleTo(.1, 1.08), cc.scaleTo(.1, 1))), t.showAni = !1)
						},
							.1),
						this.refreshCell()
				},
				refreshCell: function () {
					var e = this;
					this.tbData = CfgMgr.Manager.getManagerDataById(this.managerData.TableIndex),
						this.labName.string = this.managerData.Name,
						this.labQuality.string = CfgMgr.Manager.getQualityStr(this.tbData.quality),
						this.labQuality.node.color = CfgMgr.Manager.getQualityLabelColor(this.tbData.quality),
						this.labPropertyName1.string = Language.getName("Effect") + ":",
						this.labPropertyDetail1.string = this.tbData.skill_time + "m",
						this.labPropertyName2.string = CfgMgr.Manager.getPropertyName(this.tbData.skill_type, this.tbData.skill_param),
						this.labPropertyDetail2.string = "",
						this.labProName.string = CfgMgr.Manager.getPropertyName(this.tbData.skill_type, this.tbData.skill_param);
					var t = this.btnSkill.node.getChildByName("Gameicon01").getComponent(cc.Sprite);
					cc.loader.loadRes(CfgMgr.Manager.getPropertyIcon(this.tbData.skill_type), cc.SpriteFrame,
						function (e, a) {
							e ? console.log("\u52a0\u8f7d\u7ba1\u7406\u5458icon\u5931\u8d25" + e) : t.spriteFrame = a
						}),
						cc.loader.loadRes("texture/managerEffectIcon/HeroBox0" + (this.tbData.quality - 1), cc.SpriteFrame,
							function (t, a) {
								// t ? cc.warn("\u52a0\u8f7d\u7ba1\u7406\u5458head\u5931\u8d25" + t) : (console.log("quality:" + (e.tbData.quality - 1)), e.sprHeadBg.spriteFrame = a)
							}),
						-1 == this.index ? (this.nodeBtnAssign.getComponent(cc.Sprite).spriteFrame = this.spriteFrameChoose, this.assign = !0, this.labAssign.string = Language.getName("Unassign"), this.nodeBtnSell.active = !1, this.node.getChildByName("bg").active = !1) : (this.assign = !1, this.labAssign.string = Language.getName("Assign"), this.btnSkill.interactable = !1),
						this.refreshSkillState()
				},
				refreshSkillState: function () {
					this.unschedule(this.scheduleSkillCd),
						this.unschedule(this.scheduleUseSkill);
					var e = Math.floor((new Date).getTime() / 1e3),
						t = 60 * this.tbData.skill_cd,
						a = 60 * this.tbData.skill_time;
					if (- 1 == this.index && (this.btnSkill.node.getChildByName("Background").color = cc.color(255, 255, 255)), e < this.managerData.SkillDate) {
						this.nodeDetail.active = !1,
							this.nodeProgress.active = !0,
							this.managerData.SkillDate - e > a && (console.log("\u6d89\u5acc\u4fee\u6539\u7cfb\u7edf\u65f6\u95f4 \u91cd\u7f6e\u65f6\u95f4"), this.managerData.SkillDate = e + a),
							this.progress.node.getChildByName("bar").getComponent(cc.Sprite).spriteFrame = this.spriteFrameUse,
							this.totalTime = a,
							this.dtTime = this.managerData.SkillDate - e,
							this.labProgress.string = Language.getName("Effect") + ":",
							this.labProName.node.color = cc.color("#FFAD00");
						var i = Tools.formatStr(Math.floor(this.dtTime / 60), 2) + ":" + Tools.formatStr(Math.floor(this.dtTime % 60), 2);
						this.labProgressval.string = i,
							this.progress.progress = this.dtTime / this.totalTime,
							-1 == this.index && (this.btnSkill.interactable = !1),
							this.schedule(this.scheduleUseSkill, 1),
							this.skillState = ManagerSkillState.MS_USING
					} else if (e - this.managerData.SkillDate > t) this.nodeDetail.active = !0,
						this.nodeProgress.active = !1,
						this.skillState = ManagerSkillState.MS_IDLE,
						this.labProName.node.color = cc.color("#816F6F"),
						-1 == this.index && (this.btnSkill.interactable = !0);
					else {
						this.nodeProgress.active = !0,
							this.nodeDetail.active = !1,
							this.labProgress.string = "Cool Down:",
							this.labProName.node.color = cc.color(104, 104, 104),
							this.progress.node.getChildByName("bar").getComponent(cc.Sprite).spriteFrame = this.spriteFrameCd,
							this.dtTime = t + this.managerData.SkillDate - e,
							this.totalTime = t;
						var n = Tools.formatStr(Math.floor(this.dtTime / 60), 2) + ":" + Tools.formatStr(Math.floor(this.dtTime % 60), 2);
						this.labProgressval.string = n,
							this.progress.progress = 1 - this.dtTime / this.totalTime,
							this.schedule(this.scheduleSkillCd, 1),
							-1 == this.index && (this.btnSkill.interactable = !1),
							this.skillState = ManagerSkillState.MS_CD
					}
				},
				scheduleSkillCd: function () {
					this.dtTime -= 1,
						this.dtTime = Math.max(0, this.dtTime),
						this.progress.progress = 1 - this.dtTime / this.totalTime;
					var e = Tools.formatStr(Math.floor(this.dtTime / 60), 2) + ":" + Tools.formatStr(Math.floor(this.dtTime % 60), 2);
					this.labProgressval.string = e,
						this.dtTime <= 0 && (this.unschedule(this.scheduleSkillCd), this.refreshSkillState())
				},
				scheduleUseSkill: function (e) {
					this.dtTime -= 1,
						this.dtTime = Math.max(0, this.dtTime),
						this.progress.progress = this.dtTime / this.totalTime;
					var t = Tools.formatStr(Math.floor(this.dtTime / 60), 2) + ":" + Tools.formatStr(Math.floor(this.dtTime % 60), 2);
					this.labProgressval.string = t,
						this.dtTime <= 0 && (this.unschedule(this.scheduleUseSkill), this.refreshSkillState())
				},
				btnAssign: function () {
					this.assign ? (Music.play("SFX_Button Assign Manager"), this.publishEvent({
						type: "ManagerAssign",
						assign: !0,
						assignId: this.managerData.Index
					})) : (Music.play("SFX_Button Hire Manager"), this.publishEvent({
						type: "ManagerAssign",
						assign: !1,
						assignId: this.managerData.Index
					}))
				},
				btnUseSkill: function () {
					Music.play("SFX_Boost Manager"),
						console.log("skill state :" + this.skillState),
						this.skillState == ManagerSkillState.MS_IDLE && (this.publishEvent({
							type: "ManagerItemUseSkill",
							minerBranch: this.managerData.MinerBranch,
							minerId: this.managerData.MinerId
						}), this.refreshSkillState(), console.log("use skill tabindex :" + this.managerData.TableIndex))
				},
				btnSell: function (t) {
					Music.play("SFX_Button General"),
						Analysis.sendEvent({
							type: "ClickSellManager"
						}),
						this.publishEvent({
							type: "SellManager",
							assignId: this.managerData.Index
						});
					var a = e("PrisonerManager"),
						i = UserData.getMineDataRef("Manager"),
						n = 1;
					this.managerData.MinerBranch == a.EnumMinerBranch.Seam ? n = i.Seam.totalManager : this.managerData.MinerBranch == a.EnumMinerBranch.Elevator ? n = i.Elevator.totalManager : this.managerData.MinerBranch == a.EnumMinerBranch.StoreHouse && (n = i.StoreHouse.totalManager);
					var r = CfgMgr.Manager.getManagerCostCoin(this.managerData.MinerBranch, n, 1);
					this.publishEvent({
						type: "AddCash",
						cashNum: r.divi(100)
					}),
						this.publishEvent({
							type: "ShowAddCoinAct",
							cashType: 1,
							start: cc.v2(325, t.target.parent.convertToWorldSpaceAR(t.target.position).y)
						})
				},
				onManagerSkillStateChange: function (e) {
					this.skillState = e.state
				}
			}),
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent",
		PrisonerManager: "PrisonerManager"
	}],
	MapCashItem: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "a9e7eL7ochFf5A0zveRAzEf", "MapCashItem");
		var i = e("NumberData");
		cc.Class({
			extends: e("EasyEvent"),
			editor: {
				menu: "Layer/Map/CashItem"
			},
			properties: {
				type: 1,
				labCash: cc.Label,
				cashIcon: cc.Sprite,
				cashIcon_1: cc.SpriteFrame,
				cashIcon_2: cc.SpriteFrame,
				cashIcon_3: cc.SpriteFrame,
				cashIcon_4: cc.SpriteFrame
			},
			start: function () {
				this._refresh()
			},
			setType: function (e) {
				this.type = e,
					this.cashIcon.spriteFrame = this["cashIcon_" + this.type]
			},
			_refresh: function () {
				this.cash = new i(UserData.GameData.Cashs[this.type]),
					CfgMgr.Mine.getMineConfig(UserData.GameData.CurrentMine).init_currency_type == this.type && (this.cash = new i(UserData.GameData.TotalCash)),
					this.labCash.string = this.cash.toString()
			},
			onCashChanged: function (e) {
				this._refresh()
			}
		}),
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent",
		NumberData: "NumberData"
	}],
	MapRedInfo: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "530fbqIZPlC3ZQUijk5e7Wl", "MapRedInfo");
		var i = e("NumberData");
		cc.Class({
			extends: e("EasyEvent"),
			editor: {
				menu: "Layer/Map/MapRedInfo"
			},
			properties: {},
			onLoad: function () {
				this.node.scale = 0
			},
			start: function () {
				this.checkAlert()
			},
			checkAlert: function () {
				var e = new i(UserData.GameData.TotalCash),
					t = UserData.GameData.Mine;
				for (var a in t) if (t[a].Common && t[a].Common.preUnlocked && !t[a].Common.unlocked) {
					var n = CfgMgr.Mine.getMineConfig(a),
						r = new i(n.unlock_spend);
					e.compare(r) >= 0 ? this.alert() : this.hide();
					break
				}
			},
			alert: function () {
				this.node.runAction(cc.scaleTo(.1, 1)),
					this.alerted = !0
			},
			hide: function () {
				this.node.runAction(cc.scaleTo(.1, 0)),
					this.alerted = !1
			},
			onCashChanged: function (e) {
				this.checkAlert()
			},
			onOpenWorldMap: function (e) {
				this.alerted && this.node.destroy()
			}
		}),
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent",
		NumberData: "NumberData"
	}],
	MineDetailItem: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "1501cjnV+tAuLGS8wemSgCm", "MineDetailItem");
		var i = e("NumberData");
		cc.Class({
			extends: cc.Component,
			editor: {
				menu: "Layer/Map/MineDetailItem"
			},
			properties: {
				mine: 1,
				btnPrestige: cc.Button,
				labName: cc.Label,
				mineIcon: cc.Sprite,
				labPrestigeTime: cc.Label,
				labAbilityRate: cc.Label,
				labIdleCashSpeedValue: cc.Label,
				labIdleCashValue: cc.Label,
				idleCashNode: cc.Node,
				currentNode: cc.Node,
				labBoostTimeLeft: cc.Label,
				boostNode: cc.Node,
				noBoostNode: cc.Node,
				prbDialogPrestige: cc.Prefab
			},
			onLoad: function () {
				this.node.opacity = 0,
					this.node.runAction(cc.fadeIn(.2))
			},
			start: function () {
				var e = this;
				this.conf = CfgMgr.Mine.getMineConfig(this.mine),
					this.prestige = UserData.getMineDataRef("Prestige", this.mine),
					this.labName.string = this.conf.name,
					this.labPrestigeTime.string = this.prestige.time,
					this.labAbilityRate.string = CfgMgr.Mine.getAbilityRate(this.prestige.time, this.mine) + "x",
					this.labIdleCashSpeedValue.string = IdleCashMgr.getIdleCash(this.mine).toString() + "/s",
					this.currentNode.active = UserData.GameData.CurrentMine == this.mine,
					this.idleCashNode.active = UserData.GameData.CurrentMine != this.mine,
					this.refresh(),
					cc.loader.loadRes("texture/theme/" + this.mine + "/Crate", cc.SpriteFrame,
						function (t, a) {
							t || (e.mineIcon.spriteFrame = a)
						})
			},
			_showTip: function () {
				this.tipEffect || (this.tipEffect = this.btnPrestige.addComponent(e("Scale")))
			},
			refresh: function () {
				if (UserData.GameData.CurrentMine != this.mine) {
					this.idleCash = IdleCashMgr.getTotalIdleCash(this.mine),
						this.labIdleCashValue.string = this.idleCash.toString();
					var e = ItemMgr.getAdEffectEndTime(this.mine) - Date.now();
					e > 0 ? (this.boostNode.active = !0, this.labBoostTimeLeft.string = "Boost:" + Tools.timespanFormat(e), this.noBoostNode.active = !1) : (this.boostNode.active = !1, this.noBoostNode.active = !0)
				} else this.boostNode.active = !1,
					this.noBoostNode.active = !1;
				var t = UserData.getMineDataRef("Prestige", this.mine),
					a = CfgMgr.Mine.getPrestigeConfig(t.time + 1, this.mine);
				if (a) {
					var n = Math.ceil(this.mine / 5),
						r = new i(UserData.GameData.Cashs[n]);
					CfgMgr.Mine.getMineConfig(UserData.GameData.CurrentMine).init_currency_type == n && (r = new i(UserData.GameData.TotalCash));
					var o = new i(a.currency);
					r.compare(o) >= 0 && this._showTip()
				}
			},
			getIdleCash: function () {
				return UserData.GameData.CurrentMine == this.mine ? new i(0) : this.idleCash
			},
			setMine: function (e) {
				this.mine = e
			},
			btnPrestigeClick: function (e, t) {
				// this.tipEffect && (this.tipEffect.destroy(), this.tipEffect = null);
				// var a = cc.instantiate(this.prbDialogPrestige);
				// a.getComponent("DialogPrestige").setMine(this.mine),
				// ViewMgr.showDialog(a)
			}
		}),
			cc._RF.pop()
	},
	{
		NumberData: "NumberData",
		Scale: "Scale"
	}],
	MinePlaceholder: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "2b5175GKyxFmKXc+w2pwtei", "MinePlaceholder"),
			cc.Class({
				extends: e("EasyEvent").declareEvent("MinePlaceholderTouched", "MineMoveCenter"),
				editor: {
					menu: "Layer/Map/MinePlaceholder"
				},
				properties: {
					mine: 1,
					offset: cc.v2(),
					texture: cc.Node
				},
				onLoad: function () {
					this.commonData = UserData.getMineDataRef("Common", this.mine),
						this.polygonPoints = this.node.getChildByName("PolygonButton").getComponent(cc.PolygonCollider).points,
						this.polygonPoints.push(this.polygonPoints[0]),
						this.brushNode = new cc.Node,
						this.node.addChild(this.brushNode),
						this.brush = this.brushNode.addComponent(cc.Graphics),
						this.brush.lineWidth = 10,
						this.brush.lineCap = cc.Graphics.LineCap.ROUND,
						this.brush.strokeColor = cc.Color.GREEN,
						this.brush.fillColor = cc.Color.WHITE,
						this._refresh()
				},
				_refresh: function () {
					this.commonData.unlocked || this.commonData.preUnlocked ? this.texture.color = cc.Color.WHITE : this.texture.color = cc.Color.GRAY
				},
				blink: function () {
					var e = this,
						t = 0,
						a = !1;
					this.schedule(function i() {
						a ? t -= 5 : t += 15,
							!a && t > 100 && (a = !0),
							a && t < 0 && e.unschedule(i),
							e.brush.clear(),
							e.polygonPoints.forEach(function (t, a) {
								0 == a ? e.brush.moveTo(t.x, t.y) : e.brush.lineTo(t.x, t.y)
							}),
							e.brush.fillColor.setA(t),
							e.brush.fill()
					},
						.01)
				},
				showBorder: function () {
					var e = this;
					this.polygonPoints.forEach(function (t, a) {
						0 == a ? e.brush.moveTo(t.x, t.y) : e.brush.lineTo(t.x, t.y)
					}),
						this.brush.stroke()
				},
				hideBorder: function () {
					this.brush.clear()
				},
				onClick: function (e, t) {
					this.publishEvent({
						type: "MinePlaceholderTouched",
						mine: this.mine
					})
				},
				onNewMineUnlocked: function (e) {
					e.mine == this.mine - 1 && (this.commonData.preUnlocked = !0, this._refresh())
				},
				onMinePlaceholderTouched: function (e) {
					e.mine == this.mine ? this.blink() : this.hideBorder()
				},
				onOpenWorldMap: function (e) {
					UserData.GameData.CurrentMine == this.mine && this.publishEvent({
						type: "MineMoveCenter",
						pos: this.node.parent.convertToWorldSpaceAR(this.node)
					})
				},
				onSyncCloudData: function (e) {
					this.commonData = UserData.getMineDataRef("Common", this.mine),
						this._refresh()
				}
			}),
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent"
	}],
	MineSelector: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "12fc2tfnFdE/Z3VykRLiHXI", "MineSelector");
		var i = e("NumberData");
		cc.Class({
			extends: e("EasyEvent").declareEvent("MineSelected", "NewMineUnlocked"),
			editor: {
				menu: "Layer/Map/MineSelector"
			},
			properties: {
				mine: 1,
				statsNode: cc.Node,
				statsLiteNode: cc.Node,
				btnEnter: cc.Button,
				btnUnlock: cc.Button,
				labMineName: cc.Label,
				idleNode: cc.Node,
				labIdleCash: cc.Label,
				lockNode: cc.Node,
				unlockedNode: cc.Node,
				statsUnlocking: cc.Node,
				statsNewLayerAvailable: cc.Node,
				statsUnlockComplete: cc.Node,
				statsUnlockingLite: cc.Node,
				statsNewLayerAvailableLite: cc.Node,
				statsUnlockCompleteLite: cc.Node,
				manageNode: cc.Node,
				labUnlockConsume: cc.Label,
				labUnlockConsumeCost: cc.Label,
				unknownNode: cc.Node,
				contentNode: cc.Node,
				prbFriendInfo: cc.Prefab,
				friendInfoNode: cc.Node,
				prbDialogCusShare: cc.Prefab
			},
			onLoad: function () {
				this.conf = CfgMgr.Mine.getMineConfig(this.mine),
					this.unlockConsume = new i(this.conf.unlock_spend),
					this.seamData = UserData.getMineDataRef("Seam", this.mine),
					this.commonData = UserData.getMineDataRef("Common", this.mine),
					1 == this.mine && (this.commonData.unlocked = !0),
					2 == this.mine && (this.commonData.preUnlocked = !0),
					this.labMineName.string = Localize.getString(this.conf.name),
					this.labUnlockConsume.string = this.unlockConsume.toString(),
					this._refresh(),
					this.schedule(this._refresh, 1),
					this.btnEnter.node.active = !1,
					this.statsLiteNode.active = !0,
					this.statsNode.active = !1
			},
			start: function () {
				this.friendInfo = cc.instantiate(this.prbFriendInfo),
					this.friendInfo.getComponent("FriendInfo").init({
						mine: this.mine,
						allLayer: !0
					}),
					this.friendInfoNode.addChild(this.friendInfo),
					UserData.GameData.CurrentMine == this.mine && this.showContent()
			},
			hideContent: function () {
				var e = this;
				this.btnEnter.node.runAction(cc.sequence(cc.scaleTo(.1, 0).easing(cc.easeBackIn()), cc.callFunc(function () {
					e.btnEnter.node.active = !1
				},
					this))),
					this.statsNode.runAction(cc.sequence(cc.scaleTo(.1, 0).easing(cc.easeBackIn()), cc.callFunc(function () {
						e.statsLiteNode.active = !0,
							e.statsNode.active = !1
					},
						this)))
			},
			showContent: function () {
				this.statsNode.active = this.statsNewLayerAvailable.active || this.statsUnlocking.active || this.statsUnlockComplete.active,
					this.statsLiteNode.active = !1,
					this.btnEnter.node.active = !0,
					this.btnEnter.node.scale = 0,
					this.btnEnter.node.runAction(cc.scaleTo(.2, 1).easing(cc.easeBackOut())),
					this.statsNode.scale = 0,
					this.statsNode.runAction(cc.scaleTo(.2, 1).easing(cc.easeBackOut()))
			},
			setMine: function (e) {
				this.mine = e
			},
			_refresh: function () {
				this.idleNode.active = UserData.GameData.CurrentMine != this.mine && this.commonData.unlocked,
					this.labIdleCash.string = IdleCashMgr.getTotalIdleCash(this.mine),
					this.unknownNode.active = !this.commonData.preUnlocked && !this.commonData.unlocked,
					this.contentNode.active = this.commonData.preUnlocked || this.commonData.unlocked,
					this.lockNode.active = !this.commonData.unlocked,
					this.unlockedNode.active = this.commonData.unlocked,
					this.manageNode.active = UserData.GameData.CurrentMine == this.mine,
					new i(UserData.GameData.TotalCash).compare(this.unlockConsume) < 0 ? (this.labUnlockConsume.node.color = cc.Color.RED, this.labUnlockConsumeCost.node.color = cc.Color.RED, this.btnUnlock.interactable = !1) : (this.labUnlockConsume.node.color = cc.Color.GREEN, this.labUnlockConsumeCost.node.color = cc.Color.GREEN, this.btnUnlock.interactable = !0),
					this._checkStats()
			},
			_checkStats: function () {
				var e = 0;
				if (this.commonData.unlocked && this.seamData.unlockedLayerNum < Constant.MAX_SEAM_NUM_PER_MINE) {
					for (var t = void 0,
						a = 1,
						n = 1; n < this.seamData.list.length; n++) {
						var r = this.seamData.list[n];
						if (!r.unlock) {
							a = n,
								t = r;
							break
						}
					}
					var o = CfgMgr.Seam.getUnlockTime(a),
						s = CfgMgr.Seam.getUpgradeConsume(0, 1, a, null, 1, this.mine),
						c = new i(UserData.GameData.TotalCash);
					if (0 != o) {
						var l = CfgMgr.Seam.getUnlockConsume(a, this.mine);
						t.removeClicked && !t.unlockConfirmed ? e = t.waitForConfirm ? 3 : 2 : c.compare(l) >= 0 && (e = 1)
					} else c.compare(s) >= 0 && (e = 1)
				}
				this.statsNewLayerAvailable.active = 1 == e,
					this.statsUnlocking.active = 2 == e,
					this.statsUnlockComplete.active = 3 == e,
					this.statsNewLayerAvailableLite.active = 1 == e,
					this.statsUnlockingLite.active = 2 == e,
					this.statsUnlockCompleteLite.active = 3 == e
			},
			onBtnClick: function (e, t) {
				Music.play("SFX_Button General"),
					this.commonData.unlocked && this.publishEvent({
						type: "MineSelected",
						mine: this.mine
					})
			},
			onBtnUnlockClick: function (e, t) {
				Music.play("STING_Unlock New Mine Region"),
					this.publishEvent({
						type: "SpendCash",
						cashNum: this.unlockConsume
					}),
					Analysis.sendEvent({
						type: "BuyNewMine"
					}),
					this.commonData.unlocked = !0,
					this.publishEvent({
						type: "NewMineUnlocked",
						mine: this.mine
					}),
					this._refresh(),
					this.showContent(),
					this.publishEvent({
						type: "MineSelected",
						mine: this.mine
					}),
					Platform.showCustomShare(this.prbDialogCusShare, {
						type: "custom_newmine"
					})
			},
			onNewMineUnlocked: function (e) {
				e.mine == this.mine - 1 && (this.commonData.preUnlocked = !0, this._refresh())
			},
			onOpenWorldMap: function (e) {
				this._refresh(),
					UserData.GameData.CurrentMine == this.mine ? this.showContent() : this.hideContent()
			},
			onMinePlaceholderTouched: function (e) {
				e.mine == this.mine ? this.showContent() : this.hideContent()
			},
			onSyncCloudData: function (e) {
				this.seamData = UserData.getMineDataRef("Seam", this.mine),
					this.commonData = UserData.getMineDataRef("Common", this.mine),
					this._refresh()
			}
		}),
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent",
		NumberData: "NumberData"
	}],
	Music: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "bb80dYyPdpJcI6rRMdIooyO", "Music"),
			cc.Class({
				properties: {
					mute: !1
				},
				init: function () {
					this.clips = [],
						this.audioIds = [],
						this.isBGMPlaying = !1,
						console.log("[Music]\u97f3\u9891\u6a21\u5757\u521d\u59cb\u5316\u5b8c\u6210")
				},
				loadResDir: function (e) {
					var t = this;
					return e = e || "AudioClips",
						new Promise(function (a, i) {
							cc.loader.loadResDir(e, cc.AudioClip,
								function (e, n) {
									e ? (console.log("[Music]\u97f3\u9891\u52a0\u8f7d\u51fa\u9519", e), i()) : (n.forEach(function (e) {
										t.clips[e.name] = e
									}), a())
								})
						})
				},
				play: function (e) {
					var t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
						a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1;
					if (!this.mute) try {
						this.audioIds[e] = cc.audioEngine.play(this.clips[e], t, a)
					} catch (t) {
						cc.warn("\u97f3\u6548\u64ad\u653e\u9519\u8bef", e, t)
					}
				},
				stop: function (e) {
					try {
						cc.audioEngine.stop(this.audioIds[e])
					} catch (t) {
						cc.warn("\u97f3\u6548\u505c\u6b62\u9519\u8bef", e, t)
					}
				},
				pause: function (e) {
					try {
						cc.audioEngine.pause(this.audioIds[e])
					} catch (t) {
						cc.warn("\u97f3\u6548\u6682\u505c\u9519\u8bef", e, t)
					}
				},
				resume: function (e) {
					try {
						cc.audioEngine.resume(this.audioIds[e])
					} catch (t) {
						cc.warn("\u97f3\u6548\u6062\u590d\u9519\u8bef", e, t)
					}
				}
			}),
			cc._RF.pop()
	},
	{}],
	NewSeamChecker: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "ece49KhT2hIlareCEF9jfJI", "NewSeamChecker");
		var i = e("NumberData");
		cc.Class({
			extends: e("EasyEvent"),
			editor: {
				menu: "GameModule/Seam/NewSeamChecker"
			},
			properties: {},
			onLoad: function () {
				this._reloadMineData(),
					this._check(this.seamData.unlockedLayerNum + 1)
			},
			_reloadMineData: function () {
				this.seamData = UserData.getMineDataRef("Seam"),
					this._shownLayers = [],
					this._ignoreLayers = []
			},
			onEnable: function () {
				console.log("ENABLED ======== "),
					-1 != this._ignoreLayers.indexOf(this.currentCheckLayerNum) && this.hide()
			},
			onDisable: function () {
				console.log("DISABLED ======== "),
					-1 != this._shownLayers.indexOf(this.currentCheckLayerNum) && this._ignoreLayers.push(this.currentCheckLayerNum)
			},
			_check: function (e) {
				var t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
				this.currentCheckLayerNum = e;
				var a = new i(UserData.GameData.TotalCash);
				if (- 1 != this._ignoreLayers.indexOf(e)) return console.log("\u5df2\u7ecf\u63d0\u793a\u8fc7:", e, "\u4e0d\u518d\u63d0\u793a"),
					void this.hide();
				var n = this.seamData.list[e];
				if (e > Constant.MAX_SEAM_NUM_PER_MINE || 1 == e) this.hide();
				else {
					var r = new i(0);
					if (CfgMgr.Seam.getUnlockTime(e) && !n.unlockConfirmed) {
						if (n.removeClicked && !n.waitForConfirm) return void this.hide();
						if (n.waitForConfirm && !n.unlockConfirmed) return this.show(),
							void this._shownLayers.push(this.currentCheckLayerNum);
						r = CfgMgr.Seam.getUnlockConsume(e)
					} else r = CfgMgr.Seam.getUpgradeConsume(0, 1, e);
					r.compare(a) <= 0 ? t ? this._ignoreLayers.push(this.currentCheckLayerNum) : (this.show(), this._shownLayers.push(this.currentCheckLayerNum)) : this.hide()
				}
			},
			show: function () {
				this.node.active = !0
			},
			hide: function () {
				this.node.active = !1
			},
			onCashChanged: function (e) {
				this._check(this.currentCheckLayerNum)
			},
			onNewSeamLayerUnlock: function (e) {
				this._check(e.layerNum + 1, !0)
			},
			onNewMineUnlocked: function (e) {
				this._check(1)
			},
			onMineChanged: function (e) {
				this._reloadMineData(),
					this._check(this.seamData.unlockedLayerNum + 1)
			}
		}),
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent",
		NumberData: "NumberData"
	}],
	NumberData: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "46a11u/rZFNnK9/ljbeut0W", "NumberData");
		var i = ["", "K", "M", "B", "T"],
			n = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
			r = cc.Class({
				properties: {
					value: 0,
					length: 0
				},
				ctor: function () {
					var e = arguments[0];
					this.initialize(e)
				},
				initialize: function (e) {
					var t = e + "";
					if (- 1 != t.indexOf("e") || -1 != t.indexOf("E")) {
						var a = (t = t.replace("E", "e")).split("e"),
							i = a[0].split("."),
							n = i[0].length,
							r = i[0].substr(0, 1) + "." + i[0].substr(1, n - 1);
						this.value = this._toExact(r + i[1]),
							"+" == a[1].substr(0, 1) ? this.length = parseInt(a[1].substr(1, a[1].length - 1)) + n - 1 : "-" == a[1].substr(0, 1) && (this.length = -parseInt(a[1].substr(1, a[1].length - 1)) + n - 1)
					} else if (t.indexOf(".") >= 0) {
						var o = t.split(".");
						n = o[0].length,
							r = o[0].substr(0, 1) + "." + o[0].substr(1, n - 1);
						this.value = this._toExact(r + o[1]),
							this.length = n - 1
					} else {
						n = t.length;
						t = t.substr(0, 1) + "." + t.substr(1, n - 1),
							this.value = this._toExact(t),
							this.length = n - 1
					}
					this._checkValue()
				},
				add: function (e) {
					if (e instanceof r) this._add(e);
					else {
						var t = new r(e);
						this._add(t)
					}
					return this
				},
				_add: function (e) {
					var t = this.length - e.length;
					0 == t ? this.value = this.value + e.value : t > 0 ? t < 5 && (this.value = this.value + e.value / this.pow_10(Math.abs(t))) : t > -5 ? (this.value = this.value / this.pow_10(Math.abs(t)) + e.value, this.length = e.length) : (this.value = e.value, this.length = e.length),
						this._checkValue()
				},
				remove: function (e) {
					if (e instanceof r) this._remove(e);
					else {
						var t = new r(e);
						this._remove(t)
					}
					return this
				},
				_remove: function (e) {
					var t = this.length - e.length;
					0 == t ? this.value = this.value - e.value : t > 0 ? t < 5 && (this.value = this.value - e.value / this.pow_10(Math.abs(t))) : t > -5 ? (this.value = this.value / this.pow_10(Math.abs(t)) - e.value, this.length = e.length) : (this.value = -1 * e.value, this.length = e.length),
						this._checkValue()
				},
				mult: function (e) {
					return e instanceof r ? (this.value = this.value * e.value, this.length = this.length + e.length) : this.value = this.value * e,
						this._checkValue(),
						this
				},
				divi: function (e) {
					return e instanceof r ? (this.value = this.value / e.value, this.length = this.length - e.length) : this.value = this.value / e,
						this._checkValue(),
						this
				},
				ratio: function (e) {
					if (0 == e.compare()) return "Infinity";
					var t = new r(this.toNumber());
					return t.divi(e),
						parseFloat(t.toFloat().toFixed(5))
				},
				clone: function () {
					return new r(this.toNumber())
				},
				compare: function (e) {
					if (e) {
						if (e instanceof r) return this._compare(e);
						var t = new r(e);
						return this._compare(t)
					}
					return 0 == this.value ? 0 : this.value > 0 ? 1 : -1
				},
				_compare: function (e) {
					return this.value >= 0 && e.value < 0 ? 1 : this.value < 0 && e.value >= 0 ? -1 : this.value >= 0 && e.value >= 0 ? 0 == this.value && 0 == e ? 0 : this.length == e.length ? this.value > e.value ? 1 : this.value == e.value ? 0 : -1 : this.length > e.length ? 1 : -1 : this.value < 0 && e.value < 0 ? this.length == e.length ? this.value > e.value ? 1 : this.value == e.value ? 0 : -1 : this.length > e.length ? -1 : 1 : void 0
				},
				_checkValue: function () {
					if (0 != this.value) if (this.value >= 1 && this.value < 10 || this.value <= -1 && this.value >= -10) this.value = this._toExact(this.value);
					else {
						if (this.value > 0 && this.value < 1 || this.value < 0 && this.value > -1) this.value = this._toExact(10 * this.value),
							this.length -= 1;
						else {
							if (!(this.value >= 10 || this.value < -10)) return void (this.value = this._toExact(this.value));
							this.value = this._toExact(this.value / 10),
								this.length += 1
						}
						this._checkValue()
					} else this.length = 0
				},
				floor: function () {
					if (this.length < 5) {
						var e = Math.round(Math.pow(10, this.length)),
							t = Math.floor(this.value * e);
						this.value = t / e
					}
					return this
				},
				round: function () {
					if (this.length < 5) {
						var e = Math.round(Math.pow(10, this.length)),
							t = Math.round(this.value * e);
						this.value = t / e
					}
					return this
				},
				_toExact: function (e) {
					return "string" == typeof e && (e = parseFloat(e)),
						parseFloat(e.toFixed(5))
				},
				toString: function () {
					var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 2,
						t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 3,
						a = parseInt(this.length / 3),
						r = this.length % 3,
						o = "";
					if (r < 0) {
						if (Math.abs(a) < 2) {
							var s = this.value * this.pow_1_Of_10(Math.abs(r));
							return "" + (s = 0 == e ? Math.floor(s) : s.toFixed(e))
						}
						return "0"
					}
					s = this.value * this.pow_10(r);
					if (Number.isInteger(s)) var c = s;
					else {
						0 == e ? s = Math.floor(s) : ((s = s.toFixed(e)).length > t + 1 && (s = s.substr(0, t + 1)), s = parseFloat(s));
						c = "" + s
					}
					if (a < i.length) o = c + i[a];
					else {
						for (var l = a - i.length + n.length,
							d = ""; l >= n.length;) d = n[l % n.length] + d,
								l = parseInt(l / n.length) - 1;
						o = c + (d = n[l] + d)
					}
					return o
				},
				toFloat: function () {
					return this.length >= 0 ? this.pow_10(this.length) * this.value : this.pow_1_Of_10(this.length) * this.value
				},
				toInt: function () {
					return parseInt(this.toFloat())
				},
				toNumber: function () {
					return Math.abs(this.length) <= 5 ? this.toFloat() : this.value + "e" + (this.length > 0 ? "+" : "-") + Math.abs(this.length)
				},
				pow_10: function (e) {
					return Math.round(Math.pow(10, Math.abs(e)))
				},
				pow_1_Of_10: function (e) {
					return 1 / this.pow_10(e)
				}
			});
		cc._RF.pop()
	},
	{}],
	Pay: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "0ffa7eEI/NH/4EW0FnsFbbO", "Pay"),
			cc.Class({
				impl: null,
				init: function () {
					var t = this;["purchase"].forEach(function (e) {
						t[e] = function (t) {
							if (t || (t = {}), null != this.impl && "function" == typeof this.impl[e]) return this.impl[e](t);
							cc.warn("[Pay]\u65b9\u6cd5" + e + "\u672a\u5b9e\u73b0"),
								"function" == typeof t.fail && t.fail()
						}
					});
					var a = Framework.moduleCode + "Pay",
						i = void 0;
					try {
						i = e(a)
					} catch (e) { }
					null != i ? (this.impl = new i, "function" == typeof this.impl.init && this.impl.init(), console.log("[Pay]\u5df2\u542f\u7528 " + a)) : cc.warn("[Pay]" + a + " \u4e0d\u5b58\u5728,\u652f\u4ed8\u4e0d\u53ef\u7528.")
				}
			}),
			cc._RF.pop()
	},
	{}],
	Platform: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "fafa0D71SBLDKCmWRbLBGu7", "Platform"),
			cc.Class({
				init: function () {
					var t = this;["login", "getLaunchOptionsSync", "showLoading", "hideLoading", "shareAppMessage", "showToast", "postMessage", "getOpenDataContext", "setUserCloudStorage", "getUserCloudStorage", "createGameClubButton", "showShareMenu", "onShareAppMessage", "navigateToMiniProgram", "canPushNotification", "createShortCut", "openCustomerServiceConversation", "onShow", "onHide", "vibrateShort", "getSystemInfoSync", "previewImage", "request", "exit", "submitScore", "getRanklistData", "requestInviteFriendsVal", "getPlayerId"].forEach(function (e) {
						t[e] = function (t) {
							if (t || (t = {}), null != this.impl && "function" == typeof this.impl[e]) return this.impl[e](t);
							cc.warn("[Platform] \u65b9\u6cd5" + e + "\u672a\u5b9e\u73b0"),
								"function" == typeof t.fail && t.fail()
						}
					});
					var a = Framework.moduleCode + "Platform",
						i = void 0;
					try {
						i = e(a)
					} catch (e) { }
					null != i ? (this.impl = new i, console.log("[Platform]\u5df2\u542f\u7528 " + a)) : cc.warn("[Platform]" + a + " \u4e0d\u5b58\u5728,\u5e73\u53f0API\u4e0d\u53ef\u7528."),
						null != this.impl && "function" == typeof this.impl.init && this.impl.init()
				},
				chooseContext: function (e) {
					null != this.impl && "function" == typeof this.impl.chooseContext && this.impl.chooseContext({
						type: e.type ? e.type : "common",
						success: e.success,
						fail: e.fail
					})
				},
				shareOrVideo: function (e) {
					null != this.impl && "function" == typeof this.impl.shareOrVideo ? this.impl.shareOrVideo({
						type: e.type ? e.type : "common",
						sharenode: e.sharenode,
						videonode: e.videonode
					}) : (e.sharenode.active = !1, e.videonode.active = !0)
				},
				showCustomShare: function (e, t) {
					null != this.impl && "function" == typeof this.impl.showCustomShare && this.impl.showCustomShare(e, t)
				},
				shareCustom: function (e, t) {
					null != this.impl && "function" == typeof this.impl.shareCustom && this.impl.shareCustom(e, t)
				},
				getPlayerPhoto: function () {
					if (null != this.impl && "function" == typeof this.impl.getPlayerPhoto) return this.impl.getPlayerPhoto()
				}
			}),
			cc._RF.pop()
	},
	{}],
	PolygonHit: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "16f30IY81VEHZRabkCYou/b", "PolygonHit"),
			cc.Class({
				extends: cc.Component,
				editor: !1,
				properties: {},
				onLoad: function () {
					this.node._oldHitTest = this.node._hitTest.bind(this.node),
						this.node._hitTest = this.polygonHitTest.bind(this.node)
				},
				polygonHitTest: function (e, t) {
					var a = this.getComponent(cc.PolygonCollider);
					return a ? ((e = this.convertToNodeSpace(e)).x -= this.getContentSize().width / 2, e.y -= this.getContentSize().height / 2, cc.Intersection.pointInPolygon(e, a.points)) : this._oldHitTest(e, t)
				}
			}),
			cc._RF.pop()
	},
	{}],
	PrestigeTipButton: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "85dcc2qc7NEcZPxuPud0Rzq", "PrestigeTipButton");
		var i = e("NumberData");
		cc.Class({
			extends: e("EasyEvent"),
			editor: {
				menu: "GameModule/PrestigeTipButton"
			},
			properties: {
				content: cc.Node
			},
			onLoad: function () {
				this.content.active = !1
			},
			start: function () {
				this._refresh()
			},
			_refresh: function () {
				this.content.active = !1;
				for (var e = new i(UserData.GameData.TotalCash), t = Math.ceil(UserData.GameData.CurrentMine / 5), a = 1 + 5 * (t - 1); a <= 5 * t; a++) {
					var n = a,
						r = UserData.getMineDataRef("Prestige", n),
						o = CfgMgr.Mine.getPrestigeConfig(r.time + 1, n);
					if (o) {
						var s = new i(o.currency);
						if (e.compare(s) >= 0) {
							this._showTip(n);
							break
						}
					}
				}
			},
			_showTip: function (e) {
				this.mine = e,
					this.content.active = false
			},
			btnClick: function (e, t) {
				this.publishEvent({
					type: "OpenPrestige",
					mine: this.mine
				}),
					this.node.destroy()
			},
			onCashChanged: function () {
				this._refresh()
			}
		}),
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent",
		NumberData: "NumberData"
	}],
	PrisonerCar: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "ec7e3ryHFtOBa2/1LY0rxyU", "PrisonerCar");
		var i = e("NumberData"),
			n = cc.Enum({
				PS_IDLE: 0,
				PS_MOVE_FRONT: 1,
				PS_PUT: 2,
				PS_MOVE_BACK: 3,
				PS_DISCHARGE: 4
			}),
			r = cc.Enum({
				IDLE: 1,
				WALK: 2
			});
		cc.Class({
			extends: e("EasyEvent").declareEvent("AskElevatorForMine", "MoveMineFromElevator", "AddCash", "ShowAddCoinAni", "PrisonerCarGoToWork", "PrisonerCarWorkIsOver"),
			properties: {
				prisonerAni: {
					type: cc.Node,
					default:
						null
				},
				sprMiner: {
					type: cc.Node,
					default:
						null
				},
				nodeCash: cc.Node,
				labCash: cc.Label,
				prefabLoadingMineAni: cc.Prefab,
				loadingProgress: cc.Node
			},
			onLoad: function () {
				this.managerState = !1,
					this.priCurState = n.PS_IDLE,
					this.spinePrisoner = this.prisonerAni.getComponent(sp.Skeleton),
					this.curMineNum = new i(0),
					this.loadingMineAni = cc.instantiate(this.prefabLoadingMineAni),
					this.node.addChild(this.loadingMineAni),
					this.loadingMineAni.position = cc.v2(- 21, 48),
					this.playLoadingMineAni(!1),
					this.loadingProgress.active = !1
			},
			changeSkin: function (e, t) {
				var a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null,
					i = this.spinePrisoner.findSlot(e),
					n = this.spinePrisoner.skeletonData.getRuntimeData(),
					r = n.findSlotIndex(e),
					o = n.findSkin(t).getAttachment(r, a);
				i.setAttachment(o)
			},
			start: function () {
				this.checkCanMove()
			},
			playLoadingMineAni: function (e) {
				e ? (this.loadingMineAni.active = !0, this.loadingMineAni.getChildByName("node").getComponent(cc.Animation).play()) : (this.loadingMineAni.active = !1, this.loadingMineAni.getChildByName("node").getComponent(cc.Animation).stop())
			},
			showLoadingProgressAct: function (e) {
				var t = this,
					a = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
				this.loadingProgress.active = !0,
					this.protime = e.toFloat(),
					this.totalT = 0,
					this.loadingProgress.getComponent(cc.ProgressBar).progress = 0,
					this.loadingProgress.getComponent(cc.ProgressBar).reverse = a,
					this.scheduleProgress = function (e) {
						t.totalT += e,
							t.totalT = Math.min(t.totalT, t.protime);
						var a = t.totalT / t.protime;
						t.loadingProgress.getComponent(cc.ProgressBar).progress = a,
							a >= 1 && (t.loadingProgress.active = !1, t.unschedule(t.scheduleProgress))
					},
					this.schedule(this.scheduleProgress, .01)
			},
			initData: function (e) {
				this.tmpMoveTime = e.moveTime,
					this.tmpLoadingSpeed = e.loadSpeed,
					this.tmpLoadingVal = e.loadingVal,
					this.managerState = e.managerState,
					this.managerState && this.priCurState == n.PS_IDLE && this.startPriMove()
			},
			checkCanMove: function () {
				this.node.scaleX = 1,
					this.sprMiner.active = !1,
					this.managerState ? this.startPriMove() : (this.priCurState = n.PS_IDLE, this.changePrisonerAni(r.IDLE))
			},
			startPriMove: function () {
				this.moveTime = this.tmpMoveTime,
					this.loadingVal = this.tmpLoadingVal,
					this.loadSpeed = this.tmpLoadingSpeed,
					this.priCurState = n.PS_MOVE_FRONT,
					this.scheduleOnce(this.priMoveFront, 0)
			},
			priMoveFront: function () {
				this.nodeCash.scaleX = 1;
				var e = this.moveTime / 2;
				this.priCurState = n.PS_MOVE_FRONT,
					this.node.runAction(cc.sequence(cc.moveTo(e, cc.v2(Constant.STORE_HOUSE_MOVE_END, this.node.y)), cc.callFunc(this.askForMine, this))),
					this.changePrisonerAni(r.WALK)
			},
			askForMine: function () {
				var e = this;
				this.publishEvent({
					type: "AskElevatorForMine",
					callback: function (t) {
						if (e.hasLoad = !1, t.mineNum.compare() > 0) {
							e.hasLoad = !0,
								t.mineNum.compare(e.loadingVal) > 0 ? e.curMineNum.add(e.loadingVal) : e.curMineNum.add(t.mineNum);
							var a = e.curMineNum.clone();
							e.publishEvent({
								type: "MoveMineFromElevator",
								mineNum: a
							}),
								e.curMineNum.length < 3 && e.curMineNum.floor(),
								e.labCash.string = e.curMineNum.toString()
						}
						e.priPutMine()
					},
					target: this
				})
			},
			priPutMine: function () {
				var e = this.curMineNum.clone().divi(this.loadSpeed);
				this.priCurState = n.PS_PUT,
					this.node.runAction(cc.sequence(cc.delayTime(e.toFloat()), cc.callFunc(this.priMoveBack, this))),
					this.changePrisonerAni(r.IDLE),
					this.hasLoad && (this.playLoadingMineAni(!0), this.showLoadingProgressAct(e))
			},
			priMoveBack: function () {
				this.curMineNum.compare() > 0 && (this.sprMiner.active = !0, this.nodeCash.active = !0, this.nodeCash.scaleX = -1),
					this.playLoadingMineAni(!1),
					this.loadingProgress.active = !1;
				var e = this.moveTime / 2;
				this.node.scaleX = -1,
					this.priCurState = n.PS_MOVE_BACK,
					this.node.runAction(cc.sequence(cc.moveTo(e, cc.v2(Constant.STORE_HOUSE_MOVE_START, this.node.y)), cc.callFunc(this.priDischarge, this))),
					this.changePrisonerAni(r.WALK)
			},
			priDischarge: function () {
				var e = this.curMineNum.clone().divi(this.loadSpeed);
				this.priCurState = n.PS_DISCHARGE,
					this.node.runAction(cc.sequence(cc.delayTime(e.toFloat()), cc.callFunc(this.priIdle, this))),
					this.changePrisonerAni(r.IDLE),
					this.hasLoad && this.showLoadingProgressAct(e, !0)
			},
			priIdle: function () {
				if (this.curMineNum.compare() > 0) {
					var e = ItemMgr.getActiveItemEffect() * ItemMgr.getAdEffect();
					this.publishEvent({
						type: "ShowAddCoinAni",
						num: this.curMineNum.clone().mult(e).toString()
					}),
						this.publishEvent({
							type: "PrisonerCarWorkIsOver"
						}),
						this.publishEvent({
							type: "AddCash",
							cashNum: this.curMineNum.clone().mult(e)
						}),
						this.curMineNum.remove(this.curMineNum),
						UserData.getMineDataRef("Common").initStep < 2.5 && this.publishEvent({
							type: "InitStepMoveForward",
							currentStep: 2.5
						})
				}
				this.sprMiner.active = !1,
					this.loadingProgress.active = !1,
					this.nodeCash.active = !1,
					this.checkCanMove()
			},
			changePrisonerAni: function (e) {
				var t = this;
				e == r.IDLE ? this.spinePrisoner.setAnimation(0, "action_sleep", !0, 0) : e == r.WALK && (this.spinePrisoner.setAnimation(0, "action_work3", !0, 0), this.scheduleOnce(function () {
					t.changeSkin("mouth_smile", "default", "mouth_laugh")
				},
					.01))
			},
			onPrisonerCarGoToWork: function (e) {
				this.startPriMove()
			},
			btnPrisonerCarClick: function () {
				Analysis.sendEvent({
					type: "ClickPrisonerCar"
				}),
					this.managerState || this.priCurState == n.PS_IDLE && this.publishEvent({
						type: "PrisonerCarGoToWork",
						command: "Tap"
					})
			}
		}),
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent",
		NumberData: "NumberData"
	}],
	PrisonerManager: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "615926HsvhDsJHpFczo4Qbr", "PrisonerManager");
		var i = e("NumberData"),
			n = cc.Enum({
				None: 0,
				Elevator: 1,
				Seam: 2,
				StoreHouse: 3
			});
		cc.Class({
			extends: e("EasyEvent").declareEvent("ManagerStateChangeStoreHouse", "ManagerStateChangeElevator", "ManagerStateChangeSeam", "ManagerSkillStateChange", "UseSaleManager", "AffordManager", "NoAffordManager"),
			statics: {
				EnumMinerBranch: n
			},
			properties: {
				prefabDialogManager: {
					type: cc.Prefab,
					default:
						null
				},
				nodeManagerNull: {
					type: cc.Node,
					default:
						null
				},
				nodeManagerNormal: {
					type: cc.Node,
					default:
						null
				},
				nodeBtnSkill: {
					type: cc.Node,
					default:
						null
				},
				nodeLabTime: {
					type: cc.Node,
					default:
						null
				},
				nodeSkillAni: {
					type: cc.Node,
					default:
						null
				},
				minerBranch: {
					type: n,
					default:
						n.None
				},
				nodeHead: cc.Node
			},
			onLoad: function () {
				this.minerId || (this.minerId = 1),
					this.spineManager = this.nodeManagerNormal.getComponent(sp.Skeleton),
					this.reloadData(!0)
			},
			enabledRender: function () {
				this.spineManager.enabled = !0
			},
			disabledRender: function () {
				this.spineManager.enabled = !1
			},
			loadAllManagerData: function (e, t) {
				this.managerData = null;
				var a = 1;
				if (this.minerBranch == n.Seam) {
					if (!t) return;
					this.managerData = e.Seam,
						a = 30
				} else this.minerBranch == n.Elevator ? this.managerData = e.Elevator : this.minerBranch == n.StoreHouse && (this.managerData = e.StoreHouse);
				if (!this.managerData) {
					this.minerBranch == n.Seam ? (e.Seam = {},
						this.managerData = e.Seam) : this.minerBranch == n.Elevator ? (e.Elevator = {},
							this.managerData = e.Elevator) : this.minerBranch == n.StoreHouse && (e.StoreHouse = {},
								this.managerData = e.StoreHouse),
						this.managerData.assign = {},
						this.managerData.unassign = [],
						this.managerData.totalManager = 0;
					for (var i = 1; i <= a; i++) this.managerData.assign.list || (this.managerData.assign.list = []),
						this.managerData.assign.list[i] = {
							MinerBranch: this.minerBranch,
							MinerId: i,
							TableIndex: 0,
							SkillDate: 0,
							Index: 0,
							Name: ""
						}
				}
				this.allManagerData = this.managerData.unassign,
					this.curManagerData = this.managerData.assign.list[this.minerId],
					this.refreshManagerState()
			},
			setMinerId: function (e) {
				this.minerId = e
			},
			reloadData: function (e) {
				var t = UserData.getMineDataRef("Manager");
				this.loadAllManagerData(t, e)
			},
			refreshManagerState: function () {
				if (0 == this.curManagerData.TableIndex) this.nodeManagerNull.active = !0,
					this.nodeSkillAni.active = !1,
					this.nodeHead.active = !1,
					this.nodeManagerNormal.active = !1,
					this.skillState = ManagerSkillState.MS_CD,
					this.money = CfgMgr.Manager.getManagerCostCoin(this.minerBranch, this.managerData.totalManager, 1);
				else {
					this.nodeManagerNull.active = !1,
						this.nodeManagerNormal.active = !0,
						this.nodeSkillAni.active = !1,
						this.nodeHead.active = !0;
					var e = Math.floor((new Date).getTime() / 1e3),
						t = CfgMgr.Manager.getManagerDataById(this.curManagerData.TableIndex),
						a = 60 * t.skill_cd,
						i = 60 * t.skill_time;
					if (e < this.curManagerData.SkillDate) {
						UserData.GameData.Analytics.ManagerFirstUseSkill || (UserData.GameData.Analytics.ManagerFirstUseSkill = !0, Analysis.sendEvent({
							type: "FirstManagerUseSkill"
						})),
							this.curManagerData.SkillDate - e > i && (console.log("\u6d89\u5acc\u4fee\u6539\u7cfb\u7edf\u65f6\u95f4 \u91cd\u7f6e\u65f6\u95f4"), this.curManagerData.SkillDate = e + i),
							this.dtTime = this.curManagerData.SkillDate - e;
						var n = Tools.formatStr(Math.floor(this.dtTime / 60), 2) + ":" + Tools.formatStr(Math.floor(this.dtTime % 60), 2);
						this.nodeLabTime.getComponent(cc.Label).string = n,
							this.schedule(this.scheduleUseSkill, 1),
							this.nodeLabTime.active = !0,
							this.nodeBtnSkill.active = !1,
							this.nodeBtnSkill.getComponent(cc.Button).interactable = !0,
							this.nodeSkillAni.active = !0,
							this.nodeSkillAni.getComponent(cc.Animation).play(),
							this.skillState = ManagerSkillState.MS_USING
					} else if (e - this.curManagerData.SkillDate > a) {
						this.nodeLabTime.active = !1,
							this.nodeBtnSkill.active = !0,
							this.nodeBtnSkill.getComponent(cc.Button).interactable = !0;
						var r = CfgMgr.Manager.getManagerDataById(this.curManagerData.TableIndex),
							o = this.nodeBtnSkill.getChildByName("Gameicon01").getComponent(cc.Sprite);
						cc.loader.loadRes(CfgMgr.Manager.getPropertyIcon(r.skill_type), cc.SpriteFrame,
							function (e, t) {
								e ? console.log("\u52a0\u8f7d\u7ba1\u7406\u5458icon\u5931\u8d25" + e) : o.spriteFrame = t
							}),
							this.skillState = ManagerSkillState.MS_IDLE
					} else {
						this.dtTime = a + this.curManagerData.SkillDate - e;
						var s = Tools.formatStr(Math.floor(this.dtTime / 60), 2) + ":" + Tools.formatStr(Math.floor(this.dtTime % 60), 2);
						this.nodeLabTime.getComponent(cc.Label).string = s,
							this.schedule(this.scheduleSkillCd, 1),
							this.nodeLabTime.active = !0,
							this.nodeBtnSkill.active = !1,
							this.nodeBtnSkill.getComponent(cc.Button).interactable = !1,
							this.skillState = ManagerSkillState.MS_CD
					}
				}
				this.checkHireManager(),
					this.changeManagerAni(),
					this.broadcastManagerState(),
					this.broadcastManagerSkillState()
			},
			checkHireManager: function () {
				0 == this.curManagerData.TableIndex ? this.money.compare(new i(UserData.GameData.TotalCash)) < 0 ? (this.nodeManagerNull.getChildByName("Manager_Null").runAction(cc.repeatForever(cc.sequence(cc.scaleTo(.5, 1.1), cc.scaleTo(.5, 1)))), this.publishEvent({
					type: "AffordManager",
					minerBranch: this.minerBranch,
					minerId: this.minerId
				})) : (this.nodeManagerNull.getChildByName("Manager_Null").scale = 1, this.nodeManagerNull.getChildByName("Manager_Null").stopAllActions(), this.publishEvent({
					type: "NoAffordManager",
					minerBranch: this.minerBranch,
					minerId: this.minerId
				})) : (this.nodeManagerNull.getChildByName("Manager_Null").scale = 1, this.nodeManagerNull.getChildByName("Manager_Null").stopAllActions())
			},
			scheduleUseSkill: function (e) {
				this.dtTime -= 1,
					this.dtTime = Math.max(0, this.dtTime);
				var t = Tools.formatStr(Math.floor(this.dtTime / 60), 2) + ":" + Tools.formatStr(Math.floor(this.dtTime % 60), 2);
				this.nodeLabTime.getComponent(cc.Label).string = t,
					this.dtTime <= 0 && (this.unschedule(this.scheduleUseSkill), this.refreshManagerState(), this.nodeSkillAni.active = !1, this.nodeSkillAni.getComponent(cc.Animation).stop())
			},
			scheduleSkillCd: function (e) {
				this.dtTime -= 1,
					this.dtTime = Math.max(0, this.dtTime);
				var t = Tools.formatStr(Math.floor(this.dtTime / 60), 2) + ":" + Tools.formatStr(Math.floor(this.dtTime % 60), 2);
				this.nodeLabTime.getComponent(cc.Label).string = t,
					this.dtTime <= 0 && (this.unschedule(this.scheduleSkillCd), this.refreshManagerState())
			},
			changeManagerAni: function () {
				var e = this;
				this.skillState == ManagerSkillState.MS_USING ? (this.spineManager.setAnimation(0, "Attack_Idle", !0, 0), this.scheduleOnce(function () {
					e.changeSkin("mouth", "default", "mouth_2")
				},
					.01)) : (this.spineManager.setAnimation(0, "Idle", !0, 0), this.scheduleOnce(function () {
						e.changeSkin("mouth", "default", "mouth_2")
					},
						.01))
			},
			changeSkin: function (e, t) {
				var a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null,
					i = this.spineManager.findSlot(e),
					n = this.spineManager.skeletonData.getRuntimeData(),
					r = n.findSlotIndex(e),
					o = n.findSkin(t).getAttachment(r, a);
				i.setAttachment(o)
			},
			start: function () { },
			broadcastManagerState: function () {
				var e = void 0,
					t = 1;
				this.minerBranch == n.Seam ? (e = "Seam", t = this.curManagerData.MinerId) : this.minerBranch == n.Elevator ? e = "Elevator" : this.minerBranch == n.StoreHouse && (e = "StoreHouse"),
					this.publishEvent({
						type: "ManagerStateChange" + e,
						minerId: t,
						state: 0 != this.curManagerData.TableIndex
					})
			},
			broadcastManagerSkillState: function () {
				if (this.publishEvent({
					type: "ManagerSkillStateChange",
					minerBranch: this.minerBranch,
					minerId: this.minerId,
					tabId: this.curManagerData.TableIndex,
					state: this.skillState
				}), 0 != this.curManagerData.TableIndex) {
					CfgMgr.Manager.getManagerDataById(this.curManagerData.TableIndex);
					this.publishEvent({
						type: "UseSaleManager",
						minerBranch: this.minerBranch,
						minerId: this.minerId
					})
				} else 0 == this.curManagerData.TableIndex && this.publishEvent({
					type: "UseSaleManager",
					minerBranch: this.minerBranch,
					minerId: this.minerId
				})
			},
			btnShowDialogManager: function () {
				var e = cc.instantiate(this.prefabDialogManager);
				e.getComponent("DialogManager").initData(this.allManagerData, this.curManagerData, this.minerBranch, this.managerData),
					ViewMgr.showDialog(e)
			},
			btnManagerUseSkill: function () {
				Music.play("SFX_Boost Manager"),
					this.ManagerUseSkill()
			},
			ManagerUseSkill: function () {
				var e = Math.floor((new Date).getTime() / 1e3),
					t = 60 * CfgMgr.Manager.getManagerDataById(this.curManagerData.TableIndex).skill_time;
				this.minerBranch == n.Seam ? (this.curManagerData.SkillDate = e + t, console.log("use skill seam" + this.minerId)) : this.minerBranch == n.Elevator ? (this.curManagerData.SkillDate = e + t, console.log("use skill Elevator")) : this.minerBranch == n.StoreHouse && (this.curManagerData.SkillDate = e + t, console.log("use skill StoreHouse")),
					console.log("use skill tabindex :" + this.curManagerData.TableIndex),
					this.refreshManagerState()
			},
			onPrisonerManagerStateChange: function (e) {
				this.minerBranch == e.minerBranch && this.minerId == e.minerId && (this.unscheduleAllCallbacks(), this.refreshManagerState())
			},
			onManagerItemUseSkill: function (e) {
				this.minerBranch == e.minerBranch && this.minerId == e.minerId && this.ManagerUseSkill()
			},
			onCashChanged: function (e) {
				this.checkHireManager()
			}
		}),
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent",
		NumberData: "NumberData"
	}],
	QuickGameAd: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "3079fXG3NxLurtsn6DcHwuF", "QuickGameAd"),
			cc.Class({
				extends: e("BaseAd"),
				properties: {
					APP_ID: "30001714",
					DEBUG: !1,
					INTERSTITIAL_ID: "39992",
					BANNER_ID: "39991"
				},
				init: function () {
					this.VIDEO_IDS = {
						default:
							"39996",
						giftBox: "39997",
						healthPoint: "39995",
						freeAnswer: "39994",
						shop: "39993"
					},
						qg.initAdService({
							appId: this.APP_ID,
							isDebug: this.DEBUG,
							success: function (e) {
								console.log("\u5feb\u6e38\u620f\u5e7f\u544a\u521d\u59cb\u5316\u6210\u529f")
							},
							fail: function (e) {
								console.log("\u5feb\u6e38\u620f\u5e7f\u544a\u521d\u59cb\u5316\u5931\u8d25:" + e.code + "-" + e.msg)
							},
							complete: function (e) {
								console.log("\u5feb\u6e38\u620f\u5e7f\u544a\u521d\u59cb\u5316\u5b8c\u6210")
							}
						})
				},
				showBanner: function (e) {
					this.bannerAd = qg.createBannerAd({
						posId: this.BANNER_ID
					}),
						this.bannerAd.onShow(function () {
							console.log("QGAd \u663e\u793aBanner\u6210\u529f."),
								e.success && e.success(120 / cc.winSize.height)
						}),
						this.bannerAd.onError(function (t) {
							console.log("QGAd \u663e\u793aBanner\u5931\u8d25." + t),
								e.fail && e.fail()
						}),
						this.bannerAd.show()
				},
				closeBanner: function () {
					this.bannerAd && this.bannerAd.hide()
				},
				showInterstitialAd: function (e) {
					var t = qg.createInsertAd({
						posId: this.INTERSTITIAL_ID
					});
					t.used = !1,
						t.load(),
						t.onLoad(function () {
							console.log("\u63d2\u5c4f\u5e7f\u544a\u52a0\u8f7d\u6210\u529f"),
								t.used ? console.log("\u63d2\u5c4f - \u6b64\u5e7f\u544a\u5df2\u4f7f\u7528\u8fc7") : (t.used = !0, t.show())
						}),
						t.onError(function (e) {
							console.log("\u63d2\u5c4f\u5e7f\u544a\u52a0\u8f7d\u5931\u8d25" + JSON.stringify(e))
						})
				},
				showVideo: function (e) {
					var t = null == this.VIDEO_IDS[e.videoType] ? this.VIDEO_IDS.
						default :
						this.VIDEO_IDS[e.videoType],
						a = qg.createRewardedVideoAd({
							posId: t
						});
					a.onLoad(function () {
						console.log("QGAd \u6fc0\u52b1\u89c6\u9891\u52a0\u8f7d\u6210\u529f"),
							a.show()
					}),
						a.onVideoStart(function () {
							console.log("QGAd \u6fc0\u52b1\u89c6\u9891\u5f00\u59cb\u64ad\u653e")
						}),
						a.onRewarded(function () {
							console.log("QGAd \u83b7\u5f97\u89c6\u9891\u5956\u52b1"),
								e.success && e.success()
						}),
						a.onError(function (t) {
							console.log("QGAd \u52a0\u8f7d\u89c6\u9891\u5931\u8d25"),
								e.fail && e.fail()
						}),
						a.load()
				}
			}),
			cc._RF.pop()
	},
	{
		BaseAd: "BaseAd"
	}],
	QuickGameDataStore: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "f9f14mEIBlDNpumP1W5IqlH", "QuickGameDataStore"),
			cc.Class({
				extends: e("BaseDataStore")
			}),
			cc._RF.pop()
	},
	{
		BaseDataStore: "BaseDataStore"
	}],
	QuickGameErrorHandler: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "ce641w5V8RMf66ErgABTsKN", "QuickGameErrorHandler"),
			cc.Class({
				extends: e("BaseErrorHandler")
			}),
			cc._RF.pop()
	},
	{
		BaseErrorHandler: "BaseErrorHandler"
	}],
	QuickGamePlatform: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "65ccb9JIdFALYmK6oh6HkYd", "QuickGamePlatform"),
			cc.Class({
				extends: e("BasePlatform")
			}),
			cc._RF.pop()
	},
	{
		BasePlatform: "BasePlatform"
	}],
	RandomSprite: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "0b393Z3o11D6rHQYA1h8LXF", "RandomSprite"),
			cc.Class({
				extends: cc.Component,
				editor: {
					menu: "Effect/RandomSprite"
				},
				properties: {
					row: 1,
					density: 10,
					scaleBy: 0,
					frames: [cc.SpriteFrame]
				},
				onLoad: function () {
					this._contentSize = this.node.getContentSize(),
						this._cellHeight = this._contentSize.height / this.row,
						this._cellWidth = this._contentSize.width / Math.ceil(this.density / this.row);
					for (var e = 1; e <= this.density; e++) {
						var t = new cc.Node;
						t.addComponent(cc.Sprite).spriteFrame = this._randomFrame(),
							t.setPosition(this._randomPos(e)),
							t.scale = 1 + Math.random() * this.scaleBy,
							this.node.addChild(t)
					}
				},
				_randomPos: function (e) {
					var t = e % Math.ceil(this.density / this.row),
						a = Math.ceil(e / Math.ceil(this.density / this.row)),
						i = cc.v2(t * this._cellWidth - this._cellWidth / 2 - this._contentSize.width / 2 + this._cellWidth, a * this._cellHeight - this._cellHeight / 2 - this._contentSize.height / 2);
					return i.x += this._cellWidth / 4 - Math.random() * this._cellWidth / 2,
						i.y += this._cellHeight / 4 - Math.random() * this._cellHeight / 2,
						i
				},
				_randomFrame: function () {
					var e = Math.ceil(Math.random() * this.frames.length);
					return this.frames[e - 1]
				}
			}),
			cc._RF.pop()
	},
	{}],
	ResolutionCanvas: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "3954ctliSRLiZAUWjCIDYM5", "ResolutionCanvas"),
			cc.Class({
				extends: cc.Canvas,
				editor: {
					menu: "Extensions/ResolutionCanvas",
					executeInEditMode: !1
				},
				properties: {},
				onLoad: function () {
					cc.winSize.height / cc.winSize.width < 1.64 && (this.fitHeight = !0)
				},
				applySettings: function () {
					var e, t = cc.ResolutionPolicy;
					e = this.fitHeight && this.fitWidth ? t.SHOW_ALL : this.fitHeight || this.fitWidth ? this.fitWidth ? t.FIXED_WIDTH : t.FIXED_HEIGHT : t.NO_BORDER;
					var a = this._designResolution;
					150 != cc.winSize.height && cc.winSize.height / cc.winSize.width < 1.64 ? cc.view.setDesignResolutionSize(a.width, 16 * a.width / 9, e) : cc.view.setDesignResolutionSize(a.width, a.height, e)
				}
			}),
			cc._RF.pop()
	},
	{}],
	RotateShake: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "86d932rXEJMWZvH8nmIFTbw", "RotateShake");
		var i = cc.Enum({
			default:
				1,
			play: 2
		});
		cc.Class({
			extends: cc.Component,
			editor: {
				menu: "Effect/RotateShake"
			},
			properties: {
				rotationRange: 10,
				rate: .1,
				wait: .5,
				playOnLoad: !0
			},
			onLoad: function () {
				this.state = i.
					default
			},
			start: function () {
				this.playOnLoad && this.play()
			},
			play: function () {
				var e = this;
				this.state != i.play && (this.state = i.play, this.schedule(function () {
					e.node.runAction(cc.sequence(cc.rotateBy(e.rate, e.rotationRange), cc.rotateBy(e.rate, -2 * e.rotationRange), cc.rotateBy(e.rate, 2 * e.rotationRange), cc.rotateBy(e.rate, -e.rotationRange), cc.delayTime(e.wait)))
				},
					4 * this.rate + this.wait))
			},
			stop: function () {
				this.state = i.
					default,
					this.unscheduleAllCallbacks(),
					this.node.angle = 0
			}
		}),
			cc._RF.pop()
	},
	{}],
	SDKBoxAds: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "19a17dVOTVGqrlP52AaAi1s", "SDKBoxAds");
		var i = cc.Enum({
			LOADED: 0,
			LOAD_FAILED: 1,
			CLICKED: 2,
			REWARD_STARTED: 3,
			REWARD_ENDED: 4,
			REWARD_CANCELED: 5,
			AD_STARTED: 6,
			AD_CANCELED: 7,
			AD_ENDED: 8,
			ADACTIONTYPE_UNKNOWN: 9
		}),
			n = cc.Enum({
				REWARDED_VIDEO: "rewarded-video"
			});
		cc.Class({
			extends: e("BaseAd"),
			properties: {
				videoPlacement: "placement-weight-video"
			},
			init: function () {
				if (this._isVideoLoading = !0, this._rewardedVideoSuccess = !1, "undefined" != typeof sdkbox) if (void 0 !== sdkbox.PluginSdkboxAds) {
					var e = this;
					sdkbox.PluginSdkboxAds.setListener({
						onAdAction: function (t, a, r) {
							console.log("[SDKBoxAds]onAdAction:" + String(t) + ":" + String(a) + ":" + String(r)),
								a == n.REWARDED_VIDEO && (r != i.LOADED && r != i.LOAD_FAILED && r != i.ADACTIONTYPE_UNKNOWN || (e._isVideoLoading = !1), r == i.AD_ENDED && (e._rewardedVideoSuccess && "function" == typeof e.videoSuccess && e.videoSuccess(), e._rewardedVideoSuccess || "function" != typeof e.videoAbort || e.videoAbort(), e._isVideoLoading = !0))
						},
						onRewardAction: function (t, a, i, r) {
							console.log("[SDKBoxAds]onRewardAction:" + String(t) + ":" + String(a) + ":" + String(i) + ":" + String(r)),
								a == n.REWARDED_VIDEO && (e._rewardedVideoSuccess = r)
						}
					}),
						sdkbox.PluginSdkboxAds.init()
				} else console.log("[SDKBoxAds]sdkbox.PluginSdkboxAds is undefined,\u8bf7\u68c0\u67e5\u662f\u5426\u5b89\u88c5\u6b63\u786e");
				else cc.warn("[SDKBoxAds]\u672a\u627e\u5230sdkbox,\u8bf7\u68c0\u67e5\u662f\u5426\u5b89\u88c5\u6b63\u786e")
			},
			isVideoLoading: function () {
				return this._isVideoLoading
			},
			isVideoComplete: function () {
				return sdkbox.PluginSdkboxAds.isAvailable(this.videoPlacement)
			},
			showVideo: function (e) {
				"undefined" != typeof sdkbox ? (this._rewardedVideoSuccess = !1, this.videoSuccess = e.success, this.videoAbort = e.abort, this.videoFail = e.fail, sdkbox.PluginSdkboxAds.placement(this.videoPlacement)) : cc.warn("[SDKBoxAds]\u672a\u627e\u5230sdkbox,\u8bf7\u68c0\u67e5\u662f\u5426\u5b89\u88c5\u6b63\u786e")
			}
		}),
			cc._RF.pop()
	},
	{
		BaseAd: "BaseAd"
	}],
	Scale: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "18546vE9spDcpoixzHqj/mn", "Scale"),
			cc.Class({
				extends: cc.Component,
				editor: {
					menu: "Effect/Scale"
				},
				properties: {
					rate: .1,
					radio: .1,
					wait: .5
				},
				start: function () {
					var e = this;
					this.schedule(function () {
						e.node.runAction(cc.sequence(cc.scaleTo(e.rate, 1 + e.radio), cc.scaleTo(e.rate, 1), cc.scaleTo(e.rate, 1 + e.radio), cc.scaleTo(e.rate, 1), cc.delayTime(e.wait)))
					},
						4 * this.rate + this.wait)
				}
			}),
			cc._RF.pop()
	},
	{}],
	SeamBackground: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "e0c31K0fapFfKHEO1lXjMyZ", "SeamBackground"),
			cc.Class({
				extends: e("EasyEvent"),
				editor: {
					menu: "GameModule/Seam/SeamBackground"
				},
				properties: {
					tileContent: cc.Node,
					prbSeamTiledBackground: cc.Prefab,
					endItem: cc.Node
				},
				onLoad: function () {
					var e = this;
					cc.loader.loadResDir("texture/theme/" + UserData.GameData.CurrentMine + "/unlockTileItem", cc.SpriteFrame,
						function (t, a) {
							t ? cc.error("SeamLayerBackground \u52a0\u8f7dTileItem\u9519\u8bef", t) : e._loadTiledBg(a)
						})
				},
				_loadTiledBg: function (e) {
					var t = this,
						a = function (t) {
							for (var a = 0; a < e.length; a++) if (e[a]._name == t) return e[a]
						};
					this.endItem.removeFromParent(!1);
					for (var i = [], n = function () {
						var e = r;
						i.push(cc.callFunc(function () {
							var i = cc.instantiate(t.prbSeamTiledBackground);
							i.setContentSize(cc.size(512, 5 * Constant.SEAM_LAYER_HEIGHT / 2)),
								i.scale = 2,
								i.getComponent(cc.Sprite).spriteFrame = a(e),
								t.tileContent.addChild(i)
						},
							t)),
							i.push(cc.delayTime(.01))
					},
						r = 1; r <= 6; r++) n();
					i.push(cc.callFunc(function () {
						t.tileContent.addChild(t.endItem)
					},
						this)),
						this.tileContent.runAction(cc.sequence(i))
				}
			}),
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent"
	}],
	SeamLayerBarrier: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "d9cafEGDV5PPbhijqZ200FW", "SeamLayerBarrier");
		var i = e("NumberData");
		cc.Class({
			extends: e("EasyEvent").declareEvent("NewSeamLayerUnlock", "SpendSuperCash"),
			editor: {
				menu: "GameModule/Seam/SeamLayerBarrier"
			},
			properties: {
				adVideoButton: e("AdVideoButton"),
				labConsume: cc.Label,
				btnRemove: cc.Button,
				btnSuperCashUnlock: cc.Button,
				labUnlockTime: cc.Label,
				labTotalUnlockTime: cc.Label,
				labSuperCashConsume: cc.Label,
				removeNode: cc.Node,
				timeNode: cc.Node,
				confirmNode: cc.Node,
				shareNode: cc.Node,
				videoNode: cc.Node,
				progressBar: cc.ProgressBar
			},
			_timeToSuperCash: function (e) {
				var t = Math.floor(e / 1e3),
					a = Math.floor(t / 60);
				return t % 60 > 0 && a++,
					a
			},
			init: function (e) {
				this.layerNum = e.layerNum,
					this.adVideoButton.coolDownTag = "Barrier_" + this.layerNum,
					this.layerData = e.layerData,
					this.unlockConsume = CfgMgr.Seam.getUnlockConsume(this.layerNum),
					this.labConsume.string = this.unlockConsume.toString(),
					this.unlockConsumeSuperCash = CfgMgr.Seam.getUnlockTime(this.layerNum),
					this.labSuperCashConsume.string = this.unlockConsumeSuperCash,
					this.unlockTime = 60 * CfgMgr.Seam.getUnlockTime(this.layerNum) * 1e3,
					this.labTotalUnlockTime.string = Tools.timespanFormat(this.unlockTime),
					this.labUnlockTime.string = Tools.timespanFormat(this.unlockTime),
					this._refresh(),
					Platform.shareOrVideo({
						type: "UnlockShaft",
						sharenode: this.shareNode,
						videonode: this.videoNode
					})
			},
			_startCutDown: function () {
				this.layerData.unlockStartTime = (new Date).getTime(),
					this.progressBar.progress = 1
			},
			_scheduleCutDown: function () {
				var e = this;
				this.cutDownSchedule = function () {
					var t = (new Date).getTime() - e.layerData.unlockStartTime,
						a = e.unlockTime - t;
					a <= 0 && (e.unschedule(e.cutDownSchedule), e.layerData.waitForConfirm = !0, e._refresh(), a = 0),
						e.progressBar.progress = a / e.unlockTime,
						e.labUnlockTime.string = Tools.timespanFormat(a),
						e.unlockConsumeSuperCash = e._timeToSuperCash(a),
						e.labSuperCashConsume.string = e.unlockConsumeSuperCash,
						e.btnSuperCashUnlock.interactable = UserData.GameData.SuperCash >= e.unlockConsumeSuperCash
				},
					this.cutDownSchedule(),
					this.schedule(this.cutDownSchedule, 1)
			},
			refresh: function () {
				this._refresh()
			},
			_refresh: function () {
				this.btnSuperCashUnlock.interactable = UserData.GameData.SuperCash >= this.unlockConsumeSuperCash,
					this.removeNode.active = this.layerData.preUnlock && !this.layerData.removeClicked;
				var e = new i(UserData.GameData.TotalCash);
				this.btnRemove.interactable = e.compare(this.unlockConsume) >= 0,
					this.labConsume.node.color = this.btnRemove.interactable ? cc.Color.GREEN : cc.Color.RED,
					this.layerData.removeClicked && !this.layerData.waitForConfirm ? (this.timeNode.active = !0, this._scheduleCutDown()) : this.timeNode.active = !1,
					this.layerData.waitForConfirm && !this.layerData.unlockConfirmed ? this.confirmNode.active = !0 : this.confirmNode.active = !1
			},
			removed: function () {
				this.node.destroy()
			},
			confirmPanelClick: function (e, t) {
				Music.play("STING_Unlock Mine Barrier"),
					this.layerData.unlockConfirmed = !0,
					this.removed()
			},
			btnRemoveClick: function (e, t) {
				Music.play("SFX_Start Unlocking Barrier"),
					this.publishEvent({
						type: "SpendCash",
						cashNum: this.unlockConsume
					}),
					UserData.GameData.Analytics.FirstRemoveBarrier || (UserData.GameData.Analytics.FirstRemoveBarrier = !0, Analysis.sendEvent({
						type: "FirstRemoveBarrier"
					})),
					Analysis.sendEvent({
						type: "RemoveBarrier"
					}),
					this.layerData.removeClicked = !0,
					this._startCutDown(),
					this._refresh()
			},
			btnVideoClick: function (e, t) {
				var a = this;
				Ad.showVideo({
					type: "UnlockShaft",
					success: function (e) {
						e && e.virtual || Analysis.sendEvent({
							type: "UnlockShaftAdSuccess"
						}),
							console.log("ad video show success"),
							a.layerData.unlockStartTime -= 18e5
					},
					fail: function (e) {
						console.log("ad video show failed :" + e)
					}
				})
			},
			btnShareClick: function (e, t) {
				var a = this;
				Platform.chooseContext({
					type: "UnlockShaft",
					success: function (e) {
						console.log("ad video show success"),
							a.layerData.unlockStartTime -= 18e5
					},
					fail: function (e) {
						console.log("ad video show failed :" + e),
							e && Platform.showToast({
								title: e
							})
					}
				})
			},
			btnSuperCashUnlockClick: function (e, t) {
				Music.play("SFX_Button General"),
					this.publishEvent({
						type: "SpendSuperCash",
						superCashNum: this.unlockConsumeSuperCash
					}),
					this.layerData.waitForConfirm = !0,
					this._refresh()
			},
			onCashChanged: function (e) {
				this._refresh()
			},
			onSuperCashChanged: function (e) {
				this._refresh()
			}
		}),
			cc._RF.pop()
	},
	{
		AdVideoButton: "AdVideoButton",
		EasyEvent: "EasyEvent",
		NumberData: "NumberData"
	}],
	SeamLayerLock: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "2d496WvIDNF/5VElPh+uZZY", "SeamLayerLock");
		var i = e("NumberData");
		cc.Class({
			extends: e("EasyEvent").declareEvent("NewSeamLayerUnlock"),
			editor: {
				menu: "GameModule/Seam/SeamLayerLock"
			},
			properties: {
				labUnlockCost: cc.Label,
				btnUnlock: cc.Button,
				labUnlockSuperCashCost: cc.Label,
				btnUnlockBySuperCash: cc.Button
			},
			init: function (e) {
				this.commonData = UserData.getMineDataRef("Common"),
					this.layerNum = e.layerNum,
					this.layerData = e.layerData,
					1 == this.layerNum && (this.btnUnlockBySuperCash.node.active = !1),
					this.unlockConsume = CfgMgr.Seam.getUpgradeConsume(0, 1, this.layerNum),
					this.labUnlockCost.string = this.unlockConsume.toString(),
					1 != this.layerNum || this.layerData.unlock || (this.layerData.preUnlock = !0),
					this._refresh(),
					this.prestige = UserData.getMineDataRef("Prestige"),
					this.node.active = 2 != this.layerNum || this.commonData.initStep >= 3.5 || 1 != UserData.GameData.CurrentMine || this.prestige.time > 0
			},
			_refresh: function () {
				var e = new i(UserData.GameData.TotalCash);
				if (this.btnUnlock.interactable = this.unlockConsume.compare(e) <= 0, "UnlockSeamLayer2" == Tutorial.currentTutorial && 2 == this.layerNum) this.unlockSuperCashConsume = 0,
					this.labUnlockSuperCashCost.string = this.unlockSuperCashConsume,
					this.btnUnlockBySuperCash.interactable = this.unlockSuperCashConsume <= UserData.GameData.SuperCash;
				else {
					var t = CfgMgr.Common.getImmediateCashPrice(),
						a = CfgApi.get("AllMines"),
						n = new i(0),
						r = a[UserData.GameData.CurrentMine].init_currency_type;
					for (var o in a) a[o].init_currency_type == r && n.add(IdleCashMgr.getInlineCash(a[o].miner, !0));
					n.mult(3600),
						n.mult(Math.sqrt(ItemMgr.getActiveItemEffect() * ItemMgr.getAdEffect()));
					var s = CfgMgr.Seam.getSuperCashUnlockMinConsume(),
						c = CfgMgr.Seam.getSuperCashUnlockMaxConsume();
					if (0 != n.compare(0)) {
						var l = this.unlockConsume.clone().divi(n).mult(t);
						l.compare(c) > 0 ? this.unlockSuperCashConsume = c : l.compare(s) < 0 ? this.unlockSuperCashConsume = s : this.unlockSuperCashConsume = l.floor().toNumber()
					} else this.unlockSuperCashConsume = c;
					this.unlockSuperCashConsume = parseInt(this.unlockSuperCashConsume),
						this.labUnlockSuperCashCost.string = this.unlockSuperCashConsume,
						this.btnUnlockBySuperCash.interactable = this.unlockSuperCashConsume <= UserData.GameData.SuperCash
				}
			},
			unlock: function () {
				this.layerData.unlock = !0,
					Music.play("SFX_Create New Shaft"),
					UserData.GameData.Analytics.FirstUnlockSeam || (UserData.GameData.Analytics.FirstUnlockSeam = !0, Analysis.sendEvent({
						type: "FirstUnlockShaft"
					})),
					Analysis.sendEvent({
						type: "UnlockShaftTotalTime"
					}),
					Analysis.sendEvent({
						type: "UnlockShaft",
						data: {
							mine: UserData.GameData.CurrentMine,
							layerNum: this.layerNum
						}
					}),
					this.publishEvent({
						type: "NewSeamLayerUnlock",
						layerNum: this.layerNum
					}),
					this.publishEvent({
						type: "CheckBottleNeck",
						target: this
					}),
					2 == this.layerNum && this.commonData.initStep < 5 && this.publishEvent({
						type: "InitStepMoveForward",
						currentStep: 5
					}),
					3 == this.layerNum && this.commonData.initStep < 5.5 && this.publishEvent({
						type: "InitStepMoveForward",
						currentStep: 5.5
					}),
					4 == this.layerNum && this.commonData.initStep < 5.6 && this.publishEvent({
						type: "InitStepMoveForward",
						currentStep: 5.6
					}),
					10 == this.layerNum && this.commonData.initStep < 6 && this.publishEvent({
						type: "InitStepMoveForward",
						currentStep: 6
					})
			},
			btnUnlockByCashClick: function (e, t) {
				this.publishEvent({
					type: "SpendCash",
					cashNum: this.unlockConsume
				}),
					this.unlock()
			},
			btnUnlockBySuperCashClick: function (e, t) {
				this.publishEvent({
					type: "SpendSuperCash",
					superCashNum: this.unlockSuperCashConsume
				}),
					this.unlock()
			},
			onCashChanged: function (e) {
				this._refresh()
			},
			onSuperCashChanged: function (e) {
				this._refresh()
			},
			onNewSeamLayerUnlock: function (e) {
				e.layerNum == this.layerNum && this.node.destroy()
			},
			onInitStepMoveForward: function (e) {
				1 == UserData.GameData.CurrentMine && 0 == this.prestige.time && 2 == this.layerNum && (3.5 == e.currentStep && (this.node.active = !0, this.btnUnlockBySuperCash.node.active = !1), 4 == e.currentStep && (this.btnUnlockBySuperCash.node.active = !0))
			}
		}),
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent",
		NumberData: "NumberData"
	}],
	SeamLayerRoom: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "30283sMliBLXbmry/zdOV1P", "SeamLayerRoom");
		var i = e("NumberData"),
			n = e("PrisonerManager");
		cc.Class({
			extends: e("EasyEvent").declareEvent("SeamWorkerGoToWork", "InitStepMoveForward", "SeamMineNumChanged", "ReviewStepMoveForward"),
			editor: {
				menu: "GameModule/Seam/SeamLayerRoom"
			},
			properties: {
				tapMark: cc.Node,
				tapMarkManager: cc.Node,
				renderComponents: [cc.Sprite],
				labels: [cc.Label],
				prbSeamLogicWorker: cc.Prefab,
				labCash: cc.Label,
				prbManager: cc.Prefab,
				managerNode: cc.Node,
				crateAniNode: cc.Node,
				collectedGold: cc.Node,
				liveFloor: e("SeamLivePlane"),
				floorItemsRoot: cc.Node,
				liveRoof: e("SeamLivePlane"),
				labLayerNum: cc.Label,
				prbBtnUpgrade: cc.Prefab,
				btnUpgradeNode: cc.Node,
				fallen: e("ThemeFallen")
			},
			onLoad: function () {
				this.prestige = UserData.getMineDataRef("Prestige"),
					this.floorItemsRoot.children.forEach(function (e) {
						e.active = !1
					}),
					this.tapMark.parent.zIndex = cc.macro.MAX_ZINDEX,
					this._someOneStoppedWork = !0
			},
			start: function () {
				this.btnUpgrade = cc.instantiate(this.prbBtnUpgrade),
					this.btnUpgradeNode.addChild(this.btnUpgrade),
					this.btnUpgrade.getComponent("BtnUpgrade").initData(this.layerData.level, !1, n.EnumMinerBranch.Seam, this.layerNum),
					this.btnUpgrade.active = this.commonData.initStep >= 2.5 || 1 != UserData.GameData.CurrentMine || this.prestige.time > 0,
					this.contentCameraPosY = cc.winSize.height / 2,
					this._updateTapMark()
			},
			init: function (e) {
				this.layerNum = e.layerNum,
					this.labLayerNum.string = this.layerNum,
					this.layerData = e.layerData,
					this.layerData.upgradeConsumeCache = {},
					this.layerData.workerAbilityCache = {},
					this.commonData = UserData.getMineDataRef("Common"),
					this.layerData.superCash = this.layerData.superCash || 0,
					this.layerData.managerSkillMoveSpeedUp = 1,
					this.layerData.managerSkillDigSpeedUp = 1,
					this.layerData.managerSkillUpgradeDiscount = 1,
					this.managerButton = cc.instantiate(this.prbManager),
					this.managerButton.getChildByName("main").scaleX = -1,
					this.managerButton.getComponent("PrisonerManager").minerBranch = n.EnumMinerBranch.Seam,
					this.managerButton.getComponent("PrisonerManager").setMinerId(this.layerNum),
					this.managerButton.parent = this.managerNode,
					this.managerButton.setPosition(cc.v2(50, 45)),
					this.mineNum = new i(this.layerData.mineNum || 0),
					this.baseDistancePos = [cc.v2(145, 200), cc.v2(72, 160), cc.v2(200, 260), cc.v2(- 145, 200), cc.v2(- 72, 160), cc.v2(- 200, 260)];
				for (var t = this.floorItemsRoot.getChildByName("Level_" + Math.ceil(this.layerNum / 6)); t.children.length > 0;) {
					var a = t.children[0];
					a.removeFromParent(),
						a.zIndex = cc.macro.MAX_ZINDEX,
						a.parent = this.liveFloor.node;
					var r = a.getComponent(cc.Sprite);
					r && this.renderComponents.push(r)
				}
				this.workerNum = 0;
				var o = CfgMgr.Seam.getWorkerNumByLevel(this.layerData.level);
				this.workers = [],
					this._addWorker(o),
					this.managerButton.active = this.commonData.initStep >= 3,
					this._refresh()
			},
			_updateTapMark: function () {
				this.tapMark.active = !this.layerData.haveManager && this.commonData.initStep >= 2.6 && this._someOneStoppedWork && null == Tutorial.currentTutorial && (!this._affordManager || this.commonData.initStep < 3) && (!this.reviewStep || 1 == this.reviewStep),
					this.tapMarkManager.active = !this.layerData.haveManager && this.commonData.initStep >= 3 && this._affordManager && null == Tutorial.currentTutorial
			},
			_enableRender: function () {
				this.labels.forEach(function (e) {
					e.node.active = !0
				}),
					this.renderComponents.forEach(function (e) {
						e.enabled = !0
					}),
					this.workers.forEach(function (e) {
						e.enabledRender()
					}),
					this.managerButton.getComponent("PrisonerManager").enabledRender(),
					this.btnUpgrade && (this.btnUpgrade.active = this.commonData.initStep >= 2.5 || 1 != UserData.GameData.CurrentMine || this.prestige.time > 0)
			},
			_disableRender: function () {
				this.labels.forEach(function (e) {
					e.node.active = !1
				}),
					this.renderComponents.forEach(function (e) {
						e.enabled = !1
					}),
					this.workers.forEach(function (e) {
						e.disabledRender()
					}),
					this.managerButton.getComponent("PrisonerManager").disabledRender(),
					this.btnUpgrade && (this.btnUpgrade.active = !1)
			},
			_refresh: function () {
				this.labCash.string = this.mineNum.length > 2 ? this.mineNum.toString() : this.mineNum.toString(0),
					this.layerData.mineNum = this.mineNum.toNumber(),
					this.collectedGold.active = this.mineNum.compare(new i(0)) > 0
			},
			_addWorker: function (e) {
				for (var t = this,
					a = [], i = function () {
						var e = n;
						a.push(cc.delayTime(.05)),
							a.push(cc.callFunc(function () {
								var a = cc.instantiate(t.prbSeamLogicWorker);
								t.workers.push(a.getComponent("SeamLogicWorker")),
									a.getComponent("SeamLogicWorker").init({
										layerNum: t.layerNum,
										layerData: t.layerData,
										baseDistancePos: t.baseDistancePos[e]
									}),
									a.parent = t.liveFloor.node
							},
								t))
					},
					n = this.workerNum; n < this.workerNum + e; n++) i();
				a.length > 1 && this.node.runAction(cc.sequence(a)),
					this.workerNum += e
			},
			applyManagerSkill: function (e) {
				var t = CfgMgr.Manager.getManagerDataById(e);
				switch (t.skill_type) {
					case 1:
						this.layerData.managerSkillMoveSpeedUp = t.skill_param;
						break;
					case 2:
						this.layerData.managerSkillDigSpeedUp = t.skill_param;
						break;
					case 3:
						this.layerData.managerSkillUpgradeDiscount = 1 - t.skill_param
				}
			},
			removeManagerSkill: function () {
				this.layerData.managerSkillMoveSpeedUp = 1,
					this.layerData.managerSkillDigSpeedUp = 1,
					this.layerData.managerSkillUpgradeDiscount = 1
			},
			calcUpgradeData: function (e) {
				var t = {
					title: Language.getName("Mine Shaft Details")
				};
				t.childName = Language.getName("Mine Shaft") + " B" + this.layerNum,
					t.superCash = this.layerData.superCash,
					t.isMaxLevel = this.layerData.level == CfgMgr.Seam.getMaxLevel();
				var a = this.layerData.level;
				if (t.isMaxLevel) t.limitLevel = 0,
					t.money = new i(0),
					t.startLevel = this.layerData.level,
					t.endLevel = this.layerData.level,
					t.curLevel = this.layerData.level,
					t.progress = 0,
					t.upgradeLevel = this.layerData.level,
					t.cashNum = 0;
				else {
					if (e != LevelUpMode.LV_MAX) e == LevelUpMode.LV_X1 ? a = this.layerData.level + 1 : e == LevelUpMode.LV_X10 ? a = this.layerData.level + 10 : e == LevelUpMode.LV_X50 && (a = this.layerData.level + 50),
						t.money = CfgMgr.Seam.getUpgradeConsume(this.layerData.level, a, this.layerNum).mult(this.layerData.managerSkillUpgradeDiscount);
					else {
						var n = CfgMgr.Seam.getMaxLevelAbleGradeTo(this.layerData.level, this.layerNum, new i(UserData.GameData.TotalCash), this.layerData.managerSkillUpgradeDiscount);
						t.money = n.consume,
							a = n.maxLevel
					}
					a = Math.min(a, CfgMgr.Seam.getMaxLevel()),
						t.limitLevel = a - this.layerData.level;
					var r = CfgMgr.Seam.getLevelRange(this.layerData.level, this.layerNum);
					t.startLevel = r.startLevel,
						t.endLevel = r.endLevel,
						t.curLevel = this.layerData.level,
						t.progress = (this.layerData.level - r.startLevel) / (r.endLevel - r.startLevel),
						t.upgradeLevel = r.endLevel;
					var o = CfgMgr.Seam.getRewardOfRange(this.layerData.level, this.layerNum, this.prestige.time),
						s = CfgMgr.Seam.getRewardOfRange(a, this.layerNum, this.prestige.time);
					s - o == 0 && (s = CfgMgr.Seam.getRewardOfRange(r.endLevel, this.layerNum, this.prestige.time)),
						t.cashNum = s - o
				}
				var c = this.workerNum,
					l = CfgMgr.Seam.getWorkerNumByLevel(a),
					d = CfgMgr.Seam.getWorkerSpeedByLevel(this.layerData.level) * this.layerData.managerSkillMoveSpeedUp,
					h = CfgMgr.Seam.getWorkerSpeedByLevel(a) * this.layerData.managerSkillMoveSpeedUp,
					u = void 0,
					m = void 0;
				u = CfgMgr.Seam.getWorkerAbility(this.layerNum, this.layerData.level),
					m = CfgMgr.Seam.getWorkerAbility(this.layerNum, a);
				var g = u.clone().divi(CfgMgr.Seam.getExcavateTime()).mult(this.layerData.managerSkillDigSpeedUp),
					p = m.clone().divi(CfgMgr.Seam.getExcavateTime()).mult(this.layerData.managerSkillDigSpeedUp),
					f = u.clone().mult(c).divi(CfgMgr.Seam.getExcavateTime() / this.layerData.managerSkillDigSpeedUp + CfgMgr.Seam.getWorkerMoveDur(this.layerData.level) / this.layerData.managerSkillMoveSpeedUp * 2),
					v = m.clone().mult(c).divi(CfgMgr.Seam.getExcavateTime() / this.layerData.managerSkillDigSpeedUp + CfgMgr.Seam.getWorkerMoveDur(a) / this.layerData.managerSkillMoveSpeedUp * 2),
					_ = [u.length > 2 ? u.toString() : u.toString(0), g.toString() + "/s", c, d, f.toString() + "/s"],
					y = [1, 1, 1, 1, 1],
					b = h - d;
				if (0 == b) {
					y[3] = 0;
					var S = CfgMgr.Seam.getSpeedNextUpgradeLevel(this.layerData.level);
					b = S == this.layerData.level ? Language.getName("Max") : Language.getName("Next boost at Level") + " " + S
				} else b = "+" + b;
				var C = l - c;
				if (0 == C) {
					y[2] = 0;
					var D = CfgMgr.Seam.getWorkerNumNextUpgradeLevel(this.layerData.level);
					C = D == this.layerData.level ? Language.getName("Max") : Language.getName("Next boost at Level") + " " + D
				} else C = "+" + C;
				t.isMaxLevel && (y[0] = 0, y[1] = 0, y[2] = 0, y[3] = 0, y[4] = 0);
				var w = m.clone().remove(u),
					A = [t.isMaxLevel ? Language.getName("Max") : "+" + (w.length > 2 ? w.toString() : w.toString(0)), t.isMaxLevel ? Language.getName("Max") : "+" + p.clone().remove(g).toString(), C, b, t.isMaxLevel ? Language.getName("Max") : "+" + v.remove(f)];
				t.properties = [];
				for (var M = ["Miner Capacity", "Mining Speed", "Miners", "Walking Speed", "Total Extraction"], E = [0, 0, 0, 0, 0], k = [5, 4, 2, 3, 1], I = 0; I < M.length; I++) {
					var T = {
						proName: Language.getName(M[I]),
						valNow: _[I],
						valNext: A[I],
						coinflag: E[I],
						iconId: k[I],
						colorState: y[I]
					};
					t.properties.push(T)
				}
				return t
			},
			onAskSeamForMine: function (e) {
				if (this.layerNum == e.layerNum) {
					var t = {
						mineNum: this.mineNum,
						layerNum: this.layerNum
					};
					"function" == typeof e.callback && (e.target ? e.callback.call(e.target, t) : e.callback(t))
				}
			},
			onSeamWorkerGoToWork: function (e) {
				e.layerNum == this.layerNum && (this._someOneStoppedWork = !1, this._updateTapMark())
			},
			onSeamWorkerWorkIsOver: function (e) {
				e.layerNum == this.layerNum && (this._someOneStoppedWork = !0, this._updateTapMark())
			},
			onLevelUpSeam: function (e) {
				if (e.minerId == this.layerNum) {
					UserData.GameData.Analytics.FirstUpgradeSeam || (UserData.GameData.Analytics.FirstUpgradeSeam = !0, Analysis.sendEvent({
						type: "FirstUpgradeShaft"
					})),
						this.layerData.level += e.addLevel,
						Analysis.sendEvent({
							type: "UpgradeShaft",
							data: {
								mine: UserData.GameData.CurrentMine,
								layerNum: this.layerNum,
								level: this.layerData.level
							}
						});
					var t = CfgMgr.Seam.getWorkerNumByLevel(this.layerData.level);
					t > this.workerNum && this._addWorker(t - this.workerNum),
						1 == this.layerNum && this.layerData.level >= 2 && this.commonData.initStep < 2.6 && this.publishEvent({
							type: "InitStepMoveForward",
							currentStep: 2.6
						}),
						1 == this.layerNum && 2 == this.layerData.level && 1 == UserData.GameData.CurrentMine && 0 == this.prestige.time && (this.reviewStep = 1, this.mineNum.compare(0) > 0 && this.publishEvent({
							type: "ReviewStepMoveForward",
							step: 2
						}), this._updateTapMark()),
						1 == this.layerNum && this.layerData.level >= 4 && this.commonData.initStep < 3 && this.publishEvent({
							type: "InitStepMoveForward",
							currentStep: 3
						}),
						1 == this.layerNum && this.layerData.level >= 5 && this.commonData.initStep < 3.5 && this.publishEvent({
							type: "InitStepMoveForward",
							currentStep: 3.5
						}),
						1 == this.layerNum && this.layerData.level >= 10 && this.commonData.initStep < 4 && this.publishEvent({
							type: "InitStepMoveForward",
							currentStep: 4
						})
				}
			},
			onReviewStepMoveForward: function (e) {
				this.reviewStep = e.step,
					this._updateTapMark()
			},
			onMoveMineFromSeam: function (e) {
				var t = this;
				this.layerNum == e.layerNum && (this.mineNum.remove(e.mineNum), this.crateAniNode.runAction(cc.sequence(cc.rotateTo(.2, 30), cc.callFunc(function () {
					t.fallen.play()
				},
					this), cc.delayTime(e.spendTime), cc.callFunc(function () {
						t.fallen.stop(),
							t._refresh()
					},
						this), cc.rotateTo(.2, 0))))
			},
			onSeamWorkerPutMineInCrate: function (e) {
				this.layerNum == e.layerNum && (this.mineNum.add(e.mineNum), this._refresh(), this.publishEvent({
					type: "SeamMineNumChanged"
				}), 1 == this.layerNum && 0 == this.commonData.initStep && this.publishEvent({
					type: "InitStepMoveForward",
					currentStep: 1
				}), 1 == this.reviewStep && this.publishEvent({
					type: "ReviewStepMoveForward",
					step: 2
				}))
			},
			onManagerStateChangeSeam: function (e) {
				e.minerId == this.layerNum && (this.layerData.haveManager = e.state, this._updateTapMark(), this.layerData.haveManager && this.publishEvent({
					type: "SeamWorkerGoToWork",
					layerNum: this.layerNum,
					commandType: "Manager"
				}))
			},
			onRequestLevelUpDataSeam: function (e) {
				if (e.minerId == this.layerNum && "function" == typeof e.callback) {
					var t = this.calcUpgradeData(e.levelUpMode);
					e.callback.call(e.target, t)
				}
			},
			onRequestUpgradeNeedMoneySeam: function (e) {
				if (e.minerId == this.layerNum && "function" == typeof e.callback) {
					var t = this.calcUpgradeData(e.levelUpMode);
					e.callback.call(e.target, t)
				}
			},
			onManagerSkillStateChange: function (e) {
				e.minerBranch == n.EnumMinerBranch.Seam && e.minerId == this.layerNum && (e.state == ManagerSkillState.MS_USING ? this.applyManagerSkill(e.tabId) : e.state == ManagerSkillState.MS_CD ? this.removeManagerSkill() : e.state == ManagerSkillState.MS_IDLE && this.removeManagerSkill())
			},
			onInitStepMoveForward: function (e) {
				this._updateTapMark(),
					this.managerButton.active = e.currentStep >= 3,
					this.btnUpgrade && (this.btnUpgrade.active = e.currentStep >= 2.5 || 1 != UserData.GameData.CurrentMine || this.prestige.time > 0)
			},
			onAddSeamSuperCash: function (e) {
				e.minerId == this.layerNum && (this.layerData.superCash += e.cashNum)
			},
			onSubSeamSuperCash: function (e) {
				e.minerId == this.layerNum && (this.layerData.superCash -= e.cashNum)
			},
			onMainScrollViewScrolling: function (e) {
				this.contentCameraPosY = e.contentCameraPosY;
				var t = this.node.parent.convertToWorldSpaceAR(this.node);
				Math.abs(t.y - e.contentCameraPosY) > Constant.SEAM_LAYER_HEIGHT / 2 + cc.winSize.height / 2 ? this._disableRender() : this._enableRender()
			},
			onAffordManager: function (e) {
				e.minerBranch == n.EnumMinerBranch.Seam && e.minerId == this.layerNum && (this._affordManager = !0, this._updateTapMark())
			},
			onNoAffordManager: function (e) {
				e.minerBranch == n.EnumMinerBranch.Seam && e.minerId == this.layerNum && (this._affordManager = !1, this._updateTapMark())
			},
			onTutorialEnd: function (e) {
				this._updateTapMark()
			}
		}),
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent",
		NumberData: "NumberData",
		PrisonerManager: "PrisonerManager",
		SeamLivePlane: "SeamLivePlane",
		ThemeFallen: "ThemeFallen"
	}],
	SeamLayerRoot: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "99484MpU2hAdpntWEbepuB2", "SeamLayerRoot");
		e("NumberData"),
			e("PrisonerManager");
		cc.Class({
			extends: e("EasyEvent"),
			editor: {
				menu: "GameModule/Seam/SeamLayerRoot"
			},
			properties: {
				roomNode: cc.Node,
				prbRoom: cc.Prefab,
				lockNode: cc.Node,
				prbLock: cc.Prefab,
				barrierNode: cc.Node,
				prbBarrier: cc.Prefab,
				friendInfoNode: cc.Node,
				prbFriendInfo: cc.Prefab,
				boom: cc.ParticleSystem
			},
			onLoad: function () {
				this.node.opacity = 0,
					this.node.runAction(cc.fadeIn(.3))
			},
			start: function () {
				this.prestige = UserData.getMineDataRef("Prestige"),
					1 != this.layerNum || 1 != UserData.GameData.CurrentMine || this.layerData.unlock || 0 != this.prestige.time || (Analysis.sendEvent({
						type: "guide_type",
						num: 1,
						data: {
							type: "step1"
						}
					}), this.publishEvent({
						type: "ShowTutorial",
						tutorial: "Start"
					})),
					this.node.zIndex = 30 - this.layerNum,
					this.node.y = -((this.layerNum - .5) * Constant.SEAM_LAYER_HEIGHT + Constant.SEAM_START_ITEM_HEIGHT)
			},
			init: function (e) {
				this.layerNum = e.layerNum,
					this.layerData = e.layerData,
					this.layerData.level || (this.layerData.level = 1),
					this.friendInfo = cc.instantiate(this.prbFriendInfo),
					this.friendInfoNode.addChild(this.friendInfo),
					this.friendInfo.getComponent("FriendInfo").init({
						layerNum: this.layerNum
					}),
					this._refresh()
			},
			_refresh: function () {
				CfgMgr.Seam.getUnlockTime(this.layerNum) > 0 && !this.layerData.unlockConfirmed ? this.barrier ? this.barrier.getComponent("SeamLayerBarrier").refresh() : (this.lock = cc.instantiate(this.prbLock), this.lockNode.addChild(this.lock), this.lock.getComponent("SeamLayerLock").init({
					layerNum: this.layerNum,
					layerData: this.layerData
				}), this.barrier = cc.instantiate(this.prbBarrier), this.barrierNode.addChild(this.barrier), this.barrier.getComponent("SeamLayerBarrier").init({
					layerNum: this.layerNum,
					layerData: this.layerData
				})) : this.layerData.unlock && !this.room ? (this.room = cc.instantiate(this.prbRoom), this.roomNode.addChild(this.room), this.room.getComponent("SeamLayerRoom").init({
					layerNum: this.layerNum,
					layerData: this.layerData
				}), 3 == this.layerNum && UserData.getMineDataRef("Common").initStep < 5.5 && this.publishEvent({
					type: "InitStepMoveForward",
					currentStep: 5.5
				})) : 1 != this.layerNum && !this.layerData.preUnlock || this.lock || (this.lock = cc.instantiate(this.prbLock), this.lockNode.addChild(this.lock), this.lock.getComponent("SeamLayerLock").init({
					layerNum: this.layerNum,
					layerData: this.layerData
				}))
			},
			onNewSeamLayerUnlock: function (e) {
				this.layerNum == e.layerNum && (this._refresh(), this.boom.resetSystem()),
					this.layerNum - e.layerNum == 1 && (this.layerData.preUnlock = !0, this._refresh())
			},
			onMainScrollViewScrolling: function (e) {
				var t = this.node.parent.convertToWorldSpaceAR(this.node);
				Math.abs(t.y - e.contentCameraPosY) > Constant.SEAM_LAYER_HEIGHT / 2 + cc.winSize.height / 2 ? this.friendInfoNode.active = !1 : this.friendInfoNode.active = !0
			}
		}),
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent",
		NumberData: "NumberData",
		PrisonerManager: "PrisonerManager"
	}],
	SeamLiveBackground: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "efb60JXYEhHIaNoFvd0RR+t", "SeamLiveBackground"),
			cc.Class({
				extends: e("EasyEvent"),
				editor: {
					menu: "GameModule/Seam/SeamLiveBackground"
				},
				properties: {},
				onLoad: function () {
					this.offset = 0,
						this.originPosY = this.node.y
				},
				start: function () {
					var e = this;
					this.scheduleOnce(function () {
						e.onMainScrollViewScrolling({
							contentCameraPosY: cc.winSize.height / 2
						})
					},
						.01)
				},
				_applyOffset: function (e) {
					var t = this.node.parent.parent.convertToWorldSpaceAR(this.node.parent.getPosition());
					this.offset = -(t.y - e) / Constant.PERSPECTIVE_EFFECT,
						this.node.y = this.originPosY + this.offset,
						this.node.active = Math.abs(this.offset * Constant.PERSPECTIVE_EFFECT) <= cc.winSize.height / 2 + Constant.SEAM_LAYER_HEIGHT / 2
				},
				onMainScrollViewScrolling: function (e) {
					this._applyOffset(e.contentCameraPosY)
				}
			}),
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent"
	}],
	SeamLivePlane: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "f6a5fp8CeRAiLFJfaUEch/S", "SeamLivePlane");
		var i = cc.Enum({
			UP: 0,
			DOWN: 1
		});
		cc.Class({
			extends: e("EasyEvent"),
			editor: {
				menu: "GameModule/Seam/SeamLivePlane"
			},
			properties: {
				growDirection: {
					default:
						i.DOWN,
					type: i
				},
				hideWhenFliped: !1
			},
			onLoad: function () {
				this.offset = 0,
					this.originSize = this.node.getContentSize(),
					this.renderComponent = this.node.getComponent(cc.Sprite)
			},
			start: function () {
				this.onMainScrollViewScrolling({
					contentCameraPosY: cc.winSize.height / 2
				})
			},
			_applyOffset: function (e) {
				var t = this.node.parent.parent.convertToWorldSpaceAR(this.node.parent.getPosition());
				this.offset = -(t.y - e) / Constant.PERSPECTIVE_EFFECT;
				var a = void 0;
				a = (a = this.growDirection == i.DOWN ? this.originSize.height + this.offset : this.originSize.height - this.offset) < 0 && this.hideWhenFliped ? 0 : a,
					this.node.setContentSize(cc.size(this.originSize.width, a)),
					this.renderComponent && (this.renderComponent.enabled = Math.abs(this.offset * Constant.PERSPECTIVE_EFFECT) <= cc.winSize.height / 2 + Constant.SEAM_LAYER_HEIGHT / 2)
			},
			onMainScrollViewScrolling: function (e) {
				this._applyOffset(e.contentCameraPosY)
			}
		}),
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent"
	}],
	SeamLogicWorker: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "c9091eGarhL8I+fHU6kS1dp", "SeamLogicWorker");
		var i = cc.Enum({
			IDLE: 0,
			WALK_TO_MINE: 1,
			WALK_TO_CRATE: 2,
			WORK: 3
		});
		cc.Class({
			extends: e("EasyEvent").declareEvent("SeamWorkerPutMineInCrate", "SeamWorkerWorkIsOver"),
			editor: {
				menu: "GameModule/Seam/SeamLogicWorker"
			},
			statics: {
				WorkerStat: i
			},
			properties: {
				_renderWorker: null
			},
			start: function () {
				var e = this;
				this._stat = i.IDLE,
					this.node.on(cc.Node.EventType.TOUCH_START,
						function (t) {
							Music.play("SFX_Tap Inactive Worker"),
								e.publishEvent({
									type: "SeamWorkerGoToWork",
									layerNum: e.layerNum,
									commandType: "Tap"
								})
						},
						this),
					this.layerNum < 3 && this.enabledRender(),
					this.layerData.haveManager && this.startWorkCircle()
			},
			enabledRender: function () {
				this._enabledRender || (this._enabledRender = !0, this._renderWorker = SeamWorkerPool.get(), this.node.addChild(this._renderWorker), this._renderWorker.getComponent("SeamRenderWorker").setOriginScaleX(this.baseDistancePos.x > 0 ? 1 : -1), this._renderWorker.getComponent("SeamRenderWorker").setStat(this._stat || i.IDLE, 1))
			},
			disabledRender: function () {
				this._enabledRender = !1,
					this._renderWorker && (this._renderWorker.getComponent("SeamRenderWorker").unscheduleAllCallbacks(), SeamWorkerPool.put(this._renderWorker), this._renderWorker = null)
			},
			update: function () {
				this._updatePos()
			},
			init: function (e) {
				this.layerNum = e.layerNum,
					this.layerData = e.layerData,
					this.baseDistancePos = e.baseDistancePos,
					this._randomPos(),
					this._refresh()
			},
			_randomPos: function () {
				this.node.x = 20 * Math.random() - 10 - 20,
					this.node.y = Constant.SEAM_FLOOR_BASE_HEIGHT - 5 - 50 * Math.random(),
					this.cratePos = this.node.getPosition(),
					this.originPos = this.node.getPosition(),
					this.logicPos = this.node.getPosition()
			},
			_updatePos: function () {
				this.parentSize = this.node.parent.getContentSize();
				var e = this.parentSize.height / Constant.SEAM_FLOOR_BASE_HEIGHT;
				this.node.y = this.logicPos.y * e,
					this.node.x = this.logicPos.x,
					this.node.zIndex = this.parentSize.height - this.node.y
			},
			_refresh: function () {
				this.ability = CfgMgr.Seam.getWorkerAbility(this.layerNum, this.layerData.level),
					this.speedValue = 2,
					this.distanceValue = CfgMgr.Seam.getWorkerMoveDistance(this.layerData.level),
					this.minePos = cc.v2(this.baseDistancePos.x + (this.baseDistancePos.x - this.cratePos.x) * this.distanceValue / 15, this.baseDistancePos.y + (this.baseDistancePos.y - this.cratePos.y) * this.distanceValue / 15),
					this.excavateTime = CfgMgr.Seam.getExcavateTime(),
					this.moveDur = CfgMgr.Seam.getWorkerMoveDur(this.layerData.level) + Math.random() / 20
			},
			_stepMoveTo: function (e, t, a) {
				var i = this,
					n = (t.y - this.logicPos.y) / e;
				this.schedule(function e(a) {
					i.logicPos.y += n * a,
						(n > 0 && i.logicPos.y > t.y || n < 0 && i.logicPos.y < t.y) && (i.logicPos.y = t.y, i.unschedule(e, .01))
				},
					.01);
				var r = (t.x - this.logicPos.x) / e;
				this.schedule(function e(n) {
					i.logicPos.x += r * n,
						(r > 0 && i.logicPos.x > t.x || r < 0 && i.logicPos.x < t.x) && (i.logicPos.x = t.x, i.unschedule(e, .01), "function" == typeof a && a())
				},
					.01)
			},
			startWorkCircle: function () {
				var e = this;
				this._working || (this._waitForRefresh && (this._waitForRefresh = !1, this._refresh()), this._working = !0, this._stat = i.WALK_TO_MINE, this._enabledRender && this._renderWorker.getComponent("SeamRenderWorker").setStat(this._stat, this.layerData.managerSkillMoveSpeedUp * this.speedValue / 2), this._stepMoveTo(this.moveDur / this.layerData.managerSkillMoveSpeedUp, this.minePos,
					function () {
						e._stat = i.WORK,
							e._enabledRender && e._renderWorker.getComponent("SeamRenderWorker").setStat(e._stat, e.layerData.managerSkillDigSpeedUp),
							e.scheduleOnce(function () {
								e._stat = i.WALK_TO_CRATE,
									e._enabledRender && e._renderWorker.getComponent("SeamRenderWorker").setStat(e._stat, e.layerData.managerSkillMoveSpeedUp * e.speedValue / 2),
									e._stepMoveTo(e.moveDur / e.layerData.managerSkillMoveSpeedUp, e.cratePos,
										function () {
											e.publishEvent({
												type: "SeamWorkerPutMineInCrate",
												mineNum: e.ability,
												layerNum: e.layerNum
											}),
												e._working = !1,
												e.layerData.haveManager ? e.startWorkCircle() : (e._stat = i.IDLE, e._enabledRender && e._renderWorker.getComponent("SeamRenderWorker").setStat(e._stat, 1), e.publishEvent({
													type: "SeamWorkerWorkIsOver",
													layerNum: e.layerNum
												}))
										})
							},
								e.excavateTime / e.layerData.managerSkillDigSpeedUp)
					}))
			},
			onSeamWorkerGoToWork: function (e) {
				e.layerNum == this.layerNum && ("Tap" != e.commandType || this._working || Analysis.sendEvent({
					type: "ClickShaftWorker"
				}), this.startWorkCircle())
			},
			onLevelUpSeam: function (e) {
				e.minerId == this.layerNum && (this._waitForRefresh = !0)
			}
		}),
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent"
	}],
	SeamRenderWorker: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "20a12sB8LxDH6sYQEqXoMiU", "SeamRenderWorker");
		var i = e("SeamLogicWorker").WorkerStat;
		cc.Class({
			extends: cc.Component,
			editor: {
				menu: "GameModule/Seam/SeamRenderWorker"
			},
			properties: {
				aniNode: cc.Node,
				spineNode: cc.Node,
				spineComponent: sp.Skeleton,
				digEffect: cc.ParticleSystem,
				digCoinSpriteFrame: [cc.SpriteFrame]
			},
			onLoad: function () {
				var e = this;
				this.node.opacity = 0,
					this.node.runAction(cc.fadeIn(.3)),
					this.aniNames = {
						Idle: "action_idle",
						WalkToMine: "action_move",
						Work: "action_work" + ["", "2", "6"][Math.floor(3 * Math.random())],
						WalkToCrate: "action_work5"
					},
					this.digEffect.spriteFrame = this.digCoinSpriteFrame[UserData.GameData.CurrentMine - 1],
					this.spineComponent.setAnimation(0, this.aniNames.Idle, !0),
					this.particleScheduleFunc = function () {
						e.digEffect.resetSystem()
					},
					this.spineComponent.setStartListener(function (t) {
						var a = null,
							i = null;
						switch (t.animation.name) {
							case "action_work":
								a = .6,
									i = .83;
								break;
							case "action_work2":
								a = .3,
									i = .8;
								break;
							case "action_work6":
								a = .2,
									i = .49
						}
						a ? e.scheduleOnce(function () {
							e.particleScheduleFunc(),
								e.unschedule(e.particleScheduleFunc),
								e.schedule(e.particleScheduleFunc, i)
						},
							a) : e.unschedule(e.particleScheduleFunc)
					})
			},
			unuse: function () {
				this.digEffect.stopSystem(),
					this.spineComponent.paused = !0
			},
			reuse: function () {
				this.spineComponent.paused = !1
			},
			start: function () {
				this.changeSkin("mouth_smile", "default", "mouth_laugh")
			},
			changeSkin: function (e, t) {
				var a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null,
					i = this.spineComponent.findSlot(e),
					n = this.spineComponent.skeletonData.getRuntimeData(),
					r = n.findSlotIndex(e),
					o = n.findSkin(t).getAttachment(r, a);
				i.setAttachment(o)
			},
			setOriginScaleX: function (e) {
				this._originScaleX = e,
					this.aniNode.scaleX = this._originScaleX
			},
			setStat: function (e, t) {
				switch (this.spineComponent.timeScale = t, e) {
					case i.IDLE:
						this.spineComponent.setAnimation(0, this.aniNames.Idle, !0);
						break;
					case i.WALK_TO_MINE:
						this.aniNode.scaleX = this._originScaleX,
							this.spineComponent.setAnimation(0, this.aniNames.WalkToMine, !0);
						break;
					case i.WALK_TO_CRATE:
						this.aniNode.scaleX = -1 * this._originScaleX,
							this.spineComponent.setAnimation(0, this.aniNames.WalkToCrate, !0);
						break;
					case i.WORK:
						this.spineComponent.setAnimation(0, this.aniNames.Work, !0)
				}
			}
		}),
			cc._RF.pop()
	},
	{
		SeamLogicWorker: "SeamLogicWorker"
	}],
	Seam: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "f29a5rue+tH7qoF1epzQW8U", "Seam");
		var i = e("NumberData");
		cc.Class({
			extends: e("EasyEvent").declareEvent("RequestSeamAllLayerData"),
			editor: {
				menu: "GameModule/Seam/Seam"
			},
			properties: {
				content: cc.Node,
				prbSeamLayer: cc.Prefab,
				prbRenderWorker: cc.Prefab
			},
			onLoad: function () {
				window.SeamWorkerPool._nodePool = new cc.NodePool("SeamRenderWorker"),
					window.SeamWorkerPool._prefab = this.prbRenderWorker,
					window.SeamWorkerPool.init(12),
					this.commonData = UserData.getMineDataRef("Common"),
					this._loadData(UserData.getMineDataRef("Seam"))
			},
			_loadData: function (e) {
				var t = this;
				if (this.seamData = e, this.seamData.list = this.seamData.list || [], !this.seamData.unlockedLayerNum) for (var a = 1; a < this.seamData.list.length; a++) if (!this.seamData.list[a].unlock) {
					this.seamData.unlockedLayerNum = a - 1;
					break
				}
				for (a = 1; a < this.seamData.list.length; a++) this.seamData.list[a].unlock && null != this.seamData.list[a + 1] && (this.seamData.list[a + 1].preUnlock = !0);
				var i = [],
					n = function () {
						var e = a;
						t.seamData.list[e] || (t.seamData.list[e] = {});
						var n = t.seamData.list[e];
						i.push(cc.callFunc(function () {
							var a = cc.instantiate(t.prbSeamLayer);
							a.parent = t.content,
								a.getComponent("SeamLayerRoot").init({
									layerNum: e,
									mine: UserData.GameData.CurrentMine,
									layerData: n
								})
						},
							t)),
							i.push(cc.delayTime(.1))
					};
				for (a = 1; a <= Constant.MAX_SEAM_NUM_PER_MINE; a++) n();
				this.content.runAction(cc.sequence(i))
			},
			onNewSeamLayerUnlock: function (e) {
				this.seamData.unlockedLayerNum++
			},
			onQuerySeamLayerTotalNum: function (e) {
				for (var t = {
					totalNum: this.seamData.list.length - 1
				},
					a = 1; a < this.seamData.list.length; a++) if (!this.seamData.list[a].unlock) {
						t.totalNum = a - 1;
						break
					}
				"function" == typeof e.callback && (e.target ? e.callback.call(e.target, t) : e.callback(t))
			},
			onAskIsSeamEmpty: function (e) {
				for (var t = !0,
					a = UserData.getMineDataRef("Seam"), i = 1; i < a.list.length; i++) {
					if (a.list[i].mineNum > 0) {
						t = !1;
						break
					}
				}
				"function" == typeof e.callback && e.callback.call(e.target, {
					isEmpty: t
				})
			},
			onRequestSeamTotalPower: function (e) {
				for (var t = UserData.getMineDataRef("Seam"), a = new i(0), n = 1; n < t.list.length; n++) {
					var r = t.list[n],
						o = n;
					if (r && r.unlock && (r.haveManager && e.notIgnoreManager || !e.notIgnoreManager)) {
						var s = CfgMgr.Seam.getWorkerNumByLevel(r.level),
							c = CfgMgr.Seam.getWorkerAbility(o, r.level),
							l = CfgMgr.Seam.getExcavateTime() / r.managerSkillDigSpeedUp,
							d = c.mult(s).divi(l + CfgMgr.Seam.getWorkerMoveDur(r.level) / r.managerSkillMoveSpeedUp * 2);
						a.add(d)
					}
				}
				"function" == typeof e.callback && e.callback.call(e.target, {
					totalPower: a
				})
			},
			onRequestSeamAllLayerData: function (e) {
				for (var t = {},
					a = new i(0), n = UserData.getMineDataRef("Seam"), r = 0, o = 0, s = 1; s < n.list.length; s++) {
					var c = n.list[s];
					if (c && c.unlock && c.haveManager) {
						var l = s;
						0 == r && (r = l),
							0 == o && (o = l),
							t[l] = {},
							t[l].isMaxLevel = c.level == CfgMgr.Seam.getMaxLevel();
						var d = CfgMgr.Seam.getWorkerNumByLevel(c.level),
							h = CfgMgr.Seam.getWorkerAbility(l, c.level),
							u = CfgMgr.Seam.getExcavateTime() / c.managerSkillDigSpeedUp,
							m = h.mult(d).divi(u + CfgMgr.Seam.getWorkerMoveDur(c.level) / c.managerSkillMoveSpeedUp * 2);
						if (t[l].power = m, t[l].isMaxLevel) t[l].upgradeBenefit = new i(0);
						else {
							var g = CfgMgr.Seam.getWorkerNumByLevel(c.level + 1),
								p = CfgMgr.Seam.getWorkerAbility(l, c.level + 1).mult(g).divi(u + 2 * CfgMgr.Seam.getWorkerMoveDur(c.level + 1)),
								f = CfgMgr.Seam.getUpgradeConsume(c.level, c.level + 1, l);
							t[l].upgradeBenefit = p.clone().remove(m).divi(f)
						}
						t[l].upgradeBenefit.compare(t[o].upgradeBenefit) > 0 && (o = l),
							m.compare(t[r].power) > 0 && (r = l),
							a.add(m)
					}
				}
				for (var v in t[r] && (t[r].isMaxPower = !0), t[o] && t[o].upgradeBenefit.compare(0) > 0 && (t[o].isMaxUpgradeBenefit = !0), t) t[v].powerRatio = (100 * t[v].power.clone().ratio(a)).toFixed(2);
				t.totalPower = a,
					"function" == typeof e.callback && e.callback.call(e.target, t)
			}
		}),
			window.SeamWorkerPool = {
				_nodePool: null,
				_prefab: null,
				init: function (e) {
					for (var t = 1; t <= e; ++t) {
						var a = cc.instantiate(this._prefab);
						this._nodePool.put(a)
					}
				},
				get: function () {
					return this._nodePool.size() > 0 ? this._nodePool.get() : this._prefab ? cc.instantiate(this._prefab) : void 0
				},
				put: function (e) {
					this._nodePool && this._nodePool.put(e)
				}
			},
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent",
		NumberData: "NumberData"
	}],
	ShareItem: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "9e7ebWbMQBPja0athgrp5MU", "ShareItem"),
			cc.Class({
				extends: cc.Component,
				properties: {},
				start: function () { }
			}),
			cc._RF.pop()
	},
	{}],
	SignItem: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "047cfQqjVxIoY93WFEJmJgq", "SignItem"),
			cc.Class({
				extends: cc.Component,
				properties: {
					icon: cc.Sprite,
					num: cc.Label
				},
				start: function () { },
				setData: function (e) {
					var t = this;
					this.num.string = e.num;
					var a = CfgApi.get("Item", e.id);
					cc.loader.loadRes("texture/itemIcon/" + a.icon, cc.SpriteFrame,
						function (e, a) {
							e || (t.icon.spriteFrame = a)
						})
				}
			}),
			cc._RF.pop()
	},
	{}],
	SignListViewItem: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "982b7Dj+2ZLYabf1BLY+0u1", "SignListViewItem"),
			cc.Class({
				extends: e("EasyEvent").declareEvent("GetSignItem", "ShowAddCoinAct"),
				properties: {
					bgSprite: cc.Sprite,
					label: cc.Label,
					itemNode: cc.Node,
					toggle: cc.Toggle,
					signItem: cc.Prefab,
					doubleNode: cc.Node,
					doubleShareNode: cc.Node,
					doubleVideoNode: cc.Node,
					bgSpriteFrames: [cc.SpriteFrame]
				},
				start: function () {
					Platform.shareOrVideo({
						type: "DoubleSign",
						sharenode: this.doubleShareNode,
						videonode: this.doubleVideoNode
					})
				},
				updateData: function (e, t) {
					this.data = t,
						this.label.string = Language.getName("Day") + t.day,
						this.itemNode.removeAllChildren();
					for (var a = 0; a < t.reward.length; ++a) {
						var i = cc.instantiate(this.signItem),
							n = t.reward[a].split("-");
						i.getComponent("SignItem").setData({
							icon: "",
							id: n[0],
							num: n[1]
						}),
							this.itemNode.addChild(i)
					}
					this.bgSprite.spriteFrame = this.bgSpriteFrames[0],
						this.checkTime() ? (this.toggle.node.active = t.day <= UserData.GameData.Sign.day + 1, this.toggle.interactable = this.data.day == UserData.GameData.Sign.day + 1, this.toggle.isCheck = t.day <= UserData.GameData.Sign.day, this.toggle.checkMark.node.active = this.toggle.isCheck, this.toggle.target.active = !this.toggle.isCheck, this.data.day == UserData.GameData.Sign.day + 1 && (this.bgSprite.spriteFrame = this.bgSpriteFrames[1], UserData.GameData.Sign.video = 0)) : (this.toggle.node.active = t.day <= UserData.GameData.Sign.day, this.toggle.interactable = !1, this.toggle.isCheck = t.day <= UserData.GameData.Sign.day, this.toggle.checkMark.node.active = this.toggle.isCheck, this.toggle.target.active = !this.toggle.isCheck, this.data.day == UserData.GameData.Sign.day && (this.bgSprite.spriteFrame = this.bgSpriteFrames[1], 0 == UserData.GameData.Sign.video && (this.doubleNode.active = !0)))
				},
				onCheckClicked: function () {
					Music.play("SFX_Button General");
					var e = new Date,
						t = e.getFullYear(),
						a = e.getMonth(),
						i = e.getDate();
					if (this.checkTime(t, a, i) && this.data.day == UserData.GameData.Sign.day + 1) {
						UserData.GameData.Sign.day += 1,
							UserData.GameData.Sign.date.year = t,
							UserData.GameData.Sign.date.month = a,
							UserData.GameData.Sign.date.day = i;
						for (var n = !1,
							r = 0; r < this.data.reward.length; ++r) {
							var o = this.data.reward[r].split("-");
							ItemMgr.addItem(o[0], parseInt(o[1])),
								n || 6 != CfgApi.get("Item", o[0]).type || (n = !0)
						}
						this.publishEvent({
							type: "GetSignItem",
							data: this.data.reward
						}),
							n && this.publishEvent({
								type: "ShowAddCoinAct",
								cashType: 2,
								start: this.node.parent.convertToWorldSpaceAR(this.node.getPosition())
							}),
							this.doubleNode.active = !0
					}
					this.toggle.node.active = this.data.day <= UserData.GameData.Sign.day,
						this.toggle.interactable = !1,
						this.toggle.isCheck = this.data.day <= UserData.GameData.Sign.day,
						this.toggle.checkMark.node.active = this.toggle.isCheck,
						this.toggle.target.active = !this.toggle.isCheck
				},
				onShareClick: function () {
					// var e = this;
					// Platform.chooseContext({
					// 	type: "DoubleSign",
					// 	success: function (t) {
					// 		for (var a = !1,
					// 			i = 0; i < e.data.reward.length; ++i) {
					// 			var n = e.data.reward[i].split("-");
					// 			ItemMgr.addItem(n[0], parseInt(n[1])),
					// 				a || 6 != CfgApi.get("Item", n[0]).type || (a = !0)
					// 		}
					// 		e.publishEvent({
					// 			type: "GetSignItem",
					// 			data: e.data.reward
					// 		}),
					// 			a && e.publishEvent({
					// 				type: "ShowAddCoinAct",
					// 				cashType: 2,
					// 				start: e.node.parent.convertToWorldSpaceAR(e.node.getPosition())
					// 			}),
					// 			UserData.GameData.Sign.video = 1,
					// 			e.doubleNode.active = !1
					// 	},
					// 	fail: function (e) {
					// 		e && Platform.showToast({
					// 			title: e
					// 		})
					// 	}
					// })
				},
				onVideoClick: function () {
					var e = this;
					Ad.showVideo({
						type: "DoubleSign",
						success: function (t) {
							for (var a = !1,
								i = 0; i < e.data.reward.length; ++i) {
								var n = e.data.reward[i].split("-");
								ItemMgr.addItem(n[0], parseInt(n[1])),
									a || 6 != CfgApi.get("Item", n[0]).type || (a = !0)
							}
							e.publishEvent({
								type: "GetSignItem",
								data: e.data.reward
							}),
								a && e.publishEvent({
									type: "ShowAddCoinAct",
									cashType: 2,
									start: e.node.parent.convertToWorldSpaceAR(e.node.getPosition())
								}),
								UserData.GameData.Sign.video = 1,
								e.doubleNode.active = !1
						},
						fail: function (e) {
							e && Platform.showToast({
								title: e
							})
						}
					})
				},
				checkTime: function (e, t, a) {
					var i = new Date;
					e = e || i.getFullYear(),
						t = t || i.getMonth(),
						a = a || i.getDate();
					var n = !1;
					if (e > UserData.GameData.Sign.date.year) n = !0;
					else if (e == UserData.GameData.Sign.date.year) if (t > UserData.GameData.Sign.date.month) n = !0;
					else if (t == UserData.GameData.Sign.date.month) {
						if (a > UserData.GameData.Sign.date.day) return !0;
						n = !1
					} else n = !1;
					else n = !1;
					return n
				}
			}),
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent"
	}],
	StaticMargin: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "f7485NFIKxExZ6hvQFgI3Qh", "StaticMargin");
		var i = cc.Enum({
			ALL: 0,
			VERTICAL: 1,
			HORIZONTAL: 2
		});
		cc.Class({
			extends: cc.Component,
			editor: {
				menu: "Extensions/StaticMargin"
			},
			properties: {
				marginType: {
					default:
						i.ALL,
					type: i
				}
			},
			onLoad: function () {
				this.originParentSize = this.node.parent.getContentSize(),
					this.logicPos = this.node.getPosition()
			},
			_updatePosX: function () {
				var e = this.parentSize.width / this.originParentSize.width;
				this.node.x = this.logicPos.x * e
			},
			_updatePosY: function () {
				var e = this.parentSize.height / this.originParentSize.height;
				this.node.y = this.logicPos.y * e
			},
			update: function (e) {
				if (cc.isValid(this.node.parent)) switch (this.parentSize = this.node.parent.getContentSize(), this.marginType) {
					case i.VERTICAL:
						this._updatePosY();
						break;
					case i.HORIZONTAL:
						this._updatePosX();
						break;
					case i.ALL:
						this._updatePosX(),
							this._updatePosY()
				}
			}
		}),
			cc._RF.pop()
	},
	{}],
	StoreHouse: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "d21d6DzLJFORqSMWlxrevuL", "StoreHouse");
		var i = e("PrisonerManager"),
			n = e("NumberData");
		cc.Class({
			extends: e("EasyEvent").declareEvent("RequestSeamTotalPower", "RequestElevatorTotalPower", "OpenBoostsView"),
			editor: {
				menu: "GameModule/StoreHouse"
			},
			properties: {
				prefabPrisoner: {
					type: cc.Prefab,
					default:
						null
				},
				prefabBtnUpgrade: {
					type: cc.Prefab,
					default:
						null
				},
				prefabManager: cc.Prefab,
				labItemRate: cc.Label,
				nodeItemInfo: cc.Node,
				sprItem: cc.Sprite,
				labItemTime: cc.Label,
				boostOverViewPrefab: cc.Prefab,
				prefabAddCoin: cc.Prefab,
				tapMark: cc.Node,
				tapMarkManager: cc.Node
			},
			onLoad: function () {
				var e = this;
				this.resetRate(),
					this.arrPrisoners = [],
					this.commonData = UserData.getMineDataRef("Common"),
					this.curStep = this.commonData.initStep,
					this.requestData(),
					this.refreshItemRate(),
					this.schedule(function () {
						e.refreshItemRate()
					},
						1),
					this.tapMark.zIndex = cc.macro.MAX_ZINDEX,
					this.tapMarkManager.zIndex = cc.macro.MAX_ZINDEX,
					this._someOneStoppedWork = !0
			},
			refreshItemRate: function () {
				var e = this,
					t = ItemMgr.getActiveItemEffect() * ItemMgr.getAdEffect();
				if (t > 1) {
					this.labItemRate.string = "",
						this.nodeItemInfo.active = !0;
					var a = ItemMgr.getEffectMaxTime();
					if (a > 0) {
						var i = Tools.time2hms(a),
							n = "";
						i.d > 0 ? (n += i.d > 0 ? i.d + "d " : "", n += i.h > 0 ? i.h + "h" : "") : i.h > 0 ? (n += i.h > 0 ? i.h + "h " : "", n += i.m > 0 ? i.m + "m" : "") : i.m > 0 ? (n += i.h > 0 ? i.h + "m " : "", n += i.m > 0 ? i.m + "s" : "") : n += i.s > 0 ? i.s + "s" : "",
							this.labItemTime.string = n
					} else this.labItemTime.string = "";
					for (var r = ItemMgr.getActiveItemValueArr(), o = function (t) {
						var a = parseInt(r[t]);
						cc.loader.loadRes("texture/itemIcon/Icon_Boost_" + a + "x", cc.SpriteFrame,
							function (a, i) {
								if (0 == t && e.sprItem.node.removeAllChildren(), !a) {
									var n = new cc.Node;
									n.addComponent(cc.Sprite).spriteFrame = i,
										n.parent = e.sprItem.node,
										n.x = -10 * t,
										n.scale = .9
								}
							})
					},
						s = 0; s < r.length; s++) o(s);
					0 == r.length && this.sprItem.node.removeAllChildren()
				} else this.nodeItemInfo.active = !1
			},
			requestData: function () {
				var e = UserData.getMineDataRef("StoreHouse");
				this.loadData(e),
					this.refreshPrisonerNumber()
			},
			loadData: function (e) {
				this.storeHouseData = e,
					e.level || (e.level = 1),
					e.mineNum || (e.mineNum = 1),
					e.SuperCash || (e.SuperCash = 0),
					e.upgradeNum || (e.upgradeNum = CfgMgr.StoreHouse.getUpgradeNeedCoin(1).toNumber()),
					this.storeHouseData.level = e.level,
					this.refreshStoreHouseProperty()
			},
			resetRate: function () {
				this.movespeedRate = 1,
					this.loadSpeedRate = 1,
					this.loadingValRate = 1,
					this.moneyRate = 1
			},
			checkStepActive: function () {
				for (var e = 0; e < this.arrPrisoners.length; e++) this.nodeFade(this.arrPrisoners[e], this.curStep > 1);
				this.nodeFade(this.nodeManager, this.curStep >= 3),
					this.nodeFade(this.btnUpgrade, this.curStep >= 4)
			},
			nodeFade: function (e) {
				var t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
					a = e.active;
				e.active = t,
					a != t && (e.opacity = 0, e.runAction(cc.fadeIn(.2)))
			},
			refreshPrisonerNumber: function () {
				for (var e = this.arrPrisoners.length; e < this.storeHouseData.mineNum; e++) this.createPrisoner()
			},
			refreshStoreHouseProperty: function () {
				this._movespeed = CfgMgr.StoreHouse.getMoveSpeed(this.storeHouseData.level),
					this._movespeed *= this.movespeedRate,
					this._perLoading = CfgMgr.StoreHouse.getPerTransport(this.storeHouseData.level, 1, 0, UserData.GameData.CurrentMine, !1),
					this._perLoading = this._perLoading.mult(this.loadingValRate),
					this._loadingtime = CfgMgr.StoreHouse.getLoadingTime(),
					this._loadSpeed = CfgMgr.StoreHouse.getLoadingSpeed(this._perLoading.clone(), this._loadingtime),
					this._loadSpeed = this._loadSpeed.mult(this.loadSpeedRate),
					this.storeHouseData.mineNum = CfgMgr.StoreHouse.getStoreWorkerNum(this.storeHouseData.level),
					this._totalLoading = CfgMgr.StoreHouse.getTotalTransportationNumByLevel(this._perLoading.clone(), this.storeHouseData.mineNum, this._loadSpeed.clone(), this._movespeed, UserData.GameData.CurrentMine),
					this._movetime = CfgMgr.StoreHouse.getMoveTime(this._movespeed)
			},
			createPrisoner: function () {
				var e = cc.instantiate(this.prefabPrisoner);
				this.node.addChild(e),
					e.position = cc.v2(Constant.STORE_HOUSE_MOVE_START, 60.5),
					e.active = !1,
					this.nodeFade(e, this.curStep > 1),
					this.arrPrisoners.push(e)
			},
			changeManagerState: function (e) {
				var t = this,
					a = 1;
				this.arrPrisoners.forEach(function (i) {
					t.node.runAction(cc.sequence(cc.delayTime(.3 * a), cc.callFunc(function () {
						i.getComponent("PrisonerCar").initData({
							managerState: e,
							moveTime: t._movetime,
							loadingVal: t._perLoading.clone(),
							loadSpeed: t._loadSpeed.clone()
						})
					},
						t))),
						a += 1
				})
			},
			start: function () {
				this.nodeManager = cc.instantiate(this.prefabManager),
					this.node.addChild(this.nodeManager),
					this.nodeManager.position = cc.v2(- 83, 61),
					this.nodeManager.getChildByName("main").scaleX = -1,
					this.nodeManager.getComponent("PrisonerManager").minerBranch = i.EnumMinerBranch.StoreHouse,
					this.nodeManager.getComponent("PrisonerManager").setMinerId(1),
					this.nodeManager.active = !1,
					this.btnUpgrade = cc.instantiate(this.prefabBtnUpgrade),
					this.node.addChild(this.btnUpgrade),
					this.btnUpgrade.position = cc.v2(- 85, 234),
					this.btnUpgrade.getComponent("BtnUpgrade").initData(this.storeHouseData.level, !1, i.EnumMinerBranch.StoreHouse),
					this.btnUpgrade.active = !1,
					this.checkStepActive()
				console.log(this)
			},
			_updateTapMark: function () {
				this.tapMark.active = this.needToCarryMoney && !this.managerState && this.commonData.initStep >= 2.6 && (this.commonData.initStep < 3 || !this._affordManager) && this._someOneStoppedWork && null == Tutorial.currentTutorial && (!this.reviewStep || 3 == this.reviewStep),
					this.tapMarkManager.active = !this.managerState && this.commonData.initStep >= 3 && this._affordManager && null == Tutorial.currentTutorial
			},
			btnManagerState: function () { },
			calcUpgradeNeedMoney: function (e) {
				var t = {},
					a = this.storeHouseData.level;
				if (e != LevelUpMode.LV_MAX) e == LevelUpMode.LV_X1 ? a = this.storeHouseData.level + 1 : e == LevelUpMode.LV_X10 ? a = this.storeHouseData.level + 10 : e == LevelUpMode.LV_X50 && (a = this.storeHouseData.level + 50),
					a = Math.min(a, CfgMgr.StoreHouse.getStoreHouseMaxLevel()),
					t.money = CfgMgr.StoreHouse.getUpgradeToLevelNeedCoin(this.storeHouseData.level, a, this.storeHouseData.upgradeNum).totalCoin,
					t.money = t.money.mult(this.moneyRate),
					t.targetlevel = a;
				else if (this.storeHouseData.level == CfgMgr.StoreHouse.getStoreHouseMaxLevel()) t.money = new n(0),
					t.targetlevel = this.storeHouseData.level;
				else {
					var i = CfgMgr.StoreHouse.getUpgradeLimit(this.storeHouseData.level, this.storeHouseData.upgradeNum, this.moneyRate);
					t.money = i.coin,
						t.money = t.money.mult(this.moneyRate),
						t.targetlevel = i.level
				}
				return this.storeHouseData.level == CfgMgr.StoreHouse.getStoreHouseMaxLevel() ? (t.isMaxLevel = !0, t.money = new n(0)) : t.isMaxLevel = !1,
					t
			},
			onHelpClicked: function () {
				this.publishEvent({
					type: "OpenBoostsView"
				})
			},
			onPrisonerCarWorkIsOver: function () {
				this._someOneStoppedWork = !0,
					3 == this.reviewStep && this.publishEvent({
						type: "ReviewStepMoveForward",
						step: null
					}),
					this._updateTapMark()
			},
			onPrisonerCarGoToWork: function () {
				this._someOneStoppedWork = !1,
					this._updateTapMark()
			},
			onManagerStateChangeStoreHouse: function (e) {
				var t = this;
				this.managerState = e.state,
					this._updateTapMark(),
					this.managerState ? (this._someOneStoppedWork = !1, this._updateTapMark(), this.unschedule(this.scheduleCheckTapMark)) : (this.scheduleCheckTapMark = function () {
						t.publishEvent({
							type: "AskElevatorForMine",
							callback: function (e) {
								t.needToCarryMoney = e.mineNum.compare() > 0,
									t._updateTapMark()
							},
							target: t
						})
					},
						this.schedule(this.scheduleCheckTapMark, .2)),
					this.changeManagerState(e.state)
			},
			onManagerSkillStateChange: function (e) {
				if (e.minerBranch == i.EnumMinerBranch.StoreHouse && 1 == e.minerId) {
					if (this.resetRate(), e.state == ManagerSkillState.MS_USING) {
						console.log("\u4ed3\u5e93\u6b63\u5728\u4f7f\u7528\u6280\u80fd...");
						var t = CfgMgr.Manager.getManagerDataById(e.tabId),
							a = t.skill_param;
						t.skill_type == SKILL_TYPE[3][0] ? this.movespeedRate = a : t.skill_type == SKILL_TYPE[3][1] ? this.loadSpeedRate = a : t.skill_type == SKILL_TYPE[3][3] ? this.loadingValRate = a : t.skill_type == SKILL_TYPE[3][2] && (this.moneyRate = 1 - parseFloat(a))
					} else e.state == ManagerSkillState.MS_CD ? console.log("\u4ed3\u5e93\u6280\u80fd\u5f00\u59cbCD...") : e.state == ManagerSkillState.MS_IDLE && console.log("\u4ed3\u5e93\u6280\u80fd\u53ef\u4ee5\u4f7f\u7528\u4e86...");
					this.refreshStoreHouseProperty()
				}
			},
			onLevelUpStoreHouse: function (e) {
				var t = this.storeHouseData.level;
				this.storeHouseData.level += e.addLevel;
				var a = CfgMgr.StoreHouse.getUpgradeToLevelNeedCoin(t, this.storeHouseData.level, this.storeHouseData.upgradeNum);
				this.storeHouseData.upgradeNum = a.upgradeNum.toNumber(),
					this.refreshStoreHouseProperty(),
					this.refreshPrisonerNumber(),
					this.changeManagerState(this.managerState)
			},
			onRequestUpgradeNeedMoneyStoreHouse: function (e) {
				if (e.minerBranch == i.EnumMinerBranch.StoreHouse && 1 == e.minerId && "function" == typeof e.callback) {
					var t = this.calcUpgradeNeedMoney(e.levelUpMode);
					t.limitLevel = t.targetlevel - this.storeHouseData.level;
					var a = CfgMgr.StoreHouse.getLevelAdvancedRange(this.storeHouseData.level);
					t.startLevel = a.startLevel,
						t.curLevel = this.storeHouseData.level,
						t.endLevel = a.endLevel,
						t.targetlevel <= a.endLevel ? t.cashNum = a.cashNum : t.cashNum = CfgMgr.StoreHouse.getUpgradeTargetLevelCashNum(this.storeHouseData.level, t.targetlevel),
						t.superCash = this.storeHouseData.SuperCash,
						e.callback.call(e.target, t)
				}
			},
			onRequestLevelUpDataStoreHouse: function (e) {
				if ("function" == typeof e.callback) {
					var t = CfgMgr.StoreHouse.getLevelAdvancedRange(this.storeHouseData.level),
						a = {
							title: Language.getName("Ware House")
						};
					a.curLevel = this.storeHouseData.level,
						a.progress = (this.storeHouseData.level - t.startLevel) / (t.endLevel - t.startLevel),
						a.upgradeLevel = t.endLevel,
						a.childName = Language.getName("Warehouse");
					var i = this.calcUpgradeNeedMoney(e.levelUpMode),
						n = i.targetlevel;
					n <= t.endLevel ? a.cashNum = t.cashNum : a.cashNum = CfgMgr.StoreHouse.getUpgradeTargetLevelCashNum(this.storeHouseData.level, i.targetlevel),
						a.isMaxLevel = i.isMaxLevel,
						a.money = i.money,
						a.limitLevel = n - this.storeHouseData.level;
					var r = [this._totalLoading + "/s", this.storeHouseData.mineNum.toString(), this._perLoading.toString(), this._loadSpeed + "/s", this._movespeed.toString()],
						o = void 0,
						s = [1, 1, 1, 1, 1];
					if (i.isMaxLevel) o = [Language.getName("Max"), Language.getName("Max"), Language.getName("Max"), Language.getName("Max"), Language.getName("Max")],
						s = [0, 0, 0, 0, 0];
					else {
						var c = CfgMgr.StoreHouse.getMoveSpeed(n);
						c *= this.movespeedRate;
						var l = CfgMgr.StoreHouse.getPerTransport(n, 1, 0, UserData.GameData.CurrentMine, !1);
						l = l.mult(this.loadingValRate);
						var d = CfgMgr.StoreHouse.getLoadingTime(),
							h = CfgMgr.StoreHouse.getLoadingSpeed(l.clone(), d);
						h = h.mult(this.loadSpeedRate);
						var u = CfgMgr.StoreHouse.getStoreWorkerNum(n),
							m = CfgMgr.StoreHouse.getTotalTransportationNumByLevel(l.clone(), u, h.clone(), c, UserData.GameData.CurrentMine),
							g = u - this.storeHouseData.mineNum,
							p = void 0,
							f = CfgMgr.StoreHouse.getWorkNumAdvancedRange(this.storeHouseData.level);
						0 == g ? f.max ? p = Language.getName("Max") : (p = Language.getName("Next boost at Level") + " " + f.endLevel, s[1] = 0) : p = "+" + (u - this.storeHouseData.mineNum).toString();
						var v = c - this._movespeed,
							_ = void 0,
							y = CfgMgr.StoreHouse.getMoveSpeedAdvancedRange(this.storeHouseData.level);
						0 == v ? y.max ? _ = Language.getName("Max") : (_ = Language.getName("Next boost at Level") + " " + y.endLevel, s[4] = 0) : _ = "+" + (c - this._movespeed).toString(),
							o = ["+" + m.remove(this._totalLoading).toString(), p, "+" + l.remove(this._perLoading).toString(), "+" + h.remove(this._loadSpeed).toString(), _]
					}
					a.properties = [];
					for (var b = ["Total Transportation", "Transporters", "Load per Transporter", "Loading Speed", "Walking Speed"], S = [0, 0, 0, 0, 0], C = [9, 10, 11, 12, 3], D = [2, 3, 1, 4, 0], w = 0; w < b.length; w++) {
						var A = D[w],
							M = {
								proName: Language.getName(b[A]),
								valNow: r[A],
								valNext: o[A],
								coinflag: S[A],
								iconId: C[A],
								colorState: s[A]
							};
						a.properties.push(M)
					}
					e.callback.call(e.target, a)
				}
			},
			onRequestStoreTotalPower: function (e) {
				"function" == typeof e.callback && (e.notIgnoreManager ? e.callback.call(e.target, {
					totalPower: this.managerState ? this._totalLoading : new n(0)
				}) : e.callback.call(e.target, {
					totalPower: this._totalLoading
				}))
			},
			onInitStepMoveForward: function (e) {
				this.curStep = e.currentStep,
					this.checkStepActive()
			},
			onAddStoreHouseSuperCash: function (e) {
				this.storeHouseData.SuperCash += e.cashNum
			},
			onSubStoreHouseSuperCash: function (e) {
				this.storeHouseData.SuperCash -= e.cashNum
			},
			onShowAddCoinAni: function (e) {
				var t = cc.instantiate(this.prefabAddCoin);
				this.node.addChild(t);
				var a = 2 * Math.random() * 20 - 20;
				t.position = cc.v2(- 220 + a, 280),
					t.scale = .5,
					t.getChildByName("label").getComponent(cc.Label).string = e.num,
					t.opacity = 0,
					t.runAction(cc.sequence(cc.fadeIn(.1), cc.delayTime(1.2), cc.fadeOut(.2))),
					t.runAction(cc.sequence(cc.moveBy(1.5, cc.v2(0, 80)), cc.callFunc(function () {
						t.destroy()
					})))
			},
			onAffordManager: function (e) {
				e.minerBranch == i.EnumMinerBranch.StoreHouse && (this._affordManager = !0, this._updateTapMark())
			},
			onNoAffordManager: function (e) {
				e.minerBranch == i.EnumMinerBranch.StoreHouse && (this._affordManager = !1, this._updateTapMark())
			},
			onTutorialEnd: function (e) {
				this._updateTapMark()
			},
			onReviewStepMoveForward: function (e) {
				this.reviewStep = e.step,
					this._updateTapMark()
			}
		}),
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent",
		NumberData: "NumberData",
		PrisonerManager: "PrisonerManager"
	}],
	StringCompress: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "4f585vtNLlMU6PIrqiwQlxT", "StringCompress");
		var i = e("pako"),
			n = t.exports = {
				compressAsync: function (e, t) {
					for (var a = (new Date).getTime(), i = e, r = []; i.length > 2e4;) r.push(i.substring(0, 2e4)),
						i = i.substring(2e4);
					i.length > 0 && r.push(i);
					var o = [];
					setTimeout(function e() {
						var i = r.shift();
						console.log("[ARRAY PART" + (o.length + 1) + "]"),
							o.push(n.compress(i)),
							r.length > 0 ? setTimeout(e, 1e-100) : (console.log("[ARRAY\u7528\u65f6:", Date.now() - a, "]"), "function" == typeof t && t(o))
					},
						1e-100)
				},
				compress: function (e) {
					var t = (new Date).getTime();
					console.log("[\u538b\u7f29\u524d\u957f\u5ea6\uff1a" + e.length + "]");
					var a = i.deflate(e, {
						to: "string"
					});
					return console.log("[\u538b\u7f29\u540e\u957f\u5ea6\uff1a" + a.length + "]"),
						console.log("[\u7528\u65f6:", Date.now() - t, "]"),
						a
				},
				decompressArray: function (e) {
					var t = "";
					return e.forEach(function (e) {
						t += n.decompress(e)
					}),
						t
				},
				decompress: function (e) {
					return i.inflate(e, {
						to: "string"
					})
				}
			};
		cc._RF.pop()
	},
	{
		pako: "pako"
	}],
	SwitchButton: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "26828xl9pJJ77ixjvde/8nf", "SwitchButton"),
			cc.Class({
				extends: cc.Component,
				editor: {
					menu: "Extensions/SwitchButton"
				},
				properties: {
					item: cc.Node,
					fristpos: {
						type: cc.Vec2,
						default:
							cc.v2(0, 0),
						notify: function () {
							this._updateMaskPosition()
						}
					},
					secondpos: {
						type: cc.Vec2,
						default:
							cc.v2(0, 0),
						notify: function () {
							this._updateMaskPosition()
						}
					},
					status: {
						default:
							!0,
						notify: function () {
							this._updateMaskPosition()
						}
					},
					onSwitchEvent: {
						default:
							[],
						type: cc.Component.EventHandler,
						tooltip: !1
					}
				},
				_updateMaskPosition: function () {
					this.item && (this.item.position = 1 == this.status ? this.fristpos : this.secondpos)
				},
				start: function () {
					var e = this;
					e.node.on(cc.Node.EventType.TOUCH_END,
						function (t) {
							e._onClicked()
						})
				},
				setStatus: function (e) {
					this.status = e,
						this._updateMaskPosition()
				},
				_onClicked: function () {
					this.status = !this.status,
						this._updateMaskPosition(),
						cc.Component.EventHandler.emitEvents(this.onSwitchEvent, this.status)
				}
			}),
			cc._RF.pop()
	},
	{}],
	SyncCashItem: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "89de23FwklErrI4qcNMTuTx", "SyncCashItem");
		var i = e("NumberData");
		cc.Class({
			extends: e("EasyEvent"),
			editor: {
				menu: "Dialog/SyncCashItem"
			},
			properties: {
				type: 1,
				labCash: cc.Label,
				cashIcon: cc.Sprite,
				cashIcon_1: cc.SpriteFrame,
				cashIcon_2: cc.SpriteFrame,
				cashIcon_3: cc.SpriteFrame,
				cashIcon_4: cc.SpriteFrame
			},
			start: function () {
				this._refresh()
			},
			setType: function (e, t) {
				this.gameData = t ? UserData.cloudData.GameData : UserData.GameData,
					this.type = e,
					this.cashIcon.spriteFrame = this["cashIcon_" + this.type]
			},
			_refresh: function () {
				this.cash = new i(this.gameData.Cashs[this.type]),
					CfgMgr.Mine.getMineConfig(this.gameData.CurrentMine).init_currency_type == this.type && (this.cash = new i(this.gameData.TotalCash)),
					this.labCash.string = this.cash.toString()
			},
			onCashChanged: function (e) {
				this._refresh()
			}
		}),
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent",
		NumberData: "NumberData"
	}],
	ThemeFallen: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "0d34eLPP7ZGcJlC1rrpU7mD", "ThemeFallen");
		var i = cc.Enum({
			UP_SIDE: 1,
			DOWN_SIDE: -1
		});
		cc.Class({
			extends: cc.Component,
			editor: {
				menu: "Extensions/ThemeFallen"
			},
			properties: {
				count: 10,
				spriteFrames: [cc.SpriteFrame],
				targetPosOffset: cc.v2(),
				fallenType: {
					default:
						i.UP_SIDE,
					type: i
				}
			},
			onLoad: function () {
				this.targetPos = this.node.getPosition().add(this.targetPosOffset),
					this.aniNodes = [];
				for (var t = 0; t < this.count; t++) {
					var a = new cc.Node;
					a.addComponent(cc.Sprite).spriteFrame = this._randomFrame(),
						a.addComponent(e("ThemeSprite")),
						this.node.addChild(a),
						this.aniNodes.push(a),
						a.active = !1
				}
			},
			_randomFrame: function () {
				return this.spriteFrames[Math.floor(Math.random() * this.spriteFrames.length)]
			},
			_randomPos: function (e) {
				return cc.v2(2 * Math.random() * e - e, 2 * Math.random() * e - e)
			},
			play: function () {
				var e = this;
				this.aniNodes.forEach(function (t) {
					t.setPosition(e._randomPos(10)),
						t.active = !0,
						t.opacity = 0;
					var a = [cc.v2(0, 0), cc.v2(e.targetPos.x / 2, e.targetPos.y + e.fallenType * e.targetPosOffset.x / 3), e.targetPos.add(e._randomPos(10))],
						i = cc.sequence(cc.delayTime(Math.random() / 2), cc.fadeIn(.05), cc.bezierTo(.5, a).easing(cc.easeSineOut()), cc.fadeOut(.05), cc.callFunc(function (t, a) {
							a.setPosition(e._randomPos(10))
						},
							e, t));
					t.runAction(cc.repeatForever(i))
				})
			},
			stop: function () {
				this.aniNodes.forEach(function (e) {
					e.stopAllActions(),
						e.runAction(cc.fadeOut(.03))
				})
			}
		}),
			cc._RF.pop()
	},
	{
		ThemeSprite: "ThemeSprite"
	}],
	ThemeSprite: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "bb95agfuRlDeLglCDTGm2NV", "ThemeSprite"),
			cc.Class({
				extends: cc.Component,
				editor: {
					menu: "Extensions/ThemeSprite",
					requireComponent: cc.Sprite
				},
				properties: {},
				onLoad: function () {
					this.sprite = this.node.getComponent(cc.Sprite),
						this.fileName = this.sprite.spriteFrame._name,
						this.sprite.spriteFrame = null
				},
				start: function () {
					var e = this;
					cc.loader.loadRes("texture/theme/" + UserData.GameData.CurrentMine + "/" + this.fileName, cc.SpriteFrame,
						function (t, a) {
							t ? cc.error("ThemeSprite \u52a0\u8f7d\u56fe\u7247\u9519\u8bef", t) : e.sprite.spriteFrame = a
						})
				}
			}),
			cc._RF.pop()
	},
	{}],
	Toast: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "ebc88eXoENDFaaHbWt2qJgC", "Toast"),
			cc.Class({
				extends: cc.Component,
				properties: {
					toastNode: cc.Node,
					toastBg: cc.Node,
					toastText: cc.RichText
				},
				start: function () { },
				show: function () {
					var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 2;
					this.toastNode.runAction(cc.sequence(cc.delayTime(e), cc.spawn(cc.moveBy(.5, cc.v2(0, 100)), cc.fadeOut(.5)), cc.removeSelf()))
				},
				setToastString: function (e, t) {
					this.toastText.string = e,
						t && (this.toastText.fontSize = t),
						this.toastBg.width = this.toastText.node.width + 40
				}
			}),
			cc._RF.pop()
	},
	{}],
	Tools: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "cd6c3ADKQFH+LGzVKb6oroA", "Tools"),
			window.Tools = {
				numPadZero: function (e, t) {
					for (var a = e.toString().length; a < t;) e = "0" + e,
						a++;
					return e
				},
				isSameWeek: function (e, t) {
					var a = parseInt(e.getTime() / 864e5),
						i = parseInt(t.getTime() / 864e5);
					return parseInt((a + 3) / 7) == parseInt((i + 3) / 7)
				},
				timespanFormat: function (e) {
					var t = Math.floor(e / 1e3),
						a = Math.floor(t / 60),
						i = t % 60,
						n = Math.floor(a / 60),
						r = a % 60;
					return (n > 0 ? n + "h " : "") + (r > 0 && 60 != r ? r + "m " : "") + (i > 0 ? i + "s" : "")
				},
				time2hms: function (e) {
					var t = e / 1e3;
					return {
						d: parseInt(t / 3600 / 24),
						h: parseInt(t / 3600),
						m: parseInt(t % 3600 / 60),
						s: parseInt(t % 60)
					}
				},
				nameTo2Char: function (e) {
					if (!e) return;
					if (1 == e.length) return e.toUpperCase();
					var t = e.split(" ");
					return 1 == t.length ? e[0].toUpperCase() : t[0][0].toUpperCase() + t[1][0].toUpperCase()
				},
				formatStr: function (e, t) {
					return (Array(t).join(0) + e).slice(- t)
				}
			},
			window.Tools.MD5 = e("MD5"),
			Date.prototype.Format = function (e) {
				var t = {
					"M+": this.getMonth() + 1,
					"d+": this.getDate(),
					"h+": this.getHours(),
					"m+": this.getMinutes(),
					"s+": this.getSeconds(),
					"q+": Math.floor((this.getMonth() + 3) / 3),
					S: this.getMilliseconds()
				};
				for (var a in /(y+)/.test(e) && (e = e.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))), t) new RegExp("(" + a + ")").test(e) && (e = e.replace(RegExp.$1, 1 == RegExp.$1.length ? t[a] : ("00" + t[a]).substr(("" + t[a]).length)));
				return e
			},
			cc._RF.pop()
	},
	{
		MD5: "MD5"
	}],
	Tutorial: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "c9165iQ8kBGhLZj2grnOkpP", "Tutorial"),
			cc.Class({
				extends: e("EasyEvent").declareEvent("ShowTutorial", "TutorialStep", "TutorialEnd"),
				editor: {
					menu: "GameModule/Tutorial/Tutorial"
				},
				properties: {
					handDown: cc.Node,
					handUp: cc.Node,
					mask: cc.Mask,
					circleRadiusForRender: 100
				},
				onLoad: function () {
					this.node.setContentSize(cc.winSize),
						this.handUp.opacity = 0,
						this.handDown.opacity = 0,
						this.node.on(cc.Node.EventType.TOUCH_START, this._touchStart, this),
						this.node._hitTest = this._newHitTest.bind(this),
						this.tutorialStepTo = 0,
						this.tutorialSteps = [],
						window.Tutorial = this
				},
				start: function () {
					var e = this;
					this.mask._graphics.lineWidth = 1,
						this.mask._graphics.strokeColor = cc.color(255, 0, 0),
						this.mask._graphics.fillColor = cc.color(0, 255, 0),
						this.node.opacity = 0,
						this.scheduleOnce(function () {
							e.node.opacity = 255,
								e.node.active = !1
						},
							.01)
				},
				_touchStart: function () {
					this._touchStarted = !0
				},
				virtualClick: function (e) {
					var t = this.node.parent.convertToWorldSpaceAR(e),
						a = t.x,
						i = t.y;
					a *= cc.view._scaleX,
						i *= cc.view._scaleY,
						a += cc.view._viewportRect.x,
						i += cc.view._viewportRect.y;
					var n = new cc.Touch(a, i, 1e6);
					n._setPoint(a, i),
						n._setPrevPoint(a, i),
						_cc.inputManager.handleTouchesBegin([n]),
						_cc.inputManager.handleTouchesEnd([n])
				},
				_newHitTest: function (e, t) {
					if (this.startVirtualClick || this._hideForSync) return !1;
					if (!this._touchStarted) return !0;
					this._touchStarted = !1,
						(e = this.node.convertToNodeSpace(e)).x -= this.node.getContentSize().width / 2,
						e.y -= this.node.getContentSize().height / 2;

					if (!this.tutorialSteps[this.tutorialStepTo] || !this.tutorialSteps[this.tutorialStepTo].getPosition) return;
					var a = this.tutorialSteps[this.tutorialStepTo].getPosition();
					if (e.sub(a).mag() <= this.circleRadiusForRender) {
						if (this.tutorialStepTo++, this.tutorialSteps[this.tutorialStepTo]) this.pointAt(this.tutorialSteps[this.tutorialStepTo].getPosition());
						else {
							var i = this.currentTutorial;
							this.currentTutorial = null,
								this.publishEvent({
									type: "TutorialEnd",
									tutorial: i
								}),
								this.node.active = !1
						}
						this.startVirtualClick = !0,
							this.virtualClick(this.tutorialSteps[this.tutorialStepTo - 1].getPosition()),
							this.startVirtualClick = !1
					}
					return !0
				},
				setTutorialSetp: function (e) {
					this.tutorialSteps = e,
						this.tutorialStepTo = 0,
						this.handUp.opacity = 0,
						this.handDown.opacity = 0,
						this.pointAt(this.tutorialSteps[0].getPosition())
				},
				pointAt: function (e) {
					var t = this;
					this.handUp.runAction(cc.fadeOut(.3)),
						this.handDown.runAction(cc.fadeOut(.3)),
						this.hand = this.handDown,
						(e.y < -cc.winSize.height / 2 + 150 || e.x > cc.winSize.width / 2 - 150) && (this.hand = this.handUp),
						this.hand.runAction(cc.sequence(cc.delayTime(.3), cc.callFunc(function () {
							t.hand.setPosition(e)
						},
							this), cc.fadeIn(.3))),
						this.mask._graphics.clear(),
						this.mask._graphics.circle(e.x, e.y, this.circleRadiusForRender),
						this.mask._graphics.fill(),
						this.publishEvent({
							type: "TutorialStep",
							tutorial: this.currentTutorial,
							step: this.tutorialStepTo + 1
						})
				},
				onShowTutorial: function (e) {
					this.currentTutorial = e.tutorial;
					var t = this.node.getChildByName("Tutorial_" + e.tutorial);
					t && (this.node.active = !0, this.setTutorialSetp(t.children))
				},
				onInitStepMoveForward: function (e) {
					this.prestige = UserData.getMineDataRef("Prestige"),
						1 == e.currentStep && 1 == UserData.GameData.CurrentMine && 0 == this.prestige.time && (Analysis.sendEvent({
							type: "guide_type",
							num: 1,
							data: {
								type: "step2"
							}
						}), this.publishEvent({
							type: "ShowTutorial",
							tutorial: "Elevator"
						})),
						2 == e.currentStep && 1 == UserData.GameData.CurrentMine && 0 == this.prestige.time && (Analysis.sendEvent({
							type: "guide_type",
							num: 1,
							data: {
								type: "step3"
							}
						}), this.publishEvent({
							type: "ShowTutorial",
							tutorial: "StoreHouse"
						})),
						2.5 == e.currentStep && 1 == UserData.GameData.CurrentMine && 0 == this.prestige.time && (Analysis.sendEvent({
							type: "guide_type",
							num: 1,
							data: {
								type: "step4"
							}
						}), this.publishEvent({
							type: "ShowTutorial",
							tutorial: "UpgradeSeamLayer"
						})),
						4 == e.currentStep && 1 == UserData.GameData.CurrentMine && 0 == this.prestige.time && (Analysis.sendEvent({
							type: "guide_type",
							num: 1,
							data: {
								type: "step5"
							}
						}), this.publishEvent({
							type: "ShowTutorial",
							tutorial: "UnlockSeamLayer2"
						})),
						5.5 == e.currentStep && 1 == UserData.GameData.CurrentMine && 0 == this.prestige.time && this.publishEvent({
							type: "ShowTutorial",
							tutorial: "Boost"
						}),
						UserData.getMineDataRef("Common").initStep = e.currentStep
				},
				onSyncCloudData: function (e) {
					this._hideForSync = !1,
						this.node.active = !1,
						this.node.x = 0
				},
				onCloseSyncDataDialog: function (e) {
					this._hideForSync = !1,
						this.node.x = 0
				},
				onOpenSyncDataDialog: function (e) {
					this._hideForSync = !0,
						this.node.x = 2e3
				}
			}),
			cc._RF.pop()
	},
	{
		EasyEvent: "EasyEvent"
	}],
	UI: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "5d9863nURtH+bPHMjddYKpf", "UI"),
			cc.Class({
				extends: cc.Component,
				editor: {
					menu: "Extensions/UI",
					executeInEditMode: !0
				},
				start: function () { }
			}),
			cc._RF.pop()
	},
	{}],
	UPLTVAd: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "78482JfsvVAIIFPZsqwYKP4", "UPLTVAd");
		var i = e("UPLTV").upltv;
		cc.bridgeInterface = e("UPLTV").bridgeInterface,
			cc.Class({
				extends: e("BaseAd"),
				properties: {
					rewardPlaceId: "VD01"
				},
				init: function () {
					this._isVideoLoading = !0,
						i.intSdk(0);
					var e = this;
					this.setAdLoadCallback(),
						i.setRewardVideoShowCallback(function (t, a) {
							var n = "Upltv_Rewardvideo_Unkown";
							t == i.AdEventType.VIDEO_EVENT_DID_SHOW ? n = "Upltv_Rewardvideo_Did_Show" : t == i.AdEventType.VIDEO_EVENT_DID_CLICK ? n = "Upltv_Rewardvideo_Did_Click" : t == i.AdEventType.VIDEO_EVENT_DID_CLOSE ? n = "Upltv_Rewardvideo_Close" : t == i.AdEventType.VIDEO_EVENT_DID_GIVEN_REWARD ? (e.videoSuccess(), n = "Upltv_Rewardvideo_Given_Reward") : t == i.AdEventType.VIDEO_EVENT_DID_ABANDON_REWARD && (e.videoAbort(), n = "Upltv_Rewardvideo_Abandon_Reward"),
								Analysis.sendEvent({
									type: n
								}),
								e.setAdLoadCallback(),
								console.log("===> js RewardVideo Show Callback, event: %s, at: %s", n, a)
						})
				},
				setAdLoadCallback: function () {
					var e = this;
					i.setRewardVideoLoadCallback(function (t, a) {
						console.log("===> js RewardVideo LoadCallback Success at: %s", t),
							e._isVideoLoading = !1,
							Analysis.sendEvent({
								type: "Upltv_Rewardvideo_Load_Success"
							})
					},
						function (t, a) {
							e._isVideoLoading = !1,
								Analysis.sendEvent({
									type: "Upltv_Rewardvideo_Load_Fail"
								}),
								console.log("===> js RewardVideo LoadCallback Fail at: %s", t)
						})
				},
				isVideoLoading: function () {
					return this._isVideoLoading
				},
				isVideoComplete: function () {
					return i.isRewardReady()
				},
				showVideo: function (e) {
					this._rewardedVideoSuccess = !1,
						this.videoSuccess = e.success,
						this.videoAbort = e.abort,
						this.videoFail = e.fail;
					var t = i.isRewardReady();
					console.log("===> js isRewardReady r: %s", t),
						1 == t && (console.log("===> js showRewardVideo call"), i.showRewardVideo(this.rewardPlaceId))
				}
			}),
			cc._RF.pop()
	},
	{
		BaseAd: "BaseAd",
		UPLTV: "UPLTV"
	}],
	UPLTVAndroid: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "af330QQ2pJDMJbGF94gDeEs", "UPLTVAndroid");
		var i = "com/up/ads/cocosjs/JsProxy",
			n = !1,
			r = r || {
				setShowLog: function (e) {
					void 0 != e && null != e && (n = e)
				},
				printJsLog: function (e) {
					n && void 0 != e && null != e && jsb.reflection.callStaticMethod("android/util/Log", "i", "(Ljava/lang/String;Ljava/lang/String;)I", "cocos2dx-js", e)
				},
				initAndroidSDK: function (e, t, a) {
					jsb.reflection.callStaticMethod(i, "initSDKByZone", "(ILjava/lang/String;)V", e, a),
						jsb.reflection.callStaticMethod(i, "setInvokeDelegate", "(Ljava/lang/String;)V", t)
				},
				initAndroidAbtConfigJson: function (e, t, a, n, r, o, s) {
					jsb.reflection.callStaticMethod(i, "initAbtConfigJsonForJs", "(Ljava/lang/String;ZILjava/lang/String;Ljava/lang/String;ILjava/lang/String;)V", e, t, a, n, r, o, s)
				},
				getAndroidAbtConfig: function (e) {
					return jsb.reflection.callStaticMethod(i, "getAbtConfig", "(Ljava/lang/String;)Ljava/lang/String;", e)
				},
				showAndroidRewardDebugUI: function () {
					jsb.reflection.callStaticMethod(i, "showRewardDebugActivity", "()V")
				},
				setAndroidRewardVideoLoadCallback: function () {
					jsb.reflection.callStaticMethod(i, "setRewardVideoLoadCallback", "()V")
				},
				isAndroidRewardReady: function () {
					return jsb.reflection.callStaticMethod(i, "isRewardReady", "()Z")
				},
				showAndroidRewardVideo: function (e) {
					null == e && (e = "reward_video"),
						jsb.reflection.callStaticMethod(i, "showRewardVideo", "(Ljava/lang/String;)V", e)
				},
				setAndroidInterstitialLoadCallback: function (e) {
					jsb.reflection.callStaticMethod(i, "setInterstitialCallbackAt", "(Ljava/lang/String;)V", e)
				},
				isAndroidInterstitialReadyAsyn: function (e, t) {
					jsb.reflection.callStaticMethod(i, "isInterstitialReadyForJs", "(Ljava/lang/String;Ljava/lang/String;)V", e, t)
				},
				isAndroidInterstitialReady: function (e) {
					return jsb.reflection.callStaticMethod(i, "isInterstitialReady", "(Ljava/lang/String;)Z", e)
				},
				showAndroidInterstitialAd: function (e) {
					jsb.reflection.callStaticMethod(i, "showInterstitialForJs", "(Ljava/lang/String;)V", e)
				},
				showAndroidInterstitialDebugUI: function () {
					jsb.reflection.callStaticMethod(i, "showInterstitialDebugActivityForJs", "()V")
				},
				removeAndroidBannerAdAt: function (e) {
					jsb.reflection.callStaticMethod(i, "removeBanner", "(Ljava/lang/String;)V", e)
				},
				showAndroidBannerAdAtTop: function (e) {
					jsb.reflection.callStaticMethod(i, "showTopBanner", "(Ljava/lang/String;)V", e)
				},
				showAndroidBannerAdAtBottom: function (e) {
					jsb.reflection.callStaticMethod(i, "showBottomBanner", "(Ljava/lang/String;)V", e)
				},
				hideAndroidBannerAdAtTop: function () {
					jsb.reflection.callStaticMethod(i, "hideTopBanner", "()V")
				},
				hideAndroidBannerAdAtBottom: function () {
					jsb.reflection.callStaticMethod(i, "hideBottomBanner", "()V")
				},
				showAndroidIconAdAt: function (e, t, a, n, r, o) {
					jsb.reflection.callStaticMethod(i, "showIconAd", "(IIIIILjava/lang/String;)V", e, t, a, n, r, o)
				},
				removeAndroidIconAdAt: function (e) {
					jsb.reflection.callStaticMethod(i, "removeIconAd", "(Ljava/lang/String;)V", e)
				},
				loadAndroidAdsByManual: function () {
					jsb.reflection.callStaticMethod(i, "loadAnroidAdsByManual", "()V")
				},
				exitAndroidApp: function () {
					jsb.reflection.callStaticMethod(i, "exitAndroidApp", "()V")
				},
				setAndroidManifestPackageName: function (e) {
					jsb.reflection.callStaticMethod(i, "setManifestPackageName", "(Ljava/lang/String;)V", e)
				},
				onAndroidBackPressed: function () {
					jsb.reflection.callStaticMethod(i, "onBackPressed", "()V")
				},
				setAndroidCustomerId: function (e) {
					jsb.reflection.callStaticMethod(i, "setCustomerIdForJs", "(Ljava/lang/String;)V", e)
				},
				updateAndroidAccessPrivacyInfoStatus: function (e) {
					jsb.reflection.callStaticMethod(i, "updateAccessPrivacyInfoStatus", "(I)V", e)
				},
				getAndroidAccessPrivacyInfoStatus: function () {
					return jsb.reflection.callStaticMethod(i, "getAccessPrivacyInfoStatus", "()I")
				},
				notifyAndroidAccessPrivacyInfoStatus: function (e, t) {
					jsb.reflection.callStaticMethod(i, "notifyAccessPrivacyInfoStatus", "(Ljava/lang/String;I)V", e, t)
				},
				isAndroidEuropeanUnionUser: function (e, t) {
					jsb.reflection.callStaticMethod(i, "isEuropeanUnionUser", "(Ljava/lang/String;I)V", e, t)
				},
				reportIvokePluginMethodReceive: function (e) {
					jsb.reflection.callStaticMethod(i, "reportIvokePluginMethodReceive", "(Ljava/lang/String;)V", e)
				},
				reportRDRewardClose: function (e) {
					jsb.reflection.callStaticMethod(i, "reportRDRewardClose", "(Ljava/lang/String;)V", e)
				},
				reportRDRewardClick: function (e) {
					jsb.reflection.callStaticMethod(i, "reportRDRewardClick", "(Ljava/lang/String;)V", e)
				},
				reportRDRewardGiven: function (e) {
					jsb.reflection.callStaticMethod(i, "reportRDRewardGiven", "(Ljava/lang/String;)V", e)
				},
				reportRDShowDid: function (e) {
					jsb.reflection.callStaticMethod(i, "reportRDShowDid", "(Ljava/lang/String;)V", e)
				},
				reportRDRewardCancel: function (e) {
					jsb.reflection.callStaticMethod(i, "reportRDRewardCancel", "(Ljava/lang/String;)V", e)
				},
				reportILClose: function (e, t) {
					jsb.reflection.callStaticMethod(i, "reportILClose", "(Ljava/lang/String;Ljava/lang/String;)V", void 0 == t ? "" : t, e)
				},
				reportILClick: function (e, t) {
					jsb.reflection.callStaticMethod(i, "reportILClick", "(Ljava/lang/String;Ljava/lang/String;)V", void 0 == t ? "" : t, e)
				},
				reportILShowDid: function (e, t) {
					jsb.reflection.callStaticMethod(i, "reportILShowDid", "(Ljava/lang/String;Ljava/lang/String;)V", void 0 == t ? "" : t, e)
				},
				isOnlineDebugReportEnable: function () {
					return jsb.reflection.callStaticMethod(i, "isReportOnlineEnable", "()Z")
				}
			};
		t.exports = r,
			cc._RF.pop()
	},
	{}],
	UPLTVIos: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "c8172y55JxCQqhUiHKpj0V/", "UPLTVIos");
		var i = "UpAdsBrigeJs",
			n = !1,
			r = r || {
				setShowLog: function (e) {
					void 0 != e && null != e && (n = e)
				},
				printJsLog: function (e) {
					n && void 0 != e && null != e && jsb.reflection.callStaticMethod(i, "printJsLog:", e)
				},
				initIosSDK: function (e, t, a) {
					void 0 != a && null != a ? jsb.reflection.callStaticMethod(i, "initSdkByJs:withCallback:", e, a) : jsb.reflection.callStaticMethod(i, "initSdkByJs:", e),
						jsb.reflection.callStaticMethod(i, "setVokeMethod:", t)
				},
				initIosAbtConfigJson: function (e, t, a, n, r, o, s) {
					jsb.reflection.callStaticMethod(i, "initAbtConfigJsonByJs:complete:paid:channel:gender:age:tags:", e, t, a, n, r, o, s)
				},
				getIosAbtConfig: function (e) {
					return jsb.reflection.callStaticMethod(i, "getIosAbtConfigByJs:", e)
				},
				showIosRewardDebugUI: function () {
					jsb.reflection.callStaticMethod(i, "showRewardDebugActivityByJs")
				},
				setIosRewardVideoLoadCallback: function () {
					jsb.reflection.callStaticMethod(i, "setRewardVideoLoadCallbackByJs")
				},
				isIosRewardReady: function () {
					return jsb.reflection.callStaticMethod(i, "isIosRewardReadyByJs")
				},
				showIosRewardVideo: function (e) {
					jsb.reflection.callStaticMethod(i, "showIosRewardVideoByJs:", e)
				},
				isIosInterstitialReadyAsyn: function (e, t) {
					jsb.reflection.callStaticMethod(i, "isInterstitialReadyAsynByJs:callback:", e, t)
				},
				isIosInterstitialReady: function (e) {
					return jsb.reflection.callStaticMethod(i, "isInterstitialReadyByJs:", e)
				},
				showIosInterstitialAd: function (e) {
					jsb.reflection.callStaticMethod(i, "showInterstitialByJs:", e)
				},
				setIosInterstitialLoadCallback: function (e) {
					jsb.reflection.callStaticMethod(i, "setInterstitialCallbackByJs:", e)
				},
				showIosInterstitialDebugUI: function () {
					jsb.reflection.callStaticMethod(i, "showInterstitialDebugActivityByJs")
				},
				removeIosBannerAdAt: function (e) {
					jsb.reflection.callStaticMethod(i, "removeBannerByJs:", e)
				},
				showIosBannerAdAtTop: function (e) {
					jsb.reflection.callStaticMethod(i, "showTopBannerByJs:", e)
				},
				showIosBannerAdAtBottom: function (e) {
					jsb.reflection.callStaticMethod(i, "showBottomBannerByJs:", e)
				},
				hideIosBannerAdAtTop: function () {
					jsb.reflection.callStaticMethod(i, "hideTopBannerByJs")
				},
				hideIosBannerAdAtBottom: function () {
					jsb.reflection.callStaticMethod(i, "hideBottomBannerByJs")
				},
				setIosTopBannerPading: function (e) {
					var t = "0";
					"number" == typeof e ? t = String(e) : "string" == typeof e && (t = e),
						jsb.reflection.callStaticMethod(i, "setTopBannerPadingForIphonexByJs:", t)
				},
				showIosIconAdAt: function (e, t, a, n, r, o) {
					jsb.reflection.callStaticMethod(i, "showIconX:y:width:height:rotationAngle:placementId:", e, t, a, n, r, o)
				},
				removeIosIconAdAt: function (e) {
					jsb.reflection.callStaticMethod(i, "removeIcon:", e)
				},
				loadIosAdsByManual: function () {
					jsb.reflection.callStaticMethod(i, "loadIosAdsByManualByJs")
				},
				exitIosApp: function () {
					jsb.reflection.callStaticMethod(i, "exitIosAppByJs")
				},
				updateIosAccessPrivacyInfoStatus: function (e) {
					jsb.reflection.callStaticMethod(i, "updateAccessPrivacyInfoStatusByJs:", e)
				},
				getIosAccessPrivacyInfoStatus: function () {
					return jsb.reflection.callStaticMethod(i, "getAccessPrivacyInfoStatusByJs")
				},
				notifyIosAccessPrivacyInfoStatus: function (e, t) {
					jsb.reflection.callStaticMethod(i, "notifyAccessPrivacyInfoStatusByJs:callId:", e, t)
				},
				isIosEuropeanUnionUser: function (e, t) {
					jsb.reflection.callStaticMethod(i, "isEuropeanUnionUserByJs:callId:", e, t)
				},
				reportIvokePluginMethodReceive: function (e) {
					jsb.reflection.callStaticMethod(i, "reportIvokePluginMethodReceiveByJs:", e)
				},
				reportRDRewardClose: function (e) {
					jsb.reflection.callStaticMethod(i, "reportRDRewardCloseByJs:", e)
				},
				reportRDRewardClick: function (e) {
					jsb.reflection.callStaticMethod(i, "reportRDRewardClickByJs:", e)
				},
				reportRDRewardGiven: function (e) {
					jsb.reflection.callStaticMethod(i, "reportRDRewardGivenByJs:", e)
				},
				reportRDShowDid: function (e) {
					jsb.reflection.callStaticMethod(i, "reportRDShowDidByJs:", e)
				},
				reportRDRewardCancel: function (e) {
					jsb.reflection.callStaticMethod(i, "reportRDRewardCancelByJs:", e)
				},
				reportILClose: function (e, t) {
					jsb.reflection.callStaticMethod(i, "reportILCloseByJs:msg:", void 0 == t ? "" : t, e)
				},
				reportILClick: function (e, t) {
					jsb.reflection.callStaticMethod(i, "reportILClickByJs:msg:", void 0 == t ? "" : t, e)
				},
				reportILShowDid: function (e, t) {
					jsb.reflection.callStaticMethod(i, "reportILShowDidByJs:msg:", void 0 == t ? "" : t, e)
				},
				isOnlineDebugReportEnable: function () {
					return jsb.reflection.callStaticMethod(i, "isReportOnlineEnableByJs")
				}
			};
		t.exports = r,
			cc._RF.pop()
	},
	{}],
	UPLTV: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "7d5e6vC+fhLBIC1Klo1k769", "UPLTV");
		var i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ?
			function (e) {
				return typeof e
			} : function (e) {
				return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
			},
			n = e("UPLTVIos"),
			r = e("UPLTVAndroid"),
			o = function (e) {
				0
			},
			s = function (e, t, a) {
				void 0 != u && (void 0 != a ? u.onlineDebugReport(e, t, a) : u.onlineDebugReport(e, t))
			},
			c = {
				handleVokeParams: function (e) {
					if (void 0 != e && null != e && "string" == typeof e) {
						var t = e.indexOf(":"),
							a = null;
						if (!(t <= 0)) {
							var i = (a = e.substr(t + 1)).indexOf(","),
								n = a.substring(0, i),
								r = null,
								d = null; (t = (a = a.substr(i + 1)).indexOf(":")) > 0 && (i = (a = a.substr(t + 1)).indexOf(",")) > 0 && (r = a.substring(0, i), null != (a = a.substr(i + 1)) && (t = a.indexOf(":")) > 0 && (d = a.substr(t + 1)));
							var h = void 0 != u && u.isOnlineDebugReportEnable();
							if (h && s(c.Function_Receive_Callback, "CocosJs Receive message, callname:" + n + ", cpadid:" + r), c.Function_Reward_DidLoadFail == n) null != l.rewardLoadFailCall && "function" == typeof l.rewardLoadFailCall ? (l.rewardLoadFailCall(r, d), l.resetRewardLoadCallback()) : o();
							else if (c.Function_Reward_DidLoadSuccess == n) null != l.rewardLoadSuccessCall && "function" == typeof l.rewardLoadSuccessCall ? (l.rewardLoadSuccessCall(r, d), l.resetRewardLoadCallback()) : o();
							else if (c.Function_Reward_WillOpen == n) {
								null != (f = l.rewardShowCall) && "function" == typeof f ? (f(u.AdEventType.VIDEO_EVENT_WILL_SHOW, r), h && s(n, "CocosJs did run callback on video willopen event.")) : h && s(n, "CocosJs not run callback on video willopen event.")
							} else if (c.Function_Reward_DidOpen == n) {
								null != (f = l.rewardShowCall) && "function" == typeof f ? (f(u.AdEventType.VIDEO_EVENT_DID_SHOW, r), h && s(n, "CocosJs did run callback on video shown event.")) : h && s(n, "CocosJs not run callback on video shown event.")
							} else if (c.Function_Reward_DidClick == n) {
								null != (f = l.rewardShowCall) && "function" == typeof f ? (f(u.AdEventType.VIDEO_EVENT_DID_CLICK, r), h && s(n, "CocosJs did run callback on video clicked event.")) : h && s(n, "CocosJs not run callback on video clicked event.")
							} else if (c.Function_Reward_DidClose == n) {
								null != (f = l.rewardShowCall) && "function" == typeof f ? (f(u.AdEventType.VIDEO_EVENT_DID_CLOSE, r), h && s(n, "CocosJs did run callback on video closed event.")) : h && s(n, "CocosJs not run callback on video closed event.")
							} else if (c.Function_Reward_DidGivien == n) {
								null != (f = l.rewardShowCall) && "function" == typeof f ? (f(u.AdEventType.VIDEO_EVENT_DID_GIVEN_REWARD, r), h && s(n, "CocosJs did run callback on video reward given event.")) : h && s(n, "CocosJs not run callback on video reward given event.")
							} else if (c.Function_Reward_DidAbandon == n) {
								null != (f = l.rewardShowCall) && "function" == typeof f ? (f(u.AdEventType.VIDEO_EVENT_DID_ABANDON_REWARD, r), h && s(n, "CocosJs did run callback on video reward cancel event.")) : h && s(n, "CocosJs not run callback on video reward cancel event.")
							} else if (c.Function_Interstitial_DidLoadFail == n) {
								var m = r + "_Interstitial";
								if (null != (p = l.get(m))) null != (f = p.interstitialLoadFailCall) && "function" == typeof f && f(r, d),
									l.remove(m),
									o()
							} else if (c.Function_Interstitial_DidLoadSuccess == n) {
								m = r + "_Interstitial";
								if (null != (p = l.get(m))) null != (f = p.interstitialLoadSuccessCall) && "function" == typeof f ? f(r, d) : o(),
									l.remove(m);
								else o()
							} else if (c.Function_Interstitial_Willshow == n) {
								var g = !1;
								if (null != (p = l.get(r))) null != (f = p.interstitialShowCall) && "function" == typeof f && (f(u.AdEventType.INTERSTITIAL_EVENT_WILL_SHOW, r), h && (g = !0, s(n, "CocosJs did run callback on il ad willshown event at " + r, r)));
								h && 0 == g && s(n, "CocosJs not run callback on il ad willshown event at " + r, r)
							} else if (c.Function_Interstitial_Didshow == n) {
								g = !1;
								if (null != (p = l.get(r))) null != (f = p.interstitialShowCall) && "function" == typeof f && (f(u.AdEventType.INTERSTITIAL_EVENT_DID_SHOW, r), h && (g = !0, s(n, "CocosJs did run callback on il ad shown event at " + r, r)));
								h && 0 == g && s(n, "CocosJs not run callback on il ad shown event at " + r, r)
							} else if (c.Function_Interstitial_Didclose == n) {
								g = !1;
								if (null != (p = l.get(r))) null != (f = p.interstitialShowCall) && "function" == typeof f && (f(u.AdEventType.INTERSTITIAL_EVENT_DID_CLOSE, r), h && (g = !0, s(n, "CocosJs did run callback on il ad closed event at " + r, r)));
								h && 0 == g && s(n, "CocosJs not run callback on il ad closed event at " + r, r)
							} else if (c.Function_Interstitial_Didclick == n) {
								g = !1;
								if (null != (p = l.get(r))) null != (f = p.interstitialShowCall) && "function" == typeof f && (f(u.AdEventType.INTERSTITIAL_EVENT_DID_CLICK, r), h && (g = !0, s(n, "CocosJs did run callback on il ad clicked event at " + r, r)));
								h && 0 == g && s(n, "CocosJs not run callback on il ad clicked event at " + r, r)
							} else if (c.Function_Banner_DidRemove == n) {
								if (null != (p = l.get(r))) null != (f = p.bannerEventCall) && "function" == typeof f && f(u.AdEventType.BANNER_EVENT_DID_REMOVED, r);
								l.remove(r)
							} else if (c.Function_Banner_DidClick == n) {
								if (null != (p = l.get(r))) null != (f = p.bannerEventCall) && "function" == typeof f && f(u.AdEventType.BANNER_EVENT_DID_CLICK, r)
							} else if (c.Function_Banner_DidShow == n) {
								if (null != (p = l.get(r))) null != (f = p.bannerEventCall) && "function" == typeof f && f(u.AdEventType.BANNER_EVENT_DID_SHOW, r)
							} else if (c.Function_Icon_DidLoad == n) {
								if (null != (p = l.get(r))) null != (f = p.iconEventCall) && "function" == typeof f && f(u.AdEventType.ICON_EVENT_DID_LOAD, r)
							} else if (c.Function_Icon_DidLoadFail == n) {
								if (null != (p = l.get(r))) null != (f = p.iconEventCall) && "function" == typeof f && f(u.AdEventType.ICON_EVENT_DID_LOADFAIL, r)
							} else if (c.Function_Icon_DidShow == n) {
								if (null != (p = l.get(r))) null != (f = p.iconEventCall) && "function" == typeof f && f(u.AdEventType.ICON_EVENT_DID_SHOW, r)
							} else if (c.Function_Icon_DidClick == n) {
								var p, f;
								if (null != (p = l.get(r))) null != (f = p.iconEventCall) && "function" == typeof f && f(u.AdEventType.ICON_EVENT_DID_CLICK, r)
							} else cc.sys.os === cc.sys.OS_ANDROID && (c.Function_ExitAd_DidShow == n ? null != l.backPressedCall && "function" == typeof l.backPressedCall ? l.backPressedCall(u.AdEventType.EXITAD_EVENT_DID_SHOW, d) : o() : c.Function_ExitAd_DidClick == n ? null != l.backPressedCall && "function" == typeof l.backPressedCall ? l.backPressedCall(u.AdEventType.EXITAD_EVENT_DID_CLICK, d) : o() : c.Function_ExitAd_DidClickMore == n ? null != l.backPressedCall && "function" == typeof l.backPressedCall ? l.backPressedCall(u.AdEventType.EXITAD_EVENT_DID_CLICKMORE, d) : o() : c.Function_ExitAd_DidExit == n ? null != l.backPressedCall && "function" == typeof l.backPressedCall ? l.backPressedCall(u.AdEventType.EXITAD_EVENT_DID_EXIT, d) : o() : c.Function_ExitAd_DidCancel == n && (null != l.backPressedCall && "function" == typeof l.backPressedCall ? l.backPressedCall(u.AdEventType.EXITAD_EVENT_DID_CANCEL, d) : o()))
						}
					}
				},
				Function_Receive_Callback: "receive_callback",
				Function_Reward_WillOpen: "reward_willopen",
				Function_Reward_DidOpen: "reward_didopen",
				Function_Reward_DidClick: "reward_didclick",
				Function_Reward_DidClose: "reward_didclose",
				Function_Reward_DidGivien: "reward_didgiven",
				Function_Reward_DidAbandon: "reward_didabandon",
				Function_Interstitial_Willshow: "interstitial_willshow",
				Function_Interstitial_Didshow: "interstitial_didshow",
				Function_Interstitial_Didclose: "interstitial_didclose",
				Function_Interstitial_Didclick: "interstitial_didclick",
				Function_Banner_DidShow: "banner_didshow",
				Function_Banner_DidClick: "banner_didclick",
				Function_Banner_DidRemove: "banner_didremove",
				Function_Reward_DidLoadFail: "reward_didloadfail",
				Function_Reward_DidLoadSuccess: "reward_didloadsuccess",
				Function_Interstitial_DidLoadFail: "interstitial_didloadfail",
				Function_Interstitial_DidLoadSuccess: "interstitial_didloadsuccess",
				Function_ExitAd_DidShow: "exitad_didshow",
				Function_ExitAd_DidClick: "exitad_didclick",
				Function_ExitAd_DidClickMore: "exitad_didclickmore",
				Function_ExitAd_DidExit: "exitad_onexit",
				Function_ExitAd_DidCancel: "exitad_oncancel",
				Function_Icon_DidLoad: "icon_didload",
				Function_Icon_DidLoadFail: "icon_didloadfail",
				Function_Icon_DidShow: "icon_didshow",
				Function_Icon_DidClick: "icon_didclick"
			},
			l = {
				map: new Object,
				length: 0,
				rewardLoadFailCall: null,
				rewardLoadSuccessCall: null,
				rewardShowCall: null,
				backPressedCall: null,
				resetRewardLoadCallback: function () {
					this.rewardLoadFailCall = null,
						this.rewardLoadSuccessCall = null
				},
				size: function () {
					return this.length
				},
				put: function (e, t) {
					this.map["_" + e] || ++this.length,
						this.map["_" + e] = t
				},
				remove: function (e) {
					return !!this.map["_" + e] && (--this.length, delete this.map["_" + e])
				},
				exist: function (e) {
					return !!this.map["_" + e]
				},
				get: function (e) {
					return this.map["_" + e] ? this.map["_" + e] : null
				},
				print: function () {
					var e = "";
					for (var t in this.map) e += "/n" + t + "  Value:" + this.map[t];
					return o(),
						e
				},
				test: function () {
					this.put("1",
						function () { }),
						this.put("2",
							function (e) {
								console.log("===> js map function call at 2, v type: %s", void 0 === e ? "undefined" : i(e))
							}),
						this.put("4",
							function () { }),
						o(this.exist("1")),
						o(this.exist("3"));
					var e = this.get("2");
					e && e("========================"),
						this.print(),
						this.remove("1"),
						this.remove("3"),
						o(this.size())
				}
			},
			d = function () {
				cc.sys.os === cc.sys.OS_IOS && null != u ? void 0 != u.upltvbridge && null != u.upltvbridge || (u.upltvbridge = n) : cc.sys.os === cc.sys.OS_ANDROID && null != u && (void 0 != u.upltvbridge && null != u.upltvbridge || (u.upltvbridge = r))
			},
			h = {
				initSdkSuccessed: !1,
				initVokeCall: null,
				initSdkCallback: function (e) {
					"true" != e && 1 != e || (this.initSdkSuccessed = !0),
						console.log("===> js initSdkCallback..., %s", e),
						void 0 != this.initVokeCall && null != this.initVokeCall && "function" == typeof this.initVokeCall && this.initVokeCall(this.initSdkSuccessed),
						void 0 != this.initVokeCall && (this.initVokeCall = null)
				},
				vokeMethod: function (e) {
					c.handleVokeParams(e)
				},
				vokeILReadyMethod: function (e, t) {
					this.handleILReadyMethod(e, t)
				},
				handleILReadyMethod: function (e, t) {
					var a = "ILReady_" + e,
						i = l.get(a);
					if (null != i && (l.remove(a), "function" == typeof i)) {
						var n = !1;
						"true" != t && 1 != t || (n = !0),
							i(n)
					}
				}
			},
			u = u || {
				upltvbridge: null,
				intSdk: function (e, t) {
					if (1 != cc.bridgeInterface.initSdkSuccessed) {
						o(),
							void 0 != t && null != t && "function" == typeof t && (o(), cc.bridgeInterface.initVokeCall = t);
						var a = "cc.bridgeInterface.vokeMethod",
							i = "cc.bridgeInterface.initSdkCallback";
						d(),
							cc.sys.os === cc.sys.OS_IOS ? void 0 != this.upltvbridge && null != this.upltvbridge && (this.upltvbridge.setShowLog(!1), this.upltvbridge.initIosSDK(e, a, i)) : cc.sys.os === cc.sys.OS_ANDROID && void 0 != this.upltvbridge && null != this.upltvbridge && (this.upltvbridge.setShowLog(!1), this.upltvbridge.initAndroidSDK(e, a, i))
					} else o()
				},
				initAbtConfigJson: function (e, t, a, i, n, r, o) {
					var s = null;
					if (void 0 != o && null != o && o instanceof Array) {
						var c = o.length;
						s = '{"array":[';
						for (var l = 0; l < c; l++) s += '"' + o[l],
							s += l < c - 1 ? '",' : '"]}'
					}
					void 0 == t && (t = !1),
						void 0 == a && (a = 0),
						void 0 == i && (i = ""),
						void 0 == n && (n = ""),
						void 0 == r && (r = -1),
						cc.sys.os === cc.sys.OS_IOS ? void 0 != this.upltvbridge && null != this.upltvbridge && this.upltvbridge.initIosAbtConfigJson(e, t, a, i, n, r, s) : cc.sys.os === cc.sys.OS_ANDROID && void 0 != this.upltvbridge && null != this.upltvbridge && this.upltvbridge.initAndroidAbtConfigJson(e, t, a, i, n, r, s)
				},
				getAbtConfig: function (e) {
					if (void 0 != e && null != e && "string" == typeof e) if (cc.sys.os === cc.sys.OS_IOS) {
						if (void 0 != this.upltvbridge && null != this.upltvbridge) return "" == (t = this.upltvbridge.getIosAbtConfig(e)) ? null : t
					} else if (cc.sys.os === cc.sys.OS_ANDROID) {
						var t;
						if (void 0 != this.upltvbridge && null != this.upltvbridge) return "" == (t = this.upltvbridge.getAndroidAbtConfig(e)) ? null : t
					}
					return null
				},
				showRewardDebugUI: function () {
					void 0 != this.upltvbridge && null != this.upltvbridge && (cc.sys.os === cc.sys.OS_IOS ? this.upltvbridge.showIosRewardDebugUI() : cc.sys.os === cc.sys.OS_ANDROID && this.upltvbridge.showAndroidRewardDebugUI())
				},
				setRewardVideoLoadCallback: function (e, t) {
					void 0 != e && null != e && "function" == typeof e && void 0 != t && null != t && "function" == typeof t ? (l.rewardLoadFailCall = void 0 == t ? null : t, l.rewardLoadSuccessCall = void 0 == e ? null : e, void 0 != this.upltvbridge && null != this.upltvbridge && (cc.sys.os === cc.sys.OS_IOS ? this.upltvbridge.setIosRewardVideoLoadCallback() : cc.sys.os === cc.sys.OS_ANDROID && this.upltvbridge.setAndroidRewardVideoLoadCallback())) : o()
				},
				setRewardVideoShowCallback: function (e) {
					if (void 0 != this.upltvbridge && null != this.upltvbridge) {
						if (void 0 == e || null == e || "function" != typeof e) return void o();
						l.rewardShowCall = e
					}
				},
				isRewardReady: function () {
					if (void 0 != this.upltvbridge && null != this.upltvbridge) {
						if (cc.sys.os === cc.sys.OS_IOS) return this.upltvbridge.isIosRewardReady();
						if (cc.sys.os === cc.sys.OS_ANDROID) return this.upltvbridge.isAndroidRewardReady()
					}
					return !1
				},
				showRewardVideo: function (e) {
					void 0 != this.upltvbridge && null != this.upltvbridge && (void 0 == e && (e = null), cc.sys.os === cc.sys.OS_IOS ? this.upltvbridge.showIosRewardVideo(e) : cc.sys.os === cc.sys.OS_ANDROID && this.upltvbridge.showAndroidRewardVideo(e))
				},
				isInterstitialReadyAsyn: function (e, t) {
					if (void 0 != this.upltvbridge && null != this.upltvbridge) {
						if (void 0 == e || null == e) return void o();
						if (t == e || null == t) return void o();
						if ("function" != typeof t) return void o();
						var a = "ILReady_" + e;
						l.put(a, t),
							cc.sys.os === cc.sys.OS_IOS ? this.upltvbridge.isIosInterstitialReadyAsyn(e, "cc.bridgeInterface.vokeILReadyMethod") : cc.sys.os === cc.sys.OS_ANDROID && this.upltvbridge.isAndroidInterstitialReadyAsyn(e, "cc.bridgeInterface.vokeILReadyMethod")
					}
				},
				isInterstitialReady: function (e) {
					if (void 0 != this.upltvbridge && null != this.upltvbridge) {
						if (void 0 == e || null == e) return void o();
						if (cc.sys.os === cc.sys.OS_IOS) return this.upltvbridge.isIosInterstitialReady(e);
						if (cc.sys.os === cc.sys.OS_ANDROID) return this.upltvbridge.isAndroidInterstitialReady(e)
					}
					return !1
				},
				showInterstitialAd: function (e) {
					if (void 0 != this.upltvbridge && null != this.upltvbridge) {
						if (void 0 == e || null == e) return void o();
						cc.sys.os === cc.sys.OS_IOS ? this.upltvbridge.showIosInterstitialAd(e) : cc.sys.os === cc.sys.OS_ANDROID && this.upltvbridge.showAndroidInterstitialAd(e)
					}
				},
				setInterstitialLoadCallback: function (e, t, a) {
					if (void 0 != this.upltvbridge && null != this.upltvbridge) {
						if (void 0 == e || null == e) return void o();
						if (void 0 == t || null == t || "function" != typeof t) return void o();
						if (void 0 == a || null == a || "function" != typeof a) return void o();
						var i = e + "_Interstitial",
							n = l.get(i) || {};
						n.interstitialLoadSuccessCall = t,
							n.interstitialLoadFailCall = a,
							l.put(i, n),
							o(l.size()),
							cc.sys.os === cc.sys.OS_IOS ? this.upltvbridge.setIosInterstitialLoadCallback(e) : cc.sys.os === cc.sys.OS_ANDROID && this.upltvbridge.setAndroidInterstitialLoadCallback(e)
					}
				},
				setInterstitialShowCallback: function (e, t) {
					if (void 0 != this.upltvbridge && null != this.upltvbridge) {
						if (void 0 == e || null == e) return void o();
						if (void 0 == t || null == t || "function" != typeof t) return void o();
						var a = e,
							i = l.get(a) || {};
						i.interstitialShowCall = t,
							l.put(a, i)
					}
				},
				showInterstitialDebugUI: function () {
					void 0 != this.upltvbridge && null != this.upltvbridge && (cc.sys.os === cc.sys.OS_IOS ? this.upltvbridge.showIosInterstitialDebugUI() : cc.sys.os === cc.sys.OS_ANDROID && this.upltvbridge.showAndroidInterstitialDebugUI())
				},
				removeBannerAdAt: function (e) {
					if (void 0 != this.upltvbridge && null != this.upltvbridge) {
						if (void 0 == e || null == e) return void o();
						cc.sys.os === cc.sys.OS_IOS ? this.upltvbridge.removeIosBannerAdAt(e) : cc.sys.os === cc.sys.OS_ANDROID && this.upltvbridge.removeAndroidBannerAdAt(e)
					}
				},
				showBannerAdAtTop: function (e) {
					if (void 0 != this.upltvbridge && null != this.upltvbridge) {
						if (void 0 == e || null == e) return void o();
						cc.sys.os === cc.sys.OS_IOS ? this.upltvbridge.showIosBannerAdAtTop(e) : cc.sys.os === cc.sys.OS_ANDROID && this.upltvbridge.showAndroidBannerAdAtTop(e)
					}
				},
				showBannerAdAtBottom: function (e) {
					if (void 0 != this.upltvbridge && null != this.upltvbridge) {
						if (void 0 == e || null == e) return void o();
						cc.sys.os === cc.sys.OS_IOS ? this.upltvbridge.showIosBannerAdAtBottom(e) : cc.sys.os === cc.sys.OS_ANDROID && this.upltvbridge.showAndroidBannerAdAtBottom(e)
					}
				},
				hideBannerAdAtTop: function () {
					void 0 != this.upltvbridge && null != this.upltvbridge && (cc.sys.os === cc.sys.OS_IOS ? this.upltvbridge.hideIosBannerAdAtTop() : cc.sys.os === cc.sys.OS_ANDROID && this.upltvbridge.hideAndroidBannerAdAtTop())
				},
				hideBannerAdAtBottom: function () {
					void 0 != this.upltvbridge && null != this.upltvbridge && (cc.sys.os === cc.sys.OS_IOS ? this.upltvbridge.hideIosBannerAdAtBottom() : cc.sys.os === cc.sys.OS_ANDROID && this.upltvbridge.hideAndroidBannerAdAtBottom())
				},
				setTopBannerPadingForIphoneX: function (e) {
					void 0 != this.upltvbridge && null != this.upltvbridge && (cc.sys.os === cc.sys.OS_IOS ? this.upltvbridge.setIosTopBannerPading(e) : (cc.sys.os, cc.sys.OS_ANDROID))
				},
				setBannerShowCallback: function (e, t) {
					if (void 0 != this.upltvbridge && null != this.upltvbridge) {
						if (void 0 == e || null == e) return void o();
						if (void 0 == t || null == t || "function" != typeof t) return void o();
						var a = l.get(e) || {};
						a.bannerEventCall = t,
							l.put(e, a)
					}
				},
				setIconCallback: function (e, t) {
					if (void 0 != this.upltvbridge && null != this.upltvbridge) {
						if (void 0 == e || null == e) return void o();
						if (void 0 == t || null == t || "function" != typeof t) return void o();
						var a = l.get(e) || {};
						a.iconEventCall = t,
							l.put(e, a)
					}
				},
				showIconAd: function (e, t, a, i, n, r) {
					if (void 0 != this.upltvbridge && null != this.upltvbridge) {
						if (void 0 == r || null == r) return void o();
						cc.sys.os === cc.sys.OS_ANDROID && this.upltvbridge.showAndroidIconAdAt(e, t, a, i, n, r),
							cc.sys.os === cc.sys.OS_IOS && this.upltvbridge.showIosIconAdAt(e, t, a, i, n, r)
					}
				},
				removeIconAd: function (e) {
					if (void 0 != this.upltvbridge && null != this.upltvbridge) {
						if (void 0 == e || null == e) return void o();
						cc.sys.os === cc.sys.OS_ANDROID && this.upltvbridge.removeAndroidIconAdAt(e),
							cc.sys.os === cc.sys.OS_IOS && this.upltvbridge.removeIosIconAdAt(e)
					}
				},
				loadAdsByManual: function () {
					void 0 != this.upltvbridge && null != this.upltvbridge && (cc.sys.os === cc.sys.OS_IOS ? this.upltvbridge.loadIosAdsByManual() : cc.sys.os === cc.sys.OS_ANDROID && this.upltvbridge.loadAndroidAdsByManual())
				},
				exitApp: function () {
					void 0 != this.upltvbridge && null != this.upltvbridge && (cc.sys.os === cc.sys.OS_IOS ? this.upltvbridge.exitIosApp() : cc.sys.os === cc.sys.OS_ANDROID && this.upltvbridge.exitAndroidApp())
				},
				setManifestPackageName: function (e) {
					void 0 != this.upltvbridge && null != this.upltvbridge && (cc.sys.os === cc.sys.OS_ANDROID ? this.upltvbridge.setAndroidManifestPackageName(e) : (cc.sys.os, cc.sys.OS_ANDROID))
				},
				onBackPressed: function () {
					void 0 != this.upltvbridge && null != this.upltvbridge && (cc.sys.os === cc.sys.OS_ANDROID ? this.upltvbridge.onAndroidBackPressed() : (cc.sys.os, cc.sys.OS_IOS))
				},
				setCustomerId: function (e) {
					if (d(), void 0 != this.upltvbridge && null != this.upltvbridge) if (cc.sys.os === cc.sys.OS_ANDROID) {
						if (void 0 == e || null == e) return void o();
						this.upltvbridge.setAndroidCustomerId(e)
					} else cc.sys.os,
						cc.sys.OS_IOS
				},
				setBackPressedCallback: function (e) {
					void 0 != this.upltvbridge && null != this.upltvbridge && (cc.sys.os === cc.sys.OS_ANDROID ? l.backPressedCall = void 0 == e ? null : e : (cc.sys.os, cc.sys.OS_IOS))
				},
				updateAccessPrivacyInfoStatus: function (e) {
					d(),
						void 0 != e && null != e && (e == u.GDPRPermissionEnum.UPAccessPrivacyInfoStatusUnkown || e == u.GDPRPermissionEnum.UPAccessPrivacyInfoStatusAccepted || e == u.GDPRPermissionEnum.UPAccessPrivacyInfoStatusDefined) ? void 0 != this.upltvbridge && null != this.upltvbridge && (cc.sys.os === cc.sys.OS_ANDROID ? this.upltvbridge.updateAndroidAccessPrivacyInfoStatus(e) : cc.sys.os === cc.sys.OS_IOS && this.upltvbridge.updateIosAccessPrivacyInfoStatus(e)) : o()
				},
				getAccessPrivacyInfoStatus: function () {
					d();
					var e = 0;
					return void 0 != this.upltvbridge && null != this.upltvbridge && (cc.sys.os === cc.sys.OS_ANDROID ? e = this.upltvbridge.getAndroidAccessPrivacyInfoStatus() : cc.sys.os === cc.sys.OS_IOS && (e = this.upltvbridge.getIosAccessPrivacyInfoStatus())),
						1 == e ? u.GDPRPermissionEnum.UPAccessPrivacyInfoStatusAccepted : 2 == e ? u.GDPRPermissionEnum.UPAccessPrivacyInfoStatusDefined : u.GDPRPermissionEnum.UPAccessPrivacyInfoStatusUnkown
				},
				notifyAccessPrivacyInfoStatus: function (e) {
					if (d(), void 0 != e && null != e) if ("function" == typeof e) {
						if (void 0 != this.upltvbridge && null != this.upltvbridge) {
							u.GDPRPermissionEnum.functionId = u.GDPRPermissionEnum.functionId + 1;
							var t = u.GDPRPermissionEnum.functionId,
								a = "" + t;
							l.put(a, e);
							var i = "upltv.GDPRPermissionEnum.javaCall";
							cc.sys.os === cc.sys.OS_ANDROID ? this.upltvbridge.notifyAndroidAccessPrivacyInfoStatus(i, t) : cc.sys.os === cc.sys.OS_IOS && this.upltvbridge.notifyIosAccessPrivacyInfoStatus(i, a)
						}
					} else o();
					else o()
				},
				isEuropeanUnionUser: function (e) {
					if (d(), void 0 != e && null != e) if ("function" == typeof e) {
						if (void 0 != this.upltvbridge && null != this.upltvbridge) {
							u.GDPRPermissionEnum.functionId = u.GDPRPermissionEnum.functionId + 1;
							var t = u.GDPRPermissionEnum.functionId,
								a = "" + t;
							l.put(a, e);
							var i = "upltv.GDPRPermissionEnum.javaCall";
							cc.sys.os === cc.sys.OS_ANDROID ? this.upltvbridge.isAndroidEuropeanUnionUser(i, t) : cc.sys.os === cc.sys.OS_IOS && this.upltvbridge.isIosEuropeanUnionUser(i, a)
						}
					} else o();
					else o()
				},
				isOnlineDebugReportEnable: function () {
					return (cc.sys.os === cc.sys.OS_ANDROID || cc.sys.os === cc.sys.OS_IOS) && this.upltvbridge.isOnlineDebugReportEnable()
				},
				onlineDebugReport: function (e, t, a) {
					cc.sys.os !== cc.sys.OS_ANDROID && cc.sys.os !== cc.sys.OS_IOS || (c.Function_Receive_Callback == e ? this.upltvbridge.reportIvokePluginMethodReceive(t) : c.Function_Reward_DidOpen == e ? this.upltvbridge.reportRDShowDid(t) : c.Function_Reward_DidClick == e ? this.upltvbridge.reportRDRewardClick(t) : c.Function_Reward_DidClose == e ? this.upltvbridge.reportRDRewardClose(t) : c.Function_Reward_DidGivien == e ? this.upltvbridge.reportRDRewardGiven(t) : c.Function_Reward_DidAbandon == e ? this.upltvbridge.reportRDRewardCancel(t) : c.Function_Interstitial_Didshow == e ? this.upltvbridge.reportILShowDid(t, a) : c.Function_Interstitial_Didclick == e ? this.upltvbridge.reportILClick(t, a) : c.Function_Interstitial_Didclose == e && this.upltvbridge.reportILClose(t, a))
				}
			};
		u.GDPRPermissionEnum = {
			functionId: 0,
			javaCall: function (e, t) {
				var a = "" + e,
					i = l.get(a);
				null != i && (null != i && "function" == typeof i && i(t), l.remove(a))
			}
		},
			u.GDPRPermissionEnum.UPAccessPrivacyInfoStatusUnkown = 0,
			u.GDPRPermissionEnum.UPAccessPrivacyInfoStatusAccepted = 1,
			u.GDPRPermissionEnum.UPAccessPrivacyInfoStatusDefined = 2,
			u.AdEventType = {},
			u.AdEventType.VIDEO_EVENT_DID_SHOW = 0,
			u.AdEventType.VIDEO_EVENT_DID_CLICK = 1,
			u.AdEventType.VIDEO_EVENT_DID_CLOSE = 2,
			u.AdEventType.VIDEO_EVENT_DID_GIVEN_REWARD = 3,
			u.AdEventType.VIDEO_EVENT_DID_ABANDON_REWARD = 4,
			u.AdEventType.INTERSTITIAL_EVENT_DID_SHOW = 5,
			u.AdEventType.INTERSTITIAL_EVENT_DID_CLICK = 6,
			u.AdEventType.INTERSTITIAL_EVENT_DID_CLOSE = 7,
			u.AdEventType.BANNER_EVENT_DID_SHOW = 8,
			u.AdEventType.BANNER_EVENT_DID_CLICK = 9,
			u.AdEventType.BANNER_EVENT_DID_REMOVED = 10,
			u.AdEventType.EXITAD_EVENT_DID_SHOW = 11,
			u.AdEventType.EXITAD_EVENT_DID_CLICK = 12,
			u.AdEventType.EXITAD_EVENT_DID_CLICKMORE = 13,
			u.AdEventType.EXITAD_EVENT_DID_EXIT = 14,
			u.AdEventType.EXITAD_EVENT_DID_CANCEL = 15,
			u.AdEventType.ICON_EVENT_DID_LOAD = 16,
			u.AdEventType.ICON_EVENT_DID_LOADFAIL = 17,
			u.AdEventType.ICON_EVENT_DID_SHOW = 18,
			u.AdEventType.ICON_EVENT_DID_CLICK = 19,
			u.AdEventType.VIDEO_EVENT_WILL_SHOW = 20,
			u.AdEventType.INTERSTITIAL_EVENT_WILL_SHOW = 21,
			t.exports.upltv = u,
			t.exports.bridgeInterface = h,
			cc._RF.pop()
	},
	{
		UPLTVAndroid: "UPLTVAndroid",
		UPLTVIos: "UPLTVIos"
	}],
	UserData: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "6396cow9SlFV4oXqWf8hZKy", "UserData");
		var i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ?
			function (e) {
				return typeof e
			} : function (e) {
				return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
			};
		e("Constant"),
			window.UserData = {
				keys: ["GameData", "Setting"],
				cloudData: {},
				defaultData: {
					GameData: {
						UpdateDate: (new Date).getTime(),
						CurrentMine: "1",
						TotalCash: "10",
						Cashs: { 1: "10" },
						SuperCash: 0,
						InviteCount: 0,
						Ad: {
							coolDowns: {},
							availableDates: {},
							lastWatchRewardVideoTime: 0,
							lastWatchRealRewardVideoTime: 0
						},
						Mine: {
							Default: {
								Common: {
									showIdleCash: !1,
									unlocked: !1,
									preUnlocked: !1,
									initStep: 0
								},
								Idle: {
									waitCollected: !1,
									idleDate: null
								},
								Prestige: {
									time: 0
								},
								Elevator: {},
								Seam: {
									list: [],
									unlockedLayerNum: 0
								},
								StoreHouse: {},
								Manager: {},
								Setting: {
									LevelUpMode: 1
								}
							}
						},
						Item: {
							ad: {},
							active: {},
							inventory: {}
						},
						Sign: {
							day: 0,
							video: 0,
							extraDay: 0,
							date: {
								year: 0,
								month: 0,
								day: 0
							},
							extraList: {
								7: !1,
								14: !1,
								21: !1,
								30: !1
							}
						},
						CashAdd: {
							get: 0,
							date: 0
						},
						Analytics: {}
					},
					Setting: {
						Vibrate: !0,
						Music: !0,
						Language: {
							Current: "en",
							IsSetUp: !1
						},
						Version: "1.0.2",
						NeedClearData: !1
					}
				},
				parseDataNByTemplate: function () {
					var e = function e(t, a) {
						for (var n in t = t || {},
							a) null != t[n] ? "object" == i(t[n]) && (t[n] = e(t[n], a[n])) : t[n] = a[n];
						return t
					},
						t = JSON.parse(JSON.stringify(this.defaultData));
					for (var a in this.keys.forEach(function (a) {
						UserData[a] = e(UserData[a], t[a])
					}), UserData.GameData.Mine) {
						var n = JSON.parse(JSON.stringify(this.defaultData.GameData.Mine.Default));
						UserData.GameData.Mine[a] = e(UserData.GameData.Mine[a], n)
					}
					"string" == typeof UserData.GameData.SuperCash ? UserData.GameData.SuperCash = 1e4 : "number" == typeof UserData.GameData.SuperCash && UserData.GameData.SuperCash > 2e4 && (UserData.GameData.SuperCash = 1e4)
				},
				read: function (e, t, a) {
					var i = this;
					if (e) {
						if (- 1 == this.keys.indexOf(e)) return void cc.warn("\u6307\u5b9a\u7684key:", e, "\u4e0d\u5b58\u5728,\u8bfb\u53d6\u5931\u8d25.");
						DataStore.read({
							key: e,
							success: function (a) {
								try {
									null != a && (i[e] = JSON.parse(a))
								} catch (t) {
									Analysis.sendEvent({
										type: "UserDataLostLocal"
									}),
										cc.warn("\u6570\u636e", e, "\u4e0d\u662f\u6807\u51c6\u7684JSON\u683c\u5f0f,\u8bfb\u53d6\u5931\u8d25.", a)
								} finally {
									"function" == typeof t && t(i)
								}
							},
							fail: a
						})
					} else {
						var n = [];
						this.keys.forEach(function (e) {
							n.push(new Promise(function (t, a) {
								DataStore.read({
									key: e,
									success: function (a) {
										try {
											null != a && (i[e] = JSON.parse(a))
										} catch (t) {
											Analysis.sendEvent({
												type: "UserDataLostLocal"
											}),
												cc.warn("\u6570\u636e", e, "\u4e0d\u662f\u6807\u51c6\u7684JSON\u683c\u5f0f,\u8bfb\u53d6\u5931\u8d25.", a)
										} finally {
											t(e)
										}
									},
									fail: function () {
										a(e)
									}
								})
							}))
						}),
							Promise.all(n).then(function (e) {
								"function" == typeof t && t(i)
							}).
								catch(function (e) {
									cc.error(e),
										"function" == typeof a && a(i)
								})
					}
				},
				readCloud: function (e, t, a) {
					var i = this;
					if (e) {
						if (- 1 == this.keys.indexOf(e)) return void cc.warn("\u6307\u5b9a\u7684key:", e, "\u4e0d\u5b58\u5728,\u8bfb\u53d6\u5931\u8d25.");
						DataStore.readCloud({
							key: e,
							success: function (a) {
								try {
									null != a && (i.cloudData[e] = JSON.parse(a))
								} catch (t) {
									Analysis.sendEvent({
										type: "UserDataLostCloud"
									}),
										ErrorHandler.report({
											message: "\u6570\u636e" + e + "\u4e0d\u662f\u6807\u51c6\u7684JSON\u683c\u5f0f,\u8bfb\u53d6\u5931\u8d25.",
											data: a
										}),
										cc.warn("\u6570\u636e", e, "\u4e0d\u662f\u6807\u51c6\u7684JSON\u683c\u5f0f,\u8bfb\u53d6\u5931\u8d25.", a)
								} finally {
									"function" == typeof t && t(i)
								}
							},
							fail: a
						})
					} else {
						var n = [];
						this.keys.forEach(function (e) {
							n.push(new Promise(function (t, a) {
								DataStore.readCloud({
									key: e,
									success: function (a) {
										try {
											null != a && (i.cloudData[e] = JSON.parse(a))
										} catch (t) {
											Analysis.sendEvent({
												type: "UserDataLostCloud"
											}),
												ErrorHandler.report({
													message: "\u6570\u636e" + e + "\u4e0d\u662f\u6807\u51c6\u7684JSON\u683c\u5f0f,\u8bfb\u53d6\u5931\u8d25.",
													data: a
												}),
												cc.warn("\u6570\u636e", e, "\u4e0d\u662f\u6807\u51c6\u7684JSON\u683c\u5f0f,\u8bfb\u53d6\u5931\u8d25.", a)
										} finally {
											t(e)
										}
									},
									fail: function () {
										a(e)
									}
								})
							}))
						}),
							Promise.all(n).then(function (e) {
								"function" == typeof t && t(i)
							}).
								catch(function (e) {
									cc.error(e),
										"function" == typeof a && a(i)
								})
					}
				},
				save: function (e, t, a) {
					var i = this;
					if (e) {
						if (- 1 == this.keys.indexOf(e)) return void cc.warn("\u6307\u5b9a\u7684key:", e, "\u4e0d\u5b58\u5728,\u4fdd\u5b58\u5931\u8d25.");
						DataStore.save({
							key: e,
							data: JSON.stringify(this[e]),
							success: t,
							fail: a
						})
					} else {
						var n = [];
						this.keys.forEach(function (e) {
							n.push(new Promise(function (t, a) {
								DataStore.save({
									key: e,
									data: JSON.stringify(i[e]),
									success: function (a) {
										t(e)
									},
									fail: function () {
										a(e)
									}
								})
							}))
						}),
							Promise.all(n).then(function (e) {
								"function" == typeof t && t(i)
							}).
								catch(function (e) {
									"function" == typeof a && a(i)
								})
					}
				},
				saveCloud: function (e, t, a) {
					console.log('保存缓存')
					var i = this;
					if (e) {
						if (- 1 == this.keys.indexOf(e)) return void cc.warn("\u6307\u5b9a\u7684key:", e, "\u4e0d\u5b58\u5728,\u4fdd\u5b58\u5931\u8d25.");
						DataStore.saveCloud({
							key: e,
							data: JSON.stringify(this[e]),
							success: t,
							fail: a
						})
					} else {
						var n = [];
						this.keys.forEach(function (e) {
							n.push(new Promise(function (t, a) {
								DataStore.saveCloud({
									key: e,
									data: JSON.stringify(i[e]),
									success: function (a) {
										t(e)
									},
									fail: function () {
										a(e)
									}
								})
							}))
						}),
							Promise.all(n).then(function (e) {
								"function" == typeof t && t(i)
							}).
								catch(function (e) {
									"function" == typeof a && a(i)
								})
					}
				},
				delete: function (e, t, a) {
					var i = this,
						n = JSON.parse(JSON.stringify(this.defaultData));
					if (e) {
						if (- 1 == this.keys.indexOf(e)) return void cc.warn("\u6307\u5b9a\u7684key:", e, "\u4e0d\u5b58\u5728,\u5220\u9664\u5931\u8d25.");
						DataStore.delete({
							key: e,
							success: t,
							fail: a
						}),
							this[e] = n[e] || {}
					} else {
						var r = [];
						this.keys.forEach(function (e) {
							r.push(new Promise(function (t, a) {
								i[e] = n[e] || {},
									DataStore.delete({
										key: e,
										success: function (a) {
											t(e)
										},
										fail: function () {
											a(e)
										}
									})
							}))
						}),
							Promise.all(r).then(function (e) {
								"function" == typeof t && t(i)
							}).
								catch(function (e) {
									"function" == typeof a && a(i)
								})
					}
				},
				clear: function () {
					this.delete()
				},
				getMineDataRef: function (e, t) {
					t = t || this.GameData.CurrentMine;
					var a = void 0;
					if (e) {
						if (!this.GameData.Mine[t]) {
							var i = JSON.parse(JSON.stringify(this.defaultData.GameData.Mine.Default));
							this.GameData.Mine[t] = i
						}
						this.GameData.Mine[t][e] || (this.GameData.Mine[t][e] = {}),
							a = this.GameData.Mine[t][e]
					} else 0;
					return a
				},
				prestigeMine: function (e) {
					e = e || this.GameData.CurrentMine;
					var t = this.GameData.Mine[e].Prestige;
					t.time++;
					var a = this.GameData.Mine[e].Setting;
					this.GameData.Mine[e] = JSON.parse(JSON.stringify(this.defaultData.GameData.Mine.Default)),
						this.GameData.Mine[e].Prestige = t,
						this.GameData.Mine[e].Common.unlocked = !0,
						this.GameData.Mine[e].Setting = a
				},
				getFriendsData: function () {
					window.FriendsData = {},
						Platform.getRanklistData({
							rankName: Constant.RANKLIST_FRIEND,
							data: FriendsData,
							successCb: function () {
								console.log("\u6392\u884c\u699c\u6570\u636e\u89e3\u6790\u6210\u529f", FriendsData)
							}
						})
				}
			},
			cc._RF.pop()
	},
	{
		Constant: "Constant"
	}],
	ViewMgr: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "57f8dJaYVdIGqyu1VD4QFaF", "ViewMgr");
		var i = {
			Dialog: cc.macro.MAX_ZINDEX / 2,
			Toast: cc.macro.MAX_ZINDEX
		},
			n = ["prefab/dialog/BaseDialog", "prefab/dialog/Toast", "prefab/dialog/CommonDialog"],
			r = cc.Enum({
				BaseDialog: 0,
				Toast: 1,
				CommonDialog: 2
			}),
			o = cc.Class({
				properties: {},
				init: function (e) {
					this.nowDialog = null,
						this.prefabs = [],
						this.dialogs = [],
						this.callback = null
				},
				initRes: function (e) {
					console.log("[ViewMgr Init Start]");
					var t = this;
					cc.loader.loadResArray(n,
						function (a, i) {
							if (!a) {
								for (var n = 0; n < i.length; ++n) cc.loader.setAutoRelease(i[n], !1),
									t.prefabs.push(i[n]);
								console.log("[ViewMgr Init Success]"),
									"function" == typeof e && e()
							}
						})
				},
				showDialog: function (e, t) {
					return null == (t = t || {}).hidePre && (t.hidePre = !0),
						null == t.block && (t.block = !0),
						null == t.touchhide && (t.touchhide = !0),
						null == t.shade && (t.shade = !0),
						null != this.nowDialog && (t.hidePre && this.nowDialog.removeFromParent(!1), this.dialogs.push(this.nowDialog)),
						this.nowDialog = cc.instantiate(this.prefabs[r.BaseDialog]),
						this.nowDialog.getComponent("BaseDialog").addDialog(e),
						this.nowDialog.zIndex = i.Dialog,
						cc.director.getScene().getChildByName("Canvas").addChild(this.nowDialog),
						this.nowDialog.getComponent("BaseDialog").setArgs(t),
						this.nowDialog.getComponent("BaseDialog").show(),
						this.nowDialog
				},
				showCommonDialog: function (e, t, a, i) {
					var n = cc.instantiate(this.prefabs[r.CommonDialog]);
					return n.getComponent("CommonDialog").setArgs(e, t, a, i),
						this.showDialog(n)
				},
				hideDialogBegin: function (e) {
					this.callback = e,
						null != this.nowDialog && this.nowDialog.getComponent("BaseDialog").hide()
				},
				hideDialogEnd: function () {
					this.nowDialog && (this.nowDialog.destroy(), this.nowDialog = null),
						this.callback && (this.callback(), this.callback = null),
						this.nowDialog || this.dialogs.length > 0 && (this.nowDialog = this.dialogs.pop(), this.nowDialog.parent || cc.director.getScene().getChildByName("Canvas").addChild(this.nowDialog))
				},
				showToast: function (e, t) {
					var a = cc.instantiate(this.prefabs[r.Toast]);
					a.zIndex = i.Toast,
						cc.director.getScene().getChildByName("Canvas").addChild(a),
						a.getComponent("Toast").setToastString(e),
						a.getComponent("Toast").show(t)
				},
				showToastAddChild: function (e, t) {
					var a = cc.instantiate(this.prefabs[r.Toast]);
					a.zIndex = i.Toast,
						a.addChild(e),
						cc.director.getScene().getChildByName("Canvas").addChild(a),
						a.getComponent("Toast").show(t)
				},
				removeDialog: function (e) {
					for (var t = 0; t < this.dialogs.length; t++) {
						this.dialogs[t] == e && (this.dialogs.splice(t, 1), e.destroy())
					}
				}
			});
		t.exports = o,
			cc._RF.pop()
	},
	{}],
	VirtualAdLayer: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "089a0nhdKFMBLb3tApCCrjC", "VirtualAdLayer"),
			cc.Class({
				extends: e("BaseLayer"),
				editor: {
					menu: "Layer/VirtualAdLayer"
				},
				properties: {
					totalAdTime: 15,
					labTimeLeft: cc.Label,
					progressBar: cc.ProgressBar
				},
				onLoad: function () {
					this._super(),
						this.node.x = cc.winSize.width / 2,
						this.node.y = cc.winSize.height / 2
				},
				start: function () {
					this.timeLeft = this.totalAdTime,
						this.labTimeLeft.string = Math.ceil(this.timeLeft),
						this.schedule(this._cutDown, .01)
				},
				_cutDown: function (e) {
					if (this.timeLeft -= e, this.timeLeft <= 0) return this.unschedule(this._cutDown),
						void this._timeOver();
					this.progressBar.progress = this.timeLeft / this.totalAdTime,
						this.labTimeLeft.string = Math.ceil(this.timeLeft)
				},
				_timeOver: function () {
					var e = this;
					this.progressBar.progress = 0,
						this.labTimeLeft.string = 0,
						this.scheduleOnce(function () {
							"function" == typeof e.successCallback && e.successCallback({
								virtual: !0
							}),
								e.node.destroy()
						},
							.5)
				},
				setSuccessCallback: function (e) {
					this.successCallback = e
				}
			}),
			cc._RF.pop()
	},
	{
		BaseLayer: "BaseLayer"
	}],
	WeChatAd: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "fc5e1YC8glLJ5siFWUb/YAY", "WeChatAd"),
			cc.Class({
				extends: e("BaseAd"),
				properties: {
					BANNER_ID: "",
					VIDEO_ID: ""
				},
				showBanner: function (e) {
					var t = this;
					this.bottomBannerAd && this.bottomBannerAd.destroy(),
						this.bottomBannerAd = wx.createBannerAd({
							adUnitId: this.BANNER_ID,
							style: {
								left: 0,
								top: 704,
								width: 1e3
							}
						}),
						this.bottomBannerAd ? (this.bottomBannerAd.onLoad(function () {
							return console.log("\u5e95\u90e8banner \u5e7f\u544a\u52a0\u8f7d\u6210\u529f")
						}), this.bottomBannerAd.onError(function (t) {
							cc.error(t),
								console.log("Banner \u9519\u8bef\uff0c\u65e0\u5e7f\u544a\u8fd4\u56de"),
								e.fail && e.fail()
						}), this.bottomBannerAd.show().then(function () {
							console.log("\u5e95\u90e8banner \u5e7f\u544a\u663e\u793a"),
								e.success && e.success()
						}).
							catch(function (e) {
								cc.error(e)
							}), this.bottomBannerAd.onResize(function (a) {
								switch (t.bottomBannerAd.style.left = 0 * wx.getSystemInfoSync().windowWidth, t.bottomBannerAd.style.width = 1 * wx.getSystemInfoSync().windowWidth, e.position) {
									case "top":
										t.bottomBannerAd.style.top = 0;
										break;
									case "bottom":
										t.bottomBannerAd.style.top = wx.getSystemInfoSync().windowHeight - t.bottomBannerAd.style.realHeight + 1
								}
							})) : (console.log("Banner \u65e0\u5e7f\u544a\u8fd4\u56de"), e.fail && e.fail())
				},
				closeBanner: function () {
					this.bottomBannerAd && this.bottomBannerAd.destroy()
				},
				showVideo: function (e) {
					var t = wx.createRewardedVideoAd({
						adUnitId: this.VIDEO_ID
					});
					if (t) {
						var a = function a(n) {
							AudioHandler.playBGM(),
								n && n.isEnded || void 0 === n ? e.success && e.success() : e.abort && e.abort(),
								t.offClose(a),
								t.offError(i)
						};
						t.load().then(function () {
							t.show(),
								AudioHandler.stopBGM()
						}).
							catch(function (e) {
								return cc.error(e.errMsg)
							}),
							t.onClose(a);
						var i = function i(n) {
							cc.warn("Video Error \u65e0\u5e7f\u544a\u8fd4\u56de", n),
								e.fail && e.fail(),
								t.offClose(a),
								t.offError(i)
						};
						t.onError(i)
					} else cc.warn("Video \u65e0\u5e7f\u544a\u8fd4\u56de"),
						e.fail && e.fail()
				}
			}),
			cc._RF.pop()
	},
	{
		BaseAd: "BaseAd"
	}],
	WeChatDataStore: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "e5b422Ok91BUptVO/R90YqX", "WeChatDataStore"),
			cc.Class({
				extends: e("BaseDataStore")
			}),
			cc._RF.pop()
	},
	{
		BaseDataStore: "BaseDataStore"
	}],
	WeChatErrorHandler: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "e7025CJN15DxLEkSHTFnHyT", "WeChatErrorHandler"),
			cc.Class({
				extends: e("BaseErrorHandler")
			}),
			cc._RF.pop()
	},
	{
		BaseErrorHandler: "BaseErrorHandler"
	}],
	WeChatPlatform: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "c5b13ysWdNKzbDf5zXCbFvz", "WeChatPlatform"),
			cc.Class({
				extends: e("BasePlatform"),
				init: function () {
					var e = this;["login", "getLaunchOptionsSync", "showLoading", "hideLoading", "shareAppMessage", "showToast", "postMessage", "getOpenDataContext", "setUserCloudStorage", "getUserCloudStorage", "createGameClubButton", "showShareMenu", "onShareAppMessage", "navigateToMiniProgram", "previewImage", "createShortCut", "openCustomerServiceConversation", "onShow", "onHide", "vibrateShort", "getSystemInfoSync", "request", "exit"].forEach(function (t) {
						e[t] = function (e) {
							if (e || (e = {}), "function" == typeof wx[t]) return wx[t](e);
							cc.warn("[WeChatPlatform] \u65b9\u6cd5" + t + "\u672a\u5b9e\u73b0"),
								"function" == typeof e.fail && e.fail()
						}
					})
				}
			}),
			cc._RF.pop()
	},
	{
		BasePlatform: "BasePlatform"
	}],
	WeightActive: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "a4dbeD2pLFO6L+M9iI0emKH", "WeightActive");
		var i = cc.Class({
			extends: cc.Component,
			editor: {
				menu: "GameModule/Tutorial/TutorialWeightActive"
			},
			statics: {
				CurrentWeight: 0,
				Components: {}
			},
			properties: {
				weight: 1
			},
			onLoad: function () {
				i.Components[this.weight] || (i.Components[this.weight] = []),
					i.Components[this.weight].push(this)
			},
			onEnable: function () {
				if (this.weight >= i.CurrentWeight) {
					i.CurrentWeight = this.weight,
						this.wakeUp();
					for (var e = i.CurrentWeight - 1; e > 0; e--) i.Components[e] && i.Components[e].forEach(function (e) {
						e.sleep()
					})
				} else this.sleep()
			},
			onDisable: function () {
				if (this.weight == i.CurrentWeight) {
					var e = !1,
						t = !1;
					i.CurrentWeight = 0;
					for (var a = this.weight - 1; a > 0; a--) i.Components[a] && (i.Components[a].forEach(function (t) {
						t.wakeUp(),
							cc.isValid(t.node) && t.node.active && (e = !0)
					}), e && !t && (t = !0, i.CurrentWeight = a))
				}
			},
			sleep: function () {
				cc.isValid(this.node) && (this.node.opacity = 0)
			},
			wakeUp: function () {
				cc.isValid(this.node) && this.weight >= i.CurrentWeight && (this.node.opacity = 255)
			}
		});
		t.exports = i,
			cc._RF.pop()
	},
	{}],
	WorldMapLayer: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "538099V+SFPJoVR5cxsxz3S", "WorldMapLayer");
		var i = e("NumberData");
		cc.Class({
			extends: e("BaseLayer").declareEvent("CloseWorldMap"),
			editor: {
				menu: "Layer/Map/WorldMapLayer"
			},
			properties: {
				cashInfoNode: cc.Node,
				btnMineDetail: cc.Button,
				prbMapCashItem: cc.Prefab,
				mapContent: cc.Node,
				prbMineSelector: cc.Prefab,
				prbDialogMineDetail: cc.Prefab,
				landPlaceholderNodes: {
					default:
						[],
					type: cc.Node
				},
				landSelectorNodes: {
					default:
						[],
					type: cc.Node
				}
			},
			onLoad: function () {
				this._super(),
					this._loadMines()
			},
			start: function () {
				this.node.active = !1,
					this._refresh()
			},
			_refresh: function () {
				for (var e in this.tipEffect && (this.tipEffect.destroy(), this.tipEffect = null), UserData.GameData.Cashs) {
					var t = new i(UserData.GameData.Cashs[e]);
					CfgMgr.Mine.getMineConfig(UserData.GameData.CurrentMine).init_currency_type == e && (t = new i(UserData.GameData.TotalCash));
					for (var a = 1 + 5 * (e - 1); a <= 5 * e; a++) {
						var n = a,
							r = UserData.getMineDataRef("Prestige", n),
							o = CfgMgr.Mine.getPrestigeConfig(r.time + 1, n);
						if (o) {
							var s = new i(o.currency);
							if (t.compare(s) >= 0) {
								this._showTip();
								break
							}
						}
					}
				}
			},
			_showTip: function () {
				this.tipEffect || (this.tipEffect = this.btnMineDetail.addComponent(e("Scale")))
			},
			_loadMines: function () {
				var e = this;
				this.landPlaceholderNodes.forEach(function (t, a) {
					t.children.forEach(function (t) {
						var i = cc.instantiate(e.prbMineSelector);
						i.setPosition(t.getPosition()),
							i.x += t.getComponent("MinePlaceholder").offset.x,
							i.y += t.getComponent("MinePlaceholder").offset.y;
						var n = t.getComponent("MinePlaceholder").mine;
						i.getComponent("MineSelector").setMine(n),
							e.landSelectorNodes[a].addChild(i)
					})
				})
			},
			_loadCashItems: function () {
				for (var e in this.cashInfoNode.destroyAllChildren(), UserData.GameData.Cashs) {
					var t = cc.instantiate(this.prbMapCashItem);
					t.getComponent("MapCashItem").setType(e),
						this.cashInfoNode.addChild(t)
				}
			},
			_open: function () {
				Music.play("SFX_Button Open Map"),
					this.dialogMineDetailHandler = null,
					Analysis.sendEvent({
						type: "OpenWorldMap"
					}),
					this.node.active = !0,
					this._loadCashItems()
			},
			_close: function () {
				this.node.active = !1,
					this.dialogMineDetailHandler && ViewMgr.removeDialog(this.dialogMineDetailHandler),
					this.publishEvent({
						type: "CloseWorldMap"
					})
			},
			btnMineDetailClick: function (e, t) {
				this.tipEffect && (this.tipEffect.destroy(), this.tipEffect = null),
					this.dialogMineDetailHandler = ViewMgr.showDialog(cc.instantiate(this.prbDialogMineDetail))
			},
			btnBackClick: function (e, t) {
				Music.play("SFX_Button General"),
					this.node.active = !1,
					this.publishEvent({
						type: "CloseWorldMap"
					})
			},
			onOpenWorldMap: function (e) {
				this._open()
			},
			onMineSelected: function (e) {
				this.btnBackClick()
			},
			onPrestigeSuccess: function (e) {
				this._close()
			},
			onShowTutorial: function (e) {
				this._close()
			},
			onCashChanged: function (e) {
				this._refresh()
			},
			onMineMoveCenter: function (e) {
				var t = this.mapContent.convertToNodeSpaceAR(e.pos);
				this.mapContent.x = -t.x,
					this.mapContent.y = -t.y;
				var a = this.mapContent.getContentSize(),
					i = (a.height - cc.winSize.height) / 2,
					n = (a.width - cc.winSize.width) / 2;
				console.log(a, n, i),
					Math.abs(this.mapContent.x) > n && (this.mapContent.x = Math.abs(this.mapContent.x) / this.mapContent.x * n),
					Math.abs(this.mapContent.y) > i && (this.mapContent.y = Math.abs(this.mapContent.y) / this.mapContent.y * i)
			}
		}),
			cc._RF.pop()
	},
	{
		BaseLayer: "BaseLayer",
		NumberData: "NumberData",
		Scale: "Scale"
	}],
	algo: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "5cd1a3p2HRGmoNX1t6rl33Y", "algo");
		var i = {
			cipher: function (e, t) {
				for (var a = t.length / 4 - 1,
					n = [[], [], [], []], r = 0; r < 16; r++) n[r % 4][Math.floor(r / 4)] = e[r];
				n = i.addRoundKey(n, t, 0, 4);
				for (var o = 1; o < a; o++) n = i.subBytes(n, 4),
					n = i.shiftRows(n, 4),
					n = i.mixColumns(n, 4),
					n = i.addRoundKey(n, t, o, 4);
				n = i.subBytes(n, 4),
					n = i.shiftRows(n, 4),
					n = i.addRoundKey(n, t, a, 4);
				var s = new Array(16);
				for (r = 0; r < 16; r++) s[r] = n[r % 4][Math.floor(r / 4)];
				return s
			},
			keyExpansion: function (e) {
				for (var t = e.length / 4,
					a = t + 6,
					n = new Array(4 * (a + 1)), r = new Array(4), o = 0; o < t; o++) {
					var s = [e[4 * o], e[4 * o + 1], e[4 * o + 2], e[4 * o + 3]];
					n[o] = s
				}
				for (o = t; o < 4 * (a + 1); o++) {
					n[o] = new Array(4);
					for (var c = 0; c < 4; c++) r[c] = n[o - 1][c];
					if (o % t == 0) {
						r = i.subWord(i.rotWord(r));
						for (c = 0; c < 4; c++) r[c] ^= i.rCon[o / t][c]
					} else t > 6 && o % t == 4 && (r = i.subWord(r));
					for (c = 0; c < 4; c++) n[o][c] = n[o - t][c] ^ r[c]
				}
				return n
			},
			subBytes: function (e, t) {
				for (var a = 0; a < 4; a++) for (var n = 0; n < t; n++) e[a][n] = i.sBox[e[a][n]];
				return e
			},
			shiftRows: function (e, t) {
				for (var a = new Array(4), i = 1; i < 4; i++) {
					for (var n = 0; n < 4; n++) a[n] = e[i][(n + i) % t];
					for (n = 0; n < 4; n++) e[i][n] = a[n]
				}
				return e
			},
			mixColumns: function (e, t) {
				for (var a = 0; a < 4; a++) {
					for (var i = new Array(4), n = new Array(4), r = 0; r < 4; r++) i[r] = e[r][a],
						n[r] = 128 & e[r][a] ? e[r][a] << 1 ^ 283 : e[r][a] << 1;
					e[0][a] = n[0] ^ i[1] ^ n[1] ^ i[2] ^ i[3],
						e[1][a] = i[0] ^ n[1] ^ i[2] ^ n[2] ^ i[3],
						e[2][a] = i[0] ^ i[1] ^ n[2] ^ i[3] ^ n[3],
						e[3][a] = i[0] ^ n[0] ^ i[1] ^ i[2] ^ n[3]
				}
				return e
			},
			addRoundKey: function (e, t, a, i) {
				for (var n = 0; n < 4; n++) for (var r = 0; r < i; r++) e[n][r] ^= t[4 * a + r][n];
				return e
			},
			subWord: function (e) {
				for (var t = 0; t < 4; t++) e[t] = i.sBox[e[t]];
				return e
			},
			rotWord: function (e) {
				for (var t = e[0], a = 0; a < 3; a++) e[a] = e[a + 1];
				return e[3] = t,
					e
			},
			sBox: [99, 124, 119, 123, 242, 107, 111, 197, 48, 1, 103, 43, 254, 215, 171, 118, 202, 130, 201, 125, 250, 89, 71, 240, 173, 212, 162, 175, 156, 164, 114, 192, 183, 253, 147, 38, 54, 63, 247, 204, 52, 165, 229, 241, 113, 216, 49, 21, 4, 199, 35, 195, 24, 150, 5, 154, 7, 18, 128, 226, 235, 39, 178, 117, 9, 131, 44, 26, 27, 110, 90, 160, 82, 59, 214, 179, 41, 227, 47, 132, 83, 209, 0, 237, 32, 252, 177, 91, 106, 203, 190, 57, 74, 76, 88, 207, 208, 239, 170, 251, 67, 77, 51, 133, 69, 249, 2, 127, 80, 60, 159, 168, 81, 163, 64, 143, 146, 157, 56, 245, 188, 182, 218, 33, 16, 255, 243, 210, 205, 12, 19, 236, 95, 151, 68, 23, 196, 167, 126, 61, 100, 93, 25, 115, 96, 129, 79, 220, 34, 42, 144, 136, 70, 238, 184, 20, 222, 94, 11, 219, 224, 50, 58, 10, 73, 6, 36, 92, 194, 211, 172, 98, 145, 149, 228, 121, 231, 200, 55, 109, 141, 213, 78, 169, 108, 86, 244, 234, 101, 122, 174, 8, 186, 120, 37, 46, 28, 166, 180, 198, 232, 221, 116, 31, 75, 189, 139, 138, 112, 62, 181, 102, 72, 3, 246, 14, 97, 53, 87, 185, 134, 193, 29, 158, 225, 248, 152, 17, 105, 217, 142, 148, 155, 30, 135, 233, 206, 85, 40, 223, 140, 161, 137, 13, 191, 230, 66, 104, 65, 153, 45, 15, 176, 84, 187, 22],
			rCon: [[0, 0, 0, 0], [1, 0, 0, 0], [2, 0, 0, 0], [4, 0, 0, 0], [8, 0, 0, 0], [16, 0, 0, 0], [32, 0, 0, 0], [64, 0, 0, 0], [128, 0, 0, 0], [27, 0, 0, 0], [54, 0, 0, 0]]
		};
		void 0 !== t && t.exports && (t.exports = i),
			"function" == typeof define && define.amd && define([],
				function () {
					return i
				}),
			cc._RF.pop()
	},
	{}],
	"analytics-data": [function (e, t, a) {
		"use strict";
		var i;
		function n(e, t, a) {
			return t in e ? Object.defineProperty(e, t, {
				value: a,
				enumerable: !0,
				configurable: !0,
				writable: !0
			}) : e[t] = a,
				e
		}
		cc._RF.push(t, "5afccksKudLHZPyxbLL5osC", "analytics-data");
		var r = e("instant-util");
		t.exports = (n(i = {
			sever_login_event: function () {
				r.logEvent("sever_login")
			},
			sever_login_success_event: function () {
				r.logEvent("sever_login_success")
			},
			login_page_event: function () {
				r.logEvent("on_login_page")
			},
			game_page_event: function () {
				r.logEvent("on_game_page")
			},
			login_share_event: function () {
				r.logEvent("login_share")
			},
			speed_up_click_event: function () {
				r.logEvent("all_speed_up_click")
			},
			share_speed_up_event: function () {
				r.logEvent("share_speed_up")
			},
			share_speed_up_success_event: function () {
				r.logEvent("share_speed_up_success")
			},
			watch_video_speed_up_event: function () {
				r.logEvent("watch_video_speed_up")
			},
			watch_video_speed_up_success_event: function () {
				r.logEvent("watch_video_speed_up_success")
			},
			use_diamond_speed_up_event: function () {
				r.logEvent("use_diamond_speed_up")
			},
			all_bonus_coin_click_event: function () {
				r.logEvent("all_bonus_coin_click")
			},
			share_get_bonus_coin_event: function () {
				r.logEvent("share_get_bonus_coin")
			},
			share_get_bonus_coin_success_event: function () {
				r.logEvent("share_get_bonus_coin_success")
			},
			watch_video_get_bonus_coin_event: function () {
				r.logEvent("watch_video_get_bonus_coin")
			},
			watch_video_get_bonus_coin_success_event: function () {
				r.logEvent("watch_video_get_bonus_coin_success")
			},
			share_get_bonus_box_event: function () { },
			share_get_bonus_box_success_event: function () { },
			watch_video_get_bonus_box_event: function () { },
			watch_video_get_bonus_box_success_event: function () { },
			share_get_bonus_all_event: function () { },
			share_get_bonus_all_success_event: function () { },
			watch_video_get_bonus_all_event: function () { },
			watch_video_get_bonus_all_success_event: function () { },
			all_spin_click_event: function () {
				r.logEvent("all_spin_click")
			},
			share_spin_get_ticket_event: function () {
				r.logEvent("share_spin_get_ticket")
			},
			share_spin_get_ticket_success_event: function () {
				r.logEvent("share_spin_get_ticket_success")
			},
			watch_video_spin_get_ticket_event: function () {
				r.logEvent("watch_video_spin_get_ticket")
			},
			watch_video_spin_get_ticket_success_event: function () {
				r.logEvent("watch_video_spin_get_ticket_success")
			},
			spin_click_event: function () {
				r.logEvent("spin_go_click")
			},
			spin_click_lack_event: function () {
				r.logEvent("spin_go_click_lack")
			},
			share_spin_click_lack_get_ticket_event: function () {
				r.logEvent("share_spin_click_lack_get_ticket")
			},
			share_spin_click_lack_get_ticket_success_event: function () {
				r.logEvent("share_spin_click_lack_get_ticket_success")
			},
			watch_video_spin_click_lack_get_ticket_event: function () {
				r.logEvent("watch_video_spin_click_lack_get_ticket")
			},
			watch_video_spin_click_lack_get_ticket_success_event: function () {
				r.logEvent("watch_video_spin_click_lack_get_ticket_success")
			},
			share_5times_click_event: function () {
				r.logEvent("share_5times_click")
			},
			share_5times_click_success_event: function () {
				r.logEvent("share_5times_click_success")
			},
			share_10times_click_event: function () {
				r.logEvent("share_10times_click")
			},
			share_10times_click_success_event: function () {
				r.logEvent("share_10times_click_success")
			},
			watch_video_5times_click_event: function () {
				r.logEvent("watch_video_5times_click")
			},
			watch_video_5times_click_success_event: function () {
				r.logEvent("watch_video_5times_click_success")
			},
			watch_video_10times_click_event: function () {
				r.logEvent("watch_video_10times_click")
			},
			watch_video_10times_click_success_event: function () {
				r.logEvent("watch_video_10times_click_success")
			},
			game_share_event: function () { },
			game_share_success_event: function () { },
			game_share_fail_event: function (e) { },
			speed_up_with_share_event: function () {
				r.logEvent("speed_up_with_share")
			},
			speed_up_without_share_event: function () {
				r.logEvent("speed_up_without_share")
			},
			watch_video_event: function (e) { },
			watch_video_success_event: function (e) { },
			watch_video_shop_event: function (e) {
				r.logEvent("watch_video_shop")
			},
			watch_video_shop_success_event: function (e) {
				r.logEvent("watch_video_shop_success")
			},
			share_get_coin_event: function () {
				r.logEvent("share_get_coin")
			},
			share_get_coin_success_event: function () {
				r.logEvent("share_get_coin_success")
			},
			watch_video_get_coin_event: function () {
				r.logEvent("watch_video_get_coin")
			},
			watch_video_get_coin_success_event: function () {
				r.logEvent("watch_video_get_coin_success")
			},
			share_get_coin_fail_event: function (e) {
				"limit" == e ? r.logEvent("share_get_coin_limit") : r.logEvent("share_get_coin_fail")
			},
			entry_with_type_event: function (e) {
				"share" == e ? r.logEvent("entry_with_share") : "update" == e && r.logEvent("entry_with_update")
			},
			entry_with_context_event: function (e, t) {
				e && r.logEvent("entry_with_context", null, {
					contextId: e,
					group: t
				})
			},
			offline_coin_click_event: function () {
				r.logEvent("offline_coin_click")
			},
			spin_share_event: function () {
				r.logEvent("share_spin")
			},
			spin_share_success_event: function () {
				r.logEvent("share_spin_success")
			},
			upgrade_share_event: function () {
				r.logEvent("share_upgrade")
			},
			upgrade_share_success_event: function () {
				r.logEvent("share_upgrade_success")
			},
			share_levelup_event: function () {
				r.logEvent("level_up_share")
			},
			share_levelup_success_event: function () {
				r.logEvent("level_up_share_success")
			},
			share_offline_coin_event: function (e) {
				r.logEvent("share_offline_coin", null, {
					isShare: e
				})
			},
			share_offline_coin_success_event: function () {
				r.logEvent("share_offline_coin_success")
			},
			watch_video_offiline_coin_event: function () {
				r.logEvent("watch_video_offiline_coin")
			},
			watch_video_offiline_coin_success_event: function () {
				r.logEvent("watch_video_offiline_coin_success")
			},
			share_offline_coin_fail_event: function (e) {
				"limit" == e ? r.logEvent("share_offline_coin_limit") : r.logEvent("share_offline_coin_fail")
			},
			get_offline_coin_without_share_event: function () {
				r.logEvent("offline_coin_without_share")
			},
			create_shortcut_event: function () {
				r.logEvent("create_shortcut", null, {
					platform: r.getPlatform()
				})
			},
			player_link_click_event: function (e) {
				r.logEvent("player_link_click", null, {
					type: e
				})
			},
			new_player_link_click_event: function (e) {
				r.logEvent("new_player_link_click", null, {
					type: e
				})
			},
			new_player_switch_click_event: function (e) {
				r.logEvent("new_player_switch_click", null, {
					game_name: e
				})
			},
			fb_set_data_fail_event: function (e) {
				r.logEvent("fb_set_data_fail", null, {
					msg: e
				})
			},
			fb_get_data_fail_event: function (e) {
				r.logEvent("fb_get_data_fail", null, {
					msg: e
				})
			},
			achieve_level_event: function (e) {
				if (e) switch (e) {
					case 1:
						r.logEvent("achieve_level_2");
						break;
					case 2:
						r.logEvent("achieve_level_3");
						break;
					case 3:
						r.logEvent("achieve_level_4");
						break;
					case 4:
						r.logEvent("achieve_level_5");
						break;
					case 9:
						r.logEvent("achieve_level_10");
						break;
					case 14:
						r.logEvent("achieve_level_15");
						break;
					case 19:
						r.logEvent("achieve_level_20");
						break;
					case 24:
						r.logEvent("achieve_level_25");
						break;
					case 29:
						r.logEvent("achieve_level_30");
						break;
					case 34:
						r.logEvent("achieve_level_35");
						break;
					case 35:
						r.logEvent("achieve_level_36");
						break;
					case 36:
						r.logEvent("achieve_level_37")
				}
			},
			achieve_character_level_event: function (e) {
				if (e) switch (e) {
					case 4:
						r.logEvent("achieve_character_level_5_event");
						break;
					case 9:
						r.logEvent("achieve_character_level_10_event");
						break;
					case 19:
						r.logEvent("achieve_character_level_20_event");
						break;
					case 29:
						r.logEvent("achieve_character_level_30_event");
						break;
					case 34:
						r.logEvent("achieve_character_level_35_event");
						break;
					case 39:
						r.logEvent("achieve_character_level_40_event");
						break;
					case 44:
						r.logEvent("achieve_character_level_45_event")
				}
			},
			achieve_level_5_event: function () {
				r.logEvent("achieve_level_5")
			},
			achieve_level_10_event: function () {
				r.logEvent("achieve_level_10")
			},
			achieve_level_20_event: function () {
				r.logEvent("achieve_level_20")
			},
			achieve_level_30_event: function () {
				r.logEvent("achieve_level_30")
			},
			data_loading_event: function () {
				r.logEvent("data_loading")
			},
			invite_friends_info_start_event: function () {
				r.logEvent("invite_friends_info_start")
			},
			invite_friends_info_success_event: function () {
				r.logEvent("invite_friends_info_success")
			},
			invite_friends_info_err_event: function (e) {
				r.logEvent("invite_friends_info_err", null, {
					code: e
				})
			},
			invite_friends_event: function () {
				r.logEvent("invite_friends_share")
			},
			invite_friends_success_event: function () {
				r.logEvent("invite_friends_success_share")
			},
			invite_new_success_event: function () {
				r.logEvent("invite_new_success")
			},
			unlock_fish_share_event: function () { },
			game_switch_form_uc_event: function (e, t) {
				r.logEvent("game_switch_form_uc", null, {
					name: e,
					act_appid: t
				})
			},
			task_btn_start_event: function (e, t) {
				e = e || "undefined",
					null != t ? r.logEvent("task_btn_start_" + e, null, {
						times: t
					}) : r.logEvent("task_btn_start_" + e)
			},
			task_btn_claim_event: function (e, t) {
				e = e || "undefined",
					null != t ? r.logEvent("task_btn_claim_" + e, null, {
						times: t
					}) : r.logEvent("task_btn_claim_" + e)
			},
			mission_play_share_success_event: function () {
				r.logEvent("mission_play_share_success")
			},
			mission_watch_success_event: function () {
				r.logEvent("mission_watch_success")
			},
			gift_claim_event: function (e) {
				r.logEvent("gift_claim_" + e)
			},
			switchgameasync_event: function (e) {
				r.logEvent("click_to_" + e)
			},
			all_share_click_event: function () {
				r.logEvent("all_share_click")
			},
			reset_data_event: function () {
				r.logEvent("reset_data")
			},
			bot_recall_event: function (e) {
				r.logEvent("bot_recall_" + e)
			},
			switch_hugefish_from_dialog_event: function () {
				r.logEvent("switch_hugefish_from_dialog")
			},
			recommend_icon_click_event: function (e) {
				r.logEvent("recommend_icon_click", null, {
					name: e
				})
			},
			catch_fish_click_event: function () {
				r.logEvent("save_hero_click")
			},
			catch_fish_share_event: function () {
				r.logEvent("save_hero_share")
			},
			catch_fish_claim_event: function (e) {
				null != e ? r.logEvent("save_hero_claim", null, {
					times: e
				}) : r.logEvent("save_hero_claim")
			},
			share_free_upgrade_event: function () {
				r.logEvent("share_free_upgrade")
			},
			share_free_upgrade_success_event: function () {
				r.logEvent("share_free_upgrade_success")
			},
			watch_video_free_upgrade_event: function () {
				r.logEvent("watch_video_free_upgrade")
			},
			watch_video_free_upgrade_success_event: function () {
				r.logEvent("watch_video_free_upgrade_success")
			},
			all_diamond_click_event: function () {
				r.logEvent("all_diamond_click")
			},
			share_quick_get_diamond_event: function () { },
			share_quick_get_diamond_success_event: function () { },
			watch_video_quick_get_diamond_event: function () {
				r.logEvent("watch_video_quick_get_diamond")
			},
			watch_video_quick_get_diamond_success_event: function () {
				r.logEvent("watch_video_quick_get_diamond_success")
			},
			stay_time_length_event: function (e) {
				console.log("stay_time_length_event=" + e),
					r.logEvent("stay_time_length", null, {
						time: e
					})
			},
			quick_purchase_click_event: function () {
				r.logEvent("quick_purchase_click")
			},
			share_level_up_event: function () {
				r.logEvent("share_level_up")
			},
			share_level_up_success_event: function () {
				r.logEvent("share_level_up_success")
			},
			delete_frequency_event: function () {
				r.logEvent("delete_frequency")
			},
			shop_page_click_event: function () {
				r.logEvent("shop_page_click")
			},
			coin_buy_click_event: function () {
				r.logEvent("coin_buy_click")
			},
			diamond_buy_click_event: function () {
				r.logEvent("diamond_buy_click")
			},
			all_daily_click_event: function () {
				r.logEvent("all_daily_click")
			},
			daily_claimed_event: function () {
				r.logEvent("daily_claimed")
			},
			share_double_claimed_diamond_event: function () {
				r.logEvent("share_double_claimed_diamond")
			},
			share_double_claimed_diamond_success_event: function () {
				r.logEvent("share_double_claimed_diamond_success")
			},
			watch_video_double_claimed_diamond_event: function () {
				r.logEvent("watch_video_double_claimed_diamond")
			},
			watch_video_double_claimed_diamond_success_event: function () {
				r.logEvent("watch_video_double_claimed_diamond_success")
			},
			share_claimed_diamond_again_event: function () {
				r.logEvent("share_claimed_diamond_again")
			},
			share_claimed_diamond_again_success_event: function () {
				r.logEvent("share_claimed_diamond_again_success")
			},
			watch_video_claimed_diamond_again_event: function () {
				r.logEvent("watch_video_claimed_diamond_again")
			},
			watch_video_claimed_diamond_again_success_event: function () {
				r.logEvent("watch_video_claimed_diamond_again_success")
			},
			all_rank_click_event: function () {
				r.logEvent("all_rank_click")
			},
			share_rank_event: function () {
				r.logEvent("share_rank")
			},
			share_rank_success_event: function () {
				r.logEvent("share_rank_success")
			},
			all_reward_click_event: function () {
				r.logEvent("all_reward_click")
			},
			share_reward_event: function () {
				r.logEvent("share_reward")
			},
			share_reward_success_event: function () {
				r.logEvent("share_reward_success")
			},
			watch_reward_event: function () {
				r.logEvent("watch_reward")
			},
			watch_reward_success_event: function () {
				r.logEvent("watch_reward_success")
			},
			all_reward_get_click_event: function () {
				r.logEvent("all_reward_get_click")
			},
			share_get_diamond_event: function () {
				r.logEvent("share_get_diamond")
			},
			share_get_diamond_success_event: function () {
				r.logEvent("share_get_diamond_success")
			},
			watch_video_get_diamond_event: function () {
				r.logEvent("watch_video_get_diamond")
			},
			watch_video_get_diamond_success_event: function () {
				r.logEvent("watch_video_get_diamond_success")
			},
			subscribe_bot_success_event: function () {
				r.logEvent("subscribe_bot_success")
			},
			subscribe_bot_success_login_event: function () {
				r.logEvent("subscribe_bot_success_login")
			},
			subscribe_bot_success_level5_event: function () {
				r.logEvent("subscribe_bot_success_level5")
			},
			game_from_uc_event: function (e, t) {
				r.logEvent("game_switch_form_uc", null, {
					name: e,
					act_appid: t
				})
			},
			all_delete_event: function () {
				r.logEvent("all_delete")
			},
			all_delete_click_event: function () {
				r.logEvent("all_delete_click")
			},
			all_guide_step_event: function (e) {
				r.logEvent("all_guide_step", null, {
					type: e
				})
			},
			all_novice_guide_success_event: function () {
				r.logEvent("all_novice_guide_success")
			},
			auto_update_start_event: function (e) {
				r.logEvent("auto_update_send", null, {
					type: e
				})
			},
			auto_update_success_event: function (e) {
				r.logEvent("auto_update_success", null, {
					type: e
				})
			},
			worker_click_event: function () {
				r.logEvent("worker_click")
			},
			save_self_success_event: function () {
				r.logEvent("save_self_success")
			},
			share_save_self_start_event: function () {
				r.logEvent("share_save_self_start")
			},
			add_space_event: function () {
				r.logEvent("add_space")
			},
			release_worker_event: function () {
				r.logEvent("release_worker")
			},
			show_catch_worker_event: function () {
				r.logEvent("show_catch_worker")
			},
			catch_worker_event: function () {
				r.logEvent("catch_worker")
			},
			save_worker_event: function () {
				r.logEvent("save_worker")
			},
			share_type_event: function (e) {
				r.logEvent("share_type", null, {
					type: e
				})
			},
			share_success_type_event: function (e) {
				r.logEvent("share_success_type", null, {
					type: e
				})
			}
		},
			"watch_video_event",
			function (e) {
				r.logEvent("watch_video", null, {
					type: e
				})
			}), n(i, "watch_video_success_event",
				function (e) {
					r.logEvent("watch_video_success", null, {
						type: e
					})
				}), i),
			cc._RF.pop()
	},
	{
		"instant-util": "instant-util"
	}],
	encryptjs: [function (e, t, a) {
		(function (i) {
			"use strict";
			cc._RF.push(t, "c7ccbddZLlFT6LXCfsSF1s1", "encryptjs");
			var n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ?
				function (e) {
					return typeof e
				} : function (e) {
					return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
				}; (function (e, i) {
					void 0 !== a && void 0 !== t ? t.exports = i() : "function" == typeof define && "object" === n(define.amd) ? define(i) : "function" == typeof define && "object" === n(define.petal) ? define("encryptjs", [], i) : this.encryptjs = i()
				})(0,
					function (a) {
						if ((a = {
							version: "1.0.0"
						}).init = function () {
							console.log("--------------------Applying Encryption Algorithm------------------ ")
						},
							void 0 !== t && t.exports) var n = e("./algo");
						return a.encrypt = function (e, t, a) {
							if (128 != a && 192 != a && 256 != a) return "";
							e = String(e).utf8Encode(),
								t = String(t).utf8Encode();
							for (var i = a / 8,
								r = new Array(i), o = 0; o < i; o++) r[o] = isNaN(t.charCodeAt(o)) ? 0 : t.charCodeAt(o);
							var s = n.cipher(r, n.keyExpansion(r));
							s = s.concat(s.slice(0, i - 16));
							var c = new Array(16),
								l = (new Date).getTime(),
								d = l % 1e3,
								h = Math.floor(l / 1e3),
								u = Math.floor(65535 * Math.random());
							for (o = 0; o < 2; o++) c[o] = d >>> 8 * o & 255;
							for (o = 0; o < 2; o++) c[o + 2] = u >>> 8 * o & 255;
							for (o = 0; o < 4; o++) c[o + 4] = h >>> 8 * o & 255;
							var m = "";
							for (o = 0; o < 8; o++) m += String.fromCharCode(c[o]);
							for (var g = n.keyExpansion(s), p = Math.ceil(e.length / 16), f = new Array(p), v = 0; v < p; v++) {
								for (var _ = 0; _ < 4; _++) c[15 - _] = v >>> 8 * _ & 255;
								for (_ = 0; _ < 4; _++) c[15 - _ - 4] = v / 4294967296 >>> 8 * _;
								var y = n.cipher(c, g),
									b = v < p - 1 ? 16 : (e.length - 1) % 16 + 1,
									S = new Array(b);
								for (o = 0; o < b; o++) S[o] = y[o] ^ e.charCodeAt(16 * v + o),
									S[o] = String.fromCharCode(S[o]);
								f[v] = S.join("")
							}
							var C = m + f.join("");
							return C = C.base64Encode()
						},
							a.decrypt = function (e, t, a) {
								if (128 != a && 192 != a && 256 != a) return "";
								e = String(e).base64Decode(),
									t = String(t).utf8Encode();
								for (var i = a / 8,
									r = new Array(i), o = 0; o < i; o++) r[o] = isNaN(t.charCodeAt(o)) ? 0 : t.charCodeAt(o);
								var s = n.cipher(r, n.keyExpansion(r));
								s = s.concat(s.slice(0, i - 16));
								var c = new Array(8),
									l = e.slice(0, 8);
								for (o = 0; o < 8; o++) c[o] = l.charCodeAt(o);
								for (var d = n.keyExpansion(s), h = Math.ceil((e.length - 8) / 16), u = new Array(h), m = 0; m < h; m++) u[m] = e.slice(8 + 16 * m, 8 + 16 * m + 16);
								e = u;
								var g = new Array(e.length);
								for (m = 0; m < h; m++) {
									for (var p = 0; p < 4; p++) c[15 - p] = m >>> 8 * p & 255;
									for (p = 0; p < 4; p++) c[15 - p - 4] = (m + 1) / 4294967296 - 1 >>> 8 * p & 255;
									var f = n.cipher(c, d),
										v = new Array(e[m].length);
									for (o = 0; o < e[m].length; o++) v[o] = f[o] ^ e[m].charCodeAt(o),
										v[o] = String.fromCharCode(v[o]);
									g[m] = v.join("")
								}
								var _ = g.join("");
								return _ = _.utf8Decode()
							},
							void 0 === String.prototype.utf8Encode && (String.prototype.utf8Encode = function () {
								return unescape(encodeURIComponent(this))
							}),
							void 0 === String.prototype.utf8Decode && (String.prototype.utf8Decode = function () {
								try {
									return decodeURIComponent(escape(this))
								} catch (e) {
									return this
								}
							}),
							void 0 === String.prototype.base64Encode && (String.prototype.base64Encode = function () {
								if ("undefined" != typeof btoa) return btoa(this);
								if (void 0 !== i) return new i(this, "utf8").toString("base64");
								throw new Error("No Base64 Encode")
							}),
							void 0 === String.prototype.base64Decode && (String.prototype.base64Decode = function () {
								if ("undefined" != typeof atob) return atob(this);
								if (void 0 !== i) return new i(this, "base64").toString("utf8");
								throw new Error("No Base64 Decode")
							}),
							a.init(),
							a
					}),
					cc._RF.pop()
		}).call(this, e("buffer").Buffer)
	},
	{
		"./algo": "algo",
		buffer: 2
	}],
	"fbinstant-util": [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "76fbdIlqnhM84Ul0MrVxpPR", "fbinstant-util"),
			e("globalManager");
		var i = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAZABkAAD/7AARRHVja3kAAQAEAAAACgAA/+EDcmh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMwNjcgNzkuMTU3NzQ3LCAyMDE1LzAzLzMwLTIzOjQwOjQyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjI0Zjk5ZjU2LTY0ODItMGM0Mi05OTc0LTUyZmE0OThkNTBiNyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDowQjExMzIyOUEzRDQxMUU5OEYwOERCMTE0MUMxQkNFNyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowQjExMzIyOEEzRDQxMUU5OEYwOERCMTE0MUMxQkNFNyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Q0VCQThENEE5MTdBMTFFOTlGNjREMDlFRDg0MkE5NEYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Q0VCQThENEI5MTdBMTFFOTlGNjREMDlFRDg0MkE5NEYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1l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",
			n = 0,
			r = (new Date).getTime(),
			o = {},
			s = {},
			c = 1;
		globalManager.RewardAdId,
			e("number-util");
		t.exports = {
			getSupportedAPIs: function () {
				return "undefined" == typeof FBInstant ? [] : FBInstant.getSupportedAPIs()
			},
			getPlayerID: function () {
				if ("undefined" == typeof FBInstant) return "123456789";
				var e = FBInstant.player.getID();
				return console.log("playerID=" + e),
					e
			},
			getPlayerInfo: function (e) {
				if ("undefined" != typeof FBInstant) {
					var t = {};
					t.playerId = FBInstant.player.getID(),
						t.playerName = FBInstant.player.getName(),
						t.photo = FBInstant.player.getPhoto(),
						e && e(t)
				} else e && e({
					playerId: "123456789",
					playerName: "bibibabibobi",
					photo: "https://scontent-hkg3-1.xx.fbcdn.net/v/t1.0-1/p320x320/32713932_168979427273388_4735634539752194048_n.jpg?_nc_cat=0&oh=3187ef52a84de863937b566048026fbb&oe=5C0CE0C5"
				})
			},
			getPlayerFrineds: function (e) {
				"undefined" != typeof FBInstant ? FBInstant.player.getConnectedPlayersAsync().then(function (t) {
					var a = [];
					t.map(function (e) {
						console.log("get ig friends list = " + e.getID()),
							a.push({
								id: e.getID(),
								name: e.getName(),
								photo: e.getPhoto()
							})
					}),
						e && e(a)
				}) : e && e([{
					id: "123456789test1",
					name: "zyq"
				},
				{
					id: "123456789test",
					name: "bibibabibobi"
				}])
			},
			getContextLeaderboard: function (e) {
				"undefined" != typeof FBInstant && FBInstant.getLeaderboardAsync(this.getLeaderboardName()).then(function (e) {
					return e.getEntriesAsync()
				}).then(function (t) {
					e(t)
				})
			},
			getFriendsLeaderboard: function (e) {
				"undefined" != typeof FBInstant && FBInstant.getLeaderboardAsync("global-leaderboard").then(function (e) {
					return e.getConnectedPlayerEntriesAsync()
				}).then(function (t) {
					console.log("getFriendsLeaderboard=" + JSON.stringify(t)),
						e(t)
				})
			},
			getSelfLeaderboard: function (e) {
				"undefined" != typeof FBInstant && FBInstant.getLeaderboardAsync(this.getLeaderboardName()).then(function (e) {
					return e.getPlayerEntryAsync()
				}).then(function (t) {
					e(t)
				})
			},
			setLeaderboardScore: function (e, t) {
				"undefined" != typeof FBInstant && FBInstant.getLeaderboardAsync("global-leaderboard").then(function (a) {
					return console.log("getLeaderboardAsync success"),
						a.setScoreAsync(e, t)
				}).then(function (e) { })
			},
			getLeaderboardName: function () {
				if ("undefined" != typeof FBInstant) return console.log("getLeaderboardName = friend-leaderboard." + FBInstant.context.getID()),
					"friend-leaderboard." + FBInstant.context.getID()
			},
			chooseContext: function (e, t, a, i, n) {
				if ("undefined" != typeof FBInstant) {
					var r = this,
						o = globalManager.getObjData("sharedContextIds");
					console.log("sharedContextIds=" + JSON.stringify(o));
					var s = {};
					globalManager.publicConfig && (globalManager.publicConfig.UpdateContextFilter && (s.filters = [globalManager.publicConfig.UpdateContextFilter]), globalManager.publicConfig.UpdateContextMinSize && (s.minSize = parseInt(globalManager.publicConfig.UpdateContextMinSize))),
						console.log("filter=" + JSON.stringify(s)),
						FBInstant.context.chooseAsync(s).then(function () {
							var s = r.getContextID();
							s ? r.isSharedToday(s) ? t("limit", "Only one time each group in 2 hours.") : (o[s] = Date.parse(new Date), globalManager.setObjData("sharedContextIds", o), r.updateContext(e, t, a, i, n)) : t("limit", "Only one time each group in 2 hours.")
						},
							function (s) {
								if (console.log("chooseContext=" + JSON.stringify(s)), "SAME_CONTEXT" == s.code) {
									var c = r.getContextID();
									r.isSharedToday(c) ? t("limit", "Only one time each group in 2 hours.") : (o[c] = Date.parse(new Date), globalManager.setObjData("sharedContextIds", o), r.updateContext(e, t, a, i, n))
								} else t()
							})
				} else e && e()
			},
			isSharedToday: function (e) {
				var t = globalManager.getObjData("sharedContextIds");
				if (t) for (var a in t) {
					if (a == e) return Date.parse(new Date) - t[a] < 72e5
				}
				return !1
			},
			updateContext: function (e, t, a, n, r, o, s) {
				if ("undefined" != typeof FBInstant) {
					if (s || (this.logEvent("all_share_click"), this.logEvent("user_value_start")), !n || !r) {
						var c = globalManager.getShareConfig("common");
						n = n || c.text,
							r = r || c.img
					}
					var l = this;
					FBInstant.updateAsync({
						action: "CUSTOM",
						cta: "Play",
						image: r || i,
						text: {
							default:
								n || "Come On"
						},
						template: "play_turn",
						data: a || {
							type: "update"
						},
						strategy: o || "IMMEDIATE",
						notification: "NO_PUSH"
					}).then(function () {
						console.log("updateContext success"),
							s || l.logEvent("user_value_success"),
							e && e()
					},
						function (e) {
							console.log("updateContext fail=" + JSON.stringify(e)),
								t && t()
						})
				}
			},
			createContext: function (e, t) {
				"undefined" != typeof FBInstant && FBInstant.context.createAsync(this.getPlayerID()).then(function () {
					console.log("ContextID=" + FBInstant.context.getID()),
						e()
				},
					function () {
						console.log("createContext fail"),
							t()
					})
			},
			share: function (e, t, a, n) {
				if ("undefined" != typeof FBInstant) {
					if (!a || !t) {
						var r = globalManager.getShareConfig("common");
						a = a || r.text,
							t = t || r.img
					}
					this.logEvent("all_share_click"),
						this.logEvent("user_value_start"),
						this.logEvent("all_tl_share"),
						FBInstant.shareAsync({
							intent: "REQUEST",
							image: t || i,
							text: a || "Come On",
							data: n || {
								type: "share"
							}
						}).then(function (t) {
							e(t)
						})
				}
			},
			requestInterstitialAd: function (e, t) {
				if ("undefined" != typeof FBInstant) {
					var a = this;
					a.interstitial = null,
						FBInstant.getInterstitialAdAsync(globalManager.InterstitialAdId).then(function (e) {
							if (void 0 !== e) return a.interstitial = e,
								e.loadAsync()
						}).then(function () {
							console.log("requestInterstitialAd success"),
								t && t()
						}).
							catch(function (e) {
								console.log("requestInterstitialAd err  msg=" + JSON.stringify(e))
							})
				}
			},
			canInterstitialAds: function () {
				return !((new Date).getTime() - n <= 15e3) && (new Date).getTime() - r > 6e4
			},
			showInterstitial: function (e, t) {
				0 != this.canInterstitialAds() ? c % 5 == 0 ? (/^192\..*|localhost/.exec(location.hostname) && (console.log("\u672c\u5730\u8c03\u8bd5\u624d\u80fd\u770b\u5230\u7684\u63d2\u5c4f\u5e7f\u544a\uff1a\nbibibabibo~~~~~~~~bi\n\u5f97\u610f"), this.setInterstitialAds()), this.logEvent("watch_interstitial", null, {
					type: null != t ? t : e
				}), this.showInterstitialAd(function () {
					this.setInterstitialAds(),
						this.logEvent("watch_interstitial_success", null, {
							type: null != t ? t : e
						})
				}.bind(this),
					function (e) { }.bind(this))) : c++ : console.log("AdShow_Freq_Interstitial")
			},
			showInterstitialAd: function (e, t, a) {
				var i = this,
					n = a ? "secondPicAd" : "picAd";
				a || (i.logEvent("all_ad_click", null, {
					type: n
				}), i.logEvent("user_value_start")),
					this.interstitial ? this.interstitial.showAsync().then(function () {
						console.log("showInterstitialAd success"),
							a || (i.logEvent("all_ad_click_success", null, {
								type: n
							}), i.logEvent("user_value_success")),
							i.interstitial = null,
							e && e(),
							i.requestInterstitialAd()
					}).
						catch(function (e) {
							console.log("showInterstitialAd err  msg=" + JSON.stringify(e)),
								t && t(),
								i.requestInterstitialAd()
						}) : (console.log("showInterstitialAd err  rewardedVideo=null"), t && t(), i.requestInterstitialAd())
			},
			requestRewardAd: function (e, t) {
				if ("undefined" == typeof FBInstant) return console.log("requestRewardAd"),
					this.isRequestVideo = !0,
					this.rewardedVideo = {},
					void setTimeout(function () {
						this.isRequestVideo = !1,
							this.requestVideoCallback && this.requestVideoCallback(!0)
					}.bind(this), 1e4);
				var a = this;
				FBInstant.getRewardedVideoAsync(globalManager.RewardAdId).then(function (e) {
					if (void 0 !== e) return a.rewardedVideo = e,
						a.isRequestVideo = !0,
						a.logEvent("ad_request_start"),
						e.loadAsync()
				}).then(function () {
					console.log("requestRewardAd success"),
						a.logEvent("ad_request_success"),
						a.isRequestVideo = !1,
						a.requestVideoCallback && a.requestVideoCallback(!0),
						e && e()
				}).
					catch(function (e) {
						console.log("requestRewardAd err  msg=" + JSON.stringify(e)),
							a.isRequestVideo = !1,
							a.requestVideoCallback && a.requestVideoCallback(!1),
							t && t()
					})
			},
			setRequestAdEvent: function (e, t) { },
			getRewardedVideoAsync: function (e, t, a) {
				if ("undefined" != typeof FBInstant) {
					var i = this;
					i.rewardedVideo = null,
						FBInstant.getRewardedVideoAsync(e).then(function (e) {
							if (void 0 !== e) return i.rewardedVideo = e,
								e.loadAsync()
						}).then(function () {
							a && a()
						}).
							catch(function (a) {
								console.log("requestRewardAd err =" + e + "   msg=" + a),
									i.rewardedVideo = null,
									i.isRequestVideo = !1,
									i.requestVideoCallback && i.requestVideoCallback(!0),
									t && t()
							})
				} else a && a()
			},
			showRewardAd: function (e, t, a, i) {
				i = i || "common";
				var n = this;
				cc.loader.loadRes("watchvideo/videoConfirm",
					function (r, o) {
						(null != n.videoConfirmNode || cc.isValid(n.videoConfirmNode)) && n.videoConfirmNode.destroy(),
							n.videoConfirmNode = cc.instantiate(o),
							cc.director.getScene().getChildByName("Canvas").addChild(n.videoConfirmNode),
							n.videoConfirmNode.zIndex = cc.macro.MAX_ZINDEX,
							n.videoConfirmNode.getComponent("videoConfirm").setData(function () {
								n.showRewardAd_fbsb(e, t, a, i)
							},
								n.getRewardAdsCD(i))
					})
			},
			getRewardAdsCD: function (e) {
				var t = 15e3 - ((new Date).getTime() - n);
				t < 0 && (t = 0);
				var a = s[e];
				null == a && (a = 6e4);
				var i = o[e];
				null == i && (i = 0);
				var r = a - ((new Date).getTime() - i);
				return t > r ? t : r
			},
			setInterstitialAds: function () {
				c = 1,
					r = (new Date).getTime(),
					n = (new Date).getTime()
			},
			setRewardAds: function (e) {
				r = (new Date).getTime(),
					o[e] = (new Date).getTime(),
					n = (new Date).getTime()
			},
			showRewardAd_fbsb: function (e, t, a, i) {
				if ("undefined" != typeof FBInstant) {
					var n = this;
					a || (n.logEvent("all_ad_click"), n.logEvent("user_value_start")),
						n.rewardedVideo ? n.isRequestVideo ? (n.requestVideoCallback = function (a) {
							(null != n.waitNode || cc.isValid(n.waitNode)) && (n.waitNode.destroy(), n.waitNode = null, n.requestVideoCallback = null, clearTimeout(n.waitTimeId), a ? t && t() : n.showRewardAd(e, t, !0), n.requestVideoCallback = null, clearTimeout(n.waitTimeId))
						},
							cc.loader.loadRes("loading/loading-node",
								function (e, t) {
									(null != n.waitNode || cc.isValid(n.waitNode)) && n.waitNode.destroy(),
										n.waitNode = cc.instantiate(t),
										cc.director.getScene().getChildByName("Canvas").addChild(n.videoConfirmNode),
										n.videoConfirmNode.zIndex = cc.macro.MAX_ZINDEX,
										console.log("load prefab"),
										n.waitTimeId = setTimeout(function () {
											n.requestVideoCallback && n.requestVideoCallback(!1)
										},
											3900)
								})) : n.rewardedVideo.showAsync().then(function () {
									console.log("showRewardAd success"),
										n.logEvent("user_value_success"),
										n.logEvent("all_ad_click_success", null, {
											type: "rewardAd"
										}),
										n.rewardedVideo = null,
										n.setRewardAds(i),
										e && e(),
										n.requestRewardAd()
								}).
									catch(function (e) {
										n.requestRewardAd(),
											n.logEvent("all_ad_click_fail", null, {
												msg: e
											}),
											t && t(e)
									}) : (console.log("showRewardAd err  rewardedVideo=null"), n.logEvent("all_ad_click_fail", null, {
										msg: "null"
									}), n.requestRewardAd(), t && t())
				} else e && e()
			},
			isRewardAdReady: function () {
				return !!this.rewardedVideo
			},
			setData: function (e) {
				if ("undefined" != typeof FBInstant) {
					var t = this;
					FBInstant.player.setDataAsync(e).then(function () {
						console.log("setData success")
					}).
						catch(function (e) {
							console.log("fb_set_data_fail:" + JSON.stringify(e)),
								t.logEvent("fb_set_data_fail", null, {
									msg: e
								})
						})
				}
			},
			getData: function (e, t) {
				if ("undefined" != typeof FBInstant) {
					var a = this;
					FBInstant.player.getDataAsync(e).then(function (e) {
						console.log("load data success = " + JSON.stringify(e)),
							t && t(e)
					}).
						catch(function (e) {
							console.log("get data err"),
								a.logEvent("fb_get_data_fail", null, {
									msg: e
								})
						})
				}
			},
			getStats: function (e, t) {
				"undefined" != typeof FBInstant && FBInstant.player.getStatsAsync(e).then(function (e) {
					t && t(e)
				})
			},
			setStats: function (e, t) {
				"undefined" != typeof FBInstant && FBInstant.player.setStatsAsync(e).then(function () {
					t && t()
				})
			},
			incrementStats: function (e, t) {
				"undefined" != typeof FBInstant && FBInstant.player.incrementStatsAsync(e).then(function (e) {
					t && t(e)
				})
			},
			quite: function () {
				"undefined" != typeof FBInstant && FBInstant.quit()
			},
			pause: function (e) {
				"undefined" != typeof FBInstant && FBInstant.onPause(function () {
					e && e()
				})
			},
			logEvent: function (e, t, a) {
				if ("undefined" != typeof FBInstant) return FBInstant.logEvent(e, t, a)
			},
			getContextID: function () {
				if ("undefined" != typeof FBInstant) {
					var e = FBInstant.context.getID();
					return console.log("getContextID=" + e),
						e
				}
			},
			getType: function () {
				if ("undefined" != typeof FBInstant) {
					var e = FBInstant.context.getType();
					return console.log("getType=" + e),
						e
				}
			},
			startGame: function (e) {
				"undefined" != typeof FBInstant ? FBInstant.startGameAsync().then(function () {
					e()
				}) : e && e()
			},
			getFriends: function (e) {
				if ("undefined" != typeof FBInstant) {
					var t = this;
					FBInstant.player.getConnectedPlayersAsync().then(function (a) {
						var i = [];
						a.map(function (e) {
							console.log("get ig friends list = " + e.getID()),
								i.push({
									id: e.getID(),
									name: e.getName(),
									photo: e.getPhoto()
								})
						}),
							t.getPlayerInfo(function (t) {
								console.log("get ig friends list = " + t.playerName),
									i.push({
										id: t.playerId,
										name: t.playerName,
										photo: t.photo
									}),
									e && e(i)
							})
					})
				} else e && e([{
					id: "123456",
					name: "zyq"
				},
				{
					id: "13524679",
					name: "youney"
				}])
			},
			getPlayerFriendIds: function (e, t) {
				"undefined" != typeof FBInstant ? this.getFriends(function (t) {
					var a = [];
					t.map(function (e) {
						a.push(e.id)
					}),
						e && e(a)
				},
					t) : e && e(["987456321", "456321789", "88779955"])
			},
			getEntryPointData: function () {
				if ("undefined" != typeof FBInstant) return FBInstant.getEntryPointData()
			},
			createShortcut: function (e) {
				"undefined" != typeof FBInstant && (console.log("call createShortcut"), FBInstant.canCreateShortcutAsync().then(function (t) {
					console.log("canCreateShortcut=" + t),
						t && FBInstant.createShortcutAsync().then(function () {
							e(),
								cc.sys.localStorage.setItem("createShortcut_success", 1)
						}).
							catch(function () { })
				}))
			},
			getPlatform: function () {
				return "undefined" == typeof FBInstant ? "WEB" : FBInstant.getPlatform()
			},
			customImageShare: function (e, t, a, i) {
				var n = this;
				"undefined" != typeof FBInstant ? cc.loader.load(FBInstant.player.getPhoto(),
					function (i, r) {
						t && t(r),
							cc.director.getScene().addChild(e),
							e.zIndex = -1,
							n.captureScreen(e, e.width, e.height,
								function (t, i) {
									e.removeFromParent(!0),
										a && a(t)
								})
					}) : a && a()
			},
			captureScreen: function (e, t, a, i, n, r) {
				t = e.width,
					a = e.height,
					this.camera = cc.find("Canvas/Main Camera").getComponent(cc.Camera);
				var o = cc.game._renderContext,
					s = new cc.RenderTexture; (s.initWithSize(t, a + 2 * e.y, o.STENCIL_INDEX8), this.camera.targetTexture = s, this.texture = s, this._canvas) ? this._canvas.getContext("2d").clearRect(0, 0, this._canvas.width, this._canvas.height) : (this._canvas = document.createElement("canvas"), this._canvas.width = t, this._canvas.height = a);
				var c = this._canvas.getContext("2d");
				this.camera.render(),
					this.camera.targetTexture = null,
					this.camera.render();
				for (var l = this.texture.readPixels(), d = 4 * t, h = 0; h < a; h++) {
					for (var u = a + 2 * e.y - 1 - h,
						m = c.createImageData(t, 1), g = u * t * 4, p = 0; p < d; p++) m.data[p] = l[g + p];
					c.putImageData(m, 0, h)
				}
				var f = this._canvas.toDataURL("image/png");
				i && i(f)
			},
			switchGameAsync: function (e, t, a) {
				"undefined" != typeof FBInstant && FBInstant.switchGameAsync(e, a).
					catch(function (e) {
						t && t(e)
					})
			},
			canSubscribeBotAsync: function (e) {
				"undefined" != typeof FBInstant ? (console.log("in canSubscribeBotAsync"), FBInstant.player.canSubscribeBotAsync().then(function (t) {
					console.log("can_subscribe=" + t),
						e && e(t)
				}).
					catch(function () {
						console.log("error canSubscribeBotAsync"),
							e && e(!1)
					})) : e && e(!0)
			},
			subscribeBotAsync: function (e, t) {
				"undefined" != typeof FBInstant ? FBInstant.player.subscribeBotAsync().then(function () {
					console.log(" subscribed to the bot"),
						e && e(),
						cc.sys.localStorage.setItem("subscribeBot_success", 1)
				}).
					catch(function (e) {
						console.log(" subscription failure"),
							t && t()
					}) : e && e()
			}
		},
			cc._RF.pop()
	},
	{
		globalManager: "globalManager",
		"number-util": "number-util"
	}],
	globalManager: [function (require, module, exports) {
		"use strict";
		cc._RF.push(module, "5dac4pXI5RChoM0tiQ/xZBx", "globalManager");
		var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ?
			function (e) {
				return typeof e
			} : function (e) {
				return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
			};
		require("md5");
		var NumberUtil = require("number-util"),
			WebimgUtil = require("webimg-util"); (function () {
				if (window.globalManager) module.exports = window.globalManager;
				else {
					var TAG = "GlobalManager",
						Version = "V2.0.0",
						subVersion = Math.round(1e10 * Math.random()).toString(),
						globalManager = {
							ZOrder_Hide: -1,
							ZOrder_Zero: 0,
							ZOrder_TutorPopup: 98,
							ZOrder_TutorNode: 99,
							ZOrder_Popup: 100,
							ZOrder_Toast: 101,
							appId: "2277803722266283",
							appIdTest: "2221074618166857",
							appid_reg: /2277803722266283/,
							appidtest_reg: /2221074618166857/,
							loginTime: 0,
							serverLoginTime: 0,
							serverResetTime: 0,
							isBlackList: !1,
							InterstitialAdId: "348201739301497_355608925227445",
							RewardAdId: "348201739301497_355610018560669",
							isNewPlayer: !1,
							firstInLogin: !0,
							firstInGame: !0,
							fbPlayerId: null,
							gamelist: [{
								app_id: "527721167689261",
								name: "Juice Master",
								img: "https://scontent-hkg3-1.xx.fbcdn.net/v/t1.0-1/p200x200/41286169_920761251443235_2508817730489024512_n.jpg?_nc_cat=0&oh=610bd9524a8a3ee175e6bb8b19ad74b6&oe=5C3960BD",
								url: ""
							},
							{
								app_id: "2095791540676791",
								name: "Car Tycoon",
								img: "https://scontent-hkg3-1.xx.fbcdn.net/v/t1.0-1/p200x200/40515193_2153404564925308_1599571423054004224_n.jpg?_nc_cat=1&oh=6fb3c3f9295512ec5c16dec80b33e29f&oe=5C2BC2B4",
								url: ""
							}],
							gameListInGame: [{
								app_id: "527721167689261",
								name: "Juice Master",
								img: "https://scontent-hkg3-1.xx.fbcdn.net/v/t1.0-1/p200x200/41286169_920761251443235_2508817730489024512_n.jpg?_nc_cat=0&oh=610bd9524a8a3ee175e6bb8b19ad74b6&oe=5C3960BD",
								url: ""
							},
							{
								app_id: "2095791540676791",
								name: "Car Tycoon",
								img: "https://scontent-hkg3-1.xx.fbcdn.net/v/t1.0-1/p200x200/40515193_2153404564925308_1599571423054004224_n.jpg?_nc_cat=1&oh=6fb3c3f9295512ec5c16dec80b33e29f&oe=5C2BC2B4",
								url: ""
							}],
							publicConfig: {}
						};
					globalManager.shareType = cc.Enum({
						unlock: "unlock",
						rankShare: "rankShare",
						offline: "offline",
						speedUp: "speedUp",
						catchFish: "saveHero",
						inviteFriend: "inviteFriend",
						inviteNewFriend: "inviteNewFriend",
						playWithFriend: "playWithFriend",
						loginShare: "loginShare",
						freeUpgrade: "freeUpgrade",
						levelUp: "levelUp",
						spinShare: "spinShare",
						spinShareLack: "spinShareLack",
						UFOShare: "UFOShare",
						NoCoinShare: "NoCoinShare",
						DailyShare: "DailyShare",
						rewardMuti: "rewardMuti",
						dailyCheckin: "dailyCheckin",
						dailyBonusAgain: "dailyBonusAgain",
						daimondStore: "daimondStore",
						noDiamondShare: "noDiamondShare",
						saveWorker: "saveWorker"
					}),
						globalManager.taskType = {
							inviteFriend: 1,
							login: 2,
							watchVideo: 3,
							share: 4,
							playWithFriend: 5,
							mergeTimes: 10,
							speedupTimes: 11
						},
						globalManager.storeFreeHouse = 1,
						globalManager.storeFreeHouseCD = 300,
						globalManager.UpgradeBuy = 5,
						globalManager.GoldenBox = 0,
						globalManager.SpinRewardMuti = 0,
						globalManager.BoxCD = 30,
						globalManager.AccelarateCD = 200,
						globalManager.AccelarateTime = 200,
						globalManager.AccelarateTime1 = 60,
						globalManager.updateStrategy = {
							LAST: "LAST",
							IMMEDIATE: "IMMEDIATE",
							IMMEDIATE_CLEAR: "IMMEDIATE_CLEAR"
						},
						globalManager.MaxShareCounts = 3,
						globalManager.shareRewardAutoShow = !1,
						globalManager.diamondReward = 200,
						globalManager.spinRotation = 0,
						globalManager.videoMax = 25,
						globalManager.canShowReward = !0,
						globalManager.webNoVideo = !1,
						globalManager.hasShareTask = !1,
						globalManager.RankFriendData = [];
					var randomNum = 100 * Math.random();
					globalManager.storeFreeHouse = randomNum <= 10 ? 1 : randomNum <= 40 ? 2 : 3;
					var noencrypt = !0;
					globalManager.isGameInit = function (e) {
						return !! /^192\..*|localhost/.exec(location.hostname) || !!e.exec(location.href)
					},
						globalManager.encrypt = function (e, t) {
							if (e += "", null == t || t.length <= 0) return null;
							e = escape(e);
							for (var a = "",
								i = 0; i < t.length; i++) a += t.charCodeAt(i).toString();
							var n = Math.floor(a.length / 5),
								r = parseInt(a.charAt(n) + a.charAt(2 * n) + a.charAt(3 * n) + a.charAt(4 * n) + a.charAt(5 * n)),
								o = Math.ceil(t.length / 2),
								s = Math.pow(2, 31) - 1;
							if (r < 2) return null;
							var c = Math.round(1e9 * Math.random()) % 1e8;
							for (a += c; a.length > 10;) a = (parseInt(a.substring(0, 10)) + parseInt(a.substring(10, a.length))).toString();
							a = (r * a + o) % s;
							var l = "",
								d = "";
							for (i = 0; i < e.length; i++) d += (l = parseInt(e.charCodeAt(i) ^ Math.floor(a / s * 255))) < 16 ? "0" + l.toString(16) : l.toString(16),
								a = (r * a + o) % s;
							for (c = c.toString(16); c.length < 8;) c = "0" + c;
							return d += c
						},
						globalManager.decrypt = function (e, t) {
							if (!(null == e || e.length < 8 || null == t || t.length <= 0)) {
								for (var a = "",
									i = 0; i < t.length; i++) a += t.charCodeAt(i).toString();
								var n = Math.floor(a.length / 5),
									r = parseInt(a.charAt(n) + a.charAt(2 * n) + a.charAt(3 * n) + a.charAt(4 * n) + a.charAt(5 * n)),
									o = Math.round(t.length / 2),
									s = Math.pow(2, 31) - 1,
									c = parseInt(e.substring(e.length - 8, e.length), 16);
								for (e = e.substring(0, e.length - 8), a += c; a.length > 10;) a = (parseInt(a.substring(0, 10)) + parseInt(a.substring(10, a.length))).toString();
								a = (r * a + o) % s;
								var l = "",
									d = "";
								for (i = 0; i < e.length; i += 2) l = parseInt(parseInt(e.substring(i, i + 2), 16) ^ Math.floor(a / s * 255)),
									d += String.fromCharCode(l),
									a = (r * a + o) % s;
								return unescape(d)
							}
						},
						globalManager.encryptKey = function (e) {
							return cc.MD5(e)
						},
						globalManager.getDT = function () {
							var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1,
								t = arguments[1],
								a = e[1];
							a = "subVersion";
							var i = globalManager.getLocalData(a, null, !0);
							if (null == i) {
								var n = Math.round(1e10 * Math.random()).toString();
								return globalManager.saveLocalData(a, n, !0),
									t && t(a),
									n
							}
							return i
						},
						globalManager.saveLocalData = function (e, t) {
							var a = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
							null != globalManager.fbPlayerId && (e += globalManager.fbPlayerId, 1 != noencrypt && (e = globalManager.encryptKey(e), 0 == a && (t = globalManager.encrypt(t, subVersion))), cc.sys.localStorage.setItem(e, t))
						},
						globalManager.getLocalData = function (e, t) {
							var a = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
							if (null == globalManager.fbPlayerId) return t;
							e += globalManager.fbPlayerId,
								0 == noencrypt && (e = globalManager.encryptKey(e));
							var i = cc.sys.localStorage.getItem(e);
							return null != i && "null" != i && 0 == a && 0 == noencrypt && (i = globalManager.decrypt(i, subVersion)),
								null != i && "null" != i || null == t || (i = t),
								i
						},
						globalManager.initDT = function () {
							subVersion = globalManager.getDT(Version,
								function () {
									for (var e = 1; e <= 10; e++) globalManager.saveLocalData("key" + e, Math.round(1e10 * Math.random()).toString(), !0)
								})
						},
						globalManager.canShare = function (type, args) {
							if (globalManager.isBlackList) return !1;
							if ("undefined" === !("undefined" == typeof FBInstant || _typeof(FBInstant)) && (console.log(FBInstant.getPlatform() + "!!!!!!!!!!!!!"), globalManager.webNoVideo && "WEB" === FBInstant.getPlatform())) return !0;
							if (globalManager.publicConfig) {
								args.date = Date.parse(new Date);
								var result = globalManager.publicConfig[type];
								if (result) try {
									result = NumberUtil.format(result, args),
										result = "(function(){" + result + "})()",
										console.log("function = " + result);
									var res = eval(result);
									return 0 == res && globalManager.getWatchVideoCount() >= globalManager.videoMax && (res = !0),
										res
								} catch (e) {
									return console.log(e.toString()),
										!1
								}
							}
							return !1
						},
						globalManager.eval = function (result, args) {
							if (result) try {
								return result = NumberUtil.format(result, args),
									result = "(function(){" + result + "})()",
									eval(result)
							} catch (e) {
								return console.log(e.toString()),
									!1
							}
							return !1
						},
						globalManager.webCopyString = function (e) {
							console.log("\u590d\u5236");
							var t = e + "",
								a = document.createElement("textarea");
							a.value = t,
								a.setAttribute("readonly", ""),
								a.style.contain = "strict",
								a.style.position = "absolute",
								a.style.left = "-9999px",
								a.style.fontSize = "12pt";
							var i = getSelection(),
								n = !1;
							i.rangeCount > 0 && (n = i.getRangeAt(0)),
								document.body.appendChild(a),
								a.select(),
								a.selectionStart = 0,
								a.selectionEnd = t.length;
							var r = !1,
								o = cc.director.getScene().getChildByName("Canvas").getComponent("GameScene");
							null == o && (o = cc.director.getScene().getChildByName("Canvas").getComponent("login-world"));
							try {
								r = document.execCommand("copy"),
									o.showToast("Copy success")
							} catch (e) {
								o.showToast("Copy failed")
							}
							return document.body.removeChild(a),
								n && (i.removeAllRanges(), i.addRange(n)),
								r
						},
						globalManager.getCookie = function (e) {
							var t, a = new RegExp("(^| )" + e + "=([^;]*)(;|$)");
							return (t = document.cookie.match(a)) ? t[2] : null
						},
						globalManager.setShareConfig = function () {
							server_util.shareList(function (e) {
								var t = cc.sys.localStorage.getItem("shareConfigList");
								t = t ? JSON.parse(t) : {},
									e.list.map(function (e) {
										var a = e.type;
										cc.sys.localStorage.getItem(e.img) ? (t[a] = {
											img: e.img,
											title: e.title
										},
											cc.sys.localStorage.setItem("shareConfigList", JSON.stringify(t))) : WebimgUtil.getBase64(e.img,
												function (e, a) {
													var i = a.type;
													t[i] && cc.sys.localStorage.removeItem(t[i].img),
														cc.sys.localStorage.setItem(a.img, e),
														t[i] = {
															img: a.img,
															title: a.title
														},
														cc.sys.localStorage.setItem("shareConfigList", JSON.stringify(t))
												},
												function (e) {
													t[a] = {
														title: e.title
													},
														cc.sys.localStorage.setItem("shareConfigList", JSON.stringify(t))
												},
												e)
									})
							})
						},
						globalManager.getShareConfig = function (e) {
							var t = cc.sys.localStorage.getItem("shareConfigList");
							return (t = t ? JSON.parse(t) : {})[e] ? {
								img: cc.sys.localStorage.getItem(t[e].img),
								text: t[e].title
							} : {}
						},
						globalManager.addTaskProgress = function (e) {
							var t = {};
							if (t[globalManager.taskType.mergeTimes] = "mergeTimes", t[globalManager.taskType.speedupTimes] = "speedUpTimes", null != t[e]) {
								var a = globalManager.getNumData(t[e]) + 1;
								globalManager.setNumData(t[e], a)
							}
							cc.director.getScene().getChildByName("Canvas").getComponent("GameScene").checkReward()
						},
						globalManager.getTaskProgress = function (e) {
							var t = {};
							return t[globalManager.taskType.mergeTimes] = "mergeTimes",
								t[globalManager.taskType.speedupTimes] = "speedUpTimes",
								null != t[e] ? globalManager.getNumData(t[e]) : 0
						},
						globalManager.addWatchVideoCount = function () {
							var e = cc.sys.localStorage.getItem("videoCount");
							e = e ? JSON.parse(e) : {};
							var t = {};
							NumberUtil.isOneDay(e.time, (new Date).getTime()) ? (e.count += 1, t = {
								time: (new Date).getTime(),
								count: e.count
							}) : t = {
								time: (new Date).getTime(),
								count: 1
							},
								cc.sys.localStorage.setItem("videoCount", JSON.stringify(t))
						},
						globalManager.getWatchVideoCount = function () {
							var e = cc.sys.localStorage.getItem("videoCount");
							return console.log("getWatchVideoCount=" + e),
								e = e ? JSON.parse(e) : {},
								NumberUtil.isOneDay(e.time, (new Date).getTime()) ? e.count : 0
						},
						globalManager.setNumData = function (e, t) {
							globalManager.saveLocalData(e, t + "")
						},
						globalManager.getNumData = function (e) {
							var t = globalManager.getLocalData(e, 0);
							return parseInt(t)
						},
						globalManager.setObjData = function (e, t) {
							var a = t;
							"object" == (void 0 === a ? "undefined" : _typeof(a)) && (a = JSON.stringify(t)),
								globalManager.saveLocalData(e, a)
						},
						globalManager.getObjData = function (e) {
							var t = globalManager.getLocalData(e, {}),
								a = t;
							return "string" == typeof t && (a = JSON.parse(t)),
								a
						},
						window.globalManager = globalManager,
						module.exports = globalManager
				}
			})(),
				cc._RF.pop()
	},
	{
		md5: "md5",
		"number-util": "number-util",
		"webimg-util": "webimg-util"
	}],
	"http-client": [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "a9dcdhwIo1KfbgTgKVUWhTJ", "http-client");
		t.exports = {
			httpPostRequest: function (e, t, a, i) {
				var n = JSON.stringify(t);
				console.log("httpPostRequest:" + e + ", after param = " + n);
				var r = cc.loader.getXMLHttpRequest();
				r.timeoutId = setTimeout(function () {
					i && console.log("httpRequest timeout")
				},
					6e3),
					r.open("POST", e),
					r.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"),
					r.send(n),
					r.onreadystatechange = function () {
						if (clearTimeout(r.timeoutId), 4 == r.readyState && r.status >= 200 && r.status < 400) {
							console.log("httpRequest.readyState=" + r.readyState),
								console.log("httpRequest.status=" + r.status);
							r.statusText;
							var e = r.responseText;
							console.log("responseText = " + e);
							var t = null;
							try {
								t = JSON.parse(e)
							} catch (e) {
								console.log("\u670d\u52a1\u7aef\u672a\u77e5\u9519\u8bef")
							}
							t && (0 == t.code ? a && a(t.data) : i && i(t))
						}
					},
					r.onerror = function (e) {
						clearTimeout(r.timeoutId);
						var t = r.responseText;
						t || (t = "network error"),
							i && i(t)
					}
			},
			httpGetRequest: function (e, t, a, i) {
				for (var n in t) e += n + "=" + t.key;
				var r = cc.loader.getXMLHttpRequest();
				r.onreadystatechange = function () {
					if (4 === r.readyState && r.status >= 200 && r.status < 400) {
						var e = r.responseText;
						console.log("responseText = " + e);
						var t = null;
						try {
							t = JSON.parse(e)
						} catch (e) {
							console.log("\u670d\u52a1\u7aef\u672a\u77e5\u9519\u8bef")
						}
						t && a && a(t)
					}
				},
					r.open("GET", e, !0),
					cc.sys.isNative && r.setRequestHeader("Accept-Encoding", "gzip,deflate"),
					r.timeoutId = setTimeout(function () {
						i && console.log("httpRequest timeout")
					},
						6e3),
					r.send()
			}
		},
			cc._RF.pop()
	},
	{}],
	"instant-util": [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "a5ac0t1jpFBjIprtlQaM0BE", "instant-util");
		var i = e("fbinstant-util"),
			n = /^192\..*|localhost/.exec(location.hostname);
		"undefined" != typeof FBInstant ? t.exports = i : null != n && (t.exports = i),
			cc._RF.pop()
	},
	{
		"fbinstant-util": "fbinstant-util"
	}],
	md5: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "b5d98dUTtpHzqtbPaJzQeb2", "md5");
		var i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ?
			function (e) {
				return typeof e
			} : function (e) {
				return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
			};
		cc.MD5 = function (e) {
			function t(e) {
				var t = (e >>> 0).toString(16);
				return "00000000".substr(0, 8 - t.length) + t
			}
			function a(e) {
				for (var t = [], a = 0; a < 8; a++) t.push(255 & e),
					e >>>= 8;
				return t
			}
			function n(e, t) {
				return e << t & 4294967295 | e >>> 32 - t
			}
			function r(e, t, a) {
				return e & t | ~e & a
			}
			function o(e, t, a) {
				return a & e | ~a & t
			}
			function s(e, t, a) {
				return e ^ t ^ a
			}
			function c(e, t, a) {
				return t ^ (e | ~a)
			}
			function l(e, t) {
				return e[t + 3] << 24 | e[t + 2] << 16 | e[t + 1] << 8 | e[t]
			}
			function d(e) {
				for (var t = [], a = 0; a < e.length; a++) if (e.charCodeAt(a) <= 127) t.push(e.charCodeAt(a));
				else for (var i = encodeURIComponent(e.charAt(a)).substr(1).split("%"), n = 0; n < i.length; n++) t.push(parseInt(i[n], 16));
				return t
			}
			function h(e, a, i, n) {
				for (var r = "",
					o = 0,
					s = 0,
					c = 3; c >= 0; c--) o = 255 & (s = arguments[c]),
						o <<= 8,
						o |= 255 & (s >>>= 8),
						o <<= 8,
						o |= 255 & (s >>>= 8),
						o <<= 8,
						r += t(o |= s >>>= 8);
				return r
			}
			function u(e) {
				for (var t = new Array(e.length), a = 0; a < e.length; a++) t[a] = e[a];
				return t
			}
			var m = null,
				g = null;
			function p(e, t) {
				return 4294967295 & e + t
			}
			return "string" == typeof e ? m = d(e) : e.constructor == Array ? 0 === e.length ? m = e : "string" == typeof e[0] ? m = function (e) {
				for (var t = [], a = 0; a < e.length; a++) t = t.concat(d(e[a]));
				return t
			}(e) : "number" == typeof e[0] ? m = e : g = i(e[0]) : "undefined" != typeof ArrayBuffer ? e instanceof ArrayBuffer ? m = u(new Uint8Array(e)) : e instanceof Uint8Array || e instanceof Int8Array ? m = u(e) : e instanceof Uint32Array || e instanceof Int32Array || e instanceof Uint16Array || e instanceof Int16Array || e instanceof Float32Array || e instanceof Float64Array ? m = u(new Uint8Array(e.buffer)) : g = void 0 === e ? "undefined" : i(e) : g = void 0 === e ? "undefined" : i(e),
				g && alert("MD5 type mismatch, cannot process " + g),
				function () {
					function e(e, t, a, i) {
						var r = S;
						S = b,
							b = y,
							y = p(y, n(p(_, p(e, p(t, a))), i)),
							_ = r
					}
					var t = m.length;
					m.push(128);
					var i = m.length % 64;
					if (i > 56) {
						for (var d = 0; d < 64 - i; d++) m.push(0);
						i = m.length % 64
					}
					for (d = 0; d < 56 - i; d++) m.push(0);
					m = m.concat(a(8 * t));
					var u = 1732584193,
						g = 4023233417,
						f = 2562383102,
						v = 271733878,
						_ = 0,
						y = 0,
						b = 0,
						S = 0;
					for (d = 0; d < m.length / 64; d++) {
						_ = u;
						var C = 64 * d;
						e(r(y = g, b = f, S = v), 3614090360, l(m, C), 7),
							e(r(y, b, S), 3905402710, l(m, C + 4), 12),
							e(r(y, b, S), 606105819, l(m, C + 8), 17),
							e(r(y, b, S), 3250441966, l(m, C + 12), 22),
							e(r(y, b, S), 4118548399, l(m, C + 16), 7),
							e(r(y, b, S), 1200080426, l(m, C + 20), 12),
							e(r(y, b, S), 2821735955, l(m, C + 24), 17),
							e(r(y, b, S), 4249261313, l(m, C + 28), 22),
							e(r(y, b, S), 1770035416, l(m, C + 32), 7),
							e(r(y, b, S), 2336552879, l(m, C + 36), 12),
							e(r(y, b, S), 4294925233, l(m, C + 40), 17),
							e(r(y, b, S), 2304563134, l(m, C + 44), 22),
							e(r(y, b, S), 1804603682, l(m, C + 48), 7),
							e(r(y, b, S), 4254626195, l(m, C + 52), 12),
							e(r(y, b, S), 2792965006, l(m, C + 56), 17),
							e(r(y, b, S), 1236535329, l(m, C + 60), 22),
							e(o(y, b, S), 4129170786, l(m, C + 4), 5),
							e(o(y, b, S), 3225465664, l(m, C + 24), 9),
							e(o(y, b, S), 643717713, l(m, C + 44), 14),
							e(o(y, b, S), 3921069994, l(m, C), 20),
							e(o(y, b, S), 3593408605, l(m, C + 20), 5),
							e(o(y, b, S), 38016083, l(m, C + 40), 9),
							e(o(y, b, S), 3634488961, l(m, C + 60), 14),
							e(o(y, b, S), 3889429448, l(m, C + 16), 20),
							e(o(y, b, S), 568446438, l(m, C + 36), 5),
							e(o(y, b, S), 3275163606, l(m, C + 56), 9),
							e(o(y, b, S), 4107603335, l(m, C + 12), 14),
							e(o(y, b, S), 1163531501, l(m, C + 32), 20),
							e(o(y, b, S), 2850285829, l(m, C + 52), 5),
							e(o(y, b, S), 4243563512, l(m, C + 8), 9),
							e(o(y, b, S), 1735328473, l(m, C + 28), 14),
							e(o(y, b, S), 2368359562, l(m, C + 48), 20),
							e(s(y, b, S), 4294588738, l(m, C + 20), 4),
							e(s(y, b, S), 2272392833, l(m, C + 32), 11),
							e(s(y, b, S), 1839030562, l(m, C + 44), 16),
							e(s(y, b, S), 4259657740, l(m, C + 56), 23),
							e(s(y, b, S), 2763975236, l(m, C + 4), 4),
							e(s(y, b, S), 1272893353, l(m, C + 16), 11),
							e(s(y, b, S), 4139469664, l(m, C + 28), 16),
							e(s(y, b, S), 3200236656, l(m, C + 40), 23),
							e(s(y, b, S), 681279174, l(m, C + 52), 4),
							e(s(y, b, S), 3936430074, l(m, C), 11),
							e(s(y, b, S), 3572445317, l(m, C + 12), 16),
							e(s(y, b, S), 76029189, l(m, C + 24), 23),
							e(s(y, b, S), 3654602809, l(m, C + 36), 4),
							e(s(y, b, S), 3873151461, l(m, C + 48), 11),
							e(s(y, b, S), 530742520, l(m, C + 60), 16),
							e(s(y, b, S), 3299628645, l(m, C + 8), 23),
							e(c(y, b, S), 4096336452, l(m, C), 6),
							e(c(y, b, S), 1126891415, l(m, C + 28), 10),
							e(c(y, b, S), 2878612391, l(m, C + 56), 15),
							e(c(y, b, S), 4237533241, l(m, C + 20), 21),
							e(c(y, b, S), 1700485571, l(m, C + 48), 6),
							e(c(y, b, S), 2399980690, l(m, C + 12), 10),
							e(c(y, b, S), 4293915773, l(m, C + 40), 15),
							e(c(y, b, S), 2240044497, l(m, C + 4), 21),
							e(c(y, b, S), 1873313359, l(m, C + 32), 6),
							e(c(y, b, S), 4264355552, l(m, C + 60), 10),
							e(c(y, b, S), 2734768916, l(m, C + 24), 15),
							e(c(y, b, S), 1309151649, l(m, C + 52), 21),
							e(c(y, b, S), 4149444226, l(m, C + 16), 6),
							e(c(y, b, S), 3174756917, l(m, C + 44), 10),
							e(c(y, b, S), 718787259, l(m, C + 8), 15),
							e(c(y, b, S), 3951481745, l(m, C + 36), 21),
							u = p(u, _),
							g = p(g, y),
							f = p(f, b),
							v = p(v, S)
					}
					return h(v, f, g, u).toUpperCase()
				}()
		},
			cc._RF.pop()
	},
	{}],
	"number-util": [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "02fafbsqUREbJv8xzpAbqxZ", "number-util");
		var i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ?
			function (e) {
				return typeof e
			} : function (e) {
				return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
			},
			n = {};
		function r(e, t) {
			var a = [e, t];
			if (e.length < t.length) return a[0] = t,
				a[1] = e,
				a[2] = "not",
				a;
			if (e.length == t.length) for (var i = 0; i < e.length; i++) {
				if (a[0][i] > a[1][i]) return a[0] = e,
					a[1] = t,
					a;
				if (a[0][i] < a[1][i]) return a[0] = t,
					a[1] = e,
					a[2] = "not",
					a;
				if (i == e.length - 1) return a
			}
			return e.length > t.length ? a : void 0
		}
		function o(e) {
			if (0 == e) return e = 0;
			for (var t = (e = e.split("")).length, a = 0; a < t && 0 == e[0]; a++) e.splice(0, 1);
			return e
		}
		function s(e) {
			return "number" == typeof e ? null != e.toString().split(".")[1] ? e.toString().split(".")[1].length : 0 : "string" == typeof e ? null != e.split(".")[1] ? e.split(".")[1].length : 0 : void 0
		}
		for (var c = ["", "K", "M", "B", "T"], l = 0; l < 2; l++) for (var d = 0; d < 26; d++) c.push(String.fromCharCode(65 + l) + String.fromCharCode(65 + d));
		t.exports = {
			unit_format: function (e) {
				var t = "";
				if ((e = e.toString()).length > 6) {
					var a = parseInt(e.length / 3),
						i = e.length % 3;
					t = c[a -= 0 == i ? 2 : 1],
						e = e.substr(0, e.length - 3 * a)
				}
				return this.number_format(e, 0, ",") + t
			},
			millisecondToTime: function (e) {
				e < 500 && (e = 0);
				var t = parseFloat(e) / 1e3,
					a = parseInt(t / 3600),
					i = parseInt(t / 3600),
					n = parseInt(60 * (parseFloat(t / 3600) - parseInt(t / 3600))),
					r = parseInt(60 * (parseFloat(60 * (parseFloat(t / 3600) - parseInt(t / 3600))) - parseInt(60 * (parseFloat(t / 3600) - parseInt(t / 3600)))));
				return a = a < 10 ? "0" + a : a,
					n = n < 10 ? "0" + n : n,
					r = r < 10 ? "0" + r : r,
					i > 0 ? a + ":" + n + ":" + r : n + ":" + r
			},
			number_format: function (e, t, a) {
				e = (e + "").replace(/[^0-9+-Ee.]/g, "");
				var i = isFinite(+ e) ? +e : 0,
					n = isFinite(+ t) ? Math.abs(t) : 0,
					r = void 0 === a ? "," : a,
					o = "";
				o = (n ?
					function (e, t) {
						var a = Math.pow(10, t);
						return "" + Math.ceil(e * a) / a
					}(i, n) : "" + Math.round(i)).split(".");
				for (var s = /(-?\d+)(\d{3})/; s.test(o[0]);) o[0] = o[0].replace(s, "$1" + r + "$2");
				return (o[1] || "").length < n && (o[1] = o[1] || "", o[1] += new Array(n - o[1].length + 1).join("0")),
					o.join(".")
			},
			setNumberLength: function (e, t) {
				for (e = e.toString(); e.length < t;) e = "0" + e;
				return e
			},
			time_format: function (e) {
				var t = this.setNumberLength(Math.floor(e / 3600), 2);
				return e %= 3600,
					t + ":" + this.setNumberLength(Math.floor(e / 60), 2) + ":" + this.setNumberLength(e % 60, 2)
			},
			sortByType: function (e, t) {
				return e.sort(function (e) {
					return function (t, a) {
						var n, r;
						if ("object" === (void 0 === t ? "undefined" : i(t)) && "object" === (void 0 === a ? "undefined" : i(a)) && t && a) return (n = t[e]) === (r = a[e]) ? 0 : (void 0 === n ? "undefined" : i(n)) === (void 0 === r ? "undefined" : i(r)) ? n < r ? -1 : 1 : (void 0 === n ? "undefined" : i(n)) < (void 0 === r ? "undefined" : i(r)) ? -1 : 1;
						throw "error"
					}
				}(t))
			},
			countTime: function (e, t) {
				var a = setInterval(function () {
					e >= 0 ? (t(e), e--) : (console.log("stop Interval=" + a), clearInterval(a))
				}.bind(this), 1e3);
				return a
			},
			clearInterval: function (e) {
				function t(t) {
					return e.apply(this, arguments)
				}
				return t.toString = function () {
					return e.toString()
				},
					t
			}(function (e) {
				console.log("clearInterval=" + e),
					clearInterval(e)
			}),
			playerdataCountDown: function (e, t, a) {
				var i = this;
				function r() {
					n[e] = window.setTimeout(function (t) {
						globalManager.setNumData(e, globalManager.getNumData(e) - 1),
							a && a(globalManager.getNumData(e)),
							globalManager.getNumData(e) > 0 ? r() : n[e] = null
					}.bind(i), 1e3 * t)
				}
				null == n[e] ? r() : (this.playerdataCountDownClear(e), r())
			},
			playerdataCountDownClear: function (e) {
				null != n[e] && (window.clearTimeout(n[e]), n[e] = null)
			},
			isOneDay: function (e, t) {
				if (e && t) {
					var a = new Date(parseInt(e)),
						i = new Date(parseInt(t));
					if (a.getFullYear() == i.getFullYear() && a.getMonth() == i.getMonth() && a.getDate() == i.getDate()) return !0
				}
				return !1
			},
			caculateDays: function (e, t) {
				if (e && t) {
					var a = Math.floor(e / 864e5);
					return Math.floor(t / 864e5) - a
				}
				return 0
			},
			randomNum: function (e, t) {
				switch (arguments.length) {
					case 1:
						return parseInt(Math.random() * e + 1, 10);
					case 2:
						return parseInt(Math.random() * (t - e + 1) + e, 10);
					default:
						return 0
				}
			},
			galaxyAdd: function (e, t) {
				var a, i = [String(e), String(t)],
					n = []; (i = r(i[0], i[1]))[0] = i[0].split(""),
						i[1] = i[1].split(""),
						i[0].length != i[1].length && (a = new Array(i[0].length - i[1].length + 1).join("0"), i[1] = a.split("").concat(i[1]));
				for (var o = 0,
					s = i[0].length - 1; s >= 0; s--) {
					var c = Number(i[0][s]) + Number(i[1][s]) + o;
					n.unshift(c % 10),
						o = Math.floor(c / 10),
						0 == s && 0 != o && n.unshift(o)
				}
				return n.join("")
			},
			galaxySub: function (e, t) {
				var a, i = [String(e), String(t)],
					n = [];
				if (3 == (i = r(i[0], i[1])).length) return !1;
				i[0] = i[0].split(""),
					i[1] = i[1].split(""),
					i[0].length != i[1].length && (a = new Array(i[0].length - i[1].length + 1).join("0"), i[1] = a.split("").concat(i[1]));
				for (var s = 0,
					c = i[0].length - 1; c >= 0; c--) {
					var l = Number(i[0][c]) - Number(i[1][c]) - s;
					s = 0,
						l < 0 && (l += 10, s = 1),
						n.unshift(l % 10)
				}
				var d = n.join("");
				0 == d[0] && (d = o(d));
				for (var h = "",
					u = 0; u < d.length; u++) h += "" + d[u];
				return "" == h && (h = "0"),
					h
			},
			galaxyMut: function (e, t) {
				var a = s(t);
				a > 0 && (t = String(t).replace(".", ""));
				var i = [String(e), String(t)],
					n = [];
				if ((i = r(i[0], i[1]))[0] = i[0].split(""), i[1] = i[1].split(""), -1 != i[0].indexOf("N") || -1 != i[1].indexOf("N")) return e;
				for (var c = i[1].length - 1; c >= 0; c--) {
					for (var l, d = 0,
						h = [], u = i[0].length - 1; u >= 0; u--) {
						var m = Number(i[0][u]) * Number(i[1][c]) + d;
						h.unshift(m % 10),
							d = Math.floor(m / 10),
							0 == u && 0 != d && h.unshift(d)
					}
					l = new Array(i[1].length - (c + 1) + 1).join("0"),
						h.push(l),
						n[c] = h.join("")
				}
				for (var g = n.length,
					p = 1; p < g; p++) {
					var f = this.galaxyAdd(n[0], n[1]);
					n.splice(0, 2, f)
				}
				var v = n.join("");
				0 == v[0] && (v = o(v));
				for (var _ = "",
					y = 0; y < v.length - a; y++) parseInt(v[y]) >= 0 && (_ += "" + v[y]);
				return "" == _ && (_ = "0"),
					_
			},
			galaxyDiv: function (e, t) {
				e = String(e),
					t = String(t);
				for (var a = e.length,
					i = (t.length, 0), n = 0, r = [], o = 0, s = 0; s < a; s++)(o = 10 * n + parseInt(e[s])) < t ? (n = o, r.push(0)) : (i = parseInt(o / t), n = o % t, r.push(i));
				var c = r.join("").replace(/\b(0+)/gi, "");
				return "" == c && (c = "0"),
					c
			},
			cmpBigInt: function (e, t) {
				if (e = String(e), t = String(t), e.length > t.length) return 1;
				if (e.length < t.length) return - 1;
				for (var a = 0; a < e.length; a++) {
					if (e[a] > t[a]) return 1;
					if (e[a] < t[a]) return - 1
				}
				return 0
			},
			compare: function (e, t) {
				return this.cmpBigInt(e, t) >= 0
			},
			format: function (e, t) {
				if (e && "object" == (void 0 === t ? "undefined" : i(t))) for (var a in t) if (void 0 != t[a]) {
					var n = new RegExp("({" + a + "})", "g");
					e = e.replace(n, t[a])
				}
				return e
			},
			makeArrayRandom: function (e, t) {
				null == t && (t = e.length);
				var a = e.slice(0, t);
				return a.sort(function () {
					return Math.random() - .5
				}),
					a
			}
		},
			cc._RF.pop()
	},
	{}],
	pako: [function (e, t, a) {
		(function (i) {
			"use strict";
			cc._RF.push(t, "14adcj0TY9DNp1sjWcTPlei", "pako");
			var n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ?
				function (e) {
					return typeof e
				} : function (e) {
					return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
				}; !
					function (e) {
						"object" == (void 0 === a ? "undefined" : n(a)) && void 0 !== t ? t.exports = e() : "function" == typeof define && define.amd ? define([], e) : ("undefined" != typeof window ? window : void 0 !== i ? i : "undefined" != typeof self ? self : this).pako = e()
					}(function () {
						return function t(a, i, n) {
							function r(s, c) {
								if (!i[s]) {
									if (!a[s]) {
										var l = "function" == typeof e && e;
										if (!c && l) return l(s, !0);
										if (o) return o(s, !0);
										var d = new Error("Cannot find module '" + s + "'");
										throw d.code = "MODULE_NOT_FOUND",
										d
									}
									var h = i[s] = {
										exports: {}
									};
									a[s][0].call(h.exports,
										function (e) {
											return r(a[s][1][e] || e)
										},
										h, h.exports, t, a, i, n)
								}
								return i[s].exports
							}
							for (var o = "function" == typeof e && e,
								s = 0; s < n.length; s++) r(n[s]);
							return r
						}({
							1: [function (e, t, a) {
								var i = e("./zlib/deflate"),
									n = e("./utils/common"),
									r = e("./utils/strings"),
									o = e("./zlib/messages"),
									s = e("./zlib/zstream"),
									c = Object.prototype.toString,
									l = 0,
									d = -1,
									h = 0,
									u = 8;
								function m(e) {
									if (!(this instanceof m)) return new m(e);
									this.options = n.assign({
										level: d,
										method: u,
										chunkSize: 16384,
										windowBits: 15,
										memLevel: 8,
										strategy: h,
										to: ""
									},
										e || {});
									var t = this.options;
									t.raw && 0 < t.windowBits ? t.windowBits = -t.windowBits : t.gzip && 0 < t.windowBits && t.windowBits < 16 && (t.windowBits += 16),
										this.err = 0,
										this.msg = "",
										this.ended = !1,
										this.chunks = [],
										this.strm = new s,
										this.strm.avail_out = 0;
									var a = i.deflateInit2(this.strm, t.level, t.method, t.windowBits, t.memLevel, t.strategy);
									if (a !== l) throw new Error(o[a]);
									if (t.header && i.deflateSetHeader(this.strm, t.header), t.dictionary) {
										var g;
										if (g = "string" == typeof t.dictionary ? r.string2buf(t.dictionary) : "[object ArrayBuffer]" === c.call(t.dictionary) ? new Uint8Array(t.dictionary) : t.dictionary, (a = i.deflateSetDictionary(this.strm, g)) !== l) throw new Error(o[a]);
										this._dict_set = !0
									}
								}
								function g(e, t) {
									var a = new m(t);
									if (a.push(e, !0), a.err) throw a.msg || o[a.err];
									return a.result
								}
								m.prototype.push = function (e, t) {
									var a, o, s = this.strm,
										d = this.options.chunkSize;
									if (this.ended) return !1;
									o = t === ~~t ? t : !0 === t ? 4 : 0,
										"string" == typeof e ? s.input = r.string2buf(e) : "[object ArrayBuffer]" === c.call(e) ? s.input = new Uint8Array(e) : s.input = e,
										s.next_in = 0,
										s.avail_in = s.input.length;
									do {
										if (0 === s.avail_out && (s.output = new n.Buf8(d), s.next_out = 0, s.avail_out = d), 1 !== (a = i.deflate(s, o)) && a !== l) return this.onEnd(a), !(this.ended = !0);
										0 !== s.avail_out && (0 !== s.avail_in || 4 !== o && 2 !== o) || ("string" === this.options.to ? this.onData(r.buf2binstring(n.shrinkBuf(s.output, s.next_out))) : this.onData(n.shrinkBuf(s.output, s.next_out)))
									} while ((0 < s.avail_in || 0 === s.avail_out) && 1 !== a);
									return 4 === o ? (a = i.deflateEnd(this.strm), this.onEnd(a), this.ended = !0, a === l) : 2 !== o || (this.onEnd(l), !(s.avail_out = 0))
								},
									m.prototype.onData = function (e) {
										this.chunks.push(e)
									},
									m.prototype.onEnd = function (e) {
										e === l && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = n.flattenChunks(this.chunks)),
											this.chunks = [],
											this.err = e,
											this.msg = this.strm.msg
									},
									a.Deflate = m,
									a.deflate = g,
									a.deflateRaw = function (e, t) {
										return (t = t || {}).raw = !0,
											g(e, t)
									},
									a.gzip = function (e, t) {
										return (t = t || {}).gzip = !0,
											g(e, t)
									}
							},
							{
								"./utils/common": 3,
								"./utils/strings": 4,
								"./zlib/deflate": 8,
								"./zlib/messages": 13,
								"./zlib/zstream": 15
							}],
							2: [function (e, t, a) {
								var i = e("./zlib/inflate"),
									n = e("./utils/common"),
									r = e("./utils/strings"),
									o = e("./zlib/constants"),
									s = e("./zlib/messages"),
									c = e("./zlib/zstream"),
									l = e("./zlib/gzheader"),
									d = Object.prototype.toString;
								function h(e) {
									if (!(this instanceof h)) return new h(e);
									this.options = n.assign({
										chunkSize: 16384,
										windowBits: 0,
										to: ""
									},
										e || {});
									var t = this.options;
									t.raw && 0 <= t.windowBits && t.windowBits < 16 && (t.windowBits = -t.windowBits, 0 === t.windowBits && (t.windowBits = -15)),
										!(0 <= t.windowBits && t.windowBits < 16) || e && e.windowBits || (t.windowBits += 32),
										15 < t.windowBits && t.windowBits < 48 && 0 == (15 & t.windowBits) && (t.windowBits |= 15),
										this.err = 0,
										this.msg = "",
										this.ended = !1,
										this.chunks = [],
										this.strm = new c,
										this.strm.avail_out = 0;
									var a = i.inflateInit2(this.strm, t.windowBits);
									if (a !== o.Z_OK) throw new Error(s[a]);
									if (this.header = new l, i.inflateGetHeader(this.strm, this.header), t.dictionary && ("string" == typeof t.dictionary ? t.dictionary = r.string2buf(t.dictionary) : "[object ArrayBuffer]" === d.call(t.dictionary) && (t.dictionary = new Uint8Array(t.dictionary)), t.raw && (a = i.inflateSetDictionary(this.strm, t.dictionary)) !== o.Z_OK)) throw new Error(s[a])
								}
								function u(e, t) {
									var a = new h(t);
									if (a.push(e, !0), a.err) throw a.msg || s[a.err];
									return a.result
								}
								h.prototype.push = function (e, t) {
									var a, s, c, l, h, u = this.strm,
										m = this.options.chunkSize,
										g = this.options.dictionary,
										p = !1;
									if (this.ended) return !1;
									s = t === ~~t ? t : !0 === t ? o.Z_FINISH : o.Z_NO_FLUSH,
										"string" == typeof e ? u.input = r.binstring2buf(e) : "[object ArrayBuffer]" === d.call(e) ? u.input = new Uint8Array(e) : u.input = e,
										u.next_in = 0,
										u.avail_in = u.input.length;
									do {
										if (0 === u.avail_out && (u.output = new n.Buf8(m), u.next_out = 0, u.avail_out = m), (a = i.inflate(u, o.Z_NO_FLUSH)) === o.Z_NEED_DICT && g && (a = i.inflateSetDictionary(this.strm, g)), a === o.Z_BUF_ERROR && !0 === p && (a = o.Z_OK, p = !1), a !== o.Z_STREAM_END && a !== o.Z_OK) return this.onEnd(a), !(this.ended = !0);
										u.next_out && (0 !== u.avail_out && a !== o.Z_STREAM_END && (0 !== u.avail_in || s !== o.Z_FINISH && s !== o.Z_SYNC_FLUSH) || ("string" === this.options.to ? (c = r.utf8border(u.output, u.next_out), l = u.next_out - c, h = r.buf2string(u.output, c), u.next_out = l, u.avail_out = m - l, l && n.arraySet(u.output, u.output, c, l, 0), this.onData(h)) : this.onData(n.shrinkBuf(u.output, u.next_out)))), 0 === u.avail_in && 0 === u.avail_out && (p = !0)
									} while ((0 < u.avail_in || 0 === u.avail_out) && a !== o.Z_STREAM_END);
									return a === o.Z_STREAM_END && (s = o.Z_FINISH),
										s === o.Z_FINISH ? (a = i.inflateEnd(this.strm), this.onEnd(a), this.ended = !0, a === o.Z_OK) : s !== o.Z_SYNC_FLUSH || (this.onEnd(o.Z_OK), !(u.avail_out = 0))
								},
									h.prototype.onData = function (e) {
										this.chunks.push(e)
									},
									h.prototype.onEnd = function (e) {
										e === o.Z_OK && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = n.flattenChunks(this.chunks)),
											this.chunks = [],
											this.err = e,
											this.msg = this.strm.msg
									},
									a.Inflate = h,
									a.inflate = u,
									a.inflateRaw = function (e, t) {
										return (t = t || {}).raw = !0,
											u(e, t)
									},
									a.ungzip = u
							},
							{
								"./utils/common": 3,
								"./utils/strings": 4,
								"./zlib/constants": 6,
								"./zlib/gzheader": 9,
								"./zlib/inflate": 11,
								"./zlib/messages": 13,
								"./zlib/zstream": 15
							}],
							3: [function (e, t, a) {
								var i = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Int32Array;
								a.assign = function (e) {
									for (var t, a, i = Array.prototype.slice.call(arguments, 1); i.length;) {
										var r = i.shift();
										if (r) {
											if ("object" != (void 0 === r ? "undefined" : n(r))) throw new TypeError(r + "must be non-object");
											for (var o in r) t = r,
												a = o,
												Object.prototype.hasOwnProperty.call(t, a) && (e[o] = r[o])
										}
									}
									return e
								},
									a.shrinkBuf = function (e, t) {
										return e.length === t ? e : e.subarray ? e.subarray(0, t) : (e.length = t, e)
									};
								var r = {
									arraySet: function (e, t, a, i, n) {
										if (t.subarray && e.subarray) e.set(t.subarray(a, a + i), n);
										else for (var r = 0; r < i; r++) e[n + r] = t[a + r]
									},
									flattenChunks: function (e) {
										var t, a, i, n, r, o;
										for (t = i = 0, a = e.length; t < a; t++) i += e[t].length;
										for (o = new Uint8Array(i), t = n = 0, a = e.length; t < a; t++) r = e[t],
											o.set(r, n),
											n += r.length;
										return o
									}
								},
									o = {
										arraySet: function (e, t, a, i, n) {
											for (var r = 0; r < i; r++) e[n + r] = t[a + r]
										},
										flattenChunks: function (e) {
											return [].concat.apply([], e)
										}
									};
								a.setTyped = function (e) {
									e ? (a.Buf8 = Uint8Array, a.Buf16 = Uint16Array, a.Buf32 = Int32Array, a.assign(a, r)) : (a.Buf8 = Array, a.Buf16 = Array, a.Buf32 = Array, a.assign(a, o))
								},
									a.setTyped(i)
							},
							{}],
							4: [function (e, t, a) {
								var i = e("./common"),
									n = !0,
									r = !0;
								try {
									String.fromCharCode.apply(null, [0])
								} catch (e) {
									n = !1
								}
								try {
									String.fromCharCode.apply(null, new Uint8Array(1))
								} catch (e) {
									r = !1
								}
								for (var o = new i.Buf8(256), s = 0; s < 256; s++) o[s] = 252 <= s ? 6 : 248 <= s ? 5 : 240 <= s ? 4 : 224 <= s ? 3 : 192 <= s ? 2 : 1;
								function c(e, t) {
									if (t < 65534 && (e.subarray && r || !e.subarray && n)) return String.fromCharCode.apply(null, i.shrinkBuf(e, t));
									for (var a = "",
										o = 0; o < t; o++) a += String.fromCharCode(e[o]);
									return a
								}
								o[254] = o[254] = 1,
									a.string2buf = function (e) {
										var t, a, n, r, o, s = e.length,
											c = 0;
										for (r = 0; r < s; r++) 55296 == (64512 & (a = e.charCodeAt(r))) && r + 1 < s && 56320 == (64512 & (n = e.charCodeAt(r + 1))) && (a = 65536 + (a - 55296 << 10) + (n - 56320), r++),
											c += a < 128 ? 1 : a < 2048 ? 2 : a < 65536 ? 3 : 4;
										for (t = new i.Buf8(c), r = o = 0; o < c; r++) 55296 == (64512 & (a = e.charCodeAt(r))) && r + 1 < s && 56320 == (64512 & (n = e.charCodeAt(r + 1))) && (a = 65536 + (a - 55296 << 10) + (n - 56320), r++),
											a < 128 ? t[o++] = a : (a < 2048 ? t[o++] = 192 | a >>> 6 : (a < 65536 ? t[o++] = 224 | a >>> 12 : (t[o++] = 240 | a >>> 18, t[o++] = 128 | a >>> 12 & 63), t[o++] = 128 | a >>> 6 & 63), t[o++] = 128 | 63 & a);
										return t
									},
									a.buf2binstring = function (e) {
										return c(e, e.length)
									},
									a.binstring2buf = function (e) {
										for (var t = new i.Buf8(e.length), a = 0, n = t.length; a < n; a++) t[a] = e.charCodeAt(a);
										return t
									},
									a.buf2string = function (e, t) {
										var a, i, n, r, s = t || e.length,
											l = new Array(2 * s);
										for (a = i = 0; a < s;) if ((n = e[a++]) < 128) l[i++] = n;
										else if (4 < (r = o[n])) l[i++] = 65533,
											a += r - 1;
										else {
											for (n &= 2 === r ? 31 : 3 === r ? 15 : 7; 1 < r && a < s;) n = n << 6 | 63 & e[a++],
												r--;
											1 < r ? l[i++] = 65533 : n < 65536 ? l[i++] = n : (n -= 65536, l[i++] = 55296 | n >> 10 & 1023, l[i++] = 56320 | 1023 & n)
										}
										return c(l, i)
									},
									a.utf8border = function (e, t) {
										var a;
										for ((t = t || e.length) > e.length && (t = e.length), a = t - 1; 0 <= a && 128 == (192 & e[a]);) a--;
										return a < 0 ? t : 0 === a ? t : a + o[e[a]] > t ? a : t
									}
							},
							{
								"./common": 3
							}],
							5: [function (e, t, a) {
								t.exports = function (e, t, a, i) {
									for (var n = 65535 & e | 0,
										r = e >>> 16 & 65535 | 0,
										o = 0; 0 !== a;) {
										for (a -= o = 2e3 < a ? 2e3 : a; r = r + (n = n + t[i++] | 0) | 0, --o;);
										n %= 65521,
											r %= 65521
									}
									return n | r << 16 | 0
								}
							},
							{}],
							6: [function (e, t, a) {
								t.exports = {
									Z_NO_FLUSH: 0,
									Z_PARTIAL_FLUSH: 1,
									Z_SYNC_FLUSH: 2,
									Z_FULL_FLUSH: 3,
									Z_FINISH: 4,
									Z_BLOCK: 5,
									Z_TREES: 6,
									Z_OK: 0,
									Z_STREAM_END: 1,
									Z_NEED_DICT: 2,
									Z_ERRNO: -1,
									Z_STREAM_ERROR: -2,
									Z_DATA_ERROR: -3,
									Z_BUF_ERROR: -5,
									Z_NO_COMPRESSION: 0,
									Z_BEST_SPEED: 1,
									Z_BEST_COMPRESSION: 9,
									Z_DEFAULT_COMPRESSION: -1,
									Z_FILTERED: 1,
									Z_HUFFMAN_ONLY: 2,
									Z_RLE: 3,
									Z_FIXED: 4,
									Z_DEFAULT_STRATEGY: 0,
									Z_BINARY: 0,
									Z_TEXT: 1,
									Z_UNKNOWN: 2,
									Z_DEFLATED: 8
								}
							},
							{}],
							7: [function (e, t, a) {
								var i = function () {
									for (var e, t = [], a = 0; a < 256; a++) {
										e = a;
										for (var i = 0; i < 8; i++) e = 1 & e ? 3988292384 ^ e >>> 1 : e >>> 1;
										t[a] = e
									}
									return t
								}();
								t.exports = function (e, t, a, n) {
									var r = i,
										o = n + a;
									e ^= -1;
									for (var s = n; s < o; s++) e = e >>> 8 ^ r[255 & (e ^ t[s])];
									return - 1 ^ e
								}
							},
							{}],
							8: [function (e, t, a) {
								var i, n = e("../utils/common"),
									r = e("./trees"),
									o = e("./adler32"),
									s = e("./crc32"),
									c = e("./messages"),
									l = 0,
									d = 4,
									h = 0,
									u = -2,
									m = -1,
									g = 4,
									p = 2,
									f = 8,
									v = 9,
									_ = 286,
									y = 30,
									b = 19,
									S = 2 * _ + 1,
									C = 15,
									D = 3,
									w = 258,
									A = w + D + 1,
									M = 42,
									E = 113,
									k = 1,
									I = 2,
									T = 3,
									R = 4;
								function N(e, t) {
									return e.msg = c[t],
										t
								}
								function L(e) {
									return (e << 1) - (4 < e ? 9 : 0)
								}
								function B(e) {
									for (var t = e.length; 0 <= --t;) e[t] = 0
								}
								function P(e) {
									var t = e.state,
										a = t.pending;
									a > e.avail_out && (a = e.avail_out),
										0 !== a && (n.arraySet(e.output, t.pending_buf, t.pending_out, a, e.next_out), e.next_out += a, t.pending_out += a, e.total_out += a, e.avail_out -= a, t.pending -= a, 0 === t.pending && (t.pending_out = 0))
								}
								function F(e, t) {
									r._tr_flush_block(e, 0 <= e.block_start ? e.block_start : -1, e.strstart - e.block_start, t),
										e.block_start = e.strstart,
										P(e.strm)
								}
								function x(e, t) {
									e.pending_buf[e.pending++] = t
								}
								function U(e, t) {
									e.pending_buf[e.pending++] = t >>> 8 & 255,
										e.pending_buf[e.pending++] = 255 & t
								}
								function V(e, t) {
									var a, i, n = e.max_chain_length,
										r = e.strstart,
										o = e.prev_length,
										s = e.nice_match,
										c = e.strstart > e.w_size - A ? e.strstart - (e.w_size - A) : 0,
										l = e.window,
										d = e.w_mask,
										h = e.prev,
										u = e.strstart + w,
										m = l[r + o - 1],
										g = l[r + o];
									e.prev_length >= e.good_match && (n >>= 2),
										s > e.lookahead && (s = e.lookahead);
									do {
										if (l[(a = t) + o] === g && l[a + o - 1] === m && l[a] === l[r] && l[++a] === l[r + 1]) {
											r += 2,
												a++;
											do { } while (l[++r] === l[++a] && l[++r] === l[++a] && l[++r] === l[++a] && l[++r] === l[++a] && l[++r] === l[++a] && l[++r] === l[++a] && l[++r] === l[++a] && l[++r] === l[++a] && r < u);
											if (i = w - (u - r), r = u - w, o < i) {
												if (e.match_start = t, s <= (o = i)) break;
												m = l[r + o - 1],
													g = l[r + o]
											}
										}
									} while ((t = h[t & d]) > c && 0 != --n);
									return o <= e.lookahead ? o : e.lookahead
								}
								function O(e) {
									var t, a, i, r, c, l, d, h, u, m, g = e.w_size;
									do {
										if (r = e.window_size - e.lookahead - e.strstart, e.strstart >= g + (g - A)) {
											for (n.arraySet(e.window, e.window, g, g, 0), e.match_start -= g, e.strstart -= g, e.block_start -= g, t = a = e.hash_size; i = e.head[--t], e.head[t] = g <= i ? i - g : 0, --a;);
											for (t = a = g; i = e.prev[--t], e.prev[t] = g <= i ? i - g : 0, --a;);
											r += g
										}
										if (0 === e.strm.avail_in) break;
										if (l = e.strm, d = e.window, h = e.strstart + e.lookahead, m = void 0, (u = r) < (m = l.avail_in) && (m = u), a = 0 === m ? 0 : (l.avail_in -= m, n.arraySet(d, l.input, l.next_in, m, h), 1 === l.state.wrap ? l.adler = o(l.adler, d, m, h) : 2 === l.state.wrap && (l.adler = s(l.adler, d, m, h)), l.next_in += m, l.total_in += m, m), e.lookahead += a, e.lookahead + e.insert >= D) for (c = e.strstart - e.insert, e.ins_h = e.window[c], e.ins_h = (e.ins_h << e.hash_shift ^ e.window[c + 1]) & e.hash_mask; e.insert && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[c + D - 1]) & e.hash_mask, e.prev[c & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = c, c++, e.insert--, !(e.lookahead + e.insert < D)););
									} while (e.lookahead < A && 0 !== e.strm.avail_in)
								}
								function G(e, t) {
									for (var a, i; ;) {
										if (e.lookahead < A) {
											if (O(e), e.lookahead < A && t === l) return k;
											if (0 === e.lookahead) break
										}
										if (a = 0, e.lookahead >= D && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + D - 1]) & e.hash_mask, a = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart), 0 !== a && e.strstart - a <= e.w_size - A && (e.match_length = V(e, a)), e.match_length >= D) if (i = r._tr_tally(e, e.strstart - e.match_start, e.match_length - D), e.lookahead -= e.match_length, e.match_length <= e.max_lazy_match && e.lookahead >= D) {
											for (e.match_length--; e.strstart++, e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + D - 1]) & e.hash_mask, a = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart, 0 != --e.match_length;);
											e.strstart++
										} else e.strstart += e.match_length,
											e.match_length = 0,
											e.ins_h = e.window[e.strstart],
											e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + 1]) & e.hash_mask;
										else i = r._tr_tally(e, 0, e.window[e.strstart]),
											e.lookahead--,
											e.strstart++;
										if (i && (F(e, !1), 0 === e.strm.avail_out)) return k
									}
									return e.insert = e.strstart < D - 1 ? e.strstart : D - 1,
										t === d ? (F(e, !0), 0 === e.strm.avail_out ? T : R) : e.last_lit && (F(e, !1), 0 === e.strm.avail_out) ? k : I
								}
								function H(e, t) {
									for (var a, i, n; ;) {
										if (e.lookahead < A) {
											if (O(e), e.lookahead < A && t === l) return k;
											if (0 === e.lookahead) break
										}
										if (a = 0, e.lookahead >= D && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + D - 1]) & e.hash_mask, a = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart), e.prev_length = e.match_length, e.prev_match = e.match_start, e.match_length = D - 1, 0 !== a && e.prev_length < e.max_lazy_match && e.strstart - a <= e.w_size - A && (e.match_length = V(e, a), e.match_length <= 5 && (1 === e.strategy || e.match_length === D && 4096 < e.strstart - e.match_start) && (e.match_length = D - 1)), e.prev_length >= D && e.match_length <= e.prev_length) {
											for (n = e.strstart + e.lookahead - D, i = r._tr_tally(e, e.strstart - 1 - e.prev_match, e.prev_length - D), e.lookahead -= e.prev_length - 1, e.prev_length -= 2; ++e.strstart <= n && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + D - 1]) & e.hash_mask, a = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart), 0 != --e.prev_length;);
											if (e.match_available = 0, e.match_length = D - 1, e.strstart++, i && (F(e, !1), 0 === e.strm.avail_out)) return k
										} else if (e.match_available) {
											if ((i = r._tr_tally(e, 0, e.window[e.strstart - 1])) && F(e, !1), e.strstart++, e.lookahead--, 0 === e.strm.avail_out) return k
										} else e.match_available = 1,
											e.strstart++,
											e.lookahead--
									}
									return e.match_available && (i = r._tr_tally(e, 0, e.window[e.strstart - 1]), e.match_available = 0),
										e.insert = e.strstart < D - 1 ? e.strstart : D - 1,
										t === d ? (F(e, !0), 0 === e.strm.avail_out ? T : R) : e.last_lit && (F(e, !1), 0 === e.strm.avail_out) ? k : I
								}
								function W(e, t, a, i, n) {
									this.good_length = e,
										this.max_lazy = t,
										this.nice_length = a,
										this.max_chain = i,
										this.func = n
								}
								function q() {
									this.strm = null,
										this.status = 0,
										this.pending_buf = null,
										this.pending_buf_size = 0,
										this.pending_out = 0,
										this.pending = 0,
										this.wrap = 0,
										this.gzhead = null,
										this.gzindex = 0,
										this.method = f,
										this.last_flush = -1,
										this.w_size = 0,
										this.w_bits = 0,
										this.w_mask = 0,
										this.window = null,
										this.window_size = 0,
										this.prev = null,
										this.head = null,
										this.ins_h = 0,
										this.hash_size = 0,
										this.hash_bits = 0,
										this.hash_mask = 0,
										this.hash_shift = 0,
										this.block_start = 0,
										this.match_length = 0,
										this.prev_match = 0,
										this.match_available = 0,
										this.strstart = 0,
										this.match_start = 0,
										this.lookahead = 0,
										this.prev_length = 0,
										this.max_chain_length = 0,
										this.max_lazy_match = 0,
										this.level = 0,
										this.strategy = 0,
										this.good_match = 0,
										this.nice_match = 0,
										this.dyn_ltree = new n.Buf16(2 * S),
										this.dyn_dtree = new n.Buf16(2 * (2 * y + 1)),
										this.bl_tree = new n.Buf16(2 * (2 * b + 1)),
										B(this.dyn_ltree),
										B(this.dyn_dtree),
										B(this.bl_tree),
										this.l_desc = null,
										this.d_desc = null,
										this.bl_desc = null,
										this.bl_count = new n.Buf16(C + 1),
										this.heap = new n.Buf16(2 * _ + 1),
										B(this.heap),
										this.heap_len = 0,
										this.heap_max = 0,
										this.depth = new n.Buf16(2 * _ + 1),
										B(this.depth),
										this.l_buf = 0,
										this.lit_bufsize = 0,
										this.last_lit = 0,
										this.d_buf = 0,
										this.opt_len = 0,
										this.static_len = 0,
										this.matches = 0,
										this.insert = 0,
										this.bi_buf = 0,
										this.bi_valid = 0
								}
								function j(e) {
									var t;
									return e && e.state ? (e.total_in = e.total_out = 0, e.data_type = p, (t = e.state).pending = 0, t.pending_out = 0, t.wrap < 0 && (t.wrap = -t.wrap), t.status = t.wrap ? M : E, e.adler = 2 === t.wrap ? 0 : 1, t.last_flush = l, r._tr_init(t), h) : N(e, u)
								}
								function z(e) {
									var t, a = j(e);
									return a === h && ((t = e.state).window_size = 2 * t.w_size, B(t.head), t.max_lazy_match = i[t.level].max_lazy, t.good_match = i[t.level].good_length, t.nice_match = i[t.level].nice_length, t.max_chain_length = i[t.level].max_chain, t.strstart = 0, t.block_start = 0, t.lookahead = 0, t.insert = 0, t.match_length = t.prev_length = D - 1, t.match_available = 0, t.ins_h = 0),
										a
								}
								function X(e, t, a, i, r, o) {
									if (!e) return u;
									var s = 1;
									if (t === m && (t = 6), i < 0 ? (s = 0, i = -i) : 15 < i && (s = 2, i -= 16), r < 1 || v < r || a !== f || i < 8 || 15 < i || t < 0 || 9 < t || o < 0 || g < o) return N(e, u);
									8 === i && (i = 9);
									var c = new q;
									return (e.state = c).strm = e,
										c.wrap = s,
										c.gzhead = null,
										c.w_bits = i,
										c.w_size = 1 << c.w_bits,
										c.w_mask = c.w_size - 1,
										c.hash_bits = r + 7,
										c.hash_size = 1 << c.hash_bits,
										c.hash_mask = c.hash_size - 1,
										c.hash_shift = ~~((c.hash_bits + D - 1) / D),
										c.window = new n.Buf8(2 * c.w_size),
										c.head = new n.Buf16(c.hash_size),
										c.prev = new n.Buf16(c.w_size),
										c.lit_bufsize = 1 << r + 6,
										c.pending_buf_size = 4 * c.lit_bufsize,
										c.pending_buf = new n.Buf8(c.pending_buf_size),
										c.d_buf = 1 * c.lit_bufsize,
										c.l_buf = 3 * c.lit_bufsize,
										c.level = t,
										c.strategy = o,
										c.method = a,
										z(e)
								}
								i = [new W(0, 0, 0, 0,
									function (e, t) {
										var a = 65535;
										for (a > e.pending_buf_size - 5 && (a = e.pending_buf_size - 5); ;) {
											if (e.lookahead <= 1) {
												if (O(e), 0 === e.lookahead && t === l) return k;
												if (0 === e.lookahead) break
											}
											e.strstart += e.lookahead,
												e.lookahead = 0;
											var i = e.block_start + a;
											if ((0 === e.strstart || e.strstart >= i) && (e.lookahead = e.strstart - i, e.strstart = i, F(e, !1), 0 === e.strm.avail_out)) return k;
											if (e.strstart - e.block_start >= e.w_size - A && (F(e, !1), 0 === e.strm.avail_out)) return k
										}
										return e.insert = 0,
											t === d ? (F(e, !0), 0 === e.strm.avail_out ? T : R) : (e.strstart > e.block_start && (F(e, !1), e.strm.avail_out), k)
									}), new W(4, 4, 8, 4, G), new W(4, 5, 16, 8, G), new W(4, 6, 32, 32, G), new W(4, 4, 16, 16, H), new W(8, 16, 32, 32, H), new W(8, 16, 128, 128, H), new W(8, 32, 128, 256, H), new W(32, 128, 258, 1024, H), new W(32, 258, 258, 4096, H)],
									a.deflateInit = function (e, t) {
										return X(e, t, f, 15, 8, 0)
									},
									a.deflateInit2 = X,
									a.deflateReset = z,
									a.deflateResetKeep = j,
									a.deflateSetHeader = function (e, t) {
										return e && e.state ? 2 !== e.state.wrap ? u : (e.state.gzhead = t, h) : u
									},
									a.deflate = function (e, t) {
										var a, n, o, c;
										if (!e || !e.state || 5 < t || t < 0) return e ? N(e, u) : u;
										if (n = e.state, !e.output || !e.input && 0 !== e.avail_in || 666 === n.status && t !== d) return N(e, 0 === e.avail_out ? -5 : u);
										if (n.strm = e, a = n.last_flush, n.last_flush = t, n.status === M) if (2 === n.wrap) e.adler = 0,
											x(n, 31),
											x(n, 139),
											x(n, 8),
											n.gzhead ? (x(n, (n.gzhead.text ? 1 : 0) + (n.gzhead.hcrc ? 2 : 0) + (n.gzhead.extra ? 4 : 0) + (n.gzhead.name ? 8 : 0) + (n.gzhead.comment ? 16 : 0)), x(n, 255 & n.gzhead.time), x(n, n.gzhead.time >> 8 & 255), x(n, n.gzhead.time >> 16 & 255), x(n, n.gzhead.time >> 24 & 255), x(n, 9 === n.level ? 2 : 2 <= n.strategy || n.level < 2 ? 4 : 0), x(n, 255 & n.gzhead.os), n.gzhead.extra && n.gzhead.extra.length && (x(n, 255 & n.gzhead.extra.length), x(n, n.gzhead.extra.length >> 8 & 255)), n.gzhead.hcrc && (e.adler = s(e.adler, n.pending_buf, n.pending, 0)), n.gzindex = 0, n.status = 69) : (x(n, 0), x(n, 0), x(n, 0), x(n, 0), x(n, 0), x(n, 9 === n.level ? 2 : 2 <= n.strategy || n.level < 2 ? 4 : 0), x(n, 3), n.status = E);
										else {
											var m = f + (n.w_bits - 8 << 4) << 8;
											m |= (2 <= n.strategy || n.level < 2 ? 0 : n.level < 6 ? 1 : 6 === n.level ? 2 : 3) << 6,
												0 !== n.strstart && (m |= 32),
												m += 31 - m % 31,
												n.status = E,
												U(n, m),
												0 !== n.strstart && (U(n, e.adler >>> 16), U(n, 65535 & e.adler)),
												e.adler = 1
										}
										if (69 === n.status) if (n.gzhead.extra) {
											for (o = n.pending; n.gzindex < (65535 & n.gzhead.extra.length) && (n.pending !== n.pending_buf_size || (n.gzhead.hcrc && n.pending > o && (e.adler = s(e.adler, n.pending_buf, n.pending - o, o)), P(e), o = n.pending, n.pending !== n.pending_buf_size));) x(n, 255 & n.gzhead.extra[n.gzindex]),
												n.gzindex++;
											n.gzhead.hcrc && n.pending > o && (e.adler = s(e.adler, n.pending_buf, n.pending - o, o)),
												n.gzindex === n.gzhead.extra.length && (n.gzindex = 0, n.status = 73)
										} else n.status = 73;
										if (73 === n.status) if (n.gzhead.name) {
											o = n.pending;
											do {
												if (n.pending === n.pending_buf_size && (n.gzhead.hcrc && n.pending > o && (e.adler = s(e.adler, n.pending_buf, n.pending - o, o)), P(e), o = n.pending, n.pending === n.pending_buf_size)) {
													c = 1;
													break
												}
												x(n, c = n.gzindex < n.gzhead.name.length ? 255 & n.gzhead.name.charCodeAt(n.gzindex++) : 0)
											} while (0 !== c);
											n.gzhead.hcrc && n.pending > o && (e.adler = s(e.adler, n.pending_buf, n.pending - o, o)),
												0 === c && (n.gzindex = 0, n.status = 91)
										} else n.status = 91;
										if (91 === n.status) if (n.gzhead.comment) {
											o = n.pending;
											do {
												if (n.pending === n.pending_buf_size && (n.gzhead.hcrc && n.pending > o && (e.adler = s(e.adler, n.pending_buf, n.pending - o, o)), P(e), o = n.pending, n.pending === n.pending_buf_size)) {
													c = 1;
													break
												}
												x(n, c = n.gzindex < n.gzhead.comment.length ? 255 & n.gzhead.comment.charCodeAt(n.gzindex++) : 0)
											} while (0 !== c);
											n.gzhead.hcrc && n.pending > o && (e.adler = s(e.adler, n.pending_buf, n.pending - o, o)),
												0 === c && (n.status = 103)
										} else n.status = 103;
										if (103 === n.status && (n.gzhead.hcrc ? (n.pending + 2 > n.pending_buf_size && P(e), n.pending + 2 <= n.pending_buf_size && (x(n, 255 & e.adler), x(n, e.adler >> 8 & 255), e.adler = 0, n.status = E)) : n.status = E), 0 !== n.pending) {
											if (P(e), 0 === e.avail_out) return n.last_flush = -1,
												h
										} else if (0 === e.avail_in && L(t) <= L(a) && t !== d) return N(e, -5);
										if (666 === n.status && 0 !== e.avail_in) return N(e, -5);
										if (0 !== e.avail_in || 0 !== n.lookahead || t !== l && 666 !== n.status) {
											var g = 2 === n.strategy ?
												function (e, t) {
													for (var a; ;) {
														if (0 === e.lookahead && (O(e), 0 === e.lookahead)) {
															if (t === l) return k;
															break
														}
														if (e.match_length = 0, a = r._tr_tally(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++, a && (F(e, !1), 0 === e.strm.avail_out)) return k
													}
													return e.insert = 0,
														t === d ? (F(e, !0), 0 === e.strm.avail_out ? T : R) : e.last_lit && (F(e, !1), 0 === e.strm.avail_out) ? k : I
												}(n, t) : 3 === n.strategy ?
													function (e, t) {
														for (var a, i, n, o, s = e.window; ;) {
															if (e.lookahead <= w) {
																if (O(e), e.lookahead <= w && t === l) return k;
																if (0 === e.lookahead) break
															}
															if (e.match_length = 0, e.lookahead >= D && 0 < e.strstart && (i = s[n = e.strstart - 1]) === s[++n] && i === s[++n] && i === s[++n]) {
																o = e.strstart + w;
																do { } while (i === s[++n] && i === s[++n] && i === s[++n] && i === s[++n] && i === s[++n] && i === s[++n] && i === s[++n] && i === s[++n] && n < o);
																e.match_length = w - (o - n),
																	e.match_length > e.lookahead && (e.match_length = e.lookahead)
															}
															if (e.match_length >= D ? (a = r._tr_tally(e, 1, e.match_length - D), e.lookahead -= e.match_length, e.strstart += e.match_length, e.match_length = 0) : (a = r._tr_tally(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++), a && (F(e, !1), 0 === e.strm.avail_out)) return k
														}
														return e.insert = 0,
															t === d ? (F(e, !0), 0 === e.strm.avail_out ? T : R) : e.last_lit && (F(e, !1), 0 === e.strm.avail_out) ? k : I
													}(n, t) : i[n.level].func(n, t);
											if (g !== T && g !== R || (n.status = 666), g === k || g === T) return 0 === e.avail_out && (n.last_flush = -1),
												h;
											if (g === I && (1 === t ? r._tr_align(n) : 5 !== t && (r._tr_stored_block(n, 0, 0, !1), 3 === t && (B(n.head), 0 === n.lookahead && (n.strstart = 0, n.block_start = 0, n.insert = 0))), P(e), 0 === e.avail_out)) return n.last_flush = -1,
												h
										}
										return t !== d ? h : n.wrap <= 0 ? 1 : (2 === n.wrap ? (x(n, 255 & e.adler), x(n, e.adler >> 8 & 255), x(n, e.adler >> 16 & 255), x(n, e.adler >> 24 & 255), x(n, 255 & e.total_in), x(n, e.total_in >> 8 & 255), x(n, e.total_in >> 16 & 255), x(n, e.total_in >> 24 & 255)) : (U(n, e.adler >>> 16), U(n, 65535 & e.adler)), P(e), 0 < n.wrap && (n.wrap = -n.wrap), 0 !== n.pending ? h : 1)
									},
									a.deflateEnd = function (e) {
										var t;
										return e && e.state ? (t = e.state.status) !== M && 69 !== t && 73 !== t && 91 !== t && 103 !== t && t !== E && 666 !== t ? N(e, u) : (e.state = null, t === E ? N(e, -3) : h) : u
									},
									a.deflateSetDictionary = function (e, t) {
										var a, i, r, s, c, l, d, m, g = t.length;
										if (!e || !e.state) return u;
										if (2 === (s = (a = e.state).wrap) || 1 === s && a.status !== M || a.lookahead) return u;
										for (1 === s && (e.adler = o(e.adler, t, g, 0)), a.wrap = 0, g >= a.w_size && (0 === s && (B(a.head), a.strstart = 0, a.block_start = 0, a.insert = 0), m = new n.Buf8(a.w_size), n.arraySet(m, t, g - a.w_size, a.w_size, 0), t = m, g = a.w_size), c = e.avail_in, l = e.next_in, d = e.input, e.avail_in = g, e.next_in = 0, e.input = t, O(a); a.lookahead >= D;) {
											for (i = a.strstart, r = a.lookahead - (D - 1); a.ins_h = (a.ins_h << a.hash_shift ^ a.window[i + D - 1]) & a.hash_mask, a.prev[i & a.w_mask] = a.head[a.ins_h], a.head[a.ins_h] = i, i++, --r;);
											a.strstart = i,
												a.lookahead = D - 1,
												O(a)
										}
										return a.strstart += a.lookahead,
											a.block_start = a.strstart,
											a.insert = a.lookahead,
											a.lookahead = 0,
											a.match_length = a.prev_length = D - 1,
											a.match_available = 0,
											e.next_in = l,
											e.input = d,
											e.avail_in = c,
											a.wrap = s,
											h
									},
									a.deflateInfo = "pako deflate (from Nodeca project)"
							},
							{
								"../utils/common": 3,
								"./adler32": 5,
								"./crc32": 7,
								"./messages": 13,
								"./trees": 14
							}],
							9: [function (e, t, a) {
								t.exports = function () {
									this.text = 0,
										this.time = 0,
										this.xflags = 0,
										this.os = 0,
										this.extra = null,
										this.extra_len = 0,
										this.name = "",
										this.comment = "",
										this.hcrc = 0,
										this.done = !1
								}
							},
							{}],
							10: [function (e, t, a) {
								t.exports = function (e, t) {
									var a, i, n, r, o, s, c, l, d, h, u, m, g, p, f, v, _, y, b, S, C, D, w, A, M;
									a = e.state,
										i = e.next_in,
										A = e.input,
										n = i + (e.avail_in - 5),
										r = e.next_out,
										M = e.output,
										o = r - (t - e.avail_out),
										s = r + (e.avail_out - 257),
										c = a.dmax,
										l = a.wsize,
										d = a.whave,
										h = a.wnext,
										u = a.window,
										m = a.hold,
										g = a.bits,
										p = a.lencode,
										f = a.distcode,
										v = (1 << a.lenbits) - 1,
										_ = (1 << a.distbits) - 1;
									e: do {
										g < 15 && (m += A[i++] << g, g += 8, m += A[i++] << g, g += 8), y = p[m & v];
										t: for (; ;) {
											if (m >>>= b = y >>> 24, g -= b, 0 == (b = y >>> 16 & 255)) M[r++] = 65535 & y;
											else {
												if (!(16 & b)) {
													if (0 == (64 & b)) {
														y = p[(65535 & y) + (m & (1 << b) - 1)];
														continue t
													}
													if (32 & b) {
														a.mode = 12;
														break e
													}
													e.msg = "invalid literal/length code",
														a.mode = 30;
													break e
												}
												S = 65535 & y,
													(b &= 15) && (g < b && (m += A[i++] << g, g += 8), S += m & (1 << b) - 1, m >>>= b, g -= b),
													g < 15 && (m += A[i++] << g, g += 8, m += A[i++] << g, g += 8),
													y = f[m & _];
												a: for (; ;) {
													if (m >>>= b = y >>> 24, g -= b, !(16 & (b = y >>> 16 & 255))) {
														if (0 == (64 & b)) {
															y = f[(65535 & y) + (m & (1 << b) - 1)];
															continue a
														}
														e.msg = "invalid distance code",
															a.mode = 30;
														break e
													}
													if (C = 65535 & y, g < (b &= 15) && (m += A[i++] << g, (g += 8) < b && (m += A[i++] << g, g += 8)), c < (C += m & (1 << b) - 1)) {
														e.msg = "invalid distance too far back",
															a.mode = 30;
														break e
													}
													if (m >>>= b, g -= b, (b = r - o) < C) {
														if (d < (b = C - b) && a.sane) {
															e.msg = "invalid distance too far back",
																a.mode = 30;
															break e
														}
														if (w = u, (D = 0) === h) {
															if (D += l - b, b < S) {
																for (S -= b; M[r++] = u[D++], --b;);
																D = r - C,
																	w = M
															}
														} else if (h < b) {
															if (D += l + h - b, (b -= h) < S) {
																for (S -= b; M[r++] = u[D++], --b;);
																if (D = 0, h < S) {
																	for (S -= b = h; M[r++] = u[D++], --b;);
																	D = r - C,
																		w = M
																}
															}
														} else if (D += h - b, b < S) {
															for (S -= b; M[r++] = u[D++], --b;);
															D = r - C,
																w = M
														}
														for (; 2 < S;) M[r++] = w[D++],
															M[r++] = w[D++],
															M[r++] = w[D++],
															S -= 3;
														S && (M[r++] = w[D++], 1 < S && (M[r++] = w[D++]))
													} else {
														for (D = r - C; M[r++] = M[D++], M[r++] = M[D++], M[r++] = M[D++], 2 < (S -= 3););
														S && (M[r++] = M[D++], 1 < S && (M[r++] = M[D++]))
													}
													break
												}
											}
											break
										}
									} while (i < n && r < s);
									i -= S = g >> 3,
										m &= (1 << (g -= S << 3)) - 1,
										e.next_in = i,
										e.next_out = r,
										e.avail_in = i < n ? n - i + 5 : 5 - (i - n),
										e.avail_out = r < s ? s - r + 257 : 257 - (r - s),
										a.hold = m,
										a.bits = g
								}
							},
							{}],
							11: [function (e, t, a) {
								var i = e("../utils/common"),
									n = e("./adler32"),
									r = e("./crc32"),
									o = e("./inffast"),
									s = e("./inftrees"),
									c = 1,
									l = 2,
									d = 0,
									h = -2,
									u = 1,
									m = 852,
									g = 592;
								function p(e) {
									return (e >>> 24 & 255) + (e >>> 8 & 65280) + ((65280 & e) << 8) + ((255 & e) << 24)
								}
								function f() {
									this.mode = 0,
										this.last = !1,
										this.wrap = 0,
										this.havedict = !1,
										this.flags = 0,
										this.dmax = 0,
										this.check = 0,
										this.total = 0,
										this.head = null,
										this.wbits = 0,
										this.wsize = 0,
										this.whave = 0,
										this.wnext = 0,
										this.window = null,
										this.hold = 0,
										this.bits = 0,
										this.length = 0,
										this.offset = 0,
										this.extra = 0,
										this.lencode = null,
										this.distcode = null,
										this.lenbits = 0,
										this.distbits = 0,
										this.ncode = 0,
										this.nlen = 0,
										this.ndist = 0,
										this.have = 0,
										this.next = null,
										this.lens = new i.Buf16(320),
										this.work = new i.Buf16(288),
										this.lendyn = null,
										this.distdyn = null,
										this.sane = 0,
										this.back = 0,
										this.was = 0
								}
								function v(e) {
									var t;
									return e && e.state ? (t = e.state, e.total_in = e.total_out = t.total = 0, e.msg = "", t.wrap && (e.adler = 1 & t.wrap), t.mode = u, t.last = 0, t.havedict = 0, t.dmax = 32768, t.head = null, t.hold = 0, t.bits = 0, t.lencode = t.lendyn = new i.Buf32(m), t.distcode = t.distdyn = new i.Buf32(g), t.sane = 1, t.back = -1, d) : h
								}
								function _(e) {
									var t;
									return e && e.state ? ((t = e.state).wsize = 0, t.whave = 0, t.wnext = 0, v(e)) : h
								}
								function y(e, t) {
									var a, i;
									return e && e.state ? (i = e.state, t < 0 ? (a = 0, t = -t) : (a = 1 + (t >> 4), t < 48 && (t &= 15)), t && (t < 8 || 15 < t) ? h : (null !== i.window && i.wbits !== t && (i.window = null), i.wrap = a, i.wbits = t, _(e))) : h
								}
								function b(e, t) {
									var a, i;
									return e ? (i = new f, (e.state = i).window = null, (a = y(e, t)) !== d && (e.state = null), a) : h
								}
								var S, C, D = !0;
								function w(e) {
									if (D) {
										var t;
										for (S = new i.Buf32(512), C = new i.Buf32(32), t = 0; t < 144;) e.lens[t++] = 8;
										for (; t < 256;) e.lens[t++] = 9;
										for (; t < 280;) e.lens[t++] = 7;
										for (; t < 288;) e.lens[t++] = 8;
										for (s(c, e.lens, 0, 288, S, 0, e.work, {
											bits: 9
										}), t = 0; t < 32;) e.lens[t++] = 5;
										s(l, e.lens, 0, 32, C, 0, e.work, {
											bits: 5
										}),
											D = !1
									}
									e.lencode = S,
										e.lenbits = 9,
										e.distcode = C,
										e.distbits = 5
								}
								function A(e, t, a, n) {
									var r, o = e.state;
									return null === o.window && (o.wsize = 1 << o.wbits, o.wnext = 0, o.whave = 0, o.window = new i.Buf8(o.wsize)),
										n >= o.wsize ? (i.arraySet(o.window, t, a - o.wsize, o.wsize, 0), o.wnext = 0, o.whave = o.wsize) : (n < (r = o.wsize - o.wnext) && (r = n), i.arraySet(o.window, t, a - n, r, o.wnext), (n -= r) ? (i.arraySet(o.window, t, a - n, n, 0), o.wnext = n, o.whave = o.wsize) : (o.wnext += r, o.wnext === o.wsize && (o.wnext = 0), o.whave < o.wsize && (o.whave += r))),
										0
								}
								a.inflateReset = _,
									a.inflateReset2 = y,
									a.inflateResetKeep = v,
									a.inflateInit = function (e) {
										return b(e, 15)
									},
									a.inflateInit2 = b,
									a.inflate = function (e, t) {
										var a, m, g, f, v, _, y, b, S, C, D, M, E, k, I, T, R, N, L, B, P, F, x, U, V = 0,
											O = new i.Buf8(4),
											G = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
										if (!e || !e.state || !e.output || !e.input && 0 !== e.avail_in) return h;
										12 === (a = e.state).mode && (a.mode = 13),
											v = e.next_out,
											g = e.output,
											y = e.avail_out,
											f = e.next_in,
											m = e.input,
											_ = e.avail_in,
											b = a.hold,
											S = a.bits,
											C = _,
											D = y,
											F = d;
										e: for (; ;) switch (a.mode) {
											case u:
												if (0 === a.wrap) {
													a.mode = 13;
													break
												}
												for (; S < 16;) {
													if (0 === _) break e;
													_--,
														b += m[f++] << S,
														S += 8
												}
												if (2 & a.wrap && 35615 === b) {
													O[a.check = 0] = 255 & b,
														O[1] = b >>> 8 & 255,
														a.check = r(a.check, O, 2, 0),
														S = b = 0,
														a.mode = 2;
													break
												}
												if (a.flags = 0, a.head && (a.head.done = !1), !(1 & a.wrap) || (((255 & b) << 8) + (b >> 8)) % 31) {
													e.msg = "incorrect header check",
														a.mode = 30;
													break
												}
												if (8 != (15 & b)) {
													e.msg = "unknown compression method",
														a.mode = 30;
													break
												}
												if (S -= 4, P = 8 + (15 & (b >>>= 4)), 0 === a.wbits) a.wbits = P;
												else if (P > a.wbits) {
													e.msg = "invalid window size",
														a.mode = 30;
													break
												}
												a.dmax = 1 << P,
													e.adler = a.check = 1,
													a.mode = 512 & b ? 10 : 12,
													S = b = 0;
												break;
											case 2:
												for (; S < 16;) {
													if (0 === _) break e;
													_--,
														b += m[f++] << S,
														S += 8
												}
												if (a.flags = b, 8 != (255 & a.flags)) {
													e.msg = "unknown compression method",
														a.mode = 30;
													break
												}
												if (57344 & a.flags) {
													e.msg = "unknown header flags set",
														a.mode = 30;
													break
												}
												a.head && (a.head.text = b >> 8 & 1),
													512 & a.flags && (O[0] = 255 & b, O[1] = b >>> 8 & 255, a.check = r(a.check, O, 2, 0)),
													S = b = 0,
													a.mode = 3;
											case 3:
												for (; S < 32;) {
													if (0 === _) break e;
													_--,
														b += m[f++] << S,
														S += 8
												}
												a.head && (a.head.time = b),
													512 & a.flags && (O[0] = 255 & b, O[1] = b >>> 8 & 255, O[2] = b >>> 16 & 255, O[3] = b >>> 24 & 255, a.check = r(a.check, O, 4, 0)),
													S = b = 0,
													a.mode = 4;
											case 4:
												for (; S < 16;) {
													if (0 === _) break e;
													_--,
														b += m[f++] << S,
														S += 8
												}
												a.head && (a.head.xflags = 255 & b, a.head.os = b >> 8),
													512 & a.flags && (O[0] = 255 & b, O[1] = b >>> 8 & 255, a.check = r(a.check, O, 2, 0)),
													S = b = 0,
													a.mode = 5;
											case 5:
												if (1024 & a.flags) {
													for (; S < 16;) {
														if (0 === _) break e;
														_--,
															b += m[f++] << S,
															S += 8
													}
													a.length = b,
														a.head && (a.head.extra_len = b),
														512 & a.flags && (O[0] = 255 & b, O[1] = b >>> 8 & 255, a.check = r(a.check, O, 2, 0)),
														S = b = 0
												} else a.head && (a.head.extra = null);
												a.mode = 6;
											case 6:
												if (1024 & a.flags && (_ < (M = a.length) && (M = _), M && (a.head && (P = a.head.extra_len - a.length, a.head.extra || (a.head.extra = new Array(a.head.extra_len)), i.arraySet(a.head.extra, m, f, M, P)), 512 & a.flags && (a.check = r(a.check, m, M, f)), _ -= M, f += M, a.length -= M), a.length)) break e;
												a.length = 0,
													a.mode = 7;
											case 7:
												if (2048 & a.flags) {
													if (0 === _) break e;
													for (M = 0; P = m[f + M++], a.head && P && a.length < 65536 && (a.head.name += String.fromCharCode(P)), P && M < _;);
													if (512 & a.flags && (a.check = r(a.check, m, M, f)), _ -= M, f += M, P) break e
												} else a.head && (a.head.name = null);
												a.length = 0,
													a.mode = 8;
											case 8:
												if (4096 & a.flags) {
													if (0 === _) break e;
													for (M = 0; P = m[f + M++], a.head && P && a.length < 65536 && (a.head.comment += String.fromCharCode(P)), P && M < _;);
													if (512 & a.flags && (a.check = r(a.check, m, M, f)), _ -= M, f += M, P) break e
												} else a.head && (a.head.comment = null);
												a.mode = 9;
											case 9:
												if (512 & a.flags) {
													for (; S < 16;) {
														if (0 === _) break e;
														_--,
															b += m[f++] << S,
															S += 8
													}
													if (b !== (65535 & a.check)) {
														e.msg = "header crc mismatch",
															a.mode = 30;
														break
													}
													S = b = 0
												}
												a.head && (a.head.hcrc = a.flags >> 9 & 1, a.head.done = !0),
													e.adler = a.check = 0,
													a.mode = 12;
												break;
											case 10:
												for (; S < 32;) {
													if (0 === _) break e;
													_--,
														b += m[f++] << S,
														S += 8
												}
												e.adler = a.check = p(b),
													S = b = 0,
													a.mode = 11;
											case 11:
												if (0 === a.havedict) return e.next_out = v,
													e.avail_out = y,
													e.next_in = f,
													e.avail_in = _,
													a.hold = b,
													a.bits = S,
													2;
												e.adler = a.check = 1,
													a.mode = 12;
											case 12:
												if (5 === t || 6 === t) break e;
											case 13:
												if (a.last) {
													b >>>= 7 & S,
														S -= 7 & S,
														a.mode = 27;
													break
												}
												for (; S < 3;) {
													if (0 === _) break e;
													_--,
														b += m[f++] << S,
														S += 8
												}
												switch (a.last = 1 & b, S -= 1, 3 & (b >>>= 1)) {
													case 0:
														a.mode = 14;
														break;
													case 1:
														if (w(a), a.mode = 20, 6 !== t) break;
														b >>>= 2,
															S -= 2;
														break e;
													case 2:
														a.mode = 17;
														break;
													case 3:
														e.msg = "invalid block type",
															a.mode = 30
												}
												b >>>= 2,
													S -= 2;
												break;
											case 14:
												for (b >>>= 7 & S, S -= 7 & S; S < 32;) {
													if (0 === _) break e;
													_--,
														b += m[f++] << S,
														S += 8
												}
												if ((65535 & b) != (b >>> 16 ^ 65535)) {
													e.msg = "invalid stored block lengths",
														a.mode = 30;
													break
												}
												if (a.length = 65535 & b, S = b = 0, a.mode = 15, 6 === t) break e;
											case 15:
												a.mode = 16;
											case 16:
												if (M = a.length) {
													if (_ < M && (M = _), y < M && (M = y), 0 === M) break e;
													i.arraySet(g, m, f, M, v),
														_ -= M,
														f += M,
														y -= M,
														v += M,
														a.length -= M;
													break
												}
												a.mode = 12;
												break;
											case 17:
												for (; S < 14;) {
													if (0 === _) break e;
													_--,
														b += m[f++] << S,
														S += 8
												}
												if (a.nlen = 257 + (31 & b), b >>>= 5, S -= 5, a.ndist = 1 + (31 & b), b >>>= 5, S -= 5, a.ncode = 4 + (15 & b), b >>>= 4, S -= 4, 286 < a.nlen || 30 < a.ndist) {
													e.msg = "too many length or distance symbols",
														a.mode = 30;
													break
												}
												a.have = 0,
													a.mode = 18;
											case 18:
												for (; a.have < a.ncode;) {
													for (; S < 3;) {
														if (0 === _) break e;
														_--,
															b += m[f++] << S,
															S += 8
													}
													a.lens[G[a.have++]] = 7 & b,
														b >>>= 3,
														S -= 3
												}
												for (; a.have < 19;) a.lens[G[a.have++]] = 0;
												if (a.lencode = a.lendyn, a.lenbits = 7, x = {
													bits: a.lenbits
												},
													F = s(0, a.lens, 0, 19, a.lencode, 0, a.work, x), a.lenbits = x.bits, F) {
													e.msg = "invalid code lengths set",
														a.mode = 30;
													break
												}
												a.have = 0,
													a.mode = 19;
											case 19:
												for (; a.have < a.nlen + a.ndist;) {
													for (; T = (V = a.lencode[b & (1 << a.lenbits) - 1]) >>> 16 & 255, R = 65535 & V, !((I = V >>> 24) <= S);) {
														if (0 === _) break e;
														_--,
															b += m[f++] << S,
															S += 8
													}
													if (R < 16) b >>>= I,
														S -= I,
														a.lens[a.have++] = R;
													else {
														if (16 === R) {
															for (U = I + 2; S < U;) {
																if (0 === _) break e;
																_--,
																	b += m[f++] << S,
																	S += 8
															}
															if (b >>>= I, S -= I, 0 === a.have) {
																e.msg = "invalid bit length repeat",
																	a.mode = 30;
																break
															}
															P = a.lens[a.have - 1],
																M = 3 + (3 & b),
																b >>>= 2,
																S -= 2
														} else if (17 === R) {
															for (U = I + 3; S < U;) {
																if (0 === _) break e;
																_--,
																	b += m[f++] << S,
																	S += 8
															}
															S -= I,
																P = 0,
																M = 3 + (7 & (b >>>= I)),
																b >>>= 3,
																S -= 3
														} else {
															for (U = I + 7; S < U;) {
																if (0 === _) break e;
																_--,
																	b += m[f++] << S,
																	S += 8
															}
															S -= I,
																P = 0,
																M = 11 + (127 & (b >>>= I)),
																b >>>= 7,
																S -= 7
														}
														if (a.have + M > a.nlen + a.ndist) {
															e.msg = "invalid bit length repeat",
																a.mode = 30;
															break
														}
														for (; M--;) a.lens[a.have++] = P
													}
												}
												if (30 === a.mode) break;
												if (0 === a.lens[256]) {
													e.msg = "invalid code -- missing end-of-block",
														a.mode = 30;
													break
												}
												if (a.lenbits = 9, x = {
													bits: a.lenbits
												},
													F = s(c, a.lens, 0, a.nlen, a.lencode, 0, a.work, x), a.lenbits = x.bits, F) {
													e.msg = "invalid literal/lengths set",
														a.mode = 30;
													break
												}
												if (a.distbits = 6, a.distcode = a.distdyn, x = {
													bits: a.distbits
												},
													F = s(l, a.lens, a.nlen, a.ndist, a.distcode, 0, a.work, x), a.distbits = x.bits, F) {
													e.msg = "invalid distances set",
														a.mode = 30;
													break
												}
												if (a.mode = 20, 6 === t) break e;
											case 20:
												a.mode = 21;
											case 21:
												if (6 <= _ && 258 <= y) {
													e.next_out = v,
														e.avail_out = y,
														e.next_in = f,
														e.avail_in = _,
														a.hold = b,
														a.bits = S,
														o(e, D),
														v = e.next_out,
														g = e.output,
														y = e.avail_out,
														f = e.next_in,
														m = e.input,
														_ = e.avail_in,
														b = a.hold,
														S = a.bits,
														12 === a.mode && (a.back = -1);
													break
												}
												for (a.back = 0; T = (V = a.lencode[b & (1 << a.lenbits) - 1]) >>> 16 & 255, R = 65535 & V, !((I = V >>> 24) <= S);) {
													if (0 === _) break e;
													_--,
														b += m[f++] << S,
														S += 8
												}
												if (T && 0 == (240 & T)) {
													for (N = I, L = T, B = R; T = (V = a.lencode[B + ((b & (1 << N + L) - 1) >> N)]) >>> 16 & 255, R = 65535 & V, !(N + (I = V >>> 24) <= S);) {
														if (0 === _) break e;
														_--,
															b += m[f++] << S,
															S += 8
													}
													b >>>= N,
														S -= N,
														a.back += N
												}
												if (b >>>= I, S -= I, a.back += I, a.length = R, 0 === T) {
													a.mode = 26;
													break
												}
												if (32 & T) {
													a.back = -1,
														a.mode = 12;
													break
												}
												if (64 & T) {
													e.msg = "invalid literal/length code",
														a.mode = 30;
													break
												}
												a.extra = 15 & T,
													a.mode = 22;
											case 22:
												if (a.extra) {
													for (U = a.extra; S < U;) {
														if (0 === _) break e;
														_--,
															b += m[f++] << S,
															S += 8
													}
													a.length += b & (1 << a.extra) - 1,
														b >>>= a.extra,
														S -= a.extra,
														a.back += a.extra
												}
												a.was = a.length,
													a.mode = 23;
											case 23:
												for (; T = (V = a.distcode[b & (1 << a.distbits) - 1]) >>> 16 & 255, R = 65535 & V, !((I = V >>> 24) <= S);) {
													if (0 === _) break e;
													_--,
														b += m[f++] << S,
														S += 8
												}
												if (0 == (240 & T)) {
													for (N = I, L = T, B = R; T = (V = a.distcode[B + ((b & (1 << N + L) - 1) >> N)]) >>> 16 & 255, R = 65535 & V, !(N + (I = V >>> 24) <= S);) {
														if (0 === _) break e;
														_--,
															b += m[f++] << S,
															S += 8
													}
													b >>>= N,
														S -= N,
														a.back += N
												}
												if (b >>>= I, S -= I, a.back += I, 64 & T) {
													e.msg = "invalid distance code",
														a.mode = 30;
													break
												}
												a.offset = R,
													a.extra = 15 & T,
													a.mode = 24;
											case 24:
												if (a.extra) {
													for (U = a.extra; S < U;) {
														if (0 === _) break e;
														_--,
															b += m[f++] << S,
															S += 8
													}
													a.offset += b & (1 << a.extra) - 1,
														b >>>= a.extra,
														S -= a.extra,
														a.back += a.extra
												}
												if (a.offset > a.dmax) {
													e.msg = "invalid distance too far back",
														a.mode = 30;
													break
												}
												a.mode = 25;
											case 25:
												if (0 === y) break e;
												if (M = D - y, a.offset > M) {
													if ((M = a.offset - M) > a.whave && a.sane) {
														e.msg = "invalid distance too far back",
															a.mode = 30;
														break
													}
													M > a.wnext ? (M -= a.wnext, E = a.wsize - M) : E = a.wnext - M,
														M > a.length && (M = a.length),
														k = a.window
												} else k = g,
													E = v - a.offset,
													M = a.length;
												for (y < M && (M = y), y -= M, a.length -= M; g[v++] = k[E++], --M;);
												0 === a.length && (a.mode = 21);
												break;
											case 26:
												if (0 === y) break e;
												g[v++] = a.length,
													y--,
													a.mode = 21;
												break;
											case 27:
												if (a.wrap) {
													for (; S < 32;) {
														if (0 === _) break e;
														_--,
															b |= m[f++] << S,
															S += 8
													}
													if (D -= y, e.total_out += D, a.total += D, D && (e.adler = a.check = a.flags ? r(a.check, g, D, v - D) : n(a.check, g, D, v - D)), D = y, (a.flags ? b : p(b)) !== a.check) {
														e.msg = "incorrect data check",
															a.mode = 30;
														break
													}
													S = b = 0
												}
												a.mode = 28;
											case 28:
												if (a.wrap && a.flags) {
													for (; S < 32;) {
														if (0 === _) break e;
														_--,
															b += m[f++] << S,
															S += 8
													}
													if (b !== (4294967295 & a.total)) {
														e.msg = "incorrect length check",
															a.mode = 30;
														break
													}
													S = b = 0
												}
												a.mode = 29;
											case 29:
												F = 1;
												break e;
											case 30:
												F = -3;
												break e;
											case 31:
												return - 4;
											case 32:
											default:
												return h
										}
										return e.next_out = v,
											e.avail_out = y,
											e.next_in = f,
											e.avail_in = _,
											a.hold = b,
											a.bits = S,
											(a.wsize || D !== e.avail_out && a.mode < 30 && (a.mode < 27 || 4 !== t)) && A(e, e.output, e.next_out, D - e.avail_out) ? (a.mode = 31, -4) : (C -= e.avail_in, D -= e.avail_out, e.total_in += C, e.total_out += D, a.total += D, a.wrap && D && (e.adler = a.check = a.flags ? r(a.check, g, D, e.next_out - D) : n(a.check, g, D, e.next_out - D)), e.data_type = a.bits + (a.last ? 64 : 0) + (12 === a.mode ? 128 : 0) + (20 === a.mode || 15 === a.mode ? 256 : 0), (0 === C && 0 === D || 4 === t) && F === d && (F = -5), F)
									},
									a.inflateEnd = function (e) {
										if (!e || !e.state) return h;
										var t = e.state;
										return t.window && (t.window = null),
											e.state = null,
											d
									},
									a.inflateGetHeader = function (e, t) {
										var a;
										return e && e.state ? 0 == (2 & (a = e.state).wrap) ? h : ((a.head = t).done = !1, d) : h
									},
									a.inflateSetDictionary = function (e, t) {
										var a, i = t.length;
										return e && e.state ? 0 !== (a = e.state).wrap && 11 !== a.mode ? h : 11 === a.mode && n(1, t, i, 0) !== a.check ? -3 : A(e, t, i, i) ? (a.mode = 31, -4) : (a.havedict = 1, d) : h
									},
									a.inflateInfo = "pako inflate (from Nodeca project)"
							},
							{
								"../utils/common": 3,
								"./adler32": 5,
								"./crc32": 7,
								"./inffast": 10,
								"./inftrees": 12
							}],
							12: [function (e, t, a) {
								var i = e("../utils/common"),
									n = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0],
									r = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78],
									o = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0],
									s = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
								t.exports = function (e, t, a, c, l, d, h, u) {
									var m, g, p, f, v, _, y, b, S, C = u.bits,
										D = 0,
										w = 0,
										A = 0,
										M = 0,
										E = 0,
										k = 0,
										I = 0,
										T = 0,
										R = 0,
										N = 0,
										L = null,
										B = 0,
										P = new i.Buf16(16),
										F = new i.Buf16(16),
										x = null,
										U = 0;
									for (D = 0; D <= 15; D++) P[D] = 0;
									for (w = 0; w < c; w++) P[t[a + w]]++;
									for (E = C, M = 15; 1 <= M && 0 === P[M]; M--);
									if (M < E && (E = M), 0 === M) return l[d++] = 20971520,
										l[d++] = 20971520,
										u.bits = 1,
										0;
									for (A = 1; A < M && 0 === P[A]; A++);
									for (E < A && (E = A), D = T = 1; D <= 15; D++) if (T <<= 1, (T -= P[D]) < 0) return - 1;
									if (0 < T && (0 === e || 1 !== M)) return - 1;
									for (F[1] = 0, D = 1; D < 15; D++) F[D + 1] = F[D] + P[D];
									for (w = 0; w < c; w++) 0 !== t[a + w] && (h[F[t[a + w]]++] = w);
									if (0 === e ? (L = x = h, _ = 19) : 1 === e ? (L = n, B -= 257, x = r, U -= 257, _ = 256) : (L = o, x = s, _ = -1), D = A, v = d, I = w = N = 0, p = -1, f = (R = 1 << (k = E)) - 1, 1 === e && 852 < R || 2 === e && 592 < R) return 1;
									for (; ;) {
										for (y = D - I, h[w] < _ ? (b = 0, S = h[w]) : h[w] > _ ? (b = x[U + h[w]], S = L[B + h[w]]) : (b = 96, S = 0), m = 1 << D - I, A = g = 1 << k; l[v + (N >> I) + (g -= m)] = y << 24 | b << 16 | S | 0, 0 !== g;);
										for (m = 1 << D - 1; N & m;) m >>= 1;
										if (0 !== m ? (N &= m - 1, N += m) : N = 0, w++, 0 == --P[D]) {
											if (D === M) break;
											D = t[a + h[w]]
										}
										if (E < D && (N & f) !== p) {
											for (0 === I && (I = E), v += A, T = 1 << (k = D - I); k + I < M && !((T -= P[k + I]) <= 0);) k++,
												T <<= 1;
											if (R += 1 << k, 1 === e && 852 < R || 2 === e && 592 < R) return 1;
											l[p = N & f] = E << 24 | k << 16 | v - d | 0
										}
									}
									return 0 !== N && (l[v + N] = D - I << 24 | 64 << 16 | 0),
										u.bits = E,
										0
								}
							},
							{
								"../utils/common": 3
							}],
							13: [function (e, t, a) {
								t.exports = {
									2: "need dictionary",
									1: "stream end",
									0: "",
									"-1": "file error",
									"-2": "stream error",
									"-3": "data error",
									"-4": "insufficient memory",
									"-5": "buffer error",
									"-6": "incompatible version"
								}
							},
							{}],
							14: [function (e, t, a) {
								var i = e("../utils/common");
								function n(e) {
									for (var t = e.length; 0 <= --t;) e[t] = 0
								}
								var r = 0,
									o = 256,
									s = o + 1 + 29,
									c = 30,
									l = 19,
									d = 2 * s + 1,
									h = 15,
									u = 16,
									m = 256,
									g = 16,
									p = 17,
									f = 18,
									v = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0],
									_ = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13],
									y = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7],
									b = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15],
									S = new Array(2 * (s + 2));
								n(S);
								var C = new Array(2 * c);
								n(C);
								var D = new Array(512);
								n(D);
								var w = new Array(256);
								n(w);
								var A = new Array(29);
								n(A);
								var M, E, k, I = new Array(c);
								function T(e, t, a, i, n) {
									this.static_tree = e,
										this.extra_bits = t,
										this.extra_base = a,
										this.elems = i,
										this.max_length = n,
										this.has_stree = e && e.length
								}
								function R(e, t) {
									this.dyn_tree = e,
										this.max_code = 0,
										this.stat_desc = t
								}
								function N(e) {
									return e < 256 ? D[e] : D[256 + (e >>> 7)]
								}
								function L(e, t) {
									e.pending_buf[e.pending++] = 255 & t,
										e.pending_buf[e.pending++] = t >>> 8 & 255
								}
								function B(e, t, a) {
									e.bi_valid > u - a ? (e.bi_buf |= t << e.bi_valid & 65535, L(e, e.bi_buf), e.bi_buf = t >> u - e.bi_valid, e.bi_valid += a - u) : (e.bi_buf |= t << e.bi_valid & 65535, e.bi_valid += a)
								}
								function P(e, t, a) {
									B(e, a[2 * t], a[2 * t + 1])
								}
								function F(e, t) {
									for (var a = 0; a |= 1 & e, e >>>= 1, a <<= 1, 0 < --t;);
									return a >>> 1
								}
								function x(e, t, a) {
									var i, n, r = new Array(h + 1),
										o = 0;
									for (i = 1; i <= h; i++) r[i] = o = o + a[i - 1] << 1;
									for (n = 0; n <= t; n++) {
										var s = e[2 * n + 1];
										0 !== s && (e[2 * n] = F(r[s]++, s))
									}
								}
								function U(e) {
									var t;
									for (t = 0; t < s; t++) e.dyn_ltree[2 * t] = 0;
									for (t = 0; t < c; t++) e.dyn_dtree[2 * t] = 0;
									for (t = 0; t < l; t++) e.bl_tree[2 * t] = 0;
									e.dyn_ltree[2 * m] = 1,
										e.opt_len = e.static_len = 0,
										e.last_lit = e.matches = 0
								}
								function V(e) {
									8 < e.bi_valid ? L(e, e.bi_buf) : 0 < e.bi_valid && (e.pending_buf[e.pending++] = e.bi_buf),
										e.bi_buf = 0,
										e.bi_valid = 0
								}
								function O(e, t, a, i) {
									var n = 2 * t,
										r = 2 * a;
									return e[n] < e[r] || e[n] === e[r] && i[t] <= i[a]
								}
								function G(e, t, a) {
									for (var i = e.heap[a], n = a << 1; n <= e.heap_len && (n < e.heap_len && O(t, e.heap[n + 1], e.heap[n], e.depth) && n++, !O(t, i, e.heap[n], e.depth));) e.heap[a] = e.heap[n],
										a = n,
										n <<= 1;
									e.heap[a] = i
								}
								function H(e, t, a) {
									var i, n, r, s, c = 0;
									if (0 !== e.last_lit) for (; i = e.pending_buf[e.d_buf + 2 * c] << 8 | e.pending_buf[e.d_buf + 2 * c + 1], n = e.pending_buf[e.l_buf + c], c++, 0 === i ? P(e, n, t) : (P(e, (r = w[n]) + o + 1, t), 0 !== (s = v[r]) && B(e, n -= A[r], s), P(e, r = N(--i), a), 0 !== (s = _[r]) && B(e, i -= I[r], s)), c < e.last_lit;);
									P(e, m, t)
								}
								function W(e, t) {
									var a, i, n, r = t.dyn_tree,
										o = t.stat_desc.static_tree,
										s = t.stat_desc.has_stree,
										c = t.stat_desc.elems,
										l = -1;
									for (e.heap_len = 0, e.heap_max = d, a = 0; a < c; a++) 0 !== r[2 * a] ? (e.heap[++e.heap_len] = l = a, e.depth[a] = 0) : r[2 * a + 1] = 0;
									for (; e.heap_len < 2;) r[2 * (n = e.heap[++e.heap_len] = l < 2 ? ++l : 0)] = 1,
										e.depth[n] = 0,
										e.opt_len--,
										s && (e.static_len -= o[2 * n + 1]);
									for (t.max_code = l, a = e.heap_len >> 1; 1 <= a; a--) G(e, r, a);
									for (n = c; a = e.heap[1], e.heap[1] = e.heap[e.heap_len--], G(e, r, 1), i = e.heap[1], e.heap[--e.heap_max] = a, e.heap[--e.heap_max] = i, r[2 * n] = r[2 * a] + r[2 * i], e.depth[n] = (e.depth[a] >= e.depth[i] ? e.depth[a] : e.depth[i]) + 1, r[2 * a + 1] = r[2 * i + 1] = n, e.heap[1] = n++, G(e, r, 1), 2 <= e.heap_len;);
									e.heap[--e.heap_max] = e.heap[1],
										function (e, t) {
											var a, i, n, r, o, s, c = t.dyn_tree,
												l = t.max_code,
												u = t.stat_desc.static_tree,
												m = t.stat_desc.has_stree,
												g = t.stat_desc.extra_bits,
												p = t.stat_desc.extra_base,
												f = t.stat_desc.max_length,
												v = 0;
											for (r = 0; r <= h; r++) e.bl_count[r] = 0;
											for (c[2 * e.heap[e.heap_max] + 1] = 0, a = e.heap_max + 1; a < d; a++) f < (r = c[2 * c[2 * (i = e.heap[a]) + 1] + 1] + 1) && (r = f, v++),
												c[2 * i + 1] = r,
												l < i || (e.bl_count[r]++, o = 0, p <= i && (o = g[i - p]), s = c[2 * i], e.opt_len += s * (r + o), m && (e.static_len += s * (u[2 * i + 1] + o)));
											if (0 !== v) {
												do {
													for (r = f - 1; 0 === e.bl_count[r];) r--;
													e.bl_count[r]--, e.bl_count[r + 1] += 2, e.bl_count[f]--, v -= 2
												} while (0 < v);
												for (r = f; 0 !== r; r--) for (i = e.bl_count[r]; 0 !== i;) l < (n = e.heap[--a]) || (c[2 * n + 1] !== r && (e.opt_len += (r - c[2 * n + 1]) * c[2 * n], c[2 * n + 1] = r), i--)
											}
										}(e, t),
										x(r, l, e.bl_count)
								}
								function q(e, t, a) {
									var i, n, r = -1,
										o = t[1],
										s = 0,
										c = 7,
										l = 4;
									for (0 === o && (c = 138, l = 3), t[2 * (a + 1) + 1] = 65535, i = 0; i <= a; i++) n = o,
										o = t[2 * (i + 1) + 1],
										++s < c && n === o || (s < l ? e.bl_tree[2 * n] += s : 0 !== n ? (n !== r && e.bl_tree[2 * n]++, e.bl_tree[2 * g]++) : s <= 10 ? e.bl_tree[2 * p]++ : e.bl_tree[2 * f]++, r = n, (s = 0) === o ? (c = 138, l = 3) : n === o ? (c = 6, l = 3) : (c = 7, l = 4))
								}
								function j(e, t, a) {
									var i, n, r = -1,
										o = t[1],
										s = 0,
										c = 7,
										l = 4;
									for (0 === o && (c = 138, l = 3), i = 0; i <= a; i++) if (n = o, o = t[2 * (i + 1) + 1], !(++s < c && n === o)) {
										if (s < l) for (; P(e, n, e.bl_tree), 0 != --s;);
										else 0 !== n ? (n !== r && (P(e, n, e.bl_tree), s--), P(e, g, e.bl_tree), B(e, s - 3, 2)) : s <= 10 ? (P(e, p, e.bl_tree), B(e, s - 3, 3)) : (P(e, f, e.bl_tree), B(e, s - 11, 7));
										r = n,
											(s = 0) === o ? (c = 138, l = 3) : n === o ? (c = 6, l = 3) : (c = 7, l = 4)
									}
								}
								n(I);
								var z = !1;
								function X(e, t, a, n) {
									var o, s, c;
									B(e, (r << 1) + (n ? 1 : 0), 3),
										s = t,
										c = a,
										V(o = e),
										L(o, c),
										L(o, ~c),
										i.arraySet(o.pending_buf, o.window, s, c, o.pending),
										o.pending += c
								}
								a._tr_init = function (e) {
									z || (function () {
										var e, t, a, i, n, r = new Array(h + 1);
										for (i = a = 0; i < 28; i++) for (A[i] = a, e = 0; e < 1 << v[i]; e++) w[a++] = i;
										for (w[a - 1] = i, i = n = 0; i < 16; i++) for (I[i] = n, e = 0; e < 1 << _[i]; e++) D[n++] = i;
										for (n >>= 7; i < c; i++) for (I[i] = n << 7, e = 0; e < 1 << _[i] - 7; e++) D[256 + n++] = i;
										for (t = 0; t <= h; t++) r[t] = 0;
										for (e = 0; e <= 143;) S[2 * e + 1] = 8,
											e++,
											r[8]++;
										for (; e <= 255;) S[2 * e + 1] = 9,
											e++,
											r[9]++;
										for (; e <= 279;) S[2 * e + 1] = 7,
											e++,
											r[7]++;
										for (; e <= 287;) S[2 * e + 1] = 8,
											e++,
											r[8]++;
										for (x(S, s + 1, r), e = 0; e < c; e++) C[2 * e + 1] = 5,
											C[2 * e] = F(e, 5);
										M = new T(S, v, o + 1, s, h),
											E = new T(C, _, 0, c, h),
											k = new T(new Array(0), y, 0, l, 7)
									}(), z = !0),
										e.l_desc = new R(e.dyn_ltree, M),
										e.d_desc = new R(e.dyn_dtree, E),
										e.bl_desc = new R(e.bl_tree, k),
										e.bi_buf = 0,
										e.bi_valid = 0,
										U(e)
								},
									a._tr_stored_block = X,
									a._tr_flush_block = function (e, t, a, i) {
										var n, r, s = 0;
										0 < e.level ? (2 === e.strm.data_type && (e.strm.data_type = function (e) {
											var t, a = 4093624447;
											for (t = 0; t <= 31; t++, a >>>= 1) if (1 & a && 0 !== e.dyn_ltree[2 * t]) return 0;
											if (0 !== e.dyn_ltree[18] || 0 !== e.dyn_ltree[20] || 0 !== e.dyn_ltree[26]) return 1;
											for (t = 32; t < o; t++) if (0 !== e.dyn_ltree[2 * t]) return 1;
											return 0
										}(e)), W(e, e.l_desc), W(e, e.d_desc), s = function (e) {
											var t;
											for (q(e, e.dyn_ltree, e.l_desc.max_code), q(e, e.dyn_dtree, e.d_desc.max_code), W(e, e.bl_desc), t = l - 1; 3 <= t && 0 === e.bl_tree[2 * b[t] + 1]; t--);
											return e.opt_len += 3 * (t + 1) + 5 + 5 + 4,
												t
										}(e), n = e.opt_len + 3 + 7 >>> 3, (r = e.static_len + 3 + 7 >>> 3) <= n && (n = r)) : n = r = a + 5,
											a + 4 <= n && -1 !== t ? X(e, t, a, i) : 4 === e.strategy || r === n ? (B(e, 2 + (i ? 1 : 0), 3), H(e, S, C)) : (B(e, 4 + (i ? 1 : 0), 3),
												function (e, t, a, i) {
													var n;
													for (B(e, t - 257, 5), B(e, a - 1, 5), B(e, i - 4, 4), n = 0; n < i; n++) B(e, e.bl_tree[2 * b[n] + 1], 3);
													j(e, e.dyn_ltree, t - 1),
														j(e, e.dyn_dtree, a - 1)
												}(e, e.l_desc.max_code + 1, e.d_desc.max_code + 1, s + 1), H(e, e.dyn_ltree, e.dyn_dtree)),
											U(e),
											i && V(e)
									},
									a._tr_tally = function (e, t, a) {
										return e.pending_buf[e.d_buf + 2 * e.last_lit] = t >>> 8 & 255,
											e.pending_buf[e.d_buf + 2 * e.last_lit + 1] = 255 & t,
											e.pending_buf[e.l_buf + e.last_lit] = 255 & a,
											e.last_lit++,
											0 === t ? e.dyn_ltree[2 * a]++ : (e.matches++, t--, e.dyn_ltree[2 * (w[a] + o + 1)]++, e.dyn_dtree[2 * N(t)]++),
											e.last_lit === e.lit_bufsize - 1
									},
									a._tr_align = function (e) {
										var t;
										B(e, 2, 3),
											P(e, m, S),
											16 === (t = e).bi_valid ? (L(t, t.bi_buf), t.bi_buf = 0, t.bi_valid = 0) : 8 <= t.bi_valid && (t.pending_buf[t.pending++] = 255 & t.bi_buf, t.bi_buf >>= 8, t.bi_valid -= 8)
									}
							},
							{
								"../utils/common": 3
							}],
							15: [function (e, t, a) {
								t.exports = function () {
									this.input = null,
										this.next_in = 0,
										this.avail_in = 0,
										this.total_in = 0,
										this.output = null,
										this.next_out = 0,
										this.avail_out = 0,
										this.total_out = 0,
										this.msg = "",
										this.state = null,
										this.data_type = 2,
										this.adler = 0
								}
							},
							{}],
							"/": [function (e, t, a) {
								var i = {}; (0, e("./lib/utils/common").assign)(i, e("./lib/deflate"), e("./lib/inflate"), e("./lib/zlib/constants")),
									t.exports = i
							},
							{
								"./lib/deflate": 1,
								"./lib/inflate": 2,
								"./lib/utils/common": 3,
								"./lib/zlib/constants": 6
							}]
						},
							{},
							[])("/")
					}),
					cc._RF.pop()
		}).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
	},
	{}],
	"server-util": [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "ce88etlBqZGUIku6l13+lqU", "server-util");
		var i = e("http-client"),
			n = e("instant-util"),
			r = e("analytics-data");
		e("globalManager"),
			function () {
				if (window.server_util) t.exports = window.server_util;
				else {
					var e = e || {},
						a = /^192\..*|localhost/.exec(location.hostname),
						o = globalManager.appId;
					if (console.log("host=" + location.hostname + " isLocal=" + a + " isRelease=" + !0 + " appId=" + o), !a) globalManager.appid_reg.exec(location.href) || (o = location.hostname.replace(/[^0-9]/gi, ""), console.log("current appid = " + o));
					e.serverIp = "https://fbgame.ymnsdk.com/",
						e.serverPort = 5014;
					var s, c = 0;
					e.login = function (t, a, n, l) {
						setInterval(function () {
							c++,
								r.stay_time_length_event(c)
						},
							6e4),
							s = a,
							globalManager.fbPlayerId = a;
						var d = {
							user_id: s,
							nickname: t,
							app_id: o,
							avatar: n
						};
						r.sever_login_event(),
							i.httpPostRequest(e.serverIp + "user/login", d,
								function (t) {
									r.sever_login_success_event(),
										globalManager.loginTime = Math.floor(Date.parse(new Date) / 1e3),
										globalManager.serverLoginTime = Math.floor(parseInt(t.server_time) / 1e3),
										globalManager.serverResetTime = Math.floor(parseInt(t.reset_time) / 1e3),
										globalManager.isBlackList = !!t.in_black && 1 == t.in_black,
										e.publicConfig(function (e) {
											e && e.config && (console.log("load publicConfig from server."), globalManager.publicConfig = e.config, e.config.videoMax && (globalManager.videoMax = e.config.videoMax), cc.sys.localStorage.setItem("publicConfig", JSON.stringify(e))),
												cc.director.emit("LoadAnimOver")
										}),
										globalManager.setShareConfig(),
										null != t.force_data && (null != t.force_data.resetData ? window.setTimeout(function (e) {
											console.log("pomelo.on(resetData)"),
												cc.director.emit("resetData")
										},
											100) : window.setTimeout(function (e) {
												console.log("pomelo.on(forceUpdateData) data = ", t.force_data),
													cc.director.emit("forceUpdateData", t.force_data)
											},
												100)),
										l && l()
								},
								function () { }),
							i.httpPostRequest(e.serverIp + "game/list", d,
								function (e) {
									null != e.list && (globalManager.gamelist = e.list)
								},
								function () { })
					},
						e.relogin = function (e, t) { },
						e.queryEntry = function (e, t) { },
						e.setGameData = function (e, t, a) { },
						e.getGameData = function (e, t) { },
						e.getGameList = function (t, a) {
							i.httpPostRequest(e.serverIp + "game/list", {
								user_id: n.getPlayerID(),
								app_id: o,
								type: t
							},
								function (e) {
									a && a(e)
								},
								function () { })
						},
						e.setLeaderboardScore = function (t, a) {
							var r = {
								user_id: n.getPlayerID(),
								app_id: o,
								point: t,
								user_level: globalManager.getNumData("UnlockLevel")
							};
							i.httpPostRequest(e.serverIp + "user/setInfo", r,
								function (e) {
									a && a()
								},
								function () { })
						},
						e.getLeaderboard = function (e, t, a) { },
						e.getRankFriendData = function (e, t) {
							var a = !1;
							0 != globalManager.RankFriendData.length && (t && t(globalManager.RankFriendData), a = !0),
								this.getFrinedsLeaderboard(e,
									function (e) {
										e && (globalManager.RankFriendData = e, 0 == a && t && t(globalManager.RankFriendData))
									})
						},
						e.getFrinedsLeaderboard = function (t, a) {
							for (var n = [], r = t.length - 1; r >= 0; r--) n.push(t[r].id);
							var s = {
								friends: n,
								app_id: o,
								type: "point,user_level"
							};
							i.httpPostRequest(e.serverIp + "rank/friend", s,
								function (e) {
									if ("{}" != JSON.stringify(e)) {
										for (var t = 0; t < e.length; t++) e[t].score = e[t].point,
											console.log("data[i].score==" + e[t].score),
											e[t].id = e[t].user_id,
											e[t].name = e[t].nickname,
											e[t].photo = e[t].avatar;
										e.sort(function (e, t) {
											return t.score - e.score
										}),
											a && a(e)
									} else a && a([])
								},
								function () { })
						},
						e.getDataConfig = function (e, t) { },
						e.saveInviter = function (t, a, r) {
							i.httpPostRequest(e.serverIp + "activity/invite", {
								user_id: n.getPlayerID(),
								app_id: o,
								invite_id: t,
								group_id: a
							},
								function (e) {
									r && r(e)
								},
								function () { })
						},
						e.getActivityList = function (t, a, r) {
							i.httpPostRequest(e.serverIp + "activity/list", {
								user_id: n.getPlayerID(),
								app_id: o,
								platform: r
							},
								function (e) {
									"{}" != JSON.stringify(e) ? t && t(e) : t && t([])
								},
								function (e) {
									a && a(e)
								})
						},
						e.receiveTask = function (t, a) {
							i.httpPostRequest(e.serverIp + "activity/receive", {
								user_id: n.getPlayerID(),
								app_id: o,
								task_id: t
							},
								function (e) {
									a && a(e)
								},
								function () { })
						},
						e.publicConfig = function (t) {
							i.httpPostRequest(e.serverIp + "public/config", {
								app_id: o
							},
								function (e) {
									t && t(e)
								},
								function () { })
						},
						e.friendHelp = function (t, a, r, s) {
							i.httpPostRequest(e.serverIp + "activity/friendsHelp", {
								user_id: n.getPlayerID(),
								app_id: o,
								friend_id: t,
								group_id: r,
								task_id: a
							},
								function (e) {
									s && s(e)
								},
								function () { })
						},
						e.shareList = function (t) {
							i.httpPostRequest(e.serverIp + "share/list", {
								app_id: o
							},
								function (e) {
									t && t(e)
								},
								function () { })
						},
						e.switchGame = function (t, a, r) {
							i.httpPostRequest(e.serverIp + "/uc/activity/switchGameNotify", {
								user_id: n.getPlayerID(),
								app_id: o,
								task_id: t,
								game_id: a,
								game_user_id: r
							},
								function () { },
								function () { })
						},
						e.getSlaveList = function (t, a) {
							i.httpPostRequest(e.serverIp + "/activity/slave/list", {
								user_id: n.getPlayerID(),
								app_id: o,
								friends: t
							},
								function (e) {
									a && a(e)
								},
								function () { })
						},
						e.getEnemyList = function (t) {
							i.httpPostRequest(e.serverIp + "/activity/slave/enemy", {
								user_id: n.getPlayerID(),
								app_id: o
							},
								function (e) {
									t && t(e)
								},
								function () { })
						},
						e.catchSlave = function (t, a) {
							i.httpPostRequest(e.serverIp + "/activity/slave/catch", {
								user_id: n.getPlayerID(),
								app_id: o,
								slave_id: t
							},
								function (e) {
									a && a(e)
								},
								function () { })
						},
						e.saveSlave = function (t, a) {
							i.httpPostRequest(e.serverIp + "/activity/slave/save", {
								user_id: n.getPlayerID(),
								app_id: o,
								slave_id: t
							},
								function (e) {
									a && a(e)
								},
								function () { })
						},
						e.getOwnerInfo = function (t) {
							console.log("getOwnerInfo"),
								i.httpPostRequest(e.serverIp + "/activity/slave/ownerInfo", {
									user_id: n.getPlayerID(),
									app_id: o
								},
									function (e) {
										t && t(e)
									},
									function () { })
						},
						window.server_util = e,
						t.exports = e
				}
			}(),
			cc._RF.pop()
	},
	{
		"analytics-data": "analytics-data",
		globalManager: "globalManager",
		"http-client": "http-client",
		"instant-util": "instant-util"
	}],
	videoConfirm: [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "9cf92lq2PlDD79TpVEF/d98", "videoConfirm");
		var i = e("number-util");
		cc.Class({
			extends: cc.Component,
			properties: {
				adsLabel: cc.Label,
				adsButton: cc.Button,
				timecd: 0
			},
			onLoad: function () {
				var e = cc.view.getFrameSize(),
					t = 1334 * e.width / 750 / e.height;
				this.node.scale = t > 1 ? 1 : t
			},
			update: function (e) {
				this.timecd > 0 ? (this.timecd -= e, 1 == this.adsButton.interactable && (this.adsButton.interactable = !1, this.adsButton.node.color = cc.color(120, 120, 120)), this.adsLabel.string = i.millisecondToTime(1e3 * this.timecd)) : 0 == this.adsButton.interactable && (this.adsButton.interactable = !0, this.adsLabel.string = "Watch", this.adsButton.node.color = cc.color(30, 145, 225))
			},
			setData: function (e, t) {
				this.callFunc = e,
					this.timecd = Math.floor(t / 1e3),
					this.timecd > 0 && (this.adsButton.node.color = cc.color(120, 120, 120))
			},
			clickClose: function () {
				this.node.removeFromParent(!0)
			},
			clickConfirm: function () {
				this.callFunc && this.callFunc(),
					this.node.removeFromParent(!0)
			}
		}),
			cc._RF.pop()
	},
	{
		"number-util": "number-util"
	}],
	"webimg-util": [function (e, t, a) {
		"use strict";
		cc._RF.push(t, "e9408HTKmxDZ757t1SrY82R", "webimg-util");
		var i = {};
		t.exports = {
			load_webimg: function (e, t) {
				if (i[e]) return t.spriteFrame = new cc.SpriteFrame(i[e]),
					t.type = cc.Sprite.Type.SIMPLE,
					t.sizeMode = cc.Sprite.SizeMode.CUSTOM,
					0;
				cc.loader.load({
					url: e,
					type: "png"
				},
					function (a, n) {
						return a ? (console.log("load head img err: " + JSON.stringify(a)), a) : (i[e] = n, t.spriteFrame = new cc.SpriteFrame(n), t.type = cc.Sprite.Type.SIMPLE, t.sizeMode = cc.Sprite.SizeMode.CUSTOM, 0)
					})
			},
			load_webimg_cache: function (e) {
				return null == e || "" == e ? 0 : i[e] ? 0 : void cc.loader.load({
					url: e,
					type: "png"
				},
					function (t, a) {
						return t ? (console.log("load head img err: " + JSON.stringify(t)), t) : (i[e] = a, 0)
					})
			},
			getBase64: function (e, t, a, i) {
				window.URL = window.URL || window.webkitURL;
				var n = new XMLHttpRequest;
				n.open("get", e, !0),
					n.responseType = "blob",
					n.onload = function () {
						if (200 == this.status) {
							var e = this.response,
								n = new FileReader;
							n.onloadend = function (e) {
								var a = e.target.result;
								t && t(a, i)
							},
								n.readAsDataURL(e)
						} else a && a(i)
					},
					n.send()
			},
			getImgBase64: function () {
				var e = cc.find("Canvas/screenshot").getComponent(cc.Sprite),
					t = new cc.RenderTexture(960, 640);
				t.begin(),
					e._sgNode.visit(),
					t.end();
				var a = document.createElement("canvas"),
					i = a.getContext("2d");
				if (a.width = 960, a.height = 640, cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
					var n = t.getSprite().getTexture().getHtmlElementObj();
					i.drawImage(n, 0, 0)
				} else if (cc._renderType === cc.game.RENDER_TYPE_WEBGL) {
					var r = gl.createFramebuffer();
					gl.bindFramebuffer(gl.FRAMEBUFFER, r);
					var o = t.getSprite().getTexture()._glID;
					gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, o, 0);
					var s = new Uint8Array(2457600);
					gl.readPixels(0, 0, 960, 640, gl.RGBA, gl.UNSIGNED_BYTE, s),
						gl.bindFramebuffer(gl.FRAMEBUFFER, null);
					for (var c = 0; c < 640; c++) {
						var l = 639 - c,
							d = new Uint8ClampedArray(s.buffer, 960 * l * 4, 3840),
							h = new ImageData(d, 960, 1);
						i.putImageData(h, 0, c)
					}
				}
				return a.toDataURL("image/png")
			}
		},
			cc._RF.pop()
	},
	{}]
},
	{},
	["Cfg_AllMines", "Cfg_ElevatorConsumeCoefficient", "Cfg_ElevatorOverview", "Cfg_ElevatorPowerCoefficient", "Cfg_ElevatorPowerUp", "Cfg_ElevatorSpeed", "Cfg_GameConst", "Cfg_Item", "Cfg_Manager", "Cfg_ManagerFixedRecruit", "Cfg_ManagerName", "Cfg_ManagerRecruitCost", "Cfg_Prestige", "Cfg_SeamMine", "Cfg_SeamMoveSpeed", "Cfg_SeamPowerUp", "Cfg_SeamWorkerNum", "Cfg_Shop", "Cfg_Sign", "Cfg_StoreConsumeCoefficient", "Cfg_StoreMoveSpeed", "Cfg_StoreOverview", "Cfg_StorePowerCoefficient", "Cfg_StorePowerUp", "Cfg_StoreWorkerNum", "Cfg_String", "Cfg_headers", "Example", "ExampleListViewItem", "FrameEvent", "CfgApi", "CfgMgr", "IdleCashMgr", "ItemMgr", "UserData", "CashAddListViewItem", "DialogCashAdd", "DialogDebug", "DialogGood", "DialogIdleReward", "DialogItem", "DialogPrestige", "DialogPrestigeSuccess", "DialogSyncData", "SyncCashItem", "BaseDialog", "Boost", "BoostAd", "BoostBoosts", "BoostOverView", "BoostsActiveItem", "BoostsItem", "CommonDialog", "InfoDetails", "InfoShaft", "InfoShaftListItem", "InfoStats", "InfoStatsItem", "InfoStatsSeam", "DialogSign", "SignItem", "SignListViewItem", "Toast", "Blink", "Breathe", "ChildrenZIndex", "ColorFollow", "Flow", "RandomSprite", "RotateShake", "Scale", "WeightActive", "AdVideoButton", "ButtonUnclickableAudio", "EngineExtensions", "ListView", "ListViewItem", "NumberData", "PolygonHit", "ResolutionCanvas", "SwitchButton", "ThemeFallen", "ThemeSprite", "UI", "algo", "encryptjs", "pako", "Framework", "ViewMgr", "Ad", "AdsManager", "AndroidAd", "BaiduAd", "BaseAd", "ByteDanceAd", "FacebookAd", "H5Ad", "IOSAd", "QuickGameAd", "SDKBoxAds", "UPLTVAd", "WeChatAd", "UPLTV", "UPLTVAndroid", "UPLTVIos", "Analysis", "Adsforce", "AdsforceAndroid", "AdsforceIos", "AndroidAnalysis", "BaseAnalysis", "FBAnalysis", "FBAndroid", "FBIos", "FacebookAnalysis", "H5Analysis", "DataStore", "AndroidDataStore", "BaiduDataStore", "BaseDataStore", "ByteDanceDataStore", "FacebookDataStore", "H5DataStore", "IOSDataStore", "QuickGameDataStore", "WeChatDataStore", "EasyEvent", "ErrorHandler", "AndroidErrorHandler", "BaiduErrorHandler", "BaseErrorHandler", "ByteDanceErrorHandler", "FacebookErrorHandler", "H5ErrorHandler", "IOSErrorHandler", "QuickGameErrorHandler", "WeChatErrorHandler", "Localize", "LocalizeLabel", "LocalizeSprite", "Music", "Pay", "BasePay", "H5Pay", "Platform", "AndroidPlatform", "BaiduPlatform", "BasePlatform", "ByteDancePlatform", "FacebookPlatform", "H5Platform", "IOSPlatform", "QuickGamePlatform", "WeChatPlatform", "AddCoinAni", "BtnUpgrade", "DialogCusShare", "DialogLevelUp", "DialogManager", "DialogShare", "GoldAni", "ManagerItem", "PrisonerManager", "ShareItem", "DataCenter", "Cabin", "Elevator", "ElevatorCashInfo", "FriendInfo", "FriendInfoItem", "PrestigeTipButton", "SeamLiveBackground", "SeamLivePlane", "StaticMargin", "NewSeamChecker", "Seam", "SeamBackground", "SeamLayerBarrier", "SeamLayerLock", "SeamLayerRoom", "SeamLayerRoot", "SeamLogicWorker", "SeamRenderWorker", "PrisonerCar", "StoreHouse", "Tutorial", "Constant", "analytics-data", "fbinstant-util", "globalManager", "http-client", "instant-util", "md5", "number-util", "server-util", "webimg-util", "BaseLayer", "GameLayer", "DialogMineDetail", "MapCashItem", "MapRedInfo", "MineDetailItem", "MinePlaceholder", "MineSelector", "VirtualAdLayer", "WorldMapLayer", "Game", "Intro", "MD5", "StringCompress", "Tools", "videoConfirm"]);
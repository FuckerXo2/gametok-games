function parsePkGameScenes(pk_game_scenes, index, defauleValue) {
	if (pk_game_scenes === null || pk_game_scenes === undefined) {return defaule;} 

    let layoutId = defauleValue;
    try {
        // 解析pk_game_scenes：如果是字符串,则解析为json，如果已经是json则获取第一个
        let scenesData = pk_game_scenes;
        
        // 如果是字符串，尝试解析为JSON
        if (typeof scenesData === 'string' && scenesData.length > 0) {
            try {
                scenesData = JSON.parse(scenesData);
            } catch (e) {
                console.error('解析pk_game_scenes字符串失败:', e);
                // 解析失败时使用默认值
            }
        }
        
        // 如果是数组且有元素，使用第一个元素
        if (Array.isArray(scenesData) && scenesData.length > index) {
            scenesData = scenesData[index];
        }
        
        // 如果是对象且有layoutId属性，使用该值
        if (typeof scenesData === 'object' && scenesData !== null && typeof scenesData.layoutId !== 'undefined') {
            layoutId = scenesData.layoutId;
        }
        // 如果传入的就是数字，直接使用
        else if (typeof scenesData === 'number') {
            layoutId = scenesData;
        }
    } catch (error) {
        console.error('处理pk_game_scenes时出错:', error);
    }

	return layoutId;
}

function handleGotoScene(runtime, layoutId) {
	console.log("handleGotoScene, goto:", layoutId);
	if (layoutId === null || layoutId === undefined) {
		return;
	}
	runtime.goToLayout(layoutId);
}

function setPKStatus(runtime, object_Names, pk_status, global_values) { 
	if (!object_Names && !global_values) {
		return;
	}
	// 1. 解析object_Names：如果是字符串, "name1,name2,name3" 则解析为数组	
    let objectNames = object_Names;
    try {
        // 如果是字符串，尝试解析为JSON
		objectNames = objectNames.split(',');
		console.log("object_Names:", objectNames);
		if (objectNames.length > 0) {
			for (const objTypeName in runtime.objects) {
				const objType = runtime.objects[objTypeName];
				if (!objType || !objType.getAllInstances) {
					continue;
				}

				for (let index = 0; index < objectNames.length; index++) {
					const element = objectNames[index];
					if (objType.name == element) {
						const allInstances = objType.getAllInstances();
						// 4. 遍历实例，筛选出需要移动的（非锚定且在当前场景的实例）
						allInstances.forEach((instance) => {
							console.log("Home:", instance);
							instance.isVisible = !pk_status;
						});
					}
				}
			}
		}
		
		const globalVars = global_values.split(',');
		if (globalVars.length > 0) {
			for (let index = 0; index < globalVars.length; index++) {
				const element = globalVars[index];
				if (element) {
					runtime.globalVars[element] = 0;
				}
			}
		}
    } catch (error) {
        console.error('处理setPKStatus时出错:', error);
    }
}

function handleGameStart(runtime, pk_game_scenes, object_Names, global_values) {
    console.log("handleGameStart, pk_game_scenes:", pk_game_scenes, object_Names);
	const layoutId = parsePkGameScenes(pk_game_scenes, 0, 1);
    handleGotoScene(runtime, layoutId);
    enableAllSounds(runtime);
	setPKStatus(runtime, object_Names, true, global_values);
};

function handleGameOver(runtime, pk_game_scenes, object_Names, global_values) {
	console.log("handleGameOver, pk_game_scenes:", pk_game_scenes, object_Names);
	const layoutId = parsePkGameScenes(pk_game_scenes, 1, 2);
    handleGotoScene(runtime, layoutId);
	disableAllSounds(runtime);
	setPKStatus(runtime, object_Names, false, global_values);
};

function handleGameOverByGame(runtime, pk_game_scenes, object_Names, global_values) {
	console.log("handleGameOverByGame, pk_game_scenes:", pk_game_scenes, object_Names);
	disableAllSounds(runtime);
	setPKStatus(runtime, object_Names, false, global_values);
};
 
function disableAllSounds(runtime) {
	if (!runtime || !runtime.objects || !runtime.objects.Audio) {
		return;
	}
	runtime.objects.Audio.isSilent = true;
  	console.log("所有声音已禁用，记录了停止的音频信息");
}

// 启用所有声音（恢复之前暂停的音频）
function enableAllSounds(runtime) {
	if (!runtime || !runtime.objects || !runtime.objects.Audio) {
		return;
	}
	runtime.objects.Audio.isSilent = false;
  	console.log("所有声音已启用");
}

function afterLayoutStart(runtime, layout, pk_status, object_Names, global_values) {
	console.log("afterlayoutstart, layout:", layout.name, pk_status);
	setPKStatus(runtime, object_Names, pk_status, global_values);
}

function afterLayoutStartEvent(lobahGameSDKInstance) {
	const layouts = lobahGameSDKInstance.runtime.getAllLayouts();
	if (layouts && layouts.length > 0 && !lobahGameSDKInstance._init_layout_event) {
		layouts.forEach(layout => {
			layout.addEventListener("afterlayoutstart", (event) => {
				afterLayoutStart(lobahGameSDKInstance.runtime, layout, lobahGameSDKInstance._pk_status, lobahGameSDKInstance._object_Names, lobahGameSDKInstance._global_values);
			});
		});
		lobahGameSDKInstance._init_layout_event = true;
	}
}

const C3 = globalThis.C3;

C3.Plugins.lobahGameSDK.Instance = class SingleGlobalInstance extends globalThis.ISDKInstanceBase
{
	constructor()
	{
		super();
		
		// Initialise object properties
		this._testProperty = 0;
		this._pk_game_scenes = "";
		this._object_Names = "";
		this._pk_status = false;//用来控制是否需要隐藏影响pk的元素
		this._init_layout_event = false;
		this._global_values = "";
		this._gameReady = false;
		
		const properties = this._getInitProperties();
		if (properties)		// note properties may be null in some cases
		{
			this._testProperty = properties[0];
			this._pk_game_scenes = properties[1];
			this._object_Names = properties[2];
			this._global_values = properties[3];
		}

		console.log("lobahGameSDK Initialised with property: " + this._testProperty, this._pk_game_scenes);

		// 初始化 PK 实例​
		fetch('https://www.lobah.net/game/sdk-js/GameTokPK.js')
        .then(response => response.text())
        .then(scriptText => {
            // 执行加载的脚本
            eval(scriptText);
            // 调用远程脚本中的函数
            if (globalThis.GameTokPK) {
				console.log("[GameTokPK] 加载远程JS成功");
                globalThis.pkInstance = new globalThis.GameTokPK({
					onStart: (data) => {
						// 此处可调用游戏开始的相关函数​
						console.log('PK 开始，触发游戏内开始逻辑', data);
						if (data.pk_game_scenes) {
							this._pk_game_scenes = data.pk_game_scenes;
						}
						this._pk_status = true;
						afterLayoutStartEvent(this); //场景跳转后的监听回调, 跳转场景后需要根据PK状态设置界面元素
						handleGameStart(this.runtime, this._pk_game_scenes, this._object_Names, this._global_values);
					},
					onEnd: (data) => {
						console.log('PK 结束，结束信息:', data);
						// 此处可处理游戏结束的相关逻辑​
						if (data.pk_game_scenes) {
							this._pk_game_scenes = data.pk_game_scenes;
						}
						this._pk_status = false;
						handleGameOver(this.runtime, this._pk_game_scenes, this._object_Names, this._global_values);
					},
					onError: (data) => {
						console.error('PK 错误:', data);
						// 此处可处理错误逻辑​
					},
					isReady: this.getIsReady(),
					disableAllSounds: (data) => {
						console.log('禁用所有音效:', data);
						disableAllSounds(this.runtime);
					},
					resumeAllSounds: (data) => {
						console.log('恢复所有音效:', data);
						enableAllSounds(this.runtime);
					},
				});
            }else {
				console.error("[GameTokPK] 加载远程JS失败");
			}
        })
        .catch(error => console.error('加载远程JS失败:', error));
	}
	
	_release()
	{
		super._release();
	}

	_setTestProperty(n)
	{
		this._testProperty = n;
	}

	_getTestProperty()
	{
		return this._testProperty;
	}
	
	_saveToJson()
	{
		return {
			// data to be saved for savegames
		};
	}
	
	_loadFromJson(o)
	{
		// load state for savegames
	}

	getIsReady() {
		return C3.Plugins.lobahGameSDK.isReady;
	}
};

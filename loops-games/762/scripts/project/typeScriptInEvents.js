const scriptsInEvents = {
    async Sceneadapter_Event1_Act2(runtime, localVars) {
        function sceneAdapter() {
            const canvasHeight = runtime.platformInfo.canvasDeviceHeight; //1107
            const canvasWidth = runtime.platformInfo.canvasDeviceWidth; //2523
            console.log(runtime.platformInfo);
            const isAdapterSceneHeight = canvasWidth > canvasHeight;
            // 获取场景的设计宽度和高度
            const sceneWidth = runtime.viewportWidth; //1280
            const sceneHeight = runtime.viewportHeight; //760
            const adapterRate = isAdapterSceneHeight ? (canvasHeight / sceneHeight) : (canvasWidth / sceneWidth);
            const adapterWidth = canvasHeight * sceneWidth / sceneHeight;
            const adapterHeight = canvasWidth * sceneHeight / sceneWidth;
            const adapterValue = (isAdapterSceneHeight ? (canvasWidth - adapterWidth) : (canvasHeight - adapterHeight)) / adapterRate;
            runtime.globalVars.adapterValue = Math.floor(adapterValue / 2);
            console.log(runtime.globalVars.adapterValue);
            // console.log("canvasHeight:" + canvasHeight + ",canvasWidth:"+canvasWidth + ",sceneWidth:" + sceneWidth + ",sceneHeight:" + sceneHeight + ",adapterWidth:" + adapterWidth + ",adapterValue:" + adapterValue)
            const allObjectTypes = runtime.objects;
            //原始坐标
            const adpterValueMap = new Map();
            // 2. 遍历每个对象类型
            for (const objTypeName in allObjectTypes) {
                const objType = allObjectTypes[objTypeName];
                // 3. 获取该类型的所有实例
                const allInstances = objType.getAllInstances();
                // 4. 遍历实例，筛选出需要移动的（非锚定且在当前场景的实例）
                allInstances.forEach((instance) => {
                    const instanceAny = instance;
                    if (instanceAny.layer) {
                        // 检查实例是否属于当前场景（避免跨场景实例）
                        if (instanceAny.layer.layout !== runtime.layout) {
                            return;
                        }
                        let originValue = adpterValueMap.get(instance.uid);
                        if (instanceAny.width && instanceAny.height) {
                            const parallaxX = instanceAny.layer.parallaxX;
                            const parallaxY = instanceAny.layer.parallaxY;
                            // console.log("layer parallax:", parallaxX, parallaxY);
                            // console.log("instance origin:", instanceAny.originX, instanceAny.originY);
                            //判断是否是背景图,判定条件为大小是否和场景比原始场景大
                            if (instanceAny.width >= sceneWidth || instanceAny.height >= sceneHeight) {
                                //这个背景图需要进行拉伸到canvas大小
                                if (!originValue) {
                                    originValue = [instanceAny.width, instanceAny.height];
                                    adpterValueMap.set(instance.uid, originValue);
                                }
                                if (isAdapterSceneHeight && instanceAny.width >= sceneWidth) {
                                    instanceAny.width = originValue[0] + adapterValue;
                                    //已经居中了,延长后,需要移动为 adapterValue的一半
                                    if (parallaxX == 0 && parallaxY == 0) {
                                        instanceAny.x -= adapterValue / 2;
                                    }
                                    instanceAny.x += adapterValue * instanceAny.originX;
                                    console.log("高度适配对象", instanceAny.objectType.name, adapterValue);
                                }
                                else if (!isAdapterSceneHeight && instanceAny.height >= sceneHeight) {
                                    instanceAny.height = originValue[1] + adapterValue;
                                    //已经居中了,延长后,需要移动为 adapterValue的一半
                                    if (parallaxX == 0 && parallaxY == 0) {
                                        instanceAny.y -= adapterValue / 2;
                                    }
                                    instanceAny.y += adapterValue * instanceAny.originY;
                                    console.log("宽度适配对象", instanceAny.objectType.name, adapterValue);
                                }
                            }
                        }
                    }
                });
            }
        }
        ;
        sceneAdapter();
    }
};
globalThis.C3.TypeScriptInEvents = scriptsInEvents;
export {};

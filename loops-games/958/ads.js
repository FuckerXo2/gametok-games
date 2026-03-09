
function showVideoXM(func) {
   func && func(true);//测试专用，测试完成请注释
}

var InterTimer = 0;
function showInterXM(func) {
    // var now = new Date().getTime();
    // if (now - InterTimer < 60000) return;
    // InterTimer = new Date().getTime();
    // console.log("播放插屏");
    // adBreak({ 
    //     type: "next",  // ad shows at start of next level
    //     name: "insert",
    //     beforeAd: () => {
    //         console.log("beforeAd");
    //     },
    //     afterAd: () => {
    //         console.log("afterAd");
    //     },
    //     adBreakDone: () => {
    //         func && func();func = null;
    //     },
    // }); 
}

function xmloadStart(){
    // console.log("打点===========开始加载");
    // try {
    //     if (window.funmax && window.funmax.loadStart) {
    //     window.funmax.loadStart()
    //     }
    // } catch (e) {
    //     console.error(e)
    // }
}

function xmloadReady(){
    // console.log("打点===========加载完成");
    // try {
    // if (window.funmax && window.funmax.loadReady) {
    //     window.funmax.loadReady()
    // }
    // } catch (e) {
    //     console.error(e)
    // }
}
const lobahGameSDK={
    addScore(score,env, kindStr){
        console.log('addScore',score,env, kindStr);
        //获取url
        try{
            const urlObj={
                development:'https://api-test.lobah.net/2.0/op2/innergame/add-score',
                product:'https://api.lobah.net/2.0/op2/innergame/add-score'
            }
            let pageUrl=location.href;
            let params=urlParse()
            let query={
                gameId:params.gameId||params.appid,//7
                sessionId:params.session_id||params.sessionId,//10002131750144396332,
                uid:params.userId||params.uid, //1000213
                score:score,
                kind:kindStr
            }
            xhr({
                method:'GET',
                url:urlObj[env],
                params:query,
            })
        }catch (e){
            console.error(e);
        }
    },
}

function urlParse() {
    const hash = location.hash
    const url = location.search || hash.slice(hash.indexOf("?"))
    const obj = {}
    const reg = /[?&][^?&]+=[^?&]+/g
    const arr = url.match(reg)
    if (arr) {
        arr.forEach(function (item) {
            const tempArr = item.substring(1).split("=")
            const key = decodeURIComponent(tempArr[0])
            obj[key] = decodeURIComponent(tempArr[1])
        })
    }
    return obj
}

function xhr(options) {
    // 默认配置
    const defaults = {
        method: 'GET',
        url: '',
        params: {},
        data: null,
        headers: {
            'Content-Type': 'application/json'
        },
        responseType: 'json',
        withCredentials: false,
        success: function() {},
        error: function() {}
    };

    // 合并选项
    const config = Object.assign({}, defaults, options);

    // 处理查询参数
    const queryString = Object.keys(config.params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(config.params[key])}`)
        .join('&');

    // 构建完整URL
    const fullUrl = queryString ? `${config.url}?${queryString}` : config.url;

    // 创建XHR对象
    const xhr = new XMLHttpRequest();

    // 打开连接
    xhr.open(config.method.toUpperCase(), fullUrl, true);

    // 设置响应类型
    xhr.responseType = config.responseType;

    // 设置请求头
    Object.keys(config.headers).forEach(key => {
        xhr.setRequestHeader(key, config.headers[key]);
    });

    // 处理加载完成
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            config.success(xhr.response, xhr.status, xhr);
        } else {
            config.error(xhr, xhr.status, new Error(`Request failed with status ${xhr.status}`));
        }
    };

    // 处理错误
    xhr.onerror = function() {
        config.error(xhr, 0, new Error('Network error occurred'));
    };
    // 发送请求
    if (config.method.toUpperCase() === 'GET') {
        xhr.send();
    } else {
        xhr.send(JSON.stringify(config.data));
    }

}

const kindConstants = [
    "score-asc",
    "score-desc",
    "timer-asc",
    "timer-desc",
    "level-asc",
    "level-desc",
    "stage-asc",
    "stage-desc"
]

const envConstants = [
    "product",
    "development"
]

let sendRequest = false;


const C3 = globalThis.C3;

C3.Plugins.lobahGameSDK.Acts =
{
	LogToConsole()
	{
		console.log("This is the 'Log to console' action. Test property = " + this._getTestProperty());
		lobahGameSDK.addScore(100,'development')
	},

	AddScore(score, kind, env)
	{
        //最短3秒内不能进行发送请求
        if (sendRequest) {
            return;
        }
        sendRequest = true;
        // console.log("score====" + score, kindConstants[kind]);
        lobahGameSDK.addScore(score,envConstants[env], kindConstants[kind])

        setTimeout(() => {
            sendRequest = false;
        }, 3000);
		// lobahGameSDK.addScore(100,'development')
		//生产
		// lobahGameSDK.addScore(100,'product')
		//console.log("This is the 'Log to console' action. Test property = " + this._getTestProperty());
	}
};

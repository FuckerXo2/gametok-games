const lobahGameSDK = {
  addScore(score, env, kindStr) {
    console.log("addScore", score, env, kindStr);
    //获取url
    try {
      const urlObj = {
        development: "https://api-test.lobah.net/2.0/op2/innergame/add-score",
        product: "https://api.lobah.net/2.0/op2/innergame/add-score",
      };
      let pageUrl = location.href;
      let params = urlParse();
      if (!params.gameId) {
        console.log(
          "rank addScore: 游戏ID不存在, score = " +
            score +
            ", kind = " +
            kindStr +
            ", env = " +
            env
        );
        return;
      }

      let query = {
        gameId: params.gameId || params.appid, //7
        sessionId: params.session_id || params.sessionId, //10002131750144396332,
        uid: params.userId || params.uid, //1000213
        score: score,
        kind: kindStr,
      };
      xhr({
        method: "GET",
        url: urlObj[env],
        params: query,
      });
    } catch (e) {
      console.error(e);
    }
  }
};

function urlParse() {
  const hash = location.hash;
  const url = location.search || hash.slice(hash.indexOf("?"));
  const obj = {};
  const reg = /[?&][^?&]+=[^?&]+/g;
  const arr = url.match(reg);
  if (arr) {
    arr.forEach(function (item) {
      const tempArr = item.substring(1).split("=");
      const key = decodeURIComponent(tempArr[0]);
      obj[key] = decodeURIComponent(tempArr[1]);
    });
  }
  return obj;
}

function xhr(options) {
  // 默认配置
  const defaults = {
    method: "GET",
    url: "",
    params: {},
    data: null,
    headers: {
      "Content-Type": "application/json",
    },
    responseType: "json",
    withCredentials: false,
    success: function () {},
    error: function () {},
  };

  // 合并选项
  const config = Object.assign({}, defaults, options);

  // 处理查询参数
  const queryString = Object.keys(config.params)
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(config.params[key])}`
    )
    .join("&");

  // 构建完整URL
  const fullUrl = queryString ? `${config.url}?${queryString}` : config.url;

  // 创建XHR对象
  const xhr = new XMLHttpRequest();

  // 打开连接
  xhr.open(config.method.toUpperCase(), fullUrl, true);

  // 设置响应类型
  xhr.responseType = config.responseType;

  // 设置请求头
  Object.keys(config.headers).forEach((key) => {
    xhr.setRequestHeader(key, config.headers[key]);
  });

  // 处理加载完成
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      config.success(xhr.response, xhr.status, xhr);
    } else {
      config.error(
        xhr,
        xhr.status,
        new Error(`Request failed with status ${xhr.status}`)
      );
    }
  };

  // 处理错误
  xhr.onerror = function () {
    config.error(xhr, 0, new Error("Network error occurred"));
  };
  // 发送请求
  if (config.method.toUpperCase() === "GET") {
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
  "stage-desc",
  "round-asc",
  "round-desc",
  "realtime-asc",
  "realtime-desc",
];

const envConstants = ["product", "development"];

const pk_type = ["addScore", "gameOver", "gameReady"];

let _interval = -1;
let _curScore = -1;
let _curKind = "NULL";
let _curEnv = "NULL";

let _lastScore = -1;
let _lastKind = "NULL";
let _lastEnv = "NULL";

function sendCurScore() {
  _lastScore = _curScore;
  _lastKind = _curKind;
  _lastEnv = _curEnv;
  lobahGameSDK.addScore(_curScore, _curEnv, _curKind);
  pk_postMessage("addScore", _curScore);
}

function checkSendScore() {
  if (_lastScore != _curScore || _lastKind != _curKind || _lastEnv != _curEnv) {
    sendCurScore();
  }
}

function pk_postMessage(type, score) {
  if (globalThis.pkInstance) {
    if (type === pk_type[0]) {
      globalThis.pkInstance.updateScore(score);
    } else if (type === pk_type[1]) {
      globalThis.pkInstance.gameOver(score);
    } else if (type === pk_type[2]) {
      globalThis.pkInstance.gameReady();
    }
  }
}

let _gameReady = false;

const C3 = globalThis.C3;

C3.Plugins.lobahGameSDK.Acts = {
  LogToConsole() {
    console.log(
      "This is the 'Log to console' action. Test property = " +
        this._getTestProperty()
    );
    lobahGameSDK.addScore(100, "development");
  },

  //可能放在update里面进行上传,需要间隔3秒发送一次，但是内容相同的，不进行发送
  AddScore(score, kind, env) {
    _curEnv = envConstants[env];
    _curKind = kindConstants[kind];
    _curScore = score;

    if (_interval == -1) {
      //还没有定时器,先发送,并且启动定时器
      sendCurScore();
      _interval = setInterval(() => {
        checkSendScore();
      }, 500);
    }
  },

  SetGameStatus(typeIndex, score) {
    if (typeIndex == 2) {
        _gameReady = true;
        C3.Plugins.lobahGameSDK.isReady = true;
    }
    checkSendScore();
    pk_postMessage(pk_type[typeIndex], score);
  },
};

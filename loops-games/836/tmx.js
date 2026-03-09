! function() {

    class tmx {
        constructor() {
            
        }
        static getInstance() {
            if (!this._instance) {
                this._instance = new tmx();
            }
            return this._instance;
        }
        initData() {}
        onNavigate_() {}

        getStorageSync(key) {
            let value = null;
            
        }
        setStorageSync(key, value) {
     
        }

        navigate(screen_, action_, to_) {

        }

        onblur() {
           
        }

        onfocus() {
           
        }
        showTableAd() {
          
        }
        showBanner() {

        }

        hideBanner() {

        }

        checkBanner(){
        }
     
        showInterstitial(complete) {
            complete && complete();

        }
      
        showReward(success, failure) {
             success();
        }

        reportEnterGame(){}

    }
    tmx._instance = null;
    window["tmx"] = tmx;
}()
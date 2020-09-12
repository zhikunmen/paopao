class Http {

    // api地址  
    // public static GET_JUMP_INFO = "https://gw.365you.com/wx/getJumpInfo"; //获取跳转信息  (测试)

    public static GET_JUMP_INFO = "https://gws.365you.com/wx/getJumpInfo"; //获取跳转信息  


    /** 
     * post请求数据，默认需要token才能请求
     * @param  {} url post地址
     * @param  {} data post数据，默认放在body内
     */
    public static async post(url, data) {
        return new Promise((resolve, reject) => {
            let request = new egret.HttpRequest();
            request.responseType = egret.HttpResponseType.TEXT;
            request.open(url, egret.HttpMethod.POST);
            request.setRequestHeader("Content-Type", "application/json");
            request.send(data);
            request.addEventListener(egret.Event.COMPLETE, function (evt: egret.Event) {
                let res = <egret.HttpRequest>evt.currentTarget;
                res.response ? resolve(JSON.parse(res.response)) : resolve({});
            }, this)
            request.addEventListener(egret.IOErrorEvent.IO_ERROR, function (evt: egret.IOErrorEvent) {
                reject(evt);
            }, this)
        })
    }


    /**
     * get请求数据
     * @param  {} url 请求地址
     * @param  {} noToken? 是否需要传入token，若为true，则不需要传token亦可访问
     */
    public static async get(url, noToken?) {
        return new Promise((resolve, reject) => {
            let request = new egret.HttpRequest();
            request.responseType = egret.HttpResponseType.TEXT;
            request.open(url, egret.HttpMethod.GET);
            request.send();
            request.addEventListener(egret.Event.COMPLETE, function (evt: egret.Event) {
                let res = <egret.HttpRequest>evt.currentTarget;
                resolve(JSON.parse(res.response))
            }, this)
            request.addEventListener(egret.IOErrorEvent.IO_ERROR, function (evt: egret.IOErrorEvent) {
                reject(evt);
                console.log(2222);
            }, this)
        })
    }
}
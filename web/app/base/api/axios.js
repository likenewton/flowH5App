class AXIOS {
  constructor(para) {
    this.data = {
      method: 'get',
      params: null,
      timeout: 60000,
      data: null, // 请求体所带的参数
      done: null, // 接口请求成功回调函数
    }
    // 实例化时初始的参数
    this.constData = Object.assign(this.data, para)

    // ajax请求地址
    this.ajaxAd = {
      // 实名认证
      getInfo: '/flowh5/api/realname/info',
      uploadPic: '/flowh5/api/realname/upload',
      sendSms: '/flowh5/api/realname/sendSms', // 暂时不用
      realname: '/flowh5/api/realname', // 实名提交
      getLivegetfour: '/flowh5/api/realname/livegetfour', // 获取唇语
    }
  }

  send(para) {
    let data = Object.assign({}, this.constData, para)

    axios({
      method: data.method,
      url: data.url + '?time=' + new Date().getTime(),
      data: data.data,
      onUploadProgress: data.onUploadProgress,
      cancelToken: data.cancelToken,
      params: data.params,
      timeout: data.timeout,
    }).then(res => {
      // 这里要根据状态码来对不同的响应状态做处理
      if (res.data.status === 0) {
        return data.done && data.done(res.data)
      } else {
        cpopup.alert({
          body: res.data.msg || '未知错误！'
        })
        data.fail && data.fail()
      }
    }).catch(error => {
      if (axios.isCancel(error)) {
        // 上传文件被取消
        return
      }
      cpopup.alert({
        body: '未连接到服务器！'
      })
      data.error && data.error()
    })
  }

  static init(para) {
    return window._axios = new AXIOS(para)
  }
}

export default AXIOS
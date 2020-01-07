module.exports = {
  formatdate(date, fmt) {
    date = new Date(date);
    let timeString = fmt || 'yyyy-mm-dd hh:ff:ss';
    let getFullYear = String(date.getFullYear());

    function padLeftZero(str) {
      var padLeft = '00';
      return (padLeft + str).substr(str.length);
    }

    // 如果存在至少一个y
    if (/(y+)/.test(timeString)) {
      // RegExp.$1 为匹配第一个大括号的内容
      timeString = timeString.replace(RegExp.$1, getFullYear.substr(4 - RegExp.$1.length));
    }
    let o = {
      'm+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'f+': date.getMinutes(),
      's+': date.getSeconds(),
    };
    for (var k in o) {
      if (new RegExp(`(${k})`).test(timeString)) {
        let str = String(o[k]);
        timeString = timeString.replace(RegExp.$1, str.length == 1 ? padLeftZero(str) : str);
      }
    }
    return timeString;
  },

  setCookie(cname, cvalue, exhours) { // 设置cookie
    let expires = 'expires='
    if (exhours) {
      let d = new Date()
      d.setTime(d.getTime() + (exhours * 60 * 60 * 1000))
      expires += d.toUTCString()
      document.cookie = `${cname}=${cvalue};${expires};path=/`
    } else {
      document.cookie = `${cname}=${cvalue};path=/`
    }
  },

  getCookie(attr) { // 获取cookie
    let cookieStr = document.cookie
    let cookieArr = cookieStr.split(';')
    let cookieObj = {}
    cookieArr.forEach((v) => {
      let tplArr = v.split('=')
      while (tplArr[0].charAt(0) === ' ') {
        tplArr[0] = tplArr[0].substring(1)
      }
      cookieObj[tplArr[0]] = tplArr[1]
    })
    if (attr) return cookieObj[attr]
    else return cookieObj
  },

  formatFlowUnit(count = 0, fix = 3, isHtmlStr = false) { // 格式化 流量M / G / T, 默认保留三位小数
    count -= 0
    let htmlStr = ''
    if (isHtmlStr) {
      if (isNaN(count) || count == '99999999') {
        htmlStr = `<span style="font-weight:bold" class="text_danger">无限制</span>`
      } else if (Math.abs(count / 1024 / 1024 / 1024) < 1) {
        htmlStr = `<span>${(count / 1024 / 1024).toFixed(fix)}</span><span style="font-weight:bold;color:#008000">M</span>`
      } else if (Math.abs(count / 1024 / 1024 / 1024 / 1024) < 1) {
        htmlStr = `<span>${(count / 1024 / 1024 / 1024).toFixed(fix)}</span><span style="font-weight:bold;color:#00f">G</span>`
      } else {
        htmlStr = `<span>${(count / 1024 / 1024 / 1024 / 1024).toFixed(fix)}</span><span style="font-weight:bold;color:#e92322"">T</span>`
      }
    } else {
      if (isNaN(count) || count == '99999999') {
        htmlStr = '无限制'
      } else if (Math.abs(count / 1024 / 1024) < 1) {
        htmlStr = `${(count / 1024).toFixed(fix)} K`
      } else if (Math.abs(count / 1024 / 1024 / 1024) < 1) {
        htmlStr = `${(count / 1024 / 1024).toFixed(fix)} M`
      } else if (Math.abs(count / 1024 / 1024 / 1024 / 1024) < 1) {
        htmlStr = `${(count / 1024 / 1024 / 1024).toFixed(fix)} G`
      } else {
        htmlStr = `${(count / 1024 / 1024 / 1024 / 1024).toFixed(fix)} T`
      }
    }
    return htmlStr
  },

  getUserMedia(constrains, success, error) {
    if (navigator.mediaDevices && (navigator.mediaDevices.getUserMedia || navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia)) {
      //调用用户媒体设备，访问摄像头
      if (navigator.mediaDevices.getUserMedia) {
        //最新标准API
        navigator.mediaDevices.getUserMedia(constrains).then(success).catch(error);
      } else if (navigator.webkitGetUserMedia) {
        //webkit内核浏览器
        navigator.webkitGetUserMedia(constrains).then(success).catch(error);
      } else if (navigator.mozGetUserMedia) {
        //Firefox浏览器
        navagator.mozGetUserMedia(constrains).then(success).catch(error);
      } else if (navigator.getUserMedia) {
        //旧版API
        navigator.getUserMedia(constrains).then(success).catch(error);
      }
    } else {
      alert("你的浏览器不支持访问用户媒体设备");
    }
  },

  getQuery(attr) { // 获取查询字符串
    let href = location.href
    let queryStr = href.substr(href.indexOf('?') + 1)
    let queryArr = queryStr.split('&')
    let queryObj = {}
    queryArr.forEach(v => {
      let tplArr = v.split('=')
      queryObj[tplArr[0]] = tplArr[1]
    })
    if (attr) return queryObj[attr]
    else return queryObj
  },

  // 校验
  // 是否移动端
  isMobile() {
    let ua = navigator.userAgent;
    let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
    let isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
    let isAndroid = ua.match(/(Android)\s+([\d.]+)/);
    return isIphone || isAndroid
  },
  // 身份证
  isCardNo(card) {
    // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X  
    let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    return reg.test(card)
  },
  // 姓名
  isName(name) {
    let reg = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/;
    return reg.test(name)
  },
  // 电话号码
  isPhoneNumber(value) { // 验证电话号码
    return /^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(value)
  },


}
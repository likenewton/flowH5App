import { Units, STATIC, template } from '../../base/api/api.js'
import { Crumbs, RapidInput } from '../../components'
import EXIF from '../../lib/exif/exif'
import './style.scss'

class Certification {
  constructor() {
    this.data = {
      iccid: Units.getQuery('iccid'), // 有可能地址会带过来
      sn: Units.getQuery('sn'), // 有可能地址会带过来
      info: {},
      cdi_img1: '', // 正面图片路径
      cdi_img2: '', // 背面图片路径
      cdi_img3: '', // 手持图片路径
      cdi_video: '', // 视频路径
      local_cdi_video: '',
      local_cdi_img1: '',
      local_cdi_img2: '',
      local_cdi_img3: '',
      smsInterval: 20000,
      rapid1: null, // 卡ICCID 下拉缓存
      rapid2: null, // 身份证姓名
      rapid3: null, // 身份证编号
      rapid4: null, // 手机号码
      vedioMaxSize: 5 * 1024 * 1024,
      imageMaxSize: 5 * 1024 * 1024,
      Timer: null,
      card_type: 5, // 等于2只能视频认证
      model: 'image', // image / video
      livegetfour: '', // 视频认证需要传递的代码
    }
    this._fn()
    this._render()
  }

  _render() {
    Crumbs.render({
      dom: '.js-crumbs',
      step: 1
    })
    $('#input_iccid').val(this.data.iccid);
    // 判断发短信的时间间隔必须大于60秒
    this.fn.checkSmsCanSend()

    this.data.rapid1 = RapidInput.render({ dom: '#input_iccid' })
    this.data.rapid2 = RapidInput.render({ dom: '#input_name' })
    this.data.rapid3 = RapidInput.render({ dom: '#input_code' })
    this.data.rapid4 = RapidInput.render({ dom: '#input_phone' })
    // 开局模拟状态
    if (false) this.fn.showResult('audit')
    // body的最小高度应该是屏幕的高度
    this.fn.setBodyHeight()
    this.mounted()
  }

  mounted() {
    this._addEvent()
    this.data.iccid && this.getInfo(this.data.iccid, this.data.sn)
  }

  _addEvent() {

    // input 清除按钮
    $('.form-item input').focus((e) => {
      $(e.currentTarget).parents('.form-item').find('.close-icon').show()
    })

    $('.form-item input').blur((e) => {
      $(e.currentTarget).parents('.form-item').find('.close-icon').fadeOut(200)
    })

    $('.form-item .close-icon').click((e) => {
      $(e.currentTarget).parents('.form-item').find('input').val('')
    })

    // 发送验证码
    $('.send-code').click((e) => {
      if (!Units.isPhoneNumber($('#input_phone').val())) {
        cpopup.alert({
          body: '手机号码不符合规范！'
        })
      } else {
        if (!$('.send-code').hasClass('disabled')) {
          this.sendSms()
          this.fn.checkSmsCanSend()
        }
      }
    })

    // tabs切换
    $('.tab-item').click((e) => {
      let $target = $(e.currentTarget);
      let $tabs = $('.tabs');
      if ($target.hasClass('tabs-one')) {
        // 图片认证
        if (this.data.card_type == 2) cpopup.alert({ body: '该类型的卡不支持手持验证！' })
        else this.fn.handleTabsChange(1)
      } else if ($target.hasClass('tabs-two')) {
        // 视频认证
        if (Units.isMobile()) this.fn.handleTabsChange(2)
        else cpopup.alert({ body: '视频认证暂时仅支持手机端！' })
      }
    })

    // 正面图片上传
    $('#front-upload').change((e) => {
      let file = e.target.files[0];
      if (file.size > this.data.imageMaxSize) {
        e.target.value = ''
        cpopup.alert({ body: `上传的图片不能超过 ${Units.formatFlowUnit(this.data.imageMaxSize, 0)}B` })
        return
      }
      if (this.fn.imgValide(file)) {
        this.upLoadPic(file, e.target, (res) => {
          this.data.cdi_img1 = res.data.path
          this.data.local_cdi_img1 = res.data.furl_local
          this.fn.fileChange(file, 'front-canvas')
        })
      }
    })

    // 背面图片上传
    $('#back-upload').change((e) => {
      let file = e.target.files[0];
      if (file.size > this.data.imageMaxSize) {
        e.target.value = ''
        cpopup.alert({ body: `上传的图片不能超过 ${Units.formatFlowUnit(this.data.imageMaxSize, 0)}B` })
        return
      }
      if (this.fn.imgValide(file)) {
        this.upLoadPic(file, e.target, (res) => {
          this.data.cdi_img2 = res.data.path
          this.data.local_cdi_img2 = res.data.furl_local
          this.fn.fileChange(file, 'back-canvas')
        })
      }
    })

    // 手持身份证上传
    $('#card-upload').change((e) => {
      let file = e.target.files[0];
      if (file.size > this.data.imageMaxSize) {
        e.target.value = ''
        cpopup.alert({ body: `上传的图片不能超过 ${Units.formatFlowUnit(this.data.imageMaxSize, 0)}B` })
        return
      }
      if (this.fn.imgValide(file)) {
        this.upLoadPic(file, e.target, (res) => {
          this.data.cdi_img3 = res.data.path
          this.data.local_cdi_img3 = res.data.furl_local
          this.fn.fileChange(file, 'card-canvas')
        })
      }
    })

    // 视频上传
    $('#video-upload').change((e) => {
      let file = e.target.files[0];
      // 限制最大上传大小
      if (file.size > this.data.vedioMaxSize) {
        cpopup.alert({
          body: `上传的视频不能超过 ${Units.formatFlowUnit(this.data.vedioMaxSize, 0)}B`,
        })
        return
      }
      if (this.fn.videoValide(file)) {
        this.upLoadPic(file, e.target, (res) => {
          this.data.cdi_video = res.data.path
          this.data.local_cdi_video = res.data.furl_local
          cpopup.confirm({
            body: `视频大约 ${Units.formatFlowUnit(file.size, 1)}B，在移动网络环境下上传会产生手机流量，确认继续？`,
            okHide: () => {
              this.toRealName()
            }
          })
        })
      }
    })

    // step1中的下一步
    $('.content-one .nav.next').click((e) => {
      // 这里要进行验证
      if (!this.fn.formValidator()) return
      this.getInfo($('#input_iccid').val().trim(), this.data.sn, () => {
        // 验证成功，是本公司的卡
        Crumbs.render({
          dom: '.js-crumbs',
          step: 2
        })
        // 保存记录
        this.data.rapid1.setHistory()
        this.data.rapid2.setHistory()
        this.data.rapid3.setHistory()
        this.data.rapid4.setHistory()
        $('.content-one').hide()
        $('.content-two').show()
        this.data.card_type == 2 ? this.fn.handleTabsChange(2) : this.fn.handleTabsChange(1)
      })
    })

    // step2中的上一步
    $('.content-two .nav.prev').click((e) => {
      Crumbs.render({
        dom: '.js-crumbs',
        step: 1
      })
      $('.content-one').show()
      $('.content-two').hide()
    })

    // step2中的下一步
    $('.content-two .nav.next').click((e) => {
      // 1、这里要进行验证
      if (!this.data.cdi_img3) {
        cpopup.alert({
          body: '请上传手持身份证照片！'
        })
        return
      }
      // 2、这里提交表单
      this.toRealName()
    })

    // 重新验证
    $('.content-three .again-btn').click(() => {
      Crumbs.render({
        dom: '.js-crumbs',
        step: 1
      })
      $('.content-one').show()
      $('.content-three').hide()
    })

    // 返回首页
    $('.home-btn').click(() => {
      location.href = 'http://t.gprs.yunovo.cn/';
    })

  }

  // 获取实名认证信息(是否已实名、是否是有效卡)
  getInfo(iccid, sn, cb) {
    _axios.send({
      method: 'get',
      url: _axios.ajaxAd.getInfo,
      params: { iccid, sn },
      done: ((res) => {
        this.data.info = res.data || {}
        this.data.card_type = this.data.info.card_type // 将卡类型保存
        if (this.data.info.status == 0 || this.data.info.status == 4) { // 待审核
          if (this.data.card_type == 2 && this.data.info.status == 4) cb && cb() // 当card_type == 2 && status == 4 也需要重新实名
          else this.fn.showResult('audit')
        } else if (this.data.info.status == 2 || this.data.info.status == 5) { // 已实名
          if (this.data.card_type == 2 && this.data.info.status == 2) cb && cb() // 当card_type == 2 && status == 2 也需要重新实名
          else this.fn.showResult('hadsuccess')
        } else { // 要进行实名
          cb && cb()
        }
      }),
    })
  }

  // 文件上传
  upLoadPic(file, target, cb) {
    if ($('#input_iccid').val().trim().length === 0) return cpopup.alert({ body: '请填写iccid！' })
    let formData = new FormData();
    formData.append('file', file)
    formData.append('iccid', $('#input_iccid').val())
    _tip.show('文件上传中...')
    _axios.send({
      method: 'post',
      url: _axios.ajaxAd.uploadPic,
      data: formData,
      done: ((res) => {
        _tip.hide()
        target.value = ''
        cb && cb(res)
      }),
      fail: () => {
        _tip.hide()
        target.value = ''
      },
      error: () => {
        _tip.hide()
        target.value = ''
      }
    })
  }

  sendSms() {
    localStorage.setItem('smsTime', new Date().getTime())
    _tip.show('短信发送中...')
    _axios.send({
      method: 'post',
      url: _axios.ajaxAd.sendSms,
      data: {
        mobile: $('#input_phone').val(),
        iccid: $('#input_iccid').val(),
      },
      done: ((res) => {
        _tip.hide()
      }),
      fail: () => {
        _tip.hide()
      },
      error: () => {
        _tip.hide()
      }
    })
  }

  // 获取唇语信息
  getLivegetfour() {
    _axios.send({
      method: 'get',
      url: _axios.ajaxAd.getLivegetfour,
      params: { iccid: $('#input_iccid').val() },
      done: ((res) => {
        $('.validate-text-wrapper .code').text(res.data.code)
        this.data.livegetfour = res.data.rspcode
      }),
    })
  }

  // 最终审核提交
  toRealName() {
    _tip.show('提交申请中...')
    _axios.send({
      method: 'post',
      url: _axios.ajaxAd.realname,
      data: {
        iccid: $('#input_iccid').val().trim(),
        mobile: $('#input_phone').val().trim(),
        realname: $('#input_name').val().trim(),
        cdi: $('#input_code').val().trim(),
        sn: this.data.sn,
        cdi_img1: this.data.cdi_img1,
        cdi_img2: this.data.cdi_img2,
        cdi_img3: this.data.model == 'image' ? this.data.cdi_img3 : this.data.cdi_video,
        local_cdi_img1: this.data.local_cdi_img1,
        local_cdi_img2: this.data.local_cdi_img2,
        local_cdi_img3: this.data.model == 'image' ? this.data.local_cdi_img3 : this.data.local_cdi_video,
        model: this.data.model,
        livegetfour: this.data.livegetfour,
      },
      done: ((res) => {
        _tip.hide()
        if (res.data.status == 0 || res.data.status == 4) this.fn.showResult('audit')
        else if (res.data.status == 2 || res.data.status == 5) this.fn.showResult('success')
        else if (res.data.status == 1) {
          this.fn.showResult('error')
          $('.result.err .result-text-sub').text(res.data.message || '未知错误！')
        }
      }),
      fail: () => {
        _tip.hide()
      },
      error: () => {
        _tip.hide()
      }
    })
  }

  _fn() {
    this.fn = {
      data: this.data,
      setBodyHeight() {
        $('body').css('minHeight', $(window).height())
      },
      initImgs() {
        this.data.cdi_img1 = '' // 正面图片路径
        this.data.cdi_img2 = '' // 背面图片路径
        this.data.cdi_img3 = '' // 手持图片路径
        this.data.local_cdi_img1 = ''
        this.data.local_cdi_img1 = ''
        this.data.local_cdi_img1 = ''
      },
      handleTabsChange: (tab = 1) => {
        if (tab == 1) {
          this.data.model = 'image'
          $('.tabs').removeClass('two').addClass('one')
          $('.tabs-content').removeClass('two').addClass('one')
          $('.content-two .nav-wrapper').removeClass('two').addClass('one')
        } else if (tab == 2) {
          this.data.model = 'video'
          $('.tabs').removeClass('one').addClass('two')
          $('.tabs-content').removeClass('one').addClass('two')
          $('.content-two .nav-wrapper').removeClass('one').addClass('two')
          this.getLivegetfour() // 获取唇语
        }
      },
      // 表单验证
      formValidator() {
        let msg = ''
        if ($('#input_iccid').val().trim().length === 0) msg = '卡ICCID不能为空！'
        else if (!Units.isName($('#input_name').val())) msg = '身份证姓名不符合规范！'
        else if (!Units.isCardNo($('#input_code').val())) msg = '身份证编号不符合规范！'
        else if (!Units.isPhoneNumber($('#input_phone').val())) msg = '手机号码不符合规范！'
        else if (!this.data.cdi_img1) msg = '请上传身份证正面！'
        else if (!this.data.cdi_img2) msg = '请上传身份证背面！'
        if (msg) cpopup.alert({ body: msg })
        else return true
      },
      // 验证上传图片的格式
      imgValide(file) {
        if (['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) return true
        cpopup.alert({ body: '文件类型不正确，只能上传png、jpg、jpeg图片！' })
      },
      // 验证上传视频格式
      videoValide(file) {
        if (file.type.indexOf('video') > -1) return true
        cpopup.alert({ body: '文件类型不正确！' })
      },
      /* param status
       * success 实名认证成功 suc
       * hadsuccess 已经实名 hadsuc
       * error 实名认证失败 err
       * errmultiple 多次失败 errmulti
       * audit 审核中 aud
       */
      showResult(status) {
        Crumbs.hide()
        $('.result-wrapper').removeClass().addClass(`result-wrapper ${status}`)
        $('.content-one').hide()
        $('.content-two').hide()
        $('.content-three').show()
      },
      // 上传的身份证改变时触发
      fileChange(file, targetID) {
        let reads = new FileReader();
        reads.readAsDataURL(file);
        reads.onload = function(e) {
          let img = new Image();
          img.src = e.target.result
          img.onload = function() {
            let canvas = document.getElementById(targetID);
            let $box = $(canvas).parents('.display-wrapper');
            // 重设宽度也会清空画布
            canvas.width = Math.ceil($box.width());
            canvas.height = Math.ceil($box.height());
            let ctx = canvas.getContext("2d");
            if (img.width <= img.height) {
              // 竖着的照片
              ctx.save(); //保存状态
              ctx.rotate(90 * Math.PI / 180);
              ctx.drawImage(img, 0, 0, img.width, img.height, 0, -canvas.width, canvas.height, canvas.width);
              ctx.restore();
            } else {
              // 横着的照片
              ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
            }
          }
        }
        // 判断上传文件的方向
        EXIF.getData(file, function() {
          let exifData = EXIF.pretty(this);
          if (exifData) {
            // exifData.Orientation === 6 需要旋转
            if (exifData.Orientation === 3) {
              // 180
            } else if (exifData.Orientation === 6) {
              // 顺时针90
            } else if (exifData.Orientation === 8) {
              // 逆时针90
            } else {

            }
          } else {
            // 不是直接拍摄的
          }
        })
      },
      // 暂时不用
      checkSmsCanSend() {
        clearInterval(this.data.Timer)
        let $smsBtn = $('.send-code')
        let time = localStorage.getItem('smsTime')
        if (time) {
          let nowTime = new Date().getTime()
          if (nowTime - time > this.data.smsInterval) {
            $smsBtn.text('发送验证码').removeClass('disabled')
          } else {
            nowTime = new Date().getTime()
            if (Math.ceil((nowTime - time) / 1000) <= 0) {
              clearInterval(Timer)
              $smsBtn.text('发送验证码').removeClass('disabled')
            } else {
              $smsBtn.text(Math.ceil((this.data.smsInterval - (nowTime - time)) / 1000) + 's').addClass('disabled')
            }
            this.data.Timer = setInterval(() => {
              nowTime = new Date().getTime()
              if (Math.ceil((this.data.smsInterval - (nowTime - time)) / 1000) <= 0) {
                clearInterval(this.data.Timer)
                $smsBtn.text('发送验证码').removeClass('disabled')
              } else {
                $smsBtn.text(Math.ceil((this.data.smsInterval - (nowTime - time)) / 1000) + 's')
              }
            }, 1000)
          }
        }
      }
    }
  }

  static init() {
    return new Certification()
  }
}

Certification.init()
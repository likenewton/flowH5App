import { template } from '../../base/api/api.js'
import tpl from './cpopup.tpl'
import './index.scss'

export default class Cpopup {

  constructor(paraObj) {
    // 优先级 params(调用alert等函数所传对象) > tipData == alertData == confirmData > data
    this.data = {
      componentName: 'Cpopup',
      dom: '.js-Cpopup',
      version_dom: `.js-Cpopup-${new Date().getTime()}_${parseInt(Math.random() * 1000)}`, 
      okBtn: '确定', // ok 按钮文案
      cancelBtn: '取消', // cancel 按钮文案
      status: false, // 成功与失败的状态
      // 部件的显示
      isShowOkBtn: true, // 是否显示 ok 按钮
      isShowCancelBtn: true, // 是否显示 cancal 按钮
      // 动画
      timeout: 0, // 弹框默认不会自动消失  (>0 会自动消失)
      animateIn: 'fadeIn', // 默认进入动画
      animateOut: 'fadeOut', // 默认消失动画
      animateTime: 200, // 动画持续时间
      // 回调函数 ↓         
      okHide: null, // 对话框消失前触发(确定)， return fasle 对话框将不会消失
      okHiden: null, // 对话框消失后触发(确定)，
      cancelHide: null, // 对话框消失前触发(取消)， return fasle 对话框将不会消失
      cancelHiden: null, // 对话框消失后触发(取消)，
      shown: null, // 对话框展示后触发
      // other
      tplData: null, // 当body传入的是template模板时，此数据用于渲染该模板
    }
    this.alertData = {
      type: 'ALERT',
      isShowCancelBtn: false, // alert没有 cancel 按钮 
    }
    this.confirmData = {
      type: 'CONFIRM',
    }

    this.setData(paraObj);

    this.concatData = {}; // 合并后数据
    this.addEvents();

  }

  setData(data, info) {
    let oldData = this[info || 'data'];
    let newData = $.extend(oldData, data);
    this[info || 'data'] = newData;
  }

  _render(data) {

    if (data.tplData) {
      // 如果在弹窗前需要对传入的模板进行渲染
      data.body = template.compile(data.body)({
        data: data.tplData,
      })
    }

    this.$box = $(template.compile(tpl)({
      data
    }));
    if (this.$box) {
      this.$box.remove();
    }

    if ($(data.version_dom).length == 0) {
      let oDiv = document.createElement('div');
      $(oDiv).addClass(data.dom.substr(1)).addClass(data.version_dom.substr(1));
      document.body.appendChild(oDiv);
      $(data.version_dom).html(this.$box);
    } else {
      $(data.version_dom).html(this.$box);
    }

  }

  addEvents() {
    let self = this;
    let $doc = $(document);

    // ok按钮
    $doc.on('click', `${self.data.version_dom} .ok-btn`, () => {
      let data = self.concatData;

      if (!data.okHide) {
        self._animateOut('OK');
      } else {
        if (data.okHide() !== false) {
          self._animateOut('OK');
        }
      }
    })

    // cancel按钮
    $doc.on('click', `${self.data.version_dom} .cancel-btn`, () => {
      let data = self.concatData;

      if (!data.cancelHide) {
        self._animateOut('CANCEL');
      } else {
        if (data.cancelHide() !== false) {
          self._animateOut('CANCEL');
        }
      }
    })

  }

  // 警告框
  alert(params = {}) {
    let paraObj = $.extend({}, this.data, this.alertData, params);
    this.concatData = {}; // 将concatData清空是保证params参数不会对data中的数据产生永久性的影响，只会对本次的弹框产生影响
    this.setData(paraObj, 'concatData');
    this._render(paraObj);
    this._animateIn(paraObj);

  }

  // 提示框
  confirm(params = {}) {
    let paraObj = $.extend({}, this.data, this.confirmData, params);
    this.concatData = {};
    this.setData(paraObj, 'concatData');
    this._render(paraObj);
    this._animateIn(paraObj);

  }


  // === 动画 === (默认弹窗动画 bounceInDown)
  // 进入动画
  _animateIn(data) {
    document.body.style.overflow='hidden'
    let self = this;

    $(data.version_dom).css({
      'animationDuration': `${data.animateTime / 1000}s`,
      'zIndex': 888, // 如果是tip 层级要降低
    });
    $(data.version_dom).removeClass('animated fadeIn fadeOut').addClass('animated fadeIn');
    $(data.version_dom).find('.inner').removeClass().addClass(`inner animated ${data.animateIn}`);
    $(data.version_dom).fadeIn(data.animateTime, function() {
      data.shown && data.shown();
    });

    if (data.timeout) {
      setTimeout(() => {
        self._animateOut('CANCEL');
      }, data.timeout)
    }
  }

  // 消失动画
  _animateOut(flag) {
    document.body.style.overflow='auto'
    let self = this;
    let data = self.concatData;
    let $version_dom = $(data.version_dom);

    $version_dom.removeClass('animated fadeIn fadeOut').addClass('animated fadeOut');
    $version_dom.find('.inner').removeClass().addClass(`inner animated ${data.animateOut}`);
    $version_dom.fadeOut(data.animateTime, function() {
      // 以下的回调函数是在弹框消失后出发
      if (flag === 'OK') {
        data.okHiden && data.okHiden();
      } else if (flag === 'CANCEL') {
        data.cancelHiden && data.cancelHiden();
      }
    });

  }

};


Cpopup.init = function(paraObj) {
  return window.cpopup = new Cpopup(paraObj);
}

Cpopup.isFirstLoad = true;
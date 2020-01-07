import { template } from '../../base/api/api.js'
import tpl from './tip.tpl'
import './index.scss'

export default class Tip {

  constructor(paraObj) {
    this.data = {
      componentName: 'Tip',
    }

    this.setData(paraObj);
    this.concatData = {}; // 合并后数据
    this._render(this.data);

  }

  setData(data, info) {
    let oldData = this[info || 'data'];
    let newData = $.extend(oldData, data);
    this[info || 'data'] = newData;
  }

  _render(data) {
    document.body.appendChild($(template.compile(tpl)({ data }))[0]);
  }

  show(msg) {
    $('.js-Tip .tip-content').text(msg)
    $('.js-Tip').show();
  }

  hide() {
    $('.js-Tip').hide();
  }


};


Tip.init = function(paraObj) {
  return window._tip =  new Tip(paraObj);
}
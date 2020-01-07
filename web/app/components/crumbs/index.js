import { template } from '../../base/api/api.js'
import Tpl from './crumbs.tpl'
import './index.scss'

export default class Crumbs {

  constructor(paraObj) {
    this.data = {
      dom: '', // 包含组件的dom元素，唯一标识不能重复
      step: 1
    }
    this.setData(paraObj);
    this._render();

  }

  setData(data, info) {
    let oldData = this[info || 'data'];
    let newData = $.extend(oldData, data);
    this[info || 'data'] = newData;
  }

  _render() {
    let $box = $(template.compile(Tpl)({ data: this.data }))
    $(`${this.data.dom}`).html($box)
  }

  static show() {
    $('.crumbs-component').show()
  }

  static hide() {
    $('.crumbs-component').hide()
  }


}

Crumbs.render = function(paraObj) {
  return Crumbs.obj = new Crumbs(paraObj);
}
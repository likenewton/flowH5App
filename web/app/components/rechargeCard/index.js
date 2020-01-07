import { template } from '../../base/api/api.js'
import Tpl from './rechargeCard.tpl'
import './index.scss'

export default class RecargeCard {

  constructor(paraObj) {
    this.data = {
      list: [], // 数据列表
    }
    this.setData(paraObj);
    this._render()
  }

  setData(data, info) {
    let oldData = this[info || 'data'];
    let newData = $.extend(oldData, data);
    this[info || 'data'] = newData;
  }

  _render() {

    let $box = $(template.compile(Tpl)({ data : this.data }))

    $(`${this.data.dom}`).html($box)

    this.addEvents();

  }

  addEvents() {
    let self = this;
    let $doc = $(document);

  }

}

RecargeCard.render = function(paraObj) {
  return RecargeCard.obj = new RecargeCard(paraObj);
}
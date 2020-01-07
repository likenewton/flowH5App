import { template } from '../../base/api/api.js'
import Tpl from './rapidinput.tpl'
import './index.scss'

export default class Rapidinput {

  constructor(paraObj) {
    this.data = {
      dom: '', // 包含组件的dom元素，唯一标识不能重复
      choice: null, // rapid-item被选中触发
      max: 3, // 最多保留几条数据
      list: [], // 数据列表
    }
    this.setData(paraObj);
    this._render();
    this.addEvents();
  }

  setData(data, info) {
    let oldData = this[info || 'data'];
    let newData = $.extend(oldData, data);
    this[info || 'data'] = newData;
  }

  _render() {
    this.data.list = this.getHistory()
    let $box = $(template.compile(Tpl)({ data: this.data }))
    if ($(`${this.data.dom} + .rapid-input`).length > 0) {
      $(`${this.data.dom} + .rapid-input`).remove()
    }
    if (this.data.list.length > 0) {
      $(`${this.data.dom}`).after($box)
      $(`${this.data.dom} + .rapid-input`).css('top', '0.68rem')
    }
  }

  addEvents() {
    let $dom = $(`${this.data.dom}`);

    $(document).on('click', `${this.data.dom} + .rapid-input .rapid-item`, (e) => {
      $(`${this.data.dom}`).val($(e.currentTarget).text())
    })

    $(document).on('focus', `${this.data.dom}`, () => {
      $(`${this.data.dom} + .rapid-input`).slideDown(100)
    })

    $(document).on('blur', `${this.data.dom}`, () => {
      setTimeout(() => { $(`${this.data.dom} + .rapid-input`).slideUp(100) }, 100)
    })

  }

  getHistory() {
    let historyList = localStorage.getItem($(`${this.data.dom}`).attr('name'))
    if (historyList) {
      return JSON.parse(historyList)
    } else {
      return []
    }
  }

  setHistory() {
    let key = $(`${this.data.dom}`).attr('name');
    let value = $(`${this.data.dom}`).val()

    if (value.trim()) {
      let historyList = localStorage.getItem(key)
      if (historyList) {
        historyList = JSON.parse(historyList)
        historyList.unshift(value)
        historyList = Array.from(new Set(historyList))
        historyList = historyList.slice(0, this.data.max)
        localStorage.setItem(key, JSON.stringify(historyList))
        this.data.list = historyList
      } else {
        localStorage.setItem(key, JSON.stringify([value]))
        this.data.list = [value]
      }
      this._render()
    }
  }

}

Rapidinput.render = function(paraObj) {
  return new Rapidinput(paraObj);
}
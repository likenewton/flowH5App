import Popup from './popup';
import RecargeCard from './rechargeCard';
import RapidInput from './rapidinput';
import Crumbs from './crumbs';
import Cpopup from './cpopup'; 
import Tip from './tip'; 

Tip.init()
Cpopup.init()

module.exports = {
  // === 公共组件
  Popup, // 弹框
  RecargeCard, // 充值流量套餐卡片
  RapidInput, // 快速输入
  Crumbs, // 头部面包屑
}
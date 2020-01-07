{{each data.list item}}
<div class="recharge-card">
  <div class="top clearfix {{if item.isRecom}}recom{{/if}}">
    <div class="left fbs-left">
      <div class="combo-amount">1G</div>
      <div class="combo-type">全国流量</div>
    </div>
    <div class="right fbs-right">
      <div class="flow-calc">
        <span>{{formatFlowUnit(item.total, 0, true)}}</span>
        <span>一年</span>
        <span>（每月{{formatFlowUnit(item.avg, 2, true)}}）</span>
      </div>
      <div class="flow-price">
        <span class="clearbymouth">月结会清零</span>
        <span class="price">￥166.00</span>
      </div>
      <img class="recommended" src="../../static/images/recom.png">
    </div>
  </div>
  <div class="content">12个月有效，按12个月分配流量，每月分配341.33M，流量月结清零；可叠加购买，全国通用；流量卡只允许在指定的设备端使用。</div>
</div>
{{/each}}
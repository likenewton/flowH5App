<div class="background"></div>
<div class="outer {{data.type}}">
  <div class="inner" style="animation-duration: {{data.animateTime / 1000}}s;">
    <div class="title">
      <h4>{{data.title || '提示'}}</h4>
    </div>
    <div class="content">{{data.body}}</div>
    <div class="footer">
      <span class="popup-btn cancel-btn {{if !data.isShowCancelBtn}}hide{{/if}}">{{data.cancelBtn}}</span>
      <span class="popup-btn ok-btn {{if !data.isShowOkBtn}}hide{{/if}}">{{data.okBtn}}</span>
    </div>
  </div>
</div>
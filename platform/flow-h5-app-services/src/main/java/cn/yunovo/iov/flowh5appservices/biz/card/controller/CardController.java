package cn.yunovo.iov.flowh5appservices.biz.card.controller;

import cn.yunovo.iov.flowh5appservices.framework.configuation.CardInfoH5ConfigProperties;
import cn.yunovo.iov.flowh5appservices.manage.CcGprsCard;
import cn.yunovo.iov.flowh5appservices.manage.FlowCenterCoreService;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.BooleanUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.view.RedirectView;

/**
 * @author bill
 * @date 2020/5/9 16:58
 * @since 1.0
 */
@Controller
@Slf4j
public class CardController {

    private CardInfoH5ConfigProperties cardInfoH5ConfigProperties;
    private FlowCenterCoreService flowCenterCoreService;

    public CardController(CardInfoH5ConfigProperties properties,
                          FlowCenterCoreService flowCenterCoreService){
        this.cardInfoH5ConfigProperties = properties;
        this.flowCenterCoreService = flowCenterCoreService;
    }

    /**
     * 流量H5首页，搜索页
     * @param iccid
     * @Desc
     * @return
     */
    @RequestMapping(path={"/", "/app/main/index", "/app/main/index/"}, method = RequestMethod.GET)
    public RedirectView index(String iccid){

        RedirectView redirectView = new RedirectView();
        redirectView.setUrl(cardInfoH5ConfigProperties.getIndexPageUrl() + (StringUtils.isNotEmpty(iccid) ? "?iccid="+iccid : ""));
        return redirectView;
    }

    /**
     * 详情页
     * @param iccid
     * @param from
     * @param unlock
     * @return
     */
    @RequestMapping(path={"/app/main/info"}, method = RequestMethod.GET)
    public RedirectView info(String iccid, String from, Integer unlock){

        String url = cardInfoH5ConfigProperties.getCardInfoPageUrl();
        RedirectView redirectView = new RedirectView();
        if(StringUtils.isBlank(iccid)){
            return this.index(iccid);
        }

        CcGprsCard card = flowCenterCoreService.info(iccid);
        if(card == null){
            return this.index(iccid);
        }

        //判断是否需要机卡分离解锁
        if(unlock != null && BooleanUtils.toBooleanObject(unlock)){
            if(card.getOrg_id() == 76 && card.getUnicom_stop() != null && BooleanUtils.toBooleanObject(card.getUnicom_stop()) && card.getCard_type() >= 2 && card.getMax_unused() > 0){

                boolean flag = true;

                try {
                    flag = flowCenterCoreService.onoffCard(card.getCard_iccid(), 0, "selfop");
                } catch (Exception e) {
                    log.error("[info]params={iccid:{},from:{},unlock:{}},exception={}", iccid, from, unlock, ExceptionUtils.getStackTrace(e));
                    flag = false;
                }

                if(flag){
                    card.setUnicom_stop((short)0);
                    try {
                        flowCenterCoreService.updateCardInfo(card);
                    } catch (Exception e) {
                        log.error("[info]params={iccid:{},from:{},unlock:{},card:{}},exception={}", iccid, from, unlock, JSONObject.toJSONString(card), ExceptionUtils.getStackTrace(e));
                    }
                }
            }
        }


        redirectView.setUrl(url + "?queryIccid="+iccid);
        return redirectView;
    }

    /**
     * 充值历史页
     * @param iccid
     * @return
     */
    @RequestMapping(path={"/app/main/paylog"}, method = RequestMethod.GET)
    public RedirectView paylog(String iccid){

        String url = cardInfoH5ConfigProperties.getPayLogPageUrl();
        RedirectView redirectView = new RedirectView();
        if(StringUtils.isBlank(iccid)){
            url = cardInfoH5ConfigProperties.getIndexPageUrl();
            redirectView.setUrl(url);
            return redirectView;
        }

        CcGprsCard card = flowCenterCoreService.info(iccid);
        if(card == null){
            return this.index(iccid);
        }

        redirectView.setUrl(url + "?" + iccid);
        return redirectView;
    }

    /**
     * 充值套餐页
     * @param iccid
     * @param packid
     * @param backurl
     * @param paysn
     * @param from
     * @return
     */
    @RequestMapping(path={"/app/main/topup"}, method = RequestMethod.GET)
    public RedirectView topup(String iccid, String packid, String backurl, String paysn, String from){

        String url = null;
        RedirectView redirectView = new RedirectView();
        if(StringUtils.isBlank(iccid)){
            url = cardInfoH5ConfigProperties.getIndexPageUrl();;
            redirectView.setUrl(url);
            return redirectView;
        }

        CcGprsCard card = flowCenterCoreService.info(iccid);
        if(card == null){
            return this.index(iccid);
        }

        String fromFlag = StringUtils.defaultIfBlank(from, "yzzx");
        if(StringUtils.isBlank(packid)){
            return this.toTopupPack(redirectView, iccid, fromFlag);
        }else{
            return this.toBuy(redirectView, iccid, packid, fromFlag);
        }

    }



    private RedirectView toTopupPack(RedirectView redirectView, String iccid, String from){

        String url = cardInfoH5ConfigProperties.getFlowPackagePageUrl() + String.format("?cardManageIccid=%s&from=%s",iccid, from);
        redirectView.setUrl(url);
        return redirectView;
    }

    private RedirectView toBuy(RedirectView redirectView, String iccid, String packid, String from){

        String url = cardInfoH5ConfigProperties.getPackageDetailPageUrl() + String.format("?packid=%s&iccid=%s&ispay=1&from=%s", packid, iccid, from);
        redirectView.setUrl(url);
        return redirectView;
    }
}

package cn.yunovo.iov.flowh5appservices.biz.card.controller;

import cn.yunovo.iov.flowh5appservices.framework.configuation.CardInfoH5ConfigProperties;
import org.apache.commons.lang3.StringUtils;
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
public class CardControllerr {

    private CardInfoH5ConfigProperties cardInfoH5ConfigProperties;

    public CardControllerr(CardInfoH5ConfigProperties properties){
        this.cardInfoH5ConfigProperties = properties;
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
        redirectView.setUrl(cardInfoH5ConfigProperties.getIndexPageUrl());
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
            url = cardInfoH5ConfigProperties.getIndexPageUrl();
            redirectView.setUrl(url);
            return redirectView;
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

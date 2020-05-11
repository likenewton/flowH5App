package cn.yunovo.iov.flowh5appservices.framework.configuation;

import com.alibaba.nacos.api.config.ConfigType;
import com.alibaba.nacos.api.config.annotation.NacosConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * @author bill
 * @date 2020/5/11 16:17
 * @since 1.0
 */
@Component
@NacosConfigurationProperties(dataId = "CardInfoH5ConfigProperties.properties", groupId = "cn.yunovo.iov.flowh5appservices.framework.configuation", type = ConfigType.PROPERTIES, autoRefreshed = true)
public class CardInfoH5ConfigProperties {


    /**
     * 流量卡信息查询H5 首页，搜索页 url
     */
    private String indexPageUrl = "http://wx.yunovo.cn/wechat/view/flow/searchcard.html";

    /**
     * 卡信息详情页URL
     */
    private String cardInfoPageUrl = "http://wx.yunovo.cn/wechat/view/flow/payquery.html";

    /**
     * 流量卡充值历史页 URL
     */
    private String payLogPageUrl = "http://wx.yunovo.cn/wechat/view/flow/topuprecord.html";

    /**
     * 流量卡充值套餐列表页 URL
     */
    private String flowPackagePageUrl = "http://wx.yunovo.cn/wechat/view/flow/buylist.html";

    /**
     * 套餐详情页URL
     */
    private String packageDetailPageUrl = "http://wx.yunovo.cn/wechat/view/flow/buydetail.html";



    public String getIndexPageUrl() {
        return indexPageUrl;
    }

    public void setIndexPageUrl(String indexPageUrl) {
        this.indexPageUrl = indexPageUrl;
    }

    public String getCardInfoPageUrl() {
        return cardInfoPageUrl;
    }

    public void setCardInfoPageUrl(String cardInfoPageUrl) {
        this.cardInfoPageUrl = cardInfoPageUrl;
    }

    public String getFlowPackagePageUrl() {
        return flowPackagePageUrl;
    }

    public void setFlowPackagePageUrl(String flowPackagePageUrl) {
        this.flowPackagePageUrl = flowPackagePageUrl;
    }

    public String getPackageDetailPageUrl() {
        return packageDetailPageUrl;
    }

    public void setPackageDetailPageUrl(String packageDetailPageUrl) {
        this.packageDetailPageUrl = packageDetailPageUrl;
    }

    public String getPayLogPageUrl() {
        return payLogPageUrl;
    }

    public void setPayLogPageUrl(String payLogPageUrl) {
        this.payLogPageUrl = payLogPageUrl;
    }
}

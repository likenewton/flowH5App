package cn.yunovo.iov.flowh5appservices.manage;

import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

/**
 * 流量中心核心服务调用类
 * @author bill
 * @date 2019/12/20 10:49
 * @since 1.0
 */
@Slf4j
public class FlowCenterCoreService {

    private RestTemplate coreServiceRestTemplate;
    private String host;

    private final static String ACTIVATE_CARD_URL = "/core/card/activate?iccid={iccid}";
    private final static String RESET_CARD_URL = "/core/card/reset?iccid={iccid}&optName={optName}";
    private final static String ONOFF_URL = "/core/card/onoff?iccid={iccid}&optName={optName}&status={status}";
    private final static String ALLOW_URL = "/core/card/allot?iccid={iccid}";
    private final static String CALCULATE_URL = "/core/card/calculate?iccid={iccid}&usedTotal={usedTotal}&usedMonth={usedMonth}&isUnicom={isUnicom}&openCard={openCard}&currentMonth={currentMonth}";
    private final static String SYNC_UNICOM_DATA_URL = "/core/card/syncUnicomData?iccid={iccid}";
    private final static String CALCULATE_ASSIGN_CARD_URL = "/core/card/calculateAssignCard?iccid={iccid}&usedTotal={usedTotal}&usedMonth={usedMonth}&isUnicom={isUnicom}&openCard={openCard}&currentMonth={currentMonth}";

    /**
     * 流量卡信息获取接口URL
     */
    private final static String CARDINFO_URL = "/core/cards?iccid={iccid}";

    /**
     * 流量卡信息更新URL
     */
    private final static String CARDINFO_UPDATE_URL = "/core/cards";


    public FlowCenterCoreService(RestTemplate coreServiceRestTemplate, String host){
        this.coreServiceRestTemplate = coreServiceRestTemplate;
        this.host = host;
    }

    /**
     * 流量卡激活
     * @param iccid 卡iccid
     * @return 激活后卡的最新信息
     */
    public CcGprsCard activateCard(String iccid){

        Map<String, String> uriParams = new HashMap<>(1);
        uriParams.put("iccid", iccid);
        String result = this.coreServiceRestTemplate.getForObject(this.host + ACTIVATE_CARD_URL, String.class, uriParams);
        log.info("[activateCard]params={iccid:{}},result={}", iccid, result);
        JSONObject data = JSONObject.parseObject(result);
        if(isSuccess(data) ){
            return data.getObject(DATA, CcGprsCard.class);
        }else{
            return null;
        }
        //return JSONObject.parseObject(result, CcGprsCard.class);
    }

    /**
     * 卡充值
     * @param iccid 卡iccid
     * @param optName 操作者姓名
     * @return true 操作成功， false  操作失败
     */
    public CardRestBean resetCard(String iccid, String optName) {

        Map<String, String> uriParams = new HashMap<>(1);
        uriParams.put("iccid", iccid);
        uriParams.put("optName", optName);
        String result = this.coreServiceRestTemplate.getForObject(this.host + RESET_CARD_URL, String.class, uriParams);

        log.info("[resetCard]params={iccid:{},optName:{}},result={}", iccid, optName, result);
        JSONObject data = JSONObject.parseObject(result);
        if(isSuccess(data) ){
            return data.getObject(DATA, CardRestBean.class);
        }else{
            throw new CoreServiceException("resetCard failed");
        }
    }

    /**
     * 执行开卡or 停卡操作
     * @param iccid 卡iccid
     * @param status 状态，1 停卡， 0 开卡
     * @param optName 操作者姓名
     * @return true 操作成功，false 操作失败
     */
    public boolean onoffCard(String iccid, Integer status, String optName){
        Map<String, Object> uriParams = new HashMap<>(3);
        uriParams.put("iccid", iccid);
        uriParams.put("status", status);
        uriParams.put("optName", optName);
        String result = this.coreServiceRestTemplate.getForObject(this.host + ONOFF_URL, String.class, uriParams);
        log.info("[onoffCard]params={iccid:{},status:{},optName:{}},result={}", iccid, status, optName, result);
        JSONObject data = JSONObject.parseObject(result);
        if(isSuccess(data)){
            return data.getBooleanValue(DATA);
        }else{
            return false;
        }
    }

    /**
     * 流量分配
     * @param iccid 卡iccid
     * @return true 操作成功，false 操作失败
     */
    public boolean allotCardFlowValue(String iccid){

        Map<String, Object> uriParams = new HashMap<>(1);
        uriParams.put("iccid", iccid);
        String result = this.coreServiceRestTemplate.getForObject(this.host + ALLOW_URL, String.class, uriParams);
        log.info("[allotCardFlowValue]params={iccid:{}},result={}", iccid, result);
        JSONObject data = JSONObject.parseObject(result);
        if(isSuccess(data)){
            return data.getBooleanValue(DATA);
        }else{
            throw new CoreServiceException("allotCardFlowValue failed");
        }
    }

    /**
     * 流量计算
     * @param iccid 卡iccid
     * @param usedTotal 总消耗流量
     * @param usedMonth 月消耗流量
     * @param isUnicom 数据是否来源运营商，true 表示运营商，false设备上报等非运营商数据
     * @param openCard 计算过程中是否执行开卡操作
     * @param currentMonth 计算的账单月
     * @return CcGprsCard 计算后的流量卡信息
     */
    public CcGprsCard calculateCardFlow(String iccid, Double usedTotal, Double usedMonth, Boolean isUnicom, Boolean openCard, Integer currentMonth){

        Map<String, Object> uriParams = new HashMap<>(6);
        uriParams.put("iccid", iccid);
        uriParams.put("usedTotal", usedTotal);
        uriParams.put("usedMonth", usedMonth);
        uriParams.put("isUnicom", isUnicom);
        uriParams.put("openCard", openCard);
        uriParams.put("currentMonth", currentMonth);
        String result = null;
        try {
            result = this.coreServiceRestTemplate.getForObject(this.host + CALCULATE_URL, String.class, uriParams);
        } catch (RestClientException e) {
            log.warn("[calculateCardFlow][异常]params={},exception={}", JSONObject.toJSONString(uriParams), ExceptionUtils.getStackTrace(e));
            return null;
        }
        log.info("[calculateCardFlow]params={},result={}", JSONObject.toJSONString(uriParams), result);
        JSONObject data = JSONObject.parseObject(result);
        if(isSuccess(data) ){
            return data.getObject(DATA, CcGprsCard.class);
        }else{
            return null;
        }
    }

    /**
     * 流量计算
     * @param card 需要被计算的流量卡信息
     * @param usedTotal 总消耗流量
     * @param usedMonth 月消耗流量
     * @param isUnicom 数据是否来源运营商，true 表示运营商，false设备上报等非运营商数据
     * @param openCard 计算过程中是否执行开卡操作
     * @param currentMonth 计算的账单月
     * @return CcGprsCard 计算后的流量卡信息
     */
    public CcGprsCard calculateAssignCard(CcGprsCard card, Double usedTotal, Double usedMonth, Boolean isUnicom, Boolean openCard, Integer currentMonth){

        Map<String, Object> uriParams = new HashMap<>(6);
        uriParams.put("iccid", card.getCard_iccid());
        uriParams.put("usedTotal", usedTotal);
        uriParams.put("usedMonth", usedMonth);
        uriParams.put("isUnicom", isUnicom);
        uriParams.put("openCard", openCard);
        uriParams.put("currentMonth", currentMonth);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON_UTF8);
        headers.add("Accept", MediaType.APPLICATION_JSON_UTF8_VALUE);
        HttpEntity<String> httpEntity = new HttpEntity<>(JSONObject.toJSONString(card), headers);

        String result = null;
        try {
            result = this.coreServiceRestTemplate.postForObject(this.host + CALCULATE_ASSIGN_CARD_URL, httpEntity, String.class, uriParams);
        } catch (RestClientException e) {
            log.warn("[calculateAssignCard][异常]params={},exception={}", JSONObject.toJSONString(uriParams), ExceptionUtils.getStackTrace(e));
            return null;
        }

        log.info("[calculateAssignCard]params={},result={}", JSONObject.toJSONString(uriParams), result);
        JSONObject data = JSONObject.parseObject(result);
        if(isSuccess(data)){
            return data.getObject(DATA, CcGprsCard.class);
        }else{
            return null;
        }
    }

    /**
     * 同步流量卡运营商数据
     * @param iccid 流量卡iccid
     * @return 同步后的结果
     */
    public UnicomDataBean syncUnicomData(String iccid){

        Map<String, Object> uriParams = new HashMap<>(1);
        uriParams.put("iccid", iccid);
        String result = this.coreServiceRestTemplate.getForObject(this.host + SYNC_UNICOM_DATA_URL, String.class, uriParams);
        log.info("[syncUnicomData]params={iccid:{}},result={}", iccid, result);
        JSONObject data = JSONObject.parseObject(result);

        if(isSuccess(data)){
            return data.getObject(DATA, UnicomDataBean.class);
        }else{
            throw new CoreServiceException("syncUnicomData failed");
        }
    }

    /**
     * 通过ICCID获取流量卡信息
     * @param iccid 卡ICCID
     * @return CcGprsCard 对象
     */
    public CcGprsCard info(String iccid){

        if(StringUtils.isEmpty(iccid)){
            return null;
        }

        Map<String, String> uriParams = new HashMap<>(1);
        uriParams.put("iccid", iccid);
        String result = this.coreServiceRestTemplate.getForObject(this.host + CARDINFO_URL, String.class, uriParams);
        JSONObject data = JSONObject.parseObject(result);
        if(isSuccess(data)){
            return data.getObject(DATA, CcGprsCard.class);
        }else{
            log.warn("[info][获取流量卡信息失败]params={},result={}", iccid, result);
            return null;
        }
    }

    public boolean updateCardInfo(CcGprsCard card){

        if(card == null || card.getCard_id() == null){
            log.warn("[updateCardInfo][数据有误]params={}", JSONObject.toJSONString(card));
            return false;
        }

        String result = null;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON_UTF8);
        headers.add("Accept", MediaType.APPLICATION_JSON_UTF8_VALUE);
        HttpEntity<String> httpEntity = new HttpEntity<>(JSONObject.toJSONString(card), headers);

        try {
            result = this.coreServiceRestTemplate.postForObject(this.host + CARDINFO_UPDATE_URL, httpEntity, String.class);
        } catch (RestClientException e) {
            log.warn("[updateCardInfo][异常]params={},exception={}", JSONObject.toJSONString(card), ExceptionUtils.getStackTrace(e));
            throw new CoreServiceException("update card info exception, msg:"+e.getMessage());
        }

        JSONObject data = JSONObject.parseObject(result);
        if(isSuccess(data)){
            return true;
        }else{
            log.warn("[updateCardInfo][更新失败]params={},result={}", JSONObject.toJSONString(card), result);
            return false;
        }

    }



    private static final String CODE = "code";
    /*private static final String ERROR_CODE = "errorCode";*/
    private static final String DATA = "data";
    private static final String SUCESS_CODE = "0";

    /**
     * 服务是否执行成功
     * @param data 返回json对象
     * @return true 成功， false 失败
     */
    private boolean isSuccess(JSONObject data){

        if(data == null || data.isEmpty()){
            return false;
        }

        return StringUtils.equals(SUCESS_CODE, data.getString(CODE));
    }


}

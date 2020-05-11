package cn.yunovo.iov.flowh5appservices.framework.configuation;

import cn.yunovo.iov.flowh5appservices.framework.http.HttpClientUtils;
import cn.yunovo.iov.flowh5appservices.manage.FlowCenterCoreService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.apache.http.impl.client.CloseableHttpClient;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

/**
 * @author bill
 * @date 2019/12/21 18:16
 * @since 1.0
 */
@Configuration
@Slf4j
public class FcCoreServiceConfiguration {

    @Value("${fcCoreServiceUrl:http://iov-fc-core-service-provider}")
    private String fcCoreServiceUrl;

    public ClientHttpRequestFactory simpleClientHttpRequestFactory(){
        try {
            CloseableHttpClient httpClient = HttpClientUtils.createHttpsClient();
            HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory(httpClient);
            return factory;
        } catch (Exception ex) {
            log.error("[simpleClientHttpRequestFactory]exception={}", ExceptionUtils.getStackTrace(ex));
            return null;
        }

    }

    @Bean(name="fcCoreServiceRestTemplate")
    @LoadBalanced
    public RestTemplate fcCoreServiceRestTemplate(){
        RestTemplate restTemplate = new RestTemplate(simpleClientHttpRequestFactory());
        return  restTemplate;
    }

    @Bean
    public FlowCenterCoreService flowCenterCoreService(@Qualifier("fcCoreServiceRestTemplate") RestTemplate restTemplate){

        FlowCenterCoreService flowCenterCoreService = new FlowCenterCoreService(restTemplate, fcCoreServiceUrl);
        return flowCenterCoreService;
    }
}

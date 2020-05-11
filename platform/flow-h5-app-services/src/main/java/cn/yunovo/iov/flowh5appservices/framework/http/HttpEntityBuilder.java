package cn.yunovo.iov.flowh5appservices.framework.http;

import com.alibaba.fastjson.JSONObject;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

/**
 * @author kk
 *
 * 2017年7月22日
 */


public class HttpEntityBuilder {

	public static HttpEntity build(String base64_auth, JSONObject jobj) {
		HttpHeaders headers = new HttpHeaders();
		MediaType type = MediaType.parseMediaType("application/json; charset=UTF-8");
		headers.setContentType(type);
		headers.add("Accept", MediaType.APPLICATION_JSON.toString());
		headers.add("Authorization", "Basic "+base64_auth);
		return new HttpEntity<String>(jobj.toString(), headers);
	}
}

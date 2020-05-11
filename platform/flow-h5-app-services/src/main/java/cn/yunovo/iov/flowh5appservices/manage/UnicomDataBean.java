package cn.yunovo.iov.flowh5appservices.manage;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.io.Serializable;

@Data
public class UnicomDataBean implements Serializable{

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;


	private Integer status;

	private String msg;

	@ApiModelProperty("流量卡状态")
	private Integer cardStatus;

	private Double consumeDataMon;

	private Double consumeDataAll;

}

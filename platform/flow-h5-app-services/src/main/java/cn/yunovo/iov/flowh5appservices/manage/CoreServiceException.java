package cn.yunovo.iov.flowh5appservices.manage;

/**
 * 业务异常处理类
 *
 * @author bill
 *
 */
public class CoreServiceException extends RuntimeException{

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 异常代码
	 */
	private Integer exception_code;

	public CoreServiceException(Integer exception_code, String message) {
		super(message);
		this.exception_code = exception_code;
	}

	public CoreServiceException(String message) {

		super(message);
		this.exception_code = -1;
	}

	public Integer getException_code() {
		return exception_code;
	}

	public void setException_code(Integer exception_code) {
		this.exception_code = exception_code;
	}


}

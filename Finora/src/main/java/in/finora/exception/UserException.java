package in.finora.exception;

import org.springframework.http.HttpStatus;

public class UserException extends RuntimeException {
	private static final long serialVersionUID = 1L;

    private final HttpStatus httpStatus;

    public UserException(String message, HttpStatus httpStatus) {
        super(message);
        // Set httpStatus; default to INTERNAL_SERVER_ERROR if null
        this.httpStatus = httpStatus != null ? httpStatus : HttpStatus.INTERNAL_SERVER_ERROR;  
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }
}

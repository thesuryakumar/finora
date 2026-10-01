package in.finora.exception;

import org.springframework.http.HttpStatus;

public class ExpenseException extends RuntimeException {
	private static final long serialVersionUID = 1L;

    private final HttpStatus httpStatus;

    public ExpenseException(String message, HttpStatus httpStatus) {
        super(message);
        // Default to INTERNAL_SERVER_ERROR if httpStatus is null
        this.httpStatus = httpStatus != null ? httpStatus : HttpStatus.INTERNAL_SERVER_ERROR;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }
}

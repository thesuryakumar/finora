package in.finora.exception;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

	// Handle UserException
    @ExceptionHandler(UserException.class)
    public ResponseEntity<Map<String, Object>> handleUserException(UserException userException) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("status", "failure");
        errorResponse.put("type", "User Exception");
        errorResponse.put("error", userException.getMessage());
        errorResponse.put("localTime", LocalDateTime.now());
        errorResponse.put("httpStatus", userException.getHttpStatus().toString());
        return new ResponseEntity<>(errorResponse, userException.getHttpStatus());
    }

    // Handle ExpenseException
    @ExceptionHandler(ExpenseException.class)
    public ResponseEntity<Map<String, Object>> handleExpenseException(ExpenseException expenseException) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("status", "failure");
        errorResponse.put("type", "Expense Exception");
        errorResponse.put("error", expenseException.getMessage());
        errorResponse.put("localTime", LocalDateTime.now());
        errorResponse.put("httpStatus", expenseException.getHttpStatus().toString());
        return new ResponseEntity<>(errorResponse, expenseException.getHttpStatus());
    }
	
}

package in.finora.request;

import java.time.LocalDate;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ExpenseAddRequest {
	  @NotNull(message = "Amount cannot be null")
	    @Min(value = 0, message = "Amount must be greater than or equal to 0")
	    private Double amount;

	    @NotBlank(message = "Category cannot be blank")
	    private String category;

	    private String description;
	    private String account;

	    @NotNull(message = "Date cannot be null")
	    private LocalDate date;

	    @NotNull(message = "User ID cannot be null")
	    private Long userId; // Link expense to a specific user
}

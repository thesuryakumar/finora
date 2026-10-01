package in.finora.response;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExpenseResponse {
	 private Long id;
	    private Double amount;
	    private String category;
	    private String description;
	    private LocalDate date;
	    private String account;
	    private Long userId; // User this expense belongs to
}

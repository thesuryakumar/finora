package in.finora.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AccountResponse {
    private Long id;
    private String accountName;
    private String type;
    private Double balance;
    private Long userId;
}

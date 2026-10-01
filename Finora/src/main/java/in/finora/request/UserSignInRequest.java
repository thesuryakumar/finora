package in.finora.request;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserSignInRequest {

	   @Email(message = "Invalid email format")
	    @NotBlank(message = "Email cannot be blank")
	    private String email;

	    @NotBlank(message = "Password cannot be blank")
	    private String password;
}

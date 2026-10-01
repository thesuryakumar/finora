package in.finora.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserUpdateRequest {
    
    @NotNull(message = "User ID cannot be null")
    private Long id;  // matches User entity's id

    @NotBlank(message = "Name cannot be blank")
    private String name;

    @NotBlank(message = "Email cannot be blank")
    private String email;

    private String password; // optional, only update if not blank

    private String profileImgUrl; // optional
}

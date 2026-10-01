package in.finora.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
	  private Long id;
	    private String name;
	    private String email;
	    private String role;
	    private String profileImgUrl;
	    private String profileImgUrlPublicId;
	    private int totalExpenses;
	    public UserResponse(Long id, String name, String email, String role, String profileImgUrl, String profileImgUrlPublicId) {
	        this.id = id;
	        this.name = name;
	        this.email = email;
	        this.role = role;
	        this.profileImgUrl = profileImgUrl;
	        this.profileImgUrlPublicId = profileImgUrlPublicId;
	    }
}

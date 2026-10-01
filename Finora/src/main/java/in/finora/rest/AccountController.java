package in.finora.rest;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import in.finora.entity.Account;
import in.finora.entity.User;
import in.finora.exception.UserException;
import in.finora.response.AccountResponse;
import in.finora.response.ApiResponse;
import in.finora.service.UserService;
import in.finora.service.impl.AccountServiceImpl;

@RestController
@RequestMapping("/accounts")
public class AccountController {

    @Autowired
    private AccountServiceImpl accountService;

    @Autowired
    private UserService userService;

    // ---------------- GET ACCOUNTS BY USER ----------------
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getAccountsByUser(@PathVariable Long userId) {
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new UserException("User not found", null));

        List<AccountResponse> accounts = accountService.getAccountsByUser(user)
                .stream()
                .map(acc -> new AccountResponse(
                        acc.getId(),
                        acc.getAccountName(),
                        acc.getType(),
                        acc.getBalance(),
                        acc.getUser().getId()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(new ApiResponse<>("success", "Accounts fetched successfully", accounts));
    }

    // ---------------- ADD ACCOUNT ----------------
    @PostMapping("/add")
    public ResponseEntity<?> addAccount(@RequestBody Account account) {
        Account saved = accountService.addAccount(account);
        return ResponseEntity.ok(new ApiResponse<>("success", "Account added", saved));
    }

    // ---------------- UPDATE ACCOUNT ----------------
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateAccount(@PathVariable Long id, @RequestBody Account account) {
        Account updated = accountService.updateAccount(id, account);
        return ResponseEntity.ok(new ApiResponse<>("success", "Account updated", updated));
    }

    // ---------------- DELETE ACCOUNT ----------------
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteAccount(@PathVariable Long id) {
        accountService.deleteAccount(id);
        return ResponseEntity.ok(new ApiResponse<>("success", "Account deleted successfully", null));
    }
}

package in.finora.rest;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import in.finora.entity.Expense;
import in.finora.entity.User;
import in.finora.exception.UserException;
import in.finora.request.ExpenseAddRequest;
import in.finora.request.ExpenseUpdateRequest;
import in.finora.response.ApiResponse;
import in.finora.response.ExpenseResponse;
import in.finora.service.ExpenseService;
import in.finora.service.UserService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/expense")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @Autowired
    private UserService userService;

    // ------------------- ADD EXPENSE -------------------
    @PostMapping("/add")
    public ResponseEntity<?> addExpense(@Valid @RequestBody ExpenseAddRequest request) {
        User user = userService.getUserById(request.getUserId())
                .orElseThrow(() -> new UserException("User not found", null));

        Expense expense = new Expense();
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setAccount(request.getAccount()); // <- added account
        expense.setDescription(request.getDescription());
        expense.setDate(request.getDate());
        expense.setUser(user);

        expense = expenseService.addExpense(expense);

        ExpenseResponse response = new ExpenseResponse(
                expense.getId(),
                expense.getAmount(),
                expense.getCategory(),
                expense.getDescription(),
                expense.getDate(),
                expense.getAccount(),
                expense.getUser().getId()
        );

        return ResponseEntity.ok(new ApiResponse<>("success", "Expense added", response));
    }

    // ------------------- GET ALL EXPENSES -------------------
    @GetMapping("/all")
    public ResponseEntity<?> getAllExpenses() {
        List<ExpenseResponse> expenses = expenseService.getAllExpenses()
                .stream()
                .map(exp -> new ExpenseResponse(
                        exp.getId(),
                        exp.getAmount(),
                        exp.getCategory(),
                        exp.getDescription(),
                        exp.getDate(),
                        exp.getAccount(),
                        exp.getUser().getId()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(new ApiResponse<>("success", "All expenses", expenses));
    }

    // ------------------- GET EXPENSES BY USER -------------------
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getExpensesByUser(@PathVariable Long userId) {
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new UserException("User not found", null));

        List<ExpenseResponse> expenses = expenseService.getExpensesByUser(user)
                .stream()
                .map(exp -> new ExpenseResponse(
                        exp.getId(),
                        exp.getAmount(),
                        exp.getCategory(),
                        exp.getDescription(),
                        exp.getDate(),
                        exp.getAccount(),
                        exp.getUser().getId()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(new ApiResponse<>("success", "Expenses by user", expenses));
    }

    // ------------------- UPDATE EXPENSE -------------------
    @PutMapping("/update")
    public ResponseEntity<?> updateExpense(@Valid @RequestBody ExpenseUpdateRequest request) {
        Expense existingExpense = expenseService.getExpenseById(request.getId())
                .orElseThrow(() -> new UserException("Expense not found", null));

        existingExpense.setAmount(request.getAmount());
        existingExpense.setCategory(request.getCategory());
        existingExpense.setAccount(request.getAccount()); // <- added account
        existingExpense.setDescription(request.getDescription());
        existingExpense.setDate(request.getDate());

        Expense updatedExpense = expenseService.updateExpense(existingExpense.getId(), existingExpense);

        ExpenseResponse response = new ExpenseResponse(
                updatedExpense.getId(),
                updatedExpense.getAmount(),
                updatedExpense.getCategory(),
                updatedExpense.getDescription(),
                updatedExpense.getDate(),
                updatedExpense.getAccount(),
                updatedExpense.getUser().getId()
        );

        return ResponseEntity.ok(new ApiResponse<>("success", "Expense updated", response));
    }

    // ------------------- DELETE EXPENSE -------------------
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.ok(new ApiResponse<>("success", "Expense deleted", null));
    }
}

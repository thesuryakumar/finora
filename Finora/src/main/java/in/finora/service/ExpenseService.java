package in.finora.service;

import java.util.List;
import java.util.Optional;

import in.finora.entity.Expense;
import in.finora.entity.User;

public interface ExpenseService {
	Expense addExpense(Expense expense);
    List<Expense> getAllExpenses();
    Optional<Expense> getExpenseById(Long id);
    Expense updateExpense(Long id, Expense updatedExpense);
    void deleteExpense(Long id);
    List<Expense> getExpensesByUser(User user);
    List<Expense> getExpensesByUserAndCategory(User user, String category);
}

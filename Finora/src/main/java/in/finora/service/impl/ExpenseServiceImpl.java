package in.finora.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import in.finora.entity.Expense;
import in.finora.entity.User;
import in.finora.repo.ExpenseRepo;
import in.finora.service.ExpenseService;

@Service
public class ExpenseServiceImpl implements ExpenseService {

    @Autowired
    private ExpenseRepo expenseRepo;

    @Override
    public Expense addExpense(Expense expense) {
        return expenseRepo.save(expense);
    }

    @Override
    public List<Expense> getAllExpenses() {
        return expenseRepo.findAll();
    }

    @Override
    public Optional<Expense> getExpenseById(Long id) {
        return expenseRepo.findById(id);
    }

    @Override
    public Expense updateExpense(Long id, Expense updatedExpense) {
        return expenseRepo.findById(id).map(expense -> {
            expense.setAmount(updatedExpense.getAmount());
            expense.setCategory(updatedExpense.getCategory());
            expense.setDescription(updatedExpense.getDescription());
            expense.setDate(updatedExpense.getDate());
            expense.setUser(updatedExpense.getUser());
            return expenseRepo.save(expense);
        }).orElseThrow(() -> new RuntimeException("Expense not found with id " + id));
    }

    @Override
    public void deleteExpense(Long id) {
        expenseRepo.deleteById(id);
    }

    @Override
    public List<Expense> getExpensesByUser(User user) {
        return expenseRepo.findByUser(user);
    }

    @Override
    public List<Expense> getExpensesByUserAndCategory(User user, String category) {
        return expenseRepo.findByUserAndCategory(user, category);
    }
}

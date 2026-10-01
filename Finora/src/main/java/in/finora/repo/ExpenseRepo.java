package in.finora.repo;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import in.finora.entity.Expense;
import in.finora.entity.User;

@Repository
public interface ExpenseRepo extends JpaRepository<Expense, Long> {
	 List<Expense> findByUser(User user);
	    List<Expense> findByUserAndCategory(User user, String category);
}

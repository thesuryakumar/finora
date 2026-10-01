package in.finora.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import in.finora.entity.Account;
import in.finora.entity.User;
import in.finora.repo.AccountRepository;

@Service
public class AccountServiceImpl {

    @Autowired
    private AccountRepository accountRepository;

    public List<Account> getAccountsByUser(User user) {
        return accountRepository.findByUser(user);
    }

    public Account addAccount(Account account) {
        return accountRepository.save(account);
    }

    
    public Account updateAccount(Long id, Account updatedAccount) {
        Account existing = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        existing.setAccountName(updatedAccount.getAccountName());
        existing.setType(updatedAccount.getType());
        existing.setBalance(updatedAccount.getBalance());

        return accountRepository.save(existing);
    }

    public void deleteAccount(Long id) {
        Account existing = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        accountRepository.delete(existing);
    }

}

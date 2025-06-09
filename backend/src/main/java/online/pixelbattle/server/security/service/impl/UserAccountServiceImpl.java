package online.pixelbattle.server.security.service.impl;

import jakarta.transaction.Transactional;
import online.pixelbattle.server.security.model.UserAccount;
import online.pixelbattle.server.security.repository.UserAccountRepository;
import online.pixelbattle.server.security.service.UserAccountService;
import online.pixelbattle.server.security.service.UsernameAlreadyExistsException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Transactional
public class UserAccountServiceImpl implements UserAccountService {
    private final UserAccountRepository userAccountRepository;

    public UserAccountServiceImpl(UserAccountRepository userAccountRepository) {
        this.userAccountRepository = userAccountRepository;
    }

    @Override
    public void createUserAccount(UserAccount userAccount) {
        boolean isUsernameExists = this.userAccountRepository.existsByUsername(userAccount.getUsername());

        if (isUsernameExists) {
            throw new UsernameAlreadyExistsException("Account with this username already exists");
        }
        this.userAccountRepository.save(userAccount);
    }

    @Override
    public Optional<UserAccount> findUserByUsername(String username) {
        return this.userAccountRepository.findByUsername(username);
    }
}

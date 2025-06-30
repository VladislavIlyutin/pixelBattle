package online.pixelbattle.server.security.service;

import online.pixelbattle.server.security.model.UserAccount;
import online.pixelbattle.server.security.repository.UserAccountRepository;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ActiveUserService {
    private final UserAccountRepository userAccountRepository;
    private final Duration activeThreshold = Duration.ofMinutes(5);;

    public ActiveUserService(UserAccountRepository userAccountRepository) {
        this.userAccountRepository = userAccountRepository;
    }

    public List<String> getActiveUsernames() {
        Instant threshold = Instant.now().minus(activeThreshold);
        return userAccountRepository.findByLastActivityAfter(threshold)
                .stream()
                .map(UserAccount::getUsername)
                .collect(Collectors.toList());
    }

    public void updateUserActivity(String username) {
        userAccountRepository.findByUsername(username).ifPresent(user -> {
            user.setLastActivity(Instant.now());
            userAccountRepository.save(user);
        });
    }
}

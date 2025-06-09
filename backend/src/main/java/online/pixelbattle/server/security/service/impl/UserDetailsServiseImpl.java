package online.pixelbattle.server.security.service.impl;

import jakarta.transaction.Transactional;
import online.pixelbattle.server.security.service.UserAccountService;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class UserDetailsServiseImpl implements UserDetailsService {

    private final UserAccountService userAccountService;

    public UserDetailsServiseImpl(UserAccountService userAccountService) {
        this.userAccountService = userAccountService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return this.userAccountService
                .findUserByUsername(username)
                .map(userAccount -> new User(
                        userAccount.getUsername(),
                        userAccount.getPassword(),
                        userAccount.getAuthorities()
                ))
                .orElseThrow(() -> new UsernameNotFoundException("Bad credentials"));
    }
}

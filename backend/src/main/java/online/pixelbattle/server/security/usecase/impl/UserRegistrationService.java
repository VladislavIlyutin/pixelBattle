package online.pixelbattle.server.security.usecase.impl;

import online.pixelbattle.server.security.mapper.RegisterRequestToUserMapper;
import online.pixelbattle.server.security.model.UserAccount;
import online.pixelbattle.server.security.service.UserAccountService;
import online.pixelbattle.server.security.usecase.RegistrationUseCase;
import online.pixelbattle.server.security.web.dto.RegisterRequest;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

@Component
public class UserRegistrationService implements RegistrationUseCase {

    private final UserAccountService userAccountService;
    private final RegisterRequestToUserMapper mapper;

    public UserRegistrationService(
            UserAccountService userAccountService,
            RegisterRequestToUserMapper mapper) {
        this.userAccountService = userAccountService;
        this.mapper = mapper;
    }

    @Override
    public void registerUserAccount(RegisterRequest registerRequest) {
        UserAccount userAccount = this.mapper.map(registerRequest);
        userAccount.getAuthorities().add(new SimpleGrantedAuthority("ROLE_USER"));
        this.userAccountService.createUserAccount(userAccount);
    }
}
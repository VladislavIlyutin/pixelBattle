package online.pixelbattle.server.security.usecase.impl;

import online.pixelbattle.server.security.mapper.UserAccountRegisterRequestToUserProfileMapper;
import online.pixelbattle.server.security.model.UserAccount;
import online.pixelbattle.server.security.service.UserAccountService;
import online.pixelbattle.server.security.usecase.UserAccountRegisterUseCase;
import online.pixelbattle.server.security.web.model.RegisterRequest;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

@Component
public class UserAccountRegisterUseCaseFacade implements UserAccountRegisterUseCase {

    private final UserAccountService userAccountService;
    private final UserAccountRegisterRequestToUserProfileMapper mapper;

    public UserAccountRegisterUseCaseFacade(
            UserAccountService userAccountService,
            UserAccountRegisterRequestToUserProfileMapper mapper) {
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
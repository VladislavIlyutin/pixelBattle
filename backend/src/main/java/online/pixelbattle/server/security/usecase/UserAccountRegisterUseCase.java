package online.pixelbattle.server.security.usecase;

import online.pixelbattle.server.security.web.model.RegisterRequest;

public interface UserAccountRegisterUseCase {
    void registerUserAccount(RegisterRequest registerRequest);
}

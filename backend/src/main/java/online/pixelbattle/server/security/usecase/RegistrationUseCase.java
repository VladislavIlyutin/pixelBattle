package online.pixelbattle.server.security.usecase;

import online.pixelbattle.server.security.web.dto.RegisterRequest;

public interface RegistrationUseCase {
    void registerUserAccount(RegisterRequest registerRequest);
}

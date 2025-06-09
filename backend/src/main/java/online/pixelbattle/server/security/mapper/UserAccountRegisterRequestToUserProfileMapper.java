package online.pixelbattle.server.security.mapper;

import online.pixelbattle.server.security.model.UserAccount;
import online.pixelbattle.server.security.web.model.RegisterRequest;

public interface UserAccountRegisterRequestToUserProfileMapper {
    UserAccount map(RegisterRequest registerRequest);
}

package online.pixelbattle.server.security.mapper;

import online.pixelbattle.server.security.model.UserAccount;
import online.pixelbattle.server.security.web.dto.RegisterRequest;

public interface RegisterRequestToUserMapper {
    UserAccount map(RegisterRequest registerRequest);
}

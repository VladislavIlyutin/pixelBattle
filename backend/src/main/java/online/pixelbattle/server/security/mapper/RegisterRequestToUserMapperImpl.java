package online.pixelbattle.server.security.mapper;
import online.pixelbattle.server.security.model.UserAccount;
import online.pixelbattle.server.security.web.dto.RegisterRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class RegisterRequestToUserMapperImpl
        implements RegisterRequestToUserMapper {

    private final PasswordEncoder passwordEncoder;

    public RegisterRequestToUserMapperImpl(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserAccount map(RegisterRequest registerRequest) {
        UserAccount userAccount = new UserAccount();
        userAccount.setUsername(registerRequest.username());
        userAccount.setPassword(passwordEncoder.encode(registerRequest.password()));
        return userAccount;
    }
}
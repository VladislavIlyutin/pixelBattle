package online.pixelbattle.server.security.web;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import online.pixelbattle.server.security.usecase.UserAccountRegisterUseCase;
import online.pixelbattle.server.security.web.model.RegisterRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Slf4j
@RestController
@RequestMapping(path = "api/accounts")
public class UserAccountController {

    private final UserAccountRegisterUseCase userAccountRegisterUseCase;
    private final JwtEncoder jwtEncoder;

    public UserAccountController(
            UserAccountRegisterUseCase userAccountRegisterUseCase,
            JwtEncoder jwtEncoder) {
        this.userAccountRegisterUseCase = userAccountRegisterUseCase;
        this.jwtEncoder = jwtEncoder;
    }

    @PostMapping("register")
    @ResponseStatus(HttpStatus.CREATED)
    public String registerAccount(@Valid @RequestBody RegisterRequest registerRequest) {
        userAccountRegisterUseCase.registerUserAccount(registerRequest);

        var jwtClaimsSet = JwtClaimsSet.builder()
                .issuer("pixelbattle")
                .subject(registerRequest.username())
                .expiresAt(Instant.now().plus(1, ChronoUnit.HOURS))
                .build();

        return jwtEncoder.encode(JwtEncoderParameters.from(jwtClaimsSet)).getTokenValue();
    }
}


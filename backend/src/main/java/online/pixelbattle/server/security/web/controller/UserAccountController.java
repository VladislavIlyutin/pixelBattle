package online.pixelbattle.server.security.web.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import online.pixelbattle.server.security.service.JwtService;
import online.pixelbattle.server.security.usecase.RegistrationUseCase;
import online.pixelbattle.server.security.web.dto.RegisterRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "api/accounts")
@RequiredArgsConstructor
public class UserAccountController {

    private final RegistrationUseCase userAccountRegisterUseCase;
    private final JwtService jwtService;


    @PostMapping("register")
    @ResponseStatus(HttpStatus.CREATED)
    public String registerAccount(@Valid @RequestBody RegisterRequest registerRequest) {
        userAccountRegisterUseCase.registerUserAccount(registerRequest);
        return jwtService.generateToken(registerRequest.username());
    }
}
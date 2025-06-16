package online.pixelbattle.server.game.controller;

import online.pixelbattle.server.game.config.CooldownConfig;
import online.pixelbattle.server.security.repository.UserAccountRepository;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

@RestController
@RequestMapping("/api/game")
public class CooldownController {

    private final UserAccountRepository userAccountRepository;
    private final CooldownConfig cooldownConfig;

    public CooldownController(
            UserAccountRepository userAccountRepository,
            CooldownConfig cooldownConfig
    ) {
        this.userAccountRepository = userAccountRepository;
        this.cooldownConfig = cooldownConfig;
    }

    @GetMapping("/cooldown")
    public CooldownResponse getCooldown(Authentication authentication) {
        if (authentication instanceof AnonymousAuthenticationToken) {
            return new CooldownResponse(0);
        }

        String username = authentication.getName();
        long remaining = userAccountRepository.findByUsername(username)
                .map(u -> {
                    Instant lastChanged = u.getLastPixelChange();
                    if (lastChanged == null) return 0L;

                    long secondsSinceLastChange =
                            Instant.now().getEpochSecond() - lastChanged.getEpochSecond();
                    long cooldownSeconds = cooldownConfig.getSeconds();

                    return Math.max(cooldownSeconds - secondsSinceLastChange, 0L);
                })
                .orElse(0L);

        return new CooldownResponse(remaining);
    }

    private record CooldownResponse(long remainingSeconds) {}
}
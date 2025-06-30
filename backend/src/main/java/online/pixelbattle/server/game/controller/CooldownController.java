package online.pixelbattle.server.game.controller;

import online.pixelbattle.server.game.service.CooldownService;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/game")
public class CooldownController {
    private final CooldownService cooldownService;

    public CooldownController(CooldownService cooldownService) {
        this.cooldownService = cooldownService;
    }

    @GetMapping("/cooldown")
    public CooldownResponse getCooldown(Authentication authentication) {
        String username = authentication.getName();
        long remaining = cooldownService.calculateRemainingCooldown(username);
        return new CooldownResponse(remaining);
    }

    private record CooldownResponse(long remainingSeconds) {}
}
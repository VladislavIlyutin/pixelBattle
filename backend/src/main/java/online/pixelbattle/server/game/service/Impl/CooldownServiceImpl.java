package online.pixelbattle.server.game.service.Impl;

import online.pixelbattle.server.game.config.CooldownConfig;
import online.pixelbattle.server.game.service.CooldownService;
import online.pixelbattle.server.security.model.UserAccount;
import online.pixelbattle.server.security.service.UserAccountService;
import org.springframework.stereotype.Service;
import java.time.Instant;

@Service
public class CooldownServiceImpl implements CooldownService {

    private final UserAccountService userAccountService;
    private final CooldownConfig cooldownConfig;

    public CooldownServiceImpl(UserAccountService userAccountService,
                               CooldownConfig cooldownConfig) {
        this.userAccountService = userAccountService;
        this.cooldownConfig = cooldownConfig;
    }

    @Override
    public long calculateRemainingCooldown(String username) {
        return userAccountService.findUserByUsername(username)
                .map(this::calculateCooldown)
                .orElse(0L);
    }

    private long calculateCooldown(UserAccount user) {
        Instant lastChanged = user.getLastPixelChange();
        if (lastChanged == null) return 0L;

        long secondsSinceLastChange = Instant.now().getEpochSecond() - lastChanged.getEpochSecond();
        return Math.max(cooldownConfig.getSeconds() - secondsSinceLastChange, 0L);
    }
}
package online.pixelbattle.server.game.service;

public interface CooldownService {
    long calculateRemainingCooldown(String username);
}

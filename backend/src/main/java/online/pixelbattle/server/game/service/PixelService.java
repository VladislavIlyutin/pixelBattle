package online.pixelbattle.server.game.service;

import online.pixelbattle.server.game.config.CooldownConfig;
import online.pixelbattle.server.game.config.GridConfig;
import online.pixelbattle.server.game.dto.PixelResponseDTO;
import online.pixelbattle.server.game.model.Pixel;
import online.pixelbattle.server.game.repository.PixelRepository;
import online.pixelbattle.server.security.model.UserAccount;
import online.pixelbattle.server.security.repository.UserAccountRepository;
import online.pixelbattle.server.security.service.ActiveUserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@Transactional
public class PixelService {

    private final PixelRepository pixelRepository;
    private final UserAccountRepository userAccountRepository;
    private final GridConfig gridConfig;
    private final CooldownConfig cooldownConfig;
    private final ActiveUserService activeUserService;

    public PixelService(PixelRepository pixelRepository, UserAccountRepository userAccountRepository,
                        GridConfig gridConfig, CooldownConfig cooldownConfig, ActiveUserService activeUserService) {
        this.pixelRepository = pixelRepository;
        this.userAccountRepository = userAccountRepository;
        this.gridConfig = gridConfig;
        this.cooldownConfig = cooldownConfig;
        this.activeUserService = activeUserService;
    }

    public void changeColor(int x, int y, String newColor, String username) {

        UserAccount account = userAccountRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Пользователь не найден"));

        if (account.getLastPixelChange() != null &&
                account.getLastPixelChange().isAfter(Instant.now().minusSeconds(cooldownConfig.getSeconds()))) {
            throw new RuntimeException("Вы можете менять пиксель только раз в " + cooldownConfig.getSeconds() + " сек.");
        }

        Pixel pixel = pixelRepository.findByXAndY(x, y);

        pixel.setColor(newColor);
        pixel.setOwner(account);

        pixelRepository.save(pixel);

        activeUserService.updateUserActivity(username);
        account.setLastPixelChange(Instant.now());
        userAccountRepository.save(account);
    }

    public List<PixelResponseDTO> getAllPixels() {
        return pixelRepository.findAllByOrderByIdAsc().stream()
                .map(pixel -> new PixelResponseDTO(pixel.getX(), pixel.getY(), pixel.getColor()))
                .toList();
    }

    public void createGridIfNotExists() {
        int width = gridConfig.getWidth();
        int height = gridConfig.getHeight();
        long expectedCount = (long) width * height;

        if (pixelRepository.count() != expectedCount) {
            pixelRepository.deleteAll();

            for (int y = 0; y < height; y++) {
                for (int x = 0; x < width; x++) {
                    Pixel pixel = new Pixel();
                    pixel.setX(x);
                    pixel.setY(y);
                    pixel.setId(y * width + x);
                    pixel.setColor("#FFFFFF");
                    pixelRepository.save(pixel);
                }
            }
        }
    }
}
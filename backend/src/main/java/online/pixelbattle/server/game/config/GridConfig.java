package online.pixelbattle.server.game.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "pixel-battle.grid")
public class GridConfig {
    private int width;
    private int height;
}

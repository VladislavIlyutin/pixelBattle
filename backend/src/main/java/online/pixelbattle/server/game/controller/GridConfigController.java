package online.pixelbattle.server.game.controller;

import online.pixelbattle.server.game.config.GridConfig;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/game")
public class GridConfigController {

    private final GridConfig gridConfig;

    public GridConfigController(GridConfig gridConfig) {
        this.gridConfig = gridConfig;
    }

    @GetMapping("/grid/config")
    public Map<String, Integer> getGridConfig() {
        return Map.of(
                "width", gridConfig.getWidth(),
                "height", gridConfig.getHeight()
        );
    }
}
package online.pixelbattle.server.game.service;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class GridInitializer {

    private final PixelService pixelService;

    public GridInitializer(PixelService pixelService) {
        this.pixelService = pixelService;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void initializeGrid() {
        pixelService.createGridIfNotExists();
    }
}
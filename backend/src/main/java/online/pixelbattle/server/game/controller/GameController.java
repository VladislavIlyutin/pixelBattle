package online.pixelbattle.server.game.controller;

import lombok.RequiredArgsConstructor;
import online.pixelbattle.server.game.dto.PixelResponseDTO;
import online.pixelbattle.server.game.service.PixelService;

import online.pixelbattle.server.game.sse.GameSseController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/game")
@RequiredArgsConstructor
@PreAuthorize("permitAll")
public class GameController {

    private final PixelService pixelService;
    @Autowired
    private GameSseController sseController;

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/change-color")
    public void changeColor(@RequestBody PixelResponseDTO dto,
                            Authentication authentication) {

        pixelService.changeColor(dto.getX(), dto.getY(), dto.getColor(), authentication.getName());

        PixelResponseDTO response = new PixelResponseDTO(dto.getX(), dto.getY(), dto.getColor());
        sseController.notifyClients(response);
    }

    @GetMapping("/grid")
    public List<PixelResponseDTO> getGrid() {
        return pixelService.getAllPixels().stream()
                .map(p -> new PixelResponseDTO(p.getX(), p.getY(), p.getColor()))
                .collect(Collectors.toList());
    }

}

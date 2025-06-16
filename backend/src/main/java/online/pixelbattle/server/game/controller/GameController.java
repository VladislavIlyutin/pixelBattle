package online.pixelbattle.server.game.controller;

import lombok.RequiredArgsConstructor;
import online.pixelbattle.server.game.dto.PixelUpdateDTO;
import online.pixelbattle.server.game.service.PixelService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/game")
@RequiredArgsConstructor
public class GameController {

    private final PixelService pixelService;

    @PostMapping("/change-color")
    public ResponseEntity<Void> changeColor(@RequestBody PixelUpdateDTO dto,
                                            Authentication authentication) {

        if (authentication instanceof AnonymousAuthenticationToken) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        pixelService.changeColor(dto.getX(), dto.getY(), dto.getColor(), authentication.getName());

        return ResponseEntity.ok().build();
    }

    @GetMapping("/grid")
    public List<PixelUpdateDTO> getGrid() {
        return pixelService.getAllPixels();
    }

}

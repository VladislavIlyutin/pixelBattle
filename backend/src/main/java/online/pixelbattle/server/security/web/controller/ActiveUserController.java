package online.pixelbattle.server.security.web.controller;

import lombok.RequiredArgsConstructor;
import online.pixelbattle.server.security.service.ActiveUserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/game")
@RequiredArgsConstructor
public class ActiveUserController {
    private final ActiveUserService activeUserService;

    @GetMapping("/active-users")
    public List<String> getActiveUsers() {
        return activeUserService.getActiveUsernames();
    }
}

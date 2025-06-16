package online.pixelbattle.server.game.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PixelUpdateDTO {
    private int x;
    private int y;
    private String color;
}

package online.pixelbattle.server.game.repository;

import online.pixelbattle.server.game.model.Pixel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PixelRepository extends JpaRepository<Pixel, Integer> {
    List<Pixel> findAllByOrderByIdAsc();
    Pixel findByXAndY(int x, int y);
}

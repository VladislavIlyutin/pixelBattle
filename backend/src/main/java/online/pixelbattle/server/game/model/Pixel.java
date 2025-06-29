package online.pixelbattle.server.game.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import online.pixelbattle.server.security.model.UserAccount;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.Objects;


@Entity
@Table(name = "pixels")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class Pixel {

    @Id
    private Integer id;

    private int x;
    private int y;

    @Column(length = 7, columnDefinition = "VARCHAR(7) DEFAULT '#FFFFFF'")
    private String color;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private UserAccount owner;

    private Instant lastModified;
    @PreUpdate
    protected void onUpdate() {
        this.lastModified = Instant.now();
    }
    public Pixel() {}

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Pixel pixel = (Pixel) o;
        return Objects.equals(id, pixel.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}

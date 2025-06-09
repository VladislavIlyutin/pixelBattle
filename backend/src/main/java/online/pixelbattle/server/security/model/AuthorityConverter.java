package online.pixelbattle.server.security.model;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import jakarta.persistence.AttributeConverter;

public class AuthorityConverter implements AttributeConverter<SimpleGrantedAuthority, String> {

    @Override
    public String convertToDatabaseColumn(SimpleGrantedAuthority authority) {
        return authority.getAuthority();
    }

    @Override
    public SimpleGrantedAuthority convertToEntityAttribute(String dbData) {
        return new SimpleGrantedAuthority(dbData);
    }
}
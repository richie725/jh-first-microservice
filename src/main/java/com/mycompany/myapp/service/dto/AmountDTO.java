package com.mycompany.myapp.service.dto;

import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.mycompany.myapp.domain.Amount} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class AmountDTO implements Serializable {

    private Long id;

    private Float count;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Float getCount() {
        return count;
    }

    public void setCount(Float count) {
        this.count = count;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AmountDTO)) {
            return false;
        }

        AmountDTO amountDTO = (AmountDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, amountDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AmountDTO{" +
            "id=" + getId() +
            ", count=" + getCount() +
            "}";
    }
}

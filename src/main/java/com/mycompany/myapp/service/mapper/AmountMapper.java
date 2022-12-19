package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.Amount;
import com.mycompany.myapp.service.dto.AmountDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Amount} and its DTO {@link AmountDTO}.
 */
@Mapper(componentModel = "spring")
public interface AmountMapper extends EntityMapper<AmountDTO, Amount> {}

package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.Bill;
import com.mycompany.myapp.domain.Order;
import com.mycompany.myapp.service.dto.BillDTO;
import com.mycompany.myapp.service.dto.OrderDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Bill} and its DTO {@link BillDTO}.
 */
@Mapper(componentModel = "spring")
public interface BillMapper extends EntityMapper<BillDTO, Bill> {
    @Mapping(target = "order", source = "order", qualifiedByName = "orderId")
    BillDTO toDto(Bill s);

    @Named("orderId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    OrderDTO toDtoOrderId(Order order);
}

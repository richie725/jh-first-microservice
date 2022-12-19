package com.mycompany.myapp.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class AmountMapperTest {

    private AmountMapper amountMapper;

    @BeforeEach
    public void setUp() {
        amountMapper = new AmountMapperImpl();
    }
}

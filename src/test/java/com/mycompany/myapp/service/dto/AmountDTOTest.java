package com.mycompany.myapp.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AmountDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(AmountDTO.class);
        AmountDTO amountDTO1 = new AmountDTO();
        amountDTO1.setId(1L);
        AmountDTO amountDTO2 = new AmountDTO();
        assertThat(amountDTO1).isNotEqualTo(amountDTO2);
        amountDTO2.setId(amountDTO1.getId());
        assertThat(amountDTO1).isEqualTo(amountDTO2);
        amountDTO2.setId(2L);
        assertThat(amountDTO1).isNotEqualTo(amountDTO2);
        amountDTO1.setId(null);
        assertThat(amountDTO1).isNotEqualTo(amountDTO2);
    }
}

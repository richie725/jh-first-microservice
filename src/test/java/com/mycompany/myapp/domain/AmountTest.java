package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AmountTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Amount.class);
        Amount amount1 = new Amount();
        amount1.setId(1L);
        Amount amount2 = new Amount();
        amount2.setId(amount1.getId());
        assertThat(amount1).isEqualTo(amount2);
        amount2.setId(2L);
        assertThat(amount1).isNotEqualTo(amount2);
        amount1.setId(null);
        assertThat(amount1).isNotEqualTo(amount2);
    }
}

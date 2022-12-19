package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Amount;
import com.mycompany.myapp.repository.AmountRepository;
import com.mycompany.myapp.service.dto.AmountDTO;
import com.mycompany.myapp.service.mapper.AmountMapper;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link AmountResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AmountResourceIT {

    private static final Float DEFAULT_COUNT = 1F;
    private static final Float UPDATED_COUNT = 2F;

    private static final String ENTITY_API_URL = "/api/amounts";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AmountRepository amountRepository;

    @Autowired
    private AmountMapper amountMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAmountMockMvc;

    private Amount amount;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Amount createEntity(EntityManager em) {
        Amount amount = new Amount().count(DEFAULT_COUNT);
        return amount;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Amount createUpdatedEntity(EntityManager em) {
        Amount amount = new Amount().count(UPDATED_COUNT);
        return amount;
    }

    @BeforeEach
    public void initTest() {
        amount = createEntity(em);
    }

    @Test
    @Transactional
    void createAmount() throws Exception {
        int databaseSizeBeforeCreate = amountRepository.findAll().size();
        // Create the Amount
        AmountDTO amountDTO = amountMapper.toDto(amount);
        restAmountMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(amountDTO)))
            .andExpect(status().isCreated());

        // Validate the Amount in the database
        List<Amount> amountList = amountRepository.findAll();
        assertThat(amountList).hasSize(databaseSizeBeforeCreate + 1);
        Amount testAmount = amountList.get(amountList.size() - 1);
        assertThat(testAmount.getCount()).isEqualTo(DEFAULT_COUNT);
    }

    @Test
    @Transactional
    void createAmountWithExistingId() throws Exception {
        // Create the Amount with an existing ID
        amount.setId(1L);
        AmountDTO amountDTO = amountMapper.toDto(amount);

        int databaseSizeBeforeCreate = amountRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAmountMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(amountDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Amount in the database
        List<Amount> amountList = amountRepository.findAll();
        assertThat(amountList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAmounts() throws Exception {
        // Initialize the database
        amountRepository.saveAndFlush(amount);

        // Get all the amountList
        restAmountMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(amount.getId().intValue())))
            .andExpect(jsonPath("$.[*].count").value(hasItem(DEFAULT_COUNT.doubleValue())));
    }

    @Test
    @Transactional
    void getAmount() throws Exception {
        // Initialize the database
        amountRepository.saveAndFlush(amount);

        // Get the amount
        restAmountMockMvc
            .perform(get(ENTITY_API_URL_ID, amount.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(amount.getId().intValue()))
            .andExpect(jsonPath("$.count").value(DEFAULT_COUNT.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingAmount() throws Exception {
        // Get the amount
        restAmountMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAmount() throws Exception {
        // Initialize the database
        amountRepository.saveAndFlush(amount);

        int databaseSizeBeforeUpdate = amountRepository.findAll().size();

        // Update the amount
        Amount updatedAmount = amountRepository.findById(amount.getId()).get();
        // Disconnect from session so that the updates on updatedAmount are not directly saved in db
        em.detach(updatedAmount);
        updatedAmount.count(UPDATED_COUNT);
        AmountDTO amountDTO = amountMapper.toDto(updatedAmount);

        restAmountMockMvc
            .perform(
                put(ENTITY_API_URL_ID, amountDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(amountDTO))
            )
            .andExpect(status().isOk());

        // Validate the Amount in the database
        List<Amount> amountList = amountRepository.findAll();
        assertThat(amountList).hasSize(databaseSizeBeforeUpdate);
        Amount testAmount = amountList.get(amountList.size() - 1);
        assertThat(testAmount.getCount()).isEqualTo(UPDATED_COUNT);
    }

    @Test
    @Transactional
    void putNonExistingAmount() throws Exception {
        int databaseSizeBeforeUpdate = amountRepository.findAll().size();
        amount.setId(count.incrementAndGet());

        // Create the Amount
        AmountDTO amountDTO = amountMapper.toDto(amount);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAmountMockMvc
            .perform(
                put(ENTITY_API_URL_ID, amountDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(amountDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Amount in the database
        List<Amount> amountList = amountRepository.findAll();
        assertThat(amountList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAmount() throws Exception {
        int databaseSizeBeforeUpdate = amountRepository.findAll().size();
        amount.setId(count.incrementAndGet());

        // Create the Amount
        AmountDTO amountDTO = amountMapper.toDto(amount);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAmountMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(amountDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Amount in the database
        List<Amount> amountList = amountRepository.findAll();
        assertThat(amountList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAmount() throws Exception {
        int databaseSizeBeforeUpdate = amountRepository.findAll().size();
        amount.setId(count.incrementAndGet());

        // Create the Amount
        AmountDTO amountDTO = amountMapper.toDto(amount);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAmountMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(amountDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Amount in the database
        List<Amount> amountList = amountRepository.findAll();
        assertThat(amountList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAmountWithPatch() throws Exception {
        // Initialize the database
        amountRepository.saveAndFlush(amount);

        int databaseSizeBeforeUpdate = amountRepository.findAll().size();

        // Update the amount using partial update
        Amount partialUpdatedAmount = new Amount();
        partialUpdatedAmount.setId(amount.getId());

        restAmountMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAmount.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAmount))
            )
            .andExpect(status().isOk());

        // Validate the Amount in the database
        List<Amount> amountList = amountRepository.findAll();
        assertThat(amountList).hasSize(databaseSizeBeforeUpdate);
        Amount testAmount = amountList.get(amountList.size() - 1);
        assertThat(testAmount.getCount()).isEqualTo(DEFAULT_COUNT);
    }

    @Test
    @Transactional
    void fullUpdateAmountWithPatch() throws Exception {
        // Initialize the database
        amountRepository.saveAndFlush(amount);

        int databaseSizeBeforeUpdate = amountRepository.findAll().size();

        // Update the amount using partial update
        Amount partialUpdatedAmount = new Amount();
        partialUpdatedAmount.setId(amount.getId());

        partialUpdatedAmount.count(UPDATED_COUNT);

        restAmountMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAmount.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAmount))
            )
            .andExpect(status().isOk());

        // Validate the Amount in the database
        List<Amount> amountList = amountRepository.findAll();
        assertThat(amountList).hasSize(databaseSizeBeforeUpdate);
        Amount testAmount = amountList.get(amountList.size() - 1);
        assertThat(testAmount.getCount()).isEqualTo(UPDATED_COUNT);
    }

    @Test
    @Transactional
    void patchNonExistingAmount() throws Exception {
        int databaseSizeBeforeUpdate = amountRepository.findAll().size();
        amount.setId(count.incrementAndGet());

        // Create the Amount
        AmountDTO amountDTO = amountMapper.toDto(amount);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAmountMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, amountDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(amountDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Amount in the database
        List<Amount> amountList = amountRepository.findAll();
        assertThat(amountList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAmount() throws Exception {
        int databaseSizeBeforeUpdate = amountRepository.findAll().size();
        amount.setId(count.incrementAndGet());

        // Create the Amount
        AmountDTO amountDTO = amountMapper.toDto(amount);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAmountMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(amountDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Amount in the database
        List<Amount> amountList = amountRepository.findAll();
        assertThat(amountList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAmount() throws Exception {
        int databaseSizeBeforeUpdate = amountRepository.findAll().size();
        amount.setId(count.incrementAndGet());

        // Create the Amount
        AmountDTO amountDTO = amountMapper.toDto(amount);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAmountMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(amountDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Amount in the database
        List<Amount> amountList = amountRepository.findAll();
        assertThat(amountList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAmount() throws Exception {
        // Initialize the database
        amountRepository.saveAndFlush(amount);

        int databaseSizeBeforeDelete = amountRepository.findAll().size();

        // Delete the amount
        restAmountMockMvc
            .perform(delete(ENTITY_API_URL_ID, amount.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Amount> amountList = amountRepository.findAll();
        assertThat(amountList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

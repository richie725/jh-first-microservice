package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Amount;
import com.mycompany.myapp.repository.AmountRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Amount}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AmountResource {

    private final Logger log = LoggerFactory.getLogger(AmountResource.class);

    private static final String ENTITY_NAME = "jhFisrtMicroServiceAmount";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AmountRepository amountRepository;

    public AmountResource(AmountRepository amountRepository) {
        this.amountRepository = amountRepository;
    }

    /**
     * {@code POST  /amounts} : Create a new amount.
     *
     * @param amount the amount to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new amount, or with status {@code 400 (Bad Request)} if the amount has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/amounts")
    public ResponseEntity<Amount> createAmount(@RequestBody Amount amount) throws URISyntaxException {
        log.debug("REST request to save Amount : {}", amount);
        if (amount.getId() != null) {
            throw new BadRequestAlertException("A new amount cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Amount result = amountRepository.save(amount);
        return ResponseEntity
            .created(new URI("/api/amounts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /amounts/:id} : Updates an existing amount.
     *
     * @param id the id of the amount to save.
     * @param amount the amount to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated amount,
     * or with status {@code 400 (Bad Request)} if the amount is not valid,
     * or with status {@code 500 (Internal Server Error)} if the amount couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/amounts/{id}")
    public ResponseEntity<Amount> updateAmount(@PathVariable(value = "id", required = false) final Long id, @RequestBody Amount amount)
        throws URISyntaxException {
        log.debug("REST request to update Amount : {}, {}", id, amount);
        if (amount.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, amount.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!amountRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Amount result = amountRepository.save(amount);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, amount.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /amounts/:id} : Partial updates given fields of an existing amount, field will ignore if it is null
     *
     * @param id the id of the amount to save.
     * @param amount the amount to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated amount,
     * or with status {@code 400 (Bad Request)} if the amount is not valid,
     * or with status {@code 404 (Not Found)} if the amount is not found,
     * or with status {@code 500 (Internal Server Error)} if the amount couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/amounts/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Amount> partialUpdateAmount(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Amount amount
    ) throws URISyntaxException {
        log.debug("REST request to partial update Amount partially : {}, {}", id, amount);
        if (amount.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, amount.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!amountRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Amount> result = amountRepository
            .findById(amount.getId())
            .map(existingAmount -> {
                if (amount.getCount() != null) {
                    existingAmount.setCount(amount.getCount());
                }

                return existingAmount;
            })
            .map(amountRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, amount.getId().toString())
        );
    }

    /**
     * {@code GET  /amounts} : get all the amounts.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of amounts in body.
     */
    @GetMapping("/amounts")
    public List<Amount> getAllAmounts() {
        log.debug("REST request to get all Amounts");
        return amountRepository.findAll();
    }

    /**
     * {@code GET  /amounts/:id} : get the "id" amount.
     *
     * @param id the id of the amount to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the amount, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/amounts/{id}")
    public ResponseEntity<Amount> getAmount(@PathVariable Long id) {
        log.debug("REST request to get Amount : {}", id);
        Optional<Amount> amount = amountRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(amount);
    }

    /**
     * {@code DELETE  /amounts/:id} : delete the "id" amount.
     *
     * @param id the id of the amount to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/amounts/{id}")
    public ResponseEntity<Void> deleteAmount(@PathVariable Long id) {
        log.debug("REST request to delete Amount : {}", id);
        amountRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

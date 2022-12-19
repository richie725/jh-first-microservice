package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.repository.AmountRepository;
import com.mycompany.myapp.service.AmountService;
import com.mycompany.myapp.service.dto.AmountDTO;
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
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Amount}.
 */
@RestController
@RequestMapping("/api")
public class AmountResource {

    private final Logger log = LoggerFactory.getLogger(AmountResource.class);

    private static final String ENTITY_NAME = "jhFisrtMicroServiceAmount";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AmountService amountService;

    private final AmountRepository amountRepository;

    public AmountResource(AmountService amountService, AmountRepository amountRepository) {
        this.amountService = amountService;
        this.amountRepository = amountRepository;
    }

    /**
     * {@code POST  /amounts} : Create a new amount.
     *
     * @param amountDTO the amountDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new amountDTO, or with status {@code 400 (Bad Request)} if the amount has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/amounts")
    public ResponseEntity<AmountDTO> createAmount(@RequestBody AmountDTO amountDTO) throws URISyntaxException {
        log.debug("REST request to save Amount : {}", amountDTO);
        if (amountDTO.getId() != null) {
            throw new BadRequestAlertException("A new amount cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AmountDTO result = amountService.save(amountDTO);
        return ResponseEntity
            .created(new URI("/api/amounts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /amounts/:id} : Updates an existing amount.
     *
     * @param id the id of the amountDTO to save.
     * @param amountDTO the amountDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated amountDTO,
     * or with status {@code 400 (Bad Request)} if the amountDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the amountDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/amounts/{id}")
    public ResponseEntity<AmountDTO> updateAmount(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AmountDTO amountDTO
    ) throws URISyntaxException {
        log.debug("REST request to update Amount : {}, {}", id, amountDTO);
        if (amountDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, amountDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!amountRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        AmountDTO result = amountService.update(amountDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, amountDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /amounts/:id} : Partial updates given fields of an existing amount, field will ignore if it is null
     *
     * @param id the id of the amountDTO to save.
     * @param amountDTO the amountDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated amountDTO,
     * or with status {@code 400 (Bad Request)} if the amountDTO is not valid,
     * or with status {@code 404 (Not Found)} if the amountDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the amountDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/amounts/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AmountDTO> partialUpdateAmount(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AmountDTO amountDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update Amount partially : {}, {}", id, amountDTO);
        if (amountDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, amountDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!amountRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AmountDTO> result = amountService.partialUpdate(amountDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, amountDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /amounts} : get all the amounts.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of amounts in body.
     */
    @GetMapping("/amounts")
    public List<AmountDTO> getAllAmounts() {
        log.debug("REST request to get all Amounts");
        return amountService.findAll();
    }

    /**
     * {@code GET  /amounts/:id} : get the "id" amount.
     *
     * @param id the id of the amountDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the amountDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/amounts/{id}")
    public ResponseEntity<AmountDTO> getAmount(@PathVariable Long id) {
        log.debug("REST request to get Amount : {}", id);
        Optional<AmountDTO> amountDTO = amountService.findOne(id);
        return ResponseUtil.wrapOrNotFound(amountDTO);
    }

    /**
     * {@code DELETE  /amounts/:id} : delete the "id" amount.
     *
     * @param id the id of the amountDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/amounts/{id}")
    public ResponseEntity<Void> deleteAmount(@PathVariable Long id) {
        log.debug("REST request to delete Amount : {}", id);
        amountService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

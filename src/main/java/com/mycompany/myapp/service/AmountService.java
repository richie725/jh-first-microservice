package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Amount;
import com.mycompany.myapp.repository.AmountRepository;
import com.mycompany.myapp.service.dto.AmountDTO;
import com.mycompany.myapp.service.mapper.AmountMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Amount}.
 */
@Service
@Transactional
public class AmountService {

    private final Logger log = LoggerFactory.getLogger(AmountService.class);

    private final AmountRepository amountRepository;

    private final AmountMapper amountMapper;

    public AmountService(AmountRepository amountRepository, AmountMapper amountMapper) {
        this.amountRepository = amountRepository;
        this.amountMapper = amountMapper;
    }

    /**
     * Save a amount.
     *
     * @param amountDTO the entity to save.
     * @return the persisted entity.
     */
    public AmountDTO save(AmountDTO amountDTO) {
        log.debug("Request to save Amount : {}", amountDTO);
        Amount amount = amountMapper.toEntity(amountDTO);
        amount = amountRepository.save(amount);
        return amountMapper.toDto(amount);
    }

    /**
     * Update a amount.
     *
     * @param amountDTO the entity to save.
     * @return the persisted entity.
     */
    public AmountDTO update(AmountDTO amountDTO) {
        log.debug("Request to update Amount : {}", amountDTO);
        Amount amount = amountMapper.toEntity(amountDTO);
        amount = amountRepository.save(amount);
        return amountMapper.toDto(amount);
    }

    /**
     * Partially update a amount.
     *
     * @param amountDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<AmountDTO> partialUpdate(AmountDTO amountDTO) {
        log.debug("Request to partially update Amount : {}", amountDTO);

        return amountRepository
            .findById(amountDTO.getId())
            .map(existingAmount -> {
                amountMapper.partialUpdate(existingAmount, amountDTO);

                return existingAmount;
            })
            .map(amountRepository::save)
            .map(amountMapper::toDto);
    }

    /**
     * Get all the amounts.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<AmountDTO> findAll() {
        log.debug("Request to get all Amounts");
        return amountRepository.findAll().stream().map(amountMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get one amount by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<AmountDTO> findOne(Long id) {
        log.debug("Request to get Amount : {}", id);
        return amountRepository.findById(id).map(amountMapper::toDto);
    }

    /**
     * Delete the amount by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Amount : {}", id);
        amountRepository.deleteById(id);
    }
}

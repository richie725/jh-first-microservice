package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Amount;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Amount entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AmountRepository extends JpaRepository<Amount, Long> {}

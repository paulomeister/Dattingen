package com.dirac.businessservice.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.dirac.businessservice.Model.BusinessModel;

@Repository
public interface BusinessRepository extends MongoRepository<BusinessModel, String> {
    
    /**
     * Busca empresas por nombre usando una expresión regular
     * @param nameRegex Patrón de expresión regular para el nombre
     * @return Lista de empresas que coinciden con el patrón
     */
    List<BusinessModel> findByNameRegex(String nameRegex);
    
    /**
     * Obtiene las primeras 20 empresas ordenadas por nombre ascendente
     * @return Lista limitada a 20 empresas
     */
    List<BusinessModel> findTop20ByOrderByNameAsc();
    
    /**
     * Find a business with its audits filtered by rulesetId
     * @param businessId The business ID
     * @param rulesetId The ruleset ID to filter audits
     * @return The business with filtered audits
     */
    @Query("{ '_id': ?0, 'audits.rulesetId': ?1 }")
    Optional<BusinessModel> findBusinessWithRulesetAudits(String businessId, String rulesetId);
    
    /**
     * Find audits for a business that match a specific rulesetId
     * @param businessId The business ID
     * @param rulesetId The ruleset ID to filter audits
     * @return List of audits that match the criteria
     */
    @Query(value = "{ '_id': ?0 }", fields = "{ 'audits': { $elemMatch: { 'rulesetId': ?1 } } }")
    Optional<BusinessModel> findAuditsByBusinessIdAndRulesetId(String businessId, String rulesetId);
    
    /**
     * Find active audits (status not 'COMPLETED' or 'CANCELED') for a business
     * @param businessId The business ID
     * @return List of active audits
     */
    @Query(value = "{ '_id': ?0 }", fields = "{ 'audits': { $elemMatch: { 'status': { $nin: ['COMPLETED', 'CANCELED'] } } } }")
    Optional<BusinessModel> findActiveAuditsByBusinessId(String businessId);
}

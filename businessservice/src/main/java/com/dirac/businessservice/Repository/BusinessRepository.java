package com.dirac.businessservice.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.dirac.businessservice.Model.BusinessModel;

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
}

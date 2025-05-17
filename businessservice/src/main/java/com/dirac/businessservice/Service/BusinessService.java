package com.dirac.businessservice.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.dirac.businessservice.Exception.BusinessNotFoundException;
import com.dirac.businessservice.Model.AsociateModel;
import com.dirac.businessservice.Model.AuditModel;
import com.dirac.businessservice.Model.BusinessModel;
import com.dirac.businessservice.Repository.BusinessRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@Service
public class BusinessService {

    @Autowired
    private BusinessRepository businessRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${services.apigateway.url}")
    private String apiGatewayUrl;

    public BusinessModel getBusinessById(String _id) {
        return businessRepository.findById(_id)
                .orElseThrow(() -> new BusinessNotFoundException("Business with ID " + _id + " not found."));
    }

    /**
     * Busca empresas por nombre, utilizando una expresión regular para una búsqueda
     * insensible a mayúsculas/minúsculas
     * 
     * @param name Nombre o parte del nombre a buscar
     * @return Lista de empresas que coinciden con el criterio de búsqueda
     */
    public List<BusinessModel> findBusinessesByName(String name) {
        // Crear un patrón de regex para una búsqueda insensible a mayúsculas/minúsculas
        Pattern pattern = Pattern.compile(name, Pattern.CASE_INSENSITIVE);
        return businessRepository.findByNameRegex(pattern.pattern());
    }

    public BusinessModel saveBusiness(BusinessModel businessModel) {
        // Primero guardamos el business para obtener su ID
        BusinessModel savedBusiness = businessRepository.save(businessModel);

        // Si hay associates, actualizamos sus businessId en el userservice a través de
        // la API Gateway
        if (savedBusiness.getAssociates() != null && !savedBusiness.getAssociates().isEmpty()) {
            // Extraer solo los IDs de usuario de los asociados
            List<String> userIds = savedBusiness.getAssociates().stream()
                    .map(AsociateModel::get_id)
                    .toList();

            updateUsersBusinessId(savedBusiness.get_id(), userIds);
        }

        return savedBusiness;
    }

    private void updateUsersBusinessId(String businessId, List<String> userIds) {
        try {
            // URL del endpoint para asignar usuarios a un negocio a través de la API
            // Gateway
            String url = apiGatewayUrl + "/users/api/businesses/" + businessId + "/users";

            // Preparar los headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Preparar el cuerpo de la petición
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("userIds", userIds);

            // Crear la entidad HTTP
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            // Enviar la petición
            restTemplate.exchange(url, HttpMethod.POST, entity, Void.class);

            System.out.println("Successfully updated " + userIds.size() + " users with businessId: " + businessId);
        } catch (Exception e) {
            // Loggear el error pero permitir que continúe el flujo
            System.err.println("Error updating users with businessId: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public BusinessModel updateBusiness(String _id, BusinessModel businessModel) {
        BusinessModel existingBusiness = businessRepository.findById(_id)
                .orElseThrow(() -> new BusinessNotFoundException("Business with ID " + _id + " not found."));
        // Update fields
        existingBusiness.setName(businessModel.getName());
        existingBusiness.setActivity(businessModel.getActivity());
        existingBusiness.setAssociates(businessModel.getAssociates());
        existingBusiness.setAudits(businessModel.getAudits());
        return businessRepository.save(existingBusiness);
    }

    public String addAudit(String _id, AuditModel auditModel) {
        BusinessModel existingBusiness = businessRepository.findById(_id)
                .orElseThrow(() -> new BusinessNotFoundException("Business with ID " + _id + " not found."));
        existingBusiness.getAudits().add(auditModel);
        businessRepository.save(existingBusiness);
        return "New Audit of " + auditModel.getRulesetId() + " Added.";
    }

    public void deleteBusiness(String _id) {
        BusinessModel existingBusiness = businessRepository.findById(_id)
                .orElseThrow(() -> new BusinessNotFoundException("Business with ID " + _id + " not found."));
        businessRepository.delete(existingBusiness);
    }

    /**
     * Obtiene una lista con las primeras 20 empresas
     * 
     * @return Lista limitada a 20 empresas
     */
    public List<BusinessModel> findAllBusinesses() {
        // Utilizamos paginación para limitar a las primeras 20 empresas
        return businessRepository.findTop20ByOrderByNameAsc();
    }

    /**
     * Registra una lista de auditores internos para un negocio específico
     * 
     * @param businessId ID del negocio al que se añadirán los auditores
     * @param associates Lista de objetos AsociateModel con ID, username y rol de
     *                   usuario
     * @return El negocio actualizado con los nuevos asociados
     */
    public BusinessModel registerAuditors(String businessId, List<AsociateModel> associates) {
        // Obtenemos el negocio por su ID
        BusinessModel business = businessRepository.findById(businessId)
                .orElseThrow(() -> new BusinessNotFoundException("Business with ID " + businessId + " not found."));

        // Si el negocio no tiene lista de asociados, la inicializamos
        if (business.getAssociates() == null) {
            business.setAssociates(associates);
        } else {
            // Agregamos los nuevos asociados a la lista existente
            // Primero, filtramos para evitar duplicados (por ID)
            List<String> existingIds = business.getAssociates().stream()
                    .map(AsociateModel::get_id)
                    .toList();

            // Añadimos solo los asociados que no existen ya
            for (AsociateModel associate : associates) {
                if (!existingIds.contains(associate.get_id())) {
                    business.getAssociates().add(associate);
                }
            }
        }

        // Guardamos el negocio actualizado
        BusinessModel updatedBusiness = businessRepository.save(business);

        // Extraemos los IDs de usuario para actualizar su businessId
        List<String> userIds = associates.stream()
                .map(AsociateModel::get_id)
                .toList();

        // Actualizamos el businessId de los usuarios en el userservice
        updateUsersBusinessId(businessId, userIds);

        return updatedBusiness;
    }
}

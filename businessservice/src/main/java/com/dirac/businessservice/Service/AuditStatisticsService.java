/*
package com.dirac.businessservice.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.dirac.businessservice.DTOs.AuditStatisticsDTO;
import com.dirac.businessservice.DTOs.AuditStatisticsResponseDTO;
import com.dirac.businessservice.DTOs.AuditStatisticsResponseDTO.AuditDetailDTO;
import com.dirac.businessservice.DTOs.AuditStatisticsResponseDTO.PHVAInformitiesDTO;
import com.dirac.businessservice.DTOs.AuditStatisticsResponseDTO.TendencyDTO;
import com.dirac.businessservice.Exception.BusinessNotFoundException;
import com.dirac.businessservice.Model.AuditModel;
import com.dirac.businessservice.Model.BusinessModel;
import com.dirac.businessservice.Repository.BusinessRepository;

@Service
public class AuditStatisticsService {

    @Autowired
    private BusinessRepository businessRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${services.apigateway.url}")
    private String apiGatewayUrl;

    
}
*/
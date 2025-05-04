package com.dirac.rulesetservice.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponseAzure {
    private String fileName;
    private String fileUrl;
}

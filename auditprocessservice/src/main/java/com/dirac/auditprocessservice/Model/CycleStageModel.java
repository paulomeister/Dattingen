package com.dirac.auditprocessservice.Model;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "cyclestage")
public class CycleStageModel {
  private String _id;
  private String name;
}

package com.dirac.businessservice.Model;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "Businesses")
public class BusinessModel {

  @Id
  private String _id;
  private String name;
  private String activity;
  private List<AsociateModel> associates;
  private List<AuditModel> audits;
}

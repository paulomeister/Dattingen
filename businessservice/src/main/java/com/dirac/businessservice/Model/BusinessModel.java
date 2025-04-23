package com.dirac.businessservice.Model;

import java.util.ArrayList;

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
  private ArrayList<AsociateModel> associates;
  private ArrayList<AuditModel> audits;
}

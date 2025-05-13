package com.dirac.auditprocessservice.Model;

import java.util.Date;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Document(collection = "auditprocess")
public class AuditProcessModel {
  @JsonIgnore
  private String _id;
  private String bussinessId;
  private String rulesetId;
  private String status; // TODO: define status ENUM
  private List<Criterion> assesment; //TODO: understand what this is
  private List<Inspector> assignedInt;
  private List<Inspector> assignedExt;
  private Date processBegins;
  private Date processEnds;

  public class Inspector {
    private String _id;
    private String name;
  }


  public class Criterion {
    public Compositekey compositeKey;
    public Date assesedIn;
    public List<Inspector> internals;
    public List<Inspector> externals;
    private String comment;
    private boolean satisfaction; // TODO: understand why
    private List<Evidence> proof;
    private String stage;

  }

  public class Compositekey {
    private String _id;
    private String controlld;
    private Date startsIn;
  }

  public class Evidence {
    private String description;
    private String url;
  }
}

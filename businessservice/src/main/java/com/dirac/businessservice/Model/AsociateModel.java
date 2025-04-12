package com.dirac.businessservice.Model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class AsociateModel {
  private String _id;
  private String role;
  private String authId;
}

package com.dirac.rulesetservice.Repository;

import com.dirac.rulesetservice.Model.RulesetModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RulesetRepository extends MongoRepository<RulesetModel, String> {
}

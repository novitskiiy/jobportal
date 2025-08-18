package com.jobportal.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.jobportal.entity.User;
import com.jobportal.dto.AccountType;

public interface UserRepository extends MongoRepository<User, Long>{
	public Optional<User>findByEmail(String email);
	public List<User>findByAccountType(AccountType accountType);
}

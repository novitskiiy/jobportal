package com.jobportal.service;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jobportal.dto.ProfileDTO;
import com.jobportal.dto.UserDTO;
import com.jobportal.dto.AccountType;
import com.jobportal.entity.Profile;
import com.jobportal.entity.User;
import com.jobportal.exception.JobPortalException;
import com.jobportal.repository.ProfileRepository;
import com.jobportal.repository.UserRepository;
import com.jobportal.utility.Utilities;

@Service("profileService")
public class ProfileServiceImpl implements ProfileService {
	private static final Logger logger = LoggerFactory.getLogger(ProfileServiceImpl.class);

	@Autowired
	private ProfileRepository profileRepository;
	
	@Autowired
	private UserRepository userRepository;
	
	@Override
	public Long createProfile(UserDTO userDTO) throws JobPortalException {
		try {
			logger.debug("Starting profile creation for user: {}", userDTO.getEmail());
			
			Profile profile = new Profile();
			
			logger.debug("Generating profile ID");
			Long profileId = Utilities.getNextSequenceId("profiles");
			logger.debug("Generated profile ID: {}", profileId);
			profile.setId(profileId);
			
			profile.setEmail(userDTO.getEmail());
			profile.setName(userDTO.getName());
			profile.setSkills(new ArrayList<>());
			profile.setExperiences(new ArrayList<>());
			profile.setCertifications(new ArrayList<>());
			profile.setSavedJobs(new ArrayList<>());
			profile.setTotalExp(0L);
			profile.setPicture(null);
			profile.setJobTitle("");
			profile.setCompany("");
			profile.setLocation("");
			profile.setAbout("");
			
			logger.debug("Saving profile to database");
			profileRepository.save(profile);
			
			logger.debug("Profile created successfully with ID: {}", profileId);
			return profile.getId();
		} catch (Exception e) {
			logger.error("Error during profile creation", e);
			throw e;
		}
	}

	@Override
	public ProfileDTO getProfile(Long id) throws JobPortalException {
		return profileRepository.findById(id).orElseThrow(()->new JobPortalException("PROFILE_NOT_FOUND")).toDTO();
	}

	@Override
	public ProfileDTO updateProfile(ProfileDTO profileDTO) throws JobPortalException {
		profileRepository.findById(profileDTO.getId()).orElseThrow(()->new JobPortalException("PROFILE_NOT_FOUND"));
		profileRepository.save(profileDTO.toEntity());
		return profileDTO;
	}

	@Override
	public List<ProfileDTO> getAllProfiles() throws JobPortalException {
		return profileRepository.findAll().stream().map((x)->x.toDTO()).toList();
	}
	
	@Override
	public List<ProfileDTO> getApplicantProfiles() throws JobPortalException {
		// Получаем все профили, которые принадлежат пользователям с ролью APPLICANT
		List<Long> applicantProfileIds = userRepository.findByAccountType(AccountType.APPLICANT)
			.stream()
			.map(user -> user.getProfileId())
			.toList();
		
		return profileRepository.findAllById(applicantProfileIds)
			.stream()
			.map((x)->x.toDTO())
			.toList();
	}
	

}

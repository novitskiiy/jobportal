package com.jobportal.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jobportal.dto.ApplicantDTO;
import com.jobportal.dto.Application;
import com.jobportal.dto.ApplicationStatus;
import com.jobportal.dto.JobDTO;
import com.jobportal.dto.ResponseDTO;
import com.jobportal.exception.JobPortalException;
import com.jobportal.service.JobService;

import jakarta.validation.Valid;

@RestController
@CrossOrigin
@RequestMapping("/jobs")
@Validated
public class JobAPI {
	
	@Autowired 
	private JobService jobService;
	
	@PostMapping("/post")
	@PreAuthorize("hasRole('EMPLOYER')")
	public ResponseEntity<JobDTO>postJob(@RequestBody @Valid JobDTO jobDTO) throws JobPortalException{
		return new ResponseEntity<>(jobService.postJob(jobDTO), HttpStatus.CREATED);
	}
	
	
	@PostMapping("/postAll")
	@PreAuthorize("hasRole('EMPLOYER')")
	public ResponseEntity<List<JobDTO>>postAllJob(@RequestBody @Valid List<JobDTO> jobDTOs) throws JobPortalException{
		
		return new ResponseEntity<>(jobDTOs.stream().map((x)->{
			try {
				return jobService.postJob(x);
			} catch (JobPortalException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			return x;
		}).toList() , HttpStatus.CREATED);
	}
	
	@GetMapping("/getAll")
	@PreAuthorize("hasRole('APPLICANT') or hasRole('EMPLOYER')")
	public ResponseEntity<List<JobDTO>>getAllJobs() throws JobPortalException{
		return new ResponseEntity<>(jobService.getAllJobs(), HttpStatus.OK);
	}
	@GetMapping("/get/{id}")
	@PreAuthorize("hasRole('APPLICANT') or hasRole('EMPLOYER')")
	public ResponseEntity<JobDTO>getJob(@PathVariable Long id) throws JobPortalException{
		return new ResponseEntity<>(jobService.getJob(id), HttpStatus.OK);
	}
	@PostMapping("apply/{id}")
	@PreAuthorize("hasRole('APPLICANT')")
	public ResponseEntity<ResponseDTO>applyJob(@PathVariable Long id, @RequestBody ApplicantDTO applicantDTO) throws JobPortalException{
		jobService.applyJob(id, applicantDTO);
		return new ResponseEntity<>(new ResponseDTO("Applied Successfully"), HttpStatus.OK);
	}
	@GetMapping("/postedBy/{id}")
	@PreAuthorize("hasRole('EMPLOYER')")
	public ResponseEntity<List<JobDTO>>getJobsPostedBy(@PathVariable Long id) throws JobPortalException{
		return new ResponseEntity<>(jobService.getJobsPostedBy(id), HttpStatus.OK);
	}
	
	@GetMapping("/history/{id}/{applicationStatus}")
	@PreAuthorize("hasRole('APPLICANT')")
	public ResponseEntity<List<JobDTO>>getHistory(@PathVariable Long id,@PathVariable ApplicationStatus applicationStatus) throws JobPortalException{
		return new ResponseEntity<>(jobService.getHistory(id, applicationStatus), HttpStatus.OK);
	}
	@PostMapping("/changeAppStatus")
	@PreAuthorize("hasRole('EMPLOYER')")
	public ResponseEntity<ResponseDTO>changeAppStatus(@RequestBody Application application) throws JobPortalException{
		jobService.changeAppStatus(application);
		return new ResponseEntity<>(new ResponseDTO("Status Chhanged Successfully"), HttpStatus.OK);
	}
	
	@PostMapping("/respondToOffer")
	@PreAuthorize("hasRole('APPLICANT')")
	public ResponseEntity<ResponseDTO>respondToOffer(@RequestBody Application application) throws JobPortalException{
		jobService.respondToOffer(application);
		return new ResponseEntity<>(new ResponseDTO("Response sent successfully"), HttpStatus.OK);
	}
	
	@DeleteMapping("/{jobId}/applicant/{applicantId}")
	@PreAuthorize("hasRole('EMPLOYER')")
	public ResponseEntity<ResponseDTO> deleteApplicantFromJob(@PathVariable Long jobId, @PathVariable Long applicantId) throws JobPortalException {
		jobService.deleteApplicantFromJob(jobId, applicantId);
		return new ResponseEntity<>(new ResponseDTO("Applicant deleted from job successfully"), HttpStatus.OK);
	}
	
	@DeleteMapping("/{jobId}")
	@PreAuthorize("hasRole('EMPLOYER')")
	public ResponseEntity<ResponseDTO> deleteJob(@PathVariable Long jobId) throws JobPortalException {
		jobService.deleteJob(jobId);
		return new ResponseEntity<>(new ResponseDTO("Job deleted successfully"), HttpStatus.OK);
	}
	
	
}

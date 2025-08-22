package com.jobportal.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jobportal.dto.ApplicantDTO;
import com.jobportal.dto.Application;
import com.jobportal.dto.ApplicationStatus;
import com.jobportal.dto.JobDTO;
import com.jobportal.dto.JobStatus;
import com.jobportal.dto.NotificationDTO;
import com.jobportal.dto.StatusUpdateDTO;
import com.jobportal.entity.Applicant;
import com.jobportal.entity.Job;
import com.jobportal.exception.JobPortalException;
import com.jobportal.repository.JobRepository;
import com.jobportal.utility.Utilities;

@Service("jobService")
public class JobServiceImpl implements JobService {

	@Autowired
	private JobRepository jobRepository;
	@Autowired
	private NotificationService notificationService;
	@Autowired
	private WebSocketNotificationService webSocketNotificationService;
	@Autowired
	private LeaderboardService leaderboardService;

	@Override
	public JobDTO postJob(JobDTO jobDTO) throws JobPortalException {
		if(jobDTO.getId()==0) {
			jobDTO.setId(Utilities.getNextSequenceId("jobs"));
			jobDTO.setPostTime(LocalDateTime.now());
			// Убираем создание уведомления "Job Posted" так как есть фронтенд уведомление "Success"
		}
		else {
			Job job=jobRepository.findById(jobDTO.getId()).orElseThrow(() -> new JobPortalException("JOB_NOT_FOUND"));
			if(job.getJobStatus().equals(JobStatus.DRAFT) || jobDTO.getJobStatus().equals(JobStatus.CLOSED))jobDTO.setPostTime(LocalDateTime.now());
			
			// Если статус вакансии изменился, отправляем WebSocket уведомление
			if (!job.getJobStatus().equals(jobDTO.getJobStatus())) {
				StatusUpdateDTO statusUpdate = new StatusUpdateDTO();
				statusUpdate.setJobId(jobDTO.getId());
				statusUpdate.setOldStatus(job.getJobStatus().toString());
				statusUpdate.setNewStatus(jobDTO.getJobStatus().toString());
				statusUpdate.setType("JOB_STATUS");
				statusUpdate.setMessage("Job status changed from " + job.getJobStatus() + " to " + jobDTO.getJobStatus());
				statusUpdate.setTargetUserId(jobDTO.getPostedBy());
				
				// Отправляем обновление работодателю
				webSocketNotificationService.sendStatusUpdateToUser(jobDTO.getPostedBy(), statusUpdate);
			}
		}
		jobRepository.save(jobDTO.toEntity());
		
		// Обновляем leaderboard для работодателя
		updateEmployerLeaderboard(jobDTO.getPostedBy());
		
		return jobDTO;
	}

	
	@Override
	public List<JobDTO> getAllJobs() throws JobPortalException {
		return jobRepository.findAll().stream().map((x) -> x.toDTO()).toList();
	}

	@Override
	public JobDTO getJob(Long id) throws JobPortalException {
		return jobRepository.findById(id).orElseThrow(() -> new JobPortalException("JOB_NOT_FOUND")).toDTO();
	}

	@Override
	public void applyJob(Long id, ApplicantDTO applicantDTO) throws JobPortalException {
		System.out.println("JobServiceImpl: Начинаем обработку заявки для вакансии " + id + " от кандидата " + applicantDTO.getApplicantId());
		
		Job job = jobRepository.findById(id).orElseThrow(() -> new JobPortalException("JOB_NOT_FOUND"));
		List<Applicant> applicants = job.getApplicants();
		if (applicants == null)applicants = new ArrayList<>();
		if (applicants.stream().filter((x) -> x.getApplicantId() == applicantDTO.getApplicantId()).toList().size() > 0)throw new JobPortalException("JOB_APPLIED_ALREADY");
		applicantDTO.setApplicationStatus(ApplicationStatus.APPLIED);
		applicants.add(applicantDTO.toEntity());
		job.setApplicants(applicants);
		jobRepository.save(job);
		
		System.out.println("JobServiceImpl: Заявка сохранена в базе данных");
		
		// Добавляем отправку уведомления employer-у через Kafka
		NotificationDTO notiDto = new NotificationDTO();
		notiDto.setAction("New Application");
		notiDto.setMessage("New applicant " + applicantDTO.getName() + " has applied for your job: " + job.getJobTitle() + " at " + job.getCompany());
		notiDto.setUserId(job.getPostedBy());
		notiDto.setRoute("/posted-jobs/" + job.getId());
		notificationService.sendNotification(notiDto);
		
		// Отправляем WebSocket уведомление о новой заявке работодателю
		StatusUpdateDTO statusUpdate = new StatusUpdateDTO();
		statusUpdate.setJobId(job.getId());
		statusUpdate.setApplicantId(applicantDTO.getApplicantId());
		statusUpdate.setOldStatus("NONE");
		statusUpdate.setNewStatus(ApplicationStatus.APPLIED.toString());
		statusUpdate.setType("NEW_APPLICATION");
		statusUpdate.setMessage("New application received from " + applicantDTO.getName());
		statusUpdate.setTargetUserId(job.getPostedBy());
		
		// Добавляем полные данные кандидата
		statusUpdate.setApplicantName(applicantDTO.getName());
		statusUpdate.setApplicantEmail(applicantDTO.getEmail());
		statusUpdate.setApplicantPhone(applicantDTO.getPhone());
		statusUpdate.setApplicantWebsite(applicantDTO.getWebsite());
		statusUpdate.setApplicantResume(applicantDTO.getResume());
		statusUpdate.setApplicantCoverLetter(applicantDTO.getCoverLetter());
		
		System.out.println("JobServiceImpl: Данные кандидата для WebSocket:");
		System.out.println("  Имя: " + applicantDTO.getName());
		System.out.println("  Email: " + applicantDTO.getEmail());
		System.out.println("  Телефон: " + applicantDTO.getPhone());
		System.out.println("  Веб-сайт: " + applicantDTO.getWebsite());
		
		// Отправляем обновление работодателю через WebSocket
		System.out.println("Отправляем WebSocket уведомление о новой заявке для работодателя " + job.getPostedBy());
		webSocketNotificationService.sendStatusUpdateToUser(job.getPostedBy(), statusUpdate);
		System.out.println("JobServiceImpl: WebSocket уведомление отправлено");
	}

	@Override
	public List<JobDTO> getHistory(Long id, ApplicationStatus applicationStatus) {
		return jobRepository.findByApplicantIdAndApplicationStatus(id, applicationStatus).stream().map((x) -> x.toDTO())
				.toList();
	}

	@Override
	public List<JobDTO> getJobsPostedBy(Long id) throws JobPortalException {
		return jobRepository.findByPostedBy(id).stream().map((x) -> x.toDTO()).toList();
	}


	@Override
	public void changeAppStatus(Application application) throws JobPortalException {
		Job job = jobRepository.findById(application.getId()).orElseThrow(() -> new JobPortalException("JOB_NOT_FOUND"));
		
		// Находим текущий статус заявки
		ApplicationStatus oldStatus = job.getApplicants().stream()
			.filter(app -> app.getApplicantId().equals(application.getApplicantId()))
			.findFirst()
			.map(Applicant::getApplicationStatus)
			.orElse(null);
		
		List<Applicant> apps = job.getApplicants().stream().map((x) -> {
			if (application.getApplicantId() == x.getApplicantId()) {
				x.setApplicationStatus(application.getApplicationStatus());
				if(application.getApplicationStatus().equals(ApplicationStatus.INTERVIEWING)) {
					x.setInterviewTime(application.getInterviewTime());
					NotificationDTO notiDto=new NotificationDTO();
					notiDto.setAction("Interview Scheduled");
					notiDto.setMessage("Interview scheduled for job: "+job.getJobTitle());
					notiDto.setUserId(application.getApplicantId());
					notiDto.setRoute("/job-history");
					try {
						notificationService.sendNotification(notiDto);
					} catch (JobPortalException e) {
						e.printStackTrace();
					}
				} else if(application.getApplicationStatus().equals(ApplicationStatus.OFFERED)) {
					NotificationDTO notiDto=new NotificationDTO();
					notiDto.setAction("Application Accepted");
					notiDto.setMessage("Congratulations! You have been accepted for job: "+job.getJobTitle());
					notiDto.setUserId(application.getApplicantId());
					notiDto.setRoute("/job-history");
					try {
						notificationService.sendNotification(notiDto);
					} catch (JobPortalException e) {
						e.printStackTrace();
					}
				} else if(application.getApplicationStatus().equals(ApplicationStatus.REJECTED)) {
					NotificationDTO notiDto=new NotificationDTO();
					notiDto.setAction("Application Rejected");
					notiDto.setMessage("Unfortunately, you have been rejected for job: "+job.getJobTitle());
					notiDto.setUserId(application.getApplicantId());
					notiDto.setRoute("/job-history");
					try {
						notificationService.sendNotification(notiDto);
					} catch (JobPortalException e) {
						e.printStackTrace();
					}
				}
			}
			return x;
		}).toList();
		job.setApplicants(apps);
		jobRepository.save(job);
		
		// Отправляем обновление статуса через WebSocket
		StatusUpdateDTO statusUpdate = new StatusUpdateDTO();
		statusUpdate.setJobId(application.getId());
		statusUpdate.setApplicantId(application.getApplicantId());
		statusUpdate.setOldStatus(oldStatus != null ? oldStatus.toString() : "UNKNOWN");
		statusUpdate.setNewStatus(application.getApplicationStatus().toString());
		statusUpdate.setType("APPLICATION_STATUS");
		statusUpdate.setMessage("Application status changed from " + oldStatus + " to " + application.getApplicationStatus());
		statusUpdate.setTargetUserId(application.getApplicantId());
		
		// Отправляем обновление соискателю
		webSocketNotificationService.sendStatusUpdateToUser(application.getApplicantId(), statusUpdate);
		
		// Отправляем обновление работодателю
		webSocketNotificationService.sendStatusUpdateToUser(job.getPostedBy(), statusUpdate);
	}

	@Override
	public void deleteApplicantFromJob(Long jobId, Long applicantId) throws JobPortalException {
		Job job = jobRepository.findById(jobId)
			.orElseThrow(() -> new JobPortalException("JOB_NOT_FOUND"));
		List<Applicant> applicants = job.getApplicants();
		if (applicants == null || applicants.isEmpty()) {
			throw new JobPortalException("NO_APPLICANTS_FOUND");
		}
		boolean removed = applicants.removeIf(applicant -> applicant.getApplicantId().equals(applicantId));
		if (!removed) {
			throw new JobPortalException("APPLICANT_NOT_FOUND");
		}
		job.setApplicants(applicants);
		jobRepository.save(job);
	}

	@Override
	public void respondToOffer(Application application) throws JobPortalException {
		Job job = jobRepository.findById(application.getId()).orElseThrow(() -> new JobPortalException("JOB_NOT_FOUND"));
		
		// Находим текущий статус заявки
		ApplicationStatus oldStatus = job.getApplicants().stream()
			.filter(app -> app.getApplicantId().equals(application.getApplicantId()))
			.findFirst()
			.map(Applicant::getApplicationStatus)
			.orElse(null);
		
		List<Applicant> apps = job.getApplicants().stream().map((x) -> {
			if (application.getApplicantId() == x.getApplicantId()) {
				x.setApplicationStatus(application.getApplicationStatus());
				
				// Отправляем уведомление работодателю
				NotificationDTO notiDto = new NotificationDTO();
				if(application.getApplicationStatus().equals(ApplicationStatus.ACCEPTED)) {
					notiDto.setAction("Offer Accepted");
					notiDto.setMessage("Your offer for job: " + job.getJobTitle() + " has been accepted by the applicant");
				} else if(application.getApplicationStatus().equals(ApplicationStatus.REJECTED)) {
					notiDto.setAction("Offer Rejected");
					notiDto.setMessage("Your offer for job: " + job.getJobTitle() + " has been rejected by the applicant");
				}
				notiDto.setUserId(job.getPostedBy());
				notiDto.setRoute("/posted-jobs/" + job.getId());
				try {
					notificationService.sendNotification(notiDto);
				} catch (JobPortalException e) {
					e.printStackTrace();
				}
			}
			return x;
		}).toList();
		job.setApplicants(apps);
		jobRepository.save(job);
		
		// Отправляем обновление статуса через WebSocket
		StatusUpdateDTO statusUpdate = new StatusUpdateDTO();
		statusUpdate.setJobId(application.getId());
		statusUpdate.setApplicantId(application.getApplicantId());
		statusUpdate.setOldStatus(oldStatus != null ? oldStatus.toString() : "UNKNOWN");
		statusUpdate.setNewStatus(application.getApplicationStatus().toString());
		statusUpdate.setType("APPLICATION_STATUS");
		statusUpdate.setMessage("Offer response: " + application.getApplicationStatus());
		statusUpdate.setTargetUserId(job.getPostedBy());
		
		// Отправляем обновление работодателю
		webSocketNotificationService.sendStatusUpdateToUser(job.getPostedBy(), statusUpdate);
	}

	@Override
	public void deleteJob(Long jobId) throws JobPortalException {
		Job job = jobRepository.findById(jobId)
			.orElseThrow(() -> new JobPortalException("JOB_NOT_FOUND"));
		
		// Проверяем, что вакансия закрыта
		if (!job.getJobStatus().equals(JobStatus.CLOSED)) {
			throw new JobPortalException("CANNOT_DELETE_ACTIVE_JOB");
		}
		
		// Удаляем вакансию из базы данных
		jobRepository.delete(job);
		System.out.println("JobServiceImpl: Вакансия " + jobId + " удалена из базы данных");
		
		// Обновляем leaderboard для работодателя после удаления вакансии
		updateEmployerLeaderboard(job.getPostedBy());
	}

	/**
	 * Обновляет leaderboard для работодателя
	 * @param employerId ID работодателя
	 */
	private void updateEmployerLeaderboard(Long employerId) {
		try {
			// Подсчитываем количество активных вакансий работодателя
			long jobCount = jobRepository.findByPostedBy(employerId).stream()
					.filter(job -> !job.getJobStatus().equals(JobStatus.CLOSED))
					.count();
			
			// Обновляем leaderboard
			leaderboardService.updateEmployerJobCount(employerId.toString(), jobCount);
		} catch (Exception e) {
			System.err.println("Error updating leaderboard for employer " + employerId + ": " + e.getMessage());
		}
	}

}

import {Button, Divider, Drawer } from "@mantine/core";
import PostedJob from "../Components/PostedJob/PostedJob";
import PostedJobDesc from "../Components/PostedJob/PostedJobDesc";
import { useEffect, useState, useCallback } from "react";
import { getJobsPostedBy } from "../Services/JobService";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { hideOverlay, showOverlay } from "../Slices/OverlaySlice";
import StatusUpdateService, { StatusUpdate } from "../Services/StatusUpdateService";

const PostedJobPage = () => {
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const {id}=useParams();
    const user=useSelector((state:any)=>state.user);
    const [opened, { open, close }] = useDisclosure(false);
    const [jobList, setJobList] = useState<any>([]);
    const [job, setJob] = useState<any>(null);
    const matches = useMediaQuery('(max-width: 767px)');

    // Функция для обработки изменения статуса вакансии
    const handleJobStatusChange = useCallback((jobId: number, oldStatus: string, newStatus: string) => {
        console.log(`PostedJobPage: Обрабатываем изменение статуса вакансии ${jobId}: ${oldStatus} → ${newStatus}`);
        
        // Обновляем список вакансий
        setJobList((prevJobList: any[]) => {
            return prevJobList.map((jobItem: any) => {
                if (jobItem.id === jobId) {
                    const updatedJob = {
                        ...jobItem,
                        jobStatus: newStatus
                    };
                    console.log(`PostedJobPage: Обновляем статус вакансии ${jobId} на ${newStatus}`);
                    return updatedJob;
                }
                return jobItem;
            });
        });
        
        // Если это текущая выбранная вакансия, обновляем её тоже
        if (job && job.id === jobId) {
            setJob((prevJob: any) => {
                if (!prevJob) return prevJob;
                return {
                    ...prevJob,
                    jobStatus: newStatus
                };
            });
        }
    }, [job]);

    // Функция для обработки удаления вакансии
    const handleJobDelete = useCallback((deletedJobId: number) => {
        console.log(`PostedJobPage: Обрабатываем удаление вакансии ${deletedJobId}`);
        
        // Удаляем вакансию из списка
        setJobList((prevJobList: any[]) => {
            const updatedList = prevJobList.filter((jobItem: any) => jobItem.id !== deletedJobId);
            console.log(`PostedJobPage: Обновленный список вакансий:`, updatedList);
            
            // Если удаленная вакансия была открыта, находим другую активную вакансию
            if (job && job.id === deletedJobId) {
                console.log(`PostedJobPage: Удаленная вакансия была открыта, ищем замену`);
                
                // Сначала ищем активную вакансию
                const activeJob = updatedList.find((jobItem: any) => jobItem.jobStatus === "ACTIVE");
                
                if (activeJob) {
                    console.log(`PostedJobPage: Найдена активная вакансия для замены:`, activeJob);
                    setJob(activeJob);
                    navigate(`/posted-jobs/${activeJob.id}`);
                } else if (updatedList.length > 0) {
                    // Если нет активных, берем первую доступную
                    const firstAvailableJob = updatedList[0];
                    console.log(`PostedJobPage: Найдена доступная вакансия для замены:`, firstAvailableJob);
                    setJob(firstAvailableJob);
                    navigate(`/posted-jobs/${firstAvailableJob.id}`);
                } else {
                    // Если нет вакансий вообще, перенаправляем на /posted-jobs
                    console.log(`PostedJobPage: Нет доступных вакансий, перенаправляем на /posted-jobs`);
                    setJob(null);
                    navigate('/posted-jobs');
                }
            }
            
            return updatedList;
        });
    }, [job, navigate]);

    // Обработчик обновления статусов
    const handleStatusUpdate = useCallback((update: StatusUpdate) => {
        console.log(`Получено обновление статуса в PostedJobPage: ${update.oldStatus} → ${update.newStatus} для заявки ${update.jobId}`);
        
        // Если это изменение статуса вакансии
        if (update.type === "JOB_STATUS") {
            console.log(`Статус вакансии изменился: ${update.oldStatus} → ${update.newStatus}`);
            
            setJobList((prevJobList: any[]) => {
                return prevJobList.map((jobItem: any) => {
                    if (jobItem.id === update.jobId) {
                        const updatedJob = {
                            ...jobItem,
                            jobStatus: update.newStatus
                        };
                        console.log(`Обновляем статус вакансии ${update.jobId} на ${update.newStatus}`);
                        return updatedJob;
                    }
                    return jobItem;
                });
            });
            
            // Если это текущая выбранная вакансия, обновляем её тоже
            if (job && job.id === update.jobId) {
                setJob((prevJob: any) => {
                    if (!prevJob) return prevJob;
                    return {
                        ...prevJob,
                        jobStatus: update.newStatus
                    };
                });
            }
        }
        
        // Если это новая заявка или изменение статуса для вакансии в нашем списке
        if (update.type === "NEW_APPLICATION" || update.type === "APPLICATION_STATUS") {
            console.log(`PostedJobPage: Получено обновление типа ${update.type}:`, update);
            setJobList((prevJobList: any[]) => {
                return prevJobList.map((jobItem: any) => {
                    if (jobItem.id === update.jobId) {
                        // Обновляем список кандидатов для этой вакансии
                        const updatedApplicants = jobItem.applicants ? [...jobItem.applicants] : [];
                        
                        if (update.type === "NEW_APPLICATION") {
                            // Добавляем нового кандидата
                            const existingApplicant = updatedApplicants.find((app: any) => app.applicantId === update.applicantId);
                            if (!existingApplicant) {
                                const newApplicant = {
                                    applicantId: update.applicantId,
                                    applicationStatus: update.newStatus,
                                    name: update.applicantName || `Кандидат ${update.applicantId}`,
                                    email: update.applicantEmail || `candidate${update.applicantId}@example.com`,
                                    phone: update.applicantPhone,
                                    website: update.applicantWebsite,
                                    resume: update.applicantResume,
                                    coverLetter: update.applicantCoverLetter,
                                };
                                console.log(`PostedJobPage: Добавляем нового кандидата:`, newApplicant);
                                updatedApplicants.push(newApplicant);
                            }
                        } else if (update.type === "APPLICATION_STATUS") {
                            // Обновляем статус существующего кандидата
                            const applicantIndex = updatedApplicants.findIndex((app: any) => app.applicantId === update.applicantId);
                            if (applicantIndex !== -1) {
                                updatedApplicants[applicantIndex] = {
                                    ...updatedApplicants[applicantIndex],
                                    applicationStatus: update.newStatus
                                };
                            }
                        }
                        
                        return {
                            ...jobItem,
                            applicants: updatedApplicants
                        };
                    }
                    return jobItem;
                });
            });
            
            // Если это текущая выбранная вакансия, обновляем её тоже
            if (job && job.id === update.jobId) {
                setJob((prevJob: any) => {
                    if (!prevJob) return prevJob;
                    
                    const updatedApplicants = prevJob.applicants ? [...prevJob.applicants] : [];
                    
                    if (update.type === "NEW_APPLICATION") {
                        const existingApplicant = updatedApplicants.find((app: any) => app.applicantId === update.applicantId);
                        if (!existingApplicant) {
                            const newApplicant = {
                                applicantId: update.applicantId,
                                applicationStatus: update.newStatus,
                                name: update.applicantName || `Кандидат ${update.applicantId}`,
                                email: update.applicantEmail || `candidate${update.applicantId}@example.com`,
                                phone: update.applicantPhone,
                                website: update.applicantWebsite,
                                resume: update.applicantResume,
                                coverLetter: update.applicantCoverLetter,
                            };
                            console.log(`PostedJobPage: Обновляем текущую вакансию с новым кандидатом:`, newApplicant);
                            updatedApplicants.push(newApplicant);
                        }
                    } else if (update.type === "APPLICATION_STATUS") {
                        const applicantIndex = updatedApplicants.findIndex((app: any) => app.applicantId === update.applicantId);
                        if (applicantIndex !== -1) {
                            updatedApplicants[applicantIndex] = {
                                ...updatedApplicants[applicantIndex],
                                applicationStatus: update.newStatus
                            };
                        }
                    }
                    
                    return {
                        ...prevJob,
                        applicants: updatedApplicants
                    };
                });
            }
        }
    }, [job]);

    // Регистрируем обработчик обновлений статусов
    useEffect(() => {
        StatusUpdateService.onStatusUpdate(handleStatusUpdate);
        return () => {
            StatusUpdateService.removeStatusUpdateCallback(handleStatusUpdate);
        };
    }, [handleStatusUpdate]);

    // Загружаем список вакансий один раз (без мигания при смене id)
    useEffect(()=>{
        dispatch(showOverlay());
        getJobsPostedBy(user.id)
            .then((res)=>{
                setJobList(res);
                if(res && res.length>0 && (!id || Number(id) === 0)){
                    const firstActive = res.find((x:any)=>x.jobStatus === "ACTIVE") || res[0];
                    if(firstActive){
                        navigate(`/posted-jobs/${firstActive.id}`);
                    }
                }
            })
            .catch((err)=>console.log(err))
            .finally(()=>dispatch(hideOverlay()));
    }, [user.id, id, navigate])

    // При смене id просто выбираем вакансию из уже загруженного списка
    useEffect(()=>{
        if(!id) return;
        const found = jobList.find((item:any)=> String(item.id) === String(id));
        if(found){
            setJob(found);
        }
    }, [id, jobList])
    return (
        <div className="min-h-[90vh] bg-mine-shaft-950 font-['poppins'] px-5  ">
            <Divider />
            {matches&&<Button my="xs" size="sm" autoContrast onClick={open}>All Jobs</Button>}
            <Drawer opened={opened} size={230} overlayProps={{ backgroundOpacity: 0.5, blur: 4 }} onClose={close} title="All Jobs">
                <PostedJob job={job} jobList={jobList} onJobDelete={handleJobDelete} onJobStatusChange={handleJobStatusChange}/>   
            </Drawer>
            <div className="flex gap-5 justify-around py-5">
                {!matches&&<PostedJob job={job} jobList={jobList} onJobDelete={handleJobDelete} onJobStatusChange={handleJobStatusChange}/>          }              
                <PostedJobDesc {...job} onJobDelete={handleJobDelete} onJobStatusChange={handleJobStatusChange} />
            </div>
        </div>
    )
}
export default PostedJobPage;
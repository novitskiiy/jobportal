import { Tabs } from "@mantine/core";
import { useEffect, useState, useCallback } from "react";
import PostedJobCard from "./PostedJobCard";
import StatusUpdateService, { StatusUpdate } from "../../Services/StatusUpdateService";

const PostedJob = (props:any) => {

    const [activeTab, setActiveTab] = useState<string | null>(props.job?.jobStatus|| "ACTIVE");
    const [jobList, setJobList] = useState<any[]>(props.jobList || []);

    // Функция для обработки удаления вакансии
    const handleJobDelete = (deletedJobId: number) => {
        console.log(`PostedJob: Обрабатываем удаление вакансии ${deletedJobId}`);
        
        // Удаляем вакансию из локального списка
        setJobList((prevJobList: any[]) => {
            const updatedList = prevJobList.filter((jobItem: any) => jobItem.id !== deletedJobId);
            console.log(`PostedJob: Обновленный список вакансий:`, updatedList);
            
            // При удалении любой вакансии анимированно переключаемся на Active
            console.log(`PostedJob: Удалена вакансия, анимированно переключаемся на ACTIVE`);
            animateTabSwitch(activeTab || "CLOSED", "ACTIVE");
            
            return updatedList;
        });
        
        // Вызываем функцию родительского компонента
        if (props.onJobDelete) {
            props.onJobDelete(deletedJobId);
        }
    };

    // Функция для анимированного переключения вкладок
    const animateTabSwitch = (fromTab: string, toTab: string) => {
        console.log(`PostedJob: Анимированное переключение с ${fromTab} на ${toTab}`);
        
        // Добавляем небольшую задержку для анимации
        setTimeout(() => {
            setActiveTab(toTab);
        }, 100);
    };

    // Обработчик обновления статуса
    const handleStatusUpdate = useCallback((update: StatusUpdate) => {
        // Если это изменение статуса вакансии
        if (update.type === "JOB_STATUS") {
            console.log(`PostedJob: Статус вакансии изменился: ${update.oldStatus} → ${update.newStatus}`);
            
            setJobList((prevJobList: any[]) => {
                return prevJobList.map((job: any) => {
                    if (job.id === update.jobId) {
                        const updatedJob = {
                            ...job,
                            jobStatus: update.newStatus
                        };
                        console.log(`PostedJob: Обновляем статус вакансии ${update.jobId} на ${update.newStatus}`);
                        return updatedJob;
                    }
                    return job;
                });
            });
            
            // Автоматическое переключение вкладок при изменении статуса
            if (update.oldStatus === "ACTIVE" && update.newStatus === "CLOSED") {
                console.log(`PostedJob: Вакансия закрыта, анимированно переключаемся с ACTIVE на CLOSED`);
                animateTabSwitch("ACTIVE", "CLOSED");
            } else if (update.oldStatus === "CLOSED" && update.newStatus === "ACTIVE") {
                console.log(`PostedJob: Вакансия открыта, анимированно переключаемся с CLOSED на ACTIVE`);
                animateTabSwitch("CLOSED", "ACTIVE");
            }
            
            // Вызываем функцию родительского компонента
            if (props.onJobStatusChange) {
                props.onJobStatusChange(update.jobId, update.oldStatus, update.newStatus);
            }
        }
        
        // Если это изменение статуса заявки
        if (update.type === "NEW_APPLICATION" || update.type === "APPLICATION_STATUS") {
        
            // Обновляем список вакансий при изменении статуса заявки
            setJobList((prevJobList: any[]) => {
                return prevJobList.map((job: any) => {
                    if (job.id === update.jobId) {
                        return {
                            ...job,
                            applicants: job.applicants?.map((applicant: any) => {
                                if (applicant.applicantId === update.applicantId) {
                                    return { ...applicant, applicationStatus: update.newStatus };
                                }
                                return applicant;
                            })
                        };
                    }
                    return job;
                });
            });

            // Показываем уведомление о перемещении кандидата
            console.log(`Кандидат ${update.applicantId} перемещен из ${update.oldStatus} в ${update.newStatus} для вакансии ${update.jobId}`);
        }
    }, [props.onJobStatusChange]);

    // Регистрируем обработчик обновлений статусов
    useEffect(() => {
        StatusUpdateService.onStatusUpdate(handleStatusUpdate);
        return () => {
            StatusUpdateService.removeStatusUpdateCallback(handleStatusUpdate);
        };
    }, [handleStatusUpdate]);

    useEffect(() => {
        // Устанавливаем активную вкладку только при первой загрузке или если вакансия не выбрана
        if (!activeTab || !props.job) {
            setActiveTab(props.job?.jobStatus || "ACTIVE");
        }
    }, [props.job, activeTab]);

    useEffect(() => {
        setJobList(props.jobList || []);
    }, [props.jobList]);
    return <div className="w-1/5">
        <div className="text-2xl font-semibold mb-5">Jobs</div>
        <div>
            <Tabs variant="pills" autoContrast value={activeTab} onChange={setActiveTab}>
                <Tabs.List className="[&_button[aria-selected='false']]:bg-mine-shaft-900 font-medium transition-all duration-300 ease-in-out">
                    <Tabs.Tab value="ACTIVE" className="transition-all duration-300 ease-in-out">Active [{jobList.filter((job:any)=>job?.jobStatus=="ACTIVE").length}]</Tabs.Tab>
                    <Tabs.Tab value="DRAFT" className="transition-all duration-300 ease-in-out">Drafts [{jobList.filter((job:any)=>job?.jobStatus=="DRAFT").length}]</Tabs.Tab>
                    <Tabs.Tab value="CLOSED" className="transition-all duration-300 ease-in-out">Closed [{jobList.filter((job:any)=>job?.jobStatus=="CLOSED").length}]</Tabs.Tab>
                </Tabs.List>
            </Tabs>
        </div>
        <div className="flex flex-col flex-wrap mt-5 gap-5">
            {
              jobList.filter((job:any)=>job?.jobStatus==activeTab) .sort((a: any, b: any) => new Date(b.postTime).getTime() - new Date(a.postTime).getTime()).map((item:any, index:any)=> <PostedJobCard key={index} {...item} onJobDelete={handleJobDelete}/>) 
              
            }
        </div>
    </div>

}
export default PostedJob;
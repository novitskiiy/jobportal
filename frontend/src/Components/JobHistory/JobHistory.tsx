import { Tabs } from "@mantine/core";
import Card from "./Card";
import { useEffect, useState, useCallback } from "react";
import { getAllJobs } from "../../Services/JobService";
import { useDispatch, useSelector } from "react-redux";
import { hideOverlay, showOverlay } from "../../Slices/OverlaySlice";
import StatusUpdateService, { StatusUpdate } from "../../Services/StatusUpdateService";
import "./JobHistory.css";

const JobHistory = () => { 
    const dispatch=useDispatch();
    const user=useSelector((state:any)=>state.user);
    const profile=useSelector((state:any)=>state.profile);
    const [activeTab, setActiveTab] = useState<any>('APPLIED');
    const [jobList, setJobList] = useState<any>([]);
    const[showList, setShowList]=useState<any>([]);
    const [animatingJobId, setAnimatingJobId] = useState<number | null>(null);
    
    // Функция для фильтрации заявок по статусу
    const filterJobsByStatus = useCallback((jobs: any[], status: string) => {
        console.log(`Фильтруем ${jobs.length} заявок по статусу: ${status}`);
        
        if (status === "SAVED") {
            const savedJobs = jobs.filter((job: any) => profile?.savedJobs?.includes(job.id));
            console.log(`Найдено ${savedJobs.length} сохраненных заявок`);
            return savedJobs;
        } else {
            const filteredJobs = jobs.filter((job: any) => {
                let found = false;
                if (job.applicants && Array.isArray(job.applicants)) {
                    job.applicants.forEach((applicant: any) => {
                        if (applicant.applicantId === user.id && applicant.applicationStatus === status) {
                            found = true;
                        }
                    });
                }
                return found;
            });
            console.log(`Найдено ${filteredJobs.length} заявок со статусом ${status} для пользователя ${user.id}`);
            return filteredJobs;
        }
    }, [user.id, profile?.savedJobs]);

    // Обработчик обновления статуса
    const handleStatusUpdate = useCallback((update: StatusUpdate) => {
        console.log(`Получено обновление статуса: ${update.oldStatus} → ${update.newStatus} для заявки ${update.jobId}`);
        
        if (update.applicantId === user.id) {
            console.log(`Обновление относится к текущему пользователю ${user.id}`);
            
            // Запускаем анимацию для обновленной карточки
            setAnimatingJobId(update.jobId);
            setTimeout(() => setAnimatingJobId(null), 2000);

            // Обновляем список заявок
            setJobList((prevJobs: any[]) => {
                const updatedJobs = prevJobs.map((job: any) => {
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

                // Автоматически переключаемся на вкладку с новым статусом
                if (update.newStatus !== activeTab) {
                    console.log(`Переключаемся с ${activeTab} на ${update.newStatus}`);
                    setActiveTab(update.newStatus);
                    // Обновляем showList с новыми данными
                    if (update.newStatus === "REJECTED") {
                        console.log(`Статус REJECTED - убираем карточку из интерфейса`);
                        setShowList([]);
                    } else {
                        const newShowList = filterJobsByStatus(updatedJobs, update.newStatus);
                        console.log(`Найдено ${newShowList.length} заявок для статуса ${update.newStatus}`);
                        setShowList(newShowList);
                        
                        // Проверяем, что карточка действительно найдена
                        const foundJob = newShowList.find((job: any) => job.id === update.jobId);
                        if (foundJob) {
                            console.log(`Карточка успешно добавлена в список для вкладки ${update.newStatus}`);
                        } else {
                            console.warn(`Карточка не найдена в списке для вкладки ${update.newStatus}`);
                        }
                    }
                } else {
                    // Если остаемся на той же вкладке, обновляем список
                    if (update.newStatus === "REJECTED") {
                        console.log(`Статус REJECTED - убираем карточку из интерфейса`);
                        setShowList([]);
                    } else {
                        setShowList((prevShowList: any[]) => {
                            const filteredList = prevShowList.filter((job: any) => job.id !== update.jobId);
                            const updatedJob = updatedJobs.find((job: any) => job.id === update.jobId);
                            if (updatedJob) {
                                return [...filteredList, updatedJob];
                            }
                            return filteredList;
                        });
                    }
                }

                return updatedJobs;
            });
        }
    }, [user.id, activeTab, filterJobsByStatus]);

    // Обработчик изменения статуса заявки
    const handleStatusChange = useCallback((jobId: number, newStatus: string) => {
        console.log(`Статус заявки ${jobId} изменен на ${newStatus}`);
        
        // Обновляем список заявок
        setJobList((prevJobs: any[]) => {
            return prevJobs.map((job: any) => {
                if (job.id === jobId) {
                    return {
                        ...job,
                        applicants: job.applicants?.map((applicant: any) => {
                            if (applicant.applicantId === user.id) {
                                return { ...applicant, applicationStatus: newStatus };
                            }
                            return applicant;
                        })
                    };
                }
                return job;
            });
        });
        
        // Автоматически переключаемся на вкладку с новым статусом
        if (newStatus !== activeTab) {
            console.log(`Переключаемся с ${activeTab} на ${newStatus}`);
            setActiveTab(newStatus);
        }
        
        // Обновляем showList с новыми данными
        setJobList((prevJobs: any[]) => {
            const updatedJobs = prevJobs.map((job: any) => {
                if (job.id === jobId) {
                    return {
                        ...job,
                        applicants: job.applicants?.map((applicant: any) => {
                            if (applicant.applicantId === user.id) {
                                return { ...applicant, applicationStatus: newStatus };
                            }
                            return applicant;
                        })
                    };
                }
                return job;
            });
            
            // Для статуса REJECTED не показываем карточку вообще
            if (newStatus === "REJECTED") {
                console.log(`Статус REJECTED - убираем карточку из интерфейса`);
                setShowList([]);
            } else {
                const newShowList = filterJobsByStatus(updatedJobs, newStatus);
                setShowList(newShowList);
            }
            return updatedJobs;
        });
    }, [user.id, activeTab, filterJobsByStatus]);

    // Регистрируем обработчик обновлений статусов
    useEffect(() => {
        StatusUpdateService.onStatusUpdate(handleStatusUpdate);
        return () => {
            StatusUpdateService.removeStatusUpdateCallback(handleStatusUpdate);
        };
    }, [handleStatusUpdate]);

    useEffect(() => {
        dispatch(showOverlay());
        getAllJobs().then((res) => {
            setJobList(res);
            setShowList(filterJobsByStatus(res, 'APPLIED'));
        }).catch((err) => console.log(err))
        .finally(() => dispatch(hideOverlay()));
    }, [filterJobsByStatus, user.id]);

    // Отслеживаем изменения showList для отладки
    useEffect(() => {
        console.log(`showList обновлен: ${showList.length} элементов, активная вкладка: ${activeTab}`);
    }, [showList, activeTab]);
    const handleTabChange = (value: string | null) => {
        if (value) {
            setShowList(filterJobsByStatus(jobList, value));
            setActiveTab(value);
        }
    }
    return <div>
        <div className="text-2xl font-semibold mb-5">Job History</div>
        <div>
            <Tabs  value={activeTab} onChange={handleTabChange} radius="lg" autoContrast variant="outline">
                <Tabs.List className="font-semibold [&_button[data-active='true']]:!border-b-mine-shaft-950 [&_button]:!text-xl sm-mx:[&_button]:!text-lg  xs-mx:[&_button]:!text-base xsm-mx:[&_button]:!text-sm xs-mx:[&_button]:!px-1.5 xs-mx:[&_button]:!py-2 mb-5 [&_button[data-active='true']]:text-ocean-blue-400 xs-mx:font-medium">
                    <Tabs.Tab value="APPLIED">Applied</Tabs.Tab>
                    <Tabs.Tab value="INTERVIEWING">In Progress</Tabs.Tab>
                    <Tabs.Tab value="OFFERED">Offered</Tabs.Tab>
                    <Tabs.Tab value="ACCEPTED">Accepted</Tabs.Tab>
                    <Tabs.Tab value="SAVED">Saved</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value={activeTab} className="[&>div]:w-full">
                    <div className="flex mt-10 flex-wrap gap-5">
                        {
                            showList.length>0?showList.map((item:any, index:any)=> (
                                <div 
                                    key={index} 
                                    className={animatingJobId === item.id ? 'status-update-highlight' : ''}
                                >
                                    <Card {...item} {...{ [activeTab.toLowerCase()]: true }} onStatusChange={handleStatusChange} />
                                </div>
                            )):<div className="text-lg font-medium">Nothing to show..</div>
                        }
                    </div>
                </Tabs.Panel>

            </Tabs>
        </div>
    </div>
}
export default JobHistory;
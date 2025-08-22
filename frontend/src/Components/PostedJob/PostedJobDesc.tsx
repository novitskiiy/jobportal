import { Badge, Divider, Tabs } from "@mantine/core";
import Job from "../JobDesc/Job";
import TalentCard from "../FindTalent/TalentCard";
import { useEffect, useState, useCallback } from "react";
import { deleteApplicantFromJob } from '../../Services/JobService';
import { errorNotification, successNotification } from '../../Services/NotificationService';
import StatusUpdateService, { StatusUpdate } from '../../Services/StatusUpdateService';

const PostedJobDesc = (props:any) => {
    const [tab, setTab]=useState("overview");
    const [arr, setArr]=useState<any>([]);
    const [applicants, setApplicants] = useState<any[]>(props.applicants || []);
    
    // Обработчик обновления статусов
    const handleStatusUpdate = useCallback((update: StatusUpdate) => {
        console.log(`Получено обновление статуса в PostedJobDesc: ${update.oldStatus} → ${update.newStatus} для заявки ${update.jobId}`);
        console.log(`PostedJobDesc: Полные данные обновления:`, update);
        
        // Если это новая заявка для текущей вакансии
        if (update.jobId === props.id && update.type === "NEW_APPLICATION") {
            console.log(`Новая заявка получена для вакансии ${props.id}`);
            
            // Обновляем список кандидатов
            setApplicants((prevApplicants: any[]) => {
                // Проверяем, что кандидат еще не добавлен
                const existingApplicant = prevApplicants.find(app => app.applicantId === update.applicantId);
                if (!existingApplicant) {
                    // Добавляем нового кандидата с реальными данными
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
                    console.log(`PostedJobDesc: Добавляем нового кандидата с данными:`, newApplicant);
                    console.log(`Добавляем нового кандидата:`, newApplicant);
                    console.log(`PostedJobDesc: Полученные данные кандидата:`, {
                        name: update.applicantName,
                        email: update.applicantEmail,
                        phone: update.applicantPhone,
                        website: update.applicantWebsite
                    });
                    return [...prevApplicants, newApplicant];
                }
                return prevApplicants;
            });
            
            // Если мы находимся на вкладке applicants, обновляем отображаемый список
            if (tab === "applicants") {
                setArr((prevArr: any[]) => {
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
                    console.log(`Добавляем кандидата в отображаемый список:`, newApplicant);
                    return [...prevArr, newApplicant];
                });
            }
        }
        
        // Если это изменение статуса существующей заявки
        if (update.jobId === props.id && update.type === "APPLICATION_STATUS") {
            console.log(`Статус заявки изменен для вакансии ${props.id}`);
            
            // Обновляем список кандидатов
            setApplicants((prevApplicants: any[]) => {
                return prevApplicants.map((applicant: any) => {
                    if (applicant.applicantId === update.applicantId) {
                        return { ...applicant, applicationStatus: update.newStatus };
                    }
                    return applicant;
                });
            });
            
            // Обновляем отображаемый список в зависимости от текущей вкладки
            setArr((prevArr: any[]) => {
                // Удаляем кандидата из текущего списка
                const filteredArr = prevArr.filter((applicant: any) => applicant.applicantId !== update.applicantId);
                
                // Если новый статус соответствует текущей вкладке, добавляем обратно
                if ((tab === "applicants" && update.newStatus === "APPLIED") ||
                    (tab === "invited" && update.newStatus === "INTERVIEWING") ||
                    (tab === "offered" && (update.newStatus === "OFFERED" || update.newStatus === "ACCEPTED")) ||
                    (tab === "rejected" && update.newStatus === "REJECTED")) {
                    
                    const updatedApplicant = applicants.find((app: any) => app.applicantId === update.applicantId);
                    if (updatedApplicant) {
                        return [...filteredArr, { ...updatedApplicant, applicationStatus: update.newStatus }];
                    }
                }
                
                // Для статуса REJECTED не добавляем обратно в текущий список
                // Для ACCEPTED оставляем в разделе "Offered"
                
                return filteredArr;
            });
            
            // Если статус изменился на REJECTED, обновляем список кандидатов
            if (update.newStatus === "REJECTED") {
                setApplicants((prevApplicants: any[]) => {
                    const updatedApplicants = prevApplicants.map((applicant: any) => {
                        if (applicant.applicantId === update.applicantId) {
                            return { ...applicant, applicationStatus: update.newStatus };
                        }
                        return applicant;
                    });
                    
                    // Обновляем отображаемый список для текущей вкладки
                    if (tab === "offered") {
                        // Убираем кандидата из вкладки "Offered" полностью
                        setArr(updatedApplicants.filter((x: any) => x.applicationStatus === "OFFERED" || x.applicationStatus === "ACCEPTED"));
                    } else if (tab === "rejected") {
                        setArr(updatedApplicants.filter((x: any) => x.applicationStatus === "REJECTED"));
                    }
                    
                    return updatedApplicants;
                });
            }
        }
    }, [props.id, tab, applicants]);
    
    // Регистрируем обработчик обновлений статусов
    useEffect(() => {
        StatusUpdateService.onStatusUpdate(handleStatusUpdate);
        return () => {
            StatusUpdateService.removeStatusUpdateCallback(handleStatusUpdate);
        };
    }, [handleStatusUpdate]);
    
    // Обработчик изменения статуса кандидата
    const handleStatusChange = useCallback((applicantId: number, newStatus: string) => {
        console.log(`Статус кандидата ${applicantId} изменен на ${newStatus}`);
        
        // Обновляем список кандидатов
        setApplicants((prevApplicants: any[]) => {
            return prevApplicants.map((applicant: any) => {
                if (applicant.applicantId === applicantId) {
                    return { ...applicant, applicationStatus: newStatus };
                }
                return applicant;
            });
        });
        
        // Обновляем отображаемый список в зависимости от текущей вкладки
        setArr((prevArr: any[]) => {
            // Удаляем кандидата из текущего списка
            const filteredArr = prevArr.filter((applicant: any) => applicant.applicantId !== applicantId);
            
            // Если новый статус соответствует текущей вкладке, добавляем обратно
            if ((tab === "applicants" && newStatus === "APPLIED") ||
                (tab === "invited" && newStatus === "INTERVIEWING") ||
                (tab === "offered" && (newStatus === "OFFERED" || newStatus === "ACCEPTED")) ||
                (tab === "rejected" && newStatus === "REJECTED")) {
                
                const updatedApplicant = applicants.find((app: any) => app.applicantId === applicantId);
                if (updatedApplicant) {
                    return [...filteredArr, { ...updatedApplicant, applicationStatus: newStatus }];
                }
            }
            
            // Для статуса REJECTED не добавляем обратно в текущий список
            // Для ACCEPTED оставляем в разделе "Offered"
            
            return filteredArr;
        });
        
        // Если статус изменился на REJECTED, обновляем список кандидатов и убираем из текущей вкладки
        if (newStatus === "REJECTED") {
            setApplicants((prevApplicants: any[]) => {
                const updatedApplicants = prevApplicants.map((applicant: any) => {
                    if (applicant.applicantId === applicantId) {
                        return { ...applicant, applicationStatus: newStatus };
                    }
                    return applicant;
                });
                
                // Обновляем отображаемый список для текущей вкладки
                if (tab === "offered") {
                    // Убираем кандидата из вкладки "Offered" полностью
                    setArr(updatedApplicants.filter((x: any) => x.applicationStatus === "OFFERED" || x.applicationStatus === "ACCEPTED"));
                } else if (tab === "rejected") {
                    setArr(updatedApplicants.filter((x: any) => x.applicationStatus === "REJECTED"));
                }
                
                return updatedApplicants;
            });
        }
    }, [tab, applicants]);
    
    const handleTab=(value:any)=>{
        setTab(value);
        if(value=="applicants")setArr(applicants?.filter((x:any)=>x.applicationStatus=="APPLIED"));
        else if(value=="invited")setArr(applicants?.filter((x:any)=>x.applicationStatus=="INTERVIEWING"));
        else if(value=="offered")setArr(applicants?.filter((x:any)=>x.applicationStatus=="OFFERED" || x.applicationStatus=="ACCEPTED"));
        else if(value=="rejected")setArr(applicants?.filter((x:any)=>x.applicationStatus=="REJECTED"));
    }
    
    // Обновляем applicants при изменении props
    useEffect(() => {
        setApplicants(props.applicants || []);
    }, [props.applicants]);
    
    useEffect(()=>{
        handleTab("overview");
    }, [props]);
    return <div data-aos="zoom-out" className=" w-3/4 md-mx:w-full px-5 md-mx:p-0">
        {props.jobTitle?<><div className="text-2xl xs-mx:text-xl font-semibold flex items-center ">{props?.jobTitle} <Badge variant="light" ml="sm" color="brightSun.4" size="sm">{props?.jobStatus}</Badge></div>
        <div className="font-medium xs-mx:text-sm text-mine-shaft-300 mb-5">{props?.location}</div>
        <div className="">
            <Tabs value={tab} onChange={handleTab} radius="lg" autoContrast variant="outline">
                <Tabs.List className="font-semibold [&_button[data-active='true']]:!border-b-mine-shaft-950 [&_button]:!text-xl sm-mx:[&_button]:!text-lg  xs-mx:[&_button]:!text-base xsm-mx:[&_button]:!text-sm xs-mx:[&_button]:!px-1.5 xs-mx:[&_button]:!py-2 mb-5 [&_button[data-active='true']]:text-ocean-blue-400 xs-mx:font-medium">
                    <Tabs.Tab value="overview">Overview</Tabs.Tab>
                    <Tabs.Tab value="applicants">Applicants</Tabs.Tab>
                    <Tabs.Tab value="invited">Invited</Tabs.Tab>
                    <Tabs.Tab value="offered">Offered</Tabs.Tab>
                    <Tabs.Tab value="rejected">Rejected</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="overview" className="[&>div]:w-full">{props.jobStatus=="CLOSED"?<Job {...props} edit={true} closed onJobDelete={props.onJobDelete} onJobStatusChange={props.onJobStatusChange} />:<Job {...props} edit={true} onJobDelete={props.onJobDelete} onJobStatusChange={props.onJobStatusChange} />}</Tabs.Panel>
                <Tabs.Panel value="applicants"><div className="flex mt-10 flex-wrap gap-5 justify-around">
                    {arr?.length?arr.map((talent:any, index:any) =>  <TalentCard key={index} {...talent} posted={true} jobTitle={props.jobTitle} company={props.company} onStatusChange={handleStatusChange}/>):"No Applicants Yet"
                    }
                </div></Tabs.Panel>
                <Tabs.Panel value="invited"><div className="flex mt-10 flex-wrap gap-5 justify-around">
                    {
                        arr?.length?arr.map((talent:any, index:any) =>  <TalentCard key={index} {...talent} invited jobTitle={props.jobTitle} company={props.company} onStatusChange={handleStatusChange}/>):"No Applicants Invited Yet"
                    }
                </div></Tabs.Panel>
                <Tabs.Panel value="offered"><div className="flex mt-10 flex-wrap gap-5 justify-around">
                    {
                         arr?.length?arr.map((talent:any, index:any) =>  <TalentCard key={index} {...talent} offered applicationStatus={talent.applicationStatus} jobTitle={props.jobTitle} company={props.company} onStatusChange={handleStatusChange}/>):"No Applicants Offered Yet"
                    }
                </div></Tabs.Panel>
                <Tabs.Panel value="rejected"><div className="flex mt-10 flex-wrap gap-5 justify-around">
                    {
                         arr?.length?arr?.map((talent:any, index:any) =>  (
                                <TalentCard
                                    key={index}
                                    {...talent}
                                    offered
                                    jobTitle={props.jobTitle}
                                    company={props.company}
                                    onStatusChange={handleStatusChange}
                                    onDelete={async () => {
                                        try {
                                            await deleteApplicantFromJob(props.id, talent.applicantId);
                                            successNotification('Deleted', 'User removed from rejected');
                                            setArr((prev:any) => prev.filter((a:any) => a.applicantId !== talent.applicantId));
                                        } catch (err: any) {
                                            errorNotification('Error', err?.response?.data?.errorMessage || 'Error deleting user');
                                        }
                                    }}
                                />
                        )):"No Applicants Rejected Yet"
                    }
                </div></Tabs.Panel>
                
            </Tabs>
        </div></>:<div className="text-2xl font-semibold flex items-center justify-center min-h-[70vh]">Job Not Found.</div>}
    </div>
}
export default PostedJobDesc;
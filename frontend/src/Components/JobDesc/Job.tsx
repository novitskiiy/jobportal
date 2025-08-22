import { ActionIcon, Button, Divider } from "@mantine/core";
import { card} from "../../Data/JobDescData";
import { IconBookmark, IconBookmarkFilled } from "@tabler/icons-react";
// @ts-ignore
import DOMPurify from 'dompurify';
import { Link, useNavigate } from "react-router-dom";
import { timeAgo, formatSalary } from "../../Services/Utilities";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { changeProfile } from "../../Slices/ProfileSlice";
import { postJob, deleteJob } from "../../Services/JobService";
import { successNotification, errorNotification } from "../../Services/NotificationService";
import { hideOverlay, showOverlay } from "../../Slices/OverlaySlice";

const Job = (props:any) => {
    const dispatch=useDispatch();
    const navigate = useNavigate();
    const user=useSelector((state:any)=>state.user);
    const profile=useSelector((state:any)=>state.profile);
    const handleSaveJob = () => {
        let savedJobs:any=profile.savedJobs?[...profile.savedJobs]:[];
        if(savedJobs.includes(props.id)){
            savedJobs=savedJobs.filter((job:any)=>job!=props.id);
        }else{ 
            savedJobs.push(props.id);
        }
        let updatedProfile={...profile,savedJobs:savedJobs};
        dispatch(changeProfile(updatedProfile));
    }
    const [applied, setApplied] = useState(false);
    useEffect(()=>{
        if(props.applicants?.filter((applicant:any)=>applicant.applicantId==user.id).length>0){
            setApplied(true);
        }
        else setApplied(false);
    }, [props])
    const cleanHTML = DOMPurify.sanitize(props.description);
    const handleClose = () => {
        if(props.closed)return;
        dispatch(showOverlay())
        postJob({...props, jobStatus:"CLOSED"}).then((res)=>{
            successNotification('Job Closed', 'Job has been closed successfully');
            // Вызываем функцию изменения статуса
            if (props.onJobStatusChange) {
                props.onJobStatusChange(props.id, "ACTIVE", "CLOSED");
            }
        }).catch((err)=>console.log(err))
        .finally(()=>dispatch(hideOverlay()));
    }
    
    const handleReopen = () => {
        if(!props.closed)return;
        dispatch(showOverlay())
        postJob({...props, jobStatus:"ACTIVE"}).then((res)=>{
            successNotification('Job Reopened', 'Job has been reopened successfully');
            // Вызываем функцию изменения статуса
            if (props.onJobStatusChange) {
                props.onJobStatusChange(props.id, "CLOSED", "ACTIVE");
            }
        }).catch((err)=>console.log(err))
        .finally(()=>dispatch(hideOverlay()));
    }
    
    const handleDelete = () => {
        if(!props.closed) return;
        if(!window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) return;
        
        dispatch(showOverlay())
        deleteJob(props.id).then((res)=>{
            successNotification('Job Deleted', 'Job has been deleted successfully');
            // Вызываем функцию обработки удаления
            if (props.onJobDelete) {
                props.onJobDelete(props.id);
            } else {
                // Fallback: перенаправляем на страницу posted jobs
                navigate('/posted-jobs');
            }
        }).catch((err)=>{
            console.log(err);
            errorNotification('Error', err.response?.data?.errorMessage || 'Failed to delete job');
        }).finally(()=>dispatch(hideOverlay()));
    }
    return <div data-aos="zoom-out" className="w-2/3 bs-mx:w-full">
        <div className="flex justify-between items-center flex-wrap">
            <div className="flex items-center gap-2">
                <div className="p-3 bg-mine-shaft-800 rounded-xl shrink-0 flex ">
                    <img 
                        className="h-14 xs-mx:h-10 xs-mx:w-10" 
                        src={`/Icons/${props.company}.png`} 
                        alt={`${props.company} logo`}
                        onError={(e) => {
                            e.currentTarget.src = '/Icons/Google.png'; // fallback to Google icon
                        }}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <div className="font-semibold text-2xl xs-mx:text-xl">{props.jobTitle}</div>
                    <div className="text-lg text-mine-shaft-300 flex flex-wrap xs-mx:text-base"><span>{props.company}</span></div>
                </div>

            </div>
            <div className="flex sm:flex-col gap-2 items-center sm-mx:my-5 sm-mx:w-full sm-mx:[&>button]:w-1/2">
                {props.edit && !props.closed && <Link to={`/post-job/${props.id}`}>
                    <Button color="brightSun.4" size="sm" variant="light">Edit</Button>
                </Link>}
                {!props.edit && !applied && <Link to={`/apply-job/${props.id}`}>
                    <Button color="brightSun.4" size="sm" variant="light">Apply</Button>
                </Link>}
                {applied && !props.edit && <Button  color="green.8" size="sm" variant="light">Applied</Button>}
                {props.edit && !props.closed? <Button onClick={handleClose}  color="red.4" size="sm" variant="light">Close</Button>:null}
                {props.edit && props.closed && <Button onClick={handleReopen}  color="brightSun.4" size="sm" variant="light">Reopen</Button>}
                {props.edit && props.closed && <Button onClick={handleDelete}  color="red.6" size="sm" variant="filled">Delete</Button>}
                {!props.edit && (profile.savedJobs?.includes(props.id) ?<IconBookmarkFilled onClick={handleSaveJob} className="cursor-pointer text-brightSun-400 " stroke={1.5} />:<IconBookmark onClick={handleSaveJob} className="cursor-pointer hover:text-brightSun-400  text-brightSun-400" stroke={1.5} />)}
            </div>
        </div>
        <Divider size="xs" my="xl" />
        <div className="flex justify-between gap-4 sm-mx:flex-wrap">
            {
                card.map((item, index) =>                 <div key={index} className="flex flex-col text-sm gap-1 items-center ">
                    <ActionIcon className="!h-12 !w-12 xs-mx:!h-8 xs-mx:!w-8" variant="light" color="brightSun.4" radius="xl" ><item.icon className="h-4/5 w-4/5" /></ActionIcon>
                    <div className="text-mine-shaft-300 xs-mx:text-sm">{item.name}</div>
                    <div className="text-base font-semibold xs-mx:text-sm">{item.id === "packageOffered" ? formatSalary(props[item.id]) : (props ? props[item.id] : "NA")}</div>
                </div>)}
        </div>
        <Divider size="xs" my="xl" />
        <div>
            <div className="text-xl font-semibold mb-5">Required Skills</div>
            <div className="flex flex-wrap gap-2">
                {
                    props.skillsRequired?.map((skill:any, index:number) => <ActionIcon key={index} className="!h-fit !w-fit font-medium !text-sm xs-mx:!text-xs" variant="light" color="brightSun.4" p="xs" radius="xl">{skill}</ActionIcon>)
                }
            </div>
        </div>
        <Divider size="xs" my="xl" />
        <div className="[&>h4]:text-xl [&_*]:text-mine-shaft-300 [&_li]:marker:text-ocean-blue-300 [&_li]:mb-1 [&>h4]:text-mine-shaft-200 [&>h4]:font-semibold [&>h4]:my-5 [&_p]:text-justify [&_p]:text-sm [&_li]:text-sm" dangerouslySetInnerHTML={{ __html: cleanHTML }}>
        </div>
        <Divider size="xs" my="xl" />
        <div>
            <div className="text-xl font-semibold mb-5">About Company</div>
            <div className="flex items-center gap-2 mb-3">
                <div className="p-3 bg-mine-shaft-800 rounded-xl flex ">
                                            <img 
                            className="h-8" 
                            src={`/Icons/${props.company}.png`} 
                            alt={`${props.company} logo`}
                            onError={(e) => {
                                e.currentTarget.src = '/Icons/Google.png'; // fallback to Google icon
                            }}
                        />
                </div>
                <div>
                    <div className="text-lg font-medium">{props.company}</div>
                    <div className="text-mine-shaft-300">10k+ Employees</div>
                </div>
            </div>
            <div className="text-mine-shaft-300 text-justify xs-mx:text-sm">
                {props.about || `${props.company} is a leading technology company focused on innovation and growth. We are committed to creating exceptional products and services that make a difference in people's lives. Our team consists of talented professionals who are passionate about their work and dedicated to achieving excellence in everything we do.`}
            </div>
        </div>
    </div>
}
export default Job;
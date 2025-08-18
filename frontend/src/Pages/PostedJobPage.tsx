import {Button, Divider, Drawer } from "@mantine/core";
import PostedJob from "../Components/PostedJob/PostedJob";
import PostedJobDesc from "../Components/PostedJob/PostedJobDesc";
import { useEffect, useState } from "react";
import { getJobsPostedBy } from "../Services/JobService";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { hideOverlay, showOverlay } from "../Slices/OverlaySlice";

const PostedJobPage = () => {
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const {id}=useParams();
    const user=useSelector((state:any)=>state.user);
    const [opened, { open, close }] = useDisclosure(false);
    const [jobList, setJobList] = useState<any>([]);
    const [job, setJob] = useState<any>(null);
    const matches = useMediaQuery('(max-width: 767px)');

    // Загружаем список вакансий один раз (без мигания при смене id)
    useEffect(()=>{
        dispatch(showOverlay());
        getJobsPostedBy(user.id)
            .then((res)=>{
                setJobList(res);
                if(res && res.length>0 && Number(id) === 0){
                    const firstActive = res.find((x:any)=>x.jobStatus === "ACTIVE") || res[0];
                    if(firstActive){
                        navigate(`/posted-jobs/${firstActive.id}`);
                    }
                }
            })
            .catch((err)=>console.log(err))
            .finally(()=>dispatch(hideOverlay()));
    }, [])

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
                <PostedJob job={job} jobList={jobList}/>   
            </Drawer>
            <div className="flex gap-5 justify-around py-5">
                {!matches&&<PostedJob job={job} jobList={jobList}/>          }              
                <PostedJobDesc {...job} />
            </div>
        </div>
    )
}
export default PostedJobPage;
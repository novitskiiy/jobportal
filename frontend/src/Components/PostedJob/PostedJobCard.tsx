import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@mantine/core";
import { timeAgo } from "../../Services/Utilities";
import { deleteJob } from "../../Services/JobService";
import { successNotification, errorNotification } from "../../Services/NotificationService";
import { useDispatch } from "react-redux";
import { hideOverlay, showOverlay } from "../../Slices/OverlaySlice";

const PostedJobCard=(props:any)=>{
    const {id}=useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault(); // Предотвращаем переход по ссылке
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
    };
    
    return (
        <div className={`relative rounded-xl p-2 w-52 lg-mx:w-48 bs-mx:w-44 border-l-2 border-l-ocean-blue-400 ${props.id==id?"bg-ocean-blue-400 text-black":"bg-mine-shaft-900 text-mine-shaft-300"}`}>
            <Link to={`/posted-jobs/${props.id}`} className="block hover:bg-opacity-80 cursor-pointer">
                <div className={`text-sm font-semibold`}>{props.jobTitle}</div>
                <div className="text-xs font-medium">{props.location}</div>
                <div className="text-xs">{props.jobStatus=="DRAFT"?"Drafted":props.jobStatus=="CLOSED"?"Closed":"Posted"} {timeAgo(props.postTime)}</div>
            </Link>
        </div>
    )
}
export default PostedJobCard;
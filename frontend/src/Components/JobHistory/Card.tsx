import { Button, Divider, Text } from "@mantine/core";
import { IconBookmark, IconBookmarkFilled, IconCalendarMonth, IconClockHour3 } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { timeAgo, formatSalary } from "../../Services/Utilities";
import { useEffect } from "react";
import { changeProfile } from "../../Slices/ProfileSlice";
import { respondToOffer } from "../../Services/JobService";
import { successNotification, errorNotification } from "../../Services/NotificationService";

const Card = (props: any) => {
    const dispatch=useDispatch();
    const profile=useSelector((state:any)=>state.profile);
    const user=useSelector((state:any)=>state.user);
    
    const handleSaveJob = () => {
        let savedJobs:any=[...profile.savedJobs];
        if(savedJobs.includes(props.id)){
            savedJobs=savedJobs.filter((job:any)=>job!=props.id);
        }else{ 
            savedJobs.push(props.id);
        }
        let updatedProfile={...profile,savedJobs:savedJobs};
        dispatch(changeProfile(updatedProfile));
    }
    
    const handleRespondToOffer = async (status: string) => {
        try {
            const application = {
                id: props.id,
                applicantId: user.id,
                applicationStatus: status
            };
            await respondToOffer(application);
            if(status === "ACCEPTED") {
                successNotification("Offer Accepted", "You have successfully accepted the job offer!");
            } else {
                successNotification("Offer Rejected", "You have rejected the job offer.");
            }
            
            // Плавное обновление вместо перезагрузки страницы
            if (props.onStatusChange) {
                props.onStatusChange(props.id, status);
            }
        } catch (err: any) {
            errorNotification("Error", err.response?.data?.errorMessage || "Failed to respond to offer");
        }
    }
    return <div data-aos="zoom-out" className="p-4 rounded-xl bg-mine-shaft-900   hover:shadow-[0_0_5px_1px_#3b82f6] !shadow-ocean-blue-400  transition duration-300 ease-in-out w-72 flex flex-col gap-3">
        <div className="flex justify-between">
            <div className="flex gap-2 items-center">
                <div className="p-2 bg-mine-shaft-800 rounded-md">
                    <img 
                        className="h-7" 
                        src={`/Icons/${props.company}.png`} 
                        alt={`${props.company} logo`}
                        onError={(e) => {
                            e.currentTarget.src = '/Icons/Google.png'; // fallback to Google icon
                        }}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <div className="font-semibold ">{props.jobTitle}</div>
                    <div className="text-xs text-mine-shaft-300"><Link className="hover:text-mine-shaft-200" to="/company">{props.company}</Link> &bull; {props.applicants?props.applicants.length:0} Applicants</div>
                </div>
            </div>
            {profile.savedJobs?.includes(props.id) ? <IconBookmarkFilled onClick={handleSaveJob} className="cursor-pointer text-brightSun-400 " stroke={1.5} /> : <IconBookmark onClick={handleSaveJob} className="cursor-pointer hover:text-brightSun-400 text-brightSun-400" stroke={1.5} />}
        </div>
        <div className="flex gap-2">
            <div className="p-2 py-1 bg-mine-shaft-800 text-ocean-blue-400 rounded-lg text-xs">{props.experience}</div>
            <div className="p-2 py-1  bg-mine-shaft-800 text-ocean-blue-400 rounded-lg text-xs">{props.jobType}</div>
            <div className="p-2 py-1  bg-mine-shaft-800 text-ocean-blue-400 rounded-lg text-xs">{props.location}</div>
        </div>
        <div>
            <Text className="!text-xs text-justify !text-mine-shaft-300" lineClamp={3}>{props.about}
            </Text>
        </div>
        <Divider color="mineShaft.7" size="xs" />
        <div className="flex justify-between">
            <div className="font-semibold text-mine-shaft-200">{formatSalary(props.packageOffered)}</div>
            <div className="text-xs flex gap-1 items-center text-mine-shaft-400">
                <IconClockHour3 className="h-5 w-5" stroke={1.5} /> {props.applied ? "Applied" : props.interviewing ? "Interviewed" : props.offered ? "Offered" : props.accepted ? "Accepted" : "Posted"} {timeAgo(props.postTime)}
            </div>
        </div>
        {(props.offered || props.interviewing || props.accepted) && <Divider color="mineShaft.7" size="xs" />}
        {props.offered &&
        <div className="flex gap-2">
            <div className="w-1/2">
                <Button color="green" variant="filled" fullWidth onClick={() => handleRespondToOffer("ACCEPTED")}>Accept</Button>
            </div>
            <div className="w-1/2">
                <Button color="red" variant="filled" fullWidth onClick={() => handleRespondToOffer("REJECTED")}>Reject</Button>
            </div>
        </div>
        }
        {props.accepted &&
        <div className="flex gap-1 text-sm items-center justify-center">
            <div className="text-green-400 font-semibold">✓ Offer Accepted</div>
        </div>
        }
        {props.interviewing &&<div className="flex gap-1 text-sm">
                        <IconCalendarMonth className=" text-ocean-blue-400 w-5 h-5" stroke={1.5} /> Sun, 25 August &bull; <span className="text-mine-shaft-400">10 AM - 11 AM</span>
        </div>}
        <div className="flex gap-2">
            <Link to={`/jobs/${props.id}`} className="flex-1">
                <Button color="brightSun.4" variant="light" fullWidth>View Job</Button>
            </Link>
            {props.interviewing && (
                <Link to="/interview" className="flex-1">
                    <Button color="brightSun.4" variant="outline" fullWidth>Join Interview</Button>
                </Link>
            )}
        </div>
    </div>
}
export default Card;
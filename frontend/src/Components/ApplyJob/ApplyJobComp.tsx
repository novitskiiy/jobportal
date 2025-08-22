import {  Divider} from "@mantine/core";
import { timeAgo } from "../../Services/Utilities";
import ApplicationForm from "./ApplicationForm";

const ApplyJobComp = (props:any) => {
    return <div className="w-2/3 bs-mx:w-4/5 sm-mx:w-full m-auto">
        
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div className="p-3 bg-mine-shaft-800 rounded-xl flex shrink-0 ">
                    <img 
                    className="h-14  xs-mx:h-10 xs-mx:w-10" 
                    src={`/Icons/${props.company}.png`} 
                    alt={`${props.company} logo`}
                    onError={(e) => {
                        e.currentTarget.src = '/Icons/Google.png'; // fallback to Google icon
                    }}
                />
                </div>
                <div className="flex flex-col gap-1">
                    <div className="font-semibold text-2xl  xs-mx:text-xl">{props.jobTitle}</div>
                    <div className="text-lg text-mine-shaft-300 flex-wrap xs-mx:text-base"><span>{props.company}</span></div>
                </div>
            </div>
        </div>
        <Divider size="xs" my="xl" />
       <ApplicationForm/>
    </div>
}
export default ApplyJobComp;
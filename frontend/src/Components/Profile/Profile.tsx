import { ActionIcon, Avatar, Button, Checkbox, Divider, FileInput, Indicator, Overlay, Pill, TagsInput, Textarea } from "@mantine/core";

import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../../Services/ProfileService";
import Info from "./Info";
import { changeProfile, setProfile } from "../../Slices/ProfileSlice";
import About from "./About";
import Skills from "./Skills";
import Experience from "./Experience";
import Certification from "./Certifications";
import { useHover } from "@mantine/hooks";
import { successNotification } from "../../Services/NotificationService";
import { IconEdit } from "@tabler/icons-react";
import { getBase64 } from "../../Services/Utilities";



const Profile = () => {
    const dispatch = useDispatch();
    const profile = useSelector((state: any) => state.profile);
    
    const { hovered, ref } = useHover();
    const handleFileChange =async (image:any) => {
        let picture:any=await getBase64(image);
        let updatedProfile={ ...profile, picture:picture.split(',')[1]};
        dispatch(changeProfile(updatedProfile));
        successNotification("Success","Profile Picture Updated Successfully");
    };
    

    return <div className="w-4/5 lg-mx:w-full mx-auto">
        <div className="bg-mine-shaft-900 rounded-xl overflow-hidden shadow-lg">
            <div data-aos="zoom-out" className="relative">
                <img className="w-full h-48 object-cover" src="/Profile/banner.jpg" alt="" />
                <div ref={ref} className="absolute cursor-pointer flex items-center justify-center !rounded-full -bottom-16 left-1/2 transform -translate-x-1/2">
                    <Avatar className="!w-32 !h-32 md-mx:!w-28 md-mx:!h-28 sm-mx:!w-24 sm-mx:!h-24 xs-mx:!h-20 xs-mx:!w-20 border-mine-shaft-950 border-4 rounded-full" src={profile.picture?`data:image/jpeg;base64,${profile.picture}`:'/avatar.png'} alt="" />
                    {hovered && <Overlay ref={ref} className="!rounded-full" color="#000" backgroundOpacity={0.75} />}
                    {hovered && <IconEdit className="absolute z-[300] !w-12 !h-12" />}
                    {hovered && <FileInput onChange={handleFileChange} className="absolute [&_*]:!rounded-full z-[301] [&_*]:!h-full w-full !h-full" variant="unstyled" accept="image/png,image/jpeg" />}
                </div>
            </div>                                                                                              
            <div className="px-6 pt-20 pb-6 relative z-0">
                <Info />
                <Divider my="xl" />
                <About />
                <Divider my="xl" />
                <Skills/>
                <Divider my="xl" />
                <Experience/>
                <Divider my="xl" />
                <Certification/>
            </div>
        </div>
    </div>
}
export default Profile;
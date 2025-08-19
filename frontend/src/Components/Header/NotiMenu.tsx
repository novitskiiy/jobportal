import { Indicator, Menu, Notification, rem } from "@mantine/core";
import { IconBell, IconCheck } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../Services/useNotifications";

const NotiMenu = () => {
    const navigate = useNavigate();
    const { notifications, markAsRead } = useNotifications();
    
    const handleNotificationClick = (notification: any, index: number) => {
        navigate(notification.route);
        markAsRead(notification.id, index);
    };
    const [opened, setOpened] = useState(false);
    return <Menu shadow="md" width={400} opened={opened} onChange={setOpened}>
        <Menu.Target>
            <div className=" bg-mine-shaft-900 p-1.5 rounded-full">
                <Indicator disabled={notifications.length<=0} color="brightSun.4" offset={6} size={8} processing>
                    <IconBell stroke={1.5} />
                </Indicator>
            </div>
        </Menu.Target>

        <Menu.Dropdown onChange={() => setOpened(true)}>
            <div className="flex flex-col gap-1">
                {
                    notifications.map((noti: any, index:number) => <Notification onClick={()=>{
                        handleNotificationClick(noti, index);
                        setOpened(false);
                    }}
                     key={index} className="hover:bg-mine-shaft-900 cursor-pointer" onClose={()=>markAsRead(noti.id, index)} icon={<IconCheck  style={{ width: rem(20), height: rem(20) }} />} color="teal" title={noti.action} mt="md">
                        {noti.message}
                    </Notification>
)}
{
    notifications.length==0 && <div className="text-center text-mine-shaft-300">No Notifications</div>
}
            </div>

        </Menu.Dropdown>
    </Menu>
}
export default NotiMenu;
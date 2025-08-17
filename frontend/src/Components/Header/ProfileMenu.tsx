import { Menu, rem, Avatar, Badge } from '@mantine/core';
import {
    IconLogout2,
    IconUserCircle,
} from '@tabler/icons-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeUser } from '../../Slices/UserSlice';
import { removeJwt } from '../../Slices/JwtSlice';

const ProfileMenu = () => {
    const user=useSelector((state:any)=>state.user);
    const profile=useSelector((state:any)=>state.profile);
    const [opened, setOpened] = useState(false);
    const dispatch = useDispatch();
    
    const handleLogout=()=>{
        dispatch(removeUser());
        dispatch(removeJwt());
    }

    // Определяем цвет и текст для badge в зависимости от типа аккаунта
    const getAccountTypeBadge = () => {
        switch(user?.accountType) {
            case 'EMPLOYER':
                return <Badge color="blue" size="sm" variant="light">Employer</Badge>;
            case 'APPLICANT':
                return <Badge color="green" size="sm" variant="light">Applicant</Badge>;
            default:
                return null;
        }
    };

    return (
        <Menu shadow="md" width={200} opened={opened} onChange={setOpened}>
            <Menu.Target>
                <div className="flex items-center gap-2 cursor-pointer">
                    <div className='xs-mx:hidden flex items-center gap-2'>
                        {getAccountTypeBadge()}
                        <span>{user.name}</span>
                    </div>
                    <Avatar src={profile.picture?`data:image/jpeg;base64,${profile.picture}`:'/avatar.png'} alt="it's me" />
                </div>
            </Menu.Target>

            <Menu.Dropdown onChange={()=>setOpened(true)}>
                <Link to="/profile">
                <Menu.Item  leftSection={<IconUserCircle style={{ width: rem(14), height: rem(14) }} />}>
                    Profile
                </Menu.Item>
                </Link>

                <Menu.Divider />

                <Menu.Item onClick={handleLogout}
                    color="red"
                    leftSection={<IconLogout2 style={{ width: rem(14), height: rem(14) }} />}
                >
                    Logout
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}
export default ProfileMenu;
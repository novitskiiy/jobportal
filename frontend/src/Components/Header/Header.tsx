import { Avatar, Burger, Button, Drawer, Indicator } from "@mantine/core";
import { IconBriefcase, IconAsset, IconBell, IconSettings, IconX, IconArrowLeft } from "@tabler/icons-react";
import NavLinks from "./NavLinks";
import ProfileMenu from "./ProfileMenu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getProfile } from "../../Services/ProfileService";
import { setProfile } from "../../Slices/ProfileSlice";
import NotiMenu from "./NotiMenu";
import { jwtDecode } from "jwt-decode";
import { setUser } from "../../Slices/UserSlice";
import { setupResponseInterceptor } from "../../Interceptor/AxiosInterceptor";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { hideOverlay, showOverlay } from "../../Slices/OverlaySlice";

interface NavLink {
    name: string;
    url: string;
}

const Header = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.user);
    const token = useSelector((state: any) => state.jwt);
    const location = useLocation();
    const navigate = useNavigate();
    const accountType = user?.accountType || localStorage.getItem("accountType");

    // Определяем ссылки для мобильного меню в зависимости от типа аккаунта
    let mobileLinks: NavLink[] = [];
    
    // Если пользователь авторизован, показываем соответствующие ссылки
    if (user) {
        if (accountType === 'EMPLOYER') {
            mobileLinks = [
                { name: "Find Talent", url: "find-talent" },
                { name: "Post Job", url: "post-job/0" },
                { name: "Posted Jobs", url: "posted-jobs" }
            ];
        } else if (accountType === 'APPLICANT') {
            mobileLinks = [
                { name: "Find Jobs", url: "find-jobs" },
                { name: "Job History", url: "job-history" }
            ];
        }
    }

    useEffect(() => {
        setupResponseInterceptor(navigate, dispatch);

    }, [navigate])
    const handleClick = (url: string) => {
        navigate(url)
        close();
    }
    useEffect(() => {
        if (token) {
            if (localStorage.getItem("token")) {
                const decoded = jwtDecode(localStorage.getItem("token") || "");
                dispatch(setUser({ ...decoded, email: decoded.sub }));
            }
        }
        if (user?.profileId) {
            // dispatch(showOverlay())
            getProfile(user?.profileId).then((res) => {
                dispatch(setProfile(res));
            }).catch((err) => console.log(err))
            // .finally(()=>dispatch(hideOverlay()));
        }
    }, [token, navigate]);

    // Не показываем хедер на страницах логина и регистрации
    if (location.pathname === "/signup" || location.pathname === "/login") {
        return null;
    }

    return (
        <div data-aos="zoom-out" className="w-full bg-mine-shaft-950 px-6 text-white h-20 flex justify-between items-center font-['poppins']">
            <div onClick={() => navigate("/")} className="flex gap-1 cursor-pointer items-center text-ocean-blue-400">
                <IconBriefcase className="h-8 w-8" stroke={2.5} />
                <div className=" xs-mx:hidden text-3xl font-semibold">JobPortal</div>
            </div>
            <NavLinks />
            <div className="flex gap-3 items-center">

                {user ? <ProfileMenu /> : <Link to="/login" className="text-mine-shaft-200 hover:text-ocean-blue-400 "><Button color="brightSun.4" variant="light">Login</Button></Link>}
                {/* <div className=" bg-mine-shaft-900 p-1.5 rounded-full">
                    <IconSettings stroke={1.5} />
                </div> */}
                {user ? <NotiMenu /> : null}
                {

                }
                <Burger className="bs:hidden" opened={opened} onClick={open} aria-label="Toggle navigation" />
                <Drawer size="xs" overlayProps={{ backgroundOpacity: 0.5, blur: 4 }} position="right" opened={opened} onClose={close} closeButtonProps={{
                    icon: <IconX size={30} />,
                }} >
                    <div className="flex flex-col gap-6 items-center">

                        {
                            mobileLinks.map((link, index) => <div key={index} className=" h-full flex items-center">
                                <div className="hover:text-ocean-blue-400 text-xl " key={index} onClick={() => handleClick(link.url)} >{link.name}</div>
                            </div>)
                        }
                    </div>
                </Drawer>
            </div>
        </div>
    );
}
export default Header;
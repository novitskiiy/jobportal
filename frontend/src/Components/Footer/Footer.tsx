import { IconBriefcase, IconBrandInstagram, IconBrandTelegram, IconBrandYoutube } from "@tabler/icons-react";
import { useLocation } from "react-router-dom";
import { Divider } from "@mantine/core";

const Footer = () => {
    const location = useLocation();
    return location.pathname !== '/signup' && location.pathname !== '/login' ? (
        <div className="flex flex-col gap-2">
            <div className="pt-20 pb-5 bg-mine-shaft-950 p-4 flex flex-col items-center justify-center text-center gap-4">
                <div className="flex gap-1 items-center text-ocean-blue-400 justify-center">
                    <IconBriefcase className="h-6 w-6" stroke={2.5} />
                    <div className="text-xl font-semibold">JobPortal</div>
                </div>
                <div className="text-sm text-mine-shaft-300 max-w-md">
                    Efficient Job portal developed with modern technologies.
                </div>
            </div>
            <Divider />
            <div data-aos="flip-left" data-aos-offset="0" className="font-medium text-center p-5">
                Designed & Developed By <a className="text-ocean-blue-400 hover:underline font-semibold " href="https://github.com/novitskiiy">Bogdan Veremienko</a>
            </div>
        </div>
    ) : <></>;
}
export default Footer;
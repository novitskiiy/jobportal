
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

interface NavLink {
    name: string;
    url: string;
}

const NavLinks = () => {
    const user = useSelector((state: any) => state.user);
    const accountType = user?.accountType || localStorage.getItem("accountType");
    const location = useLocation();

    // Если пользователь не авторизован, не показываем ссылки
    if (!user) {
        return null;
    }

    // Определяем ссылки в зависимости от типа аккаунта
    let links: NavLink[] = [];
    
    if (accountType === 'EMPLOYER') {
        links = [
            { name: "Find Talent", url: "find-talent" },
            { name: "Post Job", url: "post-job/0" },
            { name: "Posted Jobs", url: "posted-jobs" }
        ];
    } else if (accountType === 'APPLICANT') {
        links = [
            { name: "Find Jobs", url: "find-jobs" },
            { name: "Job History", url: "job-history" },
            { name: "Leaderboard", url: "leaderboard" }
        ];
    }
    
    return <div className="flex bs-mx:!hidden gap-5 text-mine-shaft-300 h-full items-center">
        {   
        links.map((link, index) => <div key={index} className={`${location.pathname=="/"+link.url?"border-ocean-blue-400 text-ocean-blue-400":"border-transparent"} border-t-[3px] h-full flex items-center`}>
                <Link className="hover:text-mine-shaft-200 " key={index} to={link.url} >{link.name}</Link>
            </div>)
            
        }
</div>
}
export default NavLinks;
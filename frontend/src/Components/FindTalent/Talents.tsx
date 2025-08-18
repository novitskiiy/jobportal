import { useEffect, useState } from "react";
import { talents } from "../../Data/TalentData";
import Sort from "../FindJobs/Sort";
import TalentCard from "./TalentCard";
import { getApplicantProfiles } from "../../Services/ProfileService";
import { useDispatch, useSelector } from "react-redux";
import { resetFilter } from "../../Slices/FilterSlice";
import { hideOverlay, showOverlay } from "../../Slices/OverlaySlice";

const Talents=()=>{
    const dispatch=useDispatch();
    const [talents, setTalents] = useState<any>([]);
    const filter=useSelector((state:any)=>state.filter);
    const sort=useSelector((state:any)=>state.sort);
    const [filteredTalents, setFilteredTalents] = useState<any>([]);
    useEffect(() => {
        dispatch(resetFilter());
        dispatch(showOverlay())
        getApplicantProfiles().then((res) => {
            setTalents(res);
        }).catch((err) => console.log(err))
        .finally(()=>dispatch(hideOverlay()))
    },[])
    useEffect(()=>{
        if(sort=="Experience: Low to High"){
            setTalents([...talents].sort((a: any, b: any) => a.totalExp - b.totalExp));
        }
        else if(sort=="Experience: High to Low"){
            setTalents([...talents].sort((a: any, b: any) => b.totalExp - a.totalExp));
        }

    }, [sort])
    useEffect(()=>{
        let filtered = talents;
        
        if(filter.name)filtered=filtered.filter((talent:any)=>talent.name.toLowerCase().includes(filter.name.toLowerCase()));
        if(filter["Job Title"] && filter["Job Title"].length>0)filtered=filtered.filter((talent:any)=>filter["Job Title"]?.some((x:any)=>talent.jobTitle?.toLowerCase().includes(x.toLowerCase())));
        if(filter.Location && filter.Location.length>0)filtered=filtered.filter((talent:any)=>filter.Location?.some((x:any)=>talent.location?.toLowerCase().includes(x.toLowerCase())));
          if(filter.Skills && filter.Skills.length>0)filtered=filtered.filter((talent:any)=>filter.Skills?.some((x:any)=>talent.skills?.some((y:any)=>y.toLowerCase().includes(x.toLowerCase()))));
          if(filter.exp && filter.exp.length>0) {
              console.log('Filter exp:', filter.exp);
              console.log('Talents before exp filter:', filtered.map((t:any) => ({name: t.name, totalExp: t.totalExp, type: typeof t.totalExp})));
              filtered=filtered.filter((talent:any)=>{
                  // Приводим к числам для корректного сравнения
                  const talentExp = Number(talent.totalExp) || 0;
                  const minExp = Number(filter.exp[0]) || 0;
                  const maxExp = Number(filter.exp[1]) || 10;
                  
                  const result = minExp <= talentExp && talentExp <= maxExp;
                  console.log(`Talent ${talent.name}: totalExp=${talent.totalExp} (${typeof talent.totalExp}) -> ${talentExp}, filter=[${minExp},${maxExp}], result=${result}`);
                  return result;
              });
              console.log('Talents after exp filter:', filtered.map((t:any) => ({name: t.name, totalExp: t.totalExp})));
          }
        setFilteredTalents(filtered);
    },[filter,talents])
    return <div className="px-5 py-5">
    <div className="flex justify-between mt-5">
        <div className="text-2xl font-semibold">Talents</div>
        <Sort />
    </div>
    <div className="flex mt-10 flex-wrap gap-5 justify-between">
        {
            filteredTalents.map((talent:any, index:any) => <TalentCard key={index} {...talent}  />)
        }
    </div>
</div>
}
export default Talents;
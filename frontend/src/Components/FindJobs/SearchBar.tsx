import { Button, Collapse, Divider, RangeSlider } from "@mantine/core";

import MultiInput from "./MultiInput";
import React, { useEffect, useState } from "react";
import { dropdownData } from "../../Data/JobsData";
import { useDispatch, useSelector } from "react-redux";
import { updateFilter } from "../../Slices/FilterSlice";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";

const SearchBar = () => {
    const matches = useMediaQuery('(max-width: 475px)');
    const filter=useSelector((state:any)=>state.filter);
    const [opened, { toggle }] = useDisclosure(false);
    const dispatch = useDispatch();
    const [value, setValue] = useState<[number, number]>([0, 300]);
    
    // Функция для безопасного обновления значения
    const safeSetValue = (newValue: [number, number]) => {
        const safeValue: [number, number] = [
            Math.max(0, Math.min(300, newValue[0] || 0)),
            Math.max(0, Math.min(300, newValue[1] || 300))
        ];
        setValue(safeValue);
    };
    
    const handleChange = (event: any) => {
        dispatch(updateFilter({ salary: event }));
    }
    
    useEffect(() => {
        // Синхронизируем локальное состояние с глобальным фильтром
        if (filter.salary && Array.isArray(filter.salary) && filter.salary.length === 2) {
            safeSetValue(filter.salary);
        } else {
            safeSetValue([0, 300]);
        }
    }, [filter.salary])




    return (<div>
        <div className="flex justify-end">

         {matches&&<Button onClick={toggle} m="sm" radius="lg" className="align" variant="outline" color="oceanBlue.4" autoContrast >{opened?"Close":"Filters"}</Button>}
        </div>
        <Collapse in={(opened || !matches)}>
        <div className="px-5 lg-mx:!flex-wrap py-8 items-center !text-mine-shaft-100 flex ">

            {
                dropdownData.map((item, index) => {
                    return <React.Fragment key={index}><div className="w-1/5 lg-mx:w-1/4 bs-mx:w-[30%] sm-mx:w-[48%] xs-mx:w-full xs-mx:mb-1" ><MultiInput title={item.title} icon={item.icon} options={item.options} />
                    </div>
                        <Divider className="sm-mx:hidden" mr="xs" size="xs" orientation="vertical" /></React.Fragment>

                })
            }
            <div className="w-1/5 lg-mx:w-1/4 lg-mx:mt-7 bs-mx:w-[30%] xs-mx:mb-1 sm-mx:w-[48%] text-sm text-mine-shaft-300 [&_.mantine-Slider-label]:!translate-y-10 xs-mx:w-full">
                <div className="flex mb-1 justify-between">
                    <div>Salary</div>
                    <div>${Math.max(0, value[0] || 0)}K - ${Math.min(300, value[1] || 300)}K</div>
                </div>
                <RangeSlider 
                    color="blue" 
                    size="xs" 
                    value={value} 
                    onChange={safeSetValue} 
                    onChangeEnd={handleChange}
                    min={0}
                    max={300}
                    step={1}
                />
            </div>
        </div>
        </Collapse>
    </div>
    )
}
export default SearchBar;
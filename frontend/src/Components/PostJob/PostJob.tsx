
import { Button, NumberInput, TagsInput, Textarea } from "@mantine/core";
import { content, fields } from "../../Data/PostJob";
import SelectInput from "./SelectInput";
import TextEditor from "./TextEditor";
import { isNotEmpty, useForm } from "@mantine/form";
import { getJob, postJob } from "../../Services/JobService";
import { errorNotification, successNotification } from "../../Services/NotificationService";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { hideOverlay, showOverlay } from "../../Slices/OverlaySlice";
import BasicAIHelper, { BasicAIHelperRef } from "../AI/BasicAIHelper";

const PostJob = () => {
    const {id}=useParams();
    const user = useSelector((state: any) => state.user);
    const dispatch=useDispatch();
    const navigate = useNavigate();
    const select = fields;
    const [editorData,setEditorData]=useState(content);
    const aiHelperRef = useRef<BasicAIHelperRef>(null);
    // const matches = useMediaQuery('(min-width: 350px)');
    useEffect(()=>{
        window.scrollTo(0,0);
        if(Number(id)!=0){
            dispatch(showOverlay());
            getJob(id).then((res)=>{
                form.setValues(res);
                setEditorData(res.description);
            }).catch((err)=>console.log(err))
            .finally(()=>dispatch(hideOverlay()));
        }
        else{
            form.reset();
        }
    }, [id])
    const form = useForm({
        mode: 'controlled',
        validateInputOnChange: true,
        initialValues: {
            jobTitle: '',
            company: '',
            experience: '',
            jobType: '',
            location: '',
            packageOffered: '',
            skillsRequired: [],
            about: '',
            description: content,

        },
        validate: {
            jobTitle: isNotEmpty('Title cannot be empty'),
            company: isNotEmpty('Company cannot be empty'),
            location: isNotEmpty('Location cannot be empty'),
            about: isNotEmpty('About cannot be empty'),
            description: isNotEmpty('Description cannot be empty'),
            experience: isNotEmpty('Experience cannot be empty'),
            jobType: isNotEmpty('Job Type cannot be empty'),
            packageOffered: isNotEmpty('Salary cannot be empty'),
            skillsRequired: isNotEmpty('Skills cannot be empty')

        }
    });
    const handlePost = () => {
        form.validate();
        if (!form.isValid()) {
            window.scrollTo({ top: 0, behavior: 'smooth' })
            return;
        }
        dispatch(showOverlay())
        postJob({ ...form.getValues(),id, postedBy: user.id, jobStatus: "ACTIVE" }).then((res) => {
            successNotification("Success", "Job Posted Successfully");
            navigate(`/posted-jobs/${res.id}`);
        }).catch((err) => {
            console.log(err);
            errorNotification("Error", err.response.data.errorMessage);
        }).finally(()=>dispatch(hideOverlay()));
    }
    const handleDraft = () => {
        dispatch(showOverlay());
        postJob({ ...form.getValues(),id, postedBy: user.id, jobStatus: "DRAFT" }).then((res) => {
            successNotification("Success", "Job Saved as Draft");
            navigate(`/posted-jobs/${res.id}`);
        }).catch((err) => {
            console.log(err);
            errorNotification("Error", err.response.data.errorMessage);
        }).finally(()=>dispatch(hideOverlay()));
    }

    const handleGenerateDescription = () => {
        if (!form.values.jobTitle.trim()) {
            errorNotification("Error", "Please enter a job title first");
            return;
        }

        const formData = {
            jobTitle: form.values.jobTitle,
            skillsRequired: form.values.skillsRequired,
            experience: form.values.experience,
            company: form.values.company,
            location: form.values.location,
            jobType: form.values.jobType,
            packageOffered: form.values.packageOffered ? Number(form.values.packageOffered) : 0
        };

        aiHelperRef.current?.generateDescription(formData);
    }
    return <div data-aos="zoom-out" className="px-16 bs-mx:px-10 md-mx:px-5 py-5 ">
        <div className="text-2xl font-semibold mb-5">Post a Job</div>
        <div className="flex flex-col gap-5">
            <div className="flex gap-10 md-mx:gap-5 [&>*]:w-1/2 sm-mx:[&>*]:!w-full sm-mx:flex-wrap">
                <SelectInput  form={form} name="jobTitle" {...select[0]} />
                <SelectInput   form={form} name="company" {...select[1]} />
            </div>
            <div className="flex gap-10 md-mx:gap-5 [&>*]:w-1/2 sm-mx:[&>*]:!w-full sm-mx:flex-wrap">
                <SelectInput   form={form} name="experience" {...select[2]} />
                <SelectInput   form={form} name="jobType" {...select[3]} />
            </div>
            <div className="flex gap-10 md-mx:gap-5 [&>*]:w-1/2 sm-mx:[&>*]:!w-full sm-mx:flex-wrap">
                <SelectInput    form={form} name="location" {...select[4]} />
                <NumberInput data-aos="zoom-out"  {...form.getInputProps("packageOffered")} withAsterisk label="Salary (in thousands)" placeholder="Enter Salary (e.g., 50 for $50K)" hideControls min={1} max={300} clampBehavior="strict" />
            </div>
            <TagsInput data-aos="zoom-out"  {...form.getInputProps("skillsRequired")} withAsterisk label="Skills" placeholder="Enter skill" splitChars={[',', ' ', '|']} clearable />
            <Textarea data-aos="zoom-out"  {...form.getInputProps("about")} withAsterisk className="my-3" label="About Job" autosize minRows={2} placeholder="Enter about job.." />
            
            {/* Hidden AI Helper Component */}
            <BasicAIHelper
                ref={aiHelperRef}
                onDescriptionGenerated={(description) => {
                    form.setFieldValue('description', description);
                    setEditorData(description);
                }}
                onAboutGenerated={(about) => {
                    form.setFieldValue('about', about);
                }}
            />
            
            <div className="[&_button[data-active='true']]:!text-ocean-blue-400 [&_button[data-active='true']]:!bg-ocean-blue-400/20">
                <div className="text-sm font-medium ">Job Description<span className="text-red-600 "> *</span></div>
                <TextEditor data-aos="zoom-out"  form={form} data={editorData}/>
            </div>
            <div className="flex gap-4 justify-between">
                <div className="flex gap-4">
                    <Button data-aos="zoom-out" color="brightSun.4" onClick={handlePost} variant="light">Publish Job</Button>
                    <Button data-aos="zoom-out" color="brightSun.4" onClick={handleDraft} variant="outline">Save as Draft</Button>
                </div>
                <button
                    onClick={handleGenerateDescription}
                    style={{
                        backgroundColor: '#6366f1',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 2px 4px rgba(99, 102, 241, 0.2)',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                        const target = e.target as HTMLButtonElement;
                        target.style.backgroundColor = '#4f46e5';
                        target.style.transform = 'translateY(-1px)';
                        target.style.boxShadow = '0 4px 8px rgba(99, 102, 241, 0.3)';
                    }}
                    onMouseOut={(e) => {
                        const target = e.target as HTMLButtonElement;
                        target.style.backgroundColor = '#6366f1';
                        target.style.transform = 'translateY(0)';
                        target.style.boxShadow = '0 2px 4px rgba(99, 102, 241, 0.2)';
                    }}
                >
                    <span>🧙‍♂️</span>
                    Generate Description
                </button>
            </div>
        </div>
    </div>
}
export default PostJob;
import axiosInstance from "../Interceptor/AxiosInterceptor";


const postJob=async (job:any)=>{
    return axiosInstance.post(`/jobs/post`, job)
    .then((result: { data: any }) => result.data)
    .catch((error: unknown) =>{throw error;});
}
const getAllJobs=async ()=>{
    return axiosInstance.get(`/jobs/getAll`)
    .then((result: { data: any }) => result.data)
    .catch((error: unknown) =>{throw error;});
}
const getJob=async (id:any)=>{
    return axiosInstance.get(`/jobs/get/${id}`)
    .then((result: { data: any }) => result.data)
    .catch((error: unknown) =>{throw error;});
}

const applyJob=async (job:any, id:any)=>{
    return axiosInstance.post(`/jobs/apply/${id}`, job)
    .then((result: { data: any }) => result.data)
    .catch((error: unknown) =>{throw error;});
}
const getHistory=async (id:any, status:any)=>{
    return axiosInstance.get(`/jobs/history/${id}/${status}`)
    .then((result: { data: any }) => result.data)
    .catch((error: unknown) =>{throw error;});
}
const getJobsPostedBy=async(id:any)=>{
    return axiosInstance.get(`/jobs/postedBy/${id}`).then((result: { data: any })=>result.data).catch((error: unknown)=>{throw error;});
}
const changeAppStatus=async (interview:any)=>{
    return axiosInstance.post(`/jobs/changeAppStatus`, interview)
    .then((result: { data: any }) => result.data)
    .catch((error: unknown) =>{throw error;});
}
const deleteApplicantFromJob = async (jobId: any, applicantId: any) => {
    return axiosInstance.delete(`/jobs/${jobId}/applicant/${applicantId}`)
        .then((result: { data: any }) => result.data)
        .catch((error: unknown) => { throw error; });
}

const respondToOffer = async (application: any) => {
    return axiosInstance.post(`/jobs/respondToOffer`, application)
        .then((result: { data: any }) => result.data)
        .catch((error: unknown) => { throw error; });
}

const deleteJob = async (jobId: any) => {
    return axiosInstance.delete(`/jobs/${jobId}`)
        .then((result: { data: any }) => result.data)
        .catch((error: unknown) => { throw error; });
}

export {postJob, getAllJobs, getJob, applyJob, getHistory, getJobsPostedBy, changeAppStatus, deleteApplicantFromJob, respondToOffer, deleteJob};
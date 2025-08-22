import React from 'react';
import { Button } from '@mantine/core';
import { IconVideo, IconMicrophone, IconMicrophoneOff, IconVideoOff, IconPhone, IconPhoneOff, IconUser, IconUsers } from '@tabler/icons-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const EmployerInterviewPage = () => {
    const navigate = useNavigate();
    const { id: jobId } = useParams();
    const location = useLocation();
    const user = useSelector((state: any) => state.user);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isAudioOn, setIsAudioOn] = useState(true);
    const [isInCall, setIsInCall] = useState(false);
    
    // Получаем данные кандидата из состояния навигации или из URL параметров
    const [candidateData, setCandidateData] = useState<any>(null);
    const [jobData, setJobData] = useState<any>(null);

    // Загружаем данные кандидата и вакансии
    useEffect(() => {
        // Если данные переданы через состояние навигации
        if (location.state?.candidateData) {
            setCandidateData(location.state.candidateData);
        }
        if (location.state?.jobData) {
            setJobData(location.state.jobData);
        }
        
        // Если данные не переданы, можно загрузить их по jobId и applicantId из URL
        // Это можно реализовать позже, когда будет необходимость
    }, [location.state]);

    // Дефолтные данные на случай, если данные не загружены
    const defaultCandidate = {
        name: "Кандидат",
        jobTitle: "Позиция",
        company: "Компания"
    };

    const defaultJob = {
        jobTitle: "Вакансия",
        company: "Компания"
    };

    const candidate = candidateData || defaultCandidate;
    const job = jobData || defaultJob;

    const toggleVideo = () => {
        setIsVideoOn(!isVideoOn);
    };

    const toggleAudio = () => {
        setIsAudioOn(!isAudioOn);
    };

    const toggleCall = () => {
        setIsInCall(!isInCall);
    };

    return (
        <div className="min-h-screen bg-mine-shaft-950 flex flex-col">
            {/* Header */}
            <div className="bg-mine-shaft-900 p-4 flex justify-between items-center border-b border-mine-shaft-800">
                <div className="flex items-center gap-3">
                    <IconUsers className="text-brightSun-400" size={24} />
                    <h1 className="text-xl font-semibold text-white">Employer Interview Room</h1>
                </div>
                <Button 
                    color="red" 
                    variant="light" 
                    onClick={() => navigate('/posted-jobs')}
                    leftSection={<IconPhoneOff size={16} />}
                >
                    Exit Interview
                </Button>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
                <div className="max-w-6xl mx-auto">
                    {/* Interview Info */}
                    <div className="bg-mine-shaft-900 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-white mb-2">Interview with {candidate.name}</h2>
                                <p className="text-mine-shaft-300">{job.jobTitle} Position • {job.company}</p>
                                <p className="text-mine-shaft-400 text-sm">Scheduled for: Sun, 25 August • 10 AM - 11 AM</p>
                            </div>
                            <div className="text-right">
                                <div className="text-brightSun-400 font-semibold">Employer View</div>
                                <div className="text-mine-shaft-400 text-sm">You are the interviewer</div>
                            </div>
                        </div>
                    </div>

                    {/* Video Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                        {/* Main Interviewer Screen */}
                        <div className="lg:col-span-2">
                            <div className="bg-mine-shaft-900 rounded-lg p-4 h-96 flex flex-col">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <IconUser className="text-brightSun-400" size={20} />
                                        <span className="text-white font-medium">You (Interviewer)</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant={isVideoOn ? "filled" : "light"}
                                            color={isVideoOn ? "brightSun" : "gray"}
                                            onClick={toggleVideo}
                                        >
                                            {isVideoOn ? <IconVideo size={16} /> : <IconVideoOff size={16} />}
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={isAudioOn ? "filled" : "light"}
                                            color={isAudioOn ? "brightSun" : "gray"}
                                            onClick={toggleAudio}
                                        >
                                            {isAudioOn ? <IconMicrophone size={16} /> : <IconMicrophoneOff size={16} />}
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex-1 bg-mine-shaft-800 rounded-lg flex items-center justify-center">
                                    {isVideoOn ? (
                                        <div className="text-center">
                                            <div className="w-32 h-32 bg-brightSun-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <IconUser size={48} className="text-mine-shaft-900" />
                                            </div>
                                            <p className="text-mine-shaft-300">Your camera is active</p>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <IconVideoOff size={48} className="text-mine-shaft-400 mx-auto mb-4" />
                                            <p className="text-mine-shaft-400">Camera is off</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Candidate Screen */}
                        <div className="lg:col-span-1">
                            <div className="bg-mine-shaft-900 rounded-lg p-4 h-96 flex flex-col">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <IconUser className="text-ocean-blue-400" size={20} />
                                        <span className="text-white font-medium">{candidate.name} (Candidate)</span>
                                    </div>
                                </div>
                                <div className="flex-1 bg-mine-shaft-800 rounded-lg flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-24 h-24 bg-ocean-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <IconUser size={32} className="text-white" />
                                        </div>
                                        <p className="text-mine-shaft-300">Waiting for candidate...</p>
                                        <p className="text-mine-shaft-400 text-sm">{candidate.jobTitle} • {candidate.company}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Interview Controls */}
                    <div className="bg-mine-shaft-900 rounded-lg p-6">
                        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                            <div className="flex gap-3">
                                <Button
                                    size="lg"
                                    variant={isVideoOn ? "filled" : "light"}
                                    color={isVideoOn ? "brightSun" : "gray"}
                                    onClick={toggleVideo}
                                    leftSection={isVideoOn ? <IconVideo size={20} /> : <IconVideoOff size={20} />}
                                >
                                    {isVideoOn ? "Camera On" : "Camera Off"}
                                </Button>
                                <Button
                                    size="lg"
                                    variant={isAudioOn ? "filled" : "light"}
                                    color={isAudioOn ? "brightSun" : "gray"}
                                    onClick={toggleAudio}
                                    leftSection={isAudioOn ? <IconMicrophone size={20} /> : <IconMicrophoneOff size={20} />}
                                >
                                    {isAudioOn ? "Mic On" : "Mic Off"}
                                </Button>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    size="lg"
                                    variant={isInCall ? "light" : "filled"}
                                    color={isInCall ? "red" : "green"}
                                    onClick={toggleCall}
                                    leftSection={isInCall ? <IconPhoneOff size={20} /> : <IconPhone size={20} />}
                                >
                                    {isInCall ? "End Call" : "Start Interview"}
                                </Button>
                            </div>
                        </div>

                        {/* Interview Notes Section */}
                        <div className="mt-6 pt-6 border-t border-mine-shaft-800">
                            <h3 className="text-lg font-semibold text-white mb-4">Interview Notes</h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-mine-shaft-300 mb-2">Technical Skills</label>
                                    <textarea 
                                        className="w-full bg-mine-shaft-800 border border-mine-shaft-700 rounded-lg p-3 text-white placeholder-mine-shaft-400"
                                        rows={3}
                                        placeholder="Rate technical skills (1-10) and add notes..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-mine-shaft-300 mb-2">Communication</label>
                                    <textarea 
                                        className="w-full bg-mine-shaft-800 border border-mine-shaft-700 rounded-lg p-3 text-white placeholder-mine-shaft-400"
                                        rows={3}
                                        placeholder="Rate communication skills (1-10) and add notes..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-mine-shaft-300 mb-2">Cultural Fit</label>
                                    <textarea 
                                        className="w-full bg-mine-shaft-800 border border-mine-shaft-700 rounded-lg p-3 text-white placeholder-mine-shaft-400"
                                        rows={3}
                                        placeholder="Rate cultural fit (1-10) and add notes..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-mine-shaft-300 mb-2">Overall Assessment</label>
                                    <textarea 
                                        className="w-full bg-mine-shaft-800 border border-mine-shaft-700 rounded-lg p-3 text-white placeholder-mine-shaft-400"
                                        rows={3}
                                        placeholder="Overall assessment and next steps..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="mt-6 pt-6 border-t border-mine-shaft-800">
                            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                            <div className="flex flex-wrap gap-3">
                                <Button color="green" variant="light" size="md">
                                    Move to Next Round
                                </Button>
                                <Button color="brightSun" variant="light" size="md">
                                    Schedule Follow-up
                                </Button>
                                <Button color="red" variant="light" size="md">
                                    Reject Candidate
                                </Button>
                                <Button color="ocean-blue" variant="light" size="md">
                                    Send Offer
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployerInterviewPage;

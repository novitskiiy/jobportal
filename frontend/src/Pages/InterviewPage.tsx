import React from 'react';
import { Button } from '@mantine/core';
import { IconVideo, IconMicrophone, IconMicrophoneOff, IconVideoOff, IconPhone, IconPhoneOff } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const InterviewPage = () => {
    const navigate = useNavigate();
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isAudioOn, setIsAudioOn] = useState(true);
    const [isInCall, setIsInCall] = useState(false);

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
            <div className="bg-mine-shaft-900 p-4 border-b border-mine-shaft-800">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white">Interview</h1>
                    <Button 
                        color="red.6" 
                        variant="light" 
                        onClick={() => navigate('/job-history')}
                    >
                        Exit Interview
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-8">
                {/* Video Area */}
                <div className="w-full max-w-4xl mb-8">
                    <div className="bg-mine-shaft-900 rounded-xl p-8 border border-mine-shaft-800">
                        <div className="aspect-video bg-mine-shaft-800 rounded-lg flex items-center justify-center mb-4">
                            {isVideoOn ? (
                                <div className="text-center">
                                    <div className="w-32 h-32 bg-ocean-blue-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                                        <span className="text-4xl font-bold text-white">HR</span>
                                    </div>
                                    <p className="text-mine-shaft-300">Interviewer Camera</p>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <IconVideoOff className="w-16 h-16 text-mine-shaft-600 mx-auto mb-4" />
                                    <p className="text-mine-shaft-400">Camera Off</p>
                                </div>
                            )}
                        </div>
                        
                        {/* Your Video */}
                        <div className="absolute bottom-24 right-8 w-48 h-32 bg-mine-shaft-800 rounded-lg border-2 border-mine-shaft-700">
                            {isVideoOn ? (
                                <div className="w-full h-full bg-ocean-blue-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-semibold">You</span>
                                </div>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <IconVideoOff className="w-8 h-8 text-mine-shaft-600" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4">
                    <Button
                        size="lg"
                        variant={isAudioOn ? "filled" : "outline"}
                        color={isAudioOn ? "green" : "red"}
                        onClick={toggleAudio}
                        className="rounded-full w-16 h-16"
                    >
                        {isAudioOn ? <IconMicrophone className="w-6 h-6" /> : <IconMicrophoneOff className="w-6 h-6" />}
                    </Button>

                    <Button
                        size="lg"
                        variant={isInCall ? "filled" : "outline"}
                        color={isInCall ? "red" : "green"}
                        onClick={toggleCall}
                        className="rounded-full w-16 h-16"
                    >
                        {isInCall ? <IconPhoneOff className="w-6 h-6" /> : <IconPhone className="w-6 h-6" />}
                    </Button>

                    <Button
                        size="lg"
                        variant={isVideoOn ? "filled" : "outline"}
                        color={isVideoOn ? "green" : "red"}
                        onClick={toggleVideo}
                        className="rounded-full w-16 h-16"
                    >
                        {isVideoOn ? <IconVideo className="w-6 h-6" /> : <IconVideoOff className="w-6 h-6" />}
                    </Button>
                </div>

                {/* Status */}
                <div className="mt-6 text-center">
                    <p className="text-mine-shaft-300">
                        {isInCall ? "Connected to interview" : "Click the phone button to join"}
                    </p>
                    <p className="text-sm text-mine-shaft-400 mt-2">
                        This is a simulation - no actual video call is being made
                    </p>
                </div>
            </div>
        </div>
    );
};

export default InterviewPage;

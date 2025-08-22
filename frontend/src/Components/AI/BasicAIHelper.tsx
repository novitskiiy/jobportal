import React, { forwardRef, useImperativeHandle } from 'react';

interface BasicAIHelperProps {
    onDescriptionGenerated?: (description: string) => void;
    onAboutGenerated?: (about: string) => void;
}

export interface BasicAIHelperRef {
    generateDescription: (formData: {
        jobTitle: string;
        skillsRequired: string[];
        experience: string;
        company: string;
        location: string;
        jobType: string;
        packageOffered: number;
    }) => void;
}

const BasicAIHelper = forwardRef<BasicAIHelperRef, BasicAIHelperProps>(
    ({ onDescriptionGenerated, onAboutGenerated }, ref) => {
        
        const createSeparateParts = (jobTitle: string) => {
            // Create About section (only the introduction)
            let about = `We are looking for a talented professional for the position of ${jobTitle}.`;
            
            // Create Description section (only Responsibilities, We Offer, and call to action)
            let description = `Responsibilities<br><br>`;
            description += `• Develop and maintain software applications<br>`;
            description += `• Participate in project planning and implementation<br>`;
            description += `• Collaborate with development teams<br>`;
            description += `• Ensure code quality and documentation<br><br>`;
            
            description += `We Offer<br><br>`;
            description += `• Competitive salary<br>`;
            description += `• Professional growth opportunities<br>`;
            description += `• Modern technologies and tools<br>`;
            description += `• Friendly team and comfortable working conditions<br>`;
            description += `• Flexible work schedule<br><br>`;
            
            description += `Send your resume and join our team!`;
            
            return { about, description };
        };

        const generateDescription = (formData: {
            jobTitle: string;
            skillsRequired: string[];
            experience: string;
            company: string;
            location: string;
            jobType: string;
            packageOffered: number;
        }) => {
            if (!formData.jobTitle.trim()) {
                console.error('Job title is required');
                return;
            }

            try {
                // Create separate parts for About and Description
                const { about, description } = createSeparateParts(formData.jobTitle);
                
                if (onAboutGenerated) {
                    onAboutGenerated(about);
                }
                
                if (onDescriptionGenerated) {
                    onDescriptionGenerated(description);
                }
            } catch (err) {
                console.error('Error generating job description:', err);
            }
        };

        useImperativeHandle(ref, () => ({
            generateDescription
        }));

        // This component doesn't render anything
        return null;
    }
);

BasicAIHelper.displayName = 'BasicAIHelper';

export default BasicAIHelper;

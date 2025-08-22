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
        
        const createSeparateParts = (jobTitle: string, skillsRequired: string[], experience: string, company: string, location: string, jobType: string, packageOffered: number) => {
            // Create About section with more detailed description based on skills and experience
            let about = `We are looking for a talented `;
            
            // Determine experience level
            let experienceLevel = '';
            if (experience.toLowerCase().includes('entry') || experience.toLowerCase().includes('junior') || experience.toLowerCase().includes('0-1')) {
                experienceLevel = 'Junior ';
            } else if (experience.toLowerCase().includes('intermediate') || experience.toLowerCase().includes('middle') || experience.toLowerCase().includes('1-3')) {
                experienceLevel = 'Middle ';
            } else if (experience.toLowerCase().includes('senior') || experience.toLowerCase().includes('3-5')) {
                experienceLevel = 'Senior ';
            } else if (experience.toLowerCase().includes('lead') || experience.toLowerCase().includes('architect') || experience.toLowerCase().includes('5+')) {
                experienceLevel = 'Lead ';
            }
            
            // Determine primary technology from skills
            let primaryTech = '';
            if (skillsRequired && skillsRequired.length > 0) {
                const skills = skillsRequired.map(s => s.toLowerCase());
                
                if (skills.some(s => s.includes('java'))) {
                    primaryTech = 'Java ';
                } else if (skills.some(s => s.includes('python'))) {
                    primaryTech = 'Python ';
                } else if (skills.some(s => s.includes('javascript') || s.includes('js'))) {
                    primaryTech = 'JavaScript ';
                } else if (skills.some(s => s.includes('react'))) {
                    primaryTech = 'React ';
                } else if (skills.some(s => s.includes('angular'))) {
                    primaryTech = 'Angular ';
                } else if (skills.some(s => s.includes('vue'))) {
                    primaryTech = 'Vue.js ';
                } else if (skills.some(s => s.includes('node'))) {
                    primaryTech = 'Node.js ';
                } else if (skills.some(s => s.includes('spring'))) {
                    primaryTech = 'Spring ';
                } else if (skills.some(s => s.includes('c#'))) {
                    primaryTech = 'C# ';
                } else if (skills.some(s => s.includes('php'))) {
                    primaryTech = 'PHP ';
                } else if (skills.some(s => s.includes('ruby'))) {
                    primaryTech = 'Ruby ';
                } else if (skills.some(s => s.includes('go'))) {
                    primaryTech = 'Go ';
                } else if (skills.some(s => s.includes('rust'))) {
                    primaryTech = 'Rust ';
                } else if (skills.some(s => s.includes('swift'))) {
                    primaryTech = 'Swift ';
                } else if (skills.some(s => s.includes('kotlin'))) {
                    primaryTech = 'Kotlin ';
                } else if (skills.some(s => s.includes('scala'))) {
                    primaryTech = 'Scala ';
                } else if (skills.some(s => s.includes('dart'))) {
                    primaryTech = 'Dart ';
                } else if (skills.some(s => s.includes('flutter'))) {
                    primaryTech = 'Flutter ';
                } else if (skills.some(s => s.includes('react native'))) {
                    primaryTech = 'React Native ';
                } else if (skills.some(s => s.includes('android'))) {
                    primaryTech = 'Android ';
                } else if (skills.some(s => s.includes('ios'))) {
                    primaryTech = 'iOS ';
                } else if (skills.some(s => s.includes('devops'))) {
                    primaryTech = 'DevOps ';
                } else if (skills.some(s => s.includes('aws') || s.includes('azure') || s.includes('gcp'))) {
                    primaryTech = 'Cloud ';
                } else if (skills.some(s => s.includes('data') || s.includes('analytics'))) {
                    primaryTech = 'Data ';
                } else if (skills.some(s => s.includes('ui') || s.includes('ux') || s.includes('design'))) {
                    primaryTech = 'UI/UX ';
                } else if (skills.some(s => s.includes('qa') || s.includes('test'))) {
                    primaryTech = 'QA ';
                } else if (skills.some(s => s.includes('security'))) {
                    primaryTech = 'Security ';
                } else if (skills.some(s => s.includes('machine learning') || s.includes('ai') || s.includes('ml'))) {
                    primaryTech = 'Machine Learning ';
                } else if (skills.some(s => s.includes('blockchain'))) {
                    primaryTech = 'Blockchain ';
                } else if (skills.some(s => s.includes('game'))) {
                    primaryTech = 'Game ';
                } else if (skills.some(s => s.includes('mobile'))) {
                    primaryTech = 'Mobile ';
                } else if (skills.some(s => s.includes('web'))) {
                    primaryTech = 'Web ';
                } else if (skills.some(s => s.includes('full stack') || s.includes('fullstack'))) {
                    primaryTech = 'Full Stack ';
                } else if (skills.some(s => s.includes('frontend') || s.includes('front-end'))) {
                    primaryTech = 'Frontend ';
                } else if (skills.some(s => s.includes('backend') || s.includes('back-end'))) {
                    primaryTech = 'Backend ';
                }
            }
            
            // Determine role type from job title
            let roleType = 'Developer';
            const titleLower = jobTitle.toLowerCase();
            if (titleLower.includes('engineer')) {
                roleType = 'Engineer';
            } else if (titleLower.includes('architect')) {
                roleType = 'Architect';
            } else if (titleLower.includes('lead')) {
                roleType = 'Lead';
            } else if (titleLower.includes('manager')) {
                roleType = 'Manager';
            } else if (titleLower.includes('analyst')) {
                roleType = 'Analyst';
            } else if (titleLower.includes('consultant')) {
                roleType = 'Consultant';
            } else if (titleLower.includes('specialist')) {
                roleType = 'Specialist';
            } else if (titleLower.includes('designer')) {
                roleType = 'Designer';
            } else if (titleLower.includes('tester') || titleLower.includes('qa')) {
                roleType = 'Tester';
            } else if (titleLower.includes('devops')) {
                roleType = 'Engineer';
            } else if (titleLower.includes('data')) {
                roleType = 'Analyst';
            } else if (titleLower.includes('security')) {
                roleType = 'Specialist';
            }
            
            // Build the about text
            about += experienceLevel + primaryTech + roleType + '.';
            
            // Generate dynamic Responsibilities based on skills and role
            let description = `Responsibilities<br><br>`;
            
            // Base responsibilities based on experience level
            const baseResponsibilities = [];
            if (experienceLevel.includes('Junior')) {
                baseResponsibilities.push(
                    '• Learn and understand the existing codebase and development processes',
                    '• Write clean, maintainable code following best practices',
                    '• Participate in code reviews and team meetings',
                    '• Collaborate with senior developers on feature implementation'
                );
            } else if (experienceLevel.includes('Middle')) {
                baseResponsibilities.push(
                    '• Design and implement new features and improvements',
                    '• Write clean, scalable, and maintainable code',
                    '• Participate in architectural decisions and technical discussions',
                    '• Mentor junior developers and conduct code reviews'
                );
            } else if (experienceLevel.includes('Senior')) {
                baseResponsibilities.push(
                    '• Lead technical design and architecture decisions',
                    '• Mentor and guide junior and middle developers',
                    '• Drive best practices and coding standards across the team',
                    '• Collaborate with product managers on feature planning'
                );
            } else if (experienceLevel.includes('Lead')) {
                baseResponsibilities.push(
                    '• Lead the development team and technical strategy',
                    '• Make high-level architectural decisions',
                    '• Mentor and grow the development team',
                    '• Collaborate with stakeholders on product roadmap'
                );
            }
            
            // Add technology-specific responsibilities
            const techResponsibilities = [];
            if (skillsRequired && skillsRequired.length > 0) {
                const skills = skillsRequired.map(s => s.toLowerCase());
                
                if (skills.some(s => s.includes('java') || s.includes('spring'))) {
                    techResponsibilities.push('• Develop and maintain Java applications using Spring framework');
                }
                if (skills.some(s => s.includes('react'))) {
                    techResponsibilities.push('• Build responsive user interfaces using React.js');
                }
                if (skills.some(s => s.includes('python'))) {
                    techResponsibilities.push('• Develop Python applications and scripts');
                }
                if (skills.some(s => s.includes('javascript') || s.includes('js'))) {
                    techResponsibilities.push('• Write efficient JavaScript code for web applications');
                }
                if (skills.some(s => s.includes('node'))) {
                    techResponsibilities.push('• Develop server-side applications using Node.js');
                }
                if (skills.some(s => s.includes('docker'))) {
                    techResponsibilities.push('• Containerize applications using Docker');
                }
                if (skills.some(s => s.includes('aws') || s.includes('azure') || s.includes('gcp'))) {
                    techResponsibilities.push('• Deploy and manage applications on cloud platforms');
                }
                if (skills.some(s => s.includes('database') || s.includes('sql') || s.includes('mongodb'))) {
                    techResponsibilities.push('• Design and optimize database schemas and queries');
                }
                if (skills.some(s => s.includes('devops'))) {
                    techResponsibilities.push('• Implement CI/CD pipelines and automation');
                }
                if (skills.some(s => s.includes('agile') || s.includes('scrum'))) {
                    techResponsibilities.push('• Participate in Agile development processes and sprint planning');
                }
                if (skills.some(s => s.includes('git') || s.includes('github'))) {
                    techResponsibilities.push('• Use Git for version control and collaborative development');
                }
                if (skills.some(s => s.includes('ui') || s.includes('ux') || s.includes('design'))) {
                    techResponsibilities.push('• Create user-friendly interfaces and improve user experience');
                }
                if (skills.some(s => s.includes('qa') || s.includes('test'))) {
                    techResponsibilities.push('• Write and maintain automated tests');
                }
            }
            
            // Combine and limit responsibilities
            const allResponsibilities = [...baseResponsibilities, ...techResponsibilities];
            const selectedResponsibilities = allResponsibilities.slice(0, 4); // Take first 4
            description += selectedResponsibilities.join('<br>') + '<br><br>';
            
            // Generate dynamic We Offer section
            description += `We Offer<br><br>`;
            
            const benefits = [
                '• Competitive salary package',
                '• Professional development and training opportunities',
                '• Modern technology stack and tools',
                '• Collaborative and innovative work environment',
                '• Flexible work schedule and remote work options',
                '• Health insurance and wellness programs',
                '• Performance bonuses and incentives',
                '• Career growth and advancement opportunities',
                '• Team building activities and events',
                '• Latest hardware and software tools'
            ];
            
            // Select benefits based on company and package
            let selectedBenefits: string[] = [];
            if (packageOffered > 100) {
                selectedBenefits.push('• Competitive salary package', '• Performance bonuses and incentives');
            } else {
                selectedBenefits.push('• Competitive salary package');
            }
            
            if (company.toLowerCase().includes('tech') || company.toLowerCase().includes('software')) {
                selectedBenefits.push('• Modern technology stack and tools', '• Latest hardware and software tools');
            } else {
                selectedBenefits.push('• Modern technology stack and tools');
            }
            
            if (jobType.toLowerCase().includes('remote')) {
                selectedBenefits.push('• Flexible work schedule and remote work options');
            } else {
                selectedBenefits.push('• Flexible work schedule');
            }
            
            selectedBenefits.push('• Professional development and training opportunities');
            selectedBenefits.push('• Collaborative and innovative work environment');
            
            // Add 1-2 more random benefits
            const remainingBenefits = benefits.filter(b => !selectedBenefits.includes(b));
            const randomBenefits = remainingBenefits.sort(() => 0.5 - Math.random()).slice(0, 2);
            selectedBenefits = [...selectedBenefits, ...randomBenefits];
            
            description += selectedBenefits.join('<br>') + '<br><br>';
            
            // Generate dynamic call to action
            const callToActions = [
                'Send your resume and join our team!',
                'Apply now and become part of our success story!',
                'Join us and help shape the future of technology!',
                'We look forward to welcoming you to our team!',
                'Take the next step in your career with us!',
                'Apply today and grow with our company!'
            ];
            
            const randomCallToAction = callToActions[Math.floor(Math.random() * callToActions.length)];
            description += randomCallToAction;
            
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
                const { about, description } = createSeparateParts(
                    formData.jobTitle, 
                    formData.skillsRequired, 
                    formData.experience, 
                    formData.company, 
                    formData.location, 
                    formData.jobType, 
                    formData.packageOffered
                );
                
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

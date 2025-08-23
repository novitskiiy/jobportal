import React, { forwardRef, useImperativeHandle } from 'react';

interface BasicAIHelperProps {
    onDescriptionGenerated?: (description: string, aboutJob?: string) => void;
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
            
            // Generate dynamic Responsibilities based on skills, role, and company context
            let description = `Responsibilities<br><br>`;
            
            // Enhanced base responsibilities based on experience level and role type
            const baseResponsibilities = [];
            
            // Junior level responsibilities
            if (experienceLevel.includes('Junior')) {
                const juniorResponsibilities = [
                    '• Learn and understand the existing codebase and development processes',
                    '• Write clean, maintainable code following best practices and coding standards',
                    '• Participate in code reviews and team meetings to improve code quality',
                    '• Collaborate with senior developers on feature implementation and bug fixes',
                    '• Assist in testing and debugging applications',
                    '• Contribute to documentation and technical specifications',
                    '• Learn new technologies and frameworks as required',
                    '• Follow agile development methodologies and participate in sprint planning',
                    '• Work on assigned tasks and report progress to team leads',
                    '• Participate in knowledge sharing sessions and team training'
                ];
                baseResponsibilities.push(...juniorResponsibilities);
            } 
            // Middle level responsibilities
            else if (experienceLevel.includes('Middle')) {
                const middleResponsibilities = [
                    '• Design and implement new features and improvements to existing systems',
                    '• Write clean, scalable, and maintainable code following industry best practices',
                    '• Participate in architectural decisions and technical discussions with the team',
                    '• Mentor junior developers and conduct thorough code reviews',
                    '• Collaborate with cross-functional teams including product managers and designers',
                    '• Debug and resolve complex technical issues and performance bottlenecks',
                    '• Contribute to the development of technical specifications and documentation',
                    '• Implement automated testing strategies and ensure code coverage',
                    '• Optimize application performance and user experience',
                    '• Stay updated with emerging technologies and industry trends'
                ];
                baseResponsibilities.push(...middleResponsibilities);
            } 
            // Senior level responsibilities
            else if (experienceLevel.includes('Senior')) {
                const seniorResponsibilities = [
                    '• Lead technical design and architecture decisions for complex systems',
                    '• Mentor and guide junior and middle developers in their professional growth',
                    '• Drive best practices and coding standards across the development team',
                    '• Collaborate with product managers on feature planning and technical feasibility',
                    '• Design and implement scalable solutions that meet business requirements',
                    '• Conduct technical interviews and contribute to hiring decisions',
                    '• Lead code reviews and ensure high code quality standards',
                    '• Troubleshoot and resolve critical production issues',
                    '• Contribute to technical strategy and technology roadmap planning',
                    '• Represent the technical team in cross-departmental meetings'
                ];
                baseResponsibilities.push(...seniorResponsibilities);
            } 
            // Lead level responsibilities
            else if (experienceLevel.includes('Lead')) {
                const leadResponsibilities = [
                    '• Lead the development team and define technical strategy for projects',
                    '• Make high-level architectural decisions and technology stack choices',
                    '• Mentor and grow the development team through coaching and training',
                    '• Collaborate with stakeholders on product roadmap and technical vision',
                    '• Manage technical debt and ensure long-term code maintainability',
                    '• Lead technical discussions with clients and external partners',
                    '• Define and implement development processes and best practices',
                    '• Oversee code quality, security, and performance standards',
                    '• Coordinate with other teams and departments on technical initiatives',
                    '• Contribute to business strategy from a technical perspective'
                ];
                baseResponsibilities.push(...leadResponsibilities);
            }
            
            // Enhanced technology-specific responsibilities
            const techResponsibilities = [];
            if (skillsRequired && skillsRequired.length > 0) {
                const skills = skillsRequired.map(s => s.toLowerCase());
                
                // Programming Languages
                if (skills.some(s => s.includes('java') || s.includes('spring'))) {
                    techResponsibilities.push(
                        '• Develop and maintain Java applications using Spring Boot framework',
                        '• Implement RESTful APIs and microservices architecture',
                        '• Work with Spring Security for authentication and authorization',
                        '• Optimize JVM performance and memory management'
                    );
                }
                if (skills.some(s => s.includes('python'))) {
                    techResponsibilities.push(
                        '• Develop Python applications, scripts, and automation tools',
                        '• Work with data processing libraries like Pandas and NumPy',
                        '• Implement machine learning models and data analysis solutions',
                        '• Create and maintain Python web applications using Django or Flask'
                    );
                }
                if (skills.some(s => s.includes('javascript') || s.includes('js'))) {
                    techResponsibilities.push(
                        '• Write efficient JavaScript code for web applications and APIs',
                        '• Implement modern ES6+ features and functional programming patterns',
                        '• Work with asynchronous programming and Promise-based operations',
                        '• Develop server-side applications using Node.js and Express'
                    );
                }
                if (skills.some(s => s.includes('typescript'))) {
                    techResponsibilities.push(
                        '• Develop type-safe applications using TypeScript',
                        '• Implement interfaces and type definitions for better code quality',
                        '• Work with advanced TypeScript features and design patterns',
                        '• Ensure type safety across frontend and backend applications'
                    );
                }
                if (skills.some(s => s.includes('c#') || s.includes('.net'))) {
                    techResponsibilities.push(
                        '• Develop applications using C# and .NET framework',
                        '• Implement ASP.NET Core web applications and APIs',
                        '• Work with Entity Framework for database operations',
                        '• Develop Windows desktop applications using WPF or WinForms'
                    );
                }
                
                // Frontend Frameworks
                if (skills.some(s => s.includes('react'))) {
                    techResponsibilities.push(
                        '• Build responsive and interactive user interfaces using React.js',
                        '• Implement state management solutions (Redux, Context API)',
                        '• Create reusable components and maintain component libraries',
                        '• Optimize React application performance and bundle size'
                    );
                }
                if (skills.some(s => s.includes('angular'))) {
                    techResponsibilities.push(
                        '• Develop single-page applications using Angular framework',
                        '• Implement Angular services, components, and modules',
                        '• Work with Angular CLI and build optimization tools',
                        '• Create responsive designs using Angular Material or custom components'
                    );
                }
                if (skills.some(s => s.includes('vue'))) {
                    techResponsibilities.push(
                        '• Build modern web applications using Vue.js framework',
                        '• Implement Vuex for state management and Vue Router for navigation',
                        '• Create reusable Vue components and maintain component architecture',
                        '• Optimize Vue application performance and user experience'
                    );
                }
                
                // Backend & APIs
                if (skills.some(s => s.includes('node'))) {
                    techResponsibilities.push(
                        '• Develop server-side applications using Node.js and Express.js',
                        '• Implement RESTful APIs and GraphQL endpoints',
                        '• Work with middleware and authentication systems',
                        '• Optimize Node.js application performance and scalability'
                    );
                }
                if (skills.some(s => s.includes('php'))) {
                    techResponsibilities.push(
                        '• Develop web applications using PHP and modern frameworks',
                        '• Work with Laravel or Symfony for enterprise applications',
                        '• Implement database operations and API integrations',
                        '• Maintain and optimize PHP application performance'
                    );
                }
                
                // Databases
                if (skills.some(s => s.includes('database') || s.includes('sql') || s.includes('mysql') || s.includes('postgresql'))) {
                    techResponsibilities.push(
                        '• Design and optimize database schemas and SQL queries',
                        '• Implement database migrations and version control',
                        '• Work with relational databases (MySQL, PostgreSQL)',
                        '• Optimize database performance and ensure data integrity'
                    );
                }
                if (skills.some(s => s.includes('mongodb') || s.includes('nosql'))) {
                    techResponsibilities.push(
                        '• Design and implement NoSQL database solutions using MongoDB',
                        '• Optimize MongoDB queries and database performance',
                        '• Work with MongoDB aggregation pipelines and indexing',
                        '• Implement data modeling strategies for document databases'
                    );
                }
                if (skills.some(s => s.includes('redis'))) {
                    techResponsibilities.push(
                        '• Implement caching strategies using Redis',
                        '• Optimize application performance through Redis caching',
                        '• Work with Redis data structures and persistence',
                        '• Design distributed caching solutions'
                    );
                }
                
                // Cloud & DevOps
                if (skills.some(s => s.includes('aws') || s.includes('azure') || s.includes('gcp'))) {
                    techResponsibilities.push(
                        '• Deploy and manage applications on cloud platforms (AWS/Azure/GCP)',
                        '• Implement cloud-native solutions and serverless architectures',
                        '• Work with cloud services for storage, compute, and networking',
                        '• Optimize cloud costs and resource utilization'
                    );
                }
                if (skills.some(s => s.includes('docker'))) {
                    techResponsibilities.push(
                        '• Containerize applications using Docker and Docker Compose',
                        '• Create and maintain Docker images and containers',
                        '• Implement container orchestration and deployment strategies',
                        '• Optimize Docker performance and security best practices'
                    );
                }
                if (skills.some(s => s.includes('kubernetes'))) {
                    techResponsibilities.push(
                        '• Deploy and manage applications using Kubernetes',
                        '• Create and maintain Kubernetes manifests and configurations',
                        '• Implement service mesh and load balancing solutions',
                        '• Monitor and troubleshoot Kubernetes cluster performance'
                    );
                }
                if (skills.some(s => s.includes('devops'))) {
                    techResponsibilities.push(
                        '• Implement CI/CD pipelines and automation workflows',
                        '• Configure and maintain build and deployment tools',
                        '• Monitor application performance and infrastructure health',
                        '• Implement infrastructure as code (IaC) practices'
                    );
                }
                
                // Testing & Quality
                if (skills.some(s => s.includes('qa') || s.includes('test') || s.includes('selenium'))) {
                    techResponsibilities.push(
                        '• Write and maintain automated tests (unit, integration, e2e)',
                        '• Implement test-driven development (TDD) practices',
                        '• Work with testing frameworks and tools (Jest, Cypress, Selenium)',
                        '• Ensure code coverage and quality standards'
                    );
                }
                
                // UI/UX
                if (skills.some(s => s.includes('ui') || s.includes('ux') || s.includes('design'))) {
                    techResponsibilities.push(
                        '• Create user-friendly interfaces and improve user experience',
                        '• Work with design systems and component libraries',
                        '• Implement responsive design principles and accessibility standards',
                        '• Collaborate with designers on UI/UX improvements'
                    );
                }
                
                // Mobile Development
                if (skills.some(s => s.includes('react native') || s.includes('flutter') || s.includes('mobile'))) {
                    techResponsibilities.push(
                        '• Develop cross-platform mobile applications',
                        '• Implement native mobile features and integrations',
                        '• Optimize mobile app performance and user experience',
                        '• Work with mobile app deployment and distribution'
                    );
                }
                
                // Data & Analytics
                if (skills.some(s => s.includes('data') || s.includes('analytics') || s.includes('ml') || s.includes('ai'))) {
                    techResponsibilities.push(
                        '• Implement data processing and analytics solutions',
                        '• Work with machine learning models and AI algorithms',
                        '• Create data visualization and reporting tools',
                        '• Optimize data pipelines and ETL processes'
                    );
                }
            }
            
            // Company and industry-specific responsibilities
            const companyResponsibilities = [];
            
            // Startup responsibilities
            if (company.toLowerCase().includes('startup') || company.toLowerCase().includes('tech')) {
                companyResponsibilities.push(
                    '• Work in a fast-paced startup environment with rapid iteration cycles',
                    '• Contribute to product decisions and feature prioritization',
                    '• Wear multiple hats and adapt to changing requirements quickly',
                    '• Help build and scale the technical foundation of the company'
                );
            }
            
            // Enterprise responsibilities
            if (company.toLowerCase().includes('enterprise') || company.toLowerCase().includes('corp')) {
                companyResponsibilities.push(
                    '• Work with enterprise-grade systems and compliance requirements',
                    '• Follow established enterprise development processes and standards',
                    '• Collaborate with multiple teams across different departments',
                    '• Ensure security and regulatory compliance in all implementations'
                );
            }
            
            // Remote work responsibilities
            if (jobType.toLowerCase().includes('remote')) {
                companyResponsibilities.push(
                    '• Work effectively in a remote environment with distributed teams',
                    '• Maintain clear communication through various collaboration tools',
                    '• Self-manage time and priorities in a remote work setting',
                    '• Participate in virtual meetings and team collaboration sessions'
                );
            }
            
            // Combine all responsibilities and select based on experience level
            const allResponsibilities = [...baseResponsibilities, ...techResponsibilities, ...companyResponsibilities];
            
            // Select responsibilities based on experience level (more for senior roles)
            let selectedCount = 4;
            if (experienceLevel.includes('Junior')) selectedCount = 4;
            else if (experienceLevel.includes('Middle')) selectedCount = 5;
            else if (experienceLevel.includes('Senior')) selectedCount = 6;
            else if (experienceLevel.includes('Lead')) selectedCount = 7;
            
            // Shuffle and select responsibilities
            const shuffled = allResponsibilities.sort(() => 0.5 - Math.random());
            const selectedResponsibilities = shuffled.slice(0, selectedCount);
            
            description += selectedResponsibilities.join('<br>') + '<br><br>';
            
            // Generate dynamic We Offer section
            description += `We Offer<br><br>`;
            
            // Comprehensive benefits pool
            const allBenefits = [
                // Financial Benefits
                '• Competitive salary package with regular reviews',
                '• Performance-based bonuses and incentives',
                '• Stock options and equity participation',
                '• Profit sharing and annual bonuses',
                '• Relocation assistance and signing bonuses',
                
                // Health & Wellness
                '• Comprehensive health insurance coverage',
                '• Dental and vision insurance plans',
                '• Mental health support and counseling services',
                '• Gym membership and wellness programs',
                '• Health savings accounts (HSA)',
                '• Life insurance and disability coverage',
                
                // Work-Life Balance
                '• Flexible work schedule and remote work options',
                '• Unlimited paid time off (PTO)',
                '• Paid parental leave and family support',
                '• Flexible holidays and personal days',
                '• Work-from-home stipend and equipment',
                '• Summer Fridays and reduced hours options',
                
                // Professional Development
                '• Professional development and training opportunities',
                '• Conference attendance and certification programs',
                '• Learning budget for courses and books',
                '• Mentorship programs and career coaching',
                '• Internal training and skill development',
                '• Tuition reimbursement for continuing education',
                
                // Technology & Tools
                '• Modern technology stack and latest tools',
                '• Latest hardware and software tools',
                '• Home office setup and equipment',
                '• Mobile phone and internet allowance',
                '• Access to premium software and services',
                '• Latest development tools and IDEs',
                
                // Work Environment
                '• Collaborative and innovative work environment',
                '• Casual dress code and relaxed atmosphere',
                '• Modern office space with amenities',
                '• Free snacks, coffee, and meals',
                '• Game rooms and recreational areas',
                '• Pet-friendly office environment',
                
                // Career Growth
                '• Career growth and advancement opportunities',
                '• Clear career progression paths',
                '• Internal promotion opportunities',
                '• Cross-functional project opportunities',
                '• Leadership development programs',
                '• International transfer opportunities',
                
                // Team & Culture
                '• Team building activities and events',
                '• Company retreats and offsites',
                '• Social events and happy hours',
                '• Volunteer opportunities and community service',
                '• Diversity and inclusion programs',
                '• Employee recognition and awards',
                
                // Additional Perks
                '• Commuter benefits and parking allowance',
                '• Childcare assistance and family support',
                '• Employee discount programs',
                '• Financial planning and advisory services',
                '• Legal assistance and consultation',
                '• Employee assistance programs (EAP)'
            ];
            
            // Smart benefit selection based on multiple factors
            let selectedBenefits: string[] = [];
            
            // Base benefits for all positions
            selectedBenefits.push('• Competitive salary package with regular reviews');
            
            // Salary-based benefits
            if (packageOffered > 150) {
                selectedBenefits.push(
                    '• Performance-based bonuses and incentives',
                    '• Stock options and equity participation',
                    '• Comprehensive health insurance coverage'
                );
            } else if (packageOffered > 100) {
                selectedBenefits.push(
                    '• Performance-based bonuses and incentives',
                    '• Comprehensive health insurance coverage'
                );
            } else {
                selectedBenefits.push('• Health insurance and wellness programs');
            }
            
            // Company type benefits
            if (company.toLowerCase().includes('startup') || company.toLowerCase().includes('tech')) {
                selectedBenefits.push(
                    '• Stock options and equity participation',
                    '• Modern technology stack and latest tools',
                    '• Flexible work schedule and remote work options',
                    '• Casual dress code and relaxed atmosphere'
                );
            } else if (company.toLowerCase().includes('enterprise') || company.toLowerCase().includes('corp')) {
                selectedBenefits.push(
                    '• Comprehensive health insurance coverage',
                    '• Professional development and training opportunities',
                    '• Career growth and advancement opportunities',
                    '• Employee assistance programs (EAP)'
                );
            } else {
                selectedBenefits.push(
                    '• Professional development and training opportunities',
                    '• Modern technology stack and latest tools'
                );
            }
            
            // Remote work benefits
            if (jobType.toLowerCase().includes('remote')) {
                selectedBenefits.push(
                    '• Work-from-home stipend and equipment',
                    '• Flexible work schedule and remote work options',
                    '• Home office setup and equipment',
                    '• Virtual team building activities and events'
                );
            } else if (jobType.toLowerCase().includes('hybrid')) {
                selectedBenefits.push(
                    '• Flexible work schedule and hybrid work options',
                    '• Home office setup and equipment',
                    '• Commuter benefits and parking allowance'
                );
            } else {
                selectedBenefits.push(
                    '• Modern office space with amenities',
                    '• Free snacks, coffee, and meals'
                );
            }
            
            // Experience level benefits
            if (experienceLevel.includes('Junior')) {
                selectedBenefits.push(
                    '• Mentorship programs and career coaching',
                    '• Learning budget for courses and books',
                    '• Internal training and skill development'
                );
            } else if (experienceLevel.includes('Senior') || experienceLevel.includes('Lead')) {
                selectedBenefits.push(
                    '• Leadership development programs',
                    '• Conference attendance and certification programs',
                    '• Cross-functional project opportunities'
                );
            }
            
            // Industry-specific benefits
            if (skillsRequired.some(s => s.toLowerCase().includes('ai') || s.toLowerCase().includes('ml'))) {
                selectedBenefits.push('• Access to premium AI/ML tools and platforms');
            }
            if (skillsRequired.some(s => s.toLowerCase().includes('mobile'))) {
                selectedBenefits.push('• Latest mobile development devices and tools');
            }
            if (skillsRequired.some(s => s.toLowerCase().includes('devops'))) {
                selectedBenefits.push('• Access to cloud platforms and infrastructure tools');
            }
            
            // Remove duplicates and select final benefits
            selectedBenefits = selectedBenefits.filter((item, index) => selectedBenefits.indexOf(item) === index);
            
            // Add random benefits to reach target count (6-8 benefits total)
            const remainingBenefits = allBenefits.filter(b => !selectedBenefits.includes(b));
            const targetCount = Math.min(8, Math.max(6, selectedBenefits.length + 2));
            const additionalCount = targetCount - selectedBenefits.length;
            
            if (additionalCount > 0 && remainingBenefits.length > 0) {
                const shuffledRemaining = remainingBenefits.sort(() => 0.5 - Math.random());
                const additionalBenefits = shuffledRemaining.slice(0, additionalCount);
                selectedBenefits = [...selectedBenefits, ...additionalBenefits];
            }
            
            // Shuffle final selection for variety
            selectedBenefits = selectedBenefits.sort(() => 0.5 - Math.random());
            
            description += selectedBenefits.join('<br>') + '<br><br>';
            
            // Generate dynamic call to action based on company and role
            let callToAction = '';
            
            if (company.toLowerCase().includes('startup')) {
                const startupCallToActions = [
                    'Join our fast-growing startup and help us revolutionize the industry!',
                    'Be part of our exciting journey from startup to scale-up!',
                    'Help us build the next big thing - apply now!',
                    'Join our innovative team and make a real impact!',
                    'Be part of our mission to change the world through technology!'
                ];
                callToAction = startupCallToActions[Math.floor(Math.random() * startupCallToActions.length)];
            } else if (company.toLowerCase().includes('enterprise') || company.toLowerCase().includes('corp')) {
                const enterpriseCallToActions = [
                    'Join our established team and grow your career with us!',
                    'Be part of our global organization and make a difference!',
                    'Apply now and become part of our professional team!',
                    'Join our company and enjoy stability with growth opportunities!',
                    'Be part of our success story and advance your career!'
                ];
                callToAction = enterpriseCallToActions[Math.floor(Math.random() * enterpriseCallToActions.length)];
            } else if (experienceLevel.includes('Junior')) {
                const juniorCallToActions = [
                    'Start your career journey with us - apply now!',
                    'Join our team and learn from experienced professionals!',
                    'Begin your professional growth with our supportive team!',
                    'Apply today and kickstart your career in technology!',
                    'Join us and build a strong foundation for your future!'
                ];
                callToAction = juniorCallToActions[Math.floor(Math.random() * juniorCallToActions.length)];
            } else if (experienceLevel.includes('Senior') || experienceLevel.includes('Lead')) {
                const seniorCallToActions = [
                    'Lead with us and shape the future of our technology!',
                    'Join our leadership team and make strategic decisions!',
                    'Apply now and take your career to the next level!',
                    'Be part of our senior team and drive innovation!',
                    'Join us and lead our technical initiatives!'
                ];
                callToAction = seniorCallToActions[Math.floor(Math.random() * seniorCallToActions.length)];
            } else {
                const generalCallToActions = [
                    'Send your resume and join our team!',
                    'Apply now and become part of our success story!',
                    'Join us and help shape the future of technology!',
                    'We look forward to welcoming you to our team!',
                    'Take the next step in your career with us!',
                    'Apply today and grow with our company!',
                    'Join our dynamic team and make a difference!',
                    'Be part of our innovative and collaborative environment!'
                ];
                callToAction = generalCallToActions[Math.floor(Math.random() * generalCallToActions.length)];
            }
            
            description += callToAction;
            
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
                    onDescriptionGenerated(description, about);
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

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Interfaces for typing
interface JobDescriptionRequest {
    jobTitle: string;
    skillsRequired: string[];
    experience: string;
    company?: string;
    location?: string;
    jobType?: string;
    packageOffered?: number;
    additionalRequirements?: string;
    tone?: string;
    language?: string;
    // Новые поля для более гибкой генерации
    descriptionStyle?: string;
    targetAudience?: string;
    industry?: string;
    companySize?: string;
    workMode?: string;
    benefits?: string[];
    aboutJob?: string;
    includeCompanyInfo?: boolean;
    includeBenefits?: boolean;
    includeGrowthOpportunities?: boolean;
    customInstructions?: string;
}

interface JobDescriptionResponse {
    description: string;
    optimizedDescription: string;
    seoKeywords: string;
    suggestions: string;
    qualityScore: number;
    tone: string;
    language: string;
    // Новые поля для более детального ответа
    aboutJob?: string;
    responsibilities?: string;
    requirements?: string;
    benefits?: string;
    companyInfo?: string;
    keyHighlights?: string[];
    callToAction?: string;
    estimatedReadTime?: string;
    complexityLevel?: string;
    alternativeTitles?: string[];
    summary?: string;
}

interface OptimizeRequest {
    description: string;
}

interface ValidateRequest {
    description: string;
}

interface SEOKeywordsRequest {
    jobTitle: string;
    skills?: string;
    location?: string;
}

class JobDescriptionAIService {
    private getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }

    /**
     * Генерирует описание вакансии с помощью AI
     */
    async generateJobDescription(request: JobDescriptionRequest): Promise<JobDescriptionResponse> {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/ai/job-description/generate`,
                request,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error('Error generating job description:', error);
            throw error;
        }
    }

    /**
     * Оптимизирует существующее описание вакансии
     */
    async optimizeDescription(description: string): Promise<string> {
        try {
            const request: OptimizeRequest = { description };
            const response = await axios.post(
                `${API_BASE_URL}/ai/job-description/optimize`,
                request,
                { headers: this.getAuthHeaders() }
            );
            return response.data.optimizedDescription;
        } catch (error) {
            console.error('Error optimizing description:', error);
            throw error;
        }
    }

    /**
     * Проверяет описание на соответствие стандартам
     */
    async validateDescription(description: string): Promise<string> {
        try {
            const request: ValidateRequest = { description };
            const response = await axios.post(
                `${API_BASE_URL}/ai/job-description/validate`,
                request,
                { headers: this.getAuthHeaders() }
            );
            return response.data.validationResult;
        } catch (error) {
            console.error('Error validating description:', error);
            throw error;
        }
    }

    /**
     * Генерирует SEO-ключевые слова для вакансии
     */
    async generateSEOKeywords(jobTitle: string, skills?: string, location?: string): Promise<string> {
        try {
            const request: SEOKeywordsRequest = { jobTitle, skills, location };
            const response = await axios.post(
                `${API_BASE_URL}/ai/job-description/seo-keywords`,
                request,
                { headers: this.getAuthHeaders() }
            );
            return response.data.keywords;
        } catch (error) {
            console.error('Error generating SEO keywords:', error);
            throw error;
        }
    }

    /**
     * Проверяет статус AI сервиса
     */
    async healthCheck() {
        try {
            const response = await axios.get(`${API_BASE_URL}/ai/job-description/health`);
            return response.data;
        } catch (error) {
            console.error('AI service health check failed:', error);
            throw error;
        }
    }

    /**
     * Получает цвет для отображения качества описания
     */
    getQualityColor(score: number): string {
        if (score >= 80) return '#10B981'; // green
        if (score >= 60) return '#3B82F6'; // blue
        if (score >= 40) return '#F59E0B'; // yellow
        return '#EF4444'; // red
    }

    /**
     * Получает иконку для отображения качества описания
     */
    getQualityIcon(score: number): string {
        if (score >= 80) return '🎯';
        if (score >= 60) return '👍';
        if (score >= 40) return '🤔';
        return '❌';
    }

    /**
     * Получает текст оценки качества
     */
    getQualityText(score: number): string {
        if (score >= 80) return 'Отличное качество';
        if (score >= 60) return 'Хорошее качество';
        if (score >= 40) return 'Среднее качество';
        return 'Требует улучшения';
    }

    /**
     * Форматирует ключевые слова для отображения
     */
    formatKeywords(keywords: string): string[] {
        return keywords.split(',').map(k => k.trim()).filter(k => k.length > 0);
    }

    /**
     * Создает базовый запрос для генерации описания
     */
    createBasicRequest(jobTitle: string, skillsRequired: string[], experience: string): JobDescriptionRequest {
        return {
            jobTitle,
            skillsRequired,
            experience,
            tone: 'professional',
            language: 'ru'
        };
    }
}

export default new JobDescriptionAIService();

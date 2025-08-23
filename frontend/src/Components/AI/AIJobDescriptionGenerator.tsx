import React, { useState } from 'react';
import { 
    Card, 
    Button, 
    TextInput, 
    MultiSelect, 
    Select, 
    Textarea, 
    Group, 
    Stack, 
    Text, 
    Loader, 
    Alert,
    Badge,
    Modal,
    Tabs,
    Divider,
    Progress,
    ActionIcon,
    Tooltip,
    Switch,
    Accordion,
    Checkbox
} from '@mantine/core';
import { 
    IconBrain, 
    IconWand, 
    IconCopy, 
    IconCheck, 
    IconRefresh,
    IconTarget,
    IconSearch,
    IconBulb,
    IconSettings,
    IconEye,
    IconChevronDown,
    IconChevronUp
} from '@tabler/icons-react';
import JobDescriptionAIService from '../../Services/JobDescriptionAIService';

interface AIJobDescriptionGeneratorProps {
    onDescriptionGenerated?: (description: string, aboutJob?: string) => void;
    initialData?: {
        jobTitle?: string;
        skillsRequired?: string[];
        experience?: string;
        company?: string;
        location?: string;
        jobType?: string;
        packageOffered?: number;
    };
}

const AIJobDescriptionGenerator: React.FC<AIJobDescriptionGeneratorProps> = ({ 
    onDescriptionGenerated,
    initialData
}) => {
    const [jobTitle, setJobTitle] = useState(initialData?.jobTitle || '');
    const [skillsRequired, setSkillsRequired] = useState<string[]>(initialData?.skillsRequired || []);
    const [experience, setExperience] = useState(initialData?.experience || '');
    const [company, setCompany] = useState(initialData?.company || '');
    const [location, setLocation] = useState(initialData?.location || '');
    const [jobType, setJobType] = useState(initialData?.jobType || '');
    const [packageOffered, setPackageOffered] = useState<number | undefined>(initialData?.packageOffered);
    const [additionalRequirements, setAdditionalRequirements] = useState('');
    const [tone, setTone] = useState('professional');
    const [language, setLanguage] = useState('ru');
    
    // Новые поля для более гибкой генерации
    const [descriptionStyle, setDescriptionStyle] = useState('detailed');
    const [targetAudience, setTargetAudience] = useState('all');
    const [industry, setIndustry] = useState('tech');
    const [companySize, setCompanySize] = useState('medium');
    const [workMode, setWorkMode] = useState('remote');
    const [benefits, setBenefits] = useState<string[]>([]);
    const [aboutJob, setAboutJob] = useState('');
    const [includeCompanyInfo, setIncludeCompanyInfo] = useState(true);
    const [includeBenefits, setIncludeBenefits] = useState(true);
    const [includeGrowthOpportunities, setIncludeGrowthOpportunities] = useState(true);
    const [customInstructions, setCustomInstructions] = useState('');
    const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
    
    const [generatedResponse, setGeneratedResponse] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [previewModalOpen, setPreviewModalOpen] = useState(false);
    const [validationModalOpen, setValidationModalOpen] = useState(false);
    const [validationResult, setValidationResult] = useState<string>('');
    const [optimizedDescription, setOptimizedDescription] = useState<string>('');
    const [seoKeywords, setSeoKeywords] = useState<string>('');

    const experienceOptions = [
        { value: '0-1 years', label: '0-1 лет (Junior)' },
        { value: '1-3 years', label: '1-3 года (Middle)' },
        { value: '3-5 years', label: '3-5 лет (Senior)' },
        { value: '5+ years', label: '5+ лет (Lead/Architect)' },
        { value: 'Entry level', label: 'Начинающий уровень' },
        { value: 'Mid level', label: 'Средний уровень' },
        { value: 'Senior level', label: 'Старший уровень' },
        { value: 'Expert level', label: 'Эксперт' }
    ];

    const toneOptions = [
        { value: 'professional', label: 'Профессиональный' },
        { value: 'friendly', label: 'Дружелюбный' },
        { value: 'casual', label: 'Неформальный' },
        { value: 'formal', label: 'Формальный' },
        { value: 'creative', label: 'Креативный' },
        { value: 'technical', label: 'Технический' }
    ];

    const languageOptions = [
        { value: 'ru', label: 'Русский' },
        { value: 'en', label: 'English' }
    ];

    const styleOptions = [
        { value: 'detailed', label: 'Детальный' },
        { value: 'concise', label: 'Краткий' },
        { value: 'creative', label: 'Креативный' },
        { value: 'technical', label: 'Технический' },
        { value: 'marketing', label: 'Маркетинговый' }
    ];

    const audienceOptions = [
        { value: 'junior', label: 'Junior разработчики' },
        { value: 'mid', label: 'Middle разработчики' },
        { value: 'senior', label: 'Senior разработчики' },
        { value: 'all', label: 'Все уровни' }
    ];

    const industryOptions = [
        { value: 'tech', label: 'Технологии' },
        { value: 'finance', label: 'Финансы' },
        { value: 'healthcare', label: 'Здравоохранение' },
        { value: 'education', label: 'Образование' },
        { value: 'retail', label: 'Розничная торговля' },
        { value: 'manufacturing', label: 'Производство' },
        { value: 'consulting', label: 'Консалтинг' }
    ];

    const companySizeOptions = [
        { value: 'startup', label: 'Стартап' },
        { value: 'small', label: 'Маленькая (10-50)' },
        { value: 'medium', label: 'Средняя (50-500)' },
        { value: 'large', label: 'Большая (500+)' },
        { value: 'enterprise', label: 'Корпорация' }
    ];

    const workModeOptions = [
        { value: 'remote', label: 'Удаленно' },
        { value: 'hybrid', label: 'Гибрид' },
        { value: 'onsite', label: 'В офисе' }
    ];

    const benefitsOptions = [
        'health insurance',
        'flexible hours',
        'remote work',
        'learning budget',
        'gym membership',
        'free lunch',
        'stock options',
        'paid time off',
        'professional development',
        'team events'
    ];

    const commonSkills = [
        'Java', 'Spring Boot', 'Python', 'JavaScript', 'React', 'Angular', 'Vue.js',
        'Node.js', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Kafka', 'Docker',
        'Kubernetes', 'AWS', 'Azure', 'GCP', 'Git', 'CI/CD', 'REST API', 'GraphQL',
        'TypeScript', 'Go', 'Rust', 'C#', '.NET', 'PHP', 'Laravel', 'Ruby', 'Rails',
        'Scala', 'Kotlin', 'Swift', 'Flutter', 'React Native'
    ];

    const generateDescription = async () => {
        if (!jobTitle.trim()) {
            setError('Пожалуйста, укажите название должности');
            return;
        }

        if (skillsRequired.length === 0) {
            setError('Пожалуйста, укажите хотя бы один требуемый навык');
            return;
        }

        setLoading(true);
        setError(null);
        setCopied(false);

        try {
            const request = {
                jobTitle,
                skillsRequired,
                experience,
                company,
                location,
                jobType,
                packageOffered,
                additionalRequirements,
                tone,
                language,
                descriptionStyle,
                targetAudience,
                industry,
                companySize,
                workMode,
                benefits,
                aboutJob,
                includeCompanyInfo,
                includeBenefits,
                includeGrowthOpportunities,
                customInstructions
            };

            const response = await JobDescriptionAIService.generateJobDescription(request);
            setGeneratedResponse(response);
            
            if (onDescriptionGenerated) {
                onDescriptionGenerated(response.description, response.aboutJob);
            }
        } catch (err) {
            setError('Не удалось сгенерировать описание. Попробуйте еще раз.');
            console.error('Error generating job description:', err);
        } finally {
            setLoading(false);
        }
    };

    const optimizeDescription = async () => {
        if (!generatedResponse?.description) return;
        
        setLoading(true);
        try {
            const optimized = await JobDescriptionAIService.optimizeDescription(generatedResponse.description);
            setOptimizedDescription(optimized);
        } catch (err) {
            console.error('Error optimizing description:', err);
        } finally {
            setLoading(false);
        }
    };

    const validateDescription = async () => {
        if (!generatedResponse?.description) return;
        
        setLoading(true);
        try {
            const validation = await JobDescriptionAIService.validateDescription(generatedResponse.description);
            setValidationResult(validation);
            setValidationModalOpen(true);
        } catch (err) {
            console.error('Error validating description:', err);
        } finally {
            setLoading(false);
        }
    };

    const generateSEOKeywords = async () => {
        if (!jobTitle.trim()) return;
        
        setLoading(true);
        try {
            const keywords = await JobDescriptionAIService.generateSEOKeywords(
                jobTitle, 
                skillsRequired.join(', '), 
                location
            );
            setSeoKeywords(keywords);
        } catch (err) {
            console.error('Error generating SEO keywords:', err);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    };

    const clearForm = () => {
        setJobTitle('');
        setSkillsRequired([]);
        setExperience('');
        setCompany('');
        setLocation('');
        setJobType('');
        setPackageOffered(undefined);
        setAdditionalRequirements('');
        setGeneratedResponse(null);
        setError(null);
        setCopied(false);
        setOptimizedDescription('');
        setSeoKeywords('');
    };

    const useGeneratedDescription = () => {
        if (generatedResponse?.description && onDescriptionGenerated) {
            onDescriptionGenerated(generatedResponse.description, generatedResponse.aboutJob);
        }
    };

    return (
        <div>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group mb="md">
                    <IconBrain size={24} color="#6366f1" />
                    <div>
                        <Text size="lg" fw={600}>AI-помощник для создания описания</Text>
                        <Text size="sm" c="dimmed">
                            Создайте привлекательное описание вакансии с помощью ИИ
                        </Text>
                    </div>
                </Group>

                <Tabs defaultValue="basic">
                    <Tabs.List>
                        <Tabs.Tab value="basic" leftSection={<IconSettings size={14} />}>
                            Основная информация
                        </Tabs.Tab>
                        <Tabs.Tab value="advanced" leftSection={<IconBrain size={14} />}>
                            Дополнительно
                        </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="basic" pt="md">
                        <Stack gap="md">
                            <TextInput
                                label="Название должности *"
                                placeholder="Например: Senior Java Developer"
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                                required
                            />

                            <MultiSelect
                                label="Требуемые навыки *"
                                placeholder="Выберите навыки"
                                data={commonSkills}
                                value={skillsRequired}
                                onChange={setSkillsRequired}
                                searchable
                                required
                            />

                            <Select
                                label="Требуемый опыт"
                                placeholder="Выберите уровень опыта"
                                data={experienceOptions}
                                value={experience}
                                onChange={(value) => setExperience(value || '')}
                                clearable
                            />

                            <Group grow>
                                <TextInput
                                    label="Компания"
                                    placeholder="Название компании"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                />
                                <TextInput
                                    label="Местоположение"
                                    placeholder="Город или удаленно"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </Group>

                            <Group grow>
                                <Select
                                    label="Тип занятости"
                                    placeholder="Выберите тип"
                                    data={[
                                        { value: 'Полная занятость', label: 'Полная занятость' },
                                        { value: 'Частичная занятость', label: 'Частичная занятость' },
                                        { value: 'Удаленная работа', label: 'Удаленная работа' },
                                        { value: 'Гибрид', label: 'Гибрид' }
                                    ]}
                                    value={jobType}
                                    onChange={(value) => setJobType(value || '')}
                                    clearable
                                />
                                <TextInput
                                    label="Зарплата (руб.)"
                                    placeholder="Например: 150000"
                                    type="number"
                                    value={packageOffered || ''}
                                    onChange={(e) => setPackageOffered(e.target.value ? Number(e.target.value) : undefined)}
                                />
                            </Group>

                            <Textarea
                                label="Дополнительные требования"
                                placeholder="Дополнительные требования или пожелания..."
                                value={additionalRequirements}
                                onChange={(e) => setAdditionalRequirements(e.target.value)}
                                minRows={2}
                            />
                        </Stack>
                    </Tabs.Panel>

                    <Tabs.Panel value="advanced" pt="md">
                        <Stack gap="md">
                            <Group grow>
                                <Select
                                    label="Стиль описания"
                                    placeholder="Выберите стиль"
                                    data={styleOptions}
                                    value={descriptionStyle}
                                    onChange={(value) => setDescriptionStyle(value || 'detailed')}
                                />
                                <Select
                                    label="Целевая аудитория"
                                    placeholder="Выберите аудиторию"
                                    data={audienceOptions}
                                    value={targetAudience}
                                    onChange={(value) => setTargetAudience(value || 'all')}
                                />
                            </Group>

                            <Group grow>
                                <Select
                                    label="Отрасль"
                                    placeholder="Выберите отрасль"
                                    data={industryOptions}
                                    value={industry}
                                    onChange={(value) => setIndustry(value || 'tech')}
                                />
                                <Select
                                    label="Размер компании"
                                    placeholder="Выберите размер"
                                    data={companySizeOptions}
                                    value={companySize}
                                    onChange={(value) => setCompanySize(value || 'medium')}
                                />
                            </Group>

                            <Group grow>
                                <Select
                                    label="Режим работы"
                                    placeholder="Выберите режим"
                                    data={workModeOptions}
                                    value={workMode}
                                    onChange={(value) => setWorkMode(value || 'remote')}
                                />
                                <Select
                                    label="Тон описания"
                                    placeholder="Выберите тон"
                                    data={toneOptions}
                                    value={tone}
                                    onChange={(value) => setTone(value || 'professional')}
                                />
                            </Group>

                            <MultiSelect
                                label="Бенефиты"
                                placeholder="Выберите бенефиты"
                                data={benefitsOptions}
                                value={benefits}
                                onChange={setBenefits}
                                searchable
                            />

                            <TextInput
                                label="Краткое описание (About Job)"
                                placeholder="Краткое описание для поля 'About Job'..."
                                value={aboutJob}
                                onChange={(e) => setAboutJob(e.target.value)}
                            />

                            <Group>
                                <Switch
                                    label="Включить информацию о компании"
                                    checked={includeCompanyInfo}
                                    onChange={(e) => setIncludeCompanyInfo(e.currentTarget.checked)}
                                />
                                <Switch
                                    label="Включить бенефиты"
                                    checked={includeBenefits}
                                    onChange={(e) => setIncludeBenefits(e.currentTarget.checked)}
                                />
                                <Switch
                                    label="Включить возможности роста"
                                    checked={includeGrowthOpportunities}
                                    onChange={(e) => setIncludeGrowthOpportunities(e.currentTarget.checked)}
                                />
                            </Group>

                            <Textarea
                                label="Пользовательские инструкции"
                                placeholder="Дополнительные инструкции для AI..."
                                value={customInstructions}
                                onChange={(e) => setCustomInstructions(e.target.value)}
                                minRows={2}
                            />
                        </Stack>
                    </Tabs.Panel>
                </Tabs>

                {error && (
                    <Alert color="red" title="Ошибка" mt="md">
                        {error}
                    </Alert>
                )}

                <Group mt="md">
                    <Button
                        leftSection={<IconWand size={16} />}
                        onClick={generateDescription}
                        loading={loading}
                        disabled={!jobTitle.trim() || skillsRequired.length === 0}
                    >
                        {loading ? 'Генерируем...' : 'Сгенерировать описание'}
                    </Button>
                    
                    <Button
                        variant="outline"
                        onClick={clearForm}
                        disabled={loading}
                    >
                        Очистить
                    </Button>
                </Group>
            </Card>

            {generatedResponse && (
                <Card shadow="sm" padding="lg" radius="md" withBorder mt="md">
                    <Group justify="space-between" mb="md">
                        <Group>
                            <Badge 
                                color="green" 
                                variant="light"
                                leftSection={<IconBrain size={12} />}
                            >
                                AI сгенерировано
                            </Badge>
                            <Badge 
                                style={{ 
                                    backgroundColor: JobDescriptionAIService.getQualityColor(generatedResponse.qualityScore),
                                    color: 'white'
                                }}
                                leftSection={<span>{JobDescriptionAIService.getQualityIcon(generatedResponse.qualityScore)}</span>}
                            >
                                {Math.round(generatedResponse.qualityScore)}% качество
                            </Badge>
                        </Group>
                        
                        <Group gap="xs">
                            <Tooltip label="Копировать описание">
                                <ActionIcon
                                    variant="outline"
                                    onClick={() => copyToClipboard(generatedResponse.description)}
                                    color={copied ? 'green' : 'blue'}
                                >
                                    {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                                </ActionIcon>
                            </Tooltip>
                            
                            <Tooltip label="Предварительный просмотр">
                                <ActionIcon
                                    variant="outline"
                                    onClick={() => setPreviewModalOpen(true)}
                                >
                                    <IconEye size={14} />
                                </ActionIcon>
                            </Tooltip>
                        </Group>
                    </Group>

                    <Tabs defaultValue="description">
                        <Tabs.List>
                            <Tabs.Tab value="description" leftSection={<IconWand size={14} />}>
                                Описание
                            </Tabs.Tab>
                            <Tabs.Tab value="optimized" leftSection={<IconTarget size={14} />}>
                                Оптимизированное
                            </Tabs.Tab>
                            <Tabs.Tab value="seo" leftSection={<IconSearch size={14} />}>
                                SEO
                            </Tabs.Tab>
                            <Tabs.Tab value="suggestions" leftSection={<IconBulb size={14} />}>
                                Рекомендации
                            </Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel value="description" pt="md">
                            <Textarea
                                value={generatedResponse.description}
                                onChange={(e) => setGeneratedResponse({
                                    ...generatedResponse,
                                    description: e.target.value
                                })}
                                minRows={8}
                                maxRows={15}
                                label="Сгенерированное описание"
                                description="Вы можете отредактировать текст перед использованием"
                            />
                            
                            <Group mt="md">
                                <Button
                                    onClick={useGeneratedDescription}
                                    leftSection={<IconCheck size={16} />}
                                >
                                    Использовать это описание
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={validateDescription}
                                    leftSection={<IconBulb size={16} />}
                                    loading={loading}
                                >
                                    Проверить качество
                                </Button>
                            </Group>
                        </Tabs.Panel>

                        <Tabs.Panel value="optimized" pt="md">
                            <Group justify="space-between" mb="sm">
                                <Text size="sm" fw={500}>Оптимизированная версия</Text>
                                <Button
                                    size="xs"
                                    variant="outline"
                                    onClick={optimizeDescription}
                                    loading={loading}
                                    leftSection={<IconRefresh size={14} />}
                                >
                                    Оптимизировать
                                </Button>
                            </Group>
                            
                            <Textarea
                                value={optimizedDescription || generatedResponse.optimizedDescription}
                                onChange={(e) => setOptimizedDescription(e.target.value)}
                                minRows={8}
                                maxRows={15}
                                placeholder="Нажмите 'Оптимизировать' для улучшения текста"
                            />
                        </Tabs.Panel>

                        <Tabs.Panel value="seo" pt="md">
                            <Group justify="space-between" mb="sm">
                                <Text size="sm" fw={500}>SEO-ключевые слова</Text>
                                <Button
                                    size="xs"
                                    variant="outline"
                                    onClick={generateSEOKeywords}
                                    loading={loading}
                                    leftSection={<IconSearch size={14} />}
                                >
                                    Сгенерировать
                                </Button>
                            </Group>
                            
                            <Textarea
                                value={seoKeywords || generatedResponse.seoKeywords}
                                onChange={(e) => setSeoKeywords(e.target.value)}
                                minRows={4}
                                maxRows={6}
                                placeholder="Ключевые слова для поиска"
                                description="Используйте эти ключевые слова для улучшения поиска вашей вакансии"
                            />
                        </Tabs.Panel>

                        <Tabs.Panel value="suggestions" pt="md">
                            <Text size="sm" fw={500} mb="sm">Рекомендации по улучшению</Text>
                            <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                                {generatedResponse.suggestions || 'Рекомендации будут доступны после генерации описания.'}
                            </Text>
                        </Tabs.Panel>
                    </Tabs>
                </Card>
            )}

            {/* Модальное окно предварительного просмотра */}
            <Modal
                opened={previewModalOpen}
                onClose={() => setPreviewModalOpen(false)}
                title="Предварительный просмотр описания"
                size="lg"
            >
                <Stack gap="md">
                    <div>
                        <Text fw={600} size="lg">{jobTitle}</Text>
                        {company && <Text size="sm" c="dimmed">{company}</Text>}
                        {location && <Badge color="blue" variant="light" mt="xs">{location}</Badge>}
                    </div>
                    
                    <Divider />
                    
                    <div>
                        <Text size="sm" fw={500} mb="xs">Требуемые навыки:</Text>
                        <Group gap="xs">
                            {skillsRequired.map((skill, index) => (
                                <Badge key={index} size="sm" variant="outline">
                                    {skill}
                                </Badge>
                            ))}
                        </Group>
                    </div>
                    
                    <div>
                        <Text size="sm" fw={500} mb="xs">Описание:</Text>
                        <div 
                            style={{ 
                                whiteSpace: 'pre-wrap',
                                lineHeight: '1.6',
                                fontSize: '14px'
                            }}
                        >
                            {generatedResponse?.description}
                        </div>
                    </div>
                </Stack>
            </Modal>

            {/* Модальное окно проверки качества */}
            <Modal
                opened={validationModalOpen}
                onClose={() => setValidationModalOpen(false)}
                title="Проверка качества описания"
                size="lg"
            >
                <Stack gap="md">
                    <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                        {validationResult}
                    </Text>
                    
                    <Button 
                        fullWidth 
                        onClick={() => setValidationModalOpen(false)}
                    >
                        Закрыть
                    </Button>
                </Stack>
            </Modal>
        </div>
    );
};

export default AIJobDescriptionGenerator;

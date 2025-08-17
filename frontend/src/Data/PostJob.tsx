const fields=[
    {label:"Job Title",placeholder:"Enter Job Title", options:['Designer', 'Developer', 'Product Manager', 'Marketing Specialist', 'Data Analyst', 'Sales Executive', 'Content Writer', 'Customer Support']},
    {label:"Company",placeholder:"Enter Company Name", options:['Google', 'Microsoft', 'Meta', 'Netflix', 'Adobe', 'Facebook', 'Amazon', 'Apple', 'Spotify']},
    {label:"Experience",placeholder:"Enter Experience Level", options:['Entry Level', 'Intermediate', 'Expert']},
    {label:"Job Type",placeholder:"Enter Job Type", options:['Full Time', 'Part Time', 'Contract', 'Freelance', 'Internship']},
    {label:"Location",placeholder:"Enter Job Location", options:['Delhi', 'New York', 'San Francisco', 'London', 'Berlin', 'Tokyo', 'Sydney', 'Toronto']},
    {label:"Salary",placeholder:"Enter Salary", options:['$25K', '$40K', '$50K', '$65K', '$80K', '$90K', '$100K', '$115K']}
]
const content =
  '<h4>About The Job</h4><p>Write description here...</p><h4>Responsibilities</h4><ul><li>Add responsibilities here...</li></ul><h4>Qualifications and Skill Sets</h4><ul><li>Add required qualification and skill set here...</li></ul>';
export  {fields, content};
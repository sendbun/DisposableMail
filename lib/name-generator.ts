// Human name generator with diverse names from different cultures
export interface NameData {
  firstNames: string[]
  lastNames: string[]
  adjectives: string[]
}

// Comprehensive name database
const nameData: NameData = {
  firstNames: [
    // Western names
    'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'James', 'Olivia', 'Robert', 'Ava',
    'William', 'Isabella', 'Richard', 'Sophia', 'Joseph', 'Charlotte', 'Thomas', 'Mia', 'Christopher', 'Amelia',
    'Charles', 'Harper', 'Daniel', 'Evelyn', 'Matthew', 'Abigail', 'Anthony', 'Emily', 'Mark', 'Elizabeth',
    'Donald', 'Sofia', 'Steven', 'Avery', 'Paul', 'Ella', 'Andrew', 'Madison', 'Joshua', 'Scarlett',
    'Kenneth', 'Victoria', 'Kevin', 'Aria', 'Brian', 'Grace', 'George', 'Chloe', 'Timothy', 'Camila',
    'Ronald', 'Penelope', 'Jason', 'Layla', 'Edward', 'Riley', 'Jeffrey', 'Lillian', 'Ryan', 'Nora',
    'Jacob', 'Zoey', 'Gary', 'Mila', 'Nicholas', 'Aubrey', 'Eric', 'Hannah', 'Jonathan', 'Lily',
    'Stephen', 'Addison', 'Larry', 'Eleanor', 'Justin', 'Natalie', 'Scott', 'Luna', 'Brandon', 'Savannah',
    'Benjamin', 'Brooklyn', 'Samuel', 'Leah', 'Frank', 'Zoe', 'Gregory', 'Hazel', 'Raymond', 'Violet',
    'Alexander', 'Aurora', 'Patrick', 'Aubrey', 'Jack', 'Lucy', 'Dennis', 'Audrey', 'Jerry', 'Bella',
    
    // Indian names
    'Aarav', 'Aisha', 'Arjun', 'Diya', 'Vivaan', 'Zara', 'Aditya', 'Ananya', 'Vihaan', 'Kiara',
    'Arnav', 'Myra', 'Vivaan', 'Riya', 'Shaurya', 'Aisha', 'Advait', 'Zara', 'Krishiv', 'Anaya',
    'Dhruv', 'Aaradhya', 'Kabir', 'Pari', 'Aarush', 'Kyra', 'Reyansh', 'Navya', 'Krishna', 'Aisha',
    'Ishaan', 'Zara', 'Shaurya', 'Ananya', 'Vivaan', 'Diya', 'Arjun', 'Kiara', 'Aditya', 'Myra',
    'Vihaan', 'Riya', 'Arnav', 'Aisha', 'Advait', 'Zara', 'Krishiv', 'Anaya', 'Dhruv', 'Aaradhya',
    'Kabir', 'Pari', 'Aarush', 'Kyra', 'Reyansh', 'Navya', 'Krishna', 'Aisha', 'Ishaan', 'Zara',
    
    // Asian names
    'Wei', 'Li', 'Ming', 'Xia', 'Jian', 'Yue', 'Tao', 'Mei', 'Feng', 'Hui',
    'Yong', 'Jing', 'Bin', 'Yan', 'Hao', 'Xin', 'Lei', 'Fang', 'Jun', 'Lan',
    'Kai', 'Yuki', 'Hiro', 'Aki', 'Ken', 'Mai', 'Taro', 'Saki', 'Yuki', 'Hana',
    'Sora', 'Aoi', 'Ren', 'Yui', 'Kota', 'Mio', 'Haru', 'Sakura', 'Yuto', 'Rin',
    
    // Middle Eastern names
    'Ahmad', 'Fatima', 'Omar', 'Aisha', 'Hassan', 'Zara', 'Ali', 'Layla', 'Yusuf', 'Noor',
    'Ibrahim', 'Amina', 'Khalil', 'Mariam', 'Zain', 'Hana', 'Tariq', 'Yasmin', 'Rashid', 'Nadia',
    'Karim', 'Leila', 'Samir', 'Dalia', 'Nabil', 'Rania', 'Fadi', 'Sara', 'Waleed', 'Lina',
    
    // European names
    'Lucas', 'Emma', 'Liam', 'Sophia', 'Noah', 'Isabella', 'Ethan', 'Olivia', 'Mason', 'Ava',
    'Oliver', 'Mia', 'Elijah', 'Charlotte', 'James', 'Amelia', 'Benjamin', 'Harper', 'Sebastian', 'Evelyn',
    'Henry', 'Abigail', 'Alexander', 'Emily', 'Jack', 'Elizabeth', 'Owen', 'Sofia', 'Daniel', 'Avery',
    'Jackson', 'Ella', 'Samuel', 'Madison', 'Nathan', 'Scarlett', 'Isaac', 'Victoria', 'Dylan', 'Aria',
    'Caleb', 'Grace', 'Ryan', 'Chloe', 'Adrian', 'Camila', 'Miles', 'Penelope', 'Leo', 'Layla',
    
    // African names
    'Kofi', 'Ama', 'Kwame', 'Abena', 'Kwesi', 'Akua', 'Kweku', 'Adwoa', 'Kwabena', 'Afua',
    'Kofi', 'Ama', 'Kwame', 'Abena', 'Kwesi', 'Akua', 'Kweku', 'Adwoa', 'Kwabena', 'Afua',
    'Zulu', 'Zara', 'Mande', 'Mariam', 'Swahili', 'Sana', 'Yoruba', 'Yara', 'Hausa', 'Hana',
    
    // Latin American names
    'Santiago', 'Sofia', 'Mateo', 'Isabella', 'Sebastian', 'Camila', 'Diego', 'Valentina', 'Nicolas', 'Valeria',
    'Alejandro', 'Mariana', 'Daniel', 'Gabriela', 'Carlos', 'Victoria', 'Javier', 'Luciana', 'Miguel', 'Ximena',
    'Adrian', 'Isabella', 'Jose', 'Sofia', 'David', 'Camila', 'Juan', 'Valentina', 'Luis', 'Valeria',
    'Fernando', 'Mariana', 'Roberto', 'Gabriela', 'Ricardo', 'Victoria', 'Eduardo', 'Luciana', 'Manuel', 'Ximena'
  ],
  
  lastNames: [
    // Western surnames
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
    'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
    'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
    'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
    'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts',
    
    // Indian surnames
    'Patel', 'Singh', 'Kumar', 'Sharma', 'Verma', 'Gupta', 'Malhotra', 'Kapoor', 'Reddy', 'Chopra',
    'Joshi', 'Yadav', 'Kaur', 'Rajput', 'Chauhan', 'Mehta', 'Shah', 'Tiwari', 'Bhatt', 'Desai',
    'Nair', 'Iyer', 'Menon', 'Pillai', 'Nambiar', 'Kurup', 'Warrier', 'Namboothiri', 'Thampi', 'Unni',
    'Krishnan', 'Raman', 'Subramanian', 'Venkatesh', 'Raghavan', 'Srinivasan', 'Ganesan', 'Balakrishnan', 'Muthuswamy', 'Perumal',
    
    // Asian surnames
    'Wang', 'Li', 'Zhang', 'Liu', 'Chen', 'Yang', 'Huang', 'Zhao', 'Wu', 'Zhou',
    'Sun', 'Ma', 'Zhu', 'Hu', 'Guo', 'Lin', 'He', 'Gao', 'Luo', 'Zheng',
    'Tanaka', 'Sato', 'Suzuki', 'Takahashi', 'Watanabe', 'Ito', 'Yamamoto', 'Nakamura', 'Kobayashi', 'Kato',
    'Yoshida', 'Yamada', 'Sasaki', 'Yamaguchi', 'Saito', 'Matsumoto', 'Inoue', 'Kimura', 'Hayashi', 'Shimizu',
    
    // Middle Eastern surnames
    'Al-Sayed', 'Hassan', 'Ali', 'Mahmoud', 'Ibrahim', 'Ahmed', 'Mohammed', 'Omar', 'Khalil', 'Rashid',
    'Karim', 'Samir', 'Nabil', 'Fadi', 'Waleed', 'Tariq', 'Yusuf', 'Zain', 'Rashid', 'Karim',
    'Al-Zahra', 'Fatima', 'Aisha', 'Zara', 'Layla', 'Noor', 'Mariam', 'Hana', 'Yasmin', 'Nadia',
    'Dalia', 'Rania', 'Sara', 'Lina', 'Leila', 'Amina', 'Noor', 'Zara', 'Layla', 'Hana',
    
    // European surnames
    'Muller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz', 'Hoffmann',
    'Schaffer', 'Koch', 'Bauer', 'Richter', 'Klein', 'Wolf', 'Schroder', 'Neumann', 'Schwarz', 'Zimmermann',
    'Braun', 'Kruger', 'Hofmann', 'Hartmann', 'Lange', 'Schmitt', 'Werner', 'Schmitz', 'Krause', 'Meier',
    'Lehmann', 'Schmid', 'Schulze', 'Maier', 'Kohler', 'Herrmann', 'Konig', 'Walter', 'Mayer', 'Huber',
    
    // African surnames
    'Diallo', 'Traore', 'Keita', 'Cisse', 'Konate', 'Sow', 'Ba', 'Diop', 'Fall', 'Ndiaye',
    'Gueye', 'Diagne', 'Mbaye', 'Sall', 'Thiam', 'Sy', 'Camara', 'Toure', 'Kone', 'Ouattara',
    'Zulu', 'Ndlovu', 'Mthembu', 'Dlamini', 'Nkosi', 'Mkhize', 'Buthelezi', 'Zuma', 'Mbeki', 'Mandela',
    
    // Latin American surnames
    'Garcia', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Perez', 'Sanchez', 'Ramirez', 'Torres',
    'Flores', 'Rivera', 'Morales', 'Cruz', 'Ortiz', 'Reyes', 'Moreno', 'Jimenez', 'Diaz', 'Romero',
    'Alvarez', 'Mendoza', 'Castillo', 'Vargas', 'Ramos', 'Ruiz', 'Castro', 'Molina', 'Herrera', 'Medina'
  ],
  
  adjectives: [
    'happy', 'clever', 'brave', 'wise', 'kind', 'smart', 'quick', 'bright', 'calm', 'cool',
    'friendly', 'gentle', 'honest', 'lucky', 'nice', 'quiet', 'shy', 'sweet', 'warm', 'young',
    'bold', 'creative', 'energetic', 'funny', 'generous', 'helpful', 'imaginative', 'joyful', 'loving', 'patient',
    'peaceful', 'polite', 'powerful', 'proud', 'respectful', 'responsible', 'sincere', 'thoughtful', 'trustworthy', 'understanding',
    'adventurous', 'ambitious', 'confident', 'courageous', 'determined', 'enthusiastic', 'faithful', 'graceful', 'humorous', 'independent',
    'intelligent', 'loyal', 'modest', 'optimistic', 'passionate', 'reliable', 'sensible', 'sociable', 'talented', 'witty'
  ]
}

// Generate a random human name
export function generateHumanName(): string {
  const firstName = nameData.firstNames[Math.floor(Math.random() * nameData.firstNames.length)]
  const lastName = nameData.lastNames[Math.floor(Math.random() * nameData.lastNames.length)]
  
  return `${firstName} ${lastName}`
}

// Generate a random first name
export function generateFirstName(): string {
  return nameData.firstNames[Math.floor(Math.random() * nameData.firstNames.length)]
}

// Generate a random last name
export function generateLastName(): string {
  return nameData.lastNames[Math.floor(Math.random() * nameData.lastNames.length)]
}

// Generate a random adjective
export function generateAdjective(): string {
  return nameData.adjectives[Math.floor(Math.random() * nameData.adjectives.length)]
}

// Generate a human-like email username
export function generateHumanLikeEmail(): string {
  const firstName = generateFirstName().toLowerCase()
  const lastName = generateLastName().toLowerCase()
  const adjective = generateAdjective()
  const number = Math.floor(Math.random() * 999) + 1
  
  // Randomly choose email format
  const formats = [
    `${firstName}${number}`,
    `${firstName}.${lastName}`,
    `${firstName}.${adjective}`,
    `${adjective}.${firstName}`,
    `${firstName}${adjective}${number}`,
    `${firstName}_${lastName}`,
    `${firstName}_${adjective}`,
    `${adjective}_${firstName}${number}`,
    `${firstName}${lastName}${number}`,
    `${firstName}.${lastName}${number}`
  ]
  
  return formats[Math.floor(Math.random() * formats.length)]
}

// Generate a professional email username
export function generateProfessionalEmail(): string {
  const firstName = generateFirstName().toLowerCase()
  const lastName = generateLastName().toLowerCase()
  const number = Math.floor(Math.random() * 999) + 1
  
  const formats = [
    `${firstName}.${lastName}`,
    `${firstName}${lastName}`,
    `${firstName}${lastName}${number}`,
    `${firstName[0]}${lastName}`,
    `${firstName[0]}.${lastName}`,
    `${firstName}${lastName[0]}${number}`
  ]
  
  return formats[Math.floor(Math.random() * formats.length)]
}

// Generate a casual email username
export function generateCasualEmail(): string {
  const firstName = generateFirstName().toLowerCase()
  const adjective = generateAdjective()
  const number = Math.floor(Math.random() * 999) + 1
  
  const formats = [
    `${firstName}${number}`,
    `${firstName}.${adjective}`,
    `${adjective}.${firstName}`,
    `${firstName}${adjective}${number}`,
    `${firstName}_${adjective}`,
    `${adjective}_${firstName}${number}`
  ]
  
  return formats[Math.floor(Math.random() * formats.length)]
} 
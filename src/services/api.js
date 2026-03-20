import { mockStudents, mockPredictions } from './mockData';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const studentAPI = {
  getAll: async () => {
    await delay(500);
    return { data: mockStudents };
  },
  
  getById: async (id) => {
    await delay(300);
    const student = mockStudents.find(s => s.id === id);
    if (!student) throw new Error('Student not found');
    return { data: student };
  }
};

export const predictionAPI = {
  predict: async (studentId) => {
    await delay(1000);
    const student = mockStudents.find(s => s.id === studentId);
    if (!student) throw new Error('Student not found');
    
    const prediction = {
      id: `PRED${Math.random().toString(36).substr(2, 9)}`,
      studentId: student.id,
      studentName: student.name,
      predictedGPA: (student.gpa + (Math.random() * 0.3 - 0.1)).toFixed(1),
      riskScore: Math.floor(Math.random() * 60),
      riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
      confidence: 0.85 + Math.random() * 0.1,
      predictionDate: new Date().toISOString(),
      keyFactors: [
        { factor: 'academic_performance', impact: 'positive', weight: 0.4 },
        { factor: 'practical_engagement', impact: 'positive', weight: 0.3 }
      ],
      recommendations: [
        { type: 'maintain', description: 'Continue current study habits', priority: 'low' }
      ]
    };
    return { data: prediction };
  },
  
  getRecent: async (limit = 10) => {
    await delay(500);
    return { data: mockPredictions.slice(0, limit) };
  }
};

export const groupAPI = {
  getAll: async () => {
    await delay(500);
    return { 
      data: {
        1: { size: 15, avgGPA: 3.6, color: "#4caf50" },
        2: { size: 12, avgGPA: 3.2, color: "#2196f3" },
        3: { size: 8, avgGPA: 2.8, color: "#ff9800" }
      }
    };
  }
};
  
  export interface CompanyFrequencyModel {
    companyId: number; // Maps to Long in Java
    frequencyAsked: number; // Maps to Integer in Java
    lastAskedDate: string | null; // Maps to LocalDateTime in Java, use ISO 8601 format
  }
  
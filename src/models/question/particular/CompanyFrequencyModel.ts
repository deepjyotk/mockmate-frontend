  
  export interface CompanyFrequencyModel {
    companyName: string; // Maps to String in Java
    companyId: number; // Maps to Long in Java
    frequencyAsked: number; // Maps to Integer in Java
    lastAskedDate: string | null; // Maps to LocalDateTime in Java, use ISO 8601 format
  }
  
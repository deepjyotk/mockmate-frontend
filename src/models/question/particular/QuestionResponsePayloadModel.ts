import { CompanyFrequencyModel } from "./CompanyFrequencyModel";

export interface QuestionResponsePayloadModel {
    questionId: number; // Maps to Long in Java
    questionS3Url: string; // Maps to String in Java
    questionTitle: string; // Maps to String in Java
    interviewTypeId: number; // Maps to Long in Java
    questionDifficultyId: number; // Maps to Long in Java
    tags: string[]; // Maps to List<String> in Java
    companies: CompanyFrequencyModel[]; // Maps to List<CompanyFrequencyDto> in Java
  }

import { SlotModel } from "./SlotModel";

export interface Interview {
    type: string;
    description: string;
    durationMinutes: number;
    slots: SlotModel[];
    "interview-id": number;
  }
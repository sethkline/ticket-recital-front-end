import type { Ticket } from './ticket';

// This interface is used to handle the top-level structure of each seat object in the response
export interface SeatResponse {
  id: number;
  attributes: SeatAttributes;
}

// This interface describes the attributes contained within each seat object
export interface SeatAttributes {
  number: string;
  row: "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V";
  is_available?: boolean;
  is_reserved?: boolean | null;
  ticket?: Ticket;
  handicap_access?: boolean | null; 
  group_id?: string | null; 
  section: "left-label" | "left-wing" | "left-main" | "center-main" | "right-main" | "right-wing" | "right-label";
  type: "regular" | "handicap" | "reserved";
  display_order?: number;
  reservation_timestamp?: Date | null; 
  createdAt: Date;
  updatedAt: Date;
}
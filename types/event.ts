import type { SeatResponse } from './seat';
import type { Video } from './video';
import type { Ticket } from './ticket';

export interface EventResponse {
  id: number;
  attributes: EventAttributes
}

export interface EventAttributes {
    title: string;
    description?: string;
    date: string; // Using string type for date and time as these can be parsed appropriately in the frontend
    time: string;
    location: string;
    seats: SeatResponse[];
    videos: Video[];
    tickets: Ticket[];
    ticket_sale_start?: Date;
    ticket_sale_end?: Date;
    advance_ticket_sale_start?: Date;
    ticket_price_in_cents: number;
    is_current_year: boolean;
}
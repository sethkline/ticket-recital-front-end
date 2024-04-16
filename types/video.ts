import type { Event } from './event';

export interface Video {
    id: number;
    event: Event;
    url: string;
    access_start_date?: Date;
}
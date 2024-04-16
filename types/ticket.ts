// Assuming the User, Seat, and Event interfaces are defined elsewhere
import type { User } from './user';  // This would be defined based on your user model
import type { Seat } from './seat';
import type { Event } from './event';

export interface Ticket {
    id: number;
    users_permissions_user: User;
    seat: Seat;
    event: Event;
    purchase_date: Date;
}

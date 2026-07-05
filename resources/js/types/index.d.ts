import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    venues?: Venue[];
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    isAdmin: boolean;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    wedding?: Wedding | null;
}
export type TaskStatus = 'pending' | 'in-progress' | 'complete';

export interface Task {
    id: number;
    title: string;
    status: TaskStatus | null;
    due_date: string | null;
}

export interface Venue {
    id?: number;
    name: string;
    minimum_capacity: number;
    maximum_capacity: number;
    minimum_table_amount: number;
    maximum_table_amount: number;
    menu_items?: MenuItem[];
    weddings?: Wedding[];
}

export interface VenueSummary {
    id: number;
    name: string;
    minimum_table_amount: number;
    maximum_table_amount: number;
}

export interface MenuItem {
    id: number;
    venue_id: number;
    name: string;
    description: string | null;
    is_plant_based: boolean;
}

export interface Wedding {

    id?: number;
    partnerA_firstname: string;
    partnerA_lastname: string;
    partnerB_firstname: string;
    partnerB_lastname: string;
    guests: Guest[];
    guest_count: number;
    date: string;
    venue_id: number;
    groupTemplates: boolean;
    venue?: Venue;
    menu_items?: MenuItem[];
    partnerA?: Guest;
    partnerB?: Guest;
}

export type GuestStatus = 'invited' | 'confirmed' | 'declined';
export interface Guest {
    id: number;
    name: string;
    wedding_id?: number;
    role?: string | null;
    menu_item_id: number | null;
    status: GuestStatus;
    notes: string | null;
    groups?: Group[];
}



export interface Group {
    id: number;
    name: string;
    ranking: number;
    description: string | null;
    wedding_id?: number;
    guests_count: number;
    colour: string;
    guests: Guest[];
}
export interface GuestConflict {
    id: number;
    guest_a_id: number;
    guest_b_id: number;
    conflict_reason: string | null;
    wedding_id?: number;
    guest_a?: Guest;
    guest_b?: Guest;
}

export interface BaseTable {
    id: string;
    name: string | '';
    x: number;
    y: number;
    rotation?: number;
    locked?: boolean;
}

export interface RoundTable extends BaseTable {
    type: 'round';
    seat_minimum: number;
    seat_maximum: number;
    seat_count: number;
}

export interface TopTable extends BaseTable {
    type: 'top';
    seats_per_side: number;
    width: number;
    height: number;
}
export type Table = RoundTable | TopTable;

// Table Allocation = {Table ID, (Guest ID, Seat Number/Index)}
export type Allocations = Record<string, Record<string, number | null>>;

export type VenueLayer = {
    id: number;
    name: string | null;
    table_data: Table[];
};


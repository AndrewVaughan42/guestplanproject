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
    [key: string]: unknown; // This allows for additional properties...
}

export interface Task {
    id: number;
    title: string;
    status: string | null;
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
    date: string;
    venue_id: number;
    groupTemplates: boolean;
}

export interface Guest {
    id?: number;
    name: string;
    wedding_id?: number;
    meal_choice: string | null;
    notes: string | null;
}
export interface Group {
    id: number;
    name: string;
    priority: number;
    description: string | null;
    wedding_id?: number;
    guests_count: number;
}
export interface GuestConflict {
    id: number;
    guest_a_id: number;
    guest_b_id: number;
    conflict_reason: string | null;
    wedding_id?: number;
}

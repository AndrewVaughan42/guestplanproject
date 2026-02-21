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
    [key: string]: unknown; // This allows for additional properties...
}

export interface Task {
    id?: number;
    title: string;
    status: string | null;
    due_date: string | null;
}

export interface Venue {
    id?: number;
    name: string;
    minimumCapacity: number;
    maximumCapacity: number;
    minimumTableAmount: number;
    maximumTableAmount: number;
}

export interface Wedding {
    id?: number;
    name: string;
    date: string;
    venue_id: number;
}

export interface Guest {
    id?: number;
    name: string;
    wedding_id?: number;
    mealChoice: string | null;
    notes: string | null;
}


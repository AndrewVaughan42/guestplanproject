import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
    dashboard,
} from '@/routes';
import { type NavItem, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    AngryIcon,
    ArmchairIcon,
    BookOpen,
    Folder,
    GroupIcon,
    LayoutGrid,
    ListTodo,
    PersonStandingIcon,

} from 'lucide-react';
import AppLogo from './app-logo';
import tasks from '@/routes/tasks';
import guests from '@/routes/guests';

import venues from '@/routes/venues';
import seatPlans from '@/routes/seat-plans';
import venueLayers from '@/routes/venue-layers';
import groups from '@/routes/groups';
import conflicts from '@/routes/conflicts';


const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
        icon: LayoutGrid,
    },
    {
        title: 'Guests',
        href: guests.index().url,
        icon: PersonStandingIcon,
    },
    {
        title: 'Seating Groups',
        href: groups.index().url,
        icon: GroupIcon,
    },
    {
        title: 'Guest Conflicts',
        href: conflicts.index().url,
        icon: AngryIcon,
    },
    {
        title: 'SeatPlan',
        href: seatPlans.index().url,
        icon: ArmchairIcon,
    },
    {
        title: 'Tasks',
        href: tasks.index().url,
        icon: ListTodo,
    },
];
const adminNavItems: NavItem[] = [
    {
        title: 'Venue Manager',
        href: venues.index().url,
        icon: LayoutGrid,
    },
    {
        title: 'Layout Editor',
        href: venueLayers.index().url,
        icon: LayoutGrid,
    },
];

const allNavItems: NavItem[] = [...mainNavItems, ...adminNavItems];
//Remove when no longer needed
const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const isAdmin = auth.user.isAdmin;

    const items = isAdmin ? allNavItems : mainNavItems;
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard().url} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={items} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

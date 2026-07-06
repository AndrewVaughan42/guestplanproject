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
import adminWeddings from '@/routes/admin-weddings';


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
        title: 'Dashboard',
        href: dashboard().url,
        icon: LayoutGrid,
    },
    {
        title: 'Wedding Summaries',
        href: adminWeddings.index().url,
        icon: LayoutGrid,
    },
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
    {
        title: 'Tasks',
        href: tasks.index().url,
        icon: ListTodo,
    },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const isAdmin = auth.user.isAdmin;
    // dynamic sidebar
    const items = isAdmin ? adminNavItems : mainNavItems;
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
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

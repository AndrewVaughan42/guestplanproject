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
    guestManager,
    layoutEditor,
    seatPlan,
    venueManager,
} from '@/routes';
import { type NavItem, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    FileUser,
    Folder,
    LayoutGrid,
    ListTodo,
    Wine,
} from 'lucide-react';
import AppLogo from './app-logo';
import tasks from '@/routes/tasks';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
        icon: LayoutGrid,
    },
    {
        title: 'Guest Manager',
        href: guestManager().url,
        icon: FileUser,
    },
    {
        title: 'My SeatPlan',
        href: seatPlan().url,
        icon: Wine,
    },
    {
        title: 'Task List',
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
        title: 'Venue Manager',
        href: venueManager().url,
        icon: LayoutGrid,
    },
    {
        title: 'Layout Editor',
        href: layoutEditor().url,
        icon: LayoutGrid,
    },
    {
        title: 'Task List',
        href: tasks.index().url,
        icon: ListTodo,
    },
];

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
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

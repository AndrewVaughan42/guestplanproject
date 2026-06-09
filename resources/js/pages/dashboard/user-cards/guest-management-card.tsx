import { usePage } from '@inertiajs/react';
import { SharedData } from 'resources/js/types';
import { DashCard } from '@/pages/dashboard/dash-card';


export default function GuestManagementCard() {
    const { auth } = usePage<SharedData>().props;
    const  weddingMenuItems = auth.user.wedding?.menu_items;


    if (!weddingMenuItems) {
        return (
            <DashCard title={"Guests"} content={<p>Start entering guest details</p>}/>
        );
    } else {
        return (
            <DashCard title={"Guest Management"} content={<p>TODO</p>}/>
        )
    }
}

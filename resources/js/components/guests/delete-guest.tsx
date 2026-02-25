import guests from '@/routes/guests';
import { router } from '@inertiajs/react';

export default function DeleteGuest(id: number | undefined) {
    if (!id) {
        return;
    }
    if (confirm('Are you sure you want to delete this guest?')) {
        router.delete(guests.destroy(id).url);
    }
}

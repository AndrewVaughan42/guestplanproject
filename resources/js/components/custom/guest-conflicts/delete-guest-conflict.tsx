import { router } from '@inertiajs/react';
import conflicts from '@/routes/conflicts';

export default function DeleteGuestConflict(id: number | undefined) {
    if (!id) {
        return;
    }
    if (confirm('Are you sure you want to delete this group?')) {
        router.delete(conflicts.destroy(id).url);
    }
}

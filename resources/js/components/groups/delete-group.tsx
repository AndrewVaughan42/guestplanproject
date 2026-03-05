import groups from '@/routes/groups';
import { router } from '@inertiajs/react';

export default function DeleteGroup(id: number | undefined) {
    if (!id) {
        return;
    }
    if (confirm('Are you sure you want to delete this group?')) {
        router.delete(groups.destroy(id).url);
    }
}

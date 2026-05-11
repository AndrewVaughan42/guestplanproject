
import { router } from '@inertiajs/react';
import tasks from '@/routes/tasks';

export default function deleteTask(id: number | undefined) {
    if (!id) {
        return;
    }
    if (confirm('Are you sure you want to delete this task?')) {
        router.delete(tasks.destroy(id).url);
    }
}

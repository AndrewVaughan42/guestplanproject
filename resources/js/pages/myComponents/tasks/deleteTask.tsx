import tasks from '@/routes/tasks';
import { router } from '@inertiajs/react';

export default function deleteTask(id: number) {
    if (confirm('Are you sure you want to delete this task?')) {
        router.delete(tasks.destroy(id).url);
    }
}

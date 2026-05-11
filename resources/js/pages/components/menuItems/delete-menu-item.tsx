import { router } from '@inertiajs/react';
import menuItems from '@/routes/menu-items';


export default function DeleteMenuItem(id: number | undefined) {
    if (!id) {
        return;
    }
    if (confirm('Are you sure you want to delete this menu item?')) {
        router.delete(menuItems.destroy(id).url);
    }
}

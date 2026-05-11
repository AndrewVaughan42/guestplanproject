import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function FlashMessage() {
    const { flash } = usePage().props;
    const flashMsg = flash as { type?: string; message?: string } | undefined;
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        if (flashMsg?.message) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setShowAlert(true);

            const timer = setTimeout(() => {
                setShowAlert(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [flashMsg]);

    if (!showAlert || !flashMsg?.message) {
        return null;
    }
    return (
        <div className="fixed top-6 left-1/2 z-50 w-full max-w-md -translate-x-1/2 px-4">
            <Alert
                variant={
                    flashMsg.type === 'success' ? 'default' : 'destructive'
                }
            >
                <AlertTitle>
                    {flashMsg.type === 'success' ? 'Success' : 'Notice'}
                </AlertTitle>
                <AlertDescription>{flashMsg.message}</AlertDescription>
            </Alert>
        </div>
    );
}


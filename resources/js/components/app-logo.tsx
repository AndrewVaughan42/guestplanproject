
export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center overflow-hidden rounded-md bg-transparent text-guestplan-foreground">
                <img
                    src="/images/Oldwalls-Collection-Icon.png"
                    alt="logo"
                    className="size-full object-contain"
                />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold text-guestplan">
                    GuestPlan
                </span>
            </div>
        </>
    );
}

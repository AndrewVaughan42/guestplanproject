import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full max-w-83.75 text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log in
                                </Link>
                                {canRegister && (
                                    <Link
                                        href={register()}
                                        className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                    >
                                        Register
                                    </Link>
                                )}
                            </>
                        )}
                    </nav>
                </header>

                <div className="mx-auto flex w-full max-w-5xl flex-1 items-center justify-center">
                    <div className="flex flex-col items-center text-center">
                        {/* Logo */}
                        <div className="mb-6 flex items-center justify-center">
                            <img
                                alt="Oldwalls Collection"
                                src="/images/logo-text-black.png"
                                className="h-40 dark:hidden"
                            />

                            <img
                                alt="Oldwalls Collection"
                                src="/images/logo-text-white.png"
                                className="hidden h-30 dark:block"
                            />
                        </div>

                        <h1 className="text-5xl font-semibold tracking-tight text-neutral-900 sm:text-7xl dark:text-white">
                            GuestPlan
                        </h1>

                        <p className="mt-4 text-xl font-light tracking-wide text-guestplan">
                            A Plan For Your Guests
                        </p>

                        <div className="mt-6 inline-flex items-center rounded-full border border-neutral-200 px-4 py-1 text-xs tracking-widest text-neutral-500 uppercase dark:border-neutral-800 dark:text-neutral-400">
                            Exclusively for Oldwalls Collection Venues
                        </div>

                        <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-neutral-500 dark:text-neutral-400">
                            Manage your guest list, organise groups, build your
                            seating plan, coordinate meals, and prepare for
                            your wedding day from one simple to use
                            platform.
                        </p>

                    </div>
                </div>

                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}

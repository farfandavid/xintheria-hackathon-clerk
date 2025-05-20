import { theme } from "@/stores/themeStore";
import { SignIn, SignUp } from "@clerk/astro/react";
import { dark } from "@clerk/themes";
import { useStore } from "@nanostores/react";

interface ClerkFormProps {
    type: 'signin' | 'signup';
}

export function ClerkForm({ type }: ClerkFormProps) {
    const $theme = useStore(theme)
    if (type === 'signup') {
        return (
            <div className="flex justify-center items-center h-dvh">
                <SignUp
                    forceRedirectUrl="/app"
                    signInForceRedirectUrl="/signin"
                    appearance={{
                        baseTheme: $theme !== 'light' ? dark : undefined,
                    }}
                />
            </div>
        )
    }
    return (
        <div className="flex justify-center items-center h-dvh">
            <SignIn
                fallbackRedirectUrl={'/app'}
                appearance={{
                    baseTheme: $theme !== 'light' ? dark : undefined,
                }}
            />
        </div>
    )
}
// libs/useOnboarding.ts
import { useEffect, useState } from "react";
import { auth, db } from "@/app/lib/config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export function useOnboarding() {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkOnboarding = async () => {
        const user = auth.currentUser;

        if (!user) {
            // No user, stay on welcome
            setLoading(false);
            return;
        }

        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            const userData = userDoc.data();

            if (userData?.onboardingCompleted) {
            // Already completed, go to home
            router.replace("/home");
            } else {
            // Not completed, stay on welcome
            setLoading(false);
            }
        } catch (error) {
            console.error("Error checking onboarding:", error);
            setLoading(false);
        }
        };

        checkOnboarding();
    }, [router]);

    return { loading };
}

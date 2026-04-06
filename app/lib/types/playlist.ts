import { db } from "../config/firebase";
import {
    collection,
    addDoc,
    serverTimestamp,
    deleteDoc,
    query,
    orderBy,
    onSnapshot,
    doc,
    updateDoc,
    arrayUnion,
    arrayRemove,
} from "firebase/firestore";

export interface PlaylistItem {
    id: string;
    title: string;
    imageUrl: string;
    category: string;
    link: string;
    addedAt: any;
}

// Realtime listener for user's playlist
export function subscribePlaylist(
    userId: string,
    callback: (items: PlaylistItem[]) => void
) {
    const userDocRef = doc(db, "users", userId);

    return onSnapshot(userDocRef, (snapshot) => {
        const data = snapshot.data();
        const items = (data?.playlist || []) as PlaylistItem[];
        callback(items);
    });
}

// Add item to user's playlist
export async function addToPlaylist(userId: string, item: Omit<PlaylistItem, "id" | "addedAt">) {
    const userDocRef = doc(db, "users", userId);
    const newItem = {
        ...item,
        id: Date.now().toString(), // Generate a simple ID
        addedAt: serverTimestamp(),
    };
    
    return updateDoc(userDocRef, {
        playlist: arrayUnion(newItem),
    });
}

// Remove item from user's playlist
export async function removeFromPlaylist(userId: string, itemId: string) {
    const userDocRef = doc(db, "users", userId);
    const snapshot = await (await import('firebase/firestore')).getDoc(userDocRef);
    const items = snapshot.data()?.playlist || [];
    const itemToRemove = items.find((item: any) => item.id === itemId);
    
    if (itemToRemove) {
        return updateDoc(userDocRef, {
            playlist: arrayRemove(itemToRemove),
        });
    }
}

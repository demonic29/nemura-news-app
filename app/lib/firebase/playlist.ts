import { db } from "./firebase";
import {
    collection,
    addDoc,
    serverTimestamp,
    deleteDoc,
    query,
    orderBy,
    onSnapshot,
    doc,
} from "firebase/firestore";

export interface PlaylistItem {
    id: string;
    title: string;
    imageUrl: string;
    category: string;
    link: string;
    addedAt: any;
}

// Realtime listener
export function subscribePlaylist(
    callback: (items: PlaylistItem[]) => void
) {
    const q = query(collection(db, "playlist"), orderBy("addedAt", "desc"));

    return onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as PlaylistItem)
        );
        callback(items);
    });
}

// Add item
export async function addToPlaylist(item: Omit<PlaylistItem, "id">) {
    return addDoc(collection(db, "playlist"), {
        ...item,
        addedAt: serverTimestamp(),
    });
}

// Remove item
export async function removeFromPlaylist(id: string) {
    return deleteDoc(doc(db, "playlist", id));
}

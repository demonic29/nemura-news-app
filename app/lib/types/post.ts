export interface Post {
    id: string,
    title: string,
    desc: string,
    image: string,
    category: string,
    play: () => void,
}

export async function getPosts(){
    const fetchNews = await fetch('/api/hatena');
    const fetchJson = await fetchNews.json();
    
}


export type HatenaItem = {
    title?: string;
    link?: string;
    desc?: string;
    "hatena:imageurl"?: string;
    "dc:subject"?: string | string[];
};

getPosts();
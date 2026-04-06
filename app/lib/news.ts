export type HatenaNewsItem = {
  id?: string;
  title: string;
  link?: string;
  description?: string;
  body?: string;
  summary?: string;
  author?: string;
  creator?: string;
  "hatena:imageurl"?: string;
  "hatena:bookmarkcount"?: string | number;
  "dc:creator"?: string | string[];
  "dc:subject"?: string | string[];
  "dc:date"?: string;
};

export function getHatenaNewsDate(item: HatenaNewsItem): Date | null {
  const dateStr = item["dc:date"];
  if (!dateStr) return null;

  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
}

export function getHatenaNewsDescription(item: HatenaNewsItem): string {
  return item.description ?? item.body ?? item.summary ?? "";
}

export function getHatenaNewsSubject(item: HatenaNewsItem): string {
  const subject = item["dc:subject"];

  if (Array.isArray(subject)) {
    return subject[1] ?? subject[0] ?? "未分類";
  }

  return subject ?? "未分類";
}

export function getHatenaNewsAuthor(item: HatenaNewsItem): string | null {
  const author = item["dc:creator"] ?? item.author ?? item.creator;

  if (Array.isArray(author)) {
    return author[0] ?? null;
  }

  return author ?? null;
}

export function getHatenaBookmarkCount(item: HatenaNewsItem): number | null {
  const rawCount = item["hatena:bookmarkcount"];

  if (typeof rawCount === "number" && Number.isFinite(rawCount)) {
    return rawCount;
  }

  if (typeof rawCount === "string") {
    const parsedCount = Number.parseInt(rawCount.replace(/,/g, ""), 10);
    return Number.isNaN(parsedCount) ? null : parsedCount;
  }

  return null;
}

export function getHatenaNewsTags(item: HatenaNewsItem): string[] {
  const subject = item["dc:subject"];

  if (Array.isArray(subject)) {
    return subject.filter(
      (tag): tag is string => typeof tag === "string" && tag.trim().length > 0,
    );
  }

  if (typeof subject === "string" && subject.trim().length > 0) {
    return [subject];
  }

  return [];
}

export function getHatenaSourceName(item: HatenaNewsItem): string {
  if (!item.link) return "unknown source";

  try {
    return new URL(item.link).hostname.replace(/^www\./, "");
  } catch {
    return "unknown source";
  }
}

export function getHatenaSourceIconUrl(item: HatenaNewsItem): string | null {
  if (!item.link) return null;

  return `https://cdn-ak2.favicon.st-hatena.com/64?url=${encodeURIComponent(item.link)}`;
}

export function getHatenaNewsId(item: HatenaNewsItem, index: number): string {
  return item.id ?? item.link ?? item.title ?? `idx-${index}`;
}

export function estimateReadingDurationSeconds(
  title: string,
  description: string,
): number {
  const totalCharacters = `${title}${description}`.length;
  return Math.ceil((totalCharacters / 3 / 110) * 60);
}

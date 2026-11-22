/**
 * Presentational-only mapping from an event id (src/data/events.ts) to
 * a pixel-art category icon. Lives outside src/data/ on purpose: it
 * doesn't change any event content or logic, just which small badge
 * EventCard shows. Unknown ids (e.g. a new event added later) fall
 * back to a generic icon instead of breaking.
 */
const CATEGORY_ICON: Record<string, string> = {
  "rent-renewal": "housing",
  "grocery-run": "food",
  "transit-choice": "transit",
  "flat-tire": "transit",
  "tax-refund": "work",
  "friend-birthday": "social",
  "cracked-screen": "work",
  "dental-checkup": "medical",
  "weekend-gig": "work",
  "hours-cut": "work",
  "family-needs-help": "social",
  "urgent-care-bill": "medical",
};

const FALLBACK_ICON = "housing";

export function eventCategoryIconPath(eventId: string): string {
  const category = CATEGORY_ICON[eventId] ?? FALLBACK_ICON;
  return `/assets/pixel/ui/event_${category}.png`;
}

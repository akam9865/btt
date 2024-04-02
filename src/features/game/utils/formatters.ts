import { formatDistanceToNow } from "date-fns";

export function formatTimeSince(date?: Date): string {
  if (!date) return "";
  return formatDistanceToNow(date, { addSuffix: true }).replace("about ", "");
}

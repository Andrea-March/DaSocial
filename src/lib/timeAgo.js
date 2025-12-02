export function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();

  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "Ora";
  if (diffMin < 60) return `${diffMin} min fa`;
  if (diffHr < 24) return `${diffHr} h fa`;
  if (diffDay === 1) return "Ieri";
  if (diffDay < 7) return `${diffDay} giorni fa`;

  // oltre 7 giorni → formato data breve
  return date.toLocaleDateString("it-IT", {
    day: "numeric",
    month: "short",
  });
}
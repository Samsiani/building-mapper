/**
 * Simple fuzzy search for command palette
 */
export function fuzzyMatch(query, text) {
  if (!query) return true;
  const q = query.toLowerCase();
  const t = text.toLowerCase();

  // Exact substring
  if (t.includes(q)) return true;

  // Character-by-character fuzzy match
  let qi = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) qi++;
  }
  return qi === q.length;
}

export function fuzzyScore(query, text) {
  if (!query) return 1;
  const q = query.toLowerCase();
  const t = text.toLowerCase();

  // Exact start match = highest
  if (t.startsWith(q)) return 3;
  // Contains = high
  if (t.includes(q)) return 2;
  // Fuzzy = low
  if (fuzzyMatch(query, text)) return 1;
  return 0;
}

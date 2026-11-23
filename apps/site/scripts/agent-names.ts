export interface Named {
  actions: string[];
  component: string;
  label: string;
  row?: string;
}

// ui-sdk doesn't export its matcher, so agent-names.test.tsx pins this copy to it.
export const fold = (text: string) =>
  text
    .replaceAll(/[ßẞ]/gu, "ss")
    .normalize("NFKD")
    .replaceAll(/\p{M}/gu, "")
    .toLowerCase();
const wordsOf = (text: string) =>
  ` ${fold(text)} `.replaceAll(/[^\p{L}\p{N}]+/gu, " ");
export const addressOf = ({ label, row }: Named) =>
  [label, row].filter(Boolean).join(" ");
const addressFinds = (entry: Named, other: Named) =>
  fold(other.label) === fold(addressOf(entry)) ||
  (wordsOf(addressOf(entry)).trim() !== "" &&
    wordsOf(addressOf(other)).includes(wordsOf(addressOf(entry))));
const triggerAndPopup = (entry: Named, other: Named) =>
  (entry.component === "button") !== (other.component === "button") &&
  fold(entry.label) === fold(other.label);
const sameAction = (entry: Named, other: Named) =>
  !triggerAndPopup(entry, other) &&
  entry.actions.some((action) => other.actions.includes(action));

export function ambiguousIn(named: Named[]) {
  const same = Object.values(
    Object.groupBy(named, (entry) => fold(addressOf(entry)))
  ).flatMap((group = []) =>
    group.some((entry) =>
      group.some((other) => other !== entry && sameAction(entry, other))
    )
      ? [`"${addressOf(group[0])}"×${group.length}`]
      : []
  );
  const inside = named.flatMap((entry) =>
    named
      .filter(
        (other) =>
          fold(addressOf(other)) !== fold(addressOf(entry)) &&
          addressFinds(entry, other) &&
          sameAction(entry, other)
      )
      .map((other) => `"${addressOf(entry)}" in "${addressOf(other)}"`)
  );
  return [...same, ...new Set(inside)];
}

import { definePageRule, folderSections } from "../shared.ts";

export const sectionFolder = definePageRule({
  description: "A component's section matches the folder its file lives in.",
  check: ({ folder, section }) =>
    folder && folderSections[folder] !== section
      ? [
          `Set section to ${folderSections[folder] ?? "nothing"}: the component lives in components/${folder}.`,
        ]
      : [],
});

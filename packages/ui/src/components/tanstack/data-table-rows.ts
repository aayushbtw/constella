"use client";

import {
  createChange,
  createFocusRecovery,
  createRovingFocus,
  createSelection,
  definePrimitive,
} from "@ui-sdk/core";
import type { ChangeDetails, TypesOf } from "@ui-sdk/core";
import { createContext } from "react";

type DataTableSelectionReason = "item-press" | "list-navigation";

interface DataTableOptions {
  ids: string[];
  multiple: (id: string) => boolean;
  onRowOpen?: (id: string) => void;
  onSelectedChange: (
    selected: string[],
    details: ChangeDetails<DataTableSelectionReason>
  ) => void;
  selectable?: (id: string) => boolean;
  selected: string[];
}

interface DataTableState {
  focused: string | null;
  selected: string[];
}

interface DataTableRowProps {
  index: number;
  value: string;
}

const controlsWithOwnClick =
  "a, button, input, label, select, textarea, [role='button'], [role='checkbox'], [role='switch']";

const indexAfter = (key: string, index: number, last: number) => {
  switch (key) {
    case "ArrowDown": {
      return Math.min(index + 1, last);
    }
    case "ArrowUp": {
      return Math.max(index - 1, 0);
    }
    case "End": {
      return last;
    }
    case "Home": {
      return 0;
    }
    default: {
      return null;
    }
  }
};

const dataTable = definePrimitive({
  name: "data-table",
  options: {
    ids: "list",
    multiple: "value",
    onRowOpen: "callback",
    onSelectedChange: "callback",
    selectable: "value",
    selected: "list",
  },
  state: (options: DataTableOptions): DataTableState => ({
    focused: null,
    selected: options.selected,
  }),
  sync: (options) => ({ selected: options.selected }),
  api: (context) => {
    const canSelect = (id: string) =>
      context.options().selectable?.(id) ?? false;
    const roving = createRovingFocus<DataTableState, DataTableRowProps>(
      context,
      {
        key: "focused",
        // Over every id, so End reaches a row the virtualizer hasn't rendered.
        move: (event, { from }) => {
          const { ids } = context.options();
          const to = indexAfter(event.key, from.props.index, ids.length - 1);
          return to === null ? undefined : (ids[to] ?? from.key);
        },
        slot: "row",
      }
    );
    const recovery = createFocusRecovery<DataTableRowProps>({
      fallback: ({ props }) => {
        const { ids } = context.options();
        const id = ids[Math.min(props.index, ids.length - 1)];
        return (
          (id === undefined ? undefined : context.element("row", id)) ??
          context.element("root")
        );
      },
    });
    const canMultiSelect = (id: string) => context.options().multiple(id);
    const change = createChange(context);
    // TanStack's ranges skip a row it won't select alongside others.
    const rangeSelectable = (id: string) => canSelect(id) && canMultiSelect(id);
    const list = createSelection(context, {
      key: "selected",
      multiple: () => true,
      order: () => context.options().ids,
      selectable: rangeSelectable,
      set: (value, details) => change("selected", value, details),
    });
    // Matches TanStack's `enableMultiRowSelection`, where such a row replaces the selection and a range from or to it toggles it alone.
    const selection = {
      anchor: list.anchor,
      extend(id: string, why: Parameters<typeof list.extend>[1]) {
        const start = list.anchor() ?? why.from ?? null;
        if (canMultiSelect(id) && (start === null || canMultiSelect(start))) {
          list.extend(id, why);
        } else {
          selection.toggle(id, why);
        }
      },
      setAnchor: list.setAnchor,
      toggle(id: string, why: Parameters<typeof list.toggle>[1]) {
        if (canMultiSelect(id)) {
          list.toggle(id, why);
          return;
        }
        if (!canSelect(id)) {
          return;
        }
        const { selected } = context.store.get();
        change(
          "selected",
          selected.includes(id) ? selected.filter((key) => key !== id) : [id],
          why
        );
      },
      unselectRange(id: string, why: Parameters<typeof list.extend>[1]) {
        const start = list.anchor() ?? why.from ?? null;
        if (start === null || !canMultiSelect(id) || !canMultiSelect(start)) {
          selection.toggle(id, why);
          return;
        }
        const { ids } = context.options();
        const ends = [ids.indexOf(start), ids.indexOf(id)];
        const range = new Set(
          ids
            .slice(Math.min(...ends), Math.max(...ends) + 1)
            .filter(rangeSelectable)
        );
        const next = context.store
          .get()
          .selected.filter((key) => !range.has(key));
        change("selected", next, why);
      },
    };
    return {
      canSelect,
      interactive: () =>
        context.options().selectable !== undefined ||
        context.options().onRowOpen !== undefined,
      multiselectable: () =>
        context.options().selectable !== undefined &&
        context.options().ids.some(canMultiSelect),
      recovery,
      roving,
      rowClick(event: MouseEvent, el: HTMLElement, id: string) {
        const { onRowOpen } = context.options();
        const { target } = event;
        if (
          onRowOpen === undefined ||
          !(target instanceof Element) ||
          // A click in a popup opened from the row reaches it through React, not the page.
          !el.contains(target) ||
          target.closest(controlsWithOwnClick) !== null
        ) {
          return;
        }
        if (
          (event.metaKey || event.ctrlKey || event.shiftKey) &&
          canSelect(id)
        ) {
          // Shift-click also extends the page's text selection.
          getSelection()?.removeAllRanges();
          if (event.shiftKey) {
            selection.extend(id, { event, from: null, reason: "item-press" });
          } else {
            selection.toggle(id, { event, reason: "item-press" });
          }
          return;
        }
        if (getSelection()?.isCollapsed === false) {
          return;
        }
        onRowOpen(id);
      },
      // Runs before the press moves focus, so a Shift-click ranges from a row Tab reached, which never set the anchor.
      rowPointerdown(event: PointerEvent) {
        const { focused } = context.store.get();
        if (
          !event.shiftKey ||
          focused === null ||
          selection.anchor() !== null ||
          roving
            .items()
            .find((item) => item.key === focused)
            ?.el.contains(document.activeElement) !== true
        ) {
          return;
        }
        selection.setAnchor(focused);
      },
      rowKeydown(event: KeyboardEvent, el: HTMLElement, id: string) {
        if (event.target !== el) {
          return;
        }
        const { onRowOpen } = context.options();
        if ((event.key === "x" || event.key === " ") && canSelect(id)) {
          event.preventDefault();
          selection.toggle(id, { event, reason: "item-press" });
          return;
        }
        if (event.key === "Enter" && onRowOpen !== undefined) {
          event.preventDefault();
          onRowOpen(id);
          return;
        }
        const moved = roving.keydown(event, el);
        if (moved === undefined) {
          return;
        }
        if (!moved.shift) {
          selection.setAnchor(moved.key);
        } else if (moved.key !== moved.from) {
          selection.extend(moved.key, {
            event,
            from: moved.from,
            reason: "list-navigation",
          });
        }
      },
      selection,
    };
  },
  slots: (slot) => ({
    root: slot({
      attrs: (_state, { api }) => ({
        "aria-multiselectable": api.multiselectable() ? "true" : undefined,
      }),
      keys: { none: "Each row's keydown moves the focus." },
      role: (_state, { api }) => (api.interactive() ? "grid" : undefined),
      roles: ["grid"],
    }),
    row: slot<DataTableRowProps>({
      attrs: (state, part) => {
        const selected = state.selected.includes(part.key);
        return {
          "aria-selected": part.api.canSelect(part.key)
            ? String(selected)
            : undefined,
          "data-state": selected ? "selected" : undefined,
          tabindex: part.api.interactive()
            ? part.api.roving.tabIndex(state, part)
            : undefined,
        };
      },
      bind: (el, part) => {
        const unbindFocus = part.api.roving.bind(el, part);
        const unbindRecovery = part.api.recovery.bind(el, part);
        return () => {
          unbindFocus();
          unbindRecovery();
        };
      },
      on: {
        click: (event, { api, el, key }) => {
          if (el !== undefined) {
            api.rowClick(event, el, key);
          }
        },
        keydown: (event, { api, el, key }) => {
          if (el !== undefined) {
            api.rowKeydown(event, el, key);
          }
        },
        pointerdown: (event, { api }) => {
          api.rowPointerdown(event);
        },
      },
      props: { index: "number", value: "string" },
      role: (_state, { api }) => (api.interactive() ? "row" : undefined),
      roles: ["row"],
    }),
  }),
});

type DataTableApi = TypesOf<typeof dataTable>["api"];

const DataTableContext = createContext<DataTableApi | null>(null);

export { DataTableContext, dataTable };

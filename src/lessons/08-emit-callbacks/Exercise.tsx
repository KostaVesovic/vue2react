import { useState } from "react";

// EXERCISE — build a <Tag /> component that emits two events:
//   - onSelect(tag: string) when clicked
//   - onRemove(tag: string) when the × button is clicked
//
// The parent tracks which tag is `selected` and removes tags from a list.
//
// 1. Type TagProps with label, selected, onSelect, onRemove.
// 2. Render the label and an × button. Clicking the body calls onSelect;
//    clicking × calls onRemove. Make sure × does NOT also trigger onSelect!
//    (Hint: e.stopPropagation)

interface TagProps {
  // TODO 1
}

function Tag(_: TagProps) {
  // TODO 2
  return <span>TODO</span>;
}

export default function Exercise() {
  const [tags, setTags] = useState(["react", "vue", "svelte", "solid"]);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div>
      <p>selected: {selected ?? "(none)"}</p>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {tags.map((t) => (
          <Tag
            key={t}
            /* TODO: wire up props */
          />
        ))}
      </div>
    </div>
  );
}

import { useState } from "react";

interface TagProps {
  label: string;
  selected: boolean;
  onSelect: (label: string) => void;
  onRemove: (label: string) => void;
}

function Tag({ label, selected, onSelect, onRemove }: TagProps) {
  return (
    <span
      onClick={() => onSelect(label)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        borderRadius: 999,
        border: `1px solid ${selected ? "#7aa2f7" : "#262a35"}`,
        background: selected ? "#7aa2f733" : "transparent",
        cursor: "pointer",
      }}
    >
      {label}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(label);
        }}
        style={{ padding: "0 4px", lineHeight: 1 }}
      >
        ×
      </button>
    </span>
  );
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
            label={t}
            selected={selected === t}
            onSelect={setSelected}
            onRemove={(label) => {
              setTags((prev) => prev.filter((tag) => tag !== label));
              if (selected === label) setSelected(null);
            }}
          />
        ))}
      </div>
    </div>
  );
}

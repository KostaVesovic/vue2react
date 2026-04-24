export default function Demo() {
  const name = "React";
  const items = ["props", "state", "effects"];
  const isPrimary = true;

  return (
    <div>
      <h3 className={isPrimary ? "primary" : "secondary"}>
        Hello from {name}!
      </h3>

      {/* expressions go in {}, not {{ }} like Vue */}
      <p>2 + 2 = {2 + 2}</p>

      {/* style is an object, not a string */}
      <p style={{ color: "#7aa2f7", fontWeight: 600 }}>
        camelCased CSS keys, not kebab-case.
      </p>

      {/* no v-for — you map over an array */}
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      {/* no template wrapper — but you can use a Fragment */}
      <>
        <small>Fragments let you return sibling nodes.</small>
      </>
    </div>
  );
}

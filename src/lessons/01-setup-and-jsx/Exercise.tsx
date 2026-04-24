// EXERCISE
// 1. Rename the `class` attribute to the React equivalent.
// 2. Fix the inline style — it should be a JS object with camelCase keys.
// 3. Render the `fruits` array as a <ul> of <li> items (add proper keys).
// 4. Only show the "VIP" badge when `isVip` is true.
//
// If you see a red error overlay, read it — React errors are very readable.

export default function Exercise() {
  const user = { name: "Ada", isVip: true };
  const fruits = ["apple", "banana", "cherry"];

  return (
    <div>
      {/* TODO 1: class -> ? */}
      <h3 /* class="title" */>User: {user.name}</h3>

      {/* TODO 2: fix the style — currently invalid JSX */}
      {/* <p style="color: orange; font-weight: bold;">styled text</p> */}
      <p>styled text</p>

      {/* TODO 3: render the fruits list here */}

      {/* TODO 4: conditionally render a <span>VIP</span> badge */}
    </div>
  );
}

export default function Exercise() {
  const user = { name: "Ada", isVip: true };
  const fruits = ["apple", "banana", "cherry"];

  return (
    <div>
      <h3 className="title">User: {user.name}</h3>

      <p style={{ color: "orange", fontWeight: "bold" }}>styled text</p>

      <ul>
        {fruits.map((fruit) => (
          <li key={fruit}>{fruit}</li>
        ))}
      </ul>

      {user.isVip && <span>VIP</span>}
    </div>
  );
}

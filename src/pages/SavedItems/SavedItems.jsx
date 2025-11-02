import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

function SavedItems() {
  const { user } = useSelector((state) => state.auth);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (user?.email) {
      const saved = JSON.parse(localStorage.getItem("savedItems")) || {};

      console.log("🟢 Current User Email:", user.email);
      console.log("🟡 All Saved Items in LocalStorage:", saved);
      console.log("🔵 Items for This User:", saved[user.email]);
      setItems(saved[user.email] || []);
    }
  }, [user]);

  return (
    <div>
      <h2>Saved Items</h2>
      {items.length === 0 ? (
        <p>No saved items yet.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SavedItems;

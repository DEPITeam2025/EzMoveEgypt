import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const SaveButton = ({ item }) => {
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  // تحقق من وجود الرحلة محفوظة **بعد ما item يتغير**
  useEffect(() => {
    if (!user || !item) {
      setSaved(false);
      return;
    }
    const userKey = `savedItems-${user.uid}`;
    const savedItems = JSON.parse(localStorage.getItem(userKey)) || [];
    setSaved(savedItems.some((i) => i.id === item.id));
  }, [user, item]);

  const handleToggleSave = () => {
    if (!token) {
      alert("Please login to save items.");
      navigate("/auth/login");
      return;
    }
    if (!item) return;

    const userKey = `savedItems-${user.uid}`;
    const savedItems = JSON.parse(localStorage.getItem(userKey)) || [];

    if (!saved) {
      const updated = [...savedItems, item];
      localStorage.setItem(userKey, JSON.stringify(updated));
      setSaved(true);
    } else {
      const updated = savedItems.filter((i) => i.id !== item.id);
      localStorage.setItem(userKey, JSON.stringify(updated));
      setSaved(false);
    }
  };

  return (
    <span
      onClick={handleToggleSave}
      style={{
        fontSize: "26px",
        cursor: item ? "pointer" : "default",
        color: saved ? "#f4c542" : "gray",
        transition: "0.2s",
      }}
    >
      ★
    </span>
  );
};

export default SaveButton;

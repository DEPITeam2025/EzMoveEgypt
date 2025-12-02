// src/components/SaveButton.jsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateSavedItems, removeSavedItem } from "@/features/auth/authSlice";

const SaveButton = ({ item, type }) => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [saved, setSaved] = useState(false);
  const [anim, setAnim] = useState(false);

  const itemWithId = { id: item.id, type, ...item };

  useEffect(() => {
    if (!user) return;
    const userKey = `user-${user.uid}`;
    const savedItems =
      JSON.parse(localStorage.getItem(userKey))?.savedItems || [];
    setSaved(savedItems.some((i) => i.id === item.id));
  }, [user, item]);

  const handleToggleSave = () => {
    if (!token) {
      alert("Please login to save items.");
      navigate("/auth/login");
      return;
    }

    setAnim(true);
    setTimeout(() => setAnim(false), 200);

    const userKey = `user-${user.uid}`;
    const storedUser = JSON.parse(localStorage.getItem(userKey)) || {
      ...user,
      savedItems: [],
    };
    let savedItems = storedUser.savedItems;

    if (!saved) {
      savedItems.push(itemWithId);
      dispatch(updateSavedItems(itemWithId));
      setSaved(true);
    } else {
      savedItems = savedItems.filter((i) => i.id !== item.id);
      dispatch(removeSavedItem(item.id));
      setSaved(false);
    }

    // تحديث LocalStorage لكل يوزر
    localStorage.setItem(
      userKey,
      JSON.stringify({ ...storedUser, savedItems })
    );

    // لوج لتأكيد العناصر
    console.log(`Saved items for ${user.fullName}:`, savedItems);
  };

  return (
    <span
      onClick={handleToggleSave}
      style={{
        fontSize: "24px",
        cursor: "pointer",
        transition: "color 0.2s ease, transform 0.2s ease",
        color: saved ? "green" : "red",
        transform: anim ? "scale(1.3)" : "scale(1)",
        marginLeft: "8px",
      }}
    >
      {saved ? "✔️" : "❤️"}
    </span>
  );
};

export default SaveButton;

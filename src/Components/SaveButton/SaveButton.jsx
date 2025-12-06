// SaveButton.jsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateSavedItems, removeSavedItem } from "@/features/auth/authSlice";

const SaveButton = ({ item, type, startName, endName }) => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [saved, setSaved] = useState(false);
  const [anim, setAnim] = useState(false);

  //generating id for items without id (like routes)
  const itemWithId = {
    id: `${item.start || ""}-${item.end || ""}-${item.line || ""}-${
      item.mode || ""
    }`,
    type,
    from: startName, // الاسم اللي اليوزر عامل بيه البحث
    to: endName,
    ...item,
  };

  useEffect(() => {
    if (!user) return;

    const userKey = `savedItems-${user.uid}`;
    const savedItems = JSON.parse(localStorage.getItem(userKey)) || [];

    setSaved(savedItems.some((i) => i.id === itemWithId.id));
  }, [user, itemWithId.id]);

  const handleToggleSave = () => {
    if (!token) {
      alert("Please login to save items.");
      navigate("/auth/login");
      return;
    }

    const userKey = `savedItems-${user.uid}`;
    const savedItems = JSON.parse(localStorage.getItem(userKey)) || [];

    setAnim(true);
    setTimeout(() => setAnim(false), 200);

    if (!saved) {
      const updated = [...savedItems, itemWithId];
      localStorage.setItem(userKey, JSON.stringify(updated));
      dispatch(updateSavedItems(itemWithId));
      setSaved(true);
    } else {
      const updated = savedItems.filter((i) => i.id !== itemWithId.id);
      localStorage.setItem(userKey, JSON.stringify(updated));
      dispatch(removeSavedItem(itemWithId.id));
      setSaved(false);
    }
  };

  return (
    <span
      onClick={handleToggleSave}
      style={{
        fontSize: "22px",
        cursor: "pointer",
        color: saved ? "#f4c542" : "gray",
        transition: "0.2s",
        transform: anim ? "scale(1.2)" : "scale(1)",
        marginLeft: "6px",
      }}
    >
      ★
    </span>
  );
};

export default SaveButton;

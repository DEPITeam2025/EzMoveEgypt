import api from "./axios";

export async function apiLogin(email, password) {
  console.log("API CALLED!");
  const res = await api.get("/users", {
    params: { email, password },
  });

  if (res.data.length > 0) {
    const user = res.data[0];
    return {
      user,
      token: "fake-token-" + user.id,
    };
  } else {
    throw new Error("Invalid email or password");
  }
}

export async function checkEmailExists(email) {
  // GET /users?email=email
  const res = await api.get("/users", {
    params: { email },
  });

  if (res.data.length > 0) {
    // ✅ الإيميل موجود
    return { message: "Reset link sent to your email!" };
  } else {
    // ❌ الإيميل مش موجود
    throw new Error("This email is not registered!");
  }
}

// Temporary script to reset password in production
import { ConvexHttpClient } from "convex/browser";

const client = new ConvexHttpClient("https://cheery-finch-992.convex.cloud");

async function registerUser() {
  try {
    const result = await client.mutation("auth:register", {
      email: "itay@digi-monster.com",
      password: "Coldislife123",
      name: "איתי",
      phone: "0523726767"
    });
    console.log("Success:", result);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

registerUser();

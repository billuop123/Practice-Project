import axios from "axios";
import { jwtDecode } from "jwt-decode";

export async function userInfo() {
  const token = sessionStorage.getItem("token");
  const email = jwtDecode(token).email;

  const response = await axios.post(
    "http://localhost:3001/api/v1/user/info",
    {
      email,
    },
    {
      headers: {
        Authorization: token,
      },
    }
  );

  return response.data.user;
}

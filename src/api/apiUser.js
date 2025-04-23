import Cookies from "js-cookie";
import api from ".";

export const userLogin = async (email, password) => {
    const response = await api.post(`/auth/login`, {
        email,
        password,
    });
    if (response.data.id) {
        localStorage.setItem("token", response.data.token);
        Cookies.set("refreshToken", response.data.refreshToken, { expires: 1 });
    }
    return response;
};

export const userRegister = async (values) => {
    const response = await api.post(`/auth/register`, {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        password: values.password,
    });
    return response;
};

import { supabase } from "../backend/supabase.js";

const btnLogin = document.getElementById("btnLogin");
const loginMessage = document.getElementById("loginMessage");

btnLogin.addEventListener("click", async () => {

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        loginMessage.textContent = "Vui lòng nhập đầy đủ thông tin!";
        return;
    }

    // Kiểm tra Supabase đã load chưa
    if (!supabase) {
        loginMessage.textContent = "Lỗi Supabase chưa được khởi tạo!";
        return;
    }

    // Kiểm tra tài khoản trong Supabase
    const { data, error } = await supabase
        .from("admin_users")
        .select("*")
        .eq("username", username)
        .eq("password", password)
        .single();

    if (error || !data) {
        loginMessage.textContent = "Sai tài khoản hoặc mật khẩu!";
        return;
    }

    // Lưu trạng thái đăng nhập
    localStorage.setItem("admin_logged_in", "true");
    localStorage.setItem("admin_username", username);

    // Chuyển sang trang đơn hàng
    window.location.href = "/frontend/donhang.html";
});

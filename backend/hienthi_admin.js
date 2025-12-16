// Import Supabase
import { supabase } from "../backend/supabase.js";

// Lấy username từ localStorage
const savedUsername = localStorage.getItem("admin_username");

// Vị trí hiển thị tên
const adminDisplay = document.getElementById("adminName");

// Nếu không có username => chưa đăng nhập
// if (!savedUsername) {
//     if (adminDisplay) adminDisplay.textContent = "Chưa đăng nhập";
// } else {

    // Gọi Supabase lấy lại thông tin tài khoản
    const loadAdminInfo = async () => {

        const { data, error } = await supabase
            .from("admin_users")
            .select("username")
            .eq("username", savedUsername)
            .single();

        if (error || !data) {
            adminDisplay.textContent = "Không tìm thấy admin!";
            return;
        }

        // Hiển thị username lên giao diện
        adminDisplay.textContent = data.username;
    };

    loadAdminInfo();
// }

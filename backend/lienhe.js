import { supabase } from "./supabase.js";

const form = document.getElementById("contact-form");

form.addEventListener("submit", async (e) => {
    e.preventDefault(); // ❌ không reload trang

    const fullname = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    // 🔍 Validate nhanh
    if (!fullname || !email || !phone || !subject || !message) {
        alert("Vui lòng nhập đầy đủ thông tin");
        return;
    }

    // 📥 Lưu Supabase
    const { error } = await supabase
        .from("contacts")
        .insert([
            { fullname, email, phone, subject, message }
        ]);

    if (error) {
        console.error(error);
        alert("❌ Gửi liên hệ thất bại, vui lòng thử lại");
        return;
    }

    // ✅ Thành công
    alert("✅ Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm.");

    form.reset();
});

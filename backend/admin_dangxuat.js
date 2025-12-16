const btnLogout = document.getElementById("btnLogout");

if (btnLogout) {
    btnLogout.addEventListener("click", () => {

        // Xóa thông tin đăng nhập
        localStorage.removeItem("admin_logged_in");
        localStorage.removeItem("admin_username");

        // Chuyển về trang admin.html
        window.location.href = "/admin.html";
    });
}

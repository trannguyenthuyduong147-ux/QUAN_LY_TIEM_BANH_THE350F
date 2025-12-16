const btn = document.getElementById("btnPostToFacebook");
const contentBox = document.getElementById("postContent");
const imageInput = document.getElementById("postImage");
const statusMsg = document.getElementById("statusMessage");

// ============ THAY BẰNG PAGE TOKEN CỦA BẠN =============
const PAGE_ACCESS_TOKEN = "EAALunQEriZBABQI0YLxMag9vg3W9oV51CRliQehGJZAuJnbDimVisc20kqGIamRSZCzzGtJVCDy2OqjekhHdg9qECWZC3QnJRzIIyx4rFZBqBlPplttmkZBllqzthqJpxychN5dQEdA9QL3FEIQeXr65NeRMmyGpEN5OEpfmJrdi3W0u7Qd0FPB7TKnyPubTzRspIZCLZBnDPyAd2Kw7xEZCjFNbk";
const PAGE_ID = "488694371005256";
// =======================================================



contentBox.addEventListener("input", function () {
    this.style.height = "auto";  
    this.style.height = this.scrollHeight + "px";
});



btn.addEventListener("click", async () => {
    const message = contentBox.value.trim();

    if (!message) {
        statusMsg.textContent = "Vui lòng nhập nội dung bài viết!";
        return;
    }

    statusMsg.textContent = "Đang đăng bài...>";

    // Nếu có ảnh
    if (imageInput.files.length > 0) {
        const imageFile = imageInput.files[0];

        const formData = new FormData();
        formData.append("source", imageFile);
        formData.append("caption", message);
        formData.append("access_token", PAGE_ACCESS_TOKEN);

        const upload = await fetch(
            `https://graph.facebook.com/${PAGE_ID}/photos`,
            { method: "POST", body: formData }
        );

        const result = await upload.json();

        if (result.id) {
            statusMsg.textContent = "Đăng bài kèm ảnh thành công!";
        } else {
            statusMsg.textContent = "Lỗi đăng kèm ảnh!";
        }

        return;
    }

    // Nếu chỉ đăng text
    const res = await fetch(
        `https://graph.facebook.com/${PAGE_ID}/feed?message=${encodeURIComponent(message)}&access_token=${PAGE_ACCESS_TOKEN}`,
        { method: "POST" }
    );

    const data = await res.json();

    statusMsg.textContent =
        data.id ? "Đăng bài thành công!" : "Lỗi đăng bài!";
});

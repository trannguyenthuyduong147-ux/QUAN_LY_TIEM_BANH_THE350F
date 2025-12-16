import { supabase } from "./supabase.js";

const ordersBody = document.getElementById("ordersBody");
const overlay = document.getElementById("orderDetailOverlay");
const detailContent = document.getElementById("orderDetailContent");
const btnClose = document.getElementById("btnCloseDetail");

// ======================= HÀM CHUYỂN GIỜ UTC → GIỜ VN =======================
function toVietnamTime(utcString) {
    const utcDate = new Date(utcString);
    const vnDate = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000);
    return vnDate.toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h24"
    });
}

// ================== LOAD DANH SÁCH ĐƠN ==================
async function loadOrders() {
    const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("order_date", { ascending: false });

    if (error) {
        console.error("Lỗi tải đơn hàng:", error);
        return;
    }

    ordersBody.innerHTML = data
        .map(order => `
            <tr>
                <td>#${order.id}</td>
                <td>${order.customer_name}</td>
                <td>${order.customer_phone || "Không có"}</td>
                <td>${order.total_amount.toLocaleString()} VND</td>
                <td>${order.status}</td>
                <td>${toVietnamTime(order.order_date)}</td>
                <td>
                    <button class="btn-detail" onclick="showDetail(${order.id})">
                        Xem
                    </button>
                </td>
            </tr>
        `)
        .join("");
}

window.showDetail = async function (orderId) {
    const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

    if (error) {
        console.error("Lỗi tải chi tiết:", error);
        return;
    }

    detailContent.innerHTML = `
        <p><strong>Mã đơn:</strong> #${data.id}</p>
        <p><strong>Khách hàng:</strong> ${data.customer_name}</p>
        <p><strong>Email:</strong> ${data.customer_email || "Không có"}</p>
        <p><strong>SĐT:</strong> ${data.customer_phone || "Không có"}</p>
        <p><strong>Địa chỉ:</strong> ${data.address || "Không có"}</p>
        <p><strong>Tổng tiền:</strong> ${data.total_amount.toLocaleString()} VND</p>
        <p><strong>Ngày đặt:</strong> ${toVietnamTime(data.order_date)}</p>
        <p><strong>Trạng thái:</strong> ${data.status}</p>
    `;

    overlay.classList.remove("hidden");
};

btnClose.onclick = () => overlay.classList.add("hidden");

// Load danh sách khi mở trang
loadOrders();

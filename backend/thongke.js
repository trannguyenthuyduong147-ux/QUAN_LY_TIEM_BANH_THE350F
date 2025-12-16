// import { supabase } from "./supabase.js";

// const tongDoanhThu = document.getElementById("tongDoanhThu");
// const tongDon = document.getElementById("tongDon");
// const donDaThanhToan = document.getElementById("donDaThanhToan");
// const donChuaThanhToan = document.getElementById("donChuaThanhToan");

// // ======================= HÀM CHUYỂN GIỜ UTC → GIỜ VN =======================
// function toVN(dateStr) {
//     const d = new Date(dateStr);
//     return new Date(d.getTime() + 7 * 60 * 60 * 1000);
// }

// // ======================= LOAD DỮ LIỆU THỐNG KÊ =======================
// async function loadStatistics() {

//     const { data: payments } = await supabase.from("payments").select("*");
//     const { data: orders } = await supabase.from("orders").select("*");

//     // ==== Tính toán ====
//     const revenue = payments.reduce((sum, p) => sum + p.amount, 0);
//     const totalOrders = orders.length;
//     const paidOrders = payments.length;

//     const unpaidOrders = orders.filter(o =>
//         !payments.some(p => p.order_id === o.id)
//     ).length;

//     // ==== Gán dữ liệu vào giao diện ====
//     tongDoanhThu.textContent = revenue.toLocaleString() + " VND";
//     tongDon.textContent = totalOrders;
//     donDaThanhToan.textContent = paidOrders;
//     donChuaThanhToan.textContent = unpaidOrders;

//     // ==== Tạo dữ liệu biểu đồ theo tháng ====
//     const revenueByMonth = {};

//     payments.forEach(p => {
//         const d = toVN(p.payment_date);
//         const key = `${d.getMonth() + 1}/${d.getFullYear()}`;

//         revenueByMonth[key] = (revenueByMonth[key] || 0) + p.amount;
//     });

//     drawChart(revenueByMonth);
// }

// // ======================= VẼ BIỂU ĐỒ DOANH THU =======================
// function drawChart(revenueData) {
//     const ctx = document.getElementById("revenueChart");

//     new Chart(ctx, {
//         type: "line",
//         data: {
//             labels: Object.keys(revenueData),
//             datasets: [{
//                 label: "Doanh thu theo tháng",
//                 data: Object.values(revenueData),
//                 borderWidth: 2,
//                 borderColor: "#2563eb",
//                 backgroundColor: "rgba(37, 99, 235, 0.3)"
//             }]
//         },
//         options: {
//             responsive: true,
//             scales: {
//                 y: { beginAtZero: true }
//             }
//         }
//     });
// }

// loadStatistics();









import { supabase } from "./supabase.js";

const tongDoanhThu = document.getElementById("tongDoanhThu");
const tongDon = document.getElementById("tongDon");
const donDaThanhToan = document.getElementById("donDaThanhToan");
const donChuaThanhToan = document.getElementById("donChuaThanhToan");

// ======================= HÀM CHUYỂN GIỜ UTC → GIỜ VN =======================
function toVN(dateStr) {
    const d = new Date(dateStr);
    return new Date(d.getTime() + 7 * 60 * 60 * 1000);
}

// ======================= LOAD DỮ LIỆU THỐNG KÊ =======================
async function loadStatistics() {

    const { data: payments } = await supabase.from("payments").select("*");
    const { data: orders } = await supabase.from("orders").select("*");

    if (!payments || !orders) {
        console.error("Không thể tải dữ liệu từ Supabase");
        return;
    }

    // ==== 1) LỌC PAYMENT THÀNH CÔNG ====
    const successPayments = payments.filter(
        p => (p.status || "").toLowerCase() === "thành công"
    );

    // ==== 2) TÍNH TỔNG DOANH THU ====
    const revenue = successPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0);

    // ==== 3) TỔNG SỐ ĐƠN ====
    const totalOrders = orders.length;

    // ==== 4) SỐ ĐƠN ĐÃ THANH TOÁN ====
    // đếm các orders có payment thành công
    const paidOrders = successPayments.length;

    // ==== 5) SỐ ĐƠN CHƯA THANH TOÁN ====
    const paidOrderIDs = successPayments.map(p => p.order_id);
    const unpaidOrders = orders.filter(o => !paidOrderIDs.includes(o.id)).length;

    // ==== Gán dữ liệu vào giao diện ====
    tongDoanhThu.textContent = revenue.toLocaleString("vi-VN") + " VND";
    tongDon.textContent = totalOrders;
    donDaThanhToan.textContent = paidOrders;
    donChuaThanhToan.textContent = unpaidOrders;

    // ==== 6) TẠO DỮ LIỆU BIỂU ĐỒ ====
    const revenueByMonth = {};

    successPayments.forEach(p => {
        const d = toVN(p.payment_date);
        const key = `${d.getMonth() + 1}/${d.getFullYear()}`;

        revenueByMonth[key] = (revenueByMonth[key] || 0) + Number(p.amount || 0);
    });

    drawChart(revenueByMonth);
}

// ======================= VẼ BIỂU ĐỒ DOANH THU =======================
function drawChart(revenueData) {
    const ctx = document.getElementById("revenueChart");

    new Chart(ctx, {
        type: "line",
        data: {
            labels: Object.keys(revenueData),
            datasets: [{
                label: "Doanh thu theo tháng",
                data: Object.values(revenueData),
                borderWidth: 2,
                borderColor: "#2563eb",
                backgroundColor: "rgba(37, 99, 235, 0.3)"
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

loadStatistics();








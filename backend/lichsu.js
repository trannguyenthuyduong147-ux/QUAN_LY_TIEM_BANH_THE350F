// import { supabase } from "./supabase.js";

// const historyBody = document.getElementById("historyBody");
// const emptyMessage = document.getElementById("emptyMessage");

// // ================= USER =================
// const currentUser = JSON.parse(localStorage.getItem("currentUser"));

// if (!currentUser || !currentUser.email) {
//     emptyMessage.innerText = "Vui lòng đăng nhập để xem lịch sử mua hàng.";
//     emptyMessage.style.display = "block";
//     throw new Error("User not logged in");
// }

// const userEmail = currentUser.email.trim().toLowerCase();

// // ================= LOAD HISTORY =================
// async function loadHistory() {

//     const { data, error } = await supabase
//         .from("payments")
//         .select("*")
//         .eq("payer_email", userEmail)
//         .order("payment_date", { ascending: false });

//     if (error) {
//         console.error(error);
//         emptyMessage.innerText = "Lỗi tải lịch sử mua hàng.";
//         emptyMessage.style.display = "block";
//         return;
//     }

//     if (!data || data.length === 0) {
//         emptyMessage.innerText = "Bạn chưa có đơn hàng nào.";
//         emptyMessage.style.display = "block";
//         return;
//     }

//     historyBody.innerHTML = "";

//     data.forEach(p => {
//         historyBody.innerHTML += `
//             <tr>
//                 <td>#${p.order_id}</td>
//                 <td>${new Date(p.payment_date).toLocaleString()}</td>
//                 <td>${p.amount.toLocaleString()} VND</td>
//                 <td>${p.payment_method}</td>
//                 <td>${p.status}</td>
//             </tr>
//         `;
//     });
// }

// loadHistory();



import { supabase } from "./supabase.js";

const historyBody = document.getElementById("historyBody");
const emptyMessage = document.getElementById("emptyMessage");

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || !currentUser.email) {
    emptyMessage.innerText = "Vui lòng đăng nhập để xem lịch sử mua hàng.";
    emptyMessage.style.display = "block";
    throw new Error("User not logged in");
}

const userEmail = currentUser.email.trim().toLowerCase();

function formatVNTime(utcTime) {
    const utcDate = new Date(utcTime);
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

async function loadHistory() {
    const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("payer_email", userEmail)
        .order("payment_date", { ascending: false });

    if (error) {
        console.error(error);
        emptyMessage.innerText = "Lỗi tải lịch sử mua hàng.";
        emptyMessage.style.display = "block";
        return;
    }

    if (!data || data.length === 0) {
        emptyMessage.innerText = "Bạn chưa có đơn hàng nào.";
        emptyMessage.style.display = "block";
        return;
    }

    historyBody.innerHTML = "";

    data.forEach(p => {
        historyBody.innerHTML += `
            <tr>
                <td>#${p.order_id}</td>
                <td>${formatVNTime(p.payment_date)}</td>
                <td>${p.amount.toLocaleString()} VND</td>
                <td>${p.payment_method}</td>
                <td>${p.status}</td>
            </tr>
        `;
    });
}

loadHistory();




import { supabase } from './supabase.js';

const checkoutInfo = document.getElementById('checkoutInfo');
const checkoutTotal = document.getElementById('checkoutTotal');
const paymentMethod = document.getElementById('paymentMethod');
const btnPay = document.getElementById('btnPay');
const qrContainer = document.getElementById('qrContainer');

let latestOrder = null;

// ======= Tải thông tin đơn hàng =======
async function loadCheckout() {
  const latestOrderId = localStorage.getItem('latestOrderId');
  if (!latestOrderId) {
    checkoutInfo.innerHTML = "<p>Không tìm thấy đơn hàng!</p>";
    return;
  }

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', latestOrderId)
    .single();

  if (error || !data) {
    checkoutInfo.innerHTML = "<p>Lỗi khi tải đơn hàng!</p>";
    return;
  }

  latestOrder = data;
  // checkoutInfo.innerHTML = `
  //   <p><strong>Tên khách hàng:</strong> ${data.customer_name}</p>
  //   <p><strong>Email:</strong> ${data.customer_email}</p>
  //   <p><strong>Số điện thoại:</strong> ${data.customer_phone}</p>
  //   <p><strong>Địa chỉ:</strong> ${data.address}</p>
  // `;

  checkoutInfo.innerHTML = `
  <div class="order-card">
    <h3>Thông Tin Đơn Hàng</h3>

    <div class="order-row">
      <span class="label">Tên khách hàng:</span>
      <span class="value">${data.customer_name}</span>
    </div>

    <div class="order-row">
      <span class="label">Email:</span>
      <span class="value">${data.customer_email}</span>
    </div>

    <div class="order-row">
      <span class="label">Số điện thoại:</span>
      <span class="value">${data.customer_phone}</span>
    </div>

    <div class="order-row">
      <span class="label">Địa chỉ:</span>
      <span class="value">${data.address}</span>
    </div>
  </div>
`;

  checkoutTotal.textContent = data.total_amount.toLocaleString('vi-VN') + " VND";
}

// ======= Xử lý thanh toán =======
btnPay.addEventListener('click', async () => {
  if (!latestOrder) {
    alert("Không tìm thấy đơn hàng để thanh toán!");
    return;
  }

  const method = paymentMethod.value;

  if (!method) {
    alert("Vui lòng chọn phương thức thanh toán!");
    return;
  }

  // Xóa QR cũ (nếu có)
  qrContainer.style.display = "none";
  qrContainer.innerHTML = '';

  if (method === "COD") {
    // Thanh toán khi nhận hàng
    await supabase.from('payments').insert([{
      order_id: latestOrder.id,
      payment_method: method,
      amount: latestOrder.total_amount,
      payer_name: latestOrder.customer_name,
      payer_email: latestOrder.customer_email,
      payer_phone: latestOrder.customer_phone,
      status: 'Chờ thanh toán'
    }]);

    await supabase.from('orders')
      .update({ status: 'Chờ thanh toán' })
      .eq('id', latestOrder.id);

    alert("✅ Đơn hàng được ghi nhận. Thanh toán khi nhận hàng!");
    window.location.href = "/trangchu.html";

  } else {
    // MOMO hoặc VNPAY => hiện QR code tương ứng
    const qrSrc = method === "NGANHANG"
      ? "../assets/ck_nganhang.jpg"
      : "../assets/qr_vnpay.jpg";

    qrContainer.innerHTML = `
      <h4>Quét mã để thanh toán qua ${method}</h4>
      <img src="${qrSrc}" alt="QR ${method}" width="190" height="250">
      <p style="margin-top:10px;">Vui lòng hoàn tất thanh toán, sau đó nhấn nút bên dưới:</p>
      <button id="btnConfirmQR" class="btn-checkout" style="margin-top:10px;">✅ Tôi đã thanh toán</button>
    `;
    qrContainer.style.display = "block";

    // Khi người dùng xác nhận đã thanh toán
    document.getElementById('btnConfirmQR').addEventListener('click', async () => {
      const { error } = await supabase.from('payments').insert([{
        order_id: latestOrder.id,
        payment_method: method,
        amount: latestOrder.total_amount,
        payer_name: latestOrder.customer_name,
        payer_email: latestOrder.customer_email,
        payer_phone: latestOrder.customer_phone,
        status: 'Thành công'
      }]);

      if (error) {
        console.error("Lỗi ghi thanh toán:", error);
        alert("❌ Lỗi ghi nhận thanh toán. Vui lòng thử lại!");
        return;
      }

      await supabase.from('orders')
        .update({ status: 'Đã thanh toán' })
        .eq('id', latestOrder.id);

      alert("🎉 Thanh toán thành công qua " + method + "!");
      window.location.href = "/trangchu.html";
    });
  }
});

document.addEventListener('DOMContentLoaded', loadCheckout);

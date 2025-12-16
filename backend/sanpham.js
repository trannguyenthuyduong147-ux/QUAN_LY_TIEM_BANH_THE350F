// // sanpham.js
// import { supabase } from './supabase.js';

// const addToCartBtns = document.querySelectorAll('.btn-cart');

// addToCartBtns.forEach(btn => {
//   btn.addEventListener('click', async () => {
//     const name = btn.dataset.name;
//     const price = Number(btn.dataset.price);
//     const image = btn.dataset.image;

//     try {
//       // Kiểm tra sản phẩm đã có trong giỏ chưa
//       const { data: existingItems, error: fetchError } = await supabase
//         .from('cart_items')
//         .select('*')
//         .eq('name', name);

//       if (fetchError) {
//         console.error(fetchError);
//         alert("Lỗi khi kiểm tra giỏ hàng.");
//         return;
//       }

//       if (existingItems && existingItems.length > 0) {
//         // Cập nhật số lượng
//         await supabase
//           .from('cart_items')
//           .update({ quantity: existingItems[0].quantity + 1 })
//           .eq('id', existingItems[0].id);
//       } else {
//         // Thêm mới
//         await supabase
//           .from('cart_items')
//           .insert([{ name, price_at_add: price, quantity: 1, image }]);
//       }

//       alert(`✅ Đã thêm "${name}" vào giỏ hàng!`);

//       // Nếu đang ở trang giỏ hàng, gọi loadCart để cập nhật giao diện
//       if (window.location.href.includes('./frontend/giohang.html')) {
//         window.dispatchEvent(new Event('cartUpdated'));
//       }

//     } catch (err) {
//       console.error(err);
//       alert("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng." + err.message);
//     }
//   });
// });





import { supabase } from './supabase.js';

document.addEventListener("click", async (e) => {

    const btn = e.target.closest(".btn-cart");
    if (!btn) return; // không phải nút thêm giỏ

    const name = btn.dataset.name;
    const price = Number(btn.dataset.price);
    const image = btn.dataset.image;

    try {
        const { data: existingItems, error } = await supabase
            .from("cart_items")
            .select("*")
            .eq("name", name)
            .single();

        if (existingItems) {
            await supabase
                .from("cart_items")
                .update({ quantity: existingItems.quantity + 1 })
                .eq("id", existingItems.id);
        } else {
            await supabase
                .from("cart_items")
                .insert([{
                    name,
                    price_at_add: price,
                    quantity: 1,
                    image
                }]);
        }

        alert(`✅ Đã thêm "${name}" vào giỏ hàng`);

        // Cập nhật giỏ nếu đang ở trang giỏ
        window.dispatchEvent(new Event("cartUpdated"));

    } catch (err) {
        console.error(err);
        alert("❌ Lỗi thêm giỏ hàng");
    }
});



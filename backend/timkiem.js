

import { supabase } from './supabase.js';
import { products as allProducts } from '../backend/danhsachsanpham.js'; // import danh sách sản phẩm

// ====== 1. SELECT ELEMENT ======
const searchBtn = document.getElementById('search');          
const overlay = document.getElementById('search-overlay');    
const closeBtn = document.getElementById('close-search');     
const input = document.getElementById('search-input');        
const resultsBox = document.getElementById('search-results'); 

// ====== 2. HIỆN POPUP ======
searchBtn.addEventListener('click', () => {
    overlay.classList.add('active');
    input.focus();
});

// ====== 3. ĐÓNG POPUP ======
closeBtn.addEventListener('click', () => {
    overlay.classList.remove('active');
    input.value = "";
    resultsBox.innerHTML = "";
});

// ====== 4. HIỂN THỊ SẢN PHẨM KẾT QUẢ ======
function renderResults(list) {
    resultsBox.innerHTML = "";

    if (list.length === 0) {
        resultsBox.innerHTML = `<p style="color:white; text-align:center">Không tìm thấy sản phẩm</p>`;
        return;
    }

    list.forEach(sp => {
        const div = document.createElement('div');
        div.className = "search-item";

        div.innerHTML = `
            <img src="${sp.image}" alt="${sp.name}" class="search-img">
            <div class="search-info">
                <h4>${sp.name}</h4>
                <p>${sp.price.toLocaleString()} VND</p>
                <button class="btn-add" 
                        data-name="${sp.name}" 
                        data-price="${sp.price}"
                        data-image="${sp.image}">
                    Thêm vào giỏ
                </button>
            </div>
        `;

        // Nút thêm vào giỏ
        div.querySelector('.btn-add').addEventListener('click', async (e) => {
            const name = e.target.dataset.name;
            const price = Number(e.target.dataset.price);
            const image = e.target.dataset.image;

            try {
                const { data: existing } = await supabase
                    .from('cart_items')
                    .select('*')
                    .eq('name', name);

                if (existing && existing.length > 0) {
                    await supabase
                        .from('cart_items')
                        .update({ quantity: existing[0].quantity + 1 })
                        .eq('id', existing[0].id);
                } else {
                    await supabase
                        .from('cart_items')
                        .insert([{ name, price_at_add: price, quantity: 1, image }]);
                }

                alert(`Đã thêm "${name}" vào giỏ hàng!`);
            } catch (err) {
                console.error(err);
                alert("Có lỗi khi thêm vào giỏ.");
            }
        });

        resultsBox.appendChild(div);
    });
}

// ====== 5. XỬ LÝ NHẬP TỪ KHÓA ======
input.addEventListener('input', () => {
    const keyword = input.value.toLowerCase().trim();
    const filtered = allProducts.filter(p => 
        p.name.toLowerCase().includes(keyword)
    );
    renderResults(filtered);
});

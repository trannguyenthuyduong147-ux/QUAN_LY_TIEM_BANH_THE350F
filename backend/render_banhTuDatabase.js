import { supabase } from "./supabase.js";

const mousseGrid = document.getElementById("mousseGrid");
const hopChiecGrid = document.getElementById("hopChiecGrid");

async function loadProducts() {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Lỗi load sản phẩm", error);
        return;
    }

    mousseGrid.innerHTML = "";
    hopChiecGrid.innerHTML = "";

    data.forEach(p => {
        const productHTML = `
        <div class="product-card">
            <div class="product-image">
                <img src="${p.image}">
                ${p.is_hot ? `<span class="badge hot">Hot</span>` : ""}
                ${p.is_new ? `<span class="badge new">Mới</span>` : ""}
            </div>

            <div class="product-info">
                <h4 class="product-name">${p.name}</h4>
                <p class="product-price">
                    Giá từ: <span>${p.price.toLocaleString()} VND</span>
                </p>
                <button class="btn-cart"
                    data-id="${p.id}"
                    data-name="${p.name}"
                    data-price="${p.price}"
                    data-image="${p.image}">
                    Thêm vào giỏ hàng <i class="fa-solid fa-cart-shopping"></i>
                </button>
            </div>
        </div>
        `;

        // ===== PHÂN LOẠI =====
        if (p.category === "Bánh Mousse") {
            mousseGrid.innerHTML += productHTML;
        }

        if (p.category === "Bánh Hộp Chiếc") {
            hopChiecGrid.innerHTML += productHTML;
        }
    });
}

loadProducts();

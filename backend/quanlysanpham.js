// import { supabase } from "./supabase.js";

// const productTableBody = document.getElementById("productTableBody");

// // ================= LOAD SẢN PHẨM =================
// async function loadProducts() {
//     const { data, error } = await supabase
//         .from("products")
//         .select("*")
//         .order("created_at", { ascending: false });

//     if (error) {
//         console.error("Lỗi load sản phẩm:", error);
//         return;
//     }

//     productTableBody.innerHTML = "";

//     data.forEach(product => {
//         productTableBody.innerHTML += `
//         <tr>
//             <td>
//                 <img src="${product.image}" width="60" style="border-radius:6px">
//             </td>
//             <td>${product.name}</td>
//             <td>${product.price.toLocaleString()} VND</td>
//             <td>${product.category || "-"}</td>
//             <td>
//                 ${
//                     product.is_active
//                         ? `<span class="status active">Đang bán</span>`
//                         : `<span class="status inactive">Đã ẩn</span>`
//                 }
//             </td>
//             <td>
//                 ${
//                     product.is_active
//                         ? `<button class="btn-hide" data-id="${product.id}">Ẩn</button>`
//                         : `<button class="btn-show" data-id="${product.id}">Hiện</button>`
//                 }
//             </td>
//         </tr>
//         `;
//     });

//     attachActionEvents();
// }

// // ================= GÁN EVENT =================
// function attachActionEvents() {

//     // Ẩn sản phẩm
//     document.querySelectorAll(".btn-hide").forEach(btn => {
//         btn.addEventListener("click", async () => {
//             const id = btn.dataset.id;

//             if (!confirm("Ẩn sản phẩm này?")) return;

//             await supabase
//                 .from("products")
//                 .update({ is_active: false })
//                 .eq("id", id);

//             loadProducts();
//         });
//     });

//     // Hiện lại sản phẩm
//     document.querySelectorAll(".btn-show").forEach(btn => {
//         btn.addEventListener("click", async () => {
//             const id = btn.dataset.id;

//             await supabase
//                 .from("products")
//                 .update({ is_active: true })
//                 .eq("id", id);

//             loadProducts();
//         });
//     });
// }

// // ================= INIT =================
// loadProducts();










import { supabase } from "./supabase.js";

const productTableBody = document.getElementById("productTableBody");

// ===== MODAL =====
const btnAddProduct = document.getElementById("btnAddProduct");
const productModal = document.getElementById("productModal");
const btnCloseModal = document.getElementById("btnCloseModal");
const btnSaveProduct = document.getElementById("btnSaveProduct");

// ===== INPUTS =====
const nameInput = document.getElementById("productName");
const priceInput = document.getElementById("productPrice");
const imageInput = document.getElementById("productImage");
const categoryInput = document.getElementById("productCategory");


// ================= LOAD SẢN PHẨM =================
async function loadProducts() {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Lỗi load sản phẩm:", error);
        return;
    }

    productTableBody.innerHTML = "";

    data.forEach(product => {
        productTableBody.innerHTML += `
        <tr>
            <td>
                <img src="${product.image || ""}" width="60" style="border-radius:6px">
            </td>
            <td>${product.name}</td>
            <td>${product.price.toLocaleString()} VND</td>
            <td>${product.category || "-"}</td>
            <td>
                ${
                    product.is_active
                        ? `<span class="status active">Đang bán</span>`
                        : `<span class="status inactive">Đã ẩn</span>`
                }
            </td>
            <td>
                ${
                    product.is_active
                        ? `<button class="btn-hide" data-id="${product.id}">Ẩn</button>`
                        : `<button class="btn-show" data-id="${product.id}">Hiện</button>`
                }
            </td>
        </tr>
        `;
    });

    attachActionEvents();
}


// ================= GÁN EVENT ẨN / HIỆN =================
function attachActionEvents() {

    // Ẩn sản phẩm
    document.querySelectorAll(".btn-hide").forEach(btn => {
        btn.onclick = async () => {
            const id = btn.dataset.id;

            if (!confirm("Ẩn sản phẩm này?")) return;

            await supabase
                .from("products")
                .update({ is_active: false })
                .eq("id", id);

            loadProducts();
        };
    });

    // Hiện lại sản phẩm
    document.querySelectorAll(".btn-show").forEach(btn => {
        btn.onclick = async () => {
            const id = btn.dataset.id;

            await supabase
                .from("products")
                .update({ is_active: true })
                .eq("id", id);

            loadProducts();
        };
    });
}


// ================= MODAL THÊM SẢN PHẨM =================
btnAddProduct.onclick = () => {
    productModal.classList.remove("hidden");
};

btnCloseModal.onclick = () => {
    productModal.classList.add("hidden");
};


// ================= LƯU SẢN PHẨM =================
btnSaveProduct.onclick = async () => {
    const name = nameInput.value.trim();
    const price = Number(priceInput.value);
    const image = imageInput.value.trim();
    const category = categoryInput.value.trim();

    if (!name || !price) {
        alert("Vui lòng nhập tên và giá");
        return;
    }

    const { error } = await supabase
        .from("products")
        .insert([{
            name,
            price,
            image,
            category,
            is_active: true
        }]);

    if (error) {
        console.error(error);
        alert("Lỗi khi thêm sản phẩm");
        return;
    }

    // Reset form
    nameInput.value = "";
    priceInput.value = "";
    imageInput.value = "";
    categoryInput.value = "";

    productModal.classList.add("hidden");
    loadProducts();
};


// ================= INIT =================
loadProducts();

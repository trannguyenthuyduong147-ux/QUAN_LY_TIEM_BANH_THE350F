// Khởi tạo Supabase client
let supabase;

function initSupabase() {
  if (window.supabase && window.supabase.createClient) {
    supabase = window.supabase.createClient(
      "https://diddttvndmguqjykohbc.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpZGR0dHZuZG1ndXFqeWtvaGJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5NTI0NzMsImV4cCI6MjA4MDUyODQ3M30.xu9BtfcdyEUfNYkl0ijimjXhSzSf1mUVnPNPWXaKj-I"
    );
    return true;
  }
  return false;
}

// Đợi Supabase và DOM load xong
function waitForSupabase() {
  if (window.supabase && window.supabase.createClient) {
    if (initSupabase()) {
      setupForm();
    } else {
      console.error("Không thể khởi tạo Supabase client!");
    }
  } else {
    // Thử lại sau 100ms
    setTimeout(waitForSupabase, 100);
  }
}

function setupForm() {
  const form = document.getElementById("register-form");

  if (!form) {
    console.error("Không tìm thấy form đăng ký!");
    return;
  }

  form.addEventListener("submit", handleSubmit);
}

// Bắt đầu đợi Supabase load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', waitForSupabase);
} else {
  waitForSupabase();
}

async function handleSubmit(e) {
  e.preventDefault();
  e.stopPropagation();
  
  const form = document.getElementById("register-form");

  const user = {
    username: form.username.value.trim(),
    fullname: form.fullname.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    address: form.address.value.trim(),
    password: form.password.value.trim()
  };

  if (!user.username || !user.email || !user.password) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  if (!supabase) {
    alert("Lỗi: Supabase chưa được khởi tạo. Vui lòng tải lại trang!");
    return;
  }

  try {
    // Kiểm tra email hoặc username đã tồn tại chưa
    const { data: existingUsers, error: checkError } = await supabase
      .from("users")
      .select("username, email")
      .or(`email.eq.${user.email},username.eq.${user.username}`)
      .limit(1);

    if (checkError) {
      console.error("Lỗi kiểm tra:", checkError);
      throw checkError;
    }

    if (existingUsers && existingUsers.length > 0) {
      const existing = existingUsers[0];
      if (existing.email === user.email) {
        alert("Email này đã được sử dụng!");
        return;
      }
      if (existing.username === user.username) {
        alert("Tên đăng nhập này đã được sử dụng!");
        return;
      }
    }

    // Thêm .select() để trả về dữ liệu sau khi insert
    const { data, error } = await supabase
      .from("users")
      .insert([user])
      .select();

    if (error) {
      console.error("Lỗi Supabase:", error);
      throw error;
    }

    // Lưu localStorage
    localStorage.setItem("currentUser", JSON.stringify({
      username: user.username,
      email: user.email,
      phone: user.phone
    }));

    alert("Đăng ký thành công!");
    // Sử dụng đường dẫn tương đối
    const currentPath = window.location.pathname;
    const isInFrontendFolder = currentPath.includes('/frontend/');
    window.location.href = isInFrontendFolder ? "../trangchu.html" : "./trangchu.html";

  } catch (err) {
    console.error("Chi tiết lỗi:", err);
    let errorMessage = "Đăng ký thất bại!";
    
    if (err.message) {
      errorMessage += " " + err.message;
    } else if (err.code) {
      errorMessage += ` (Mã lỗi: ${err.code})`;
    }
    
    alert(errorMessage);
  }
}

// Update header
function updateHeaderUser() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const userSpan = document.getElementById("userNameLinks");
  if (user && userSpan) {
    userSpan.innerHTML = `Xin chào, <strong>${user.username}</strong>`;
  }
}

// Gọi updateHeaderUser khi DOM load
document.addEventListener("DOMContentLoaded", updateHeaderUser);

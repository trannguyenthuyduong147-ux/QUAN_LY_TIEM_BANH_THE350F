// Sử dụng Supabase từ window (load qua script tag trong HTML)
// Tạo client ngay khi module được load
let supabaseClient = null;

if (typeof window !== 'undefined' && window.supabase && window.supabase.createClient) {
  supabaseClient = window.supabase.createClient(
    "https://diddttvndmguqjykohbc.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpZGR0dHZuZG1ndXFqeWtvaGJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5NTI0NzMsImV4cCI6MjA4MDUyODQ3M30.xu9BtfcdyEUfNYkl0ijimjXhSzSf1mUVnPNPWXaKj-I"
  );
} else {
  console.warn("Supabase chưa được load. Đảm bảo script Supabase được load trước các module script.");
}

export const supabase = supabaseClient;


const SUPABASE_URL = "https://mjfsezxehyxzmcarmnsq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qZnNlenhlaHl4em1jYXJtbnNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2MjQwNDMsImV4cCI6MjA4MTIwMDA0M30.l_yW7WKipbJJ5WdhJl2UpiBCFjtfFCDVZYgNyRUFf5g";

window.supabase = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY 
);
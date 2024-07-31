import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://sqbvwnxsbocvrdxbpsfu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxYnZ3bnhzYm9jdnJkeGJwc2Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjExNDI5MjAsImV4cCI6MjAzNjcxODkyMH0.1soM0OI458u8qUz-GSKwYn6yoS4vI7K13idyaae7CJ0";
const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;

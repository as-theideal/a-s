import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://sqbvwnxsbocvrdxbpsfu.supabase.co";
const supabase = createClient(supabaseUrl, process.env.REACT_APP_SUPABASE_KEY);
export default supabase;

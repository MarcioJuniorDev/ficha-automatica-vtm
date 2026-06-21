import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xmfuicnbhlkpvqwunhxn.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtZnVpY25iaGxrcHZxd3VuaHhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwMjE4MzQsImV4cCI6MjA5NzU5NzgzNH0.ml0wKuvX9SDh3By_3mUQaiwwqyVcFnuIT088cRx5D3M";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);
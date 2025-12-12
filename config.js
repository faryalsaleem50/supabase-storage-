import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabaseUrl = 'https://hrirvzyfiepivaxwhsvx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyaXJ2enlmaWVwaXZheHdoc3Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMTk0NTcsImV4cCI6MjA3NTc5NTQ1N30.scSsSbQVXujst-yo0i-2X50i0HFThBL04kZY9GHdBbM';

const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;

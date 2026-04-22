import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = 'https://dszmjuinurczqxatfufd.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzem1qdWludXJjenF4YXRmdWZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NTQxNTIsImV4cCI6MjA5MjQzMDE1Mn0.k2k6C3xCxJ1ZL2qrJ4V-Oq7rKlNdqSHyMIJQFum03ZE';
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

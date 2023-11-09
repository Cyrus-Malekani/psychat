import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = 'https://mlwjjtayomdkstvpdfdz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sd2pqdGF5b21ka3N0dnBkZmR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk0Njc3MjQsImV4cCI6MjAxNTA0MzcyNH0.VAXM5uR4GLWRXgLvquCk1BbX8blZNaKGaxuwvx3wcZI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, { db: {schema: 'public'}})

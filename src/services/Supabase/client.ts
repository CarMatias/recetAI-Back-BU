import { createClient } from '@supabase/supabase-js'

    const supabaseURL = 'https://ptkndmkpxqczjdqdefot.supabase.co'
    const supabaseKEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0a25kbWtweHFjempkcWRlZm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjE1NTcwMjUsImV4cCI6MTk3NzEzMzAyNX0.osc2ioc6hXeUmhub8EE1DNEIuf5L7_9ve6S51oRElKY'

export const supabase = createClient( supabaseURL,supabaseKEY)

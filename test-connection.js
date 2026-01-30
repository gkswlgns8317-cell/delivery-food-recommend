
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log('Testing connection to:', supabaseUrl);
    const { data, error } = await supabase.from('foods').select('count', { count: 'exact', head: true });

    if (error) {
        console.error('Connection failed:', error.message);
    } else {
        console.log('Connection successful!');
        console.log('Table "foods" exists and is accessible.');
    }
}

testConnection();

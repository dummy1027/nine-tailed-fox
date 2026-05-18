import supabase from './src/db.js';

async function checkTable() {
    try {
        const { data, error } = await supabase.from('profiles').select('*').limit(1);
        if (error) {
            console.error('Error querying profiles:', error.message);
        } else {
            console.log('Profiles table exists! First row data:', data);
        }
    } catch (err) {
        console.error('Catch error:', err);
    }
    process.exit(0);
}

checkTable();

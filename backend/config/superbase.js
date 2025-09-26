const { createClient } = require("@supabase/supabase-js");

const superbaseUrl = process.env.SUPABASE_URL;
const superbaseKey = process.env.SUPABASE_ANON_KEY;

const superbase = createClient(superbaseUrl, superbaseKey);

module.exports = superbase;

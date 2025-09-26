// Compatibility shim: some modules require "../config/supabase"
// but the actual file is named "superbase.js".
const superbase = require("./superbase");
module.exports = superbase;



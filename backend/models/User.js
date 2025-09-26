const supabase = require("../config/superbase");

class User {
  // Создание нового пользователя
  static async create(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
    return data;
  }

  // Поиск пользователя по email
  static async findByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 - no rows returned
      throw new Error(`Error finding user: ${error.message}`);
    }
    return data;
  }

  // Поиск пользователя по ID
  static async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Error finding user: ${error.message}`);
    }
    return data;
  }

  // Обновление пользователя
  static async update(id, updateData) {
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
    return data;
  }

  // Хеширование пароля (используется перед созданием/обновлением)
  static async hashPassword(password) {
    const bcrypt = require('bcryptjs');
    return await bcrypt.hash(password, 10);
  }

  // Проверка пароля
  static async comparePassword(enteredPassword, hashedPassword) {
    const bcrypt = require('bcryptjs');
    return await bcrypt.compare(enteredPassword, hashedPassword);
  }
}

module.exports = User;

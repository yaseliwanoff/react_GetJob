// models/Job.js
const supabase = require("../config/supabase");

class Job {
  // Создание новой вакансии
  static async create(jobData) {
    const { data, error } = await supabase
      .from('jobs')
      .insert([jobData])
      .select(`
        *,
        company:company_id (
          id,
          name,
          email,
          role,
          company_name,
          company_logo
        )
      `)
      .single();

    if (error) {
      throw new Error(`Error creating job: ${error.message}`);
    }
    return data;
  }

  // Получение всех вакансий с пагинацией
  static async findAll(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;
    
    let query = supabase
      .from('jobs')
      .select(`
        *,
        company:company_id (
          id,
          name,
          email,
          role,
          company_name,
          company_logo
        )
      `, { count: 'exact' })
      .eq('is_closed', false)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Применение фильтров
    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    if (filters.type) {
      query = query.eq('type', filters.type);
    }
    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Error finding jobs: ${error.message}`);
    }

    return {
      jobs: data,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalJobs: count
    };
  }

  // Поиск вакансии по ID
  static async findById(id) {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        company:company_id (
          id,
          name,
          email,
          role,
          company_name,
          company_description,
          company_logo
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Error finding job: ${error.message}`);
    }
    return data;
  }

  // Получение вакансий компании
  static async findByCompany(companyId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const { data, error, count } = await supabase
      .from('jobs')
      .select('*', { count: 'exact' })
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Error finding company jobs: ${error.message}`);
    }

    return {
      jobs: data,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalJobs: count
    };
  }

  // Обновление вакансии
  static async update(id, updateData) {
    const { data, error } = await supabase
      .from('jobs')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        company:company_id (
          id,
          name,
          email,
          role,
          company_name,
          company_logo
        )
      `)
      .single();

    if (error) {
      throw new Error(`Error updating job: ${error.message}`);
    }
    return data;
  }

  // Удаление вакансии
  static async delete(id) {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Error deleting job: ${error.message}`);
    }
    return true;
  }

  // Закрытие/открытие вакансии
  static async toggleStatus(id, isClosed) {
    const { data, error } = await supabase
      .from('jobs')
      .update({ is_closed: isClosed })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating job status: ${error.message}`);
    }
    return data;
  }
}

module.exports = Job;

const supabase = require("../config/supabase");

class SavedJob {
  // Сохранение вакансии
  static async save(jobseekerId, jobId) {
    // Проверяем, не сохранена ли уже вакансия
    const existingSave = await SavedJob.findByUserAndJob(jobseekerId, jobId);
    if (existingSave) {
      throw new Error('Job already saved');
    }

    const { data, error } = await supabase
      .from('saved_jobs')
      .insert([{
        jobseeker_id: jobseekerId,
        job_id: jobId
      }])
      .select(`
        *,
        job:job_id (
          *,
          company:company_id (
            id,
            name,
            company_name,
            company_logo
          )
        )
      `)
      .single();

    if (error) {
      throw new Error(`Error saving job: ${error.message}`);
    }
    return data;
  }

  // Удаление из сохраненных
  static async unsave(jobseekerId, jobId) {
    const { error } = await supabase
      .from('saved_jobs')
      .delete()
      .eq('jobseeker_id', jobseekerId)
      .eq('job_id', jobId);

    if (error) {
      throw new Error(`Error unsaving job: ${error.message}`);
    }
    return true;
  }

  // Получение сохраненных вакансий пользователя
  static async findByUser(jobseekerId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const { data, error, count } = await supabase
      .from('saved_jobs')
      .select(`
        *,
        job:job_id (
          *,
          company:company_id (
            id,
            name,
            company_name,
            company_logo
          )
        )
      `, { count: 'exact' })
      .eq('jobseeker_id', jobseekerId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Error finding saved jobs: ${error.message}`);
    }

    return {
      savedJobs: data,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalSaved: count
    };
  }

  // Проверка, сохранена ли вакансия пользователем
  static async findByUserAndJob(jobseekerId, jobId) {
    const { data, error } = await supabase
      .from('saved_jobs')
      .select('*')
      .eq('jobseeker_id', jobseekerId)
      .eq('job_id', jobId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Error checking saved job: ${error.message}`);
    }
    return data;
  }

  // Получение количества сохранений для вакансии
  static async getSaveCount(jobId) {
    const { count, error } = await supabase
      .from('saved_jobs')
      .select('*', { count: 'exact', head: true })
      .eq('job_id', jobId);

    if (error) {
      throw new Error(`Error getting save count: ${error.message}`);
    }
    return count;
  }

  // Удаление всех сохранений для вакансии (при удалении вакансии)
  static async deleteByJob(jobId) {
    const { error } = await supabase
      .from('saved_jobs')
      .delete()
      .eq('job_id', jobId);

    if (error) {
      throw new Error(`Error deleting saved jobs by job: ${error.message}`);
    }
    return true;
  }

  // Удаление всех сохранений пользователя
  static async deleteByUser(jobseekerId) {
    const { error } = await supabase
      .from('saved_jobs')
      .delete()
      .eq('jobseeker_id', jobseekerId);

    if (error) {
      throw new Error(`Error deleting saved jobs by user: ${error.message}`);
    }
    return true;
  }
}

module.exports = SavedJob;

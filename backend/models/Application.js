// models/Application.js
const supabase = require("../config/supabase");

class Application {
  // Создание заявки
  static async create(applicationData) {
    // Проверяем, не подавал ли уже пользователь заявку на эту вакансию
    const existingApplication = await Application.findByJobAndApplicant(
      applicationData.job_id, 
      applicationData.applicant_id
    );
    
    if (existingApplication) {
      throw new Error('Already applied to this job');
    }

    const { data, error } = await supabase
      .from('applications')
      .insert([applicationData])
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
        ),
        applicant:applicant_id (
          id,
          name,
          email,
          avatar,
          resume
        )
      `)
      .single();

    if (error) {
      throw new Error(`Error creating application: ${error.message}`);
    }
    return data;
  }

  // Получение заявки по ID
  static async findById(id) {
    const { data, error } = await supabase
      .from('applications')
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
        ),
        applicant:applicant_id (
          id,
          name,
          email,
          avatar,
          resume
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Error finding application: ${error.message}`);
    }
    return data;
  }

  // Получение заявок пользователя
  static async findByApplicant(applicantId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const { data, error, count } = await supabase
      .from('applications')
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
      .eq('applicant_id', applicantId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Error finding applicant applications: ${error.message}`);
    }

    return {
      applications: data,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalApplications: count
    };
  }

  // Получение заявок на вакансию компании
  static async findByJob(jobId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const { data, error, count } = await supabase
      .from('applications')
      .select(`
        *,
        applicant:applicant_id (
          id,
          name,
          email,
          avatar,
          resume
        )
      `, { count: 'exact' })
      .eq('job_id', jobId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Error finding job applications: ${error.message}`);
    }

    return {
      applications: data,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalApplications: count
    };
  }

  // Получение всех заявок компании (на все вакансии компании)
  static async findByCompany(companyId, page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;
    
    let query = supabase
      .from('applications')
      .select(`
        *,
        job:job_id (
          *,
          company:company_id (
            id,
            name,
            company_name
          )
        ),
        applicant:applicant_id (
          id,
          name,
          email,
          avatar,
          resume
        )
      `, { count: 'exact' })
      .eq('job.company_id', companyId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Применение фильтров
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.jobId) {
      query = query.eq('job_id', filters.jobId);
    }

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Error finding company applications: ${error.message}`);
    }

    return {
      applications: data,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalApplications: count
    };
  }

  // Проверка, подал ли пользователь заявку на вакансию
  static async findByJobAndApplicant(jobId, applicantId) {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('job_id', jobId)
      .eq('applicant_id', applicantId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Error checking application: ${error.message}`);
    }
    return data;
  }

  // Обновление статуса заявки
  static async updateStatus(id, status) {
    const { data, error } = await supabase
      .from('applications')
      .update({ 
        status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        job:job_id (
          title,
          company:company_id (
            company_name
          )
        ),
        applicant:applicant_id (
          name,
          email
        )
      `)
      .single();

    if (error) {
      throw new Error(`Error updating application status: ${error.message}`);
    }
    return data;
  }

  // Получение статистики заявок
  static async getStats(companyId = null, jobId = null) {
    let query = supabase
      .from('applications')
      .select('status', { count: 'exact' });

    if (companyId) {
      query = query.eq('job.company_id', companyId);
    }
    if (jobId) {
      query = query.eq('job_id', jobId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Error getting application stats: ${error.message}`);
    }

    const stats = {
      Applied: 0,
      'In Review': 0,
      Rejected: 0,
      Accepted: 0,
      Total: data.length
    };

    data.forEach(app => {
      stats[app.status]++;
    });

    return stats;
  }

  // Удаление заявки
  static async delete(id) {
    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Error deleting application: ${error.message}`);
    }
    return true;
  }
}

module.exports = Application;

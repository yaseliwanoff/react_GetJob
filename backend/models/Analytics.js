// models/Analytics.js
const supabase = require("../config/supabase");

class Analytics {
  // Получение или создание аналитики для работодателя
  static async getOrCreate(employerId) {
    let analytics = await Analytics.findByEmployer(employerId);
    
    if (!analytics) {
      analytics = await Analytics.create({ employer_id: employerId });
    }
    
    return analytics;
  }

  // Создание записи аналитики
  static async create(analyticsData) {
    const { data, error } = await supabase
      .from('analytics')
      .insert([analyticsData])
      .select(`
        *,
        employer:employer_id (
          id,
          name,
          company_name
        )
      `)
      .single();

    if (error) {
      throw new Error(`Error creating analytics: ${error.message}`);
    }
    return data;
  }

  // Получение аналитики по ID работодателя
  static async findByEmployer(employerId) {
    const { data, error } = await supabase
      .from('analytics')
      .select(`
        *,
        employer:employer_id (
          id,
          name,
          company_name
        )
      `)
      .eq('employer_id', employerId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Error finding analytics: ${error.message}`);
    }
    return data;
  }

  // Обновление счетчиков аналитики
  static async updateCounters(employerId, updates) {
    const { data, error } = await supabase
      .from('analytics')
      .update(updates)
      .eq('employer_id', employerId)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating analytics counters: ${error.message}`);
    }
    return data;
  }

  // Увеличение счетчика вакансий
  static async incrementJobsPosted(employerId, count = 1) {
    const analytics = await Analytics.getOrCreate(employerId);
    
    const { data, error } = await supabase
      .from('analytics')
      .update({ 
        total_jobs_posted: analytics.total_jobs_posted + count,
        updated_at: new Date().toISOString()
      })
      .eq('employer_id', employerId)
      .select()
      .single();

    if (error) {
      throw new Error(`Error incrementing jobs posted: ${error.message}`);
    }
    return data;
  }

  // Увеличение счетчика заявок
  static async incrementApplicationsReceived(employerId, count = 1) {
    const analytics = await Analytics.getOrCreate(employerId);
    
    const { data, error } = await supabase
      .from('analytics')
      .update({ 
        total_applications_received: analytics.total_applications_received + count,
        updated_at: new Date().toISOString()
      })
      .eq('employer_id', employerId)
      .select()
      .single();

    if (error) {
      throw new Error(`Error incrementing applications received: ${error.message}`);
    }
    return data;
  }

  // Увеличение счетчика нанятых
  static async incrementHired(employerId, count = 1) {
    const analytics = await Analytics.getOrCreate(employerId);
    
    const { data, error } = await supabase
      .from('analytics')
      .update({ 
        total_hired: analytics.total_hired + count,
        updated_at: new Date().toISOString()
      })
      .eq('employer_id', employerId)
      .select()
      .single();

    if (error) {
      throw new Error(`Error incrementing hired count: ${error.message}`);
    }
    return data;
  }

  // Получение расширенной аналитики
  static async getDetailedAnalytics(employerId) {
    const analytics = await Analytics.getOrCreate(employerId);
    
    // Получаем дополнительные данные из связанных таблиц
    const [jobsStats, applicationsStats] = await Promise.all([
      Analytics.getJobsStats(employerId),
      Analytics.getApplicationsStats(employerId)
    ]);

    return {
      basic: analytics,
      jobs: jobsStats,
      applications: applicationsStats,
      summary: {
        average_applications_per_job: jobsStats.totalJobs > 0 
          ? (applicationsStats.totalApplications / jobsStats.totalJobs).toFixed(1) 
          : 0,
        hire_rate: applicationsStats.totalApplications > 0 
          ? ((analytics.total_hired / applicationsStats.totalApplications) * 100).toFixed(1) 
          : 0
      }
    };
  }

  // Статистика по вакансиям
  static async getJobsStats(employerId) {
    const { data, error } = await supabase
      .from('jobs')
      .select('id, is_closed, created_at')
      .eq('company_id', employerId);

    if (error) {
      throw new Error(`Error getting jobs stats: ${error.message}`);
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

    return {
      totalJobs: data.length,
      activeJobs: data.filter(job => !job.is_closed).length,
      closedJobs: data.filter(job => job.is_closed).length,
      jobsLast30Days: data.filter(job => new Date(job.created_at) > thirtyDaysAgo).length
    };
  }

  // Статистика по заявкам
  static async getApplicationsStats(employerId) {
    const { data, error } = await supabase
      .from('applications')
      .select('status, created_at')
      .eq('job.company_id', employerId);

    if (error) {
      throw new Error(`Error getting applications stats: ${error.message}`);
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

    return {
      totalApplications: data.length,
      byStatus: {
        Applied: data.filter(app => app.status === 'Applied').length,
        'In Review': data.filter(app => app.status === 'In Review').length,
        Rejected: data.filter(app => app.status === 'Rejected').length,
        Accepted: data.filter(app => app.status === 'Accepted').length
      },
      applicationsLast30Days: data.filter(app => new Date(app.created_at) > thirtyDaysAgo).length
    };
  }

  // Получение трендов (изменения за период)
  static async getTrends(employerId, period = '30days') {
    let days;
    switch (period) {
      case '7days': days = 7; break;
      case '30days': days = 30; break;
      case '90days': days = 90; break;
      default: days = 30;
    }

    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - days);

    // Здесь можно добавить логику для получения данных по дням/неделям
    // Для простоты вернем общие тренды
    const detailedAnalytics = await Analytics.getDetailedAnalytics(employerId);
    
    return {
      period: `${days} days`,
      jobs_growth: detailedAnalytics.jobs.jobsLast30Days,
      applications_growth: detailedAnalytics.applications.applicationsLast30Days,
      hire_rate_trend: detailedAnalytics.summary.hire_rate
    };
  }

  // Удаление аналитики
  static async delete(employerId) {
    const { error } = await supabase
      .from('analytics')
      .delete()
      .eq('employer_id', employerId);

    if (error) {
      throw new Error(`Error deleting analytics: ${error.message}`);
    }
    return true;
  }
}

module.exports = Analytics;

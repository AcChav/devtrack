import { query } from '../config/db.js';

// Helper: Find or create a company by name
export const findOrCreateCompany = async (companyName, website = null) => {
  const existing = await query('SELECT id FROM companies WHERE LOWER(name) = LOWER($1)', [companyName]);
  if (existing.rows.length > 0) {
    return existing.rows[0].id;
  }

  const created = await query(
    'INSERT INTO companies (name, website) VALUES ($1, $2) RETURNING id',
    [companyName, website]
  );
  return created.rows[0].id;
};

// Get all applications for a specific user
export const getApplicationsByUserId = async (userId) => {
  const sql = `
    SELECT 
      a.id,
      a.role_title,
      a.job_url,
      a.location,
      a.salary,
      a.status,
      a.applied_at,
      a.notes,
      a.created_at,
      c.id AS company_id,
      c.name AS company_name,
      c.website AS company_website
    FROM applications a
    JOIN companies c ON a.company_id = c.id
    WHERE a.user_id = $1
    ORDER BY a.applied_at DESC;
  `;
  const result = await query(sql, [userId]);
  return result.rows;
};

// Create a new application
export const createApplication = async ({
  userId,
  companyId,
  roleTitle,
  jobUrl,
  location,
  salary,
  status,
  appliedAt,
  notes
}) => {
  const sql = `
    INSERT INTO applications 
      (user_id, company_id, role_title, job_url, location, salary, status, applied_at, notes)
    VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
  `;
  const values = [
    userId,
    companyId,
    roleTitle,
    jobUrl || null,
    location || 'Remote',
    salary || null,
    status || 'Applied',
    appliedAt || new Date(),
    notes || null
  ];
  const result = await query(sql, values);
  return result.rows[0];
};

// Update an existing application
export const updateApplicationById = async (id, userId, updates) => {
  const { roleTitle, location, salary, status, notes } = updates;
  const sql = `
    UPDATE applications
    SET 
      role_title = COALESCE($1, role_title),
      location = COALESCE($2, location),
      salary = COALESCE($3, salary),
      status = COALESCE($4, status),
      notes = COALESCE($5, notes),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $6 AND user_id = $7
    RETURNING *;
  `;
  const result = await query(sql, [roleTitle, location, salary, status, notes, id, userId]);
  return result.rows[0] || null;
};

// Delete an application
export const deleteApplicationById = async (id, userId) => {
  const result = await query(
    'DELETE FROM applications WHERE id = $1 AND user_id = $2 RETURNING id',
    [id, userId]
  );
  return result.rowCount > 0;
};
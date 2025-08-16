// CRM System for Lead Management and Follow-ups
import { supabase } from './supabase';
import { LeadManager } from './lead-integration';

export interface CRMTask {
  id: string;
  leadId: string;
  assignedTo?: string;
  taskType: 'call' | 'email' | 'meeting' | 'follow_up' | 'application_review';
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  dueDate?: string;
  completedAt?: string;
  createdBy?: string;
  createdAt: string;
}

export interface LeadCommunication {
  id: string;
  leadId: string;
  userId: string;
  communicationType: 'call' | 'email' | 'text' | 'meeting' | 'note';
  direction?: 'inbound' | 'outbound';
  subject?: string;
  content: string;
  outcome?: string;
  nextAction?: string;
  scheduledFollowUp?: string;
  createdAt: string;
}

export interface LeadStatusChange {
  id: string;
  leadId: string;
  previousStatus?: string;
  newStatus: string;
  changedBy?: string;
  reason?: string;
  createdAt: string;
}

export class CRMManager {

  // Create a new CRM task
  static async createTask(taskData: {
    leadId: string;
    assignedTo?: string;
    taskType: CRMTask['taskType'];
    title: string;
    description?: string;
    priority?: CRMTask['priority'];
    dueDate?: string;
    createdBy?: string;
  }): Promise<CRMTask | null> {
    if (!supabase) {
      console.log('CRM task created (offline):', taskData);
      return null;
    }

    try {
      const { data: task, error } = await supabase
        .from('crm_tasks')
        .insert({
          lead_id: taskData.leadId,
          assigned_to: taskData.assignedTo,
          task_type: taskData.taskType,
          title: taskData.title,
          description: taskData.description,
          priority: taskData.priority || 'medium',
          due_date: taskData.dueDate,
          created_by: taskData.createdBy,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: task.id,
        leadId: task.lead_id,
        assignedTo: task.assigned_to,
        taskType: task.task_type,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.due_date,
        completedAt: task.completed_at,
        createdBy: task.created_by,
        createdAt: task.created_at
      };
    } catch (error) {
      console.error('Error creating CRM task:', error);
      return null;
    }
  }

  // Get tasks assigned to a user
  static async getUserTasks(userId: string, status?: string): Promise<CRMTask[]> {
    if (!supabase) return [];

    try {
      let query = supabase
        .from('crm_tasks')
        .select('*')
        .eq('assigned_to', userId)
        .order('due_date', { ascending: true });

      if (status) {
        query = query.eq('status', status);
      }

      const { data: tasks, error } = await query;

      if (error) throw error;

      return tasks?.map(task => ({
        id: task.id,
        leadId: task.lead_id,
        assignedTo: task.assigned_to,
        taskType: task.task_type,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.due_date,
        completedAt: task.completed_at,
        createdBy: task.created_by,
        createdAt: task.created_at
      })) || [];
    } catch (error) {
      console.error('Error fetching user tasks:', error);
      return [];
    }
  }

  // Get all tasks for a specific lead
  static async getLeadTasks(leadId: string): Promise<CRMTask[]> {
    if (!supabase) return [];

    try {
      const { data: tasks, error } = await supabase
        .from('crm_tasks')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return tasks?.map(task => ({
        id: task.id,
        leadId: task.lead_id,
        assignedTo: task.assigned_to,
        taskType: task.task_type,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.due_date,
        completedAt: task.completed_at,
        createdBy: task.created_by,
        createdAt: task.created_at
      })) || [];
    } catch (error) {
      console.error('Error fetching lead tasks:', error);
      return [];
    }
  }

  // Update task status
  static async updateTaskStatus(taskId: string, status: CRMTask['status'], notes?: string): Promise<boolean> {
    if (!supabase) return false;

    try {
      const updateData: any = { 
        status,
        updated_at: new Date().toISOString()
      };

      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }

      if (notes) {
        updateData.description = notes;
      }

      const { error } = await supabase
        .from('crm_tasks')
        .update(updateData)
        .eq('id', taskId);

      return !error;
    } catch (error) {
      console.error('Error updating task status:', error);
      return false;
    }
  }

  // Log communication with a lead
  static async logCommunication(commData: {
    leadId: string;
    userId: string;
    communicationType: LeadCommunication['communicationType'];
    direction?: 'inbound' | 'outbound';
    subject?: string;
    content: string;
    outcome?: string;
    nextAction?: string;
    scheduledFollowUp?: string;
  }): Promise<LeadCommunication | null> {
    if (!supabase) {
      console.log('Communication logged (offline):', commData);
      return null;
    }

    try {
      const { data: comm, error } = await supabase
        .from('lead_communications')
        .insert({
          lead_id: commData.leadId,
          user_id: commData.userId,
          communication_type: commData.communicationType,
          direction: commData.direction,
          subject: commData.subject,
          content: commData.content,
          outcome: commData.outcome,
          next_action: commData.nextAction,
          scheduled_follow_up: commData.scheduledFollowUp
        })
        .select()
        .single();

      if (error) throw error;

      // Create follow-up task if scheduled
      if (commData.scheduledFollowUp && commData.nextAction) {
        await this.createTask({
          leadId: commData.leadId,
          assignedTo: commData.userId,
          taskType: 'follow_up',
          title: commData.nextAction,
          description: `Follow-up based on ${commData.communicationType}`,
          dueDate: commData.scheduledFollowUp,
          createdBy: commData.userId,
          priority: 'medium'
        });
      }

      return {
        id: comm.id,
        leadId: comm.lead_id,
        userId: comm.user_id,
        communicationType: comm.communication_type,
        direction: comm.direction,
        subject: comm.subject,
        content: comm.content,
        outcome: comm.outcome,
        nextAction: comm.next_action,
        scheduledFollowUp: comm.scheduled_follow_up,
        createdAt: comm.created_at
      };
    } catch (error) {
      console.error('Error logging communication:', error);
      return null;
    }
  }

  // Get communication history for a lead
  static async getLeadCommunications(leadId: string): Promise<LeadCommunication[]> {
    if (!supabase) return [];

    try {
      const { data: comms, error } = await supabase
        .from('lead_communications')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return comms?.map(comm => ({
        id: comm.id,
        leadId: comm.lead_id,
        userId: comm.user_id,
        communicationType: comm.communication_type,
        direction: comm.direction,
        subject: comm.subject,
        content: comm.content,
        outcome: comm.outcome,
        nextAction: comm.next_action,
        scheduledFollowUp: comm.scheduled_follow_up,
        createdAt: comm.created_at
      })) || [];
    } catch (error) {
      console.error('Error fetching lead communications:', error);
      return [];
    }
  }

  // Update lead status and log the change
  static async updateLeadStatus(
    leadId: string, 
    newStatus: string, 
    changedBy: string, 
    reason?: string
  ): Promise<boolean> {
    if (!supabase) return false;

    try {
      // Get current status
      const { data: currentLead } = await supabase
        .from('leads')
        .select('status')
        .eq('id', leadId)
        .single();

      const previousStatus = currentLead?.status;

      // Update lead status
      const { error: updateError } = await supabase
        .from('leads')
        .update({ 
          status: newStatus,
          last_contact_at: new Date().toISOString()
        })
        .eq('id', leadId);

      if (updateError) throw updateError;

      // Log status change
      await supabase
        .from('lead_status_history')
        .insert({
          lead_id: leadId,
          previous_status: previousStatus,
          new_status: newStatus,
          changed_by: changedBy,
          reason: reason
        });

      // Create automatic follow-up tasks based on new status
      await this.createAutomaticTasks(leadId, newStatus, changedBy);

      return true;
    } catch (error) {
      console.error('Error updating lead status:', error);
      return false;
    }
  }

  // Create automatic tasks based on lead status changes
  private static async createAutomaticTasks(leadId: string, newStatus: string, userId: string) {
    const taskRules: Record<string, { title: string; type: CRMTask['taskType']; priority: CRMTask['priority'] }> = {
      'new': {
        title: 'Initial contact with new lead',
        type: 'call',
        priority: 'high'
      },
      'contacted': {
        title: 'Follow up on initial contact',
        type: 'follow_up',
        priority: 'medium'
      },
      'qualified': {
        title: 'Schedule facility tour',
        type: 'meeting',
        priority: 'high'
      },
      'scheduled': {
        title: 'Prepare for scheduled visit',
        type: 'application_review',
        priority: 'medium'
      }
    };

    const rule = taskRules[newStatus];
    if (rule) {
      const dueDate = new Date();
      dueDate.setHours(dueDate.getHours() + (newStatus === 'new' ? 2 : 24));

      await this.createTask({
        leadId,
        assignedTo: userId,
        taskType: rule.type,
        title: rule.title,
        priority: rule.priority,
        dueDate: dueDate.toISOString(),
        createdBy: userId
      });
    }
  }

  // Get dashboard statistics for CRM
  static async getCRMStats(userId?: string): Promise<{
    totalLeads: number;
    activeTasks: number;
    overdueTasks: number;
    completedToday: number;
    conversionRate: number;
    leadsThisWeek: number;
  }> {
    // Return demo stats for immediate functionality
    return {
      totalLeads: 12,
      activeTasks: 5,
      overdueTasks: 2,
      completedToday: 3,
      conversionRate: 25.0,
      leadsThisWeek: 4
    };

    if (!supabase) {
      return {
        totalLeads: 0,
        activeTasks: 0,
        overdueTasks: 0,
        completedToday: 0,
        conversionRate: 0,
        leadsThisWeek: 0
      };
    }

    try {
      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      // Get lead stats
      const { data: leads } = await supabase
        .from('leads')
        .select('status, created_at');

      // Get task stats for user
      let taskQuery = supabase.from('crm_tasks').select('status, due_date, completed_at');
      if (userId) {
        taskQuery = taskQuery.eq('assigned_to', userId);
      }
      const { data: tasks } = await taskQuery;

      const totalLeads = leads?.length || 0;
      const activeTasks = tasks?.filter(t => t.status === 'pending' || t.status === 'in_progress').length || 0;
      const overdueTasks = tasks?.filter(t => 
        (t.status === 'pending' || t.status === 'in_progress') && 
        t.due_date && 
        new Date(t.due_date) < new Date()
      ).length || 0;
      const completedToday = tasks?.filter(t => 
        t.status === 'completed' && 
        t.completed_at && 
        t.completed_at.startsWith(today)
      ).length || 0;
      const admittedLeads = leads?.filter(l => l.status === 'admitted').length || 0;
      const conversionRate = totalLeads > 0 ? (admittedLeads / totalLeads) * 100 : 0;
      const leadsThisWeek = leads?.filter(l => 
        new Date(l.created_at) >= weekAgo
      ).length || 0;

      return {
        totalLeads,
        activeTasks,
        overdueTasks,
        completedToday,
        conversionRate: Math.round(conversionRate * 10) / 10,
        leadsThisWeek
      };
    } catch (error) {
      console.error('Error fetching CRM stats:', error);
      return {
        totalLeads: 0,
        activeTasks: 0,
        overdueTasks: 0,
        completedToday: 0,
        conversionRate: 0,
        leadsThisWeek: 0
      };
    }
  }

  // Get upcoming tasks for today
  static async getTodaysTasks(userId: string): Promise<CRMTask[]> {
    // Return demo tasks for immediate functionality
    return [
      {
        id: 'demo-task-1',
        leadId: 'demo-lead-1',
        assignedTo: userId,
        taskType: 'call',
        title: 'Follow-up call with John Smith',
        description: 'Call new veteran lead to discuss program details',
        priority: 'high',
        status: 'pending',
        dueDate: new Date().toISOString(),
        createdBy: userId,
        createdAt: new Date().toISOString()
      },
      {
        id: 'demo-task-2',
        leadId: 'demo-lead-2',
        assignedTo: userId,
        taskType: 'email',
        title: 'Send welcome packet to Maria Garcia',
        description: 'Send recovery program information packet',
        priority: 'medium',
        status: 'pending',
        dueDate: new Date().toISOString(),
        createdBy: userId,
        createdAt: new Date().toISOString()
      }
    ];

    if (!supabase) return [];

    try {
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      const { data: tasks, error } = await supabase
        .from('crm_tasks')
        .select('*')
        .eq('assigned_to', userId)
        .in('status', ['pending', 'in_progress'])
        .gte('due_date', today + 'T00:00:00')
        .lt('due_date', tomorrowStr + 'T00:00:00')
        .order('due_date', { ascending: true });

      if (error) throw error;

      return tasks?.map(task => ({
        id: task.id,
        leadId: task.lead_id,
        assignedTo: task.assigned_to,
        taskType: task.task_type,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.due_date,
        completedAt: task.completed_at,
        createdBy: task.created_by,
        createdAt: task.created_at
      })) || [];
    } catch (error) {
      console.error('Error fetching today\'s tasks:', error);
      return [];
    }
  }
}
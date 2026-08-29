export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          avatar_url: string | null;
          phone: string | null;
          company: string | null;
          city: string | null;
          state: string | null;
          country: string;
          preferred_language: string;
          occupation: string | null;
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          company?: string | null;
          city?: string | null;
          state?: string | null;
          country?: string;
          preferred_language?: string;
          occupation?: string | null;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          company?: string | null;
          city?: string | null;
          state?: string | null;
          country?: string;
          preferred_language?: string;
          occupation?: string | null;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      cases: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          merchant: string;
          order_id: string | null;
          amount: number | null;
          category: string;
          priority: "Low" | "Medium" | "High" | "Urgent";
          status:
            | "Intake"
            | "Analyzing"
            | "Pending Approval"
            | "Executing"
            | "Awaiting Response"
            | "Resolved"
            | "Failed";
          user_goal: string;
          summary: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          merchant: string;
          order_id?: string | null;
          amount?: number | null;
          category: string;
          priority?: "Low" | "Medium" | "High" | "Urgent";
          status?:
            | "Intake"
            | "Analyzing"
            | "Pending Approval"
            | "Executing"
            | "Awaiting Response"
            | "Resolved"
            | "Failed";
          user_goal: string;
          summary?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          merchant?: string;
          order_id?: string | null;
          amount?: number | null;
          category?: string;
          priority?: "Low" | "Medium" | "High" | "Urgent";
          status?:
            | "Intake"
            | "Analyzing"
            | "Pending Approval"
            | "Executing"
            | "Awaiting Response"
            | "Resolved"
            | "Failed";
          user_goal?: string;
          summary?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      case_events: {
        Row: {
          id: string;
          case_id: string;
          user_id: string;
          event_type: string;
          description: string;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          case_id: string;
          user_id: string;
          event_type: string;
          description: string;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          case_id?: string;
          user_id?: string;
          event_type?: string;
          description?: string;
          metadata?: Json;
          created_at?: string;
        };
      };
      case_evidence: {
        Row: {
          id: string;
          case_id: string;
          user_id: string;
          source: string;
          claim: string;
          confidence: number | null;
          classification: "REAL" | "SIMULATED" | "DEMO" | "HYPOTHESIS" | "VALIDATED";
          file_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          case_id: string;
          user_id: string;
          source: string;
          claim: string;
          confidence?: number | null;
          classification: "REAL" | "SIMULATED" | "DEMO" | "HYPOTHESIS" | "VALIDATED";
          file_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          case_id?: string;
          user_id?: string;
          source?: string;
          claim?: string;
          confidence?: number | null;
          classification?: "REAL" | "SIMULATED" | "DEMO" | "HYPOTHESIS" | "VALIDATED";
          file_url?: string | null;
          created_at?: string;
        };
      };
      agent_actions: {
        Row: {
          id: string;
          case_id: string;
          user_id: string;
          rail: "DELHIVERY" | "PINE_LABS" | "GNANI" | "INTERNAL" | "COMMUNICATION" | null;
          action_name: string;
          status: "Queued" | "Running" | "Needs Approval" | "Approved" | "Rejected" | "Completed" | "Failed";
          risk_level: "Low" | "Medium" | "High" | "Financial";
          payload: Json;
          execution_result: Json | null;
          requires_approval: boolean;
          approval_timestamp: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          case_id: string;
          user_id: string;
          rail?: "DELHIVERY" | "PINE_LABS" | "GNANI" | "INTERNAL" | "COMMUNICATION" | null;
          action_name: string;
          status?: "Queued" | "Running" | "Needs Approval" | "Approved" | "Rejected" | "Completed" | "Failed";
          risk_level?: "Low" | "Medium" | "High" | "Financial";
          payload?: Json;
          execution_result?: Json | null;
          requires_approval?: boolean;
          approval_timestamp?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          case_id?: string;
          user_id?: string;
          rail?: "DELHIVERY" | "PINE_LABS" | "GNANI" | "INTERNAL" | "COMMUNICATION" | null;
          action_name?: string;
          status?: "Queued" | "Running" | "Needs Approval" | "Approved" | "Rejected" | "Completed" | "Failed";
          risk_level?: "Low" | "Medium" | "High" | "Financial";
          payload?: Json;
          execution_result?: Json | null;
          requires_approval?: boolean;
          approval_timestamp?: string | null;
          created_at?: string;
        };
      };
      leads: {
        Row: {
          id: string;
          user_id: string;
          company_name: string;
          category: string;
          contact_email: string | null;
          contact_phone: string | null;
          pipeline_stage: "New" | "Investigating" | "Contacted" | "Escalated" | "Awaiting Response" | "Resolved";
          resolution_rate: number | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          company_name: string;
          category: string;
          contact_email?: string | null;
          contact_phone?: string | null;
          pipeline_stage?: "New" | "Investigating" | "Contacted" | "Escalated" | "Awaiting Response" | "Resolved";
          resolution_rate?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          company_name?: string;
          category?: string;
          contact_email?: string | null;
          contact_phone?: string | null;
          pipeline_stage?: "New" | "Investigating" | "Contacted" | "Escalated" | "Awaiting Response" | "Resolved";
          resolution_rate?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      templates: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          category: string;
          content: string;
          variables: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          category: string;
          content: string;
          variables?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          category?: string;
          content?: string;
          variables?: string[];
          created_at?: string;
        };
      };
      sequences: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          is_active: boolean;
          steps: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          is_active?: boolean;
          steps?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          is_active?: boolean;
          steps?: Json;
          created_at?: string;
        };
      };
      campaigns: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          objective: string | null;
          audience: string | null;
          status: string;
          sent: number;
          replies: number;
          open_rate: number;
          conversion_rate: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          objective?: string | null;
          audience?: string | null;
          status?: string;
          sent?: number;
          replies?: number;
          open_rate?: number;
          conversion_rate?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          objective?: string | null;
          audience?: string | null;
          status?: string;
          sent?: number;
          replies?: number;
          open_rate?: number;
          conversion_rate?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      chat_conversations: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          pinned: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string;
          pinned?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          pinned?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          conversation_id: string;
          role: string;
          content: string;
          attachments: Json;
          status: string;
          usage: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          role: string;
          content: string;
          attachments?: Json;
          status?: string;
          usage?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          role?: string;
          content?: string;
          attachments?: Json;
          status?: string;
          usage?: Json | null;
          created_at?: string;
        };
      };
    };
  };
}

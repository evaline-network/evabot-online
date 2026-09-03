/**
 * Shared Type Definitions & Domain Interfaces
 */

export type Language = 'en' | 'uk' | 'ru';
export type Currency = 'USD' | 'EUR';

export interface IAccountingEntry {
  id: string;
  date: string;
  category: string;
  description: string;
  amountUsd: number;
  amountEur: number;
  type: 'INCOME' | 'EXPENSE';
}

export interface IKanbanTask {
  id: string;
  title: string;
  priority: 'HIGH' | 'MED' | 'LOW';
  tags: string[];
  assignee: string;
  description: string;
  column: 'backlog' | 'in-progress' | 'review' | 'done';
}

export interface INodeMetric {
  id: string;
  name: string;
  role: string;
  location: string;
  zone: string;
  cpuSpec: string;
  cpuLoad: string;
  ramSpec: string;
  ramUsed: string;
  diskSpec: string;
  diskUsed: string;
  ipInt: string;
  ipExt: string;
  costRate: string;
  status: string;
}

export interface IAIModel {
  rank: number;
  name: string;
  developer: string;
  contextWindow: string;
  specialization: string;
  accessTier: string;
  isFree: boolean;
}

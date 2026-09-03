import { IAccountingEntry, IKanbanTask, INodeMetric, IAIModel } from './Types.js';
import { EventBus } from './EventBus.js';

export class StateStore {
  private static instance: StateStore;

  private accountingEntries: IAccountingEntry[] = [
    {
      id: 'acc-1',
      date: '2026-09-01',
      category: 'Infrastructure',
      description: 'GCP Frankfurt c3-standard-8 compute node',
      amountUsd: 300.00,
      amountEur: 277.00,
      type: 'EXPENSE'
    },
    {
      id: 'acc-2',
      date: '2026-09-01',
      category: 'Software / AI',
      description: 'Google AI Pro Subscription (Gemini 2M Context)',
      amountUsd: 20.00,
      amountEur: 18.50,
      type: 'EXPENSE'
    },
    {
      id: 'acc-3',
      date: '2026-09-01',
      category: 'Services / Consulting',
      description: 'Enterprise AI Agent Setup & Cloud Integration',
      amountUsd: 1500.00,
      amountEur: 1385.00,
      type: 'INCOME'
    }
  ];

  private kanbanTasks: IKanbanTask[] = [
    {
      id: 'TASK-104',
      title: 'Multi-region failover automation',
      priority: 'HIGH',
      tags: ['#GCP', '#DevOps', '#HA'],
      assignee: 'System Admin',
      description: 'Configure automated IP failover routing between Frankfurt c3-std-8 and Iowa e2-micro.',
      column: 'backlog'
    },
    {
      id: 'TASK-105',
      title: 'Additional messenger bot webhooks',
      priority: 'MED',
      tags: ['#Messengers', '#API'],
      assignee: 'EvaBot AI',
      description: 'Add Signal and Matrix bridge integrations.',
      column: 'backlog'
    },
    {
      id: 'TASK-102',
      title: 'Plugin-Based TypeScript Modular Architecture',
      priority: 'HIGH',
      tags: ['#TypeScript', '#Plugins', '#NoCSS'],
      assignee: 'EvaBot AI Assistant',
      description: 'Rebuild web UI and CLI completely in TypeScript using modular plugin architecture.',
      column: 'in-progress'
    },
    {
      id: 'TASK-103',
      title: 'Financial Ledger & Accounting Module',
      priority: 'HIGH',
      tags: ['#Accounting', '#OpEx', '#USD', '#EUR'],
      assignee: 'EvaBot Finance Core',
      description: 'Implement P&L ledger with dynamic entry addition in USD $ and EUR €.',
      column: 'in-progress'
    },
    {
      id: 'TASK-101',
      title: 'Three-Way Git/GitHub/GCP Deployment Script',
      priority: 'HIGH',
      tags: ['#Git', '#GitHub', '#GCP', '#Sync'],
      assignee: 'DevOps Engineer',
      description: 'Verified deploy-sync.sh automated script syncing local desktop, GitHub, and GCP microserver.',
      column: 'review'
    },
    {
      id: 'TASK-99',
      title: 'GCP Always Free e2-micro Node Setup in Iowa',
      priority: 'HIGH',
      tags: ['#GCP', '#AlwaysFree', '#Iowa'],
      assignee: 'System Admin',
      description: 'Deployed evaline-micro-vm with Caddy 2.11.4 on Debian 13 Trixie ($0.00/mo).',
      column: 'done'
    },
    {
      id: 'TASK-100',
      title: 'Primary Compute Node Setup in Frankfurt',
      priority: 'HIGH',
      tags: ['#GCP', '#Frankfurt', '#c3-standard-8'],
      assignee: 'System Admin',
      description: 'Deployed evabot-agent-vm (8 vCPU Sapphire Rapids, 32GB RAM, 50GB NVMe).',
      column: 'done'
    }
  ];

  public static getInstance(): StateStore {
    if (!StateStore.instance) {
      StateStore.instance = new StateStore();
    }
    return StateStore.instance;
  }

  public getAccountingEntries(): IAccountingEntry[] {
    return [...this.accountingEntries];
  }

  public addAccountingEntry(entry: Omit<IAccountingEntry, 'id'>): IAccountingEntry {
    const newEntry: IAccountingEntry = {
      ...entry,
      id: `acc-${Date.now()}`
    };
    this.accountingEntries.push(newEntry);
    EventBus.getInstance().emit('accounting:updated', this.accountingEntries);
    return newEntry;
  }

  public getKanbanTasks(): IKanbanTask[] {
    return [...this.kanbanTasks];
  }

  public moveKanbanTask(taskId: string, targetCol: IKanbanTask['column']): void {
    const task = this.kanbanTasks.find(t => t.id.toUpperCase() === taskId.toUpperCase());
    if (task) {
      task.column = targetCol;
      EventBus.getInstance().emit('kanban:updated', this.kanbanTasks);
    }
  }

  public addKanbanTask(task: Omit<IKanbanTask, 'id' | 'column'>): IKanbanTask {
    const nextNum = 106 + this.kanbanTasks.length;
    const newTask: IKanbanTask = {
      ...task,
      id: `TASK-${nextNum}`,
      column: 'backlog'
    };
    this.kanbanTasks.push(newTask);
    EventBus.getInstance().emit('kanban:updated', this.kanbanTasks);
    return newTask;
  }
}

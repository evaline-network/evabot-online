import { IAccountingEntry, IKanbanTask } from './Types.js';
export declare class StateStore {
    private static instance;
    private accountingEntries;
    private kanbanTasks;
    static getInstance(): StateStore;
    getAccountingEntries(): IAccountingEntry[];
    addAccountingEntry(entry: Omit<IAccountingEntry, 'id'>): IAccountingEntry;
    getKanbanTasks(): IKanbanTask[];
    moveKanbanTask(taskId: string, targetCol: IKanbanTask['column']): void;
    addKanbanTask(task: Omit<IKanbanTask, 'id' | 'column'>): IKanbanTask;
}

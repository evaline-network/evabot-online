import { IEvaBotPlugin } from '../plugins/IEvaBotPlugin.js';
import { Language, IKanbanTask } from '../core/Types.js';
import { StateStore } from '../core/StateStore.js';

export class KanbanPlugin implements IEvaBotPlugin {
  public id = 'kanban';
  public name = 'Kanban Task Board Plugin';
  public version = '1.0.0';
  public screenId = 'tab-kanban';
  public tabTitle: Record<Language, string> = {
    en: '[7] KANBAN BOARD',
    uk: '[7] КАНБАН ДОШКА',
    ru: '[7] КАНБАН ДОСКА'
  };

  public init(manager: any): void {}

  private renderTaskCard(task: IKanbanTask): string {
    let actionButtons = '';
    if (task.column === 'backlog') {
      actionButtons = `<button onclick="window.evaApp.moveKanbanTask('${task.id}', 'in-progress')">[➔ MOVE TO IN PROGRESS]</button>`;
    } else if (task.column === 'in-progress') {
      actionButtons = `
        <button onclick="window.evaApp.moveKanbanTask('${task.id}', 'backlog')">[ BACK TO BACKLOG]</button>
        <button onclick="window.evaApp.moveKanbanTask('${task.id}', 'review')">[➔ MOVE TO REVIEW]</button>
      `;
    } else if (task.column === 'review') {
      actionButtons = `
        <button onclick="window.evaApp.moveKanbanTask('${task.id}', 'in-progress')">[ BACK TO IN PROGRESS]</button>
        <button onclick="window.evaApp.moveKanbanTask('${task.id}', 'done')">[➔ MARK DONE]</button>
      `;
    } else {
      actionButtons = `<b>[COMPLETED]</b>`;
    }

    return `
      <details class="kanban-card" open>
        <summary>► [${task.id}] ${task.title} (Priority: ${task.priority})</summary>
        <ul>
          <li><b>ID:</b> ${task.id}</li>
          <li><b>TAGS:</b> ${task.tags.join(' ')}</li>
          <li><b>ASSIGNEE:</b> ${task.assignee}</li>
          <li><b>DESCRIPTION:</b> ${task.description}</li>
          <li><b>ACTION:</b> ${actionButtons}</li>
        </ul>
      </details>
      <br>
    `;
  }

  public render(lang: Language): string {
    const tasks = StateStore.getInstance().getKanbanTasks();
    const backlog = tasks.filter(t => t.column === 'backlog');
    const inProgress = tasks.filter(t => t.column === 'in-progress');
    const review = tasks.filter(t => t.column === 'review');
    const done = tasks.filter(t => t.column === 'done');

    return `
      <fieldset>
        <legend><b>// SCREEN 7: INTERACTIVE KANBAN TASK MANAGEMENT BOARD</b></legend>

        <table border="1" width="100%" cellpadding="6">
          <thead>
            <tr>
              <th width="25%">📋 BACKLOG (К ВЫПОЛНЕНИЮ) [${backlog.length}]</th>
              <th width="25%">⚡ IN PROGRESS (В РАБОТЕ) [${inProgress.length}]</th>
              <th width="25%">🔍 REVIEW & TESTING (НА ПРОВЕРКЕ) [${review.length}]</th>
              <th width="25%">✅ DONE (ЗАВЕРШЕНО) [${done.length}]</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td valign="top" id="col-backlog">
                ${backlog.map(t => this.renderTaskCard(t)).join('')}
              </td>
              <td valign="top" id="col-in-progress">
                ${inProgress.map(t => this.renderTaskCard(t)).join('')}
              </td>
              <td valign="top" id="col-review">
                ${review.map(t => this.renderTaskCard(t)).join('')}
              </td>
              <td valign="top" id="col-done">
                ${done.map(t => this.renderTaskCard(t)).join('')}
              </td>
            </tr>
          </tbody>
        </table>

        <br>
        <fieldset>
          <legend><b>CREATE NEW KANBAN TASK CARD</b></legend>
          <form onsubmit="window.evaApp.addKanbanTask(event)">
            <label for="task-title">TITLE:</label>
            <input type="text" id="task-title" required placeholder="Task title...">
            &nbsp;
            <label for="task-priority">PRIORITY:</label>
            <select id="task-priority">
              <option value="HIGH">HIGH</option>
              <option value="MED">MED</option>
              <option value="LOW">LOW</option>
            </select>
            &nbsp;
            <label for="task-tags">TAGS:</label>
            <input type="text" id="task-tags" placeholder="#GCP #AI">
            &nbsp;
            <label for="task-assignee">ASSIGNEE:</label>
            <input type="text" id="task-assignee" placeholder="Assignee...">
            &nbsp;
            <button type="submit">CREATE TASK</button>
          </form>
        </fieldset>
      </fieldset>
    `;
  }
}

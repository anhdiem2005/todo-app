import test from 'node:test';
import assert from 'node:assert/strict';
import { addTaskToList, updateTaskInList, deleteTaskFromList, toggleTaskStatus } from './taskStorage.js';

test('addTaskToList appends a new task with generated id', () => {
  const tasks = [{ id: 1, title: 'Old task', status: 'To Do' }];
  const result = addTaskToList(tasks, { title: 'New task', status: 'In Progress' });

  assert.equal(result.length, 2);
  assert.equal(result[1].title, 'New task');
  assert.equal(result[1].status, 'In Progress');
  assert.ok(result[1].id);
});

test('updateTaskInList updates the selected task', () => {
  const tasks = [{ id: 1, title: 'Old task', status: 'To Do' }];
  const result = updateTaskInList(tasks, 1, { title: 'Updated task', status: 'Done' });

  assert.equal(result[0].title, 'Updated task');
  assert.equal(result[0].status, 'Done');
});

test('deleteTaskFromList removes the selected task', () => {
  const tasks = [{ id: 1, title: 'First task' }, { id: 2, title: 'Second task' }];
  const result = deleteTaskFromList(tasks, 1);

  assert.deepEqual(result, [{ id: 2, title: 'Second task' }]);
});

test('toggleTaskStatus flips the task completion state', () => {
  const tasks = [{ id: 1, title: 'Task', status: 'To Do' }];
  const result = toggleTaskStatus(tasks, 1);

  assert.equal(result[0].status, 'Done');
});

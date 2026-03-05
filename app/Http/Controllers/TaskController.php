<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\TaskStatus;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Enum;
use Inertia\Inertia;
use Inertia\Response;

class TaskController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('user/task-list', [
            'tasks' => Task::where('user_id', auth()->id())->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'title' => 'required',
            'status' => ['nullable', new Enum(TaskStatus::class)],
            'due_date' => 'nullable|date'
        ]);

        $data['user_id'] = auth()->id();

        Task::create($data);

        return redirect()->back()->with('flash', [
            'type' => 'success',
            'message' => 'Task created successfully.']);
    }

    public function show(Task $task): Task|RedirectResponse
    {
        if ($task->user_id !== auth()->id()) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'message' => 'You are not authorized to view this task.',
            ]);
        }
        return $task;
    }

    public function update(Request $request, Task $task): RedirectResponse
    {
        if ($task->user_id !== auth()->id()) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'message' => 'You are not authorized to edit this task.',
            ]);
        }

        $data = $request->validate([
            'title' => 'required',
            'status' => ['nullable', new Enum(TaskStatus::class)],
            'due_date' => 'nullable|date'
        ]);

        $task->update($data);

        return redirect()->back()->with('flash', [
            'type' => 'success',
            'message' => 'Task updated successfully.']);
    }

    public function destroy(Task $task): RedirectResponse
    {
        if ($task->user_id !== auth()->id()) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'message' => 'You are not authorized to delete this task.',
            ]);
        }

        $task->delete();

        return redirect()->back()->with('flash', [
            'type' => 'success',
            'message' => 'Task deleted successfully.']);
    }
}

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
        return Inertia::render('user/TaskList', [
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
        return redirect()->back()->with('success', 'Task created successfully.');
    }

    public function show(Task $task): Task
    {
        return $task;
    }

    public function update(Request $request, Task $task): RedirectResponse
    {
        $data = $request->validate([
            'title' => 'required',
            'user_id' => 'required', 'exists:users',
            'status' => ['nullable', new Enum(TaskStatus::class)],
            'due_date' => 'nullable|date'
        ]);

        $task->update($data);

        return redirect()->back()->with('success', 'Task updated successfully.');
    }

    public function destroy(Task $task): RedirectResponse
    {
        $task->delete();

        return redirect()->back()->with('success', 'Task deleted successfully.');
    }
}

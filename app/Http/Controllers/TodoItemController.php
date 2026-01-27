<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TodoItemController extends Controller
{
    public function index()
    {
        return Inertia::render('todoList', [
            'todoList' => Task::where('user_id', auth()->id())->get(),
        ]);
    }

    public function store(Request $request): Task
    {
        $data = $request->validate([
            'name' => ['required'],
            'user_id' => ['required', 'exists:users'],
        ]);

        return Task::create($data);
    }

    public function show(Task $todoItem): Task
    {
        return $todoItem;
    }

    public function update(Request $request, Task $todoItem): Task
    {
        $data = $request->validate([
            'name' => ['required'],
            'user_id' => ['required', 'exists:users'],
        ]);

        $todoItem->update($data);

        return $todoItem;
    }

    public function destroy(Task $todoItem): \Illuminate\Http\JsonResponse
    {
        $todoItem->delete();

        return response()->json();
    }
}

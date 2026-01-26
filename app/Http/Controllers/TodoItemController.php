<?php

namespace App\Http\Controllers;

use App\Models\TodoItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TodoItemController extends Controller
{
    public function index()
    {
        return Inertia::render('todoList', [
            'todoList' => TodoItem::where('user_id', auth()->id())->get(),
        ]);
    }

    public function store(Request $request): TodoItem
    {
        $data = $request->validate([
            'name' => ['required'],
            'user_id' => ['required', 'exists:users'],
        ]);

        return TodoItem::create($data);
    }

    public function show(TodoItem $todoItem): TodoItem
    {
        return $todoItem;
    }

    public function update(Request $request, TodoItem $todoItem): TodoItem
    {
        $data = $request->validate([
            'name' => ['required'],
            'user_id' => ['required', 'exists:users'],
        ]);

        $todoItem->update($data);

        return $todoItem;
    }

    public function destroy(TodoItem $todoItem): \Illuminate\Http\JsonResponse
    {
        $todoItem->delete();

        return response()->json();
    }
}

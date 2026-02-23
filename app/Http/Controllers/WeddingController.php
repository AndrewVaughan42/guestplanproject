<?php

namespace App\Http\Controllers;

use App\Models\Wedding;
use Illuminate\Http\Request;

class WeddingController extends Controller
{
    public function index()
    {
        return Wedding::all();
    }

    public function store(Request $request)
    {
        if (Wedding::where('user_id', auth()->id())->exists()) {
            return redirect()->back()->with('error', 'You already have a wedding.');
        }

        $data = $request->validate([
            'venue_id' => ['required', 'exists:venues,id'],
            'name' => ['required'],
            'date' => ['required', 'date'],
        ]);

        data_set($data, 'user_id', auth()->id()); //Check this works
        Wedding::create($data);
        return redirect()->back()->with('success', 'Task created successfully.');


    }

    public function show(Wedding $wedding)
    {
        return $wedding;
    }

    public function update(Request $request, Wedding $wedding)
    {
        $data = $request->validate([
            'venue_id' => ['required', 'exists:venues,id'],
            'name' => ['required'],
            'date' => ['required', 'date'],
        ]);

        $wedding->update($data);

        return $wedding;
    }

    public function destroy(Wedding $wedding)
    {
        $wedding->delete();

        return response()->json();
    }
}

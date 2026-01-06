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
        $data = $request->validate([
            'venue_id' => ['required', 'exists:venues'],
            'venue_layer_id' => ['required', 'exists:venue_layers'],
            'name' => ['required'],
            'date' => ['required', 'date'],
        ]);

        return Wedding::create($data);
    }

    public function show(Wedding $wedding)
    {
        return $wedding;
    }

    public function update(Request $request, Wedding $wedding)
    {
        $data = $request->validate([
            'venue_id' => ['required', 'exists:venues'],
            'venue_layer_id' => ['required', 'exists:venue_layers'],
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

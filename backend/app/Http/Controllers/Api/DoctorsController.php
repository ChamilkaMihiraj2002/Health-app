<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\DoctorsResource;
use App\Models\Doctors;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DoctorsController extends Controller
{
    public function index() {
        $doctors = Doctors::get();
        if ($doctors->count() > 0) {
            return DoctorsResource::collection($doctors);
        } else {
            return response()->json([
                'message' => 'No doctors found',
                200]);
        }
    }

    public function store(Request $request) {
        $validator = Validator::make($request->all(), [
            'name'=> 'required|string|max:255',
            'hospital'=> 'required|string|max:255',
            'specialty'=> 'required|string|max:255',
        ]);

        if( $validator->fails()) {
            return response() -> json([
                'message'=> 'All fields are required',
                'errors'=> $validator->errors(),
            ],402);
        }

        $doctor = Doctors::create([
            'name'=> $request->name,
            'hospital'=> $request->hospital,
            'specialty'=> $request->specialty,
        ]);

        return response() -> json([
            'message'=> 'Doctor created successfully',
            'data' => new DoctorsResource($doctor),
        ], 200);
    }

    public function show(Doctors $doctor) {
        return new DoctorsResource($doctor);
    }

    public function update(Request $request, Doctors $doctor) {
        $validator = Validator::make($request->all(), [
            'name'=> 'required|string|max:255',
            'hospital'=> 'required|string|max:255',
            'specialty'=> 'required|string|max:255',
        ]);

        if( $validator->fails()) {
            return response() -> json([
                'message'=> 'All fields are required',
                'errors'=> $validator->errors(),
            ],402);
        }

        $doctor->update([
            'name'=> $request->name,
            'hospital'=> $request->hospital,
            'specialty'=> $request->specialty,
        ]);

        return response() -> json([
            'message'=> 'doctor updated successfully',
            'data'=> new DoctorsResource($doctor)
        ],200);
    }

    public function destroy(Doctors $doctor) {
        $doctor->delete();
        return response() -> json([
            'message'=> 'doctor deleted successfully',
        ],200);
    }
}

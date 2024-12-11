<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AppointmentResource;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AppointmentController extends Controller
{
    public function index() {
        $appointment = Appointment::get();
        if ($appointment->count() > 0) {
            return AppointmentResource::collection($appointment);
        } else {
            return response()->json([
                'message' => 'No appointment found',
                200]);
        }
    }

    public function store(Request $request) {
        $validator = Validator::make($request->all(), [
            'Location'=> 'required|string|max:255',
            'Date'=> 'required',
            'Time'=> 'required',
            'description'=> 'required',
            'doctor'=> 'required|string|max:255',
            'userID'=> 'required|string',
        ]);

        if( $validator->fails()) {
            return response() -> json([
                'message'=> 'All fields are required',
                'errors'=> $validator->errors(),
            ],402);
        }

        $appointment = Appointment::create([
            'Location'=> $request->Location,
            'Data' => $request->Date,
            'Time' => $request->Time,
            'description' => $request->description,
            'doctor' => $request->doctor,
            'userID' => $request->userID,
        ]);

        return response() -> json([
            'message'=> 'Appointment created successfully',
            'data' => new AppointmentResource($appointment),
        ], 200);
    }

    public function show(Appointment $appointment) {
        return new AppointmentResource($appointment);
    }

    public function update(Request $request, Appointment $appointment) {
        $validator = Validator::make($request->all(), [
            'Location'=> 'required|string|max:255',
            'Date'=> 'required',
            'Time'=> 'required',
            'description'=> 'required',
            'doctor'=> 'required|string|max:255',
            'userID'=> 'required|string',
        ]);

        if( $validator->fails()) {
            return response() -> json([
                'message'=> 'All fields are required',
                'errors'=> $validator->errors(),
            ],402);
        }

        $appointment->update([
            'Location'=> $request->Location,
            'Date'=> $request->Date,
            'Time'=> $request->Time,
            'description'=> $request->description,
            'doctor'=> $request->doctor,
            'userID'=> $request->userID,
        ]);

        return response() -> json([
            'message'=> 'Appointment updated successfully',
            'data'=> new AppointmentResource($appointment)
        ],200);
    }

    public function destroy(Appointment $appointment) {
        $appointment->delete();
        return response() -> json([
            'message'=> 'Appointment deleted successfully',
        ],200);
    }
}



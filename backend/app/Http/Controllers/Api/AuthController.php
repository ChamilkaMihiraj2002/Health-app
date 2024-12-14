<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email'=> 'required|email|max:255',
            'password'=> 'required|string|min:8|max:255'
        ]);

        $user = User::where("email", $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'The provided credentials are incorrect'
            ], 401);
        }
        
        $token = $user->createToken($user->name.'Auth-Token')->plainTextToken;
        return response()->json([
            'message'=> 'Login Successful',
            'token_type'=> 'Bearer',
            'token'=> $token,
            'user_id' => $user->id
        ],200);
    }

    public function register(Request $request): JsonResponse {
        $request->validate([
            'name'=> 'required|string|max:255',
            'email'=> 'required|email|unique:users,email|max:255',
            'password'=> 'required|string|min:8|max:255'
        ]);

        $user = User::create([
            'name'=> $request->name,
            'email'=> $request->email,
            'password'=> Hash::make($request->password),
        ]);

        if($user) {
            $token = $user->createToken($user->name.'Auth-Token')->plainTextToken;

            return response()->json([
                'message'=> 'Registration Successful',
                'token_type'=> 'Bearer',
                'token'=> $token,
                'user_id' => $user->id
            ],201);
        } else {
            return response()->json([
                'message'=> 'Registration Failed'
            ],500);
        }
    }

    public function profile(Request $request): JsonResponse {
       if($request->user()) {
            return response()->json([
                'message'=> 'Profile Fetched',
                'data' => $request->user()
            ],200);

       } else {
            return response()->json([
                'message'=> 'Not Authenticated'
            ],500);
       }
    }

    public function logout(Request $request) {
        $user = User::where('id', $request->user()->id)->first();

        if($user) {
            $user->tokens()->delete();

            return response()->json([
                'message'=> 'Logout Successful'
            ],200);
        } else {
            return response()->json([
                'message'=> 'User not found'
            ],404);            
        }
    }

    public function update(Request $request): JsonResponse
    {
        // Validate the request
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255|unique:users,email,' . $request->user()->id,
            'current_password' => 'required_with:new_password|string',
            'new_password' => 'sometimes|string|min:8|max:255'
        ]);

        try {
            $user = User::findOrFail($request->user()->id);

            if ($request->has('new_password')) {
                if (!Hash::check($request->current_password, $user->password)) {
                    return response()->json([
                        'message' => 'Current password is incorrect'
                    ], 401);
                }
                $user->password = Hash::make($request->new_password);
            }

            // Update other fields if provided
            if ($request->has('name')) {
                $user->name = $request->name;
            }
            
            if ($request->has('email')) {
                $user->email = $request->email;
            }

            $user->save();

            return response()->json([
                'message' => 'Profile updated successfully',
                'data' => $user
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
}
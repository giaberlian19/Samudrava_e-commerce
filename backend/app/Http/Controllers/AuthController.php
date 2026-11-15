<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // Register akun baru sebagai pelanggan atau penjual
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'sometimes|required|in:pelanggan,penjual',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'] ?? 'pelanggan',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => $user->role === 'penjual'
                ? 'Register penjual berhasil'
                : 'Register pelanggan berhasil',
            'role' => $user->role,
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    // Login admin, pelanggan, atau penjual
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Email atau password salah',
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        if ($user->role === 'admin') {
            return response()->json([
                'message' => 'Login Admin berhasil',
                'role' => 'admin',
                'user' => $user,
                'token' => $token,
            ], 200);
        }

        if ($user->role === 'penjual') {
            return response()->json([
                'message' => 'Login Penjual berhasil',
                'role' => 'penjual',
                'user' => $user,
                'token' => $token,
            ], 200);
        }

        return response()->json([
            'message' => 'Login Pelanggan berhasil',
            'role' => $user->role,
            'user' => $user,
            'token' => $token,
        ], 200);
    }

    // Logout
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout berhasil',
        ], 200);
    }
}

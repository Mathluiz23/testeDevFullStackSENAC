<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::post('/forgot-password/question', function (Request $request) {
    $request->validate(['cpf' => ['required', 'string', 'size:11']]);
    $user = User::where('cpf', $request->input('cpf'))->first();

    if (!$user || empty($user->security_question)) {
        return response()->json([
            'message' => 'Usuário não encontrado ou sem pergunta de segurança cadastrada. Entre em contato com um administrador.',
        ], 404);
    }

    return response()->json([
        'user_id' => $user->id,
        'security_question' => $user->security_question,
    ]);
});

Route::post('/forgot-password/verify', function (Request $request) {
    $request->validate([
        'user_id' => ['required', 'integer'],
        'security_answer' => ['required', 'string'],
        'new_password' => ['required', 'string', 'min:8'],
    ]);

    $user = User::findOrFail($request->input('user_id'));

    if (strtolower(trim($request->input('security_answer'))) !== strtolower(trim($user->security_answer))) {
        return response()->json(['message' => 'Resposta incorreta. Tente novamente.'], 422);
    }

    $user->password = $request->input('new_password');
    $user->must_change_password = false;
    $user->save();

    return response()->json(['success' => true, 'message' => 'Senha alterada com sucesso! Faça login com a nova senha.']);
});

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/roles', [UserController::class, 'roles']);
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{user}', [UserController::class, 'update']);
    Route::delete('/users/{user}', [UserController::class, 'destroy']);

    Route::post('/users/{user}/change-password', function (Request $request, User $user) {
        $request->validate([
            'password' => ['required', 'string', 'min:8'],
            'security_question' => ['sometimes', 'required', 'string', 'max:255'],
            'security_answer' => ['sometimes', 'required', 'string', 'max:255'],
        ]);
        $user->password = $request->input('password');
        $user->must_change_password = false;

        if ($request->has('security_question') && $request->has('security_answer')) {
            $user->security_question = $request->input('security_question');
            $user->security_answer = strtolower(trim($request->input('security_answer')));
        }

        $user->save();
        return response()->json(['success' => true]);
    });

});

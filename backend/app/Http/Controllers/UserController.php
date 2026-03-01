<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $this->authorizeView($request);

        $users = User::query()
            ->orderBy('name')
            ->get();

        return UserResource::collection($users);
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $this->authorizeCreate($request);

        $data = $request->validated();
        $data['must_change_password'] = true;
        $user = User::create($data);
        return (new UserResource($user))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        $this->authorizeEdit($request);

        $payload = $request->validated();

        if (empty($payload['password'])) {
            unset($payload['password']);
        }

        $user->update($payload);

        return (new UserResource($user->refresh()))->response();
    }

    public function destroy(Request $request, User $user): JsonResponse
    {
        $this->authorizeDelete($request, $user);

        $user->delete();

        return response()->json(['message' => 'Usuário removido com sucesso.']);
    }

    public function roles(): JsonResponse
    {
        return response()->json(UserRole::options());
    }

    private function authorizeView(Request $request): void
    {
        abort_unless($request->user()?->canViewUsers(), 403, 'Visualização não autorizada.');
    }

    private function authorizeCreate(Request $request): void
    {
        abort_unless($request->user()?->canCreateUsers(), 403, 'Apenas administradores podem criar usuários.');
    }

    private function authorizeEdit(Request $request): void
    {
        abort_unless($request->user()?->canEditUsers(), 403, 'Apenas administradores ou moderadores podem editar usuários.');
    }

    private function authorizeDelete(Request $request, User $user): void
    {
        abort_if($request->user()?->id === $user->id, 403, 'Você não pode excluir seu próprio usuário.');
        abort_unless($request->user()?->canDeleteUsers(), 403, 'Apenas administradores podem excluir usuários.');
    }
}

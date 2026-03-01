<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\User */
class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        $currentUser = $request->user();

        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'cpf' => $this->cpf(),
            'cpfFormatted' => $this->formattedCpf(),
            'role' => $this->role->value,
            'roleLabel' => $this->role->label(),
            'roleDescription' => $this->role->description(),
                'createdAt' => $this->created_at?->toIso8601String(),
                'updatedAt' => $this->updated_at?->toIso8601String(),
                'actions' => [
                    'canEdit' => (bool) ($currentUser?->canEditUsers()),
                    'canDelete' => (bool) ($currentUser?->canDeleteUsers() && $currentUser?->id !== $this->id),
                ],
                'mustChangePassword' => (bool) $this->must_change_password,
                'hasSecurityQuestion' => !empty($this->security_question),
        ];
    }
}

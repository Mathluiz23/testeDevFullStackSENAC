<?php

namespace App\Http\Requests\User;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('cpf')) {
            $this->merge([
                'cpf' => preg_replace('/\D/', '', (string) $this->string('cpf')),
            ]);
        }
    }

    public function rules(): array
    {
        $routeParam = $this->route('user');
        $userId = $routeParam instanceof User ? $routeParam->getKey() : (int) $routeParam;

        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255', 'unique:users,email,' . $userId],
            'cpf' => ['sometimes', 'string', 'size:11', 'unique:users,cpf,' . $userId],
            'role' => ['sometimes', 'integer', 'in:1,2,3'],
            'password' => ['nullable', 'string', 'min:8'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.max' => 'O nome não pode ter mais de 255 caracteres.',
            'email.email' => 'Informe um e-mail válido.',
            'email.unique' => 'Este e-mail já está em uso.',
            'cpf.size' => 'O CPF deve ter 11 dígitos.',
            'cpf.unique' => 'Este CPF já está cadastrado.',
            'role.in' => 'Perfil inválido.',
            'password.min' => 'A senha deve ter no mínimo 8 caracteres.',
        ];
    }
}

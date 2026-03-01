<?php

namespace App\Models;

use App\Enums\UserRole;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'cpf',
        'role',
        'password',
        'security_question',
        'security_answer',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'security_answer',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => UserRole::class,
        ];
    }

    public function cpf(): string
    {
        return preg_replace('/\D/', '', (string) $this->cpf) ?? '';
    }

    public function formattedCpf(): string
    {
        return preg_replace(
            '/(\d{3})(\d{3})(\d{3})(\d{2})/',
            '$1.$2.$3-$4',
            str_pad($this->cpf(), 11, '0', STR_PAD_LEFT)
        );
    }

    public function canCreateUsers(): bool
    {
        return $this->role?->canCreateUsers() ?? false;
    }

    public function canEditUsers(): bool
    {
        return $this->role?->canEditUsers() ?? false;
    }

    public function canDeleteUsers(): bool
    {
        return $this->role?->canDeleteUsers() ?? false;
    }

    public function canViewUsers(): bool
    {
        return $this->role?->canViewUsers() ?? false;
    }

    public function permissions(): array
    {
        return [
            'view' => $this->canViewUsers(),
            'edit' => $this->canEditUsers(),
            'delete' => $this->canDeleteUsers(),
            'create' => $this->canCreateUsers(),
        ];
    }
}

<?php

namespace App\Enums;

enum UserRole: int
{
    case ADMIN = 1;
    case MODERATOR = 2;
    case READER = 3;

    public function label(): string
    {
        return match ($this) {
            self::ADMIN => 'Administrador',
            self::MODERATOR => 'Moderador',
            self::READER => 'Leitor',
        };
    }

    public function description(): string
    {
        return match ($this) {
            self::ADMIN => 'Visualiza, edita e exclui usuários.',
            self::MODERATOR => 'Visualiza e edita usuários, sem poder excluir.',
            self::READER => 'Somente visualiza usuários.',
        };
    }

    public function canViewUsers(): bool
    {
        return true;
    }

    public function canEditUsers(): bool
    {
        return in_array($this, [self::ADMIN, self::MODERATOR], true);
    }

    public function canDeleteUsers(): bool
    {
        return $this === self::ADMIN;
    }

    public function canCreateUsers(): bool
    {
        return $this === self::ADMIN;
    }

    public static function options(): array
    {
        return array_map(
            fn (self $role) => [
                'value' => $role->value,
                'label' => $role->label(),
                'description' => $role->description(),
            ],
            self::cases()
        );
    }
}

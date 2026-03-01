<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedUser(
            name: 'Administrador',
            email: 'admin@senacrs.com.br',
            cpf: '00011122233',
            role: UserRole::ADMIN,
            password: 'senhaAdmin123',
            mustChangePassword: false,
            securityQuestion: 'Qual o nome da empresa do seu primeiro emprego?',
            securityAnswer: 'senac',
        );

        $this->seedUser(
            name: 'Matheus Luiz',
            email: 'matheusluiz.dev@gmail.com',
            cpf: '00000000001',
            role: UserRole::READER,
            password: 'senhaLeitor123',
            mustChangePassword: false,
            securityQuestion: 'Qual o nome do seu primeiro animal de estimação?',
            securityAnswer: 'rex',
        );

        $this->seedUser(
            name: 'Matheus Luiz da Silva',
            email: 'matheusluiz.dev2@gmail.com',
            cpf: '02222222222',
            role: UserRole::READER,
            password: 'senhaLeitor123',
            mustChangePassword: false,
            securityQuestion: 'Qual o nome da sua primeira escola?',
            securityAnswer: 'senac',
        );

        $this->seedUser(
            name: 'moderador 1',
            email: 'teste@teste.com.br',
            cpf: '03333333333',
            role: UserRole::MODERATOR,
            password: 'moderador123',
            mustChangePassword: false,
            securityQuestion: 'Qual o nome da empresa do seu primeiro emprego?',
            securityAnswer: 'senac',
        );
        $this->seedUser(
            name: 'Moderador Teste',
            email: 'moderatorteste@senacrs.com.br',
            cpf: '22233344455',
            role: UserRole::MODERATOR,
            password: 'moderador123',
            mustChangePassword: false,
            securityQuestion: 'Qual o nome do seu primeiro animal de estimação?',
            securityAnswer: 'thor',
        );

        $this->seedUser(
            name: 'Leitor Teste',
            email: 'leitorteste@senacrs.com.br',
            cpf: '33344455566',
            role: UserRole::READER,
            password: 'leitor123',
            mustChangePassword: false,
            securityQuestion: 'Qual a sua comida favorita?',
            securityAnswer: 'churrasco',
        );
    }

    private function seedUser(
        string $name,
        string $email,
        string $cpf,
        UserRole $role,
        string $password,
        bool $mustChangePassword = true,
        ?string $securityQuestion = null,
        ?string $securityAnswer = null,
    ): void {
        User::updateOrCreate(
            ['cpf' => $cpf],
            [
                'name' => $name,
                'email' => $email,
                'role' => $role,
                'password' => bcrypt($password),
                'must_change_password' => $mustChangePassword,
                'security_question' => $securityQuestion,
                'security_answer' => $securityAnswer ? strtolower(trim($securityAnswer)) : null,
            ]
        );
    }
}

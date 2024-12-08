// name

// Tipo: String
// Anotação: @NotEmpty
// Descrição: Nome do usuário.
// Obrigatoriedade: Obrigatório.
// login

// Tipo: String
// Anotação: @NotEmpty
// Descrição: Login do usuário.
// Obrigatoriedade: Obrigatório.
// password

// Tipo: String
// Anotação: @NotEmpty, @Password
// Descrição: Senha do usuário.
// Obrigatoriedade: Obrigatório.
// role

// Tipo: RoleEnum
// Descrição: Papel do usuário no sistema.
// Obrigatoriedade: Opcional (comentado no código).


export interface RegisterDto {
  name: string;
  login: string;
  password: string;
  role: string;
}

// id

// Tipo: Long
// Anotação: @Id, @GeneratedValue(strategy = GenerationType.IDENTITY)
// Descrição: Identificador único do usuário. É gerado automaticamente pelo banco de dados.
// Obrigatoriedade: Obrigatório (gerado automaticamente).
// createdAt

// Tipo: LocalDateTime
// Anotação: @Column(name = "created_at", nullable = false)
// Descrição: Data e hora de criação do usuário.
// Obrigatoriedade: Obrigatório (gerado automaticamente no construtor).
// name

// Tipo: String
// Anotação: @Column(name = "name", length = 100, nullable = false)
// Descrição: Nome do usuário.
// Tamanho Máximo: 100 caracteres
// Obrigatoriedade: Obrigatório.
// login

// Tipo: String
// Anotação: @Column(name = "login", length = 50, nullable = false)
// Descrição: Login do usuário.
// Tamanho Máximo: 50 caracteres
// Obrigatoriedade: Obrigatório.
// password

// Tipo: String
// Anotação: @Column(name = "password", length = 100, nullable = false)
// Descrição: Senha do usuário.
// Tamanho Máximo: 100 caracteres
// Obrigatoriedade: Obrigatório.
// role

// Tipo: RoleEnum
// Anotação: @Enumerated(EnumType.STRING), @Column(name = "role", length = 50, nullable = false)
// Descrição: Papel do usuário no sistema.
// Tamanho Máximo: 50 caracteres
// Obrigatoriedade: Obrigatório.
export interface UserDto {
  id: number;
  name: string; //string(100)
  login: string; //string(50)
  password?: string; //string(100)
  role: string; //string(50)
  accessDisabled?: boolean;
  resetPassword?: boolean;
  createdAt?: string;
}

// id

// Tipo: Long
// Anotação: @NotNull(message = "User ID cannot be null")
// Descrição: Identificador único do usuário.
// Obrigatoriedade: Obrigatório.
// role

// Tipo: String
// Anotação: @NotEmpty(message = "Role cannot be null or empty")
// Descrição: Papel do usuário no sistema.
// Obrigatoriedade: Obrigatório.

export interface UserRoleUpdateDto {
  id: number;
  role: string;
}

# Universal Data Fetcher - TypeScript HTTP Client

> **Arquitectura genérica, modular y escalable para consumir APIs REST con TypeScript**

---

## Características

- **Generics** - Tipado seguro con `ApiResponse<T>`
- **Path Aliases** - Imports limpios con `@/`
- **ResponseBuilder** - Patrón builder para construir respuestas consistentes
- **Manejo de errores** - Diferenciación entre errores HTTP, red, y timeout
- **Middleware** - Pipeline extensible para interceptar requests
- **Circuit Breaker** - Protección contra cascadas de fallos
- **Retry con backoff** - Reintentos exponenciales configurables
- **Timeout** - Cancelación de requests largos
- **Métricas** - Tracking de latencia y errores

---

## Instalación

```bash
npm install
npm test        # Ejecutar tests
npm run dev     # Ejecutar ejemplos
```

---

## Arquitectura

```
src/
├── core/                    # Lógica HTTP genérica
│   ├── http.client.ts       # fetchData<T> - Cliente básico
│   ├── advanced.http.client.ts  # Cliente con middleware
│   ├── retry.handler.ts     # withRetry<T>
│   ├── timeout.handler.ts   # withTimeout<T>
│   ├── circuit.breaker.ts   # CircuitBreaker
│   ├── middleware.chain.ts  # MiddlewareChain
│   ├── request.executor.ts  # executeRequest
│   ├── metrics.ts           # MetricsCollector
│   └── utils.ts             # ResponseBuilder + utilidades
├── services/
│   └── api.service.ts       # ApiService<T> - Wrapper de alto nivel
├── types/                   # Interfaces genéricas
│   ├── api.types.ts         # ApiResponse<T>, HttpError
│   ├── advanced.types.ts    # RequestConfig, Middleware, etc.
│   └── entities.types.ts    # User, Post, Character
├── config/                  # Endpoints
└── examples/                # Ejemplos funcionando
```

---

## Uso Básico

### fetchData<T> - Cliente genérico

```typescript
import { fetchData } from '@/core';

interface User {
  id: number;
  name: string;
}

const response = await fetchData<User[]>('https://api.example.com/users');

if (response.error) {
  console.error(`Error ${response.status}: ${response.error}`);
} else {
  console.log(response.data); // User[]
}
```

### ApiService<T> - Servicio de alto nivel

```typescript
import { ApiService } from '@/services';

interface Post {
  id: number;
  title: string;
  body: string;
}

const postService = new ApiService<Post>('https://api.example.com/posts');

// Obtener todos
const all = await postService.getAll();

// Obtener uno
const one = await postService.getOne(1);

// Con features avanzadas
const advancedService = new ApiService<Post>(
  'https://api.example.com/posts',
  { useAdvanced: true, timeout: 5000, retries: 3 }
);
```

---

## Patrón ResponseBuilder

Clase genérica para construir respuestas consistentes:

```typescript
import { ResponseBuilder } from '@/core';

// Éxito
const success = ResponseBuilder.success<User>(userData, 200);

// Errores tipados
const httpError = ResponseBuilder.httpError<User>(404, 'Not Found');
const networkError = ResponseBuilder.networkError<User>();
const timeoutError = ResponseBuilder.timeoutError<User>(5000);
```

**Métodos disponibles:**
- `success<T>(data, status)` - Respuesta exitosa
- `error<T>(message, status)` - Error genérico
- `networkError<T>()` - Error de conexión
- `timeoutError<T>(ms)` - Timeout
- `httpError<T>(status, text)` - Error HTTP
- `maxRetriesExceeded<T>()` - Máximos reintentos
- `parseError<T>(status)` - Error parseando JSON
- `emptyBody<T>(status)` - Body vacío

---

## ApiResponse<T>

Interfaz genérica para todas las respuestas:

```typescript
interface ApiResponse<T> {
  data: T | null;      // Datos o null si hay error
  error: string | null; // Mensaje de error o null si éxito
  status: number;      // Código HTTP
}
```

**Ejemplos de estado:**
- Éxito: `{ data: [...], error: null, status: 200 }`
- HTTP 404: `{ data: null, error: 'HTTP 404: Not Found', status: 404 }`
- Network: `{ data: null, error: 'Network error...', status: 0 }`

---

## Diseño Genérico

### Principios aplicados

1. **DRY (Don't Repeat Yourself)**
   - `ResponseBuilder` elimina duplicación de creación de respuestas
   - Un único lugar para cada tipo de error

2. **Open/Closed**
   - Extensible via middleware sin modificar core
   - Nuevos handlers se añaden sin tocar código existente

3. **Single Responsibility**
   - `retry.handler.ts` - Solo reintentos
   - `timeout.handler.ts` - Solo timeouts
   - `circuit.breaker.ts` - Solo circuit breaker

4. **Composition over Inheritance**
   - `AdvancedHttpClient` compone: retry + timeout + circuit breaker
   - Cada feature es independiente y testeable

### Flujo de request

```
ApiService.getOne(id)
  → AdvancedHttpClient.get()
    → withRetry()
      → withTimeout()
        → executeRequest()
          → fetch()
```

---

## Tests

Cobertura completa con 17 tests:

```bash
npm test

✓ tests/http.client.test.ts (4 tests)
✓ tests/api.service.test.ts (3 tests)
✓ tests/retry.handler.test.ts (3 tests)
✓ tests/circuit.breaker.test.ts (4 tests)
✓ tests/metrics.test.ts (3 tests)
```

---

## APIs de ejemplo implementadas

### JSONPlaceholder
```typescript
const userService = new ApiService<User>(
  'https://jsonplaceholder.typicode.com/users'
);
const users = await userService.getAll(); // 10 usuarios
```

### Rick & Morty API
```typescript
const charService = new ApiService<Character>(
  'https://rickandmortyapi.com/api/character'
);
const rick = await charService.getOne(1); // Rick Sanchez
```

---

## Configuración de Path Aliases

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["src/*"],
      "@/types": ["src/types/index"],
      "@/core": ["src/core/index"],
      "@/services": ["src/services/index"]
    }
  }
}
```

`vitest.config.ts`:
```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src')
  }
}
```

---

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm test` | Ejecutar todos los tests |
| `npm run test:watch` | Tests en modo watch |
| `npm run dev` | Ejecutar ejemplos |

---

## Licencia

ISC

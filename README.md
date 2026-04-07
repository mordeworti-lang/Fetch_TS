# Universal Data Fetcher

Sistema genérico en TypeScript para consumir APIs REST con tipado seguro, manejo robusto de errores y arquitectura extensible.

## Quick Start

```bash
npm install
npm run dev     # Ver ejemplos funcionando
npm test        # Ejecutar tests
```

## Características

- **Generics** - `ApiResponse<T>` con tipado seguro
- **ResponseBuilder** - Patrón builder para respuestas consistentes
- **Path Aliases** - Imports limpios `@/`
- **Middleware** - Pipeline extensible
- **Circuit Breaker** - Protección contra fallos en cascada
- **Retry + Timeout** - Reintentos exponenciales y cancelación
- **Métricas** - Tracking de latencia y errores

## Uso

### Cliente básico

```typescript
import { fetchData } from '@/core';

const response = await fetchData<User[]>('https://api.example.com/users');

if (response.error) {
  console.error(`Error ${response.status}: ${response.error}`);
} else {
  console.log(response.data); // User[] tipado
}
```

### Servicio de alto nivel

```typescript
import { ApiService } from '@/services';

const service = new ApiService<User>('https://api.example.com/users');

// Con features avanzadas
const advanced = new ApiService<User>(url, {
  useAdvanced: true,
  timeout: 5000,
  retries: 3
});

const users = await service.getAll();
const user = await service.getOne(1);
```

## ApiResponse<T>

```typescript
interface ApiResponse<T> {
  data: T | null;       // Datos o null si error
  error: string | null; // Error o null si éxito
  status: number;     // Código HTTP
}
```

## ResponseBuilder

```typescript
import { ResponseBuilder } from '@/core';

// Métodos estáticos para cada caso
ResponseBuilder.success<T>(data, status)
ResponseBuilder.error<T>(message, status)
ResponseBuilder.httpError<T>(404, 'Not Found')
ResponseBuilder.networkError<T>()
ResponseBuilder.timeoutError<T>(5000)
ResponseBuilder.maxRetriesExceeded<T>()
```

## Arquitectura

```
src/
├── core/
│   ├── http.client.ts          # fetchData<T>
│   ├── advanced.http.client.ts # Cliente con middleware
│   ├── retry.handler.ts        # withRetry<T>
│   ├── timeout.handler.ts      # withTimeout<T>
│   ├── circuit.breaker.ts      # CircuitBreaker
│   ├── middleware.chain.ts     # MiddlewareChain
│   ├── request.executor.ts     # executeRequest
│   ├── metrics.ts              # MetricsCollector
│   └── utils.ts                # ResponseBuilder
├── services/
│   └── api.service.ts          # ApiService<T>
├── types/
│   ├── api.types.ts
│   ├── advanced.types.ts
│   └── entities.types.ts
├── config/
└── examples/
```

### Flujo de request

```
ApiService.getOne(id)
  → AdvancedHttpClient.get()
    → withRetry()
      → withTimeout()
        → executeRequest()
          → fetch()
```

### Principios aplicados

- **DRY** - ResponseBuilder elimina duplicación
- **Open/Closed** - Extensible vía middleware
- **Single Responsibility** - Cada handler una función
- **Composition** - Features componibles, no herencia

## Tests

```bash
npm test

✓ http.client.test.ts      (4 tests)
✓ api.service.test.ts      (3 tests)
✓ retry.handler.test.ts    (3 tests)
✓ circuit.breaker.test.ts (4 tests)
✓ metrics.test.ts          (3 tests)

17 tests passing
```

## Ejemplos implementados

### JSONPlaceholder
```typescript
const service = new ApiService<User>(
  'https://jsonplaceholder.typicode.com/users'
);
const users = await service.getAll(); // 10 usuarios
```

### Rick & Morty API
```typescript
const service = new ApiService<Character>(
  'https://rickandmortyapi.com/api/character'
);
const rick = await service.getOne(1);
```

## Configuración

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

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Ejecutar ejemplos |
| `npm test` | Tests unitarios |
| `npm run test:watch` | Tests en modo watch |

## Licencia

ISC

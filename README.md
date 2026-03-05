# Micro Frontend Monorepo

Proyecto de referencia de arquitectura micro frontend utilizando Vite Module Federation. Implementa el patrón host/remote en un monorepo con npm workspaces, donde una aplicación shell consume features independientes de usuarios y países.


## Arquitectura

La aplicación está compuesta por tres micro frontends independientes que se comunican en tiempo de ejecución mediante Module Federation:

- **shell** (host): Aplicación principal que gestiona el enrutamiento y consume los micro frontends remotos
- **users-mfe**: Micro frontend que expone la funcionalidad de gestión de usuarios
- **countries-mfe**: Micro frontend que expone la funcionalidad de países

Cada micro frontend se compila y despliega de forma independiente. La shell los consume dinámicamente en runtime mediante HTTP.

## Stack Tecnológico

- **Build**: Vite 6.2
- **Framework**: React 19
- **Lenguaje**: TypeScript 5.7 (strict mode)
- **Module Federation**: @originjs/vite-plugin-federation 1.3.6
- **Estilos**: Sass 1.97 + Tailwind CSS 3.4
- **Estado**: Zustand 5.0, TanStack Query 5.67
- **Routing**: React Router 7.2
- **Testing**: Jest 30, Testing Library
- **Package Manager**: npm workspaces

## Requisitos

- Node.js >= 20
- npm >= 10

## Instalación

```bash
git clone <repository-url>
cd mf-user-test
npm install
```

## Desarrollo

### Ejecución completa

El proyecto requiere que los micro frontends se compilen antes de ser consumidos por la shell:

```bash
bash start-dev.sh
```

Este script realiza:
1. Build de `users-mfe` y `countries-mfe`
2. Inicia ambos MFEs en modo preview (puertos 5174 y 5175)
3. Inicia la shell en modo desarrollo (puerto 5173)

Acceder a: http://localhost:5173

### Ejecución manual

Abrir tres terminales y ejecutar:

**Terminal 1 - users-mfe:**
```bash
npm run build:mfe
npm run preview:mfe
```

**Terminal 2 - countries-mfe:**
```bash
npm run build:countries
npm run preview:countries
```

**Terminal 3 - shell:**
```bash
npm run dev:shell
```

### Desarrollo independiente

Cada aplicación puede ejecutarse de forma aislada:

```bash
# Shell (puerto 5173)
npm run dev:shell

# Users MFE (puerto 5174)
npm run dev:mfe

# Countries MFE (puerto 5175)
npm run dev:countries
```

## Scripts

| Script | Descripción |
|--------|-------------|
| `npm run dev:shell` | Servidor de desarrollo de shell |
| `npm run dev:mfe` | Servidor de desarrollo de users-mfe |
| `npm run dev:countries` | Servidor de desarrollo de countries-mfe |
| `npm run build` | Build completo del monorepo |
| `npm run build:shell` | Build de shell |
| `npm run build:mfe` | Build de users-mfe |
| `npm run build:countries` | Build de countries-mfe |
| `npm run preview:shell` | Preview del build de shell |
| `npm run preview:mfe` | Preview del build de users-mfe |
| `npm run preview:countries` | Preview del build de countries-mfe |
| `npm test` | Tests de users-mfe con cobertura |
| `npm run test:ci` | Tests con umbral de cobertura del 90% |

## Docker

### Ejecución con Docker

```bash
# Primera ejecución
docker compose up --build

# Ejecuciones posteriores
docker compose up

# En segundo plano
docker compose up -d

# Ver logs
docker compose logs -f

# Detener
docker compose down
```

Acceder a: http://localhost:5173

### Configuración

El `Dockerfile` usa Node 20 Alpine. El `docker-compose.yml` monta el código como volumen y mapea los puertos:
- 5173: shell
- 5174: users-mfe
- 5175: countries-mfe

## Testing

El proyecto utiliza Jest 30 con Testing Library.

```bash
# Tests con cobertura
npm test

# Tests en modo CI (requiere 90% de cobertura)
npm run test:ci

# Tests de una app específica
npm run test -w users-mfe
npm run test -w shell
```

### Configuración

- **Entorno**: jsdom
- **Transpilador**: Babel
- **Coverage**: Configurado en `apps/{app}/test/jest.config.cjs`
- **Setup**: `apps/{app}/test/jest.setup.ts`

## Module Federation

### Configuración de users-mfe

```typescript
// apps/users-mfe/vite.config.ts
federation({
  name: 'usersMfe',
  filename: 'remoteEntry.js',
  exposes: {
    './UsersFeature': './src/features/users/index.tsx',
  },
  shared: ['react', 'react-dom', 'react-router-dom'],
})
```

### Configuración de countries-mfe

```typescript
// apps/countries-mfe/vite.config.ts
federation({
  name: 'countriesMfe',
  filename: 'remoteEntry.js',
  exposes: {
    './CountriesFeature': './src/features/countries/index.tsx',
  },
  shared: ['react', 'react-dom', 'react-router-dom'],
})
```

### Configuración de shell

```typescript
// apps/shell/vite.config.ts
federation({
  name: 'shell',
  remotes: {
    usersMfe: `${process.env.VITE_USERS_MFE_URL ?? 'http://localhost:5174'}/assets/remoteEntry.js`,
    countriesMfe: `${process.env.VITE_COUNTRIES_MFE_URL ?? 'http://localhost:5175'}/assets/remoteEntry.js`,
  },
  shared: ['react', 'react-dom', 'react-router-dom'],
})
```

### Consumo en la shell

```typescript
const UsersFeature = React.lazy(() => import('usersMfe/UsersFeature'))
const CountriesFeature = React.lazy(() => import('countriesMfe/CountriesFeature'))

<Suspense fallback={<LoadingScreen />}>
  <UsersFeature onUserSelect={handleUserSelect} />
</Suspense>
```

## Comunicación entre Aplicaciones

La comunicación se realiza mediante:

1. **Props callback**: La shell pasa `onUserSelect` al UsersFeature
2. **Zustand store**: `selectedUserStore` en la shell mantiene el usuario seleccionado
3. **Custom Events**: Se dispara `CustomEvent('user:selected')` para comunicación global

## Despliegue

El proyecto se despliega en Netlify. Cada aplicación se despliega de forma independiente.

### Orden de despliegue

1. Desplegar `users-mfe`
2. Desplegar `countries-mfe`
3. Configurar variables de entorno en shell
4. Desplegar `shell`

### Variables de entorno (shell)

```
VITE_USERS_MFE_URL=https://mf-users-mfe.netlify.app
VITE_COUNTRIES_MFE_URL=https://mf-countries-mfe.netlify.app
```

### Configuración Netlify

Cada app contiene un `netlify.toml` con:
- Build command
- Publish directory
- Headers CORS (necesarios para Module Federation)

### URLs de producción

- Shell: https://servicio-logistica.netlify.app
- Users MFE: https://mf-users-mfe.netlify.app
- Countries MFE: https://mf-countries-mfe.netlify.app

# Pruebas Automatizadas Parabank

Este proyecto contiene pruebas automatizadas de extremo a extremo para la aplicación web Parabank usando WebDriverIO y Cucumber.

## Descripción

Las pruebas cubren las funcionalidades principales de la aplicación Parabank, incluyendo autenticación de usuarios, gestión de cuentas, pagos de facturas, solicitudes de préstamos y transferencias entre cuentas.

## Tecnologías Utilizadas

- **WebDriverIO**: Framework de automatización para pruebas web
- **Cucumber**: Framework para pruebas BDD (Behavior Driven Development)
- **Page Object Model**: Patrón de diseño para organizar los elementos de la interfaz
- **GitHub Actions**: Integración continua para ejecutar pruebas automáticamente

## Estructura del Proyecto

```
features/
├── login.feature              # Pruebas de autenticación
├── accounts.feature           # Pruebas de visualización de cuentas
├── billpay.feature            # Pruebas de pagos de facturas
├── loanrequest.feature        # Pruebas de solicitudes de préstamo
└── transfer.feature           # Pruebas de transferencias

features/pageobjects/          # Objetos de página
├── login.page.js
├── accounts.page.js
├── billpay.page.js
├── loanrequest.page.js
└── transfer.page.js

features/step-definitions/     # Definiciones de pasos
└── steps.js
```

## Funcionalidades Probadas

### Autenticación

- Inicio de sesión exitoso con credenciales válidas
- Manejo de errores con credenciales inválidas

### Gestión de Cuentas

- Visualización de todas las cuentas del usuario
- Acceso a detalles de cuentas individuales
- Verificación de saldos y movimientos

### Pagos de Facturas

- Pagos exitosos a beneficiarios
- Validación de errores por discrepancias en cuentas
- Validación de campos obligatorios
- Manejo de montos inválidos

### Solicitudes de Préstamo

- Solicitudes exitosas con criterios válidos
- Rechazos por fondos insuficientes
- Validación de montos y pagos iniciales

### Transferencias

- Transferencias exitosas entre cuentas
- Validación de fondos insuficientes
- Verificación de confirmaciones

## Configuración y Ejecución

### Prerrequisitos

- Node.js versión 18 o superior
- Navegador Edge (Windows) o Chrome (Linux/macOS)

### Instalación

```bash
npm install
```

### Ejecución de Pruebas

```bash
# Ejecutar todas las pruebas
npx wdio run wdio.conf.js

# Ejecutar una feature específica
npx wdio run wdio.conf.js --spec ./features/login.feature
```

## Configuración de CI/CD

El proyecto incluye configuración de GitHub Actions que ejecuta automáticamente todas las pruebas en cada push y pull request a la rama principal. Las pruebas se ejecutan en un entorno Ubuntu con Chrome en modo headless.

## Resultados de Pruebas

Las pruebas generan reportes detallados que incluyen:

- Número de pruebas ejecutadas
- Pruebas exitosas y fallidas
- Tiempos de ejecución
- Capturas de pantalla en caso de fallos

## Notas Técnicas

- Las pruebas están configuradas para ejecutarse en paralelo cuando es posible
- Se incluyen esperas robustas para manejar la carga asíncrona de la aplicación
- La configuración detecta automáticamente el sistema operativo para usar el navegador apropiado
- Los objetos de página implementan el patrón Page Object Model para mejor mantenibilidad

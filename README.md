# Quinto Store - E-commerce Premium

> **Nota de desarrollo**: Este proyecto se encuentra actualmente en fase de desarrollo. Algunas funcionalidades podrían verse afectadas por configuraciones específicas del entorno o del navegador.

**Quinto Store** es una plataforma de comercio electrónico de lujo diseñada con un enfoque en la experiencia de usuario (UX) y una estética visual moderna y sofisticada. La aplicación utiliza tecnologías de vanguardia para ofrecer una navegación fluida, validaciones en tiempo real y una integración robusta con servicios en la nube.

## Tecnologías Utilizadas

- **Frontend**: React (Vite)
- **Estilos**: Tailwind CSS v4 (Configuración personalizada mediante variables CSS)
- **Estado Global**: Zustand (con persistencia local)
- **Base de Datos y Auth**: Firebase (Authentication & Firestore)
- **Validaciones**: Lógica personalizada de validación dinámica para formularios
- **APIs Externas**: 
  - [FakeStoreAPI](https://fakestoreapi.com/) para el catálogo de productos.
  - [API Colombia](https://api-colombia.com/) para datos geográficos en tiempo real (Departamentos y Municipios).

## Instalación y Configuración

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd reto_fullstack
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar Firebase**
   Asegúrate de que el archivo `src/firebase/firebase.config.js` contenga las credenciales correctas de tu proyecto de Firebase.

4. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

---

## Solución de Problemas (Troubleshooting)

Si experimentas errores durante la configuración o el uso de la plataforma, consulta las siguientes soluciones:

### 1. Error: auth/network-request-failed
Este error indica que la aplicación no puede contactar con los servidores de Firebase.
- **Bloqueadores**: Desactiva AdBlock, uBlock o similares. Pueden bloquear los dominios de Google Auth.
- **Reloj del Sistema**: Verifica que la fecha y hora de tu ordenador sean correctas.
- **VPN**: Si usas una VPN, intenta desactivarla, ya que Firebase puede bloquear peticiones desde ciertas IPs de túnel.

### 2. Error: Missing or insufficient permissions (Firestore)
Si el registro falla con este mensaje, significa que las Reglas de Seguridad de tu base de datos Firestore están bloqueando la escritura.
- **Solución**: Ve a la consola de Firebase > Firestore > Rules y asegúrate de permitir la escritura a usuarios autenticados:
  ```javascript
  match /users/{userId} {
    allow read, write: if request.auth != null && request.auth.uid == userId;
  }
  ```

### 3. Compatibilidad y Configuración del Navegador
Debido a que el proyecto está en desarrollo, algunos navegadores con configuraciones de privacidad estrictas (como por ejemplo Opera) podrían bloquear las solicitudes de autenticación.
- **Bloqueador de Rastreadores**: Si tu navegador tiene protección contra rastreo integrada, desactívala para `localhost`.
- **VPN del Navegador**: Apaga cualquier VPN integrada en el navegador que pueda interferir con la resolución de servicios de Google.
- **Cookies**: Asegúrate de que las cookies de terceros estén permitidas para el dominio de Firebase Auth.

### 4. Errores de PostCSS / Tailwind (@import order)
Si el servidor de desarrollo no arranca por un error de @import:
- Asegúrate de que en `src/styles/main.css`, los @import de fuentes externas estén antes de @import "tailwindcss".

---

## Características de Diseño (UX/UI)
- **Paleta Teal Premium**: Uso de una paleta de colores sofisticada basada en tonos verde azulado profundos para reducir la fatiga visual.
- **Responsive**: Diseño totalmente adaptado a móviles, tablets y escritorio.
- **Validación Dinámica**: Retroalimentación instantánea en los formularios antes del envío.
- **Persistencia**: El carrito de compras se mantiene incluso después de recargar la página.

---
*Desarrollado para la excelencia - Quinto Store © 2026*

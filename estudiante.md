
# 📦 Proyecto: Fullstack Challenge - E-commerce

## 🎓 Guía de Proyecto: Entrega N° 2 - React  
💻 Curso de Desarrollo Full Stack  

---

## 🎯 Objetivo General

Desarrollar una aplicación web tipo **E-commerce** utilizando React, aplicando conceptos clave como:

- Componentización
- Manejo de estado
- Consumo de APIs
- Navegación entre vistas (SPA)
- Buenas prácticas de desarrollo frontend

Este proyecto demuestra la capacidad de construir aplicaciones modernas, escalables y mantenibles.

---

## 🚀 Presentación del Proyecto

### 📋 Información General

- **Nombre del Proyecto:** Fullstack Challenge - E-commerce  
- **Autor:** [Tu Nombre]  
- **Repositorio:** https://github.com/xaca/reto_fullstack  
- **Deploy (GitHub Pages):** [Enlace en vivo]  

---

## 🧠 Requerimientos del Proyecto

La aplicación debe cumplir con las siguientes funcionalidades:

### 🛍️ Funcionalidades Core

- Registro de usuarios y manejo de sesión (Firebase o localStorage)
- Galería de productos desde API
- Paginación de productos
- Buscador de productos en tiempo real
- Carrito de compras funcional
- Previsualización de checkout

### 🔍 Búsqueda y Filtros

- Buscador de productos en tiempo real
- Filtrado por categorías (opcional)

### 🔐 Autenticación (Opcional / Bonus)

- Login / Registro de usuario (simulado o real)

---

## 📐 Arquitectura y Flujo de la Aplicación

### 🔄 Flujo de Usuario

1. El usuario ingresa a la **Home (Listado de productos)**  
2. Navega o busca productos  
3. Visualiza el **detalle del producto**  
4. Agrega productos al carrito  
5. Gestiona el carrito  
6. Finaliza compra (simulada)  

---

## 🧩 Componentes Principales

- **Navbar**
  - Navegación global
  - Acceso al carrito
  - Buscador

- **ProductList**
  - Consumo de API
  - Renderizado dinámico de productos

- **ProductCard**
  - Visualización resumida de producto

- **ProductDetail**
  - Información completa del producto

- **Cart**
  - Gestión de productos seleccionados
  - Cálculo de totales

- **Checkout**
  - Resumen de compra

---

## ⚛️ Arquitectura React

- Uso de **componentes reutilizables**
- Manejo de estado con:
  - Zustand (recomendado)
  - useState / useEffect
  - Context API (opcional)

- Manejo de rutas con:
  - react-router-dom

---

## 📂 Estructura del Proyecto

```
src/
├── components/
│   ├── atoms/       (botones, inputs, badges)
│   ├── molecules/   (cards de producto, form de búsqueda)
│   ├── organisms/   (header, footer, galería)
│   └── templates/   (layouts de páginas)
├── pages/
├── mockdata/
├── store/           (Zustand stores)
└── styles/
```

### 📁 Descripción

- **components**
  - **atoms** → Componentes básicos (botones, inputs, badges)
  - **molecules** → Componentes compuestos (cards de producto, form de búsqueda)
  - **organisms** → Componentes complejos (header, footer, galería)
  - **templates** → Layouts de páginas
- **pages** → Vistas principales  
- **mockdata** → Datos simulados  
- **store** → Gestión de estado con Zustand  
- **styles** → Estilos globales  

---

## ⚙️ Tecnologías y Herramientas

- **React.js** → Librería principal  
- **Vite / Create React App** → Entorno de desarrollo  
- **JavaScript (ES6+)** → Lógica de la aplicación  
- **CSS / Tailwind CSS** → Estilos  
- **React Router** → Navegación  
- **Zustand** → Gestión de estado (recomendado)  
- **Axios** → Cliente HTTP para APIs  
- **FakeStore API** → API para datos de productos  
- **Git & GitHub** → Control de versiones  

---

## 🔧 Instalación y Uso

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/xaca/reto_fullstack
   ```

2. Entrar al proyecto:
   ```bash
   cd reto_fullstack
   ```

3. Instalar dependencias:
   ```bash
   npm install
   ```

4. Ejecutar el proyecto:
   ```bash
   npm run dev
   ```

---

## 📋 Instrucciones Paso a Paso

### Paso 1: Seleccionar Plantilla de Referencia
- Visita https://themewagon.com/ y busca una plantilla de tienda online.
- Descarga una plantilla gratuita y estudia su estructura HTML/CSS.
- **Nota**: La plantilla es solo referencia visual.

### Paso 2: Configuración del Proyecto
- Instala dependencias adicionales:
  ```bash
  npm install tailwindcss zustand axios
  ```
- Configura Tailwind CSS si no está listo.

### Paso 3: Crear Datos Simulados (Mockdata)
- Crea carpeta `src/mockdata/` con archivos para productos, usuarios y categorías.
- Ejemplo: `products.js` con lista de productos.

### Paso 4: Estructura de Componentes (Atomic Design)
- Organiza componentes en atoms, molecules, organisms, templates.
- Crea componentes básicos como Button, Input, ProductCard, Header.

### Paso 5: Gestión de Estado con Zustand
- Crea stores para productos y carrito.
- Implementa persistencia con localStorage.

### Paso 6: Galería de Productos
- Crea componente ProductGallery usando mockdata.
- Muestra productos en grid responsivo.

### Paso 7: Carrito de Compras
- Implementa agregar/quitar productos y cálculo de total.

### Paso 8: Búsqueda de Productos
- Agrega input de búsqueda que filtre en tiempo real.

### Paso 9: Paginación
- Divide productos en páginas (6-8 por página).

### Paso 10: Registro y Sesión de Usuarios
- Crea formularios usando mockdata y localStorage.

### Paso 11: Previsualización de Checkout
- Página de resumen antes de compra.

### Paso 12: Diseño Responsivo
- Verifica funcionamiento en móvil, tablet y desktop.

### Paso 13: Conectar API Real (Opcional)
- Reemplaza mockdata con https://fakestoreapi.com/.

### Paso 14: Firebase (Bonus)
- Integra Authentication y Firestore.

### Paso 15: Pruebas y Deploy
- Optimiza y despliega en GitHub Pages.

---

## 🧾 Buenas Prácticas Implementadas

- Uso de .gitignore
- Commits descriptivos (mínimo 30 commits)
- Código modular y organizado
- Componentes reutilizables
- Separación de responsabilidades
- Manejo adecuado del estado
## ⚡ Optimización

### 🖼️ Imágenes

- Imágenes comprimidas y optimizadas
- Uso eficiente de recursos

### ⚙️ Performance

- Minimización de renders innecesarios
- Componentes bien estructurados

---

## 📊 Criterios de Evaluación

| Criterio                  | Porcentaje | Descripción                  |
|---------------------------|------------|------------------------------|
| Estructura del proyecto   | 15%       | Organización y arquitectura |
| Componentes React         | 20%       | Reutilización y claridad    |
| Manejo de estado          | 15%       | Uso correcto de hooks       |
| Funcionalidad             | 20%       | Carrito, navegación, API    |
| UI/UX                     | 10%       | Diseño y experiencia        |
| Buenas prácticas          | 10%       | Código limpio y commits     |
| Deploy                    | 10%       | Aplicación en producción    |

---

## 💡 Tips Importantes

- ✅ **Comienza con mockdata**: Establece estructura y lógica sin depender de API.
- ✅ **Usa Zustand**: Simplifica gestión de estado vs Context API.
- ✅ **Commits frecuentes**: Mínimo 30 commits, uno por paso pequeño.
- ✅ **Testing visual**: Prueba en diferentes tamaños de pantalla.
- ✅ **Firebase es bonus**: Enfócate primero en localStorage.

---

## 🧪 Funcionalidades Implementadas

- ✅ Registro de usuarios y sesión persistente
- ✅ Galería dinámica de productos
- ✅ Búsqueda en tiempo real
- ✅ Paginación de productos
- ✅ Carrito de compras con cantidades y total
- ✅ Checkout con vista previa

---

## 🌐 Despliegue

El proyecto debe desplegarse en:

GitHub Pages

🔗 Ver proyecto en vivo

---

## 📚 Información de Interés

- **Documentación de React**: https://react.dev/
- **Tailwind CSS**: https://tailwindcss.com/
- **Zustand (State Management)**: https://zustand.docs.pmnd.rs/
- **Plantillas de Referencia**: https://themewagon.com/
- **FakeStore API**: https://fakestoreapi.com/ (API perfecta para ecommerce)
- **Firebase (Bonus)**: https://firebase.google.com/docs
- **Atomic Design**: https://bradfrost.com/blog/post/atomic-web-design/
- **Diseño Responsivo**: https://developer.mozilla.org/es/docs/Learn/CSS/CSS_layout/Responsive_Design
- **Axios (HTTP client)**: https://axios-http.com/
- **Vite (Build tool)**: https://vitejs.dev/

---

## 🤝 Contribución

- Fork del repositorio
- Crear una rama (feature/nueva-funcionalidad)
- Realizar commits claros
- Abrir un Pull Request

---

## 📄 Licencia

Proyecto de uso educativo.

---

## ✨ Autor

[Tu Nombre]
Desarrollador Full Stack en formación 🚀
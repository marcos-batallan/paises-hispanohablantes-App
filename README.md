
<h1 align="center">
  🌎 Países Hispanohablantes
</h1>

<p align="center">
  Aplicación Full Stack desarrollada con Node.js, Express, MongoDB y EJS.
</p>
Proyecto integrador para la **Diplomatura Universitaria en Desarrollo Web Full Stack** dictada por el **Nodo Tecnológico de Catamarca**.

La aplicación permite visualizar, administrar y gestionar información de países hispanohablantes mediante operaciones CRUD completas, validaciones avanzadas y un dashboard interactivo.

---

# Objetivos del Proyecto

- Consumir información desde una API externa.
- Persistir datos en MongoDB.
- Implementar operaciones CRUD completas.
- Aplicar validaciones robustas en frontend y backend.
- Construir un dashboard dinámico y responsive.
- Implementar filtros, estadísticas y exportación de datos.
- Utilizar arquitectura MVC en Node.js + Express.

---

# 🛠 Tecnologías Utilizadas

## Backend 
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

- Node.js
- Express.js
- MongoDB
- Mongoose
- express-validator
- method-override
- Morgan

## Frontend
![EJS](https://img.shields.io/badge/EJS-B4CA65?style=for-the-badge)

- EJS
- CSS3
- Flexbox
- CSS Grid
- Responsive Design
- Glassmorphism UI

## Herramientas

- Git
- GitHub
- VS Code
- Render (deploy)

---

# Características Principales

✅ Dashboard interactivo  
✅ CRUD completo de países  
✅ Validaciones frontend y backend  
✅ Responsive Design  
✅ Búsqueda y filtros dinámicos  
✅ Paginación  
✅ Exportación CSV  
✅ Cálculo de promedio Gini  
✅ Feedback visual de operaciones  
✅ Arquitectura MVC  
✅ Manejo de errores y validaciones robustas  

---

# Funcionalidades CRUD

## Crear País

Permite agregar nuevos países mediante formulario validado.

### Validaciones implementadas

- Nombre obligatorio
- Capital obligatoria
- Área positiva
- Población entera positiva
- Gini entre 0 y 100
- Borders con formato ISO (`ARG, BRA, CHL`)
- Manejo de arrays y transformación de datos

---

## Editar País

Permite actualizar registros existentes conservando validaciones y feedback visual.

---

## Eliminar País

Incluye confirmación y feedback posterior a la operación.

---

# Dashboard Avanzado

El dashboard incorpora:

- Tabla responsive
- Búsqueda por nombre
- Filtro por capital
- Filtro por región
- Rango de población
- Paginación
- Estadísticas
- Promedio Gini
- Exportación CSV

---

# Validaciones Implementadas

Las validaciones se aplican en múltiples niveles:

## 1️⃣ Mongoose Schema

Validaciones a nivel de modelo:

- minlength
- maxlength
- regex
- rangos numéricos
- arrays
- required
- sanitización

---

## 2️⃣ express-validator

Validaciones a nivel de rutas/controladores:

- `.notEmpty()`
- `.isLength()`
- `.isFloat()`
- `.isInt()`
- `.matches()`
- `.optional()`

---

## 3️⃣ Interfaz de Usuario

- Mensajes de error claros
- Conservación de datos ingresados
- Inputs destacados visualmente
- Feedback dinámico

---

# 📁 Estructura del Proyecto

```bash
public/
│
├── css/
│   └── styles.css
│
├── images/
│   ├── background/
│   ├── icons/
│   └── readme/
│
src/
│
├── config/
│   └── dbConfig.mjs
│
├── controllers/
│   └── countriesControllers.mjs
│
├── models/
│   └── countryModel.mjs
│
├── routes/
│   └── countriesRoutes.mjs
│
├── services/
│   └── countriesService.mjs
│
├── validators/
│   └── countryValidator.mjs
│
├── views/
│   ├── layouts/
│   ├── countries/
│   └── feedback/
│
├── app.mjs
└── server.mjs
```

---

# 📸 Capturas de Pantalla

## Landing Page

<p align="center">
  <img
    src="./public/images/screenshots/landing-desktop.png"
    width="900"
  >
</p>

---

## Dashboard

<p align="center">
  <img
    src="./public/images/screenshots/dashboard-desktop.png"
    width="900"
  >
</p>

---

## About

<p align="center">
  <img
    src="./public/images/screenshots/about-desktop.png"
    width="900"
  >
</p>

---

## Contacto

<p align="center">
  <img
    src="./public/images/screenshots/contact-desktop.png"
    width="900"
  >
</p>


# Instalación y Ejecución

## 1️⃣ Clonar repositorio

```bash
git clone https://github.com/marcos-batallan/paises-hispanohablantes-App.git
```

---

## 2️⃣ Instalar dependencias

```bash
npm install
```

---

## 3️⃣ Configurar variables de entorno

Crear archivo `.env`

```env
PORT=3000
MONGODB_URI=mongodb+srv://grupo-xx:grupo-xx@cluster0.blryo.mongodb.net/NodeMod3Cohorte5
```

---

## 4️⃣ Ejecutar proyecto

Modo desarrollo:

```bash
npm run dev
```

Modo producción:

```bash
npm start
```

---

# Scripts Disponibles

```json
"scripts": {
  "start": "node server.mjs",
  "dev": "nodemon server.mjs"
}
```

---

# Base de Datos

La aplicación utiliza MongoDB mediante Mongoose.

Los datos se obtienen desde una API externa y luego son persistidos localmente para permitir operaciones CRUD completas.

---

# Diseño y UX

La interfaz fue diseñada con enfoque:

- Responsive First
- Glassmorphism
- Dashboard moderno
- Experiencia visual limpia
- Navegación intuitiva

---

# Posibles Mejoras Futuras

- Gráficos estadísticos avanzados
- Cache de API
- Dark/Light Mode

---

# Autor

Desarrollado por **Marcos Batallán**

Proyecto realizado para la:

**Diplomatura Universitaria en Desarrollo Web Full Stack**  
Nodo Tecnológico de Catamarca

---
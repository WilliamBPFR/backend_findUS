# backend_findUS

## Correr el swagger del proyecto

- Hacer `npm install`, si no ha instalado las dependencias del proyecto
- Primero, correr el comando `npm run swagger`
- Luego, correr el comando `npm start`
- Por último, abrir la ruta `http://localhost:3000/api-docs`

## Actualizar esquema de prisma

- Primero, correr el comando `npx prisma db pull`
- Luego, correr el comando `npx prisma generate`


## Abrir Interfaz de Prisma

- Correr el comando `npx prisma studio`

## Estructura del Proyecto
project-root/
├── controllers/
│   ├── userController.js
│   ├── productController.js
│   └── orderController.js
├── services/
│   ├── userService.js
│   ├── productService.js
│   └── orderService.js
├── repositories/
│   ├── userRepository.js
│   ├── productRepository.js
│   └── orderRepository.js
├── routes/
│   ├── userRoutes.js
│   ├── productRoutes.js
│   └── orderRoutes.js
├── app.js
└── server.js

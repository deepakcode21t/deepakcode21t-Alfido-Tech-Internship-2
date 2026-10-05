# Alfido Tech Task 2 - Frontend SPA with React

React single-page application consuming the Task 1 REST API.

## Requirements covered
- React functional components and hooks
- React Router navigation
- Fetch API
- Loading and error states
- Create, read, update and delete UI
- README documentation

## Run

First start Task 1 backend in its project folder:

```bash
npm install
npm run dev
```

It must be available at `http://localhost:5000`.

Then open this Task 2 folder in a second VS Code terminal:

```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal, normally:

`http://localhost:5173`

## API configuration

Optional `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Pages
- `/` - list products
- `/add` - create product
- `/edit/:id` - update product
- Delete button - delete product

## Test
Create a product, edit it, delete it, then refresh. The data is stored through the Task 1 MongoDB API.

## Submission screenshots
For a brief report:
1. React project structure in VS Code
2. Products page showing API data
3. Add/Edit form
4. CRUD result in browser

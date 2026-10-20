# Publicar en GitHub VaniiB

El código vive en una sola app desplegable (mejor para Netlify). Cada proyecto tiene README en `projects/`.

## 1. Repo del portafolio

Desde `Desktop/portfolio-vanina`:

```bash
git init
git add .
git commit -m "Portafolio Vanina: Comcam, Eternal, Victoria, Gourmet, Aurora"
gh repo create VaniiB/portfolio --public --source=. --remote=origin --push
```

Si `gh` no está autenticado como VaniiB, crear el repo vacío en github.com/VaniiB y:

```bash
git remote add origin https://github.com/VaniiB/portfolio.git
git branch -M main
git push -u origin main
```

## 2. README de perfil (como Sushmita/Sushmitadasari)

Ese repo [Sushmitadasari/Sushmitadasari](https://github.com/Sushmitadasari/Sushmitadasari) no es el sitio: es el **README del perfil**. GitHub solo lo muestra si el repo se llama **exactamente igual que el usuario**.

1. En github.com, logueada como **VaniiB**, crear un repo público llamado `VaniiB` (sí: `VaniiB/VaniiB`).
2. Pegar el contenido de [`github-profile/README.md`](../github-profile/README.md).
3. Commit a `main`.
4. El perfil `github.com/VaniiB` pasa a verse como una portada, no vacío.

Opcional (el heatmap animado de contribuciones de Sushmita): cuando el perfil tenga actividad real, se puede sumar un Action diario. Hoy VaniiB tiene 3 repos y casi no hay grilla que animar. Primero el README y los 5 proyectos.

## 3. Pins

En github.com/VaniiB: Customize your pins. Orden sugerido:

1. portfolio
2. (si más adelante se separan) comcam-demo, eternal, rincon-gourmet, aurora-salud, victoria-web

Mientras haya un solo repo, pinear `portfolio` y los repos existentes `Aurora`, `money-mojo-dash`, `mudanza` si se mantienen.

## 4. Netlify

- Base directory: raíz de este proyecto
- Build: `npm run build`
- Publish: `dist`
- Redirects: `netlify.toml` ya está

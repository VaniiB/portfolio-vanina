# Frames del personaje

Cuando tengas el video de Google Flow, extraé frames y ponelos acá.

```bash
ffmpeg -i vanina-hero.mp4 -vf fps=12 -q:v 3 frame-%03d.jpg
```

Después organizá (ejemplo):

- `idle-01.jpg` … trabajando en la notebook
- `left-01.jpg` … mira a la izquierda
- `right-01.jpg` … mira a la derecha
- `greet-01.jpg` … saludo (saca el headset, saluda, señala)

Y actualizá las rutas en `src/data/character.ts`.

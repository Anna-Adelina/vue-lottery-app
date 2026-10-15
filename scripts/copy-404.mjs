import { copyFileSync } from 'node:fs'

// GitHub Pages не вміє віддавати index.html для довільних адрес,
// тому віддаємо його як 404.html: роутер сам покаже потрібну сторінку
copyFileSync('dist/index.html', 'dist/404.html')
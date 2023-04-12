# Используем образ Node.js
FROM mcr.microsoft.com/playwright:v1.32.0-focal

# Создаем директорию для приложения
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Устанавливаем Chromium и Playwright
#RUN npm install -g playwright
#RUN playwright install

# Копируем все файлы проекта
COPY . .

# Запускаем скрипт
CMD ["npm", "start"]

FROM node:20-slim AS builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем только package.json и package-lock.json
COPY package.json ./

# Устанавливаем зависимости внутри контейнера (чистая установка)
RUN npm install

# Теперь копируем остальной код проекта
COPY . .

RUN npm i
# Собираем проект
RUN npm run build

# Сборка завершена, теперь создаем финальный контейнер
FROM node:20-slim

# Устанавливаем пакет serve для статических файлов
RUN npm install -g serve

# Копируем только скомпилированную сборку из предыдущего этапа
COPY --from=builder /app/dist ./dist

# Запускаем сервер
CMD ["serve", "-s", "dist", "-l", "3000"]

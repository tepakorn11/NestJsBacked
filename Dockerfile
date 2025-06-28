FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build
RUN npx prisma generate
RUN npx prisma migrate deploy


EXPOSE 3001

# ✅ Push schema ก่อน start server
CMD ["sh", "-c", "npx prisma db push && node dist/src/main"]

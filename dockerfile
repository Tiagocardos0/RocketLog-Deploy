FROM node:22-alpine

WORKDIR /usr/src/app

# Copia apenas dependências (melhor performance)
COPY package*.json ./

RUN npm install

# Copia o restante do projeto
COPY . .

EXPOSE 3333

CMD ["npm", "run", "dev"]
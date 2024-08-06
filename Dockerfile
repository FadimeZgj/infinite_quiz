FROM node:20 AS build

WORKDIR /var/www/html/infinite_quiz

COPY . /var/www/html/infinite_quiz

RUN npm install -g @angular/cli

RUN npm install

CMD ["ng", "serve", "--host", "0.0.0.0"]

import * as express from "express";
import * as http from "http";
import { Server } from "socket.io";
import * as fs from "fs";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const generateRandomMessage = () => {
  const messages = [
    "Hello!",
    "How are you?",
    "Nice to meet you.",
    "What's your favorite color?",
    "Have a great day!",
    "This is a random message.",
    "Coding is fun!",
    "The weather is nice today.",
    "What's your favorite food?",
    "I love learning new things.",
    "Stay positive!",
    "Enjoy your weekend.",
    "Technology is amazing.",
    "Let's go on an adventure!",
    "Life is beautiful.",
    "Do what makes you happy.",
    "Keep up the good work!",
    "Dream big, work hard.",
    "Be kind to others.",
    "Never give up!"
  ];

  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
};

setInterval(() => {
    const message = {
      content: generateRandomMessage(),
      username: "Chat Bot" 
    };
  io.emit("message", { message });
}, 3000);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const csvToArray = async (filePath) => {
  try {
    const data = await fs.promises.readFile(filePath, 'utf8');
    const lines = data.trim().split('\n');
    const headers = lines[0].split(',');

    const results = lines.slice(1).map((line) => {
      const values = line.split(',');
      return headers.reduce((obj, header, index) => {
        obj[header] = values[index];
        return obj;
      }, {});
    });

    return results;
  } catch (error) {
    throw new Error(`Error al leer o analizar el archivo CSV: ${error.message}`);
  }
};

io.use(async (socket, next) => {
  if (socket?.username) {
    return next();
  }

  const { username, password } = socket.handshake.auth;

  const users = await csvToArray('./whitelist-users.csv');

  const user = users.find((user) => user.username === username && user.password === password);

  if (!user) {
    return next(new Error("Usuario o contraseña incorrectos"));
  }

  socket.username = username;
  next();
});

io.on("connection", socket => {
    socket.on("user:message", msg => {
      const message = {
        ...msg,
        username: socket.username
      };
      io.emit("message", { message });
    });

    socket.emit("session", { username: socket.username });

});

server.listen(3001, () => {
  console.log("listening on *:3001");
});

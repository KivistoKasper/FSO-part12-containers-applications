db.createUser({
  user: "the_username",
  pwd: "the_password",
  roles: [
    {
      role: "dbOwner",
      db: "the_database",
    },
  ],
});

sleep(100);
db.createCollection("todos");
sleep(100);
db.todos.insert({ text: "Write code", done: true });
db.todos.insert({ text: "Learn about containers", done: false });

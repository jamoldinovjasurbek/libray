import "dotenv/config"
import { Client } from "pg";
import readline from "readline-sync";


async function addBook() {
  const title = readline.question("Введите название книги: ");
  const author = readline.question("Введите автора книги: ");
  const year = readline.questionInt("Введите год выпуска: ");

  await Client.query(
    "INSERT INTO books (title, author, year) VALUES ($1, $2, $3)",
    [title, author, year]
  );
  console.log("✅ Книга добавлена.\n");
}

async function viewBooks() {
  const res = await Client.query("SELECT * FROM books ORDER BY id");
  if (res.rows.length === 0) {
    console.log("📭 Книг нет в базе.\n");
    return;
  }

  console.log("\n📚 Список книг:");
  res.rows.forEach((book) => {
    console.log(
      `ID: ${book.id}, Название: ${book.title}, Автор: ${book.author}, Год: ${book.year}`
    );
  });
  console.log();
}

async function updateBook() {
  const id = readline.questionInt("Введите ID книги: ");
  const res = await Client.query("SELECT * FROM books WHERE id = $1", [id]);

  if (res.rows.length === 0) {
    console.log("❌ Книга не найдена.\n");
    return;
  }

  const oldBook = res.rows[0];
  const title =
    readline.question(`Новое название [${oldBook.title}]: `) || oldBook.title;
  const author =
    readline.question(`Новый автор [${oldBook.author}]: `) || oldBook.author;
  const year =
    readline.question(`Новый год [${oldBook.year}]: `) || oldBook.year;

  await Client.query(
    "UPDATE books SET title = $1, author = $2, year = $3 WHERE id = $4",
    [title, author, year, id]
  );
  console.log("✅ Книга обновлена.\n");
}

async function deleteBook() {
  const id = readline.questionInt("Введите ID книги для удаления: ");
  const res = await Client.query("DELETE FROM books WHERE id = $1", [id]);

  if (res.rowCount === 0) {
    console.log("❌ Книга не найдена.\n");
  } else {
    console.log("🗑️ Книга удалена.\n");
  }
}

async function mainMenu() {
  while (true) {
    console.log("📖 Меню:");
    console.log("1. Добавить книгу");
    console.log("2. Просмотреть все книги");
    console.log("3. Обновить книгу");
    console.log("4. Удалить книгу");
    console.log("5. Выход");

    const choice = readline.questionInt("Выберите действие: ");

    switch (choice) {
      case 1:
        await addBook();
        break;
      case 2:
        await viewBooks();
        break;
      case 3:
        await updateBook();
        break;
      case 4:
        await deleteBook();
        break;
      case 5:
        console.log("👋 До свидания!");
        await client.end();
        process.exit(0);
      default:
        console.log("❗ Неверный выбор.\n");
    }
  }
}

mainMenu();

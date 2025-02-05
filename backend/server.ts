import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { Pool } from "pg";

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "file-explorer",
    password: "P@ssw0rd",
    port: 5432,
});

const app = new Elysia();

// Use CORS middleware
app.use(cors({
    origin: "http://localhost:5173", // Replace this with the correct origin for your setup
    credentials: true,
}));

// Fetch all folders
app.get("/folders", async () => {
    try {
        const { rows } = await pool.query("SELECT id_folder, name_folder FROM folder ORDER BY ord");
        return rows;
    } catch (error) {
        console.error("Error fetching folders:", error);
        return { error: "Failed to fetch folders" };
    }
});

app.get("/subfolders/:id_folder", async ({ params }) => {
    try {
        const { rows } = await pool.query(
            "SELECT id_subfolder, name_subfolder FROM subfolder WHERE id_folder = $1 ORDER BY ord",
            [params.id_folder]
        );
        return rows;
    } catch (error) {
        console.error("Error fetching subfolders:", error);
        return { error: "Failed to fetch subfolders" };
    }
});

app.get("/files/:id_subfolder", async ({ params }) => {
    try {
        const { rows } = await pool.query(
            `SELECT id_file, name_file 
             FROM file 
             WHERE id_subfolder = $1 
             ORDER BY ord`,
            [params.id_subfolder]
        );
        return rows;
    } catch (error) {
        console.error("Error fetching files:", error);
        return { error: "Failed to fetch files" };
    }
});


app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});

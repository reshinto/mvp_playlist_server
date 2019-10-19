import app from './app';

const { PORT = 8080 } = process.env;
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`)); // eslint-disable-line no-console

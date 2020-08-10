const {
  serveHome,
  newNote,
  getAllNotes,
  serveCss,
  serveJs,
  serveNote,
  getNote,
  serveNoteJs,
  editNote,
  deleteNote,
} = require('./controllers.js');

const requestListener = (req, res) => {
  const { url, method } = req;
  if (method === 'GET') {
    switch (true) {
      case url === '/':
        return serveHome(req, res);
      case url.includes('/notes/'): {
        return serveNote(req, res);
      }
      case url === '/list':
        return getAllNotes(req, res);

      case url.includes('/list/note?'): {
        return getNote(req, res);
      }
      case url === '/style.css':
        return serveCss(req, res);
      case url === '/main.js':
        return serveJs(req, res);
      case url === '/note.js':
        return serveNoteJs(req, res);
      default:
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Resources not Found', url }));
        break;
    }
  } else if (req.method === 'POST') {
    switch (req.url) {
      case '/new':
        return newNote(req, res);

      default:
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Resources not Found' }));
        break;
    }
  } else if (req.method === 'PUT') {
    switch (true) {
      case url.includes('/edit/note?'): {
        return editNote(req, res);
      }
      default:
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Resources not Found' }));
        break;
    }
  } else if (req.method === 'DELETE') {
    switch (true) {
      case url.includes('/delete/note?'): {
        return deleteNote(req, res);
      }
      default:
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Resources not Found' }));
        break;
    }
  }
};

module.exports = requestListener;

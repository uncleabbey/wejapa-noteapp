var path = require('path');
var promises = require('fs').promises;
var fs = require('fs');
const url = require('url');

var __dirname = path.resolve();

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const serveCss = (req, res) => {
  promises
    .readFile(__dirname + '/frontend/style.css')
    .then((contents) => {
      res.end(contents);
    })
    .catch((err) => {
      res.writeHead(500);
      console.log(err);
      return;
    });
};

const serveJs = (req, res) => {
  promises
    .readFile(__dirname + '/frontend/main.js')
    .then((contents) => {
      res.end(contents);
    })
    .catch((err) => {
      res.writeHead(500);
      console.log(err);
      return;
    });
};
const serveNoteJs = (req, res) => {
  promises
    .readFile(__dirname + '/frontend/note.js')
    .then((contents) => {
      res.end(contents);
    })
    .catch((err) => {
      res.writeHead(500);
      console.log(err);
      return;
    });
};

const serveHome = (req, res) => {
  promises
    .readFile(__dirname + '/frontend//index.html')
    .then((contents) => {
      res.setHeader('Content-Type', 'text/html');
      res.writeHead(200);
      res.end(contents);
    })
    .catch((err) => {
      res.writeHead(500);
      console.log(err);
      return;
    });
};

const serveNote = (req, res) => {
  promises
    .readFile(__dirname + '/frontend/note.html')
    .then((contents) => {
      res.setHeader('Content-Type', 'text/html');
      res.writeHead(200);
      res.end(contents);
    })
    .catch((err) => {
      res.writeHead(500);
      console.log(err);
      return;
    });
};

const newNote = (req, res) => {
  res.setHeader('Content-Type', 'Application/json');
  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', () => {
    let data = JSON.parse(body);
    const { title, content } = data;
    let createDate = new Date();
    const note = {
      id: randomInteger(1, 100),
      title,
      content,
      createdDate: createDate,
    };
    if (!title && !note) {
      res.writeHead(500);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'You need to include a message' }));
    } else {
      try {
        if (!fs.existsSync(`./notes`)) {
          fs.mkdir(`./notes`, { recursive: true }, (err) => {
            if (err) throw err;
            fs.writeFile(
              `./notes/${title + note.id}.txt`,
              JSON.stringify({ note }),
              (err) => {
                if (err) throw err;
                let data = {
                  message: 'success',
                  note,
                };
                res.writeHead(201);
                res.end(JSON.stringify(data));
                return;
              }
            );
          });
        } else {
          fs.writeFile(
            `./notes/${title + note.id}.txt`,
            JSON.stringify({ note }),
            (err) => {
              if (err) throw err;

              let data = {
                message: 'success',
                note,
              };
              res.writeHead(201);
              res.end(JSON.stringify(data));
              return;
            }
          );
        }
      } catch (error) {
        console.log('Error', error);
        res.writeHead(500);
        res.end(JSON.stringify({ error }));
        return;
      }
    }
  });
};

const getAllNotes = (req, res) => {
  res.setHeader('Content-Type', 'Application/json');
  if (fs.existsSync('./notes')) {
    try {
      fs.readdir('./notes', (err, files) => {
        if (err) return err;

        const noteList = files
          .map((file) => {
            const note = JSON.parse(fs.readFileSync(`./notes/${file}`, 'utf8'));
            const { id, title, content, createdDate } = note.note;
            const data = {
              id,
              title,
              content,
              createdDate,
            };
            return data;
          })
          .sort(function (a, b) {
            return new Date(b.createdDate) - new Date(a.createdDate);
          });

        res.writeHead(200);
        const result = {
          message: 'success',
          count: noteList.length,
          data: noteList,
        };
        res.end(JSON.stringify(result));
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    res.writeHead(404);
    res.end('no folder with that name');
  }
};

const getNote = (req, res) => {
  const getUrl = new URL(`http://localhost:3000/${req.url}`);
  const search_params = getUrl.searchParams;
  const noteId = search_params.get('id');

  res.setHeader('Content-Type', 'Application/json');
  if (fs.existsSync('./notes')) {
    try {
      fs.readdir('./notes', (err, files) => {
        if (err) return err;

        const note = files
          .map((file) => {
            const note = JSON.parse(fs.readFileSync(`./notes/${file}`, 'utf8'));
            const { id, title, content, createdDate } = note.note;
            const data = {
              id,
              title,
              content,
              createdDate,
            };
            return data;
          })
          .filter(({ id }) => id == noteId)[0];
        res.writeHead(200);
        const result = {
          message: 'success',
          data: note,
        };
        res.end(JSON.stringify(result));
        // res.end('ok')
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    res.writeHead(404);
    res.end('no file with that name');
  }
};

const editNote = (req, res) => {
  const getUrl = new URL(`http://localhost:3000/${req.url}`);
  const search_params = getUrl.searchParams;
  const noteId = search_params.get('id');

  res.setHeader('Content-Type', 'Application/json');
  if (fs.existsSync('./notes')) {
    try {
      fs.readdir('./notes', (err, files) => {
        if (err) return err;

        const gottenNote = files
          .map((file) => {
            const note = JSON.parse(fs.readFileSync(`./notes/${file}`, 'utf8'));
            const { id, title, content, createdDate } = note.note;
            const data = {
              id,
              title,
              content,
              createdDate,
            };
            return data;
          })
          .filter(({ id }) => id == noteId)[0];

        let body = '';
        req.on('data', (chunk) => {
          body += chunk.toString();
        });
        req.on('end', () => {
          let data = JSON.parse(body);
          const { title, content } = data;

          const note = {
            id: gottenNote.id,
            title,
            content,
            createdDate: gottenNote.createdDate,
          };

          fs.writeFile(
            `./notes/${gottenNote.title}.txt`,
            JSON.stringify({ note }),
            (err) => {
              if (err) throw err;
              let data = {
                message: 'success',
                note,
              };
              res.writeHead(200);
              res.end(JSON.stringify(data));
              return;
            }
          );
        });
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    res.writeHead(404);
    res.end('no file with that name');
  }
};

const deleteNote = (req, res) => {
  const getUrl = new URL(`http://localhost:3000/${req.url}`);
  const search_params = getUrl.searchParams;
  const noteId = search_params.get('id');

  res.setHeader('Content-Type', 'Application/json');
  if (fs.existsSync('./notes')) {
    try {
      fs.readdir('./notes', (err, files) => {
        if (err) return err;

        const gottenNote = files
          .map((file) => {
            const note = JSON.parse(fs.readFileSync(`./notes/${file}`, 'utf8'));
            const { id, title, content, createdDate } = note.note;
            const data = {
              id,
              title,
              content,
              createdDate,
              file: file,
            };
            return data;
          })
          .filter(({ id }) => id == noteId)[0];

        fs.unlink(`./notes/${gottenNote.file}`, function (err) {
          if (err) throw err;
          console.log('File deleted!');
          res.end(JSON.stringify({ message: 'Note File deleted!' }));
        });
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    res.writeHead(404);
    res.end('no file with that name');
  }
};

module.exports = {
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
};

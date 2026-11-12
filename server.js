// Boutique Order Management - Shared Database Server
// Zero dependencies (uses Node.js built-in http, fs, path modules)
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'database.json');

// Initialize database file if not exists
function initDatabase() {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      counter: 0,
      orders: [],
      updatedAt: new Date().toISOString()
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf8');
  }
}

function readDatabase() {
  try {
    initDatabase();
    const content = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading database:', err);
    return { counter: 0, orders: [], updatedAt: new Date().toISOString() };
  }
}

function writeDatabase(data) {
  try {
    data.updatedAt = new Date().toISOString();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing database:', err);
    return false;
  }
}

const server = http.createServer((req, res) => {
  // CORS Headers for cross-origin or local development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  // API Endpoints
  if (pathname === '/api/orders' && req.method === 'GET') {
    const db = readDatabase();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, counter: db.counter, orders: db.orders }));
    return;
  }

  if (pathname === '/api/orders' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const db = readDatabase();
        
        // Counter is strictly incremented and never reused
        const nextSerial = (db.counter || 0) + 1;
        db.counter = nextSerial;

        const newOrder = {
          id: payload.id || 'ord_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
          serialNumber: nextSerial,
          customerName: payload.customerName || 'Anonymous',
          givenDate: payload.givenDate || new Date().toISOString().split('T')[0],
          deliveryDate: payload.deliveryDate || '',
          notes: payload.notes || '',
          photo: payload.photo || null,
          measurements: payload.measurements || {},
          createdAt: new Date().toISOString()
        };

        db.orders.push(newOrder);
        writeDatabase(db);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, order: newOrder, counter: nextSerial }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid order payload' }));
      }
    });
    return;
  }

  // Delete Order (completed) - counter record is preserved and untouched!
  if (pathname.startsWith('/api/orders/') && req.method === 'DELETE') {
    const orderId = pathname.replace('/api/orders/', '');
    const db = readDatabase();
    const initialCount = db.orders.length;
    db.orders = db.orders.filter(o => o.id !== orderId);
    
    writeDatabase(db);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      success: true, 
      deleted: db.orders.length < initialCount,
      counter: db.counter,
      orders: db.orders 
    }));
    return;
  }

  // Get current counter
  if (pathname === '/api/counter' && req.method === 'GET') {
    const db = readDatabase();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, counter: db.counter }));
    return;
  }

  // Serve static index.html
  if (pathname === '/' || pathname === '/index.html') {
    const indexPath = path.join(__dirname, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(indexPath).pipe(res);
      return;
    }
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

initDatabase();

server.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(` Sandhya Boutique Order Management Website is running!`);
  console.log(` Local URL:   http://localhost:${PORT}`);
  console.log(` Network URL: http://<your-local-ip>:${PORT}`);
  console.log(` Mother and tailor can connect via phone or browser!`);
  console.log(` Shared database stored in: ${DB_FILE}`);
  console.log(`=======================================================`);
});


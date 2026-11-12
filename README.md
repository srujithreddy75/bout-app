# 🌸 Sandhya Boutique — Order Management Website

A clean, colourful mobile-friendly web application designed for **Sandhya Boutique** and tailor workflow. It provides a shared order management experience across two intuitive tabs: **Add Order** (for the boutique owner) and **Tailor** (for the tailor).

---

## ✨ Features

### 1. Add Order Tab (Mother's Side)
- **Customer Name**: Dedicated required field.
- **15 Exact Body Measurements**:
  - Length
  - Neck
  - Shoulder
  - Upper chest
  - Chest
  - Waist
  - Hip waist
  - Front length
  - Front neck
  - Hand length
  - Hand loose
  - Under harmone
  - Cuts
  - Pant
  - Scholar
- **Optimized Photo Upload**:
  - Shrinks any chosen blouse/dress photo to ~640px JPEG on an HTML5 canvas.
  - Uses `FileReader` (no `blob:` URLs) to ensure 100% compatibility inside sandboxes and cross-origin environments.
  - Displays instant thumbnail preview with a "Remove photo" button.
  - Provides clear, friendly error messages if an image file is corrupt or unreadable.
- **Dates**:
  - Given date automatically defaults to today's date.
  - Delivery date picker.
- **Optional Notes**: Ample text area for special requests (piping, potli buttons, lining, etc.).
- **Save Order**:
  - Assigns the next automatic sequential serial number.
  - Clears the form and resets default dates.
  - Displays a prominent confirmation: `"Order #N saved"`.

### 2. Strict Serial Number System
- Sequential counter (`1, 2, 3...`) kept in a separate database counter record.
- **Numbers are NEVER reused**, even if orders are completed or deleted.
- Card titles clearly display: `#5 - Customer name`.

### 3. Tailor Tab (Tailor's Screen)
- **Order Cards**:
  - Displays `#N - Customer name`, design photo thumbnail, given date, delivery date, notes, and only the measurements that were filled in.
- **Sorted by Nearest Delivery Date**: Orders due earliest are shown at the top.
- **Overdue Detection**: Automatically displays an animated `"⚠️ Overdue"` tag if the delivery date has passed.
- **Fullscreen Lightbox**: Tapping the photo opens a fullscreen high-resolution modal with tap-to-dismiss.
- **"Completed - Delete" Button**: Prompts for confirmation before permanently deleting the order from the queue.
- **Pending Counter & Empty State**:
  - The tab header displays real-time pending count badge (e.g. `🪡 Tailor (3)`).
  - When all orders are completed, it shows: `"No pending blouses"`.

### 4. Modern Boutique Design
- **Aesthetic**: Soft rose/pink accent palette (`#e8608c`), clean white cards, elegant rounded corners (`16px-20px`), and high-contrast typography.
- **Mobile First**: Touch targets are at least 44-48px for effortless one-handed phone use.
- **Light & Dark Mode**: One-tap Sun/Moon switch in the header, honoring system preference and persisting to memory.

### 5. Shared Database & Multi-Device Synchronization
- **One Self-Contained HTML File**: `index.html` runs out of the box with zero build step.
- **Three-Tier Shared Sync**:
  1. **Built-in Node.js Shared Server**: Running `node server.js` provides a shared REST API (`/api/orders`, `/api/counter`) over local Wi-Fi or hosted backend (Render, Railway, Fly.io, etc.).
  2. **Cross-Tab Real-time Broadcast**: Uses `BroadcastChannel` and `storage` events so multiple tabs/windows stay synchronized without refreshing.
  3. **Cloud Database (Firebase)**: Includes client-side Firebase Realtime Database connector with a 1-click settings modal for remote syncing across cellular networks.

---

## 🚀 Quick Start

### Option A: Run with Shared Local Server (Recommended for Boutique & Phone)
```bash
# Start the server (uses built-in Node.js HTTP & file system, no external npm packages needed)
node server.js
```
Open in browser:
- On Mother's computer/phone: `http://localhost:3000` or `http://<your-wifi-ip>:3000`
- On Tailor's phone/tablet: `http://<your-wifi-ip>:3000`

### Option B: Standalone Hosted HTML (Zero Server)
Double-click `index.html` or upload it to any static web host (GitHub Pages, Netlify, Vercel, S3):
- Orders sync across tabs in real-time.
- For cross-device sync on static hosting, tap the **"Shared DB"** button in the header and paste your Firebase Database URL.

---

## 🧪 Testing

Run the automated test suite verifying all 7 core specifications (counter record preservation, non-reuse of serial numbers, nearest delivery date sorting, overdue detection, measurements preservation):
```bash
node test.js
```

---

## 📁 Project Structure

```
bout/
├── index.html       # Self-contained single-page application (HTML, CSS, JS)
├── server.js        # Zero-dependency Node.js HTTP server & REST API
├── database.json    # JSON storage file for persistent orders & serial counter
├── package.json     # Project configuration & npm scripts
├── test.js          # Automated unit & integration test suite
└── README.md        # Documentation
```


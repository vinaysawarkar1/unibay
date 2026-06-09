#!/usr/bin/env node
/**
 * Local PostgreSQL controller for development.
 *
 * Uses `embedded-postgres` to download and run a real PostgreSQL binary
 * scoped to this project. No system install, no admin rights required.
 *
 * Usage:
 *   node scripts/db.js start   # start postgres in the background
 *   node scripts/db.js stop    # stop it
 *   node scripts/db.js status  # report whether it is up
 *   node scripts/db.js reset   # wipe data and re-init
 *
 * Connection string (matches .env.local):
 *   postgresql://unibay:unibay_local_dev@localhost:5432/unibay
 */
const path = require('path')
const fs = require('fs')
const net = require('net')
const { spawn } = require('child_process')

const EmbeddedPostgres = require('embedded-postgres').default

const DATA_DIR = path.resolve(__dirname, '..', '.postgres-data')
const PID_FILE = path.join(DATA_DIR, 'unibay.pid')
const USER = 'unibay'
const PASSWORD = 'unibay_local_dev'
const DATABASE = 'unibay'
const PORT = 5432

function makePg() {
  return new EmbeddedPostgres({
    databaseDir: DATA_DIR,
    user: USER,
    password: PASSWORD,
    port: PORT,
    persistent: true,
    // Force UTF-8 so Unicode in product specs/content stores correctly.
    // Without this, Windows initdb defaults to WIN1252 and rejects e.g. Greek Δ.
    initdbFlags: ['--encoding=UTF8', '--no-locale'],
  })
}

async function isPortOpen(port, host = '127.0.0.1', timeoutMs = 1500) {
  return new Promise((resolve) => {
    const s = net.createConnection(port, host)
    const done = (v) => { s.destroy(); resolve(v) }
    s.setTimeout(timeoutMs)
    s.once('connect', () => done(true))
    s.once('timeout', () => done(false))
    s.once('error', () => done(false))
  })
}

async function ensureDatabase(pg) {
  // Create the application database if it doesn't exist yet (idempotent)
  try {
    await pg.createDatabase(DATABASE)
    console.log(`Created database "${DATABASE}"`)
  } catch (err) {
    // Already exists — fine
  }
}

async function cmdStart() {
  if (await isPortOpen(PORT)) {
    console.log(`Postgres is already listening on :${PORT}`)
    return
  }

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }

  const pg = makePg()
  const initialised = fs.existsSync(path.join(DATA_DIR, 'PG_VERSION'))

  if (!initialised) {
    console.log('First-time setup: initialising cluster (downloads ~70MB)...')
    await pg.initialise()
  }

  console.log('Starting Postgres...')
  await pg.start()
  await ensureDatabase(pg)

  fs.writeFileSync(PID_FILE, String(process.pid))

  console.log('')
  console.log('===========================================')
  console.log(' PostgreSQL is RUNNING')
  console.log('===========================================')
  console.log(` Host:     localhost`)
  console.log(` Port:     ${PORT}`)
  console.log(` Database: ${DATABASE}`)
  console.log(` User:     ${USER}`)
  console.log(` Password: ${PASSWORD}`)
  console.log('')
  console.log(' DATABASE_URL=postgresql://' + USER + ':' + PASSWORD + '@localhost:' + PORT + '/' + DATABASE)
  console.log('===========================================')
  console.log('')
  console.log('This process must stay open. Press Ctrl+C to stop.')

  // Keep alive — embedded-postgres exits when this script exits
  let stopping = false
  const shutdown = async (sig) => {
    if (stopping) return
    stopping = true
    console.log(`\nReceived ${sig}, stopping Postgres...`)
    try { await pg.stop() } catch (e) { console.error(e) }
    try { fs.unlinkSync(PID_FILE) } catch {}
    process.exit(0)
  }
  process.on('SIGINT', () => shutdown('SIGINT'))
  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGBREAK', () => shutdown('SIGBREAK'))

  // Park forever
  await new Promise(() => {})
}

async function cmdStop() {
  if (!(await isPortOpen(PORT))) {
    console.log('Postgres is not running.')
    return
  }
  // The cluster runs as a child of a `node scripts/db.js start` process —
  // killing the script triggers its SIGTERM handler which calls pg.stop().
  // Find that process from the pidfile.
  if (!fs.existsSync(PID_FILE)) {
    console.log(`Port ${PORT} is in use but no pidfile found.`)
    console.log(`Either it's an unrelated Postgres install, or stop it from the terminal where you ran 'npm run db:start'.`)
    process.exit(1)
  }
  const pid = parseInt(fs.readFileSync(PID_FILE, 'utf8'), 10)
  console.log(`Stopping Postgres (pid ${pid})...`)
  try {
    process.kill(pid, 'SIGTERM')
  } catch (e) {
    console.log('Process already exited.')
    try { fs.unlinkSync(PID_FILE) } catch {}
  }
}

async function cmdStatus() {
  const up = await isPortOpen(PORT)
  if (up) {
    console.log(`Postgres is UP on :${PORT}`)
    if (fs.existsSync(PID_FILE)) {
      console.log(`Managed by pid ${fs.readFileSync(PID_FILE, 'utf8').trim()}`)
    } else {
      console.log('(no pidfile — running outside the db.js script)')
    }
  } else {
    console.log(`Postgres is DOWN. Start with: npm run db:start`)
  }
}

async function cmdReset() {
  if (await isPortOpen(PORT)) {
    console.error('Postgres is currently running. Stop it first: npm run db:stop')
    process.exit(1)
  }
  if (fs.existsSync(DATA_DIR)) {
    console.log(`Deleting ${DATA_DIR}...`)
    fs.rmSync(DATA_DIR, { recursive: true, force: true })
  }
  console.log('Data directory wiped. Run `npm run db:start` to re-initialise.')
}

async function main() {
  const cmd = process.argv[2] || 'start'
  try {
    if (cmd === 'start') return await cmdStart()
    if (cmd === 'stop') return await cmdStop()
    if (cmd === 'status') return await cmdStatus()
    if (cmd === 'reset') return await cmdReset()
    console.error(`Unknown command: ${cmd}`)
    console.error('Usage: node scripts/db.js [start|stop|status|reset]')
    process.exit(1)
  } catch (err) {
    console.error('Error:', err.message)
    process.exit(1)
  }
}

main()

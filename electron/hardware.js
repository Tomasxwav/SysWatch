// src/hardware.js
import os from 'os'

export async function getHardware() {
  const hostname = os.hostname()
  const osInfo = os.type()
  const cpus = os.cpus()
  const cpu = cpus[0].model
  const cpuspeed = cpus[0].speed
  const memory = os.totalmem()
  const freemem = os.freemem()
  const freemempercent = freemem / memory

  return {
    hostname,
    osInfo,
    cpu,
    cpuspeed,
    memory,
    freemem,
    freemempercent,
  }
}

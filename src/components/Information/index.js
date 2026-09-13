import  {QRZ_COM_lookup} from './qrzcom_lookup'
import  {QRZ_COM_logbook} from './qrzcom_logbook'
import isElectron from 'is-electron'
import { PSKReporter } from './pskreporter'
import { LoTW } from './lotw'
import { Clublog } from './clublog'

import fetchCors from './fetchcors'

// eqsl.js uses Node built-ins (fs/http/path) for file downloads and is only
// available in the Electron context. In browser context, it will be null

let eqsl;

// Try to load Node modules dynamically at runtime
if (isElectron() && window.require) {
  try {
    const mod1 = ('./eqsl').slice(); // Hide from webpack

    eqsl = window.require(mod1).eqsl || null;
  } catch (e) {
    console.debug('Could not load native modules:', e);
    eqsl = null;
  }
}

eqsl = eqsl || null;

export {fetchCors, QRZ_COM_lookup, QRZ_COM_logbook, eqsl, LoTW, Clublog, PSKReporter}

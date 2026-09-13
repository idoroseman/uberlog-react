import  {QRZ_COM_lookup} from './qrzcom_lookup'
import  {QRZ_COM_logbook} from './qrzcom_logbook'

import fetchCors from './fetchcors'

// Support for Node.js modules - these will only be available in Electron context
// In browser context, these will be null

const isElectron = typeof window !== 'undefined' && window.electron;

let eqsl, LoTW, Clublog, PSKReporter;

// Try to load Node modules dynamically at runtime
if (isElectron && window.require) {
  try {
    const mod1 = ('.' + '/eqsl').slice(); // Hide from webpack
    const mod2 = ('.' + '/lotw').slice();
    const mod3 = ('.' + '/clublog').slice();
    const mod4 = ('.' + '/pskreporter').slice();
    
    eqsl = window.require(mod1).eqsl || null;
    LoTW = window.require(mod2).LoTW || null;
    Clublog = window.require(mod3).Clublog || null;
    PSKReporter = window.require(mod4).PSKReporter || null;
  } catch (e) {
    console.debug('Could not load native modules:', e);
    eqsl = LoTW = Clublog = PSKReporter = null;
  }
}

eqsl = eqsl || null;
LoTW = LoTW || null;
Clublog = Clublog || null;
PSKReporter = PSKReporter || null;

export {fetchCors, QRZ_COM_lookup, QRZ_COM_logbook, eqsl, LoTW, Clublog, PSKReporter}

import { libsRegistry } from '@zeainc/zea-engine'

import pkg from '../package.json'
if (libsRegistry) {
  libsRegistry.registerLib(pkg)
} else {
  console.warn(
    "The version of the Zea Engine that you're using doesn't support the libraries registry. Please upgrade to the latest Zea Engine version."
  )
}

export * from './SelectionManager'
export * from './UndoRedo/index'
export * from './Tools/index'
export * from './Handles/index'
export * from './Measurement/index'

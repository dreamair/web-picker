import { writable } from 'svelte/store'
import type { Command } from '../model/Command.js'


export const activeCommand = writable<Command | null>()

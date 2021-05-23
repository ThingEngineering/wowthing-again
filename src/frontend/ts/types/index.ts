export * from './account'
export * from './character'
export * from './covenant'
export * from './dictionary'
export * from './dungeon'
export * from './mythic-plus'
export * from './reputation-tier'
export * from './settings'
export * from './specialization'
export * from './static-data'
export * from './team-data'
export * from './user-data'


declare global {
    interface Window {
        __tip: { watchElligibleElements: Function } | undefined
    }
}

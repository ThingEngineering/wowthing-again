import { writable } from 'svelte/store'


export class MatrixState {
    public minLevel = 0
    public showCharacterAs: 'level' | 'name' = 'level'
    public showCovenant = true

    public xAxis: string[] = []
    public yAxis: string[] = []

    public x_class = false
    public x_gender = false
    public x_race = false

    public y_account = false
    public y_faction = false
}

const key = 'state-matrix'
const initialState = new MatrixState()
Object.assign(initialState, JSON.parse(localStorage.getItem(key) ?? '{}'))

export const matrixState = writable<MatrixState>(initialState)

matrixState.subscribe(state => {
    localStorage.setItem(key, JSON.stringify(state))
})

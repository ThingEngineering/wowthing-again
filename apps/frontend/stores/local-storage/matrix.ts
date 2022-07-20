import { writable } from 'svelte/store'


export class MatrixState {
    public y_account = false
    public y_faction = false

    public x_class = false
    public x_gender = false
    public x_race = false
}

const key = 'state-matrix'
const initialState = new MatrixState()
Object.assign(initialState, JSON.parse(localStorage.getItem(key) ?? '{}'))

export const matrixState = writable<MatrixState>(initialState)

matrixState.subscribe(state => {
    localStorage.setItem(key, JSON.stringify(state))
})

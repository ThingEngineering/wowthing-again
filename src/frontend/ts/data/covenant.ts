import {Covenant} from '../types'
import type {Dictionary} from '../types'

const covenantMap: Dictionary<Covenant> = {
    1: new Covenant('Kyrian', 'covenant_kyrian'),
    2: new Covenant('Venthyr', 'covenant_venthyr'),
    3: new Covenant('Night Fae', 'covenant_night_fae'),
    4: new Covenant('Necrolord', 'covenant_necrolord'),
}

export {
    covenantMap
}

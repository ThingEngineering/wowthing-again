import type { Role } from '../data/role'

export class Specialization {
    ClassId: number
    Role: Role
    Name: string
    Icon: string

    constructor(classId: number, role: Role, name: string, icon: string) {
        this.ClassId = classId
        this.Role = role
        this.Name = name
        this.Icon = icon
    }
}

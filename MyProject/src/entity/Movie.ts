import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Movie {

    @PrimaryGeneratedColumn()
    id?: number

    @Column()
    title: string

    @Column()
    year: number

    @Column()
    format: string

    @Column("varchar", {array: true })
    actors: string[]

    

}
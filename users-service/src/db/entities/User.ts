import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export default class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("name")
    username: string;

    @Column({ select: false })
    passwordHash: string;

    @CreateDateColumn("created_at")
    created_at: string;
}
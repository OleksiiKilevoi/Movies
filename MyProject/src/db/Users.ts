import { DataSource } from "typeorm";
import { User } from "../entity/User";


export default class UsersDbClass {
    public constructor(public db: DataSource) {
    }

    public create = async (user: User): Promise<User> => this.db.manager.save(User, user);

    public getById = async (id: number): Promise<User> => this.db.manager.findOneBy(User, { id } );

    public getByEmail = async (email: string) => this.db.manager.findOneBy(User, { email});
}

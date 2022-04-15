import { DataSource } from "typeorm";
import { User } from "../entity/User";


export default class UsersDbClass {
    public constructor(public db: DataSource) {
    }

    public create = async (user: User): Promise<User> => this.db.manager.save(User, user);

    // public getById = async (id: number | string): Promise<UserModel> => this.table
    //     .select()
    //     .where(eq(this.table.id, Number(id)))
    //     .first();
}

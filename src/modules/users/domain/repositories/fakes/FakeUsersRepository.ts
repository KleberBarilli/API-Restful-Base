import { ICreateUser } from '@modules/users/domain/models/ICreateUser';
import { IUsersRepository } from '@modules/users/domain/repositories/IUsersRepository';
import { IPaginateUser } from '@modules/users/domain/models/IPaginateUser';
import { v4 as uuidv4 } from 'uuid';
import User from '@modules/users/infra/typeorm/entities/User';
import { IUser } from '../../models/IUser';

export default class FakeUsersRepository implements IUsersRepository {
	private users: User[] = [];

	public async create({
		username,
		email,
		password,
	}: ICreateUser): Promise<User> {
		const user = new User();

		user.id = uuidv4();
		user.username = username;
		user.email = email;
		user.password = password;

		this.users.push(user);

		return user;
	}

	public async save(user: User): Promise<User> {
		const findIndex = this.users.findIndex(
			findUser => findUser.id === user.id,
		);

		this.users[findIndex] = user;

		return user;
	}

	public async findByName(username: string): Promise<User | undefined> {
		const user = this.users.find(user => user.username === username);
		return user;
	}

	public async findById(id: string): Promise<User | undefined> {
		const user = this.users.find(user => user.id === id);
		return user;
	}

	public async findByEmail(email: string): Promise<User | undefined> {
		const user = this.users.find(user => user.email === email);
		return user;
	}

	public async findAllPaginate(): Promise<IPaginateUser | null> {
		return null;
	}

	public async findAll(): Promise<IUser[] | null> {
		return null;
	}
}

import { injectable, inject } from 'tsyringe';
import { IUser } from '../domain/models/IUser';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';

@injectable()
export default class ListUserService {
	constructor(
		@inject('UsersRepository') private usersRepository: IUsersRepository,
	) {}
	public async execute(): Promise<IUser[]> {
		const users = await this.usersRepository.findAll();

		return users;
	}
}

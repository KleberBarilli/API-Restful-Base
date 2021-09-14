import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { sign } from 'jsonwebtoken';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';
import authConfig from '@config/auth';
import { ICreateSession } from '../domain/models/ICreateSession';
import { IUserAuthenticated } from '../domain/models/IUserAuthenticated';
import { IHashProvider } from '../providers/HashProvider/models/IHashProvider';

@injectable()
export default class CreateSessionsService {
	constructor(
		@inject('UsersRepository') private usersRepository: IUsersRepository,
		@inject('HashProvider')
		private hashProvider: IHashProvider,
	) {}
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	public async execute({
		email,
		password,
	}: ICreateSession): Promise<IUserAuthenticated> {
		const user = await this.usersRepository.findByEmail(email);

		if (!user) {
			throw new AppError('Incorret email/password', 401);
		}

		const passwordConfirmed = await this.hashProvider.compareHash(
			password,
			user.password,
		);

		if (!passwordConfirmed) {
			throw new AppError('Incorret email/password', 401);
		}

		const token = sign({}, authConfig.jwt.secret, {
			subject: user.id,
			expiresIn: authConfig.jwt.expiresIn,
		});

		return {
			user,
			token,
		};
	}
}

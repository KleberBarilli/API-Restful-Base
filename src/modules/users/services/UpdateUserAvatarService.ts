import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import uploadConfig from '@config/upload';
import DiskStorageProvider from '@shared/providers/StorageProvider/DiskStorageProvider';
import S3StorageProvider from '@shared/providers/StorageProvider/S3StorageProvider';
import { IUpdateUserAvatar } from '../domain/models/IUpdateUserAvatar';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';
import { IUser } from '../domain/models/IUser';

@injectable()
export default class UpdateUserAvatarService {
	constructor(
		@inject('UsersRepository') private usersRepository: IUsersRepository,
	) {}
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	public async execute({
		user_id,
		avatarFilename,
	}: IUpdateUserAvatar): Promise<IUser> {
		const user = await this.usersRepository.findById(user_id);

		if (!user) {
			throw new AppError('User not found..');
		}
		if (uploadConfig.driver === 's3') {
			const s3Provider = new S3StorageProvider();
			if (user.avatar) {
				await s3Provider.deleteFile(user.avatar);
			}
			const fileName = await s3Provider.saveFile(avatarFilename);
			user.avatar = fileName;
		} else {
			const diskProvider = new DiskStorageProvider();
			if (user.avatar) {
				await diskProvider.deleteFile(user.avatar);
			}
			const fileName = await diskProvider.saveFile(avatarFilename);
			user.avatar = fileName;
		}

		await this.usersRepository.save(user);

		return user;
	}
}

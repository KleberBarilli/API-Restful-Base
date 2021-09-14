export interface IUser {
	id: string;
	username: string;
	email: string;
	password: string;
	admin: boolean;
	avatar: string;
	created_at: Date;
	updated_at: Date;
	getAvatarUrl(): string | null;
}

import { container } from 'tsyringe';
import ByCryptHashProvider from './HashProvider/implementations/BcryptHashProvider';
import { IHashProvider } from './HashProvider/models/IHashProvider';

container.registerSingleton<IHashProvider>('HashProvider', ByCryptHashProvider);

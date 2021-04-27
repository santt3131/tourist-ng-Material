import { userNationalities, userTypes } from 'src/app/shared/enums/public-enums';

export class Profile {
    type: userTypes;
    name: string;
    surname: string;
    password: string;
    email: string;
    birthDate: string;
    phone: number;
    nationality: userNationalities;
    nif: string;
    aboutMe: string;
    companyName?: string;
    companyDescription?: string;
    cif?: string;
    favorites?: number[];
}

import { languageLevels, activityLenguages } from 'src/app/shared/enums/public-enums';

export class Language {
    uid: number;
    level: languageLevels;
    language: activityLenguages;
    finish: string;
}

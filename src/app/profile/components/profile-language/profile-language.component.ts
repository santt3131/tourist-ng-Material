import { Component, OnInit } from '@angular/core';
import { ValidatorFn, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { languageLevels } from 'src/app/shared/enums/public-enums';
import { activityLenguages } from 'src/app/shared/enums/public-enums';
import { Language } from '../../models/language';
import { CheckValidator } from 'src/app/shared/directives/check-validator';
import { PublicFunctions } from 'src/app/shared/directives/public-functions';

import { AppState } from 'src/app/app.reducers';
import { Store } from '@ngrx/store';
import { UserState } from '../../reducers';
import * as UserAction from '../../actions';

@Component({
  selector: 'app-profile-language',
  templateUrl: './profile-language.component.html',
  styleUrls: ['./profile-language.component.css']
})
export class ProfileLanguageComponent implements OnInit {
  userState$: UserState;
  eLanguageLevels = languageLevels;
  eActivityLenguages = activityLenguages;
  rForm: FormGroup;
  language: Language = {} as Language;

  constructor(private route: ActivatedRoute, public router: Router,
              private store: Store<AppState>) {
    // Se recoge el identificador del lenguage pasado por el navegador (si se edita)
    this.route.params.subscribe(params => {
      const uid = +params.uid;
      this.store.select('user').subscribe(userState => this.userState$ = userState);
      this.language = this.userState$.user.languages.find(language => language.uid === uid);
      // Se carga la información del lenguage
      this.loadFormInstance();
    });
  }

  ngOnInit(): void {}

  public loadFormInstance(): void {
    // En caso de creación de un nuevo lenguaje
    if (this.language === undefined)
    {
      // Se incicializa la colección
      this.language = new Language();
      this.language.finish = '';
      this.language.level  = null;
      this.language.language = null;
    }
    this.rForm = new FormGroup({
      date: new FormControl(this.language.finish, [CheckValidator.checkFormatDate]),
      level: new FormControl(this.language.level, [Validators.required]),
      language: new FormControl(this.language.language, [Validators.required])
    });
  }

  // Se guarda el lenguaje
  public submit(): void {
    this.language.level = this.rForm.get('level').value;
    this.language.language = this.rForm.get('language').value;
    this.language.finish = this.rForm.get('date').value;
    this.saveOrUpdate(this.language);
  }

  // En caso de creación de un nuevo lenguaje
  public save (language: Language){
    if (!this.userState$.user.languages.find(x => x.language === language.language))
    {
      const user = this.userState$.user;
      const _language = PublicFunctions.fakeIncreaseUid <Language>(user.languages, language);
      user.languages.push(_language);
      // Se actualiza el usuario
      this.store.dispatch(UserAction.addUserLanguage({user}));
    }
    else
    {
      alert('The language already exists!');
    }
  }

  // Se actualiza el lenguaje
  public update (language: Language){
    const user = this.userState$.user;
    const languages = user.languages;
    const foundIndex = languages.findIndex(_language => _language.uid === language.uid);
    languages[foundIndex] = language;
    // Se actualiza el usuario
    this.store.dispatch(UserAction.updateUserLanguage({user}));
  }

  saveOrUpdate(language: Language){
    // Se invoca la función save o update en función de la respuesta de isNew
    this.isNew() ? this.save (language) : this.update(language);
  }

  public isNew(): boolean {
    // Función que devuelve true si no existe el campo uid en el objeto language
    return !!!this.language.uid;
  }
}

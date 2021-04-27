import { Component, OnInit } from '@angular/core';
import { ValidatorFn, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../models/user';
import {ActivatedRoute, Router} from '@angular/router';
import { userNationalities, userTypes } from 'src/app/shared/enums/public-enums';
import { CheckValidator } from 'src/app/shared/directives/check-validator';

import { AppState } from 'src/app/app.reducers';
import { Store } from '@ngrx/store';
import * as UserAction from '../../actions';
import { UserState } from '../../reducers';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userState$: UserState;
  eUserNationalities = userNationalities;
  public user: User;

  public name: FormControl;
  public surname: FormControl;
  public nationality: FormControl;
  public birthDate: FormControl;
  public phone: FormControl;
  public nif: FormControl;
  public aboutMe: FormControl;
  public profileForm: FormGroup;
  // Controles para perfil Company
  // ***************************
  public companyName: FormControl;
  public companyDescription: FormControl;
  public cif: FormControl;
  // ***************************
  public companyProfile: boolean;

  constructor(private formBuilder: FormBuilder,
              public router: Router, private store: Store<AppState>)
  {
    this.store.select('user').subscribe(user => this.userState$ = user);
  }

  ngOnInit(): void {
    this.user = this.userState$.user;
    // Se cargan los datos del perfil del usuario logado
    this.loadUserProfile();
  }

  private loadUserProfile() {
    // Se carga el perfil del usuario
    this.name = new FormControl(this.user.profile.name, [Validators.required, Validators.minLength(3), Validators.maxLength(55),
          Validators.pattern('[a-zA-Z áéíóúÁÉÍÓÚÑñÇç]*')]);
    this.surname = new FormControl(this.user.profile.surname, [Validators.minLength(3), Validators.maxLength(55),
          Validators.pattern('[a-zA-Z áéíóúÁÉÍÓÚÑñÇç]*')]);
    this.nationality = new FormControl(this.user.profile.nationality);
    this.birthDate = new FormControl(this.user.profile.birthDate, [CheckValidator.checkFormatDate]);
    this.phone = new FormControl(this.user.profile.phone);
    this.nif = new FormControl(this.user.profile.nif);
    this.aboutMe = new FormControl(this.user.profile.aboutMe);
    // En el caso de un perfil company
    if (this.user.profile.type === userTypes.Company){
      this.companyProfile = true;
      // Se comprueba que el campo company name no esté en blanco y tenga entre 3 y 55 carácteres
      this.companyName = new FormControl(this.user.profile.companyName, [Validators.required, Validators.minLength(3),
        Validators.maxLength(55)]);
      this.companyDescription = new FormControl(this.user.profile.companyDescription);
      this.cif = new FormControl(this.user.profile.cif);

      this.profileForm = this.formBuilder.group({
        name: this.name,
        surname: this.surname,
        nationality: this.nationality,
        birthDate: this.birthDate,
        phone: this.phone,
        nif: this.nif,
        aboutMe: this.aboutMe,
        companyName: this.companyName,
        companyDescription: this.companyDescription,
        cif: this.cif
      }, { validator: CheckValidator.checkNIF('nif', 'nationality') });
    }
    else {
      // Perfil turista
      this.companyProfile = false;
      this.profileForm = this.formBuilder.group({
        name: this.name,
        surname: this.surname,
        nationality: this.nationality,
        birthDate: this.birthDate,
        phone: this.phone,
        nif: this.nif,
        aboutMe: this.aboutMe,
    }, { validator: CheckValidator.checkNIF('nif', 'nationality') });
    }
  }

  public updateProfile(){
    this.user.profile.name = this.name.value.trim();
    this.user.profile.surname = this.surname.value.trim();
    this.user.profile.nationality = this.nationality.value;
    this.user.profile.birthDate = this.birthDate.value;
    this.user.profile.phone = this.phone.value;
    this.user.profile.nif = this.nif.value;
    this.user.profile.aboutMe = this.aboutMe.value;
    if (this.user.profile.type === userTypes.Company){
      this.user.profile.companyName = this.companyName.value;
      this.user.profile.companyDescription = this.companyDescription.value;
      this.user.profile.cif = this.cif.value;
    }

    // Se guardan los datos del usuario
    this.store.dispatch(UserAction.updateUser({user: this.user}));
  }

  // Se recoge la pulsación sobre el botón de borrar idioma
  onClickDeleteLanguage(languageId: any): void {
    // Se solicita confirmación de eliminación
    if (confirm('Are you sure to delete this language?')) {
      const languages = this.user.languages;
      const index = this.user.languages.findIndex(language => language.uid === languageId);
      if (index === -1)
      {
        alert('Error language not found');
        return;
      }
      // Se elimina la lengua de la colección
      languages.splice(index, 1);
      // Se actualiza el usuario
      this.store.dispatch(UserAction.deleteUserLanguage({user: this.user}));
    }
  }

  // Se recoge la pulsación sobre el botón de borrar educación
  onClickDeleteEducation(educationId: any): void {
    // Se solicita confirmación de eliminación
    if (confirm('Are you sure to delete this education?')) {
      const educations = this.user.educations;
      const index = this.user.educations.findIndex(education => education.uid === educationId);
      if (index === -1)
      {
        alert('Error education not found');
        return;
      }
      // Se elimina la educación de la colección
      educations.splice(index, 1);
      // Se actualiza el usuario
      this.store.dispatch(UserAction.deleteUserEducation({user: this.user}));
    }
  }
}
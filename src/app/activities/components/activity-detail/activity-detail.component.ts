import { Component, EventEmitter, OnInit, Input, Output, OnChanges } from '@angular/core';
import { Activity } from '../../models/activity';
import { userTypes } from 'src/app/shared/enums/public-enums';
import { Router} from '@angular/router';
import { ValidatorFn, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { activityStates, FilterType } from 'src/app/shared/enums/public-enums';
import { AppState } from 'src/app/app.reducers';
import { Store } from '@ngrx/store';
import { UserState } from '../../../profile/reducers';
import * as UserAction from '../../../profile/actions';

@Component({
  selector: 'app-activity-detail',
  templateUrl: './activity-detail.component.html',
  styleUrls: ['./activity-detail.component.css']
})
export class ActivityDetailComponent implements OnInit {
  @Input() activity: Activity;
  @Input() eFilterType: FilterType;

  @Output() signUpActivity = new EventEmitter<any>();
  @Output() deleteSignUpActivity = new EventEmitter<any>();
  @Output() deleteFavorites = new EventEmitter<any>();

  userState$: UserState;

  rForm: FormGroup;
  idActivitiesUserFavorites: number[];

  constructor(public router: Router, private store: Store<AppState>)
  {
    this.store.select('user').subscribe(user => this.userState$ = user);
  }

  ngOnInit(): void {}

  ngOnChanges() {
    // Se carga la información de la actividad (@Input activity) pasada desde el componente activity-list
    this.loadFormInstance();
  }

  public loadFormInstance(): void {
    this.rForm = new FormGroup({
      name: new FormControl(this.activity?.name),
      category: new FormControl(this.activity?.category),
      subcategory: new FormControl(this.activity?.subcategory),
      description: new FormControl(this.activity?.description),
      language: new FormControl(this.activity?.language),
      date: new FormControl(this.activity?.date),
      price: new FormControl(this.activity?.price),
      miniumCapacity: new FormControl(this.activity?.miniumCapacity),
      limitCapacity: new FormControl(this.activity?.limitCapacity),
      peopleRegistered: new FormControl(this.activity?.peopleRegistered),
      state: new FormControl(this.activity?.state),
      myActivitySignUpVisible: new FormControl(false),
      saveFavoritesVisible: new FormControl(false),
      deleteFavoritesVisible: new FormControl(false),
      myActivityDeleteVisible: new FormControl(false)
    });
    // Si hay un usuario logado y tiene el perfil de turista
    // se muestran los botones de sign up y save favorites
    const idLoggedUser = this.userState$.user?.id;
    if ((this.userState$.user !== null) && (this.userState$.user?.profile.type === userTypes.Tourist.toString()))
    {
      // Se obtienen la lista de actividades favoritas del usuario de la memoria local
      this.idActivitiesUserFavorites = this.userState$.user?.profile.favorites;
      // Si la información de las actividades se visualiza desde la opción "My activities" (@Input() eFilterType)
      if (this.eFilterType === FilterType.myActivitiesFilter.toString())
      {
        // Se habilita el botón de eliminar el registro a la actividad
        this.rForm.controls.myActivityDeleteVisible.setValue(true);
      }
      // Si la información de las actividades se visualiza desde la opción "Favorites" (@Input() eFilterType)
      else if (this.eFilterType === FilterType.favoritesFilter.toString())
      {
        // Se habilita el botón de eliminar la selección favorita de la actividad
        this.rForm.controls.deleteFavoritesVisible.setValue(true);
      }
      // En caso de visualizarse desde la opción de actividades sin filtro
      // si el usuario logado tiene un perfil Tourist
      else
      {
        // Se muestra el botón de sign Up y favorites en caso de que no estén cubiertas las plazas disponibles
        // y que el usuario no esté ya apuntado en la actividad
        if ((this.activity.peopleRegistered < this.activity.limitCapacity) &&
            (!this.activity.signUpUsers.includes(idLoggedUser)))
        {
          this.rForm.controls.myActivitySignUpVisible.setValue(true);
        }
        // Si el usuario no tiene la actividad como favorita
        // se muestra el botón de añadir a favoritos
        const foundIndex = this.idActivitiesUserFavorites.findIndex(x => x === this.activity.id);
        if (foundIndex === -1) {
          this.rForm.controls.saveFavoritesVisible.setValue(true);
        }
      }
    }
  }

  // Se recoge la pulsación sobre el botón de logout
   onClickSignUP(): void {
    const idLoggedUser = this.userState$.user?.id;
    // Se comprueba que el usuario no esté apuntado a la actividad
    if (this.activity.signUpUsers.includes(idLoggedUser))
    {
      alert('The user is already signed up for the activity');
    }
    else
    {
      this.activity.signUpUsers.push(idLoggedUser);
      this.activity.peopleRegistered = this.activity.peopleRegistered + 1;
      this.rForm.controls.peopleRegistered.setValue(this.activity.peopleRegistered);
      // Si se alcanza el número máximo de persona aputadas se cambia el estado de la actividad
      if (this.activity.peopleRegistered === this.activity.limitCapacity)
      {
        this.activity.state = activityStates.Complete;
      }
      // Se cambia la visibilidad de los botones
      this.rForm.controls.myActivitySignUpVisible.setValue(false);
      // Se emite el evento
      this.signUpActivity.emit(this.activity);
    }
  }

  // Se recoge la pulsación sobre el botón de save favorites
  onClickSaveFavorites(): void {
    // Si no se encuentra la actividad en el array de actividades favoritas del usuario
    const foundIndex = this.idActivitiesUserFavorites.findIndex(x => x === this.activity.id);
    if (foundIndex === -1) {
      // Se añade la actividad en la lista de favoritos del usuario
      this.idActivitiesUserFavorites.push(this.activity.id);
      // Se guarda la información en la memoria local
      this.store.dispatch(UserAction.setFavoriteUserActivitiesStorage({user: this.userState$.user,
        favoriteActivitiesUser: this.idActivitiesUserFavorites}));
    }
    // Se esconde el botón favorites
    this.rForm.controls.saveFavoritesVisible.setValue(false);
  }

  // Se recoge la pulsación sobre el botón de delete favorites
  onClickDeleteFavorites(): void {
    // Se borra la actividad del listado de favoritos del usuario
    // Si no se encuentra la actividad en el array de actividades favoritas del usuario
    const foundIndex = this.idActivitiesUserFavorites.findIndex(x => x === this.activity.id);
    if (foundIndex !== -1) {
      // Se quita la actividad de la lista de favoritos del usuario
      this.idActivitiesUserFavorites.splice(foundIndex, 1);
      // Se guarda la información en la memoria local
      // Se guarda la información en la memoria local
      this.store.dispatch(UserAction.setFavoriteUserActivitiesStorage({user: this.userState$.user,
        favoriteActivitiesUser: this.idActivitiesUserFavorites}));
    }
    // Se borra la información del detalle de la actividad
    this.activity = null;
    this.deleteFavorites.emit(this.activity);
  }

  // Se recoge la pulsación sobre el botón de delete
  onClickDelete(): void {
    if (confirm('Are you sure to unsubcribe from this activity?')) {
      const idLoggedUser = this.userState$.user?.id;

      const index = this.activity.signUpUsers.findIndex(idUser => idUser === idLoggedUser);
      if (index === -1)
      {
        alert('Error user not found');
        return;
      }
      this.activity.signUpUsers.splice(index, 1);
      // Se resta uno al contador de personas registradas en la actividad
      this.activity.peopleRegistered = this.activity.peopleRegistered - 1;
      // Si se desregistra de la actividad un usuario, se comprueba que la actividad no estuviese completa
      if (this.activity.state === activityStates.Complete)
      {
        this.activity.state = activityStates.Places_available;
      }
      // Se emite el evento
      this.deleteSignUpActivity.emit(this.activity);
      // Se borra la información del detalle de la actividad
      this.activity = null;
    }
  }
}

import { getLoginUser, getLoginUserSuccess, getLoginUserFailure, formatUserSuccess,
        createUser, createUserSuccess, createUserFailure,
        updateUser, updateUserSuccess, updateUserFailure,
        getFavoriteUserActivitiesStorageSuccess, getFavoriteUserActivitiesStorageFailure,
        setFavoriteUserActivitiesStorage, setFavoriteUserActivitiesStorageSuccess, setFavoriteUserActivitiesStorageFailure,
        updateUserEducation, updateUserEducationSuccess, updateUserEducationFailure,
        deleteUserEducation, deleteUserEducationSuccess, deleteUserEducationFailure,
        addUserEducation, addUserEducationSuccess, addUserEducationFailure,
        updateUserLanguage, updateUserLanguageSuccess, updateUserLanguageFailure,
        deleteUserLanguage, deleteUserLanguageSuccess, deleteUserLanguageFailure,
        addUserLanguage, addUserLanguageSuccess, addUserLanguageFailure} from '../actions';
import { createReducer, on } from '@ngrx/store';
import { User } from '../models/user';

export interface UserState {
    user: User;
    error: string | null;
    pending: boolean;
}

export const initialState: UserState = {
    user: null,
    error: null,
    pending: false
};

const _userReducer = createReducer(
    initialState,
    on(getLoginUser, (state) => ({
        ...state,
        error: null,
        pending: true,
    })),
    on(getLoginUserSuccess, (state, action) => ({
        ...state,
        user: action.user,
        error: null,
        pending: false,
    })),
    on(getLoginUserFailure, (state, { payload }) => ({
        ...state,
        error: {
            url: payload.url,
            status: payload.status,
            message: payload.message
        },
        pending: false,
    })),
    on(updateUser, (state) => ({
        ...state,
        error: null,
        pending: true,
    })),
    on(updateUserSuccess, (state, action) => ({
        ...state,
        user: action.user,
        error: null,
        pending: false,
    })),
    on(updateUserFailure, (state, { payload }) => ({
        ...state,
        error: {
            url: payload.url,
            status: payload.status,
            message: payload.message
        },
        pending: false,
    })),
    on(createUser, (state) => ({
        ...state,
        error: null,
        pending: true,
    })),
    on(createUserSuccess, (state, action) => ({
        ...state,
        user: action.user,
        error: false,
        pending: false
    })),
    on(createUserFailure, (state, { payload }) => ({
        ...state,
        error: {
            url: payload.url,
            status: payload.status,
            message: payload.message
        },
        pending: false,
    })),
    on(getFavoriteUserActivitiesStorageSuccess, (state, action) => ({
        ...state,
        user:
        {
            ...state.user,
            profile: {
                ...state.user.profile,
                favorites: action.favoriteActivitiesUser
            }
        },
        error: false,
        pending: false
    })),
    on(getFavoriteUserActivitiesStorageFailure, (state, { payload }) => ({
        ...state,
        error: {
            url: payload.url,
            status: payload.status,
            message: payload.message
        },
        pending: false,
    })),
    on(setFavoriteUserActivitiesStorage, (state) => ({
        ...state,
        error: null,
        pending: true,
    })),
    on(setFavoriteUserActivitiesStorageSuccess, (state, action) => ({
        ...state,
        user: {
            ...state.user,
            profile: {
                ...state.user.profile,
                favorites: action.favoriteActivitiesUser
            }
        },
        error: null,
        pending: false
    })),
    on(setFavoriteUserActivitiesStorageFailure, (state, { payload }) => ({
        ...state,
        error: {
            url: payload.url,
            status: payload.status,
            message: payload.message
        },
        pending: false,
    })),
    on(deleteUserLanguage, (state) => ({
        ...state,
        error: null,
        pending: true,
    })),
    on(deleteUserLanguageSuccess, (state, action) => ({
        ...state,
        user: action.user,
        error: null,
        pending: false,
    })),
    on(deleteUserLanguageFailure, (state, { payload }) => ({
        ...state,
        error: {
            url: payload.url,
            status: payload.status,
            message: payload.message
        },
        pending: false,
    })),
    on(deleteUserLanguage, (state) => ({
        ...state,
        error: null,
        pending: true,
    })),
    on(deleteUserLanguageSuccess, (state, action) => ({
        ...state,
        user: action.user,
        error: null,
        pending: false,
    })),
    on(deleteUserLanguageFailure, (state, { payload }) => ({
        ...state,
        error: {
            url: payload.url,
            status: payload.status,
            message: payload.message
        },
        pending: false,
    })),
    on(updateUserLanguage, (state) => ({
        ...state,
        error: null,
        pending: true,
    })),
    on(updateUserLanguageSuccess, (state, action) => ({
        ...state,
        user: action.user,
        error: null,
        pending: false,
    })),
    on(updateUserLanguageFailure, (state, { payload }) => ({
        ...state,
        error: {
            url: payload.url,
            status: payload.status,
            message: payload.message
        },
        pending: false,
    })),
    on(addUserLanguage, (state) => ({
        ...state,
        error: null,
        pending: true,
    })),
    on(addUserLanguageSuccess, (state, action) => ({
        ...state,
        user: action.user,
        error: null,
        pending: false,
    })),
    on(addUserLanguageFailure, (state, { payload }) => ({
        ...state,
        error: {
            url: payload.url,
            status: payload.status,
            message: payload.message
        },
        pending: false,
    })),
    on(addUserEducation, (state) => ({
        ...state,
        error: null,
        pending: true,
    })),
    on(addUserEducationSuccess, (state, action) => ({
        ...state,
        user: action.user,
        error: null,
        pending: false,
    })),
    on(addUserEducationFailure, (state, { payload }) => ({
        ...state,
        error: {
            url: payload.url,
            status: payload.status,
            message: payload.message
        },
        pending: false,
    })),
    on(updateUserEducation, (state) => ({
        ...state,
        error: null,
        pending: true,
    })),
    on(updateUserEducationSuccess, (state, action) => ({
        ...state,
        user: action.user,
        error: null,
        pending: false,
    })),
    on(updateUserEducationFailure, (state, { payload }) => ({
        ...state,
        error: {
            url: payload.url,
            status: payload.status,
            message: payload.message
        },
        pending: false,
    })),
    on(deleteUserEducation, (state) => ({
        ...state,
        error: null,
        pending: true,
    })),
    on(deleteUserEducationSuccess, (state, action) => ({
        ...state,
        user: action.user,
        error: null,
        pending: false,
    })),
    on(deleteUserEducationFailure, (state, { payload }) => ({
        ...state,
        error: {
            url: payload.url,
            status: payload.status,
            message: payload.message
        },
        pending: false,
    })),
    on(formatUserSuccess, () => initialState)
);

export function userReducer(state, action) {
    return _userReducer(state, action);
}

/**
 * Created by jamal on 7/3/2018.
 */
export class ImageModel{
    private _userId: number;
    /////// DEMOGRAPHY
    private _profileId: number;
    private _profileImg: File;
    ///////////////// INSURANCE
    private _insuranceId: number;
    private _photoFront: File;
    private _photoBack: File;

    private _photo: File;
    private _file: File;


    constructor() {
    }

    get userId(): number {
        return this._userId;
    }

    set userId(value: number) {
        this._userId = value;
    }

    get profileId(): number {
        return this._profileId;
    }

    set profileId(value: number) {
        this._profileId = value;
    }

    get profileImg(): File {
        return this._profileImg;
    }

    set profileImg(value: File) {
        this._profileImg = value;
    }

    get insuranceId(): number {
        return this._insuranceId;
    }

    set insuranceId(value: number) {
        this._insuranceId = value;
    }

    get photoFront(): File {
        return this._photoFront;
    }

    set photoFront(value: File) {
        this._photoFront = value;
    }

    get photoBack(): File {
        return this._photoBack;
    }

    set photoBack(value: File) {
        this._photoBack = value;
    }

    get photo(): File {
        return this._photo;
    }

    set photo(value: File) {
        this._photo = value;
    }

    get file(): File {
        return this._file;
    }

    set file(value: File) {
        this._file = value;
    }
}
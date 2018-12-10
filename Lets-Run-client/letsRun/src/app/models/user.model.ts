export interface UserModel {
    id: string,
    email: string,
    username: string,
    imagePath: string,
    firstName: string,
    lastName: string,
    createdAt: Date,
    dob: Date,
    comment?: [string],
    likedEvent?: [string],
    createdEvent?: [string],
    blackList?: [string],
    friendList?: [string]
}
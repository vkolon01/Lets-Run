export interface UserModel {
    id: string,
    email: string,
    username: string,
    imagePath: string,
    firstName: string,
    lastName: string,
    createdAt: Date,
    dob: Date,
    invitesToPrivateEvent?: string[],
    comment?: [string],
    likedEvent?: [string],
    createdEvent?: [string],
    eventWillAttempt?: [string],
    blackList?: [string],
    followers?: [string],
    following?: [string]
}
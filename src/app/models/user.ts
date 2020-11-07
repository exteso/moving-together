export class User {
  constructor(
    public userId: string,
    public email: string,
    public firstName: string,
    public lastName: string,
    public providerId: string,
    public providerUserId: string,
    public teamId: string,
    public photo: string
  ) { }
}

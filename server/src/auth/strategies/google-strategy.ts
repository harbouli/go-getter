import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { Services } from 'src/utils/constant';
import { IGoogleAuthService } from '../interfaces/google-auth.interface';
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(Services.AUTH_GOOGLE_SERVICE)
    private readonly googleAuthService: IGoogleAuthService,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URL,
      scope: ['profile', 'email'],
    });
  }
  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    // console.log(profile);

    const email = profile.emails[0].value;
    const firstName = profile.name.familyName;
    const lastName = profile.name.givenName;

    const accessUser = await this.googleAuthService.validateUser({
      firstName,
      lastName,
      email,
    });
    console.log('User Valid');
    return accessUser || null;
  }
}

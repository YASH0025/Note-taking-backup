// import { Test, TestingModule } from '@nestjs/testing'
// import { DatabaseModule } from '../common/database/database.module'
// import { UsersProviders } from '../users/users.providers'
// import { JwtModule, JwtService } from '@nestjs/jwt'
// import { MailerModule } from '@nestjs-modules/mailer'

// import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter'
// import { CommonFunctions } from '../common/common_functions/commonfunctions'
// import { Model } from 'mongoose'
// import { UsersService } from '../users/users.service'
// import { GoogleVerificationService } from './verify-googleuser'
// import { FacebookVerificationService } from './verify-facebookuser'
// import { AuthService } from './auth.service'

// import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter'
// import { CommonFunctions } from '../common/common_functions/commonfunctions'

describe('AuthService', () => {
  // let service: AuthService

  beforeEach(async () => {
    // const module: TestingModule = await Test.createTestingModule({
    //   providers: [AuthService, ...UsersProviders,CommonFunctions],
    //   imports: [MailerModule.forRoot({
    //     transport: {
    //       host: process.env.HOST,
    //       port: process.env.HOST_PORT,
    //       ignoreTLS: true,
    //       secure: true,
    //       auth: {
    //         user: process.env.HOST_USER,
    //         pass: process.env.HOST_PASSWORD
    //       },
    //     },
    //     defaults: {
    //       from: `"nest-modules" <${process.env.HOST_USER}>`,
    //     },
    //     template: {
    //       dir: __dirname + '/templates',
    //       adapter: new EjsAdapter(),
    //       options: {
    //         strict: true,
    //       },
    //     },
    //   }),DatabaseModule,JwtModule.register({
    //     secret: '2zaud8GhCgtOjrytwuRlSDnMteHhdvGBhW3qCj911zy5hBanklDjWBSOXOZ4d2Lm',
    //     signOptions: { expiresIn: '9h' }
    //   })]
    // }).compile()
    // service = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    // expect(service).toBeDefined()
  })

  // describe('AuthService', () => {
  //   let service: AuthService;
  //   let jwtServiceMock: JwtService;
  //   let userModelMock: Model<any>;

  //   beforeEach(async () => {
  //     jwtServiceMock = {
  //       signAsync: jest.fn(),
  //       verifyAsync: jest.fn(),
  //     } as any;

  //     userModelMock = {} as any;

  //     const module: TestingModule = await Test.createTestingModule({
  //       providers: [
  //         AuthService,
  //         {
  //           provide: JwtService,
  //           useValue: jwtServiceMock,
  //         },
  //         {
  //           provide: 'USER_MODEL',
  //           useValue: userModelMock,
  //         },
  //         UsersService,
  //       ],
  //     }).compile();

  //     service = module.get<AuthService>(AuthService);
  //   });

  //   it('should be defined', () => {
  //     expect(service).toBeDefined();
  //   });

  //   describe('Google Authentication', () => {
  //     it('should find or create a Google user', async () => {
  //       jest.spyOn(service['commonFunctions'], 'sendEmail').mockResolvedValue(undefined);
  //       jest.spyOn(service['commonFunctions'], 'renderWithData').mockResolvedValue('<h1>Mocked HTML</h1>');
  //       jest.spyOn(service['mongooseFunction'], 'findOne').mockResolvedValue(null);
  //       jest.spyOn(GoogleVerificationService, 'verifyAccessToken').mockResolvedValue({
  //         email: 'tony@gmail.com',
  //         profile: {
  //           name: 'Tony Stark',
  //         },
  //       });

  //       const accessToken = 'mockedGoogleAccessToken';
  //       const result = await service.findOrCreateGoogleUser(accessToken);

  //       expect(result).toBeDefined();
  //       expect(result.email).toBe('tony@gmail.com');
  //       expect(result.fullName).toBe('Tony Stark');
  //       expect(result.isVerified).toBe(true);
  //     });

  //     it('should handle user not found during Google authentication', async () => {
  //       jest.spyOn(service['mongooseFunction'], 'findOne').mockResolvedValue(null);
  //       jest.spyOn(GoogleVerificationService, 'verifyAccessToken').mockResolvedValue({
  //         email: 'nonExistingUser@example.com',
  //         profile: {
  //           name: 'Non Existing User',
  //         },
  //       });

  //       const accessToken = 'nonExistingAccessToken';
  //       const result = await service.findOrCreateGoogleUser(accessToken);

  //       expect(result).toBeNull();
  //     });
  //   });

  //   describe('Facebook Authentication', () => {
  //     it('should find or create a Facebook user', async () => {
  //       jest.spyOn(service['commonFunctions'], 'sendEmail').mockResolvedValue(undefined);
  //       jest.spyOn(service['commonFunctions'], 'renderWithData').mockResolvedValue('<h1>Mocked HTML</h1>');
  //       jest.spyOn(service['mongooseFunction'], 'findOne').mockResolvedValue(null);
  //       jest.spyOn(FacebookVerificationService, 'verifyAccessToken').mockResolvedValue({
  //         profile: {
  //           email: 'tony@gmail.com',
  //           name: 'Tony Stark',
  //         },
  //       });

  //       const accessToken = 'mockedFacebookAccessToken';
  //       const result = await service.findOrCreateFacebookUser(accessToken);

  //       expect(result).toBeDefined();
  //       expect(result.email).toBe('tony@gmail.com');
  //       expect(result.fullName).toBe('Tony Stark');
  //       expect(result.isVerified).toBe(true);
  //     });

  //     it('should handle user not found during Facebook authentication', async () => {
  //       jest.spyOn(service['mongooseFunction'], 'findOne').mockResolvedValue(null);
  //       jest.spyOn(FacebookVerificationService, 'verifyAccessToken').mockResolvedValue({
  //         profile: {
  //           email: 'nonExistingUser@example.com',
  //           name: 'Non Existing User',
  //         },
  //       });

  //       const accessToken = 'nonExistingAccessToken';
  //       const result = await service.findOrCreateFacebookUser(accessToken);

  //       expect(result).toBeNull();
  //     });
  //   });
})

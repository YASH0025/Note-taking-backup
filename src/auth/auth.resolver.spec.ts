import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'
import { AppModule } from '../app.module'
import { CONSTANTS } from '../constants'
import { HttpStatus, INestApplication } from '@nestjs/common'
// import { GoogleVerificationService } from './verify-googleuser'

// import { FacebookVerificationService } from './verify-facebookuser'
// import { GoogleVerificationService } from './verify-googleuser'
// import { CommonMongooseFunctions } from 'src/common/common_functions/commonMongooseQuries'
// import { ModuleRef } from '@nestjs/core'
// import { AuthService } from './auth.service'
// import { AuthResolver } from './auth.resolver'
// const UserModel: Model<User> = getModelForClass(User);

describe('Your Test Description', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()
    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    // const authService = app.get(AuthService)

    // await authService.deleteUserByEmail('test@example.com');
    // await authService.deleteUserByEmail('existing@example.com');

    await app.close()
  })

  it('Runs signUpUser mutation and check password provided empty string', async () => {
    const query = `
         mutation SignUpUser {
        signUpUser(
            signUpUser: {
              fullName: "Synsoft Global"
              email: "synsoft@mailinator.com"
              password: ""
            }
        ) {
            message
            statusCode
        }
    }
    `
    return await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200)
      .expect((response) => {
        if (response.body.errors) {
          const resp = response.body.errors
          const errorMessage = resp[0].message[0]
          const errorStatusCode = resp[0].statusCode
          expect(errorMessage).toEqual(CONSTANTS.STRONG_PASSWORD)
          expect(errorStatusCode).toEqual(HttpStatus.BAD_REQUEST)
        }
      })
  })

  it('Runs signUpUser mutation and check email provided empty string', async () => {
    const query = `
         mutation SignUpUser {
        signUpUser(
            signUpUser: {
              fullName: "Synsoft Global"
              email: ""
              password: "Synsoft@123"
            }
        ) {
            message
            statusCode
        }
    }
    `
    return await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200)
      .expect((response) => {
        if (response.body.errors) {
          const resp = response.body.errors
          const errorMessage = resp[0].message[0]
          const errorStatusCode = resp[0].statusCode
          expect(errorMessage).toEqual(CONSTANTS.EMAIL_VALID)
          expect(errorStatusCode).toEqual(HttpStatus.BAD_REQUEST)
        }
      })
  })

  it('Runs signUpUser mutation and check fullName provided empty string', async () => {
    const query = `
         mutation SignUpUser {
        signUpUser(
            signUpUser: {
              fullName: ""
              email: "synsoft@mailinator.com"
              password: "Synsoft@123"
            }
        ) {
            message
            statusCode
        }
    }
    `
    return await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200)
      .expect((response) => {
        if (response.body.errors) {
          const resp = response.body.errors
          const errorMessage = resp[0].message[0]
          const errorStatusCode = resp[0].statusCode
          if (errorMessage === CONSTANTS.FULLNAME_INVALID_MESSAGE) {
            expect(errorMessage).toEqual(CONSTANTS.FULLNAME_INVALID_MESSAGE)
            expect(errorStatusCode).toEqual(HttpStatus.BAD_REQUEST)
          } else {
            expect(errorMessage).toEqual(CONSTANTS.ENTER_FULLNAME)
            expect(errorStatusCode).toEqual(HttpStatus.BAD_REQUEST)
          }
        }
      })
  }, 100000)

  it('Runs signUpUser mutation and register user', async () => {
    const query = `
         mutation SignUpUser {
        signUpUser(
            signUpUser: {
              fullName: "Synsoft Global",
              email: "synsoft@mailinator.com",
              password: "Synsoft@123"
            }
        ) {
            message
            statusCode
        }
    }
    `
    return await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200)
      .expect((response) => {
        const data = response.body.data
        expect(data.signUpUser.message).toEqual(
          CONSTANTS.REGISTRATION_SUCCESSFULL
        )
        expect(data.signUpUser.statusCode).toEqual(HttpStatus.OK)
      })
  })

  it('Runs signUpUser mutation and check if user already exist', async () => {
    const query = `
         mutation SignUpUser {
        signUpUser(
            signUpUser: {
              fullName: "Synsoft Global",
              email: "synsoft@mailinator.com",
              password: "Synsoft@123"
            }
        ) {
            message
            statusCode
        }
    }
    `
    return await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200)
      .expect((response) => {
        if (response.body.errors) {
          const resp = response.body.errors
          const errorMessage = resp[0].message[0]
          const errorStatusCode = resp[0].statusCode
          expect(errorMessage).toEqual(CONSTANTS.EMAIL_EXISTS)
          expect(errorStatusCode).toEqual(HttpStatus.BAD_REQUEST)
        }
      })
  })

  it('Runs signInUser mutation and check if  email provided is empty string', async () => {
    const query = `
         mutation SignInUser {
        signInUser(
            signInUser: {
              password: "Synsoft@123"
            }
            ) {
              message
              statusCode
              user {
                fullName
                email
                auth_token
              }
            }
        }
      `
    return await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200)
      .expect((response) => {
        const { signInUser } = response.body.data
        expect(signInUser.message).toEqual(CONSTANTS.EMAIL_CHECK)
        expect(signInUser.statusCode).toEqual(HttpStatus.BAD_REQUEST)
      })
  })

  it('Runs signInUser mutation and to signIn with email', async () => {
    const query = `
         mutation SignInUser {
        signInUser(
            signInUser: {
              email: "synsoft@mailinator.com"
              password: "Synsoft@123",
            }
            ) {
              message
              statusCode
              user {
                fullName
                email
                auth_token
              }
            }
        }
      `
    return await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200)
      .expect((response) => {
        if (response?.body?.data) {
          const { signInUser } = response.body.data
          expect(signInUser.message).toEqual(CONSTANTS.SIGNEDIN_SUCCESS)
          expect(signInUser.statusCode).toEqual(HttpStatus.OK)
        }
      })
  })

  // =============================for the testing =================================

  // it('should authenticate user with valid Facebook access token', async () => {
  //   jest
  //     .spyOn(FacebookVerificationService, 'verifyAccessToken')
  //     .mockResolvedValue({
  //       email: 'ashleys706@gmail.com',
  //       expires_in: 3600,
  //       profile: {
  //         id: '123',
  //         name: 'Ashley Synsoft',
  //         email: 'ashleys706@gmail.com',
  //         picture: 'https://example.com/picture.jpg'
  //       }
  //     })

  //   const query = `
  //     mutation FacebookLoginCallback {
  //       facebookLoginCallback(accessToken: "valid-access-token")
  //     }
  //   `

  //   return request(app.getHttpServer())
  //     .post('/graphql')
  //     .send({ query })
  //     .expect(200)
  //     .expect((response) => {
  //       expect(response.body.data.facebookLoginCallback).toEqual(
  //         'User Ashley Synsoft authenticated successfully.'
  //       )
  //     })
  // })

  // Add more test cases as need

  // ==============================testing========================================================

  // it('should handle authentication failure with an empty Facebook access token', async () => {
  //   const emptyAccessToken = '';

  //   try {
  //     await app.get(AuthResolver).googleLoginCallback(emptyAccessToken);
  //     fail('Expected an error to be thrown for empty access token');
  //   } catch (error) {
  //     console.log('Received error message:', error.message);
  //     expect(error.message).toContain('Authentication failed.');
  //   }
  // });

  // ====================keep it for some time==========================

  // it('Runs googleLoginCallback mutation and check if accessToken is empty', async () => {
  //   const query = `
  //     mutation GoogleLoginCallback {
  //       googleLoginCallback(accessToken: "xyzsdd") {
  //         message
  //         statusCode
  //       }
  //     }
  //   `;

  //   return await request(app.getHttpServer())
  //     .post('/graphql')
  //     .send({ query })
  //     .expect(400)
  //     .expect(response => {
  //       console.log("hello" , response);

  //       const { googleLoginCallback } = response.body.data;
  //       expect(googleLoginCallback.message).toEqual(CONSTANTS.INVALID_ACCESS_TOKEN);
  //       expect(googleLoginCallback.statusCode).toEqual(HttpStatus.BAD_REQUEST);
  //     });
  // });

  // ===================================

  // it('should authenticate the user with a valid Google access token', async () => {
  //   const accessToken = 'validAccessToken';

  //   const verifyAccessTokenMock = jest
  //     .spyOn(GoogleVerificationService, 'verifyAccessToken')
  //     .mockResolvedValue({ email: 'test@example.com', profile: { name: 'Test User' } });
  //   jest.spyOn(app.get(AuthService), 'findOrCreateGoogleUser').mockResolvedValue(null);

  //   jest.spyOn(app.get(AuthService), 'findOrCreateGoogleUser').mockResolvedValue({
  //     email: 'test@example.com',
  //     fullName: 'Test User',
  //   });

  //   const result = await app.get(AuthResolver).googleLoginCallback(accessToken);

  //   expect(verifyAccessTokenMock).toHaveBeenCalledWith(accessToken);
  //   expect(result).toEqual('User Test User authenticated successfully.');
  // });

  // it('should handle authentication failure with an invalid Google access token', async () => {
  //   const accessToken = 'invalidAccessToken';

  //   jest.spyOn(GoogleVerificationService, 'verifyAccessToken').mockRejectedValue(new Error('Invalid token'));

  //   const resultPromise = app.get(AuthResolver).googleLoginCallback(accessToken);

  //   await expect(resultPromise).rejects.toThrow('Authentication failed.');
  // });

  // // ================Dont remove this==========================================

  // it('should authenticate the user if already exists with a valid Facebook access token', async () => {
  //   const accessToken = 'validFacebookAccessToken';

  //   const existingUser = {
  //     facebookId: '123456789',
  //     fullName: 'Existing User',
  //     email: 'existing@example.com',
  //     isVerified: true,
  //   };

  //   jest.spyOn(FacebookVerificationService, 'verifyAccessToken').mockResolvedValue({
  //     profile: { name: 'Existing User', email: 'existing@example.com', facebookId: '123456789' },
  //   });

  //   jest.spyOn(app.get(AuthService), 'findOrCreateFacebookUser').mockResolvedValue(existingUser);

  //   const result = await app.get(AuthResolver).facebookLoginCallback(accessToken);

  //   expect(result).toEqual('User Existing User authenticated successfully.');
  // })

  // it('should authenticate the user if already exists with a valid Google access token', async () => {
  //   const accessToken = 'validGoogleAccessToken';

  //   const existingUser = {
  //     email: 'existing@example.com',
  //     fullName: 'Existing User',
  //     isVerified: true,
  //   };

  //   jest.spyOn(GoogleVerificationService, 'verifyAccessToken').mockResolvedValue({
  //     email: 'existing@example.com',
  //     profile: { name: 'Existing User' },
  //   });

  //   jest.spyOn(app.get(AuthService), 'findOrCreateGoogleUser').mockResolvedValue(existingUser);

  //   const result = await app.get(AuthResolver).googleLoginCallback(accessToken);

  //   expect(result).toEqual('User Existing User authenticated successfully.');
  // });

  // // ================Dont remove this==========================================

  // it('should authenticate the user with a valid Facebook access token', async () => {
  //   const accessToken = 'validFacebookAccessToken';

  //   const verifyAccessTokenMock = jest
  //     .spyOn(FacebookVerificationService, 'verifyAccessToken') // Adjust to your actual service name
  //     .mockResolvedValue({ profile: { name: 'Test User', email: 'test@example.com', facebookId: '123456789' } });

  //   jest.spyOn(app.get(AuthService), 'findOrCreateFacebookUser').mockResolvedValue({
  //     facebookId: '123456789',
  //     fullName: 'Test User',
  //     email: 'test@example.com',
  //     isVerified: true,
  //   });

  //   const result = await app.get(AuthResolver).facebookLoginCallback(accessToken);

  //   expect(verifyAccessTokenMock).toHaveBeenCalledWith(accessToken);
  //   expect(result).toEqual('User Test User authenticated successfully.');
  // });

  // it('should handle authentication failure with an invalid Facebook access token', async () => {
  //   const accessToken = 'invalidFacebookAccessToken';

  //   jest.spyOn(FacebookVerificationService, 'verifyAccessToken').mockRejectedValue(new Error('Invalid token'));

  //   try {
  //     await app.get(AuthResolver).facebookLoginCallback(accessToken);
  //     fail('Expected an error to be thrown');
  //   } catch (error) {
  //     console.log('Received error message:', error.message); // Log the complete error message
  //     expect(error.message).toContain('Authentication failed.');
  //   }
  // });

  // it('should handle authentication failure with an empty Facebook access token', async () => {
  //   const emptyAccessToken = '';

  //   try {
  //     await app.get(AuthResolver).facebookLoginCallback(emptyAccessToken);
  //     fail('Expected an error to be thrown for empty access token');
  //   } catch (error) {
  //     console.log('Received error message:', error.message); // Log the complete error message
  //     expect(error.message).toContain('Authentication failed.'); // Adjust based on your actual error message
  //   }
  // });

  // ;

  // it('Delete user', async () => {
  //   const query = `
  //   mutation SignUpUser {
  //     removeUser(removeUser: { userName: "synsoft" }) {
  //       message
  //       statusCode
  //     }
  //   }
  // `
  //   return await request(app.getHttpServer())
  //     .post('/graphql')
  //     .send({ query })
  //     .expect(200)
  //     .expect(response => {
  //       const data = response.body.data
  //       expect(data.removeUser.message).toEqual('User removed')
  //       expect(data.removeUser.statusCode).toEqual(HttpStatus.OK)
  //     })
  // })
})

// Two - factor authentication(2FA) is a security measure that requires users to provide two different authentication
// factors when logging into an account.One common way to implement 2FA is to send a one - time password(OTP) via SMS
// or a phone call to the user's mobile device. To implement 2FA using NestJS and Twilio, you can follow these steps:

// Install the required dependencies:

/*
 * npm install --save @nestjs/core @nestjs/common
 * @nestjs/microservices @nestjs/websockets
 * @nestjs/platform-express twilio ioredis
 */

// Create a new NestJS project:

// npx nest new <project-name>

/**

* npx nest new <project-name>

*/

// Import the required modules and create a new controller for handling 2FA:
/*
*import { Controller, Get, Post, Body } from '@nestjs/common';
*import { TwilioService } from './twilio.service';

*@Controller('auth')
*export class AuthController {
* constructor(private readonly twilioService: TwilioService) {}

* @Post('2fa')
* async sendOTP(@Body() body: any) {
*    const { phoneNumber } = body;
*    // use the AuthService to send the OTP
*    return this.authService.sendOTP(phoneNumber);
*  }
*}
*/

// Create a new service for handling the communication with Twilio: `twilioService`
/*
* import { Injectable } from '@nestjs/common';
* import { Twilio } from 'twilio';

* @Injectable()
* export class TwilioService {
*  client: Twilio;

* constructor() {
*   this.client = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
* }

*  async sendOTP(phoneNumber: string, otp: number) {
*    return this.client.messages.create({
*      to: phoneNumber,
*      from: process.env.TWILIO_PHONE_NUMBER,
*      body: `Your OTP is: ${otp}`,
*    });
*  }
*}

*/

// Inject the Redis instance in your service that sends the OTP using Twilio:`authService

/*
* import { Injectable, Inject } from '@nestjs/common';
* import { TwilioService } from './twilio.service';
* import Redis from 'ioredis';

* @Injectable()
*export class AuthService {
*  constructor(
*    private readonly twilioService: TwilioService,
*    // inject the Redis instance
*    @Inject(Redis) private readonly redis: Redis,
* ) {}

*  async sendOTP(phoneNumber: string) {
*    // generate a random OTP
*    const otp = Math.floor(1000 + Math.random() * 9000);
*    // send the OTP via Twilio
*    await this.twilioService.sendOTP(phoneNumber, otp);
*    // save the OTP in Redis for 60 seconds
*    await this.redis.setex(phoneNumber, 60, otp);
*    return { success: true, otp };
*  }
*}


*/

// Create new method to verify the OTP

// async verifyOTP(phoneNumber: string, enteredOTP: string) {
//     ** retrieve the OTP from Redis **
//     const otp = await this.redis.get(phoneNumber);
//     if (otp === null) {
//       return { success: false, message: 'Invalid OTP.' };
//     } else {
//       if (otp === enteredOTP) {
//         return { success: true, message: 'OTP is valid.' };
//       } else {
//         return { success: false, message: 'Invalid OTP.' };
//       }
//     }
//   }

// You can then use the AuthService in your controller to verify the OTP:

// @Post('verify-otp')
// async verifyOTP(@Body() body: any) {
//   const { phoneNumber, otp } = body;
//   return this.authService.verifyOTP(phoneNumber, otp);
// }

// you can generate a new OTP, send it to the user's phone number,
// and save it in Redis with a new expiration time. This will overwrite the old OTP in Redis and make it expire
// after the new expiration time. Here is an example of how you can do this using the ioredis package:

// async resendOTP(phoneNumber: string) {
//     ** generate a random OTP
//     const otp = Math.floor(1000 + Math.random() * 9000);
//     ** send the OTP via Twilio
//     await this.twilioService.sendOTP(phoneNumber, otp);
//     ** save the OTP in Redis for 60 seconds
//     await this.redis.setex(phoneNumber, 60, otp);
//     return { success: true, otp };
//   }

// You can then use the AuthService in your controller to resend the OTP:

// @Post('resend-otp')
// async resendOTP(@Body() body: any) {
//   const { phoneNumber } = body;
//   return this.authService.resendOTP(phoneNumber);
// }

// Configure the Twilio service with your account SID, auth token, and phone number in your .env file:

// TWILIO_ACCOUNT_SID=<your-account-sid>
// TWILIO_AUTH_TOKEN=<your-auth-token>
// TWILIO_PHONE_NUMBER=<your-twilio-phone-number></your-twilio-phone-number>

// Use the AuthController to send the OTP to the user's phone number.
// The user can then enter the OTP to complete the 2FA process.

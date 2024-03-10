import { IsString, IsNotEmpty } from 'class-validator';

export class NotificationBodyDto {
  @IsString()
  @IsNotEmpty()
  notificationType: string;

  @IsString()
  @IsNotEmpty()
  notificationCode: string;
}

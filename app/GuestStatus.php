<?php

namespace App;

enum GuestStatus: string
{
    case INVITED = 'invited';
    case CONFIRMED = 'confirmed';
    case DECLINED = 'declined';
}

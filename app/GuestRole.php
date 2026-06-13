<?php

namespace App;

enum GuestRole: string
{
    case NORMAL = 'normal';
    case PARTNER_A = 'partner_a';
    case PARTNER_B = 'partner_b';
}

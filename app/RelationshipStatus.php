<?php

namespace App;

enum RelationshipStatus: string
{
    case TOGETHER = 'together';
    case CLOSE = 'close';
    case AWAY = 'away';
    case FAR = 'far';
}

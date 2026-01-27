<?php

namespace App;

enum TaskStatus
{
    case PENDING;
    case IN_PROGRESS;
    case COMPLETED;
}

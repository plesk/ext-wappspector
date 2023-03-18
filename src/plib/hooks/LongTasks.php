<?php

class Modules_Wappspector_LongTasks extends pm_Hook_LongTasks
{
    public function getLongTasks()
    {
        return [
            new \PleskExt\Wappspector\WappspectorTask(),
        ];
    }
}

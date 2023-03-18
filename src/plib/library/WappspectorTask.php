<?php

namespace PleskExt\Wappspector;

class WappspectorTask extends \pm_LongTask_Task
{
    public function run()
    {
        $domains = \pm_Domain::getAllDomains();
        foreach ($domains as $domain) {
            $domain->setSetting('wapp', 'loading');
        }
        foreach ($domains as $domain) {
            sleep(1);
            $domain->setSetting('wapp', 'unknown');
        }
    }
}

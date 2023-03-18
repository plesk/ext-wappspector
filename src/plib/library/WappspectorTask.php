<?php

namespace PleskExt\Wappspector;

class WappspectorTask extends \pm_LongTask_Task
{
    public function getSteps()
    {
        $domains = array_map('intval', $this->getParam('domains', []));
        $loading = array_map('intval', $this->getParam('loading', []));
        return array_combine(
            array_map('strval', $domains),
            array_map(function ($id) use ($loading) {
                $domain = \pm_Domain::getByDomainId($id);
                return [
                    'key' => (string)$id,
                    'title' => $domain->getDisplayName(),
                    'status' => in_array($id, $loading) ? (reset($loading) === $id ? 'running' : 'not_started') : 'done',
                ];
            }, $domains)
        );
    }

    public function run()
    {
        $domains = \pm_Domain::getAllDomains();
        $this->setParam('domains', array_map(function ($domain) {
            return $domain->getId();
        }, $domains));
        $loading = [];
        foreach ($domains as $domain) {
            $domain->setSetting('wapp', '');
            $loading[$domain->getId()] = true;
        }
        $this->setParam('loading', array_keys($loading));

        foreach ($domains as $domain) {
            sleep(10);
            $domain->setSetting('wapp', 'unknown');
            unset($loading[$domain->getId()]);
            $this->setParam('loading', array_keys($loading));
        }
    }
}
